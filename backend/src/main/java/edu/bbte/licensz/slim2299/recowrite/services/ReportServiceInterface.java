package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.ReportDtoOut;

import java.util.List;

public interface ReportServiceInterface {
    List<ReportDtoOut> getAllReports();

    ReportDtoOut getReportById(long id);

    long addReport(ReportDtoIn report, String username);

    void dismissReport(String username, long id);
}
