package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserEmailDtoIn {
    @NotEmpty
    @NotEmpty
    @Size(max = 255)
    private String email;
}
