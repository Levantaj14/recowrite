package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import lombok.Data;

import java.util.Date;

@Data
public class StrikeDtoOut {
    private long id;
    private UserDtoOut user;
    private UserDtoOut admin;
    private ReportDtoOut report;
    private Date evaluated;
    private String note;
}
