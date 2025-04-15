package edu.bbte.licensz.slim2299.recowrite.config;

import edu.bbte.licensz.slim2299.recowrite.services.CommentServiceInterface;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class CommentOwnerFilter extends OncePerRequestFilter {
    private final CommentServiceInterface commentService;
    private final JwtUtil jwtUtil;

    @Autowired
    public CommentOwnerFilter(CommentServiceInterface commentService, JwtUtil jwtUtil) {
        super();
        this.commentService = commentService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (path.matches("/comments/\\d+") &&
                ("PUT".equals(request.getMethod()) || "DELETE".equals(request.getMethod()))) {
            long taskId = Math.toIntExact(extractId(path));
            Cookie cookie = serachAuthCookie(response, request.getCookies());
            if (checkCommentAuthor(response, cookie, taskId)) {
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean checkCommentAuthor(HttpServletResponse response, Cookie cookie, long taskId) throws IOException {
        if (cookie != null) {
            String currentUsername = jwtUtil.extractUsername(cookie.getValue());
            if (!commentService.isCommentOwnedByUser(taskId, currentUsername)) {
                response.sendError(HttpStatus.FORBIDDEN.value(), "Access denied to this endpoint");
                return true;
            }
        }
        return false;
    }

    private int extractId(String path) {
        return Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));
    }

    private Cookie serachAuthCookie(HttpServletResponse response, Cookie... cookies) {
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth".equals(cookie.getName())) {
                    return cookie;
                }
            }
        }
        response.setStatus(HttpStatus.FORBIDDEN.value());
        return null;
    }
}
