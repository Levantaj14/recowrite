package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.LoginDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.SignUpDtoIn;

public interface AuthServiceInterface {
    String login(LoginDtoIn user);

    String signup(SignUpDtoIn user);
}
