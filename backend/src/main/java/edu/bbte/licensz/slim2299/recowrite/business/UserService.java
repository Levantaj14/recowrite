package edu.bbte.licensz.slim2299.recowrite.business;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.users.UserManagerInterface;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserManagerInterface userManager;

    @Autowired
    private UserMapper userMapper;

    public List<UserDtoOut> getAllUsers() {
        List<UserDtoOut> users = new ArrayList<>();
        for (UserModel user : userManager.getAllUsers()) {
            users.add(userMapper.modelToDto(user));
        }
        return users;
    }

    public UserDtoOut getUserById(String id) {
        Optional<UserModel> user = userManager.getUserById(id);
        if(user.isPresent()) {
            return userMapper.modelToDto(user.get());
        }
        throw new UserNotFoundException("User with id " + id + " not found");
    }
}
