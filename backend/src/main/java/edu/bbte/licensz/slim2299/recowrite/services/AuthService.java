package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.LoginDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SignUpDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LoginDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements AuthServiceInterface {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserServiceInterface userService;
    @Autowired
    private UserMapper userMapper;

    @Override
    public String login(LoginDtoIn user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        return jwtUtil.generateToken(user.getUsername());
    }

    @Override
    public String signup(SignUpDtoIn user) {
        userService.createUser(user);
        return jwtUtil.generateToken(user.getUsername());
    }

    @Override
    public LoginDtoOut getNecessaryUserData(String username) {
        UserModel model = userService.getUserModelByUsername(username);
        return userMapper.modelToLoginDto(model);
    }
}
