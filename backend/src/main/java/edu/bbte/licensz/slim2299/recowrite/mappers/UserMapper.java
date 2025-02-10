package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.SocialMediaDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.UserDtoOut;
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
        for (SocialsModel social : user.getSocials()) {
            socials.add(socialsMapper.modelToDto(social));
        }
        dto.setSocials(socials);
        return dto;
    }
}
