package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.*;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LikeCountDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.AccountServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.LikeService;
import edu.bbte.licensz.slim2299.recowrite.services.UserServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private AccountServiceInterface accountService;

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

    @PutMapping("/name")
    public ResponseEntity<?> changeName(HttpServletRequest request, @RequestBody UserNameDtoIn userNameDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.updateName(jwtUtil.extractUsername(cookie.getValue()), userNameDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User name updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }

    @PutMapping("/email")
    public ResponseEntity<?> changeEmail(HttpServletRequest request, @RequestBody @Valid UserEmailDtoIn userEmailDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.updateEmail(jwtUtil.extractUsername(cookie.getValue()), userEmailDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User email updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(HttpServletRequest request, @RequestBody @Valid UserPasswordChangeDtoIn userPasswordChangeDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.updatePassword(jwtUtil.extractUsername(cookie.getValue()), userPasswordChangeDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User password updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> changeAvatar(HttpServletRequest request, @RequestBody @Valid UserAvatarDtoIn userAvatarDtoIn) throws IOException {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.uploadAvatar(jwtUtil.extractUsername(cookie.getValue()), userAvatarDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User avatar updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut("Auth token not found"));
    }
}
