package com._blog.app.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.dtos.EditProfileRequest;
import com._blog.app.dtos.ProfileDetailsResponse;
import com._blog.app.entities.Postes;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.CommentRepo;
import com._blog.app.repository.LikeRepo;
import com._blog.app.repository.PosteRepo;
import com._blog.app.repository.SubscriberRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.shared.GlobalDataResponse.PostResponse;
import com._blog.app.utils.UserUtils;

@Service
public class ProfileService {

    @Autowired
    private SubscriberRepo subscriberRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PosteRepo posteRepo;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private LikeRepo likeRepo;
    @Autowired
    private CommentRepo commentRepo;

    private static final Logger logger = LoggerFactory.getLogger(PostesService.class);

    public GlobalDataResponse<List<PostResponse>> getProfilePoste(UserAccount profileUser, UserAccount currentUser, int page, int size) {
        Page<Postes> postPage = posteRepo.findAllByUser(profileUser, PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt")));
        List<PostResponse> posts = postPage.getContent().stream().map(post -> {
            boolean liked = likeRepo.existsByUserIdAndPostId(currentUser.getId(), post.getId());
            long totaLike = likeRepo.countByPostId(post.getId());
            long totalComment = commentRepo.countByPostId(post.getId());
            return GlobalDataResponse.PostResponse.builder()
                    .id(post.getId())
                    .descreption(post.getDescription())
                    .media(post.getMedia())
                    .totalComment(totalComment)
                    .totalLike(totaLike)
                    .liked(liked).build();
        }).toList();
        return new GlobalDataResponse<>(posts, postPage.getNumber(),
                postPage.getTotalPages(), postPage.hasNext());

    }

    public ProfileDetailsResponse userDetails(UUID profileId, UserAccount user) {
        ProfileDetailsResponse profileDetails = new ProfileDetailsResponse();
        if (!user.getId().equals(profileId)) {
            UUID userId = user.getId();
            user = userUtils.findUserById(profileId);
            // boolean reported = reportRepo.existsByReporter(user);//
            // profileDetails.setReported(reported);
            profileDetails.setReacted(subscriberRepo.existsByUserId_IdAndTarget_Id(userId, profileId));
        } else {
            profileDetails.setPersonelProfile(true);
        }
        profileDetails.setFollowers(subscriberRepo.countByTarget(user));
        profileDetails.setFollowing(subscriberRepo.countByUser(user));
        profileDetails.setFirstName(user.getFirstName());
        profileDetails.setLasteName(user.getLastName());
        profileDetails.setAge(user.getBirthday());
        profileDetails.setAvatar(user.getAvatar());
        profileDetails.setBio(user.getBio());
        profileDetails.setEmail(user.getEmail());
        profileDetails.setGender(user.getGender());
        profileDetails.setUserName(user.getUsername());
        profileDetails.setRol(user.getRole());
        profileDetails.setActive(user.isActive());
        return profileDetails;
    }

    public void editInfo(EditProfileRequest editRequest, UserAccount currentUser, MultipartFile file) {
        UserAccount profileUser = userUtils.findUserById(editRequest.profileId());

        if (!currentUser.getId().equals(profileUser.getId())) {
            throw CustomResponseException.CustomException(403, "You can't have access to edit profile");
        }

        if (editRequest.firstName() != null && !editRequest.firstName().isBlank()) {
            profileUser.setFirstName(editRequest.firstName());
        }

        if (editRequest.lastName() != null && !editRequest.lastName().isBlank()) {
            profileUser.setLastName(editRequest.lastName());
        }
        if (!editRequest.age().isBlank()) {
            profileUser.setBirthday(editRequest.age());
        }
        if (editRequest.gender() != null && !editRequest.gender().isBlank()) {
            profileUser.setGender(editRequest.gender());
        }
        if (editRequest.bio() != null && !editRequest.bio().isBlank()) {
            profileUser.setBio(editRequest.bio());
        }
        if (editRequest.username() != null && !editRequest.username().isBlank()) {
            if (userRepo.existsByUsername(editRequest.username())) {
                throw CustomResponseException.CustomException(400, "Username already exists");
            }
            profileUser.setUsername(editRequest.username());
        }
        if (editRequest.email() != null && !editRequest.email().isBlank()) {
            if (userRepo.existsByEmail(editRequest.email())) {
                throw CustomResponseException.CustomException(400, "Email already exists");
            }
            profileUser.setEmail(editRequest.email());
        }
        if (file != null && !file.isEmpty()) {
            try {
                if (profileUser.getAvatar() != null && !profileUser.getAvatar().isBlank()) {
                    Path oldFilePath = Paths.get(profileUser.getAvatar().substring(1));
                    try {
                        Files.deleteIfExists(oldFilePath);
                    } catch (IOException e) {
                        logger.warn("Failed to delete old media file: {}", oldFilePath, e);
                    }
                }
                String uploadDir = "uploads/avatar/";
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                profileUser.setAvatar("/" + uploadDir + fileName);
            } catch (IOException ex) {
                logger.error("Error saving media file", ex);

                throw CustomResponseException.CustomException(500, "Failed to save media file");
            }
        }

        userRepo.save(profileUser);
    }




}
