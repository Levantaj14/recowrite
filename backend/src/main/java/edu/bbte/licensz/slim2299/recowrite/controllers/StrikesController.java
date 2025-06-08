package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.StrikeDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.StrikeService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/strikes")
public class StrikesController {
    private final AuthCookieFinder authCookieFinder;
    private final JwtUtil jwtUtil;
    private final StrikeService strikeService;

    @Autowired
    public StrikesController(AuthCookieFinder authCookieFinder, JwtUtil jwtUtil, StrikeService strikeService) {
        this.authCookieFinder = authCookieFinder;
        this.jwtUtil = jwtUtil;
        this.strikeService = strikeService;
    }

    @GetMapping
    public ResponseEntity<?> getStrikeCount(HttpServletRequest request) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            int count = strikeService.getStrikeCount(jwtUtil.extractUsername(cookie.getValue()));
            return ResponseEntity.status(HttpStatus.OK).body(new StrikeDtoOut(count));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }
}
