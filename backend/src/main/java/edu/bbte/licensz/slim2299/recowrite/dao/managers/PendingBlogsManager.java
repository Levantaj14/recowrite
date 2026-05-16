package edu.bbte.licensz.slim2299.recowrite.dao.managers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.PendingBlog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingBlogsManager extends JpaRepository<PendingBlog, Long> {
}
