package com._blog.app.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.entities.Comment;
import com._blog.app.entities.Postes;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.CommentRepo;
import com._blog.app.repository.PosteRepo;
import com._blog.app.service.PostesService;
import com._blog.app.shared.CustomResponseException;

import lombok.Getter;
import lombok.Setter;

public class PosteUtils {
    @Autowired
    private PosteRepo posteRepo;

    @Autowired
    private CommentRepo commentRepo;

    private static final Logger logger = LoggerFactory.getLogger(PostesService.class);

    public Postes findPostById(UUID id) {
        return posteRepo.findById(id)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "post not found"));
    }

    public Comment findComentById(UUID id) {
        return commentRepo.findById(id)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "comment not found"));
    }

    public boolean haveAccess(Comment comment, UserAccount user) {
        return comment.getUser().getId().equals(user.getId()) || user.getRole().equals("ADMIN");
    }

    public boolean haveAccess(Postes post, UserAccount user) {
        return post.getUser().getId().equals(user.getId()) || user.getRole().equals("ADMIN");
    }

    public MediaData saveMedia(MultipartFile file) {
        MediaData mediaData = new MediaData();
        if (file != null && !file.isEmpty()) {
            String uploadDir = "uploads/postes/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            try {
                Path filePath = Paths.get(uploadDir + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ex) {
                logger.error("Error saving media file", ex);
                throw CustomResponseException.CustomException(500, "Failed to save media file");
            }
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

    @Getter
    @Setter
    public  class MediaData {
        private String filePath;
        private String type;
    }
}
