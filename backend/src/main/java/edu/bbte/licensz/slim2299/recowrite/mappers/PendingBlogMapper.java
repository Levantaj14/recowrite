package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.dto.PendingBlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.PendingBlog;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class PendingBlogMapper {
    private final ModelMapper modelMapper;

    public PendingBlogDtoOut toPendingBlogsDto(PendingBlog pendingBlog) {
        return PendingBlogDtoOut.builder()
                .id(pendingBlog.getId())
                .blog(modelMapper.map(pendingBlog.getBlog(), BlogDtoOut.class))
                .reason(pendingBlog.getReason())
                .approveStatus(pendingBlog.getApproveStatus())
                .build();
    }
}
