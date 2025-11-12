package com._blog.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.dtos.LoginRequest;
import com._blog.app.dtos.RegisterRequest;
import com._blog.app.service.AuthService;
import com._blog.app.shared.GlobalResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalResponse<?>> registerRequest(@RequestPart("data") @Valid RegisterRequest regesterRequest,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        authService.createUser(regesterRequest, file);
        return new ResponseEntity<>(new GlobalResponse<>("User registered successfully!"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<GlobalResponse<?>> loginRequest(@RequestBody @Valid LoginRequest loginDto) {
        String token = authService.login(loginDto);
        return new ResponseEntity<>(new GlobalResponse<>(token), HttpStatus.OK);
    }

}
