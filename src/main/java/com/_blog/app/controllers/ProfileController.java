package com._blog.app.controllers;

import java.security.Principal;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.dtos.EditProfileRequest;
import com._blog.app.entities.UserAccount;
import com._blog.app.service.ProfileService;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.shared.GlobalResponse;
import com._blog.app.utils.UserUtils;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserUtils userUtils;

    @GetMapping
    public ResponseEntity<GlobalResponse<?>> userDetails(@PathVariable UUID profileId, Principal principal) {
        UserAccount user = userUtils.findUserByUsername(principal.getName());
        return new ResponseEntity<>(new GlobalResponse<>(profileService.userDetails(profileId, user)),
                HttpStatus.OK);
    }

    @GetMapping("/post")
    public ResponseEntity<GlobalResponse<?>> post(@PathVariable UUID profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, Principal principal) {
        UserAccount currentUser = userUtils.findUserByUsername(principal.getName());
        UserAccount profileUser = userUtils.findUserById(profileId);
        return new ResponseEntity<>(
                new GlobalResponse<>(profileService.getProfilePoste(profileUser, currentUser, page, size)),
                HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<GlobalResponse<?>> allUsers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, Principal principal) {
        UserAccount currentUser = userUtils.findUserByUsername(principal.getName());
        return new ResponseEntity<>(
                new GlobalResponse<>(profileService.users(currentUser.getId(), page, size)),
                HttpStatus.OK);
    }

    @GetMapping("/explore/{keyword}")
    public ResponseEntity<GlobalResponse<?>> explore(@PathVariable String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, Principal principal) {
        UserAccount currentUser = userUtils.findUserByUsername(principal.getName());
        return new ResponseEntity<>(
                new GlobalResponse<>(profileService.explor(currentUser.getId(), keyword, page, size)),
                HttpStatus.OK);
    }

    @PutMapping(value = "/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalResponse<?>> edit(@RequestPart("data") EditProfileRequest editProfileRequest,
            @RequestPart(value = "file", required = false) MultipartFile file, Principal principal) {

        UserAccount currentUser = userUtils.findUserByUsername(principal.getName());

        profileService.editInfo(editProfileRequest, currentUser, file);

        return new ResponseEntity<>(
                new GlobalResponse<>("profile edited"),
                HttpStatus.OK);

    }

    @GetMapping("/subscrib/{userId}")
    public ResponseEntity<GlobalResponse<?>> subscibe(@PathVariable UUID userId, Principal principal) {
        UserAccount currentUser = userUtils.findUserByUsername(principal.getName());
        UserAccount targetUser = userUtils.findUserById(userId);
        profileService.subscribHandel(currentUser, targetUser);
        return new ResponseEntity<>(new GlobalResponse<>("subscrib seccess !"), HttpStatus.OK);
    }

    @GetMapping("/followers")
    public ResponseEntity<GlobalResponse<?>> followers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, Principal principal) {
        UserAccount currentUser = userUtils.findUserByUsername(principal.getName());
        GlobalDataResponse followers = profileService.followers(currentUser, page, size);
        return new ResponseEntity<>(new GlobalResponse<>(followers), HttpStatus.OK);
    }
    
    @GetMapping("/following")
    public ResponseEntity<GlobalResponse<?>> following(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, Principal principal) {
        UserAccount currentUser = userUtils.findUserByUsername(principal.getName());
        GlobalDataResponse following = profileService.following(currentUser, page, size);
        return new ResponseEntity<>(new GlobalResponse<>(following), HttpStatus.OK);
    }

}
