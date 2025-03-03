package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.UserAvatarDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.UserEmailDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.UserNameDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.UserPasswordChangeDtoIn;

import java.io.IOException;

public interface AccountServiceInterface {
    void updateName(String username, UserNameDtoIn userNameDtoIn);

    void updateEmail(String username, UserEmailDtoIn userEmailDtoIn);

    void uploadAvatar(String username, UserAvatarDtoIn userAvatarDtoIn) throws IOException;

    void updatePassword(String username, UserPasswordChangeDtoIn userPasswordChangeDtoIn);
}
