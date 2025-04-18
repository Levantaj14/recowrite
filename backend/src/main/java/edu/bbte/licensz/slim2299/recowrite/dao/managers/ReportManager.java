package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportManager extends JpaRepository<ReportModel, Long> {
}
