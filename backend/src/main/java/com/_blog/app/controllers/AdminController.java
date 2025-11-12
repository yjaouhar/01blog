package com._blog.app.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.dtos.ReportsReactionRequest;
import com._blog.app.entities.UserAccount;
import com._blog.app.service.AdminServise;
import com._blog.app.service.ReportService;
import com._blog.app.shared.GlobalResponse;
import com._blog.app.utils.UserUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminServise adminSercive;
    @Autowired
    private ReportService reportService;
    @Autowired
    private UserUtils userUtils;

    @GetMapping("/report")
    public ResponseEntity<GlobalResponse<?>> allReport() {
        return new ResponseEntity<>(new GlobalResponse<>(reportService.allReport()), HttpStatus.OK);
    }

    @PostMapping("/report_reaction")
    public ResponseEntity<GlobalResponse<?>> reports(@RequestBody @Valid ReportsReactionRequest reportsActionRequest,
            Principal principal) {

        UserAccount admin = userUtils.findUserByUsername(principal.getName());
        adminSercive.handleReport(reportsActionRequest, admin);
        return new ResponseEntity<>(new GlobalResponse<>("report success !"), HttpStatus.OK);
    }
}
