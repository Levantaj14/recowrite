package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;

public interface StrikeServiceInterface {
    int getStrikeCount(String username);

    void handleStrikeGiven(ReportModel reportModel);

    void handleStrikeRemoved(ReportModel reportModel);
}
