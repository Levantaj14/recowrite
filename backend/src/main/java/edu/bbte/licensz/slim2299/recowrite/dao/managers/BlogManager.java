package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogManager extends JpaRepository<BlogModel, Long> {
    Optional<List<BlogModel>> findByUserAndVisible(UserModel user, boolean visible);

    Optional<BlogModel> findByIdAndVisible(long id, boolean visible);

    BlogModel[] findAllByVisible(boolean visible);
}
