package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.StrikeDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.StrikeDtoOut;

import java.util.List;

public interface StrikeServiceInterface {
    List<StrikeDtoOut> getAllStrikes();

    List<StrikeDtoOut> getUserStrikes(String username);

    long addStrike(String adminUsername, StrikeDtoIn strike);

    void deleteStrike(long id);

    void deleteStrikeFromReport(long id);
}
