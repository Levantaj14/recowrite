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
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService implements AuthServiceInterface {
    private static final String USERNAME_STRING = "username";
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserServiceInterface userService;
    private final UserMapper userMapper;
    private final MailServiceInterface mailService;
    private final UserManager userManager;
    private final TokenManager tokenManager;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserServiceInterface userService,
                       UserMapper userMapper, MailServiceInterface mailService, UserManager userManager,
                       TokenManager tokenManager) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.userMapper = userMapper;
        this.mailService = mailService;
        this.userManager = userManager;
        this.tokenManager = tokenManager;
    }

    @Override
    public String login(LoginDtoIn user) {
        UserModel userModel = userService.getUserModelByUsername(user.getUsername());
        if (userModel.isValid()) {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            Map<String, String> model = new ConcurrentHashMap<>();
            model.put(USERNAME_STRING, user.getUsername());
            if (userModel.getPreferences().isEmails()) {
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
        // Generating a random token for email verification and saving to the database
        TokenModel tokenModel = new TokenModel();
        tokenModel.setUser(userModel);
        tokenModel.setToken(UUID.randomUUID().toString());
        tokenModel.setType("EMAIL");
        LocalDateTime expiry = LocalDateTime.now().plusYears(1);
        tokenModel.setExpiryDate(expiry);
        tokenManager.save(tokenModel);
        // Sending an email with a link to verify the email using that token
        Map<String, String> model = new ConcurrentHashMap<>();
        model.put("title", "Verify your account");
        model.put(USERNAME_STRING, user.getUsername());
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
        if (tokenModel.isPresent() && "EMAIL".equals(tokenModel.get().getType())) {
            // Validating the account and deleting the token
            UserModel user = tokenModel.get().getUser();
            user.setValid(true);
            userManager.save(user);
            tokenManager.delete(tokenModel.get());
            Map<String, String> model = new ConcurrentHashMap<>();
            model.put(USERNAME_STRING, user.getUsername());
            Map<String, String> images = new ConcurrentHashMap<>();
            images.put("continue-reading", "continue-reading.png");
            images.put("comments", "comments.png");
            images.put("write", "write.png");
            mailService.sendMessage(user.getEmail(), "Welcome to recowrite!", "signup", model, images);
            return jwtUtil.generateToken(user.getUsername());
        }
        throw new UserNotFoundException("User not found");
    }
}
