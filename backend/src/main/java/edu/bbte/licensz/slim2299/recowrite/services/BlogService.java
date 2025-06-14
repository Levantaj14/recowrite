package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.BlogDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogDateIsInThePastException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.BlogMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
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
    private final BlogMapper blogMapper;
    private final UserManager userManager;
    private static final String UPLOAD_DIR = Paths.get("").toAbsolutePath() + "/uploads/banners/";

    @Autowired
    public BlogService(BlogManager blogManager, BlogMapper blogMapper, UserManager userManager) {
        this.blogManager = blogManager;
        this.blogMapper = blogMapper;
        this.userManager = userManager;
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
    public BlogModel getBlogModelById(long id) {
        Optional<BlogModel> blog = blogManager.findByIdAndVisible(id, true);
        if (blog.isPresent()) {
            return blog.get();
        }
        throw new BlogNotFoundException("Blog with id " + id + " not found");
    }

    @Override
    public Long addBlog(BlogDtoIn blog, String username) throws IOException {
        Optional<UserModel> userResult = userManager.findByUsername(username);
        if (userResult.isEmpty()) {
            throw new UserNotFoundException("User with name " + username + " not found");
        }

        // Checking so a blog can't be posted in the past
        Instant now = Instant.now();
        Instant blogDate = Instant.parse(blog.getDate());
        ZoneId zone = ZoneId.systemDefault();
        LocalDate nowDate = now.atZone(zone).toLocalDate();
        LocalDate blogLocalDate = blogDate.atZone(zone).toLocalDate();
        if (blogLocalDate.isBefore(nowDate)) {
            throw new BlogDateIsInThePastException("Blog date " + blog.getDate() + " is before " + nowDate);
        }

        BlogModel model = blogMapper.dtoToModel(blog);
        if ("IMAGE_UPLOAD".equals(blog.getBanner_type())) {
            // Saving an uploaded picture on the server
            byte[] imageBytes = Base64.getDecoder().decode(blog.getBanner());

            String[] filenameParts = blog.getBanner_name().split("\\.");
            String fileName = UUID.randomUUID() + "." + filenameParts[filenameParts.length - 1];
            String filePath = UPLOAD_DIR + fileName;

            Files.write(Paths.get(filePath), imageBytes);

            model.setBanner(filePath);
        }
        model.setUser(userResult.get());
        return blogManager.save(model).getId();
    }

    private BlogDtoOut createBlogDto(BlogModel blog) {
        BlogDtoOut blogDto = blogMapper.modelToDto(blog);
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
