package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportReasonsModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportReasonsManager extends JpaRepository<ReportReasonsModel, Long> {
    Optional<ReportReasonsModel> findByLabel(String label);
}
