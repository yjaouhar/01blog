package com._blog.app.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.app.entities.Subscribers;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.SubscriberRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;

@Service
public class ProfileService {
    
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SubscriberRepo subscriberRepo;
    public void subscribHandel(UUID userId, String username) {
        UserAccount user = userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "user not found"));
        if (user.getId().equals(userId)) {
            throw CustomResponseException.CustomException(400, "can't follow yourself");
        }
        UserAccount target = userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "user not found"));
        if (subscriberRepo.existsByUserIdAndTarget(user.getId(), userId)) {
            subscriberRepo.deleteByUserIdAndTarget(user.getId(), userId);
            } else {
                Subscribers subscribers = new Subscribers();
                subscribers.setTarget(target);
                subscribers.setUser(user);
                subscriberRepo.save(subscribers);

        }
    }
}
