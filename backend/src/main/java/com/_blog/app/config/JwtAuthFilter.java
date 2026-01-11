package com._blog.app.config;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com._blog.app.entities.UserAccount;
import com._blog.app.model.JwtUserPrincipal;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.utils.UserUtils;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
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
    UserUtils userUtils;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private static final List<String> EXEMPT_ROUTES = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/api/auth/logout"
    );

    private Bucket createBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.simple(50, Duration.ofMinutes(1)))
                .build();
    }

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
        String key = request.getRemoteAddr(); // دابا IP فقط

        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket());
        if (!bucket.tryConsume(1)) {
            CustomResponseException.returnError(
                    response,
                    "Too many requests",
                    429
            );
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
        if (accessToken == null) {
            CustomResponseException.returnError(response, "Missing access token", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            JwtUserPrincipal principal = jwtHelper.isTokenValid(accessToken);
            UserAccount user = userUtils.findUserById(principal.getId());
            if (!user.isActive()) {
                CustomResponseException.returnError(response, "user is bane", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    principal,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + principal.getRole())));
            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            CustomResponseException.returnError(response, "Token expired", HttpServletResponse.SC_UNAUTHORIZED);
        } catch (JwtException e) {
            CustomResponseException.returnError(response, "Invalid token", HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
