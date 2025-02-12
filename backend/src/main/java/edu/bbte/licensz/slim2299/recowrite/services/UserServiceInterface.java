package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.SignUpDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserAlreadyExistsException;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;

import java.util.List;

public interface UserServiceInterface {
    List<UserDtoOut> getAllUsers();

    UserDtoOut getUserById(Long id);

    UserModel getUserByUsername(String username);

    UserDtoOut returnUserByUsername(String username);

    void createUser(SignUpDtoIn signUpDtoIn) throws UserAlreadyExistsException;
}
