package edu.bbte.licensz.slim2299.recowrite.controllers.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignUpDtoIn {
    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    @Size(max = 255)
    private String username;

    @NotNull
    @Size(max = 255)
    @Email
    private String email;

    @NotNull
    @Size(min = 8, max = 255)
    private String password;
}
