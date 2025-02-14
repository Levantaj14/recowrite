package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.CommentDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.CommentDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.IdDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.MessageDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.CommentServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentsController {

    @Autowired
    private CommentServiceInterface commentService;

    @Autowired
    private AuthCookieFinder authCookieFinder;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{blogId}")
    public List<CommentDtoOut> getCommentsByBlog(@PathVariable Long blogId) {
        return commentService.findAllByBlog(blogId);
    }

    @PostMapping("/{blogId}")
    public ResponseEntity<IdDtoOut> addComment(HttpServletRequest request,
                                               @PathVariable Long blogId, @RequestBody CommentDtoIn commentDtoIn) {
        Cookie cookie = authCookieFinder.serachAuthCookie(request.getCookies());
        if (cookie != null) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new IdDtoOut(commentService.addComment(commentDtoIn,
                            blogId, jwtUtil.extractUsername(cookie.getValue()))));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageDtoOut> deleteComment(@PathVariable Long id) {
        commentService.deleteCommentById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageDtoOut> editComment(@PathVariable Long id, @RequestBody CommentDtoIn commentDtoIn) {
        commentService.editComment(commentDtoIn, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
