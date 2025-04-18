package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.Entity;
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
@Table(name = "strikes")
public class StrikesModel extends BaseEntity {
    private long userId;
    private long reportId;
    private long adminId;
    private String reason;
    private String note;
    private Date evaluated;
}
