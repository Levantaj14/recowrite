package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.StrikeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.StrikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StrikeService implements StrikeServiceInterface {
    private final StrikeManager strikeManager;
    private final BlogManager blogManager;
    private final MailServiceInterface mailService;
    private final RecommendationService recommendationService;
    private final UserManager userManager;

    @Autowired
    public StrikeService(StrikeManager strikeManager, BlogManager blogManager, MailServiceInterface mailService,
                         RecommendationService recommendationService, UserManager userManager) {
        this.strikeManager = strikeManager;
        this.blogManager = blogManager;
        this.mailService = mailService;
        this.recommendationService = recommendationService;
        this.userManager = userManager;
    }

    @Override
    public int getStrikeCount(String username) {
        Optional<UserModel> userModel = userManager.findByUsername(username);
        if (userModel.isEmpty()) {
            throw new UserNotFoundException("User " + username + " not found");
        }
        String count = strikeManager.countByUser(userModel.get());
        return Integer.parseInt(count);
    }

    @Override
    public void handleStrikeGiven(ReportModel reportModel) {
        StrikeModel strikeModel = new StrikeModel();
        LocalDateTime now = LocalDateTime.now();
        strikeModel.setEvaluated(now);
        strikeModel.setReport(reportModel);
        strikeModel.setUser(reportModel.getReportedUser());
        strikeManager.save(strikeModel);

        BlogModel blogModel = reportModel.getBlog();
        blogModel.setVisible(false);
        blogManager.save(blogModel);
        recommendationService.removeRecommendation(blogModel.getId());

        // Notifying the user about the strike and giving more details about it
        Map<String, String> model = new ConcurrentHashMap<>();
        model.put("username", reportModel.getReportedUser().getUsername());
        model.put("date", strikeModel.getEvaluated().atZone(java.time.ZoneId.systemDefault())
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm z")));
        model.put("blogTitle", reportModel.getBlog().getTitle());
        model.put("reason", reportModel.getReason().getLabel());
        model.put("strikeNr", strikeManager.countByUser(reportModel.getReportedUser()));
        mailService.sendMessage(reportModel.getReportedUser().getEmail(), "Notice of Policy Violation",
                "strikeGiven", model, null);
    }

    @Override
    public void handleStrikeRemoved(ReportModel reportModel) {
        Optional<StrikeModel> strikeModel = strikeManager.findByReport(reportModel);
        if (strikeModel.isEmpty()) {
            return;
        }
        strikeManager.delete(strikeModel.get());

        BlogModel blogModel = reportModel.getBlog();
        blogModel.setVisible(true);
        blogManager.save(blogModel);
        recommendationService.addRecommendation(blogModel.getId());

        UserModel user = reportModel.getReportedUser();
        Map<String, String> model = new ConcurrentHashMap<>();
        model.put("username", user.getUsername());
        model.put("strikeNr", strikeManager.countByUser(user));
        mailService.sendMessage(user.getEmail(), "An Update on Your Strike",
                "strikeRemoved", model, null);
    }
}
