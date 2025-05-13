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
@Table(name = "strikes")
public class StrikeModel extends BaseEntity {
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel user;

    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private ReportModel report;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel admin;

    private Date evaluated;
}