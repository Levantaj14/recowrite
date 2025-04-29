package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TokenPasswordDtoIn {
    @NotNull
    @NotEmpty
    private String token;

    @NotNull
    @Size(min = 8, max = 255)
    private String password;
}
