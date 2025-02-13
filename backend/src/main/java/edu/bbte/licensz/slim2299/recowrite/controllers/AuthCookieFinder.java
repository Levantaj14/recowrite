package edu.bbte.licensz.slim2299.recowrite.controllers;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Component;

@Component
public class AuthCookieFinder {
    public Cookie serachAuthCookie(Cookie... cookies) {
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
