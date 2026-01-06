package com._blog.app.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.dtos.LoginRequest;
import com._blog.app.dtos.RegisterRequest;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.utils.UserUtils;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    UserUtils utils;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void createUser(RegisterRequest registerRequest, MultipartFile file) {
        if (userRepo.existsByEmail(registerRequest.email())) {
            throw CustomResponseException.CustomException(400, "Email already exists");
        }
        if (registerRequest.username() != null && userRepo.existsByUsername(registerRequest.username())) {
            throw CustomResponseException.CustomException(400, "Username already exists");
        }
        if (!UserUtils.validBirthday(registerRequest.birthday())) {
            throw CustomResponseException.CustomException(400, "must have 10 years old.");
        }

        try {
            String hashedPassword = encoder.encode(registerRequest.password());

            UserAccount user = new UserAccount();
            user.setBirthday(registerRequest.birthday());
            user.setEmail(registerRequest.email());
            user.setPassword(hashedPassword);
            user.setFirstName(registerRequest.firstName());
            user.setLastName(registerRequest.lastName());
            user.setGender(registerRequest.gender());
            user.setRole("USER");
            if (registerRequest.username() == null) {
                user.setUsername(utils.generatUsername(user));
            } else {
                user.setUsername(registerRequest.username());
            }
            if (file != null && !file.isEmpty()) {
                if (file.getSize() > 2 * (1024 * 1024)) {
                    throw CustomResponseException.CustomException(400, "Avatar too large");
                }
                String contentType = file.getContentType();
                if (contentType != null && !contentType.startsWith("image/")) {
                    throw CustomResponseException.CustomException(400, "Invalid avatar file type");
                }
                String uploadDir = "../uploads/avatar/";
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                user.setAvatar("/uploads/avatar/" + fileName);
            }
            userRepo.save(user);
            System.out.println("--------> register : " + user);
        } catch (IOException e) {
            throw CustomResponseException.CustomException(500, e.getMessage());
        }
    }

    public UserAccount login(LoginRequest request) {

        Optional<UserAccount> existUser;
        if (request.email().contains("@")) {
            existUser = userRepo.findByEmail(request.email());
        } else {
            existUser = userRepo.findByUsername(request.email());
        }
        UserAccount user = existUser.orElseThrow(() -> new CustomResponseException(401, "Invalid Credentials"));
        if (!encoder.matches(request.password(), user.getPassword())) {
            throw new CustomResponseException(401, "Invalid Credentials");
        }
        return user;
    }

}
