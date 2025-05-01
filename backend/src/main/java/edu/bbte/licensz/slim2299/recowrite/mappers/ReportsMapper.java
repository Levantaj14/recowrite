package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.ReportDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import org.springframework.stereotype.Component;

@Component
public class ReportsMapper {
    public ReportDtoOut modelToDto(ReportModel reportModel) {
        ReportDtoOut dto = new ReportDtoOut();
        dto.setId(reportModel.getId());
        dto.setReason(reportModel.getReason());
        dto.setDate(reportModel.getReportDate());
        dto.setStatus(String.valueOf(reportModel.getStatus()));
        dto.setBlogId(reportModel.getBlog().getId());
        dto.setReportedUserId(reportModel.getReportedUser().getId());
        dto.setReporterId(reportModel.getReporter().getId());
        return dto;
    }
}
