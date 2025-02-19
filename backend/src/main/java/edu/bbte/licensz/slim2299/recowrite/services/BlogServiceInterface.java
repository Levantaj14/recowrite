package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;

import java.util.List;

public interface BlogServiceInterface {
    List<BlogDtoOut> getAllBlogs();

    List<BlogDtoOut> getBlogsByAuthor(Long userId);

    BlogDtoOut getBlogById(long id);

    BlogModel getBlogModelById(long id);

    Long addBlog(BlogModel blog);
}
