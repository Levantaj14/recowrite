package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportStatusDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.ReportDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.AccountServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.BlogService;
import edu.bbte.licensz.slim2299.recowrite.services.ReportServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.UserServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final ReportServiceInterface reportService;
    private final AccountServiceInterface accountService;
    private final UserServiceInterface userService;
    private final AuthCookieFinder authCookieFinder;
    private final JwtUtil jwtUtil;
    private final BlogService blogService;

    @Autowired
    public AdminController(ReportServiceInterface reportService, AccountServiceInterface accountService,
                           UserServiceInterface userService, AuthCookieFinder authCookieFinder, JwtUtil jwtUtil, BlogService blogService) {
        this.reportService = reportService;
        this.accountService = accountService;
        this.userService = userService;
        this.authCookieFinder = authCookieFinder;
        this.jwtUtil = jwtUtil;
        this.blogService = blogService;
    }

    @GetMapping()
    public ResponseEntity<MessageDtoOut> test() {
        return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Admin endpoint accessible"));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportDtoOut>> getReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ReportDtoOut> getReportsById(@PathVariable("id") long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @GetMapping("/blogs")
    public ResponseEntity<List<BlogDtoOut>> getBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogsAsAdmin());
    }

    @PutMapping("/reports")
    public ResponseEntity<MessageDtoOut> changeReportStatus(HttpServletRequest request, @RequestBody @Valid ReportStatusDtoIn reportStatusDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            reportService.changeStatus(jwtUtil.extractUsername(cookie.getValue()), reportStatusDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Report status changed successfully"));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @GetMapping("/admins")
    public ResponseEntity<List<UserDtoOut>> getAdminAccounts() {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getAdminUsers());
    }

    @DeleteMapping("/account/{id}")
    public ResponseEntity<MessageDtoOut> deleteAccount(@PathVariable("id") long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Account removed successfully"));
    }

    @PutMapping("/account/{id}")
    public ResponseEntity<MessageDtoOut> changeRole(@PathVariable("id") long id) {
        accountService.changeRole(id);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Account role changed successfully"));
    }
}
