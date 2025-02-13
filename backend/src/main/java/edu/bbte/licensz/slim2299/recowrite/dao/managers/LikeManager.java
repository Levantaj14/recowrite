package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.LikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeManager extends JpaRepository<LikeModel, Long> {
    Optional<LikeModel> findByIdAndUser(long id, UserModel user);

    long countByBlog(BlogModel blog);
}
