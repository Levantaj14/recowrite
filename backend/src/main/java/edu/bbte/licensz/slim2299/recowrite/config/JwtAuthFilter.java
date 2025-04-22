package edu.bbte.licensz.slim2299.recowrite.config;

import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.services.UserServiceInterface;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserServiceInterface userService;

    @Autowired
    public JwtAuthFilter(JwtUtil jwtUtil, UserServiceInterface userService) {
        super();
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Cookie auhtCookie = searchAuthCookie(request.getCookies());
        if (auhtCookie == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String username;
        String jwt = auhtCookie.getValue();
        try {
            username = jwtUtil.extractUsername(jwt);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                checkUser(request, username, jwt);
            }
        } catch (ExpiredJwtException ignored) {
            log.info("JWT expired");
        }
        filterChain.doFilter(request, response);
    }

    private void checkUser(HttpServletRequest request, String username, String jwt) {
        try {
            UserModel user = userService.getUserModelByUsername(username);
            if (jwtUtil.validateToken(jwt, user.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user, null, Collections.singleton(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole())));
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (UserNotFoundException ignored) {
            log.info("User not found");
        }
    }

    private Cookie searchAuthCookie(Cookie... cookies) {
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
