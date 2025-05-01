package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.*;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.IncorrectPasswordException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.SocialMediaNotSupportedException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.SocialsManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.SocialsTypeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsTypesModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AccountService implements AccountServiceInterface {
    private final UserManager userManager;
    private final SocialsTypeManager socialsTypeManager;
    private final SocialsManager socialsManager;
    private final MailServiceInterface mailService;
    private static final String UPLOAD_DIR = Paths.get("").toAbsolutePath() + "/uploads/";

    @Autowired
    public AccountService(UserManager userManager, SocialsTypeManager socialsTypeManager, SocialsManager socialsManager, MailServiceInterface mailService) {
        this.userManager = userManager;
        this.socialsTypeManager = socialsTypeManager;
        this.socialsManager = socialsManager;
        this.mailService = mailService;
    }

    @Override
    public void updateName(String username, UserNameDtoIn userNameDtoIn) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isPresent()) {
            UserModel userModel = user.get();
            userModel.setName(userNameDtoIn.getName());
            userManager.save(userModel);
            return;
        }
        throw new UserNotFoundException("User not found");
    }

    @Override
    public void updateEmail(String username, UserEmailDtoIn userEmailDtoIn) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isPresent()) {
            UserModel userModel = user.get();
            userModel.setEmail(userEmailDtoIn.getEmail());
            userManager.save(userModel);
            return;
        }
        throw new UserNotFoundException("User not found");
    }

    @Override
    public void uploadAvatar(String username, UserAvatarDtoIn userAvatarDtoIn) throws IOException {
        Optional<UserModel> result = userManager.findByUsername(username);
        if (result.isPresent()) {
            UserModel userModel = result.get();
            byte[] imageBytes = Base64.getDecoder().decode(userAvatarDtoIn.getPicture());

            String[] filenameParts = userAvatarDtoIn.getName().split("\\.");
            String fileName = UUID.randomUUID() + "." + filenameParts[filenameParts.length - 1];
            String filePath = UPLOAD_DIR + fileName;

            Files.write(Paths.get(filePath), imageBytes);

            userModel.setAvatar(filePath);
            userManager.save(userModel);
            return;
        }
        throw new UserNotFoundException("User not found");
    }

    @Override
    public void updatePassword(String username, UserPasswordChangeDtoIn userPasswordChangeDtoIn) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isPresent()) {
            UserModel userModel = user.get();
            if (!BCrypt.checkpw(userPasswordChangeDtoIn.getOldPassword(), userModel.getPassword())) {
                throw new IncorrectPasswordException("Old password does not match");
            }
            userModel.setPassword(BCrypt.hashpw(userPasswordChangeDtoIn.getNewPassword(), userModel.getSalt()));
            userManager.save(userModel);
            if (userModel.getPreferences().isEmails()) {
                Map<String, String> model = new ConcurrentHashMap<>();
                model.put("username", userModel.getUsername());
                mailService.sendMessage(userModel.getEmail(), "Security update", "securityUpdate", model, null);
            }
            return;
        }
        throw new UserNotFoundException("User not found");
    }

    @Override
    public void updateSocial(String username, SocialDtoIn socialDtoIn) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isPresent()) {
            UserModel userModel = user.get();
            Optional<SocialsTypesModel> socialsTypes = socialsTypeManager.findByName(socialDtoIn.getName());
            if (socialsTypes.isPresent()) {
                SocialsTypesModel socialsTypesModel = socialsTypes.get();
                Optional<SocialsModel> socialsModel = socialsManager.findBySocialsTypeAndUser(socialsTypesModel, userModel);
                if (socialsModel.isPresent()) {
                    SocialsModel socialsModelModel = socialsModel.get();
                    if (Objects.equals(socialDtoIn.getUsername(), "")) {
                        socialsManager.delete(socialsModelModel);
                    } else {
                        socialsModelModel.setLink(socialDtoIn.getUsername());
                        socialsManager.save(socialsModelModel);
                    }
                } else {
                    SocialsModel newSocialsModel = new SocialsModel();
                    newSocialsModel.setUser(userModel);
                    newSocialsModel.setSocialsType(socialsTypesModel);
                    newSocialsModel.setLink(socialDtoIn.getUsername());
                    socialsManager.save(newSocialsModel);
                }
                return;
            }
            throw new SocialMediaNotSupportedException("Social media not supported");
        }
        throw new UserNotFoundException("User not found");
    }

    @Override
    public void updateBio(String username, BioDtoIn bioDtoIn) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        UserModel userModel = user.get();
        userModel.setBio(bioDtoIn.getBio());
        userManager.save(userModel);
    }

    @Override
    public void deleteAccount(long accountId) {
        Optional<UserModel> user = userManager.findById(accountId);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        userManager.delete(user.get());
    }

    @Override
    public void changeRole(long accountId) {
        Optional<UserModel> user = userManager.findById(accountId);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        UserModel userModel = user.get();
        if ("ADMIN".equals(userModel.getRole())) {
            userModel.setRole("USER");
        } else if ("USER".equals(userModel.getRole())) {
            userModel.setRole("ADMIN");
        }
        userManager.save(userModel);
    }
}
