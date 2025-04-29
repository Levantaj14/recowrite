package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SettingsDtoIn {
    @NotNull
    @Size(min = 1, max = 2)
    private String language;

    @NotNull
    private boolean getEmail;
}
