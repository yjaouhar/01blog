package com._blog.app.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com._blog.app.entities.Subscribers;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.PosteRepo;
import com._blog.app.repository.SubscriberRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;

import jakarta.transaction.Transactional;

@Service
public class UsersService {

    @Autowired
    UserRepo userRepo;
    @Autowired
    PosteRepo postRepo;
    @Autowired
    SubscriberRepo subscriberRepo;

    @Autowired
    NotificationService notificationService;

    public List<GlobalDataResponse.UserResponse> getUsers(UserAccount currentUser) {
        Page<UserAccount> users = userRepo.findByIdNot(currentUser.getId(),
                PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "username")));

        return users.getContent().stream().map(u -> {
            Long totalPost = postRepo.countByUserId(u.getId());
            boolean followed = subscriberRepo.existsByUserId_IdAndTarget_Id(currentUser.getId(), u.getId());
            return GlobalDataResponse.UserResponse.builder()
                    .id(u.getId())
                    .username(u.getUsername())
                    .avatar(u.getAvatar())
                    .name(u.getFirstName() + " " + u.getLastName())
                    .totalPost(totalPost)
                    .followed(followed)
                    .build();
        }).toList();
    }

    public List<GlobalDataResponse.UserResponse> explor(UUID currentUserId, String keyword, int page, int size) {
        Page<UserAccount> allusers = userRepo.searchByFullName(currentUserId, "%" + keyword.toLowerCase() + "%",
                PageRequest.of(page, size));
        List<GlobalDataResponse.UserResponse> users = allusers.getContent().stream().map(u -> {
            boolean isfollowed = subscriberRepo.existsByUserId_IdAndTarget_Id(currentUserId, u.getId());
            Long totalPost = postRepo.countByUserId(u.getId());
            return GlobalDataResponse.UserResponse.builder()
                    .id(u.getId())
                    .avatar(u.getAvatar())
                    .name(u.getFirstName() + " " + u.getLastName())
                    .totalPost(totalPost)
                    .followed(isfollowed)
                    .build();
        }).toList();
        return users;
    }

    @Transactional
    public String subscribHandel(UserAccount currentUser, UserAccount targetUser) {
        if (currentUser.getId().equals(targetUser.getId())) {
            throw CustomResponseException.CustomException(400, "can't follow yourself");
        }
        if (subscriberRepo.existsByUserId_IdAndTarget_Id(currentUser.getId(), targetUser.getId())) {
            subscriberRepo.deleteByUser_IdAndTarget_Id(currentUser.getId(), targetUser.getId());
            return "unfollow";
        }
        Subscribers subscribers = new Subscribers();
        subscribers.setTarget(targetUser);
        subscribers.setUser(currentUser);
        subscriberRepo.save(subscribers);
        String content = currentUser.getUsername() + " started follwing you ";
        notificationService.insertNotification(targetUser, content);
        return "follow";

    }
    // public GlobalDataResponse<List<UserResponse>> followers(UserAccount currentUser, int page, int size) {
    //     Page<Subscribers> followersPage = subscriberRepo.findByTarget(currentUser, PageRequest.of(page, size));
    //     List<GlobalDataResponse.UserResponse> followers = followersPage.getContent().stream()
    //             .map(follow -> {
    //                 UserAccount user = follow.getUser();
    //                 return new GlobalDataResponse.UserResponse(user.getAvatar(), user.getFirstName(),
    //                         user.getLastName(), user.getUsername(),
    //                         subscriberRepo.existsByUserId_IdAndTarget_Id(currentUser.getId(), user.getId()));
    //             }).toList();
    //     return new GlobalDataResponse<>(followers, followersPage.getNumber(), followersPage.getTotalPages(),
    //             followersPage.hasNext());
    // }
    // public GlobalDataResponse<List<UserResponse>> following(UserAccount currentUser, int page, int size) {
    //     Page<Subscribers> followingPage = subscriberRepo.findByUser(currentUser, PageRequest.of(page, size));
    //     List<GlobalDataResponse.UserResponse> following = followingPage.getContent().stream()
    //             .map(follow -> {
    //                 UserAccount user = follow.getUser();
    //                 return new GlobalDataResponse.UserResponse(user.getAvatar(), user.getFirstName(),
    //                         user.getLastName(), user.getUsername(), true);
    //             }).toList();
    //     return new GlobalDataResponse<>(
    //             following, followingPage.getNumber(), followingPage.getTotalPages(),
    //             followingPage.hasNext());
    // }
}
