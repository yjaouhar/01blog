package com._blog.app.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com._blog.app.entities.UserAccount;

public interface UserRepo extends JpaRepository<UserAccount, UUID> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<UserAccount> findByEmail(String email);

    Optional<UserAccount> findByUsername(String username);

    @Query("""
SELECT u FROM UserAccount u
WHERE u.id <> :userId
  AND (
    LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE :fullName
    OR LOWER(u.username) LIKE :fullName
  )
ORDER BY u.firstName ASC
""")
    List<UserAccount> searchByFullName(
            @Param("userId") UUID userId,
            @Param("fullName") String fullName
    );

    List<UserAccount> findByIdNot(UUID id);

    long countByActiveFalse();

    @Query("""
    SELECT COUNT(u)
    FROM UserAccount u
    WHERE u.role <> :role
""")
    long countUsersExceptRole(@Param("role") String role);
    @Query("""
    SELECT  u FROM UserAccount u
    WHERE u.role <> :role
""")
    List<UserAccount> findUsersExceptRole(@Param("role") String role);

    List<UserAccount> findAllByActiveFalse();
    // void deletById(UUID id);
}
