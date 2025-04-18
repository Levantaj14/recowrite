package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportsModel;
import edu.bbte.licensz.slim2299.recowrite.services.ReportsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final ReportsServiceInterface reportsService;

    @Autowired
    public AdminController(ReportsServiceInterface reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping()
    public ResponseEntity<MessageDtoOut> test() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new MessageDtoOut("Admin endpoint accessible"));
    }

    @GetMapping("/strikes")
    public ResponseEntity<?> getStrikes() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("To be implemented");
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportsModel>> getReports() {
        return ResponseEntity.ok(reportsService.getAllReports());
    }
}
