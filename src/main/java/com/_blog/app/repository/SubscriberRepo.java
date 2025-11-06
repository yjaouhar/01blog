package com._blog.app.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Subscribers;
import com._blog.app.entities.UserAccount;

public interface SubscriberRepo extends JpaRepository<Subscribers, UUID> {
    boolean existsByUserIdAndTarget(UUID userId, UUID target);

    void deleteByUserIdAndTarget(UUID userId, UUID target);

    List<Subscribers> findByUserId(UserAccount user);

    List<Subscribers> findByTarget(UserAccount target);


    Page<Subscribers> findByUser(UserAccount user, Pageable pageable);

    Page<Subscribers> findByTarget(UserAccount target, Pageable pageable);
    
    long countByTarget(UserAccount target);

    long countByUser(UserAccount user);
}
