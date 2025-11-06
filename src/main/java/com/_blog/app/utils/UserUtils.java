package com._blog.app.utils;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

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
public class UserUtils {
    @Autowired
    private static  UserRepo userRepo;

    public  UserAccount findUserByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "user not found"));
    }
    
    public  UserAccount findUserById(UUID id) {
        return userRepo.findById(id)
                .orElseThrow(() -> CustomResponseException.CustomException(404, "user not found"));
    }
}
