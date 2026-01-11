package com._blog.app.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com._blog.app.entities.Report;

public interface ReportRepo extends JpaRepository<Report, UUID> {

    boolean existsByReporterIdAndReportedPostId(UUID reporterId, UUID postId);

    boolean existsByReporterIdAndReportedUserId(UUID reporterId, UUID postId);

    @Query("""
            SELECT COUNT(r)
            FROM Report r
            WHERE r.status = :status
    """)
    long countActiveReport(@Param("status") Report.Status status);

    List<Report> findAllByReportedPostId(UUID reportedPostId);

    List<Report> findAllByReportedUserId(UUID reportedUserId);
}
