package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "reports")
public class ReportModel extends BaseEntity {
    public enum ReportStatus {
        OPEN,
        DISMISSED,
        STRIKE_GIVEN
    }

    @ManyToOne(fetch = FetchType.LAZY)
    private UserModel reporter;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private UserModel reportedUser;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private BlogModel blog;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private ReportReasonsModel reason;

    private String note;

    private boolean unrevocable;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    private LocalDateTime reportDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserModel reviewer;
}

