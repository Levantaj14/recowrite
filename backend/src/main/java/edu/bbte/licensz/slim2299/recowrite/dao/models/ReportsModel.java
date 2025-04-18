package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "reports")
public class ReportsModel extends BaseEntity {
    public enum ReportStatus {
        OPEN,
        DISMISSED,
        STRIKE_GIVEN
    }

    private long reporterId;
    private long reportedUserId;
    private String contentType;
    private long contentId;
    private String reason;

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.OPEN;

    private Date reportDate;
}

