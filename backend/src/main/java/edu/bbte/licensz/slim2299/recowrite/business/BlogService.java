package edu.bbte.licensz.slim2299.recowrite.business;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.blogs.BlogManagerInterface;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.BlogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BlogService {
    @Autowired
    private BlogManagerInterface blogManager;

    @Autowired
    private BlogMapper blogMapper;

    public List<BlogDtoOut> getAllBlogs() {
        List<BlogDtoOut> blogList = new ArrayList<>();
        for (BlogModel blog : blogManager.getAllBlogs()) {
            blogList.add(blogMapper.modelToDto(blog));
        }
        return blogList;
    }

    public List<BlogDtoOut> getBlogsByAuthor(String authorId) {
        List<BlogDtoOut> blogList = new ArrayList<>();
        Optional<List<BlogModel>> result = blogManager.getBlogsByAuthor(authorId);
        if (result.isPresent()) {
            for (BlogModel blog : result.get()) {
                blogList.add(blogMapper.modelToDto(blog));
            }
        }
        return blogList;
    }

    public BlogDtoOut getBlogById(String id) {
        Optional<BlogModel> blog = blogManager.getBlogById(id);
        if (blog.isPresent()) {
            return blogMapper.modelToDto(blog.get());
        }
        throw new BlogNotFoundException("Blog with id " + id + " not found");
    }

    public String addBlog(BlogModel blog) {
        return blogManager.addBlog(blog);
    }
}
