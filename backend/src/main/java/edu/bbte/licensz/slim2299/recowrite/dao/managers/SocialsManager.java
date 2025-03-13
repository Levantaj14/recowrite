package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsTypesModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialsManager extends JpaRepository<SocialsModel, Long> {
    Optional<SocialsModel> findBySocialsTypeAndUser(SocialsTypesModel socialsType, UserModel user);
}
