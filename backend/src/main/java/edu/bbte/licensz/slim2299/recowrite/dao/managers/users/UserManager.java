package edu.bbte.licensz.slim2299.recowrite.dao.managers.users;

import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserManager implements UserManagerInterface {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<UserModel> getUserById(String id) {
        return userRepository.findById(id);
    }
}
