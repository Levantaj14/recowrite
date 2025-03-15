package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.LoginDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SignUpDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LoginDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotValidatedException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.TokenManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.TokenModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
    @Autowired
    private MailServiceInterface mailService;
    @Autowired
    private UserManager userManager;
    @Autowired
    private TokenManager tokenManager;

    @Override
    public String login(LoginDtoIn user) {
        UserModel userModel = userService.getUserModelByUsername(user.getUsername());
        if (userModel.isValid()) {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            Map<String, String> model = new HashMap<>();
            model.put("username", user.getUsername());
            if (userModel.isEmails()) {
                mailService.sendMessage(userService.getUserModelByUsername(user.getUsername()).getEmail(),
                        "New login to recowrite", "login", model, null);
            }
            return jwtUtil.generateToken(user.getUsername());
        }
        throw new UserNotValidatedException("User has not validated it's email.");
    }

    @Override
    public void signup(SignUpDtoIn user) {
        UserModel userModel = userService.createUser(user);
        TokenModel tokenModel = new TokenModel();
        tokenModel.setUser(userModel);
        tokenModel.setToken(UUID.randomUUID().toString());
        tokenModel.setType("EMAIL");
        LocalDateTime expiry = LocalDateTime.now().plusYears(1);
        tokenModel.setExpiryDate(expiry);
        tokenManager.save(tokenModel);
        Map<String, String> model = new HashMap<>();
        model.put("title", "Verify your account");
        model.put("username", user.getUsername());
        model.put("token", tokenModel.getToken());
        mailService.sendMessage(user.getEmail(), "Verify your account", "verifyEmail", model, null);
    }

    @Override
    public LoginDtoOut getNecessaryUserData(String username) {
        UserModel model = userService.getUserModelByUsername(username);
        return userMapper.modelToLoginDto(model);
    }

    @Override
    public String validateEmail(String token) {
        Optional<TokenModel> tokenModel = tokenManager.findByToken(token);
        if (tokenModel.isPresent() && tokenModel.get().getType().equals("EMAIL")) {
            UserModel user = tokenModel.get().getUser();
            user.setValid(true);
            userManager.save(user);
            Map<String, String> model = new HashMap<>();
            model.put("username", user.getUsername());
            Map<String, String> images = new HashMap<>();
            images.put("continue-reading", "continue-reading.png");
            images.put("comments", "comments.png");
            images.put("write", "write.png");
            mailService.sendMessage(user.getEmail(), "Welcome to recowrite!", "signup", model, images);
            return jwtUtil.generateToken(user.getUsername());
        }
        throw new UserNotFoundException("User not found");
    }
}
