package com._blog.app.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Comment;

public interface  CommentRepo extends JpaRepository<Comment, UUID> {
    boolean existsByUserIdAndPostId(UUID userId, UUID postId);

    void deleteByUserIdAndPostId(UUID userId, UUID postId);
    
    long countByPostId(UUID postId);

    List<Comment> findAllByUserIdAndPostId(UUID userId, UUID postId);
}
