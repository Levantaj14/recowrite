package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.*;
import edu.bbte.licensz.slim2299.recowrite.services.AccountServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.ReportServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.UserServiceInterface;
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
    @Autowired
    public AdminController(ReportServiceInterface reportService, AccountServiceInterface accountService,
                           UserServiceInterface userService) {
        this.reportService = reportService;
        this.accountService = accountService;
        this.userService = userService;
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

    @PutMapping("/reports/{id}")
    public ResponseEntity<MessageDtoOut> dismissReport(@PathVariable("id") long id) {
        reportService.dismissReport(id);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Report dismissed successfully"));
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
