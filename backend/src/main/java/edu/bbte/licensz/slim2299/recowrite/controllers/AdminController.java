package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.StrikeDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.IdDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.ReportModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.StrikeModel;
import edu.bbte.licensz.slim2299.recowrite.services.ReportServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.StrikeServiceInterface;
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
    private final StrikeServiceInterface strikeService;
    private final AuthCookieFinder authCookieFinder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AdminController(ReportServiceInterface reportService, StrikeServiceInterface strikeService, AuthCookieFinder authCookieFinder, JwtUtil jwtUtil) {
        this.reportService = reportService;
        this.strikeService = strikeService;
        this.authCookieFinder = authCookieFinder;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public ResponseEntity<MessageDtoOut> test() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new MessageDtoOut("Admin endpoint accessible"));
    }

    @GetMapping("/strike")
    public ResponseEntity<List<StrikeModel>> getStrikes() {
        return ResponseEntity.ok(strikeService.getAllStrikes());
    }

    @PostMapping("/strike")
    public ResponseEntity<IdDtoOut> addStrike(HttpServletRequest request, @RequestBody @Valid StrikeDtoIn strikeDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            long response = strikeService.addStrike(jwtUtil.extractUsername(cookie.getValue()), strikeDtoIn);
            return ResponseEntity.ok(new IdDtoOut(response));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @DeleteMapping("/strike/{id}")
    public ResponseEntity<MessageDtoOut> deleteStrike(@PathVariable("id") long id) {
        strikeService.deleteStrike(id);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Strike revoked successfully"));
    }

    @GetMapping("/report")
    public ResponseEntity<List<ReportModel>> getReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("report/{id}")
    public ResponseEntity<ReportModel> getReportsById(@PathVariable("id") long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }
}
