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

    @Autowired
    private UserManager userManager;

    @Autowired
    private TokenManager tokenManager;

    @Autowired
    private MailServiceInterface mailService;

    @Override
    public void createToken(EmailDtoIn emailDtoIn) {
        Optional<UserModel> user = userManager.findByEmail(emailDtoIn.getEmail());
        if (user.isPresent()) {
            TokenModel tokenModel = new TokenModel();
            tokenModel.setUser(user.get());
            tokenModel.setToken(UUID.randomUUID().toString());
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
    public void validateToken(String token) {
        Optional<TokenModel> tokenModel = tokenManager.findByToken(token);
        if (tokenModel.isPresent() &&
                tokenModel.get().getExpiryDate().isAfter(LocalDateTime.now()) && !tokenModel.get().isUsed()) {
            return;
        }
        throw new ExpiredTokenException("The token is expired");
    }

    @Override
    public void changePassword(TokenPasswordDtoIn tokenPasswordDtoIn) {
        Optional<TokenModel> tokenModel = tokenManager.findByToken(tokenPasswordDtoIn.getToken());
        if (tokenModel.isPresent() &&
                tokenModel.get().getExpiryDate().isAfter(LocalDateTime.now()) && !tokenModel.get().isUsed()) {
            UserModel model = tokenModel.get().getUser();
            String salt = BCrypt.gensalt(12);
            model.setSalt(salt);
            model.setPassword(BCrypt.hashpw(tokenPasswordDtoIn.getPassword(), salt));
            userManager.save(model);
            TokenModel tokenModel2 = tokenModel.get();
            tokenModel2.setUsed(true);
            tokenManager.save(tokenModel2);
            return;
        }
        throw new ExpiredTokenException("The token is expired");
    }
}
