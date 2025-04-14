package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.EmailDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.TokenPasswordDtoIn;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.TokenManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.TokenModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.ExpiredTokenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class TokenService implements TokenServiceInterface {
    private final UserManager userManager;
    private final TokenManager tokenManager;
    private final MailServiceInterface mailService;
    private final String passwordString = "PASSWORD";

    @Autowired
    public TokenService(UserManager userManager, TokenManager tokenManager, MailServiceInterface mailService) {
        this.userManager = userManager;
        this.tokenManager = tokenManager;
        this.mailService = mailService;
    }

    @Override
    public void createPasswordToken(EmailDtoIn emailDtoIn) {
        Optional<UserModel> user = userManager.findByEmail(emailDtoIn.getEmail());
        if (user.isPresent()) {
            TokenModel tokenModel = new TokenModel();
            tokenModel.setUser(user.get());
            tokenModel.setToken(UUID.randomUUID().toString());
            tokenModel.setType(passwordString);
            LocalDateTime expiry = LocalDateTime.now().plusMinutes(30);
            tokenModel.setExpiryDate(expiry);
            tokenManager.save(tokenModel);
            Map<String, String> model = new HashMap<>();
            model.put("title", "Forgot password");
            model.put("username", user.get().getUsername());
            model.put("token", tokenModel.getToken());
            mailService.sendMessage(user.get().getEmail(), "Forgot your password", "forgotPassword", model, null);
        }
    }

    @Override
    public void validatePasswordToken(String token) {
        Optional<TokenModel> tokenModel = tokenManager.findByToken(token);
        if (tokenModel.isPresent() && tokenModel.get().getExpiryDate().isAfter(LocalDateTime.now()) &&
                passwordString.equals(tokenModel.get().getType())) {
            return;
        }
        throw new ExpiredTokenException("The token is expired");
    }

    @Override
    public void changePassword(TokenPasswordDtoIn tokenPasswordDtoIn) {
        Optional<TokenModel> tokenModel = tokenManager.findByToken(tokenPasswordDtoIn.getToken());
        if (tokenModel.isPresent() && tokenModel.get().getExpiryDate().isAfter(LocalDateTime.now()) &&
                passwordString.equals(tokenModel.get().getType())) {
            UserModel userModel = tokenModel.get().getUser();
            String salt = BCrypt.gensalt(12);
            userModel.setSalt(salt);
            userModel.setPassword(BCrypt.hashpw(tokenPasswordDtoIn.getPassword(), salt));
            userManager.save(userModel);
            tokenManager.delete(tokenModel.get());
            if (userModel.isEmails()) {
                Map<String, String> model = new HashMap<>();
                model.put("username", userModel.getUsername());
                mailService.sendMessage(userModel.getEmail(), "Security update", "securityUpdate", model, null);
            }
            return;
        }
        throw new ExpiredTokenException("The token is expired");
    }
}
