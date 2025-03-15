package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class TokenDtoIn {
    @NotEmpty
    private String token;
}
