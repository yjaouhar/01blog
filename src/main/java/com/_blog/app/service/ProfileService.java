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
import com._blog.app.entities.Subscribers;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.CommentRepo;
import com._blog.app.repository.LikeRepo;
import com._blog.app.repository.PosteRepo;
import com._blog.app.repository.ReportRepo;
import com._blog.app.repository.SubscriberRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.shared.GlobalDataResponse.PostResponse;
import com._blog.app.utils.UserUtils;

@Service
public class ProfileService {

    @Autowired
    private ReportRepo reportRepo;
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
    @Autowired
    private NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(PostesService.class);

    public GlobalDataResponse getProfilePoste(UserAccount profileUser, UserAccount currentUser, int page, int size) {
        Page<Postes> postPage = posteRepo.findAllByUser(profileUser, PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "create_at")));
        List<PostResponse> posts = postPage.getContent().stream().map(post -> {
            boolean liked = likeRepo.existsByUserIdAndPostId(currentUser.getId(), post.getId());
            long totaLike = likeRepo.countByPostId(post.getId());
            long totalComment = commentRepo.countByPostId(post.getId());

            GlobalDataResponse.PostResponse respo = new GlobalDataResponse.PostResponse();
            respo.setId(post.getId());
            respo.setTitle(post.getTitle());
            respo.setDescreption(post.getDescription());
            respo.setMediaType(post.getMedia_type());
            respo.setMediaUrl(post.getMedia_url());
            respo.setTotalComment(totalComment);
            respo.setTotalLike(totaLike);
            respo.setLiked(liked);
            return new GlobalDataResponse.PostResponse();
        }).toList();
        return new GlobalDataResponse<>(posts, postPage.getNumber(),
                postPage.getTotalPages(), postPage.hasNext());

    }

    public ProfileDetailsResponse userDetails(UUID profileId, UserAccount user) {
        ProfileDetailsResponse profileDetails = new ProfileDetailsResponse();
        if (!user.getId().equals(profileId)) {
            UUID userId = user.getId();
            user = userUtils.findUserById(profileId);
            boolean reported = reportRepo.existsByReporter(user);
            profileDetails.setReported(reported);
            profileDetails.setReacted(subscriberRepo.existsByUserIdAndTarget(userId, profileId));
        } else {
            profileDetails.setPersonelProfile(true);
        }
        profileDetails.setFollowers(subscriberRepo.countByTarget(user));
        profileDetails.setFollowing(subscriberRepo.countByUser(user));
        profileDetails.setFirstName(user.getFirstName());
        profileDetails.setLasteName(user.getLastName());
        profileDetails.setAge(user.getAge());
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
        if (editRequest.age() > 10) {
            profileUser.setAge(editRequest.age());
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

    public void subscribHandel(UserAccount currentUser, UserAccount targetUser) {

        if (currentUser.getId().equals(targetUser.getId())) {
            throw CustomResponseException.CustomException(400, "can't follow yourself");
        }

        if (subscriberRepo.existsByUserIdAndTarget(currentUser.getId(), targetUser.getId())) {
            subscriberRepo.deleteByUserIdAndTarget(currentUser.getId(), targetUser.getId());
        } else {
            Subscribers subscribers = new Subscribers();
            subscribers.setTarget(targetUser);
            subscribers.setUser(currentUser);
            subscriberRepo.save(subscribers);
            String content = currentUser.getUsername() + " started follwing you ";
            notificationService.insertNotification(targetUser, content);

        }
    }

    public GlobalDataResponse followers(UserAccount currentUser, int page, int size) {

        Page<Subscribers> followersPage = subscriberRepo.findByTarget(currentUser, PageRequest.of(page, size));
        List<GlobalDataResponse.UserResponse> followers = followersPage.getContent().stream()
                .map(follow -> {
                    UserAccount user = follow.getUser();
                    return new GlobalDataResponse.UserResponse(user.getAvatar(), user.getFirstName(),
                            user.getLastName(), user.getUsername(),
                            subscriberRepo.existsByUserIdAndTarget(currentUser.getId(), user.getId()));
                }).toList();
        return new GlobalDataResponse<>(followers, followersPage.getNumber(), followersPage.getTotalPages(),
                followersPage.hasNext());
    }
    
    public GlobalDataResponse following(UserAccount currentUser, int page, int size) {

        Page<Subscribers> followingPage = subscriberRepo.findByUser(currentUser, PageRequest.of(page, size));
        List<GlobalDataResponse.UserResponse> following = followingPage.getContent().stream()
                .map(follow -> {
                    UserAccount user = follow.getUser();
                    return new GlobalDataResponse.UserResponse(user.getAvatar(), user.getFirstName(),
                            user.getLastName(), user.getUsername(),true);
                }).toList();
        return new GlobalDataResponse<>(
                following, followingPage.getNumber(), followingPage.getTotalPages(),
                followingPage.hasNext());
    }

    public List<GlobalDataResponse.UserResponse> users(UUID currentUserId, int page, int size) {
        Page<UserAccount> allusers = userRepo.findByIdNot(currentUserId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "username")));
        List<GlobalDataResponse.UserResponse> users = allusers.getContent().stream().map(user -> {
            boolean isfollowed = subscriberRepo.existsByUserIdAndTarget(currentUserId, user.getId());
            return new GlobalDataResponse.UserResponse(user.getAvatar(), user.getFirstName(), user.getLastName(),
                    user.getUsername(),
                    isfollowed);
        }).toList();
        return users;
    }

    public List<GlobalDataResponse.UserResponse> explor(UUID currentUserId, String keyword, int page, int size) {
        Page<UserAccount> allusers = userRepo.searchByFullName(currentUserId, keyword,
                PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "firstname")));
        List<GlobalDataResponse.UserResponse> users = allusers.getContent().stream().map(user -> {
            boolean isfollowed = subscriberRepo.existsByUserIdAndTarget(currentUserId, user.getId());
            return new GlobalDataResponse.UserResponse(user.getAvatar(), user.getFirstName(), user.getLastName(),
                    user.getUsername(), isfollowed);
        }).toList();
        return users;
    }
}
