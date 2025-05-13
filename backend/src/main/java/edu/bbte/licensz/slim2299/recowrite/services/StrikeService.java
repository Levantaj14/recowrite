package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.StrikeDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.StrikeDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.ReportManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.StrikeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.StrikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.StrikeMapper;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.ReportClosedException;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.ReportNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.StrikeNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StrikeService implements StrikeServiceInterface {
    private final StrikeManager strikeManager;
    private final StrikeMapper strikeMapper;
    private final UserManager userManager;
    private final ReportManager reportManager;
    private final MailServiceInterface mailService;

    @Autowired
    public StrikeService(StrikeManager strikeManager, StrikeMapper strikeMapper, UserManager userManager, ReportManager reportManager, MailServiceInterface mailService) {
        this.strikeManager = strikeManager;
        this.strikeMapper = strikeMapper;
        this.userManager = userManager;
        this.reportManager = reportManager;
        this.mailService = mailService;
    }

    @Override
    public List<StrikeDtoOut> getAllStrikes() {
        List<StrikeDtoOut> strikes = new ArrayList<>();
        List<StrikeModel> strikeModels = strikeManager.findAll();
        for (StrikeModel strikeModel : strikeModels) {
            StrikeDtoOut strikeDto = strikeMapper.modelToDto(strikeModel);
            strikes.add(strikeDto);
        }
        return strikes;
    }

    @Override
    public List<StrikeDtoOut> getUserStrikes(String username) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User " + username + " not found");
        }
        UserModel userModel = user.get();
        List<StrikeDtoOut> strikes = new ArrayList<>();
        List<StrikeModel> strikeModels = strikeManager.findAllByUserId(userModel.getId());
        for (StrikeModel strikeModel : strikeModels) {
            StrikeDtoOut strikeDto = strikeMapper.modelToDto(strikeModel);
            strikes.add(strikeDto);
        }
        return strikes;
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

        if (!"OPEN".equals(String.valueOf(reportModel.getStatus()))) {
            throw new ReportClosedException("Report " + strike.getReportId() + " is closed");
        }

        UserModel adminModel = admin.get();
        StrikeModel strikeModel = new StrikeModel();
        strikeModel.setAdmin(adminModel);
        strikeModel.setEvaluated(new Date());
        strikeModel.setReport(reportModel);
        strikeModel.setUser(reportModel.getReportedUser());
        long strikeId = strikeManager.save(strikeModel).getId();

        reportModel.setNote(strike.getNote());
        reportModel.setStatus(ReportModel.ReportStatus.valueOf("STRIKE_GIVEN"));
        reportManager.save(reportModel);

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
        ReportModel reportModel = strike.get().getReport();
        removeStrikeAndSendMail(strike.get(), user, reportModel);
    }

    @Override
    public void deleteStrikeFromReport(long id) {
        Optional<ReportModel> report = reportManager.findById(id);
        if (report.isEmpty()) {
            throw new ReportNotFoundException("Report " + id + " not found");
        }
        Optional<StrikeModel> strike = strikeManager.findByReport(report.get());
        if (strike.isEmpty()) {
            throw new StrikeNotFoundException("Strike " + id + " not found");
        }
        UserModel user = strike.get().getReport().getReportedUser();
        ReportModel reportModel = report.get();
        removeStrikeAndSendMail(strike.get(), user, reportModel);
    }

    private void removeStrikeAndSendMail(StrikeModel strike, UserModel user, ReportModel reportModel) {
        strikeManager.delete(strike);

        reportModel.setStatus(ReportModel.ReportStatus.valueOf("DISMISSED"));
        reportManager.save(reportModel);

        Map<String, String> model = new ConcurrentHashMap<>();
        model.put("username", user.getUsername());
        model.put("strikeNr", strikeManager.countByUser(user));
        mailService.sendMessage(user.getEmail(), "An Update on Your Strike",
                "strikeRemoved", model, null);
    }
}
