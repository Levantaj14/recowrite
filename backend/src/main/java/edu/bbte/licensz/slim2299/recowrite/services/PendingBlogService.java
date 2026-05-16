package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.dao.enums.ApproveStatus;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.*;
import edu.bbte.licensz.slim2299.recowrite.dao.models.*;
import edu.bbte.licensz.slim2299.recowrite.mappers.PendingBlogMapper;
import edu.bbte.licensz.slim2299.recowrite.services.dto.PendingBlogDtoOut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PendingBlogService implements PendingBlogServiceInterface {
    private final PendingBlogsManager pendingBlogsManager;
    private final PendingBlogMapper pendingBlogMapper;
    private final BlogManager blogManager;
    private final ReportManager reportManager;
    private final ReportReasonsManager reportReasonsManager;
    private final UserManager userManager;
    private final StrikeServiceInterface strikeService;

    @Autowired
    public PendingBlogService(PendingBlogsManager pendingBlogsManager, PendingBlogMapper pendingBlogMapper,
                              BlogManager blogManager, ReportManager reportManager, ReportReasonsManager reportReasonsManager,
                              UserManager userManager, StrikeServiceInterface strikeService) {
        this.pendingBlogsManager = pendingBlogsManager;
        this.pendingBlogMapper = pendingBlogMapper;
        this.blogManager = blogManager;
        this.reportManager = reportManager;
        this.reportReasonsManager = reportReasonsManager;
        this.userManager = userManager;
        this.strikeService = strikeService;
    }

    @Override
    public List<PendingBlogDtoOut> getPendingBlogs() {
        List<PendingBlog> pendingBlogs = pendingBlogsManager.findAll();
        return pendingBlogs.stream().map(pendingBlogMapper::toPendingBlogsDto).toList();
    }

    @Override
    public void changeStatus(Long blogId, ApproveStatus status, String reviewerUsername) {
        PendingBlog pendingBlog = pendingBlogsManager.findById(blogId)
                .orElseThrow(() -> new BlogNotFoundException("Pending blog with id " + blogId + " not found"));
        pendingBlog.setApproveStatus(status);
        if (status == ApproveStatus.APPROVED) {
            BlogModel blogModel = pendingBlog.getBlog();
            blogModel.setVisible(true);
            blogManager.save(blogModel);
        } else if (status == ApproveStatus.REJECTED) {
            ReportReasonsModel reportReasonsModel = reportReasonsManager.findByLabel("Malicious act").orElseThrow();
            UserModel reviewer = userManager.findByUsername(reviewerUsername)
                    .orElseThrow(() -> new UserNotFoundException("User with id " + reviewerUsername + " not found"));
            LocalDateTime now = LocalDateTime.now();
            ReportModel reportModel = ReportModel.builder()
                    .reporter(null)
                    .reportedUser(pendingBlog.getBlog().getUser())
                    .blog(pendingBlog.getBlog())
                    .reason(reportReasonsModel)
                    .note("Automatically flagged by the system due to malicious act, using the image URL feature")
                    .unrevocable(true)
                    .status(ReportModel.ReportStatus.STRIKE_GIVEN)
                    .reportDate(now)
                    .reviewer(reviewer)
                    .build();
            reportManager.save(reportModel);
            strikeService.handleStrikeGiven(reportModel);
        }
        pendingBlogsManager.save(pendingBlog);
    }
}
