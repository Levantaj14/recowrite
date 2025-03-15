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

@Service
public class AccountService implements AccountServiceInterface {

    @Autowired
    private UserManager userManager;

    @Autowired
    private SocialsTypeManager socialsTypeManager;

    @Autowired
    private SocialsManager socialsManager;

    @Autowired
    private MailServiceInterface mailService;

    private static final String UPLOAD_DIR = Paths.get("").toAbsolutePath() + "/uploads/";

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
            } else {
                userModel.setPassword(BCrypt.hashpw(userPasswordChangeDtoIn.getNewPassword(), userModel.getSalt()));
                userManager.save(userModel);
            }
            if (userModel.isEmails()) {
                Map<String, String> model = new HashMap<>();
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
                    if (Objects.equals(socialDtoIn.getUrl(), "")) {
                        socialsManager.delete(socialsModelModel);
                    } else {
                        socialsModelModel.setLink(socialDtoIn.getUrl());
                        socialsManager.save(socialsModelModel);
                    }
                } else {
                    SocialsModel newSocialsModel = new SocialsModel();
                    newSocialsModel.setUser(userModel);
                    newSocialsModel.setSocialsType(socialsTypesModel);
                    newSocialsModel.setLink(socialDtoIn.getUrl());
                    socialsManager.save(newSocialsModel);
                }
                return;
            }
            throw new SocialMediaNotSupportedException("Social media not supported");
        }
        throw new UserNotFoundException("User not found");
    }
}
