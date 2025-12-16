package com._blog.app.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com._blog.app.entities.RefreshToken;
import com._blog.app.repository.RefreshTokenRepo;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private RefreshTokenRepo refreshTokenRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        String accessToken = null;

        if (header != null && header.startsWith("Bearer ")) {
            accessToken = header.substring(7);
        }

        if (accessToken != null) {
            try {
                // jwtHelper.isTokenValid(accessToken);
                // Token صالح → forward
                filterChain.doFilter(request, response);
                return;
            } catch (ExpiredJwtException e) {
                // Access token سالا → حاول refresh
                Cookie[] cookies = request.getCookies();
                if (cookies != null) {
                    for (Cookie c : cookies) {
                        if (c.getName().equals("refreshToken")) {
                            RefreshToken rt = refreshTokenRepo.findByToken(c.getValue())
                                    .orElse(null);
                            if (rt != null && rt.getExpiryDate().isAfter(LocalDateTime.now())) {
                                String newAccess = jwtHelper.generateAccessToken(
                                        Map.of("userId", rt.getUser().getId(), "role", rt.getUser().getRole()),
                                        rt.getUser().getUsername()
                                );
                                response.setHeader("New-Access-Token", newAccess);
                                filterChain.doFilter(request, response);
                                return;
                            }
                        }
                    }
                }
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                return;
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }
        }

        // ما كاينش access token → forward إذا route مسموح أو reject
        filterChain.doFilter(request, response);
    }
}
