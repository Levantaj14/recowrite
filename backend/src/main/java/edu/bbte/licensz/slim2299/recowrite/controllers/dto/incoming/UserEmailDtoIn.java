package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserEmailDtoIn {
    @NotNull
    @Size(min = 1, max = 255)
    @Email
    private String email;
}
