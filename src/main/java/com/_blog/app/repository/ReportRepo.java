package com._blog.app.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Report;
import com._blog.app.entities.UserAccount;

public interface ReportRepo extends JpaRepository<Report, UUID> {

    boolean existsByReporter(UserAccount reporter);
    
}
