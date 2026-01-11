package com._blog.app.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Subscribers;
import com._blog.app.entities.UserAccount;

public interface SubscriberRepo extends JpaRepository<Subscribers, UUID> {
    boolean existsByUserId_IdAndTarget_Id(UUID userId, UUID target);

    void deleteByUser_IdAndTarget_Id(UUID userId, UUID target);

    List<Subscribers> findByUser(UserAccount user);

//    Optional< List<Subscribers>> findByTarget(UserAccount target);


    // List<Subscribers> findByUser(UserAccount user);

    List<Subscribers> findByTarget(UserAccount target);
    
    long countByTarget(UserAccount target);

    long countByUser(UserAccount user);
}
