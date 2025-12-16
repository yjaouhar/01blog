package com._blog.app.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.RefreshToken;

public interface RefreshTokenRepo extends JpaRepository<RefreshToken, UUID> {

}
