package com._blog.app.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.dtos.CommentEditRequest;
import com._blog.app.dtos.CommentPosteRequest;
import com._blog.app.dtos.PosteCreationRequest;
import com._blog.app.dtos.PosteUpdateRequest;
import com._blog.app.dtos.ReportRequest;
import com._blog.app.entities.Comment;
import com._blog.app.entities.Liks;
import com._blog.app.entities.Postes;
import com._blog.app.entities.Report;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.CommentRepo;
import com._blog.app.repository.LikeRepo;
import com._blog.app.repository.PosteRepo;
import com._blog.app.repository.ReportRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;

import lombok.Getter;
import lombok.Setter;

@Service
public class PostesService {

    @Autowired
    private PosteRepo posteRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private LikeRepo likeRepo;
    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private ReportRepo reportRepo;

    private static final Logger logger = LoggerFactory.getLogger(PostesService.class);

    // public List<Postes> getPostes() {
        
    // }
    public void creatPoste(PosteCreationRequest postRequest, String username, MultipartFile file) {

        UserAccount user = userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404,
                        "User not found"));
        Postes post = new Postes();
        post.setTitle(postRequest.title());
        post.setDescription(postRequest.description());

        if (file != null && !file.isEmpty()) {
            try {
                MediaData mediaData = saveMedia(file);
                post.setMedia_url(mediaData.getFilePath());
                post.setMedia_type(mediaData.getType());
            } catch (IOException ex) {
                logger.error("Error saving media file", ex);

                throw CustomResponseException.CustomException(500, "Failed to save media file");
            }
        }
        post.setUser(user);
        posteRepo.save(post);

    }

    public void deletPost(UUID postId, String username) {
        Info info = checkInfo(username, postId);

        if (!info.getPost().getUser().getId().equals(info.getUser().getId())
                && !info.getUser().getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403,
                    "can't have access for delete post");
        }
        posteRepo.deleteById(info.getPost().getId());

    }

    public void updatePost(PosteUpdateRequest updateRequest, MultipartFile file, String username) {
        Info info = checkInfo(username, updateRequest.postId());
        UserAccount user = info.getUser();
        Postes post = info.getPost();

        if (!post.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "You can't update this post");
        }
        boolean isUpdate = false;
        if (updateRequest.title() != null && !updateRequest.title().isBlank()) {
            post.setTitle(updateRequest.title());
            isUpdate = true;
        }

        if (updateRequest.description() != null && !updateRequest.description().isBlank()) {
            post.setDescription(updateRequest.description());
            isUpdate = true;
        }

        if (file != null && !file.isEmpty()) {
            try {
                if (post.getMedia_url() != null) {
                    Path oldFilePath = Paths.get(post.getMedia_url().substring(1));
                    try {
                        Files.deleteIfExists(oldFilePath);
                    } catch (IOException e) {
                        logger.warn("Failed to delete old media file: {}", oldFilePath, e);
                    }
                }
                MediaData mediaData = saveMedia(file);
                post.setMedia_url(mediaData.getFilePath());
                post.setMedia_type(mediaData.getType());
                isUpdate = true;
            } catch (IOException ex) {
                logger.error("Error saving media file", ex);

                throw CustomResponseException.CustomException(500, "Failed to save media file");
            }
        }
        if (isUpdate) {
            post.setUpdate_at(LocalDateTime.now());
        }
        posteRepo.save(post);
    }

    private MediaData saveMedia(MultipartFile file) throws IOException {
        MediaData mediaData = new MediaData();
        if (file != null && !file.isEmpty()) {
            String uploadDir = "uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            mediaData.setFilePath("/" + uploadDir + fileName);
            if (file.getContentType() != null) {
                String type = file.getContentType().split("/")[0];
                if (!type.equals("image") && !type.equals("video")) {
                    throw CustomResponseException.CustomException(400, "Only image/video allowed");
                }
                mediaData.setType(type);
            } else {
                mediaData.setType("other");
            }
        }

        return mediaData;
    }

    public String likePost(UUID postId, String username) {
        Info info = checkInfo(username, postId);

        if (likeRepo.existsByUserIdAndPostId(info.getUser().getId(), info.getPost().getId())) {
            likeRepo.deleteByUserIdAndPostId(info.getUser().getId(), info.getPost().getId());
            return "Like removed!";
        } else {
            Liks like = new Liks();
            like.setUser(info.getUser());
            like.setPost(info.getPost());
            likeRepo.save(like);
        }
        return "Like added!";
    }

    public void commentPost(CommentPosteRequest commentPosteRequest, String username) {
        Info info = checkInfo(username, commentPosteRequest.postId());
        Comment comment = new Comment();
        comment.setContente(commentPosteRequest.description());
        comment.setPost(info.getPost());
        comment.setUser(info.getUser());
        commentRepo.save(comment);
    }

    public void editComment(CommentEditRequest commentEditRequest, String username) {
        UserAccount user = userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "User not found"));
        Comment comment = commentRepo.findById(commentEditRequest.commentId())
                .orElseThrow(() -> CustomResponseException.CustomException(404, "comment not found"));

        if (!comment.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "You can't edit this comment");
        }

        if (commentEditRequest != null && !commentEditRequest.description().isEmpty()) {
            comment.setContente(commentEditRequest.description());
            comment.setEdit_at(LocalTime.now());
        }

        commentRepo.save(comment);
    }

    public void deletComment(UUID commentId, String username) {
        UserAccount user = userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "User not found"));
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "comment not found"));

        if (!comment.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "You can't delet this comment");
        }

        commentRepo.deleteById(comment.getId());
        ;
    }

    public void report(ReportRequest reportRequest, String username) {
        UserAccount reporter = userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "User not found"));
        if (reportRequest.reportedUser() == null && reportRequest.reportedPost() == null) {
            throw CustomResponseException.CustomException(400, "You must report either a user or a post");
        }
        Report report = new Report();
        report.setReason(reportRequest.reason());
        report.setReporter(reporter);
        if (reportRequest.reportedUser() != null) {
            UserAccount reportedUser = userRepo.findById(reportRequest.reportedUser())
                    .orElseThrow(() -> CustomResponseException.CustomException(404, "User not found"));
            report.setReportedUser(reportedUser);
        }
        if (reportRequest.reportedPost() != null) {
            Postes reportedPost = posteRepo.findById(reportRequest.reportedPost())
                    .orElseThrow(() -> CustomResponseException.CustomException(404, "post not found"));
            report.setReportedPost(reportedPost);
        }
        reportRepo.save(report);
    }

    private Info checkInfo(String username, UUID potId) {
        UserAccount user = userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "User not found"));

        Postes post = posteRepo.findById(potId)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "Post not found"));
        Info info = new Info();
        info.setPost(post);
        info.setUser(user);
        return info;
    }

    @Getter
    @Setter
    class Info {
        private UserAccount user;
        private Postes post;
    }

    @Getter
    @Setter
    class MediaData {
        private String filePath;
        private String type;
    }
}
