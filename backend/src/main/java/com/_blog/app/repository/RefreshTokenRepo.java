package com._blog.app.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.RefreshToken;
import com._blog.app.entities.UserAccount;

public interface RefreshTokenRepo extends JpaRepository<RefreshToken, UUID> {

    // @Modifying(clearAutomatically = true, flushAutomatically = true)
    // @Query("DELETE FROM refreshToken r WHERE r.user = :user")
    void deleteByUser(UserAccount user);

    RefreshToken findByUser(UserAccount user);

    Optional<RefreshToken> findByToken(String token);

    void deleteByToken(String token);

    boolean existsByUser(UserAccount user);
}
