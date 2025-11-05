package com._blog.app.controllers;

import java.security.Principal;
import java.util.UUID;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.dtos.CommentEditRequest;
import com._blog.app.dtos.CommentPosteRequest;
import com._blog.app.dtos.PosteCreationRequest;
import com._blog.app.dtos.PosteUpdateRequest;
import com._blog.app.dtos.ReportRequest;
import com._blog.app.service.PostesService;
import com._blog.app.shared.GlobalResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post")

public class PosteController {

    @Autowired
    private PostesService postesService;

    @GetMapping
    public ResponseEntity<GlobalResponse<?>> allPost() {
        return new ResponseEntity<>(new GlobalResponse<>("All Poste !"), HttpStatus.CREATED);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalResponse<?>> creatPoste(@RequestPart("data") @Valid PosteCreationRequest posteRequest,
            @RequestPart(value = "file", required = false) MultipartFile file, Principal principal) {
        String username = principal.getName();
        postesService.creatPoste(posteRequest, username, file);
        return new ResponseEntity<>(new GlobalResponse<>("created !"), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<GlobalResponse<?>> deletPost(@PathVariable UUID postId,
            Principal principal) {
        String username = principal.getName();
        postesService.deletPost(postId, username);
        return new ResponseEntity<>(new GlobalResponse<>("Deleted !"), HttpStatus.OK);
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalResponse<?>> updatePost(
            @RequestPart("data") @Valid PosteUpdateRequest posteUpdateRequest,
            @RequestPart(value = "file", required = false) MultipartFile file, Principal principal) {
        String username = principal.getName();

        postesService.updatePost(posteUpdateRequest, file, username);
        return new ResponseEntity<>(new GlobalResponse<>("update success !"), HttpStatus.OK);
    }

    @PostMapping("/like/{postId}")
    public ResponseEntity<GlobalResponse<?>> likePost(@PathVariable UUID postId,
            Principal principal) {
        String username = principal.getName();
        String toggelLike = postesService.likePost(postId, username);
        return new ResponseEntity<>(new GlobalResponse<>(toggelLike), HttpStatus.OK);
    }

    @PostMapping("/comment")
    public ResponseEntity<GlobalResponse<?>> commentPost(@RequestBody @Valid CommentPosteRequest commentPosteRequest,
            Principal principal) {
        String username = principal.getName();
        postesService.commentPost(commentPosteRequest, username);
        return new ResponseEntity<>(new GlobalResponse<>("Comment Creat !"), HttpStatus.OK);
    }

    @PostMapping("/comment/edit")
    public ResponseEntity<GlobalResponse<?>> editComment(@RequestBody @Valid CommentEditRequest commentEditRequest,
            Principal principal) {
        String username = principal.getName();
        postesService.editComment(commentEditRequest, username);
        return new ResponseEntity<>(new GlobalResponse<>("Comment edited !"), HttpStatus.OK);
    }

    @PostMapping("/comment/delet/{commentId}")
    public ResponseEntity<GlobalResponse<?>> editComment(@PathVariable UUID commentId,
            Principal principal) {
        String username = principal.getName();
        postesService.deletComment(commentId, username);
        return new ResponseEntity<>(new GlobalResponse<>("Comment deleted !"), HttpStatus.OK);
    }

    @PostMapping("/report")
    public ResponseEntity<GlobalResponse<?>> editComment(@RequestBody @Valid ReportRequest reportRequest,
            Principal principal) {
        String username = principal.getName();
        postesService.report(reportRequest, username);
        return new ResponseEntity<>(new GlobalResponse<>("report success !"), HttpStatus.OK);
    }

}
