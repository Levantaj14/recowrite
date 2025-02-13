package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.LikeDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.MessageDtoOut;
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

    @Autowired
    private LikeServiceInterface likeService;

    @Autowired
    private AuthCookieFinder authCookieFinder;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{id}")
    public ResponseEntity<LikeDtoOut> like(HttpServletRequest request, @PathVariable long id) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            boolean liked = likeService.isLike(id, jwtUtil.extractUsername(cookie.getValue()));
            return ResponseEntity.status(HttpStatus.OK).body(new LikeDtoOut(liked));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
