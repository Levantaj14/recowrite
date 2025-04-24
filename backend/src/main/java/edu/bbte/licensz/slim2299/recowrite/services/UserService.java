package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SettingsDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SignUpDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserAlreadyExistsException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserServiceInterface {
    private final UserManager userManager;
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserManager userManager, UserMapper userMapper) {
        this.userManager = userManager;
        this.userMapper = userMapper;
    }

    @Override
    public List<UserDtoOut> getAllUsers() {
        List<UserDtoOut> users = new ArrayList<>();
        for (UserModel user : userManager.findAll()) {
            users.add(userMapper.modelToDto(user));
        }
        return users;
    }

    @Override
    public List<UserDtoOut> getAdminUsers() {
        List<UserDtoOut> users = new ArrayList<>();
        for (UserModel user : userManager.findAllByRole("ADMIN")) {
            users.add(userMapper.modelToDto(user));
        }
        return users;
    }

    @Override
    public UserDtoOut findUserById(Long id) {
        Optional<UserModel> user = userManager.findById(id);
        if (user.isPresent()) {
            return userMapper.modelToDto(user.get());
        }
        throw new UserNotFoundException("User with id " + id + " not found");
    }

    @Override
    public UserModel getUserModelByUsername(String username) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UserNotFoundException("User with username " + username + " not found");
    }

    @Override
    public UserDtoOut returnUserByUsername(String username) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isPresent()) {
            return userMapper.modelToDto(user.get());
        }
        throw new UserNotFoundException("User " + username + " not found");
    }

    @Override
    public UserModel createUser(SignUpDtoIn signUpDtoIn) throws UserAlreadyExistsException {
        UserModel user = userMapper.signupDtoToModel(signUpDtoIn);
        String salt = BCrypt.gensalt(12);
        user.setSalt(salt);
        user.setPassword(BCrypt.hashpw(user.getPassword(), salt));
        return userManager.save(user);
    }

    @Override
    public void updateUserPreferences(String username, SettingsDtoIn settings) {
        Optional<UserModel> result = userManager.findByUsername(username);
        if (result.isPresent()) {
            UserModel userModel = result.get();
            userModel.getPreferences().setLanguage(settings.getLanguage());
            userModel.getPreferences().setEmails(settings.isGetEmail());
            userManager.save(userModel);
        } else {
            throw new UserNotFoundException("User with username " + username + " not found");
        }
    }
}
