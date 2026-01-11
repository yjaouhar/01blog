package com._blog.app.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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
        List<UserAccount> usersPage = userRepo.findByIdNot(currentUser.getId());

        return usersPage.stream().filter(u -> u.isActive()).map(u -> {
            Long totalPost = postRepo.countByUserId(u.getId());
            boolean followed = subscriberRepo.existsByUserId_IdAndTarget_Id(currentUser.getId(), u.getId());
            return GlobalDataResponse.UserResponse.builder()
                    .id(u.getId())
                    .email(u.getEmail())
                    .username(u.getUsername())
                    .avatar(u.getAvatar())
                    .name(u.getFirstName() + " " + u.getLastName())
                    .totalPost(totalPost)
                    .followed(followed)
                    .build();
        }).toList();

    }

    public List<GlobalDataResponse.UserResponse> explor(UUID currentUserId, String keyword, int page, int size) {
        List<UserAccount> allusers = userRepo.searchByFullName(currentUserId, "%" + keyword.toLowerCase() + "%");
        return allusers.stream().filter(u -> u.isActive()).map(u -> {
            boolean isfollowed = subscriberRepo.existsByUserId_IdAndTarget_Id(currentUserId, u.getId());
            Long totalPost = postRepo.countByUserId(u.getId());
            return GlobalDataResponse.UserResponse.builder()
                    .id(u.getId())
                    .email(u.getEmail())
                    .avatar(u.getAvatar())
                    .name(u.getFirstName() + " " + u.getLastName())
                    .totalPost(totalPost)
                    .followed(isfollowed)
                    .build();
        }).toList();
    }

    @Transactional
    public String subscribHandel(UserAccount currentUser, UserAccount targetUser) {
        if (currentUser.getId().equals(targetUser.getId())) {
            throw CustomResponseException.CustomException(400, "can't follow yourself");
        }
        if (!targetUser.isActive()) {
            throw CustomResponseException.CustomException(403,
                    "this user is bane");
        }
        if (subscriberRepo.existsByUserId_IdAndTarget_Id(currentUser.getId(), targetUser.getId())) {
            subscriberRepo.deleteByUser_IdAndTarget_Id(currentUser.getId(), targetUser.getId());
            return "unfollow";
        }
        Subscribers subscribers = new Subscribers();
        subscribers.setTarget(targetUser);
        subscribers.setUser(currentUser);
        subscriberRepo.save(subscribers);
        
        return "follow";

    }

}
