package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.*;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LikeCountDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.AccountServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.CommentService;
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
    private static final String AUTH_TOKEN_NOT_FOUND = "Auth token not found";
    private final AccountServiceInterface accountService;
    private final UserServiceInterface userService;
    private final AuthCookieFinder authCookieFinder;
    private final LikeService likeService;
    private final CommentService commentService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AccountController(AccountServiceInterface accountService, UserServiceInterface userService, AuthCookieFinder authCookieFinder, LikeService likeService, CommentService commentService, JwtUtil jwtUtil) {
        this.accountService = accountService;
        this.userService = userService;
        this.authCookieFinder = authCookieFinder;
        this.likeService = likeService;
        this.commentService = commentService;
        this.jwtUtil = jwtUtil;
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updateSettings(HttpServletRequest request, @RequestBody @Valid SettingsDtoIn settingsDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            userService.updateUserPreferences(jwtUtil.extractUsername(cookie.getValue()), settingsDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User preferences updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @GetMapping("/likes/given")
    public ResponseEntity<?> getGivenLikes(HttpServletRequest request) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            return ResponseEntity.status(HttpStatus.OK).body(likeService.getLikedBlogs(jwtUtil.extractUsername(cookie.getValue())));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @GetMapping("/likes/received")
    public ResponseEntity<?> getReceivedLikes(HttpServletRequest request) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            return ResponseEntity.status(HttpStatus.OK).body(new LikeCountDtoOut(likeService.receivedLikeCount(jwtUtil.extractUsername(cookie.getValue()))));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getComments(HttpServletRequest request) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            return ResponseEntity.status(HttpStatus.OK).body(commentService.findAllByAccount(jwtUtil.extractUsername(cookie.getValue())));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @PutMapping("/name")
    public ResponseEntity<?> changeName(HttpServletRequest request, @RequestBody @Valid UserNameDtoIn userNameDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.updateName(jwtUtil.extractUsername(cookie.getValue()), userNameDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User name updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @PutMapping("/email")
    public ResponseEntity<?> changeEmail(HttpServletRequest request, @RequestBody @Valid UserEmailDtoIn userEmailDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.updateEmail(jwtUtil.extractUsername(cookie.getValue()), userEmailDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User email updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(HttpServletRequest request, @RequestBody @Valid UserPasswordChangeDtoIn userPasswordChangeDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.updatePassword(jwtUtil.extractUsername(cookie.getValue()), userPasswordChangeDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User password updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> changeAvatar(HttpServletRequest request, @RequestBody @Valid UserAvatarDtoIn userAvatarDtoIn) throws IOException {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.uploadAvatar(jwtUtil.extractUsername(cookie.getValue()), userAvatarDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User avatar updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @PutMapping("/socials")
    public ResponseEntity<?> chnageSocials(HttpServletRequest request, @RequestBody @Valid SocialDtoIn socialDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.updateSocial(jwtUtil.extractUsername(cookie.getValue()), socialDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("Social updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }

    @PutMapping("/bio")
    public ResponseEntity<?> changeBio(HttpServletRequest request, @RequestBody @Valid BioDtoIn bioDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            accountService.updateBio(jwtUtil.extractUsername(cookie.getValue()), bioDtoIn);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageDtoOut("User bio updated successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDtoOut(AUTH_TOKEN_NOT_FOUND));
    }
}
