package com._blog.app.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Subscribers;

public interface SubscriberRepo extends  JpaRepository<Subscribers, UUID>{
    boolean existsByUserIdAndTarget(UUID userId, UUID target);
    
    void deleteByUserIdAndTarget(UUID userId, UUID target);
}
