package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SettingsDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SignUpDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserAlreadyExistsException;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;

import java.util.List;

public interface UserServiceInterface {
    List<UserDtoOut> getAllUsers();

    UserDtoOut findUserById(Long id);

    UserModel getUserModelByUsername(String username);

    UserDtoOut returnUserByUsername(String username);

    UserModel createUser(SignUpDtoIn signUpDtoIn) throws UserAlreadyExistsException;

    void updateUserPreferences(String username, SettingsDtoIn user);
}
