package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.LikeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.BlogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BlogService {
    @Autowired
    private BlogManager blogManager;

    @Autowired
    private BlogMapper blogMapper;

    @Autowired
    private UserManager userManager;

    @Autowired
    private LikeManager likeManager;

    public List<BlogDtoOut> getAllBlogs() {
        List<BlogDtoOut> blogList = new ArrayList<>();
        for (BlogModel blog : blogManager.findAll()) {
            blogList.add(blogMapper.modelToDto(blog, likeManager.countByBlog(blog)));
        }
        return blogList;
    }

    public List<BlogDtoOut> getBlogsByAuthor(Long userId) {
        List<BlogDtoOut> blogList = new ArrayList<>();
        Optional<UserModel> userResult = userManager.findById(userId);
        if (userResult.isEmpty()) {
            throw new UserNotFoundException("User with id " + userId + " not found");
        }
        Optional<List<BlogModel>> result = blogManager.findByUser(userResult.get());
        if (result.isPresent()) {
            for (BlogModel blog : result.get()) {
                blogList.add(blogMapper.modelToDto(blog, likeManager.countByBlog(blog)));
            }
        }
        return blogList;
    }

    public BlogDtoOut getBlogById(long id) {
        Optional<BlogModel> blog = blogManager.findById(id);
        if (blog.isPresent()) {
            return blogMapper.modelToDto(blog.get(), likeManager.countByBlog(blog.get()));
        }
        throw new BlogNotFoundException("Blog with id " + id + " not found");
    }

    public BlogModel getBlogModelById(long id) {
        Optional<BlogModel> blog = blogManager.findById(id);
        if (blog.isPresent()) {
            return blog.get();
        }
        throw new BlogNotFoundException("Blog with id " + id + " not found");
    }

    public Long addBlog(BlogModel blog) {
        return blogManager.save(blog).getId();
    }
}
