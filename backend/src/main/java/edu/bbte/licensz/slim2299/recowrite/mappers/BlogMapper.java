package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.BlogDtoIn;
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

    public BlogModel dtoToModel(BlogDtoIn blog) {
        BlogModel blogModel = new BlogModel();
        blogModel.setTitle(blog.getTitle());
        blogModel.setDescription(blog.getDescription());
        blogModel.setContent(blog.getContent());
        blogModel.setBanner(blog.getBanner());
        return blogModel;
    }
}
