package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import edu.bbte.licensz.slim2299.recowrite.services.dto.PendingBlogDtoOut;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PendingBlogsDtoOut {
    private List<PendingBlogDtoOut> pendingBlogs;
}
