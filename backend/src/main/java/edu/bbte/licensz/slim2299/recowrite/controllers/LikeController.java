package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LikeCountDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LikedDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.LikeServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class LikeController {
    private final LikeServiceInterface likeService;
    private final AuthCookieFinder authCookieFinder;
    private final JwtUtil jwtUtil;

    @Autowired
    public LikeController(LikeServiceInterface likeService, AuthCookieFinder authCookieFinder, JwtUtil jwtUtil) {
        this.likeService = likeService;
        this.authCookieFinder = authCookieFinder;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/check/{id}")
    public ResponseEntity<LikedDtoOut> like(HttpServletRequest request, @PathVariable long id) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            boolean liked = likeService.isLike(id, jwtUtil.extractUsername(cookie.getValue()));
            return ResponseEntity.status(HttpStatus.OK).body(new LikedDtoOut(liked));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<LikeCountDtoOut> likeCount(@PathVariable long blogId) {
        return ResponseEntity.status(HttpStatus.OK).body(new LikeCountDtoOut(likeService.likeCount(blogId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageDtoOut> likeIt(HttpServletRequest request, @PathVariable long id) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            likeService.changeLike(id, jwtUtil.extractUsername(cookie.getValue()));
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
