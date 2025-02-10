package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDtoOut modelToDto(UserModel user) {
        UserDtoOut dto = new UserDtoOut();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setAvatar(user.getAvatar());
        dto.setBio(user.getBio());
        dto.setSocials(user.getSocials());
        return dto;
    }
}
