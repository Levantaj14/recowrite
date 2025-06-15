package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.*;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LoginDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.AuthServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.TokenServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {
    private final AuthServiceInterface authenticationService;
    private final JwtUtil jwtUtil;
    private final AuthCookieFinder authCookieFinder;
    private final TokenServiceInterface tokenService;

    @Autowired
    public AuthenticationController(AuthServiceInterface authenticationService, JwtUtil jwtUtil, AuthCookieFinder authCookieFinder, TokenServiceInterface tokenService) {
        this.authenticationService = authenticationService;
        this.jwtUtil = jwtUtil;
        this.authCookieFinder = authCookieFinder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginDtoOut> login(@RequestBody @Valid LoginDtoIn loginDtoIn) {
        ResponseCookie cookie = ResponseCookie.from("auth", authenticationService.login(loginDtoIn))
                .httpOnly(true)
                .maxAge(7 * 24 * 60 * 60)
                .path("/")
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(authenticationService.getNecessaryUserData(loginDtoIn.getUsername()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpDtoIn signUpDtoIn) {
        authenticationService.signup(signUpDtoIn);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageDtoOut("A verification email has been sent."));
    }

    @PostMapping("/verify/email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        String jwt = authenticationService.validateEmail(token);
        ResponseCookie cookie = ResponseCookie.from("auth", jwt)
                .httpOnly(true)
                .maxAge(7 * 24 * 60 * 60)
                .path("/")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(authenticationService.getNecessaryUserData(jwtUtil.extractUsername(jwt)));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageDtoOut> logout(HttpServletRequest request) {
        Cookie authCookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (authCookie != null) {
            ResponseCookie cookie = ResponseCookie.from("auth", "")
                    .httpOnly(true)
                    .maxAge(0)
                    .path("/")
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new MessageDtoOut("Logged out successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Not logged in"));
    }

    @GetMapping("/check")
    public ResponseEntity<?> check(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth".equals(cookie.getName())) {
                    return ResponseEntity.status(HttpStatus.OK)
                            .body(authenticationService.getNecessaryUserData(jwtUtil.extractUsername(cookie.getValue())));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid TokenPasswordDtoIn tokenPasswordDtoIn) {
        tokenService.changePassword(tokenPasswordDtoIn);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Password reset successfully"));
    }

    @PostMapping("/forgot-password/validate")
    public ResponseEntity<?> validateToken(@RequestBody @Valid TokenDtoIn tokenDtoIn) {
        tokenService.validatePasswordToken(tokenDtoIn.getToken());
        return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Token validated successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid EmailDtoIn emailDtoIn) {
        tokenService.createPasswordToken(emailDtoIn);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Forgot password request received"));
    }
}
