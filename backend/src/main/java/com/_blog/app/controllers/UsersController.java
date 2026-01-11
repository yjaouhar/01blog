package com._blog.app.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.entities.UserAccount;
import com._blog.app.model.JwtUserPrincipal;
import com._blog.app.service.UsersService;
import com._blog.app.shared.GlobalResponse;
import com._blog.app.utils.UserUtils;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserUtils userUtils;
    @Autowired
    private UsersService usersService;

    @GetMapping
    public ResponseEntity<GlobalResponse<?>> users() {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount user = userUtils.findUserById(principal.getId());
        return new ResponseEntity<>(new GlobalResponse<>(usersService.getUsers(user)), HttpStatus.OK);
    }

    @GetMapping("/serche/{keyword}")
    public ResponseEntity<GlobalResponse<?>> serche(@PathVariable String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int siz) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount user = userUtils.findUserById(principal.getId());
        return new ResponseEntity<>(new GlobalResponse<>(usersService.explor(user.getId(), keyword, page, siz)), HttpStatus.OK);
    }

    @PostMapping("/subscrib/{userId}")
    public ResponseEntity<GlobalResponse<?>> subscribe(@PathVariable UUID userId) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount user = userUtils.findUserById(principal.getId());
        UserAccount target = userUtils.findUserById(userId);
        return new ResponseEntity<>(new GlobalResponse<>(usersService.subscribHandel(user, target)), HttpStatus.OK);
    }
}
