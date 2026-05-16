package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.services.dto.PendingBlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.PendingBlog;
import org.springframework.stereotype.Component;

@Component
public class PendingBlogMapper {
    private final BlogMapper blogMapper;

    public PendingBlogMapper(BlogMapper blogMapper) {
        this.blogMapper = blogMapper;
    }

    public PendingBlogDtoOut toPendingBlogsDto(PendingBlog pendingBlog) {
        return PendingBlogDtoOut.builder()
                .id(pendingBlog.getId())
                .blog(blogMapper.modelToDto(pendingBlog.getBlog()))
                .reason(pendingBlog.getReason())
                .build();
    }
}
