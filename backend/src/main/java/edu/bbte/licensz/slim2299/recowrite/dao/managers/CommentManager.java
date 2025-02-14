package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.CommentModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentManager extends JpaRepository<CommentModel, Long> {
    Optional<List<CommentModel>> findAllByBlog_Id(long blogId);

    Optional<CommentModel> findByIdAndUser(long id, UserModel user);
}
