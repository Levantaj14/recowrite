package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class UserDtoOut {
    private Long id;
    private String username;
    private String name;
    private String avatar;
    private String bio;
    private List<SocialMediaDtoOut> socials;
}
