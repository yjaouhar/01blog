package com._blog.app.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com._blog.app.entities.RefreshToken;
import com._blog.app.entities.UserAccount;
import com._blog.app.model.JwtUserPrincipal;
import com._blog.app.repository.RefreshTokenRepo;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
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


    private static final List<String> EXEMPT_ROUTES = List.of(
            "/api/auth/login",
            "/api/auth/register"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (EXEMPT_ROUTES.stream().anyMatch(path::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        String accessToken = (header != null && header.startsWith("Bearer ")) ? header.substring(7) : null;

        if (accessToken == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing access token");
            return;
        }

        try {
       
            JwtUserPrincipal principal = jwtHelper.isTokenValid(accessToken);

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    principal,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + principal.getRole()))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);
  

        } catch (ExpiredJwtException e) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie c : cookies) {
                    if ("refreshToken".equals(c.getName())) {
                        RefreshToken rt = refreshTokenRepo.findByToken(c.getValue()).orElse(null);
                        if (rt != null && rt.getExpiryDate().isAfter(LocalDateTime.now())) {
                            UserAccount user = rt.getUser();
                            String newAccess = jwtHelper.generateAccessToken(
                                    Map.of("userId", user.getId(), "role", user.getRole()),
                                    user.getUsername()
                            );

                            JwtUserPrincipal principal = new JwtUserPrincipal(user.getUsername(), user.getRole(), user.getId());
                            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                    principal,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                            );
                            SecurityContextHolder.getContext().setAuthentication(auth);
                            response.setHeader("New-Access-Token", newAccess);

                            filterChain.doFilter(request, response);
                            return;
                        }
                    }
                }
            }
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired, please login again");

        } catch (JwtException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        }
    }
}
