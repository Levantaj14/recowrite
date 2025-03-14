package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.LikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeManager extends JpaRepository<LikeModel, Long> {
    Optional<LikeModel> findByBlog_IdAndUser(long blogId, UserModel user);

    long countByBlog_Id(long blogId);

    Optional<List<LikeModel>> findAllByUser(UserModel user);

    Optional<List<LikeModel>> findAllByBlogUser(UserModel user);
}
