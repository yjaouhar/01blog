package com._blog.app.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.dtos.ReportRequest;
import com._blog.app.dtos.ReportsActionRequest;
import com._blog.app.service.AdminSercive;
import com._blog.app.shared.GlobalResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminSercive adminSercive;
    

    @PostMapping("/reports")
    public ResponseEntity<GlobalResponse<?>> reports(@RequestBody @Valid ReportsActionRequest reportsActionRequest,
            Principal principal) {
        String username = principal.getName();
        adminSercive.handleReport(reportsActionRequest, username);
        return new ResponseEntity<>(new GlobalResponse<>("report success !"), HttpStatus.OK);
    }
}
