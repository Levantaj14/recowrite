package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.StrikeDtoIn;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.ReportManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.StrikeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.StrikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.ReportNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.StrikeNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StrikeService implements StrikeServiceInterface {
    private final StrikeManager strikeManager;
    private final UserManager userManager;
    private final ReportManager reportManager;
    private final MailServiceInterface mailService;

    @Autowired
    public StrikeService(StrikeManager strikeManager, UserManager userManager, ReportManager reportManager, MailServiceInterface mailService) {
        this.strikeManager = strikeManager;
        this.userManager = userManager;
        this.reportManager = reportManager;
        this.mailService = mailService;
    }

    @Override
    public List<StrikeModel> getAllStrikes() {
        return strikeManager.findAll();
    }

    @Override
    public List<StrikeModel> getUserStrikes(String username) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User " + username + " not found");
        }
        UserModel userModel = user.get();
        return strikeManager.findAllByUserId(userModel.getId());
    }

    @Override
    public long addStrike(String adminUsername, StrikeDtoIn strike) {
        Optional<UserModel> admin = userManager.findByUsername(adminUsername);
        if (admin.isEmpty()) {
            throw new UserNotFoundException("User " + adminUsername + " not found");
        }
        Optional<ReportModel> report = reportManager.findById(strike.getReportId());
        if (report.isEmpty()) {
            throw new ReportNotFoundException("Report " + strike.getReportId() + " not found");
        }
        ReportModel reportModel = report.get();
        UserModel adminModel = admin.get();
        StrikeModel strikeModel = new StrikeModel();
        strikeModel.setAdmin(adminModel);
        strikeModel.setEvaluated(new Date());
        strikeModel.setNote(strike.getNote());
        strikeModel.setReport(reportModel);
        strikeModel.setUser(reportModel.getReportedUser());
        long strikeId = strikeManager.save(strikeModel).getId();

        Map<String, String> model = new ConcurrentHashMap<>();
        model.put("username", reportModel.getReportedUser().getUsername());
        model.put("date", String.valueOf(strikeModel.getEvaluated()));
        model.put("blogTitle", reportModel.getBlog().getTitle());
        model.put("reason", reportModel.getReason());
        model.put("strikeNr", strikeManager.countByUser(reportModel.getReportedUser()));
        mailService.sendMessage(reportModel.getReportedUser().getEmail(), "Notice of Policy Violation",
                "strikeGiven", model, null);

        return strikeId;
    }

    @Override
    public void deleteStrike(long id) {
        Optional<StrikeModel> strike = strikeManager.findById(id);
        if (strike.isEmpty()) {
            throw new StrikeNotFoundException("Strike " + id + " not found");
        }
        UserModel user = strike.get().getReport().getReportedUser();
        strikeManager.delete(strike.get());

        Map<String, String> model = new ConcurrentHashMap<>();
        model.put("username", user.getUsername());
        model.put("strikeNr", strikeManager.countByUser(user));
        mailService.sendMessage(user.getEmail(), "Update on Your Strike",
                "strikeRemoved", model, null);
    }
}
