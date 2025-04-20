package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportDtoIn;
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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService implements ReportServiceInterface {
    private final ReportManager reportManager;
    private final BlogManager blogManager;
    private final UserManager userManager;
    private final ReportsMapper reportsMapper;

    @Autowired
    public ReportService(ReportManager reportManager, BlogManager blogManager, UserManager userManager, ReportsMapper reportsMapper) {
        this.reportManager = reportManager;
        this.blogManager = blogManager;
        this.userManager = userManager;
        this.reportsMapper = reportsMapper;
    }

    @Override
    public List<ReportDtoOut> getAllReports() {
        List<ReportModel> reportsModel = reportManager.findAll();
        List <ReportDtoOut> reportDtoOutList = new ArrayList<>();
        for (ReportModel reportModel : reportsModel) {
            reportDtoOutList.add(reportsMapper.modelToDto(reportModel));
        }
        return reportDtoOutList;
    }

    @Override
    public ReportDtoOut getReportById(long id) {
        Optional<ReportModel> reportsModel = reportManager.findById(id);
        if(reportsModel.isPresent()) {
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
        reportModel.setReportDate(new Date());
        reportModel.setReportedUser(blogModel.getUser());
        reportModel.setReporter(reporterUser);
        return reportManager.save(reportModel).getId();
    }

    @Override
    public void dismissReport(String username, long id) {
        Optional<UserModel> admin = userManager.findByUsername(username);
        if (admin.isEmpty()) {
            throw new UserNotFoundException("User " + username + " not found");
        }
        Optional<ReportModel> report = reportManager.findById(id);
        if (report.isEmpty()) {
            throw new ReportNotFoundException("Report with id " + id + " not found");
        }
        UserModel adminUser = admin.get();
        ReportModel reportModel = report.get();

    }
}
