package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import edu.bbte.licensz.slim2299.recowrite.dao.enums.ApproveStatus;
import lombok.Data;

@Data
public class PendingBlogStatusDtoIn {
    private ApproveStatus status;
}
