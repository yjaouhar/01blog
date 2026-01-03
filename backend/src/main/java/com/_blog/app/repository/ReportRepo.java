package com._blog.app.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.app.entities.Report;

public interface ReportRepo extends JpaRepository<Report, UUID> {

    boolean existsByReporterIdAndReportedPostId(UUID reporterId, UUID postId);
    boolean existsByReporterIdAndReportedUserId(UUID reporterId, UUID postId);
}
