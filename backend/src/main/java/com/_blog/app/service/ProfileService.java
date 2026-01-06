package com._blog.app.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

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
import com._blog.app.repository.ReportRepo;
import com._blog.app.repository.SubscriberRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.shared.GlobalDataResponse.PostResponse;
import com._blog.app.utils.UserUtils;

import jakarta.transaction.Transactional;

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
    @Autowired
    private ReportRepo reportRepo;

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

    public ProfileDetailsResponse userDetails(UserAccount profile, UUID currentUserId) {
        ProfileDetailsResponse profileDetails = new ProfileDetailsResponse();
        profileDetails.setId(profile.getId());
        profileDetails.setFirstName(profile.getFirstName());
        profileDetails.setLasteName(profile.getLastName());
        profileDetails.setBirthday(profile.getBirthday());
        profileDetails.setGender(profile.getGender());
        profileDetails.setBio(profile.getBio());
        profileDetails.setUserName(profile.getUsername());
        profileDetails.setEmail(profile.getEmail());
        profileDetails.setAvatar(profile.getAvatar());
        profileDetails.setRole(profile.getRole());
        profileDetails.setPostes(posteRepo.countByUserId(profile.getId()));
        profileDetails.setFollowers(subscriberRepo.countByTarget(profile));
        profileDetails.setFollowing(subscriberRepo.countByUser(profile));
        if (profile.getId().equals(currentUserId)) {
            profileDetails.setPersonelProfile(true);
        } else {
            profileDetails.setPersonelProfile(false);
            profileDetails.setReacted(subscriberRepo.existsByUserId_IdAndTarget_Id(currentUserId, profile.getId()));
            profileDetails.setReported(reportRepo.existsByReporterIdAndReportedUserId(currentUserId, profile.getId()));
        }
        return profileDetails;
    }

    @Transactional
    public void editInfo(EditProfileRequest editRequest, UserAccount currentUser, MultipartFile file) {

        UserAccount profileUser = userUtils.findUserById(editRequest.profileId());

        // System.out.println("=======> new data "
        //         + UserUtils.validBirthday(editRequest.birthday())
        // );
        if (!currentUser.getId().equals(profileUser.getId())) {
            throw CustomResponseException.CustomException(403, "You can't have access to edit profile");
        }

        if (editRequest.email() != null && !editRequest.email().isBlank()) {
            if (userRepo.existsByEmail(editRequest.email())) {
                throw CustomResponseException.CustomException(409, "Email already exists");
            }
            profileUser.setEmail(editRequest.email());
        }
        if (editRequest.username() != null && !editRequest.username().isBlank()) {
            if (userRepo.existsByUsername(editRequest.username())) {
                throw CustomResponseException.CustomException(409, "Username already exists");
            }
            profileUser.setUsername(editRequest.username());
        }
        if (editRequest.firstName() != null && !editRequest.firstName().isBlank()) {
            profileUser.setFirstName(editRequest.firstName());
        }

        if (editRequest.lastName() != null && !editRequest.lastName().isBlank()) {
            profileUser.setLastName(editRequest.lastName());
        }
        if (editRequest.birthday() != null) {
            if (UserUtils.validBirthday(editRequest.birthday())) {
                profileUser.setBirthday(editRequest.birthday());
            } else {
                throw CustomResponseException.CustomException(400, "must have 10 years old.");
            }
        }
        if (editRequest.gender() != null && !editRequest.gender().isBlank()) {
            profileUser.setGender(editRequest.gender());
        }
        if (editRequest.bio() != null && !editRequest.bio().isBlank()) {
            profileUser.setBio(editRequest.bio());
        }
        if (editRequest.removeMedia() != null && Boolean.TRUE.equals(editRequest.removeMedia())) {
            String media = profileUser.getAvatar();
            if (media != null && !media.isBlank()) {
                File f = new File(".." + media);
                if (f.exists()) {
                    f.delete();
                }
                profileUser.setAvatar(null);
            }

        }
        if (file != null && !file.isEmpty()) {
            String contentType = file.getContentType();
            if (contentType != null) {
                String fileType = contentType.split("/")[0];
                if (!fileType.equals("image")) {
                    throw CustomResponseException.CustomException(400, "Only image allowed");
                }
            }
            if (file.getSize() > 2 * (1024 * 1024)) {
                throw CustomResponseException.CustomException(400, "avatar too large");
            }
            try {
                String uploadDir = "../uploads/avatar/";
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path path = Paths.get(uploadDir + fileName);
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                String media = profileUser.getAvatar();
                if (media != null && !media.isBlank()) {
                    File f = new File(".." + media);
                    if (f.exists()) {
                        f.delete();
                    }
                    profileUser.setAvatar(null);
                }
                profileUser.setAvatar("/uploads/avatar/" + fileName);
            } catch (IOException ex) {
                throw CustomResponseException.CustomException(500, "Failed to save media file");
            }
        }

        userRepo.save(profileUser);
    }

}
