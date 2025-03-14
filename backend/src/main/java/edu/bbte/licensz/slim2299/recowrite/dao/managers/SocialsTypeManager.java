package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsTypesModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialsTypeManager extends JpaRepository<SocialsTypesModel, Long> {
    Optional<SocialsTypesModel> findByName(String name);
}
