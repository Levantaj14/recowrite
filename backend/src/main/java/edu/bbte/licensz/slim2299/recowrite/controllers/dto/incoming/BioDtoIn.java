package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BioDtoIn {
    @Size(max = 255)
    private String bio;
}
