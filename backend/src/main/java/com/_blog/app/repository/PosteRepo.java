package com._blog.app.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Postes;
import com._blog.app.entities.UserAccount;

public interface PosteRepo extends JpaRepository<Postes, UUID> {

    List<Postes> findAllByUser(UserAccount user);

    @EntityGraph(attributePaths = {"user"})
    List<Postes> findByUserIn(List<UserAccount> users);

    long countByUserId(UUID userId);

    // Optional<Postes> findById(UUID id);

    long countByHideTrue();

    List<Postes> findAllByHideTrue();
}
