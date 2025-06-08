package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReportDtoOut {
    private long id;
    private long reasonId;
    private LocalDateTime date;
    private String status;
    private long blogId;
    private long reportedUserId;
    private long reporterId;
    private String note;
}
