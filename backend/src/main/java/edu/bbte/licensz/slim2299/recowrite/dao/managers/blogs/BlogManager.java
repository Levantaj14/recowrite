package edu.bbte.licensz.slim2299.recowrite.dao.managers.blogs;

import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogManager extends JpaRepository<BlogModel, Long> {
    Optional<List<BlogModel>> findByUser(UserModel user);
}
