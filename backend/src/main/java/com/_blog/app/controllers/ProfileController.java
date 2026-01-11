package com._blog.app.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.dtos.EditProfileRequest;
import com._blog.app.entities.UserAccount;
import com._blog.app.model.JwtUserPrincipal;
import com._blog.app.service.ProfileService;
import com._blog.app.shared.GlobalResponse;
import com._blog.app.utils.UserUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserUtils userUtils;

    @GetMapping("/{username}")
    public ResponseEntity<GlobalResponse<?>> userDetails(@PathVariable String username) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount user = userUtils.findUserById(principal.getId());
        UserAccount profile = userUtils.findUserByUsername(username);
        return new ResponseEntity<>(new GlobalResponse<>(profileService.userDetails(profile, user.getId())),
                HttpStatus.OK);
    }

    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalResponse<?>> edit(@RequestPart("data") @Valid EditProfileRequest editProfileRequest,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        profileService.editInfo(editProfileRequest, currentUser, file);

        return new ResponseEntity<>(
                new GlobalResponse<>("profile edited"),
                HttpStatus.OK);

    }

    @GetMapping("postes/{profileId}")
    public ResponseEntity<GlobalResponse<?>> post(@PathVariable UUID profileId) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        UserAccount profileUser = userUtils.findUserById(profileId);
        return new ResponseEntity<>(
                new GlobalResponse<>(profileService.getProfilePoste(profileUser, currentUser)),
                HttpStatus.OK);
    }

    @GetMapping("/followers/{profileId}")
    public ResponseEntity<GlobalResponse<?>> followers(@PathVariable UUID profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        UserAccount profileUser = userUtils.findUserById(profileId);
        // GlobalDataResponse followers = 
        return new ResponseEntity<>(
                new GlobalResponse<>(profileService.followers(currentUser, profileUser)), HttpStatus.OK);
    }

    @GetMapping("/following/{profileId}")
    public ResponseEntity<GlobalResponse<?>> following(@PathVariable UUID profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        JwtUserPrincipal principal = UserUtils.getPrincipal();
        UserAccount currentUser = userUtils.findUserById(principal.getId());
        UserAccount profileUser = userUtils.findUserById(profileId);
        return new ResponseEntity<>(new GlobalResponse<>(profileService.following(currentUser, profileUser)), HttpStatus.OK);
    }
}
