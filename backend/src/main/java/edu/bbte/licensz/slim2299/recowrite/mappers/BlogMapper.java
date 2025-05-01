package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.BlogDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Date;

@Slf4j
@Component
public class BlogMapper {

    public BlogDtoOut modelToDto(BlogModel blog) {
        BlogDtoOut blogDtoOut = new BlogDtoOut();
        blogDtoOut.setId(blog.getId());
        blogDtoOut.setTitle(blog.getTitle());
        blogDtoOut.setBanner(blog.getBanner());
        blogDtoOut.setAuthor(blog.getUser().getId());
        Instant now = Instant.now();
        Instant blogDate = blog.getDate().toInstant();
        blogDtoOut.setDate(blogDate.toString());
        if (blogDate.isAfter(now)) {
            blogDtoOut.setDescription("");
            blogDtoOut.setContent("");
        } else {
            blogDtoOut.setDescription(blog.getDescription());
            blogDtoOut.setContent(blog.getContent());
        }
        return blogDtoOut;
    }

    public BlogModel dtoToModel(BlogDtoIn blog) {
        BlogModel blogModel = new BlogModel();
        blogModel.setTitle(blog.getTitle());
        blogModel.setDescription(blog.getDescription());
        blogModel.setContent(blog.getContent());
        blogModel.setBanner(blog.getBanner());
        blogModel.setBannerType(BlogModel.BannerImageSource.valueOf("IMAGE_URL"));
        try {
            Instant instant = Instant.parse(blog.getDate());
            Date date = Date.from(instant);
            blogModel.setDate(date);
        } catch (DateTimeParseException e) {
            log.error("Error parsing with Instant: {}", e.getMessage());
        }
        return blogModel;
    }
}
