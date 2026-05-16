package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.AllowedHostsModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AllowedHostsManager extends JpaRepository<AllowedHostsModel, Long> {
    Optional<AllowedHostsModel> findByHostName(String hostName);
}
