package com._blog.app.controllers;

import java.security.Principal;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.dtos.ReportsReactionRequest;
import com._blog.app.entities.UserAccount;
import com._blog.app.model.JwtUserPrincipal;
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

    @GetMapping("/stats")
    public ResponseEntity<GlobalResponse<?>> stats() {
        return new ResponseEntity<>(new GlobalResponse<>(adminSercive.stats()), HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<GlobalResponse<?>> usres() {
        return new ResponseEntity<>(new GlobalResponse<>(adminSercive.users()), HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<GlobalResponse<?>> deletUser(@PathVariable UUID userId) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        UserAccount target = userUtils.findUserById(userId);
        adminSercive.deletUser(currentUser, target);
        return new ResponseEntity<>(new GlobalResponse<>("user Delet success"), HttpStatus.OK);
    }

    @PatchMapping("/user/active/{userId}")
    public ResponseEntity<GlobalResponse<?>> activeUser(@PathVariable UUID userId) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        UserAccount target = userUtils.findUserById(userId);
        adminSercive.activeUser(currentUser, target);
        return new ResponseEntity<>(new GlobalResponse<>("user active success"), HttpStatus.OK);
    }

    @PatchMapping("/user/bane/{userId}")
    public ResponseEntity<GlobalResponse<?>> baneUser(@PathVariable UUID userId) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        UserAccount target = userUtils.findUserById(userId);
        adminSercive.baneUser(currentUser, target);

        return new ResponseEntity<>(new GlobalResponse<>("user bane success"), HttpStatus.OK);
    }

    @GetMapping("/postes")
    public ResponseEntity<GlobalResponse<?>> posets() {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        return new ResponseEntity<>(new GlobalResponse<>(adminSercive.getPostes(currentUser)), HttpStatus.OK);
    }

    ////////////////////////////////////////////////////////////////////////
    @DeleteMapping("/poste/{posteId}")
    public ResponseEntity<GlobalResponse<?>> deletPoste(@PathVariable UUID posteId) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        adminSercive.deletPoste(currentUser, posteId);
        return new ResponseEntity<>(new GlobalResponse<>("post Delet success"), HttpStatus.OK);
    }

    @PatchMapping("/poste/active/{posteId}")
    public ResponseEntity<GlobalResponse<?>> activePoste(@PathVariable UUID posteId) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        adminSercive.activePoste(currentUser, posteId);
        return new ResponseEntity<>(new GlobalResponse<>("post active success"), HttpStatus.OK);
    }

    @PatchMapping("/poste/bane/{posteId}")
    public ResponseEntity<GlobalResponse<?>> banePoste(@PathVariable UUID posteId) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());

        adminSercive.banePoste(currentUser, posteId);
        return new ResponseEntity<>(new GlobalResponse<>("post bane success"), HttpStatus.OK);
    }

    /////////////////////////////////////////////////////////////////
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
