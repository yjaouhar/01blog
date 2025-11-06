package com._blog.app.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Notification;

public interface  NotificationRepo extends JpaRepository<Notification, UUID> {
    
Page<Notification> findAllByReseverId(UUID reseverId , Pageable pageable);
}
