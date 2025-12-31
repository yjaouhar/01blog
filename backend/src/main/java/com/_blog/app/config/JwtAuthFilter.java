package com._blog.app.config;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com._blog.app.model.JwtUserPrincipal;
import com._blog.app.shared.CustomResponseException;

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

    private static final List<String> EXEMPT_ROUTES = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/api/auth/logout"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (EXEMPT_ROUTES.stream().anyMatch(path::equals)) {
            filterChain.doFilter(request, response);
            return;
        }
        Cookie[] cookies = request.getCookies();
        String accessToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("access_token".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }
System.out.println("Access Token in Filter: " + accessToken);
        if (accessToken == null) {
            CustomResponseException.returnError(response, "Missing access token", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            JwtUserPrincipal principal = jwtHelper.isTokenValid(accessToken);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    principal,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + principal.getRole())));
            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
            CustomResponseException.returnError(response, "Token expired", HttpServletResponse.SC_UNAUTHORIZED);
        } catch (JwtException e) {
            // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            CustomResponseException.returnError(response, "Invalid token", HttpServletResponse.SC_UNAUTHORIZED);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}
