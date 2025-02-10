package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.users.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserServiceInterface {
    @Autowired
    private UserManager userManager;

    @Autowired
    private UserMapper userMapper;

    public List<UserDtoOut> getAllUsers() {
        List<UserDtoOut> users = new ArrayList<>();
        for (UserModel user : userManager.findAll()) {
            users.add(userMapper.modelToDto(user));
        }
        return users;
    }

    public UserDtoOut getUserById(Long id) {
        Optional<UserModel> user = userManager.findById(id);
        if (user.isPresent()) {
            return userMapper.modelToDto(user.get());
        }
        throw new UserNotFoundException("User with id " + id + " not found");
    }

    public UserModel getUserByUsername(String username) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UserNotFoundException("User with username " + username + " not found");
    }
}
