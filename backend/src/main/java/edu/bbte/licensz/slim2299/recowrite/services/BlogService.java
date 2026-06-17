package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.BlogDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.AddBlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.enums.ApproveStatus;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogDateIsInThePastException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.InvalidUrlException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.AllowedHostsManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.PendingBlogsManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.AllowedHostsModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.PendingBlog;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Slf4j
@Service
public class BlogService implements BlogServiceInterface {
    private final BlogManager blogManager;
    private final UserManager userManager;
    private final AllowedHostsManager allowedHostsManager;
    private final PendingBlogsManager pendingBlogsManager;
    private static final String UPLOAD_DIR = Paths.get("").toAbsolutePath() + "/uploads/banners/";
    private final ModelMapper modelMapper;

    @Autowired
    public BlogService(BlogManager blogManager, UserManager userManager, AllowedHostsManager allowedHostsManager, PendingBlogsManager pendingBlogsManager, ModelMapper modelMapper) {
        this.blogManager = blogManager;
        this.userManager = userManager;
        this.allowedHostsManager = allowedHostsManager;
        this.pendingBlogsManager = pendingBlogsManager;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<BlogDtoOut> getAllBlogs() {
        List<BlogDtoOut> blogList = new ArrayList<>();
        for (BlogModel blog : blogManager.findAllByVisible(true)) {
            BlogDtoOut auxDto = createBlogDto(blog);
            blogList.add(auxDto);
        }
        return blogList;
    }

    @Override
    public List<BlogDtoOut> getAllBlogsAsAdmin() {
        // Admins must see all blogs, even the ones that are "deleted"
        log.info("Getting all blogs for an admin");
        List<BlogDtoOut> blogList = new ArrayList<>();
        for (BlogModel blog : blogManager.findAll()) {
            BlogDtoOut auxDto = createBlogDto(blog);
            blogList.add(auxDto);
        }
        return blogList;
    }

    @Override
    public List<BlogDtoOut> getBlogsByAuthor(Long userId) {
        List<BlogDtoOut> blogList = new ArrayList<>();
        Optional<UserModel> userResult = userManager.findById(userId);
        if (userResult.isEmpty()) {
            throw new UserNotFoundException("User with id " + userId + " not found");
        }
        Optional<List<BlogModel>> result = blogManager.findByUserAndVisible(userResult.get(), true);
        if (result.isPresent()) {
            for (BlogModel blog : result.get()) {
                BlogDtoOut auxDto = createBlogDto(blog);
                blogList.add(auxDto);
            }
        }
        return blogList;
    }

    @Override
    public BlogDtoOut getBlogById(long id) {
        Optional<BlogModel> blog = blogManager.findByIdAndVisible(id, true);
        if (blog.isPresent()) {
            return createBlogDto(blog.get());
        }
        throw new BlogNotFoundException("Blog with id " + id + " not found");
    }

    @Override
    public AddBlogDtoOut addBlog(BlogDtoIn blog, String username) throws IOException {
        Optional<UserModel> userResult = userManager.findByUsername(username);
        if (userResult.isEmpty()) {
            throw new UserNotFoundException("User with name " + username + " not found");
        }
        log.info("User {} attempting to post a blog", userResult.get().getId());

        // Checking so a blog can't be posted in the past
        Instant now = Instant.now();
        Instant blogDate = Instant.parse(blog.getDate());
        ZoneId zone = ZoneId.systemDefault();
        LocalDate nowDate = now.atZone(zone).toLocalDate();
        LocalDate blogLocalDate = blogDate.atZone(zone).toLocalDate();
        if (blogLocalDate.isBefore(nowDate)) {
            throw new BlogDateIsInThePastException("Blog date " + blog.getDate() + " is before " + nowDate);
        }

        BlogModel model = modelMapper.map(blog, BlogModel.class);
        handleBlogBanner(blog, model);
        model.setUser(userResult.get());
        BlogModel finalModel = blogManager.save(model);
        if (!model.isVisible()) {
            PendingBlog pendingBlog = PendingBlog.builder()
                    .blog(finalModel)
                    .approveStatus(ApproveStatus.PENDING)
                    .reason("Banner Image URL must be checked for sanitization")
                    .build();
            pendingBlogsManager.save(pendingBlog);
        }
        return AddBlogDtoOut.builder()
                .id(finalModel.getId())
                .review(model.isVisible())
                .build();
    }

    private void handleBlogBanner(BlogDtoIn blog, BlogModel model) throws IOException {
        if ("IMAGE_URL".equals(blog.getBannerType())) {
            try {
                URL url = new URI(blog.getBanner()).toURL();
                Optional<AllowedHostsModel> allowedHosts = allowedHostsManager.findByHostName(url.getHost());
                if (allowedHosts.isEmpty()) {
                    model.setVisible(false);
                }
            } catch (URISyntaxException | MalformedURLException e) {
                log.error("Invalid banner URI {}", blog.getBanner());
                throw new InvalidUrlException("Invalid banner URI " + blog.getBanner());
            }
        } else if ("IMAGE_UPLOAD".equals(blog.getBannerType())) {
            // Saving an uploaded picture on the server
            byte[] imageBytes = Base64.getDecoder().decode(blog.getBanner());

            String[] filenameParts = blog.getBannerName().split("\\.");
            String fileName = UUID.randomUUID() + "." + filenameParts[filenameParts.length - 1];
            String filePath = UPLOAD_DIR + fileName;

            Files.write(Paths.get(filePath), imageBytes);

            model.setBanner(filePath);
        }
    }

    private BlogDtoOut createBlogDto(BlogModel blog) {
        BlogDtoOut blogDto = modelMapper.map(blog, BlogDtoOut.class);
        if (BlogModel.BannerImageSource.valueOf("IMAGE_UPLOAD").equals(blog.getBannerType())) {
            // Converting the picture into base64 so it can be sent in the JSON response
            Path path = Paths.get(blog.getBanner());
            try {
                byte[] fileBytes = Files.readAllBytes(path);
                String base64 = Base64.getEncoder().encodeToString(fileBytes);
                blogDto.setBanner(base64);
            } catch (IOException e) {
                log.error("There was an error reading the article banner file");
                blogDto.setBanner("");
            }
        }
        return blogDto;
    }
}
