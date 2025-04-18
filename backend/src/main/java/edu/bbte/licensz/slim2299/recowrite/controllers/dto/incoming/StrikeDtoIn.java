package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StrikeDtoIn {
    private String note;

    @NotNull
    private long reportId;
}
