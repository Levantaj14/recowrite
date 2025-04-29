package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserAvatarDtoIn {
    @NotNull
    private String name;

    @NotNull
    private String picture;
}
