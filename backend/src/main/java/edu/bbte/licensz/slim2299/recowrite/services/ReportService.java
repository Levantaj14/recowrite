package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportStatusDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.ReportDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.ReportManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.ReportsMapper;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.ReportNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ReportService implements ReportServiceInterface {
    private final ReportManager reportManager;
    private final BlogManager blogManager;
    private final UserManager userManager;
    private final ReportsMapper reportsMapper;
    private final StrikeServiceInterface strikeService;

    @Autowired
    public ReportService(ReportManager reportManager, BlogManager blogManager, UserManager userManager,
                         ReportsMapper reportsMapper, StrikeServiceInterface strikeService) {
        this.reportManager = reportManager;
        this.blogManager = blogManager;
        this.userManager = userManager;
        this.reportsMapper = reportsMapper;
        this.strikeService = strikeService;
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
        Optional<BlogModel> blog = blogManager.findByIdAndVisible(report.getBlogId(), true);
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
            strikeService.handleStrikeGiven(reportModel);
        }
    }

    private void reportReopened(ReportModel reportModel) {
        if (reportModel.getStatus().equals(ReportModel.ReportStatus.STRIKE_GIVEN)) {
            strikeService.handleStrikeRemoved(reportModel);
        }

        reportModel.setStatus(ReportModel.ReportStatus.OPEN);
        reportModel.setReviewer(null);
        reportModel.setNote("");
        reportManager.save(reportModel);
    }
}
