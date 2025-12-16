package com._blog.app.controllers;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.config.JwtHelper;
import com._blog.app.dtos.LoginRequest;
import com._blog.app.dtos.RegisterRequest;
import com._blog.app.entities.RefreshToken;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.RefreshTokenRepo;
import com._blog.app.service.AuthService;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalResponse;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    JwtHelper jwtHelper;
    @Autowired
    RefreshTokenRepo refreshTokenRepo;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalResponse<?>> registerRequest(
            @RequestPart("data") @Valid RegisterRequest regesterRequest,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        authService.createUser(regesterRequest, file);
        return new ResponseEntity<>(new GlobalResponse<>("User registered successfully!"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<GlobalResponse<?>> loginRequest(@RequestBody @Valid LoginRequest loginDto, HttpServletResponse response) {
        UserAccount user = authService.login(loginDto);

        Map<String, Object> customClaims = new HashMap<>();
        customClaims.put("userId", user.getId());
        customClaims.put("role", user.getRole());

        String accessToken = jwtHelper.generateAccessToken(customClaims, user.getUsername());
        String refToken = jwtHelper.generateRefreshToken();

        if (refreshTokenRepo.existsByUser(user)) {
            refreshTokenRepo.deleteByUser(user);
        }

        RefreshToken refreshToken = new RefreshToken(refToken, user, LocalDateTime.now().plusDays(7));
        refreshTokenRepo.save(refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refToken).
                httpOnly(true).
                secure(false).
                path("/api/auth/refresh").
                maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new ResponseEntity<>(new GlobalResponse<>(accessToken), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<GlobalResponse<?>> refresh(@CookieValue("refreshToken") String token) {
        RefreshToken rt = refreshTokenRepo.findByToken(token)
                .orElseThrow(() -> CustomResponseException.CustomException(401, "Invalid refresh token"));
        if (rt.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepo.delete(rt);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String newAccess = jwtHelper.generateAccessToken(
                Map.of("userId", rt.getUser().getId(), "role", rt.getUser().getRole()),
                rt.getUser().getUsername()
        );
        return new ResponseEntity<>(new GlobalResponse<>(newAccess), HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<GlobalResponse<?>> logoutRequest(@CookieValue("refreshToken") String token, HttpServletResponse response) {
        refreshTokenRepo.deleteByToken(token);
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .path("/api/auth/refresh")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return new ResponseEntity<>(new GlobalResponse<>("logout success"), HttpStatus.OK);
    }

}
