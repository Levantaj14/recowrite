package edu.bbte.licensz.slim2299.recowrite.services.dto;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.enums.ApproveStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PendingBlogDtoOut {
    private long id;
    private BlogDtoOut blog;
    private String reason;
    private ApproveStatus approveStatus;
}
