package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportDtoIn;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;

import java.util.List;

public interface ReportServiceInterface {
    List<ReportModel> getAllReports();

    ReportModel getReportById(long id);

    long addReport(ReportDtoIn report, String username);
}
