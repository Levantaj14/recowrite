package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportStatusDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.ReportDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.ReportManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.StrikeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.StrikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.ReportsMapper;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.ReportNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ReportService implements ReportServiceInterface {
    private final ReportManager reportManager;
    private final BlogManager blogManager;
    private final UserManager userManager;
    private final ReportsMapper reportsMapper;
    private final StrikeManager strikeManager;
    private final MailServiceInterface mailService;
    private final UserService userService;

    @Autowired
    public ReportService(ReportManager reportManager, BlogManager blogManager, UserManager userManager,
                         ReportsMapper reportsMapper, StrikeManager strikeManager, MailServiceInterface mailService, UserService userService) {
        this.reportManager = reportManager;
        this.blogManager = blogManager;
        this.userManager = userManager;
        this.reportsMapper = reportsMapper;
        this.strikeManager = strikeManager;
        this.mailService = mailService;
        this.userService = userService;
    }

    @Override
    public List<ReportDtoOut> getAllReports() {
        List<ReportModel> reportsModel = reportManager.findAll();
        List<ReportDtoOut> reportDtoOutList = new ArrayList<>();
        for (ReportModel reportModel : reportsModel) {
            reportDtoOutList.add(reportsMapper.modelToDto(reportModel));
        }
        return reportDtoOutList;
    }

    @Override
    public ReportDtoOut getReportById(long id) {
        Optional<ReportModel> reportsModel = reportManager.findById(id);
        if (reportsModel.isPresent()) {
            return reportsMapper.modelToDto(reportsModel.get());
        }
        throw new ReportNotFoundException("Report with id " + id + " not found");
    }

    @Override
    public long addReport(ReportDtoIn report, String username) {
        Optional<UserModel> reporter = userManager.findByUsername(username);
        if (reporter.isEmpty()) {
            throw new UserNotFoundException("User " + username + " not found");
        }
        UserModel reporterUser = reporter.get();
        Optional<BlogModel> blog = blogManager.findById(report.getBlogId());
        if (blog.isEmpty()) {
            throw new BlogNotFoundException("Blog " + report.getBlogId() + " not found");
        }
        BlogModel blogModel = blog.get();
        ReportModel reportModel = new ReportModel();
        reportModel.setBlog(blogModel);
        reportModel.setReason(report.getReason());
        LocalDateTime now = LocalDateTime.now();
        reportModel.setReportDate(now);
        reportModel.setReportedUser(blogModel.getUser());
        reportModel.setReporter(reporterUser);
        return reportManager.save(reportModel).getId();
    }

    @Override
    public void changeStatus(String adminUsername, ReportStatusDtoIn reportStatusDtoIn) {
        Optional<ReportModel> report = reportManager.findById(reportStatusDtoIn.getReportId());
        if (report.isEmpty()) {
            throw new ReportNotFoundException("Report with id " + reportStatusDtoIn.getReportId() + " not found");
        }

        ReportModel reportModel = report.get();
        if (ReportModel.ReportStatus.OPEN.equals(reportStatusDtoIn.getReportStatus())) {
            reportReopened(reportModel);
            return;
        }

        Optional<UserModel> admin = userManager.findByUsername(adminUsername);
        if (admin.isEmpty()) {
            throw new UserNotFoundException("User " + adminUsername + " not found");
        }
        UserModel adminUser = admin.get();
        reportModel.setStatus(reportStatusDtoIn.getReportStatus());
        reportModel.setReviewer(adminUser);
        if (!"".equals(reportStatusDtoIn.getNote())) {
            reportModel.setNote(reportStatusDtoIn.getNote());
        }
        reportManager.save(reportModel);

        if (ReportModel.ReportStatus.STRIKE_GIVEN.equals(reportStatusDtoIn.getReportStatus())) {
            strikeGiven(reportModel);
        }
    }

    private void reportReopened(ReportModel reportModel) {
        if (reportModel.getStatus().equals(ReportModel.ReportStatus.STRIKE_GIVEN)) {
            Optional<StrikeModel> strikeModel = strikeManager.findByReport(reportModel);
            if (strikeModel.isEmpty()) {
                return;
            }
            strikeManager.delete(strikeModel.get());

            UserModel user = reportModel.getReportedUser();
            Map<String, String> model = new ConcurrentHashMap<>();
            model.put("username", user.getUsername());
            model.put("strikeNr", strikeManager.countByUser(user));
            mailService.sendMessage(user.getEmail(), "An Update on Your Strike",
                    "strikeRemoved", model, null);

        }

        reportModel.setStatus(ReportModel.ReportStatus.OPEN);
        reportModel.setReviewer(null);
        reportModel.setNote("");
        reportManager.save(reportModel);
    }

    private void strikeGiven(ReportModel reportModel) {
        StrikeModel strikeModel = new StrikeModel();
        LocalDateTime now = LocalDateTime.now();
        strikeModel.setEvaluated(now);
        strikeModel.setReport(reportModel);
        strikeModel.setUser(reportModel.getReportedUser());
        strikeManager.save(strikeModel);

        Map<String, String> model = new ConcurrentHashMap<>();
        model.put("username", reportModel.getReportedUser().getUsername());
        model.put("date", String.valueOf(strikeModel.getEvaluated()));
        model.put("blogTitle", reportModel.getBlog().getTitle());
        model.put("reason", reportModel.getReason());
        model.put("strikeNr", strikeManager.countByUser(reportModel.getReportedUser()));
        mailService.sendMessage(reportModel.getReportedUser().getEmail(), "Notice of Policy Violation",
                "strikeGiven", model, null);
    }
}
