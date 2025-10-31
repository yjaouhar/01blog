package com._blog.app.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.dtos.UserRegister;
import com._blog.app.entities.UserAccount;
import com._blog.app.shared.GlobalResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public  class AuthController {
    @PostMapping("/register")
    public ResponseEntity<GlobalResponse<?>> register(@RequestBody @Valid UserRegister user) {
        System.out.println("------------------------" + user.toString());
        return new ResponseEntity<>(new GlobalResponse<>(user),HttpStatus.OK);
   }
}