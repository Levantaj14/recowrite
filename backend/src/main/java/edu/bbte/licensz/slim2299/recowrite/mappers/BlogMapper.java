package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import org.springframework.stereotype.Component;

@Component
public class BlogMapper {

    public BlogDtoOut modelToDto(BlogModel blog) {
        BlogDtoOut blogDtoOut = new BlogDtoOut();
        blogDtoOut.setId(blog.getId());
        blogDtoOut.setTitle(blog.getTitle());
        blogDtoOut.setDescription(blog.getDescription());
        blogDtoOut.setAuthor(blog.getUser().getId());
        blogDtoOut.setContent(blog.getContent());
        blogDtoOut.setBanner(blog.getBanner());
        blogDtoOut.setDate(blog.getDate());
        return blogDtoOut;
    }
}
