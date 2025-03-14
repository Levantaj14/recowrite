package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserPasswordChangeDtoIn {
    @NotEmpty
    private String oldPassword;

    @Size(min = 8)
    private String newPassword;
}
