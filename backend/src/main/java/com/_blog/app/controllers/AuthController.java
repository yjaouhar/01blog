package com._blog.app.controllers;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
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
import com._blog.app.model.JwtUserPrincipal;
import com._blog.app.repository.RefreshTokenRepo;
import com._blog.app.service.AuthService;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.shared.GlobalResponse;
import com._blog.app.utils.UserUtils;

import jakarta.servlet.http.HttpServletRequest;
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

    @Autowired
    UserUtils userUtils;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalResponse<?>> registerRequest(
            @RequestPart("data") @Valid RegisterRequest regesterRequest,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        authService.createUser(regesterRequest, file);
        return new ResponseEntity<>(new GlobalResponse<>("User registered successfully!"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<GlobalResponse<?>> loginRequest(@RequestBody @Valid LoginRequest loginDto, HttpServletResponse response, HttpServletRequest request) {
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
        response.addHeader(HttpHeaders.SET_COOKIE, UserUtils.generatCookie("refreshToken", refToken, Duration.ofDays(7)));
        response.addHeader(HttpHeaders.SET_COOKIE, UserUtils.generatCookie("access_token", accessToken, Duration.ofMinutes(15)));
        return new ResponseEntity<>(new GlobalResponse<>(GlobalDataResponse.LoginResponse.builder()
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build()
        ), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    @Transactional
    public ResponseEntity<GlobalResponse<?>> refresh(@CookieValue(value = "refreshToken", required = false) String token, HttpServletResponse response) {
        if (token == null) {
            return new ResponseEntity<>(new GlobalResponse<>(List.of(new GlobalResponse.ErrorItem("Missing refresh token"))), HttpStatus.UNAUTHORIZED);
        }
        RefreshToken oldToken = refreshTokenRepo.findByToken(token)
                .orElseThrow(() -> CustomResponseException.CustomException(401, "Invalid refresh token"));

        if (oldToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepo.delete(oldToken);
            return new ResponseEntity<>(new GlobalResponse<>(List.of(new GlobalResponse.ErrorItem("Refresh token expired"))), HttpStatus.FORBIDDEN);
        }
        refreshTokenRepo.delete(oldToken);
        UserAccount user = oldToken.getUser();
        String newRefToken = jwtHelper.generateRefreshToken();
        RefreshToken refreshToken = new RefreshToken(newRefToken, user, LocalDateTime.now().plusDays(7));
        refreshTokenRepo.save(refreshToken);
        String newAccess = jwtHelper.generateAccessToken(
                Map.of("userId", oldToken.getUser().getId(), "role", user.getRole()),
                user.getUsername()
        );
        response.addHeader(HttpHeaders.SET_COOKIE, UserUtils.generatCookie("refreshToken", newRefToken, Duration.ofDays(7)));
        response.addHeader(HttpHeaders.SET_COOKIE, UserUtils.generatCookie("access_token", newAccess, Duration.ofMinutes(15)));
        return new ResponseEntity<>(new GlobalResponse<>(GlobalDataResponse.LoginResponse.builder()
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build()), HttpStatus.OK);
    }

    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<GlobalResponse<?>> logoutRequest(
            @CookieValue(value = "refreshToken", required = false) String token, HttpServletResponse response) {
        if (token != null) {
            refreshTokenRepo.deleteByToken(token);
        }
        response.addHeader(HttpHeaders.SET_COOKIE, UserUtils.removeCookies("access_token"));
        response.addHeader(HttpHeaders.SET_COOKIE, UserUtils.removeCookies("refreshToken"));
        return new ResponseEntity<>(new GlobalResponse<>("logout success"), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<?>> testEndpoint() {
        JwtUserPrincipal principal = (JwtUserPrincipal) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        UserAccount user = userUtils.findUserById(principal.getId());
        return new ResponseEntity<>(new GlobalResponse<>(GlobalDataResponse.LoginResponse.builder()
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build()), HttpStatus.OK);
    }
}
