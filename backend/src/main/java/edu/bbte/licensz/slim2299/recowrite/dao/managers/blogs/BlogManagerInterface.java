package edu.bbte.licensz.slim2299.recowrite.dao.managers.blogs;

import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;

import java.util.List;
import java.util.Optional;

public interface BlogManagerInterface {
    List<BlogModel> getAllBlogs();

    Optional<List<BlogModel>> getBlogsByAuthor(String authorId);

    Optional<BlogModel> getBlogById(String id);

    String addBlog(BlogModel blog);
}
