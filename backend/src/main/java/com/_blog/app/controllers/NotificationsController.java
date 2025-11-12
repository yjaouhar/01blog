package com._blog.app.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.entities.UserAccount;
import com._blog.app.service.NotificationService;
import com._blog.app.shared.GlobalResponse;
import com._blog.app.utils.UserUtils;

@RestController
@RequestMapping("/api/notification")

public class NotificationsController {

    @Autowired
    private UserUtils userUtils;

    @Autowired
private  NotificationService notificationService;
    @GetMapping
    public ResponseEntity<GlobalResponse<?>> notifications(@RequestParam(defaultValue="0") int page ,  @RequestParam(defaultValue="0") int size ,Principal principal){
   UserAccount currentUser = userUtils.findUserByUsername(principal.getName());
        return new ResponseEntity<>(new GlobalResponse<>(notificationService.getNotification(currentUser, page, size)),
                HttpStatus.OK);
    }
}
