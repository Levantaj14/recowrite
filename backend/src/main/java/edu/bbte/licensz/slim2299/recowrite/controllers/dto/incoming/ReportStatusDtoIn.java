package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import edu.bbte.licensz.slim2299.recowrite.dao.enums.ReportStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReportStatusDtoIn {
    @NotNull
    private long reportId;

    @NotNull
    private ReportStatus reportStatus;

    @Size(max = 255)
    private String note;
}
