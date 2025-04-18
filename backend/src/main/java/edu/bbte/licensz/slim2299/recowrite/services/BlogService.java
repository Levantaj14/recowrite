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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BlogService implements BlogServiceInterface {
    private final BlogManager blogManager;
    private final BlogMapper blogMapper;
    private final UserManager userManager;

    @Autowired
    public BlogService(BlogManager blogManager, BlogMapper blogMapper, UserManager userManager) {
        this.blogManager = blogManager;
        this.blogMapper = blogMapper;
        this.userManager = userManager;
    }

    @Override
    public List<BlogDtoOut> getAllBlogs() {
        List<BlogDtoOut> blogList = new ArrayList<>();
        for (BlogModel blog : blogManager.findAll()) {
            blogList.add(blogMapper.modelToDto(blog));
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
        Optional<List<BlogModel>> result = blogManager.findByUser(userResult.get());
        if (result.isPresent()) {
            for (BlogModel blog : result.get()) {
                blogList.add(blogMapper.modelToDto(blog));
            }
        }
        return blogList;
    }

    @Override
    public BlogDtoOut getBlogById(long id) {
        Optional<BlogModel> blog = blogManager.findById(id);
        if (blog.isPresent()) {
            return blogMapper.modelToDto(blog.get());
        }
        throw new BlogNotFoundException("Blog with id " + id + " not found");
    }

    @Override
    public BlogModel getBlogModelById(long id) {
        Optional<BlogModel> blog = blogManager.findById(id);
        if (blog.isPresent()) {
            return blog.get();
        }
        throw new BlogNotFoundException("Blog with id " + id + " not found");
    }

    @Override
    public Long addBlog(BlogDtoIn blog, String username) {
        Optional<UserModel> userResult = userManager.findByUsername(username);
        if (userResult.isEmpty()) {
            throw new UserNotFoundException("User with name " + username + " not found");
        }

        Instant now = Instant.now();
        Instant blogDate = Instant.parse(blog.getDate());
        ZoneId zone = ZoneId.systemDefault();
        LocalDate nowDate = now.atZone(zone).toLocalDate();
        LocalDate blogLocalDate = blogDate.atZone(zone).toLocalDate();
        if (blogLocalDate.isBefore(nowDate)) {
            throw new BlogDateIsInThePastException("Blog date " + blog.getDate() + " is before " + nowDate);
        }

        BlogModel model = blogMapper.dtoToModel(blog);
        model.setUser(userResult.get());
        return blogManager.save(model).getId();
    }
}
