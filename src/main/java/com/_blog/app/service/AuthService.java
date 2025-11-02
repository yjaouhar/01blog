package com._blog.app.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com._blog.app.dtos.LoginRequest;
import com._blog.app.dtos.RegisterRequest;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void createUser(RegisterRequest dto) {
        if (userRepo.existsByEmail(dto.email())) {
            throw CustomResponseException.CustomException(400, "Email already exists");
        }
        if (userRepo.existsByUsername(dto.username())) {
            throw CustomResponseException.CustomException(400, "Username already exists");
        }
        String hashedPassword = encoder.encode(dto.password());

        UserAccount user = new UserAccount();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(hashedPassword);
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setAge(dto.age());
        user.setGender(dto.gender());
        try {
            userRepo.save(user);
        } catch (DataIntegrityViolationException e) {
            throw CustomResponseException.CustomException(400, "Email or username already exists");
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
        } ;
        return user;
    }

}
