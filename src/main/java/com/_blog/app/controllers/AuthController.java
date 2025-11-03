package com._blog.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/register")
    public ResponseEntity<GlobalResponse<?>> registerRequest(@RequestBody @Valid RegisterRequest regesterDto) {
        authService.createUser(regesterDto);
        return new ResponseEntity<>(new GlobalResponse<>("User registered successfully!"), HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<GlobalResponse<?>> loginRequest(@RequestBody @Valid LoginRequest loginDto) {
        String token = authService.login(loginDto);
        return new ResponseEntity<>(new GlobalResponse<>(token), HttpStatus.OK);
    }
}
