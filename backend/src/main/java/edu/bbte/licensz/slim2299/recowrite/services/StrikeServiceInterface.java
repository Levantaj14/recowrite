package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.StrikeDtoIn;
import edu.bbte.licensz.slim2299.recowrite.dao.models.StrikeModel;

import java.util.List;

public interface StrikeServiceInterface {
    List<StrikeModel> getAllStrikes();

    List<StrikeModel> getUserStrikes(String username);

    long addStrike(String adminUsername, StrikeDtoIn strike);

    void deleteStrike(long id);
}
