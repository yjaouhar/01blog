package com._blog.app.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Postes;
import com._blog.app.entities.UserAccount;
public interface  PosteRepo  extends JpaRepository<Postes, UUID> {
    Page<Postes> findAllByUser(UserAccount user, Pageable pageable);
    @EntityGraph(attributePaths = {"user"})
    Page<Postes> findByUserIn(List<UserAccount> users, Pageable pageable);
    long countByUserId(UUID userId);

}
