package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SocialDtoIn {
    @NotNull
    @Pattern(regexp = "^(Instagram|X|Bluesky|Medium)$")
    private String name;

    @NotNull
    private String username;
}
