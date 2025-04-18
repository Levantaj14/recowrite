package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportDtoIn;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.ReportManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.ReportNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService implements ReportServiceInterface {
    private final ReportManager reportManager;
    private final BlogManager blogManager;
    private final UserManager userManager;

    @Autowired
    public ReportService(ReportManager reportManager, BlogManager blogManager, UserManager userManager) {
        this.reportManager = reportManager;
        this.blogManager = blogManager;
        this.userManager = userManager;
    }

    @Override
    public List<ReportModel> getAllReports() {
        return reportManager.findAll();
    }

    @Override
    public ReportModel getReportById(long id) {
        Optional<ReportModel> reportsModel = reportManager.findById(id);
        if(reportsModel.isPresent()) {
            return reportsModel.get();
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
}
