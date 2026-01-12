package com._blog.app.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com._blog.app.entities.Liks;

import jakarta.persistence.LockModeType;

public interface LikeRepo extends JpaRepository<Liks, UUID> {


    boolean existsByUserIdAndPostId(UUID userId, UUID postId);
    long countByPostId(UUID postId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Liks> findByUserIdAndPostId(UUID userId, UUID postId);
}
