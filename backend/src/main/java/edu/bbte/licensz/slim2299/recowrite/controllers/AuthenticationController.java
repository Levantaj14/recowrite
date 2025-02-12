package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.LoginDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.SignUpDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.UserDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.AuthServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.UserServiceInterface;
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

    @Autowired
    private AuthServiceInterface authenticationService;
    @Autowired
    private UserServiceInterface userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<UserDtoOut> login(@RequestBody @Valid LoginDtoIn loginDtoIn) {
        ResponseCookie cookie = ResponseCookie.from("auth", authenticationService.login(loginDtoIn))
                .httpOnly(true)
                .maxAge(7 * 24 * 60 * 60)
                .path("/")
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(userService.returnUserByUsername(loginDtoIn.getUsername()));
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDtoOut> signUp(@RequestBody @Valid SignUpDtoIn signUpDtoIn) {
        ResponseCookie cookie = ResponseCookie.from("auth", authenticationService.signup(signUpDtoIn))
                .httpOnly(true)
                .maxAge(7 * 24 * 60 * 60)
                .path("/")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(userService.returnUserByUsername(signUpDtoIn.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageDtoOut> logout(HttpServletRequest request) {
        Cookie authCookie = serachAuthCookie(request.getCookies());
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
                            .body(userService.returnUserByUsername(jwtUtil.extractUsername(cookie.getValue())));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }

    private Cookie serachAuthCookie(Cookie... cookies) {
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth".equals(cookie.getName())) {
                    return cookie;
                }
            }
        }
        return null;
    }
}
