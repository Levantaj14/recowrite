package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.ReportDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.IdDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.ReportsServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/report")
public class ReportController {
    private final ReportsServiceInterface reportsService;
    private final AuthCookieFinder authCookieFinder;
    private final JwtUtil jwtUtil;

    @Autowired
    public ReportController(ReportsServiceInterface reportsService, AuthCookieFinder authCookieFinder, JwtUtil jwtUtil) {
        this.reportsService = reportsService;
        this.authCookieFinder = authCookieFinder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping()
    public ResponseEntity<IdDtoOut> report(HttpServletRequest request, @RequestBody @Valid ReportDtoIn reportDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            long response = reportsService.addReport(reportDtoIn, jwtUtil.extractUsername(cookie.getValue()));
            if (response > 0) {
                return ResponseEntity.ok(new IdDtoOut(response));
            }
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
