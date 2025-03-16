package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.EmailDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.TokenPasswordDtoIn;

public interface TokenServiceInterface {
    void createPasswordToken(EmailDtoIn emailDtoIn);

    void validatePasswordToken(String token);

    void changePassword(TokenPasswordDtoIn tokenPasswordDtoIn);
}
