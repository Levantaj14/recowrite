package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.TokenModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenManager extends JpaRepository<TokenModel, Long> {
    Optional<TokenModel> findByToken(String token);
}
