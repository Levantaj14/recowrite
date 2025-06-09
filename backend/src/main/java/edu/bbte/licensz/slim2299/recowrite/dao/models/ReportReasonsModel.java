package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "report_reasons")
public class ReportReasonsModel extends BaseEntity {
    private String label;

    @OneToMany(mappedBy = "reason", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ReportModel> reports;
}
