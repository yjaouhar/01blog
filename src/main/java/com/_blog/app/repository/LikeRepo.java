package com._blog.app.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Liks;

public interface LikeRepo extends JpaRepository<Liks, UUID> {
    boolean existsByUserIdAndPostId(UUID userId, UUID postId);

    void deleteByUserIdAndPostId(UUID userId, UUID postId);

    long countByPostId(UUID postId);

}
