package com._blog.app.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.entities.Comment;
import com._blog.app.entities.Postes;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.CommentRepo;
import com._blog.app.repository.PosteRepo;
import com._blog.app.service.PostesService;
import com._blog.app.shared.CustomResponseException;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Component
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

    public List<MediaData> saveMedia(List<MultipartFile> files) {
        List<MediaData> mediaData = new ArrayList<>();
        for (MultipartFile file : files) {
            String type = "text";
            String fileContentType = file.getContentType();
            if (fileContentType != null) {
                String fileType = fileContentType.split("/")[0];
                if (!fileType.equals("image") && !fileType.equals("video")) {
                    throw CustomResponseException.CustomException(400, "Only image/video allowed");
                }
                type = fileType;
            } 
            if (type.equals("image")){
                if (file.getSize() > 8 * (1024 * 1024)) {
                    throw CustomResponseException.CustomException(400, "post too large");
                }
            }else if (type.equals("video")){
                if (file.getSize() > 20 * (1024 * 1024)) {
                    throw CustomResponseException.CustomException(400, "video too large");
                }
            }

            String uploadDir = "../uploads/postes/";
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
    
            mediaData.add(new MediaData("/uploads/postes/" + fileName, type));
        }

        return mediaData;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public class MediaData {
        private String filePath;
        private String type;
    }

}
