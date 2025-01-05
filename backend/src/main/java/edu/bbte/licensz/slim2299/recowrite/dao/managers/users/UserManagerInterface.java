package edu.bbte.licensz.slim2299.recowrite.dao.managers.users;

import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;

import java.util.List;
import java.util.Optional;

public interface UserManagerInterface {
    List<UserModel> getAllUsers();

    Optional<UserModel> getUserById(String id);
}
