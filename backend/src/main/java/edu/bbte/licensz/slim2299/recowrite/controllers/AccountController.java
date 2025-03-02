package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.SettingsDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LikeCountDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.LikeService;
import edu.bbte.licensz.slim2299.recowrite.services.UserServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private UserServiceInterface userService;

    @Autowired
    private AuthCookieFinder authCookieFinder;

    @Autowired
    private LikeService likeService;

    @Autowired
    private JwtUtil jwtUtil;

    @PutMapping("/preferences")
    public ResponseEntity<?> updateSettings(HttpServletRequest request, @RequestBody SettingsDtoIn settingsDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            userService.updateUserPreferences(jwtUtil.extractUsername(cookie.getValue()), settingsDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User preferences updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }

    @GetMapping("/likes/given")
    public ResponseEntity<?> getGivenLikes(HttpServletRequest request) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            return ResponseEntity.status(HttpStatus.OK).body(likeService.getLikedBlogs(jwtUtil.extractUsername(cookie.getValue())));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }

    @GetMapping("/likes/received")
    public ResponseEntity<?> getReceivedLikes(HttpServletRequest request) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            return ResponseEntity.status(HttpStatus.OK).body(new LikeCountDtoOut(likeService.receivedLikeCount(jwtUtil.extractUsername(cookie.getValue()))));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }
}
