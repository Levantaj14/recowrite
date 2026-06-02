package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import edu.bbte.licensz.slim2299.recowrite.dao.enums.ApproveStatus;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
public class PendingDtoOut {
    private Long id;
    private String title;
    private String content;
    private long author;
    private String banner;
    private String bannerType;
    private boolean ai;
    private ApproveStatus approveStatus;
}
