package com._blog.app.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com._blog.app.entities.Postes;
import com._blog.app.entities.UserAccount;

import jakarta.persistence.LockModeType;

public interface PosteRepo extends JpaRepository<Postes, UUID> {

    List<Postes> findAllByUser(UserAccount user);

    @EntityGraph(attributePaths = {"user"})
    List<Postes> findByUserIn(List<UserAccount> users);

    long countByUserId(UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Postes p where p.id = :id")
    Optional<Postes> findByIdForUpdate( @Param("id") UUID postId);

    @Override
    Optional<Postes> findById(UUID postId);

    long countByHideTrue();

    List<Postes> findAllByHideTrue();
}
