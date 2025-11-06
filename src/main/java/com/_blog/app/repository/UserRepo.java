package com._blog.app.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com._blog.app.entities.UserAccount;

public interface UserRepo extends JpaRepository<UserAccount, UUID> {
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<UserAccount> findByEmail(String email);

    Optional<UserAccount> findByUsername(String username);

    @Query("SELECT u FROM UserAccount u " +
            "WHERE u.id <> :userId " +
            "AND CONCAT(u.firstName, ' ', u.lastName) LIKE %:fullName%" +
            "OR u.username LIKE %:fullName%)")
    Page<UserAccount> searchByFullName(@Param("userId") UUID userId,
            @Param("fullName") String fullName,
            Pageable pageable);

    Page<UserAccount> findByIdNot(UUID id, Pageable pageable);
}
