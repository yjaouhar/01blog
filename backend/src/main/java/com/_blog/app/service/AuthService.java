package com._blog.app.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.config.JwtHelper;
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
    JwtHelper jwtHelper;
    @Autowired
    UserUtils utils;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void createUser(RegisterRequest registerRequest, MultipartFile file) {
        if (userRepo.existsByEmail(registerRequest.email())) {
            throw CustomResponseException.CustomException(400, "Email already exists");
        }
        if (!registerRequest.username().isBlank() && userRepo.existsByUsername(registerRequest.username())) {
            throw CustomResponseException.CustomException(400, "Username already exists");
        }

        try {
            String hashedPassword = encoder.encode(registerRequest.password());

            UserAccount user = new UserAccount();
            if (registerRequest.username().isBlank()) {
                utils.generatUsername(user);
            } else {
                user.setUsername(registerRequest.username());
            }
            user.setAge(registerRequest.age());
            user.setEmail(registerRequest.email());
            user.setPassword(hashedPassword);
            user.setFirstName(registerRequest.firstName());
            user.setLastName(registerRequest.lastName());
            user.setGender(registerRequest.gender());
            user.setRole("USER");
            if (file != null && !file.isEmpty()) {
                String uploadDir = "../uploads/avatar/";
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                user.setAvatar("../" + uploadDir + fileName);
            }
            userRepo.save(user);
        } catch (IOException e) {
            throw CustomResponseException.CustomException(500, e.getMessage());
        }
    }

    public String login(LoginRequest request) {

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
        Map<String, Object> customClaims = new HashMap<>();
        customClaims.put("userId", user.getId());
        customClaims.put("role", user.getRole());
        return jwtHelper.generateToken(customClaims, user);
    }

}
