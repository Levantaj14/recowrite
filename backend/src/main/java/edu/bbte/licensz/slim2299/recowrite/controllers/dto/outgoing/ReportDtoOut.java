package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import lombok.Data;

import java.util.Date;

@Data
public class ReportDtoOut {
    private long id;
    private String reason;
    private Date date;
    private String status;
    private long blogId;
    private long reportedUserId;
    private long reporterId;
}
