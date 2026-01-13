package com._blog.app.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Notification;

public interface NotificationRepo extends JpaRepository<Notification, UUID> {

    List<Notification> findAllByReseverIdOrderByCreatAtDesc(UUID reseverId);
}
