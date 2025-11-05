package com._blog.app.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Postes;
public interface  PosteRepo  extends JpaRepository<Postes, UUID> {
    
}
