package com._blog.app.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.UserAccount;

public interface  UserRepo extends JpaRepository<UserAccount, UUID> {
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
    Optional<UserAccount> findByEmail(String email);

    Optional<UserAccount> findByUsername(String username);
}
