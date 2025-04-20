package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.StrikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StrikeManager extends JpaRepository<StrikeModel, Long> {
    List<StrikeModel> findAllByUserId(long userId);

    String countByUser(UserModel user);

    Optional<StrikeModel> findByReport(ReportModel report);
}
