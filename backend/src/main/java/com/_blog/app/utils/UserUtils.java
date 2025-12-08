package com._blog.app.utils;

import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com._blog.app.entities.UserAccount;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
// @AllArgsConstructor
@Component
public class UserUtils {
    @Autowired
    private UserRepo userRepo;

    public UserAccount findUserByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "user not found"));
    }

    public UserAccount findUserById(UUID id) {
        return userRepo.findById(id)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "user not found"));
    }

    public String generatUsername(UserAccount user) {
        String username = (user.getFirstName() + user.getLastName()).substring(0, 8);
        if (userRepo.existsByUsername(username)) {
            Random rand = new Random();
            int uniq = rand.nextInt(100) + 1;
            username = username + uniq;
        }

        return username;
    }
}
