package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.LoginDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SignUpDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LoginDtoOut;

public interface AuthServiceInterface {
    String login(LoginDtoIn user);

    String signup(SignUpDtoIn user);

    LoginDtoOut getNecessaryUserData(String username);
}
