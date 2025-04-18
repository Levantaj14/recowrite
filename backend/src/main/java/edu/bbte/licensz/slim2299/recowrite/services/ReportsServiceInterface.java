package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportDtoIn;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportsModel;

import java.util.List;

public interface ReportsServiceInterface {
    List<ReportsModel> getAllReports();

    ReportsModel getReportById(long id);

    long addReport(ReportDtoIn report, String username);
}
