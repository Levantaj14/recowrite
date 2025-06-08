package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.*;
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
public class ReportModel extends BaseEntity {
    public enum ReportStatus {
        OPEN,
        DISMISSED,
        STRIKE_GIVEN
    }

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel reporter;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel reportedUser;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private BlogModel blog;

    private String reason;

    private String note;

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.OPEN;

    private Date reportDate;

    @ManyToOne(fetch = FetchType.EAGER)
    private UserModel reviewer;
}

