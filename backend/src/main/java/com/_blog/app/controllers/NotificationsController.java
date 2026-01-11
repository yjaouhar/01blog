package com._blog.app.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.entities.UserAccount;
import com._blog.app.model.JwtUserPrincipal;
import com._blog.app.service.NotificationService;
import com._blog.app.shared.GlobalResponse;
import com._blog.app.utils.UserUtils;

@RestController
@RequestMapping("/api/notification")

public class NotificationsController {

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<GlobalResponse<?>> notifications() {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        return new ResponseEntity<>(new GlobalResponse<>(notificationService.getNotification(currentUser)),
                HttpStatus.OK);
    }

    @PatchMapping("/{notificationId}")
    public ResponseEntity<GlobalResponse<?>> toggle(@PathVariable UUID notificationId) {
        notificationService.togellNotification(notificationId);
        return new ResponseEntity<>(new GlobalResponse<>("success"),
                HttpStatus.OK);
    }
}
