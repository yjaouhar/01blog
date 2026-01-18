package com._blog.app.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com._blog.app.entities.Comment;

import jakarta.persistence.LockModeType;

public interface CommentRepo extends JpaRepository<Comment, UUID> {



    long countByPostId(UUID postId);

    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Comment> findById(UUID commentId);

    List<Comment> findAllByPostId(UUID postId);
}
