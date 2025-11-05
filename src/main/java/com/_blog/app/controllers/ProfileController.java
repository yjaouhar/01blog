package com._blog.app.controllers;

import java.security.Principal;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.shared.GlobalResponse;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    




    @PostMapping("/subscrib/{userId}")
    public ResponseEntity<GlobalResponse<?>> subscibe(@PathVariable UUID userId, Principal principal) {
        String username = principal.getName();

        return new ResponseEntity<>(new GlobalResponse<>("subscrib seccess !"), HttpStatus.OK);
    }

}
