package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SignUpDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LoginDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.SocialMediaDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserMapper {

    @Autowired
    private SocialsMapper socialsMapper;

    public UserDtoOut modelToDto(UserModel user) {
        UserDtoOut dto = new UserDtoOut();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setAvatar(user.getAvatar());
        dto.setBio(user.getBio());
        List<SocialMediaDtoOut> socials = new ArrayList<>();
        if (user.getSocials() != null) {
            for (SocialsModel social : user.getSocials()) {
                socials.add(socialsMapper.modelToDto(social));
            }
        }
        dto.setSocials(socials);
        return dto;
    }

    public UserModel signupDtoToModel(SignUpDtoIn signupDtoIn) {
        UserModel userModel = new UserModel();
        userModel.setName(signupDtoIn.getName());
        userModel.setUsername(signupDtoIn.getUsername());
        userModel.setEmail(signupDtoIn.getEmail());
        userModel.setPassword(signupDtoIn.getPassword());
        return userModel;
    }

    public LoginDtoOut modelToLoginDto(UserModel userModel) {
        LoginDtoOut dto = new LoginDtoOut();
        dto.setId(userModel.getId());
        dto.setUsername(userModel.getUsername());
        dto.setName(userModel.getName());
        dto.setEmail(userModel.getEmail());
        dto.setGetEmail(userModel.isEmails());
        dto.setBio(userModel.getBio());
        dto.setAvatar(userModel.getAvatar());
        dto.setLanguage(userModel.getLanguage());
        List<SocialMediaDtoOut> socials = new ArrayList<>();
        if (userModel.getSocials() != null) {
            for (SocialsModel social : userModel.getSocials()) {
                socials.add(socialsMapper.modelToDto(social));
            }
        }
        dto.setSocials(socials);
        return dto;
    }
}
