package com._blog.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.app.dtos.ReportsActionRequest;
import com._blog.app.entities.Postes;
import com._blog.app.entities.Report;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.PosteRepo;
import com._blog.app.repository.ReportRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;

@Service
public class AdminSercive {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ReportRepo reportRepo;

    @Autowired
    private PosteRepo posteRepo;
    public void handleReport(ReportsActionRequest reportsActionRequest , String adminUsername) {
    UserAccount admin = userRepo.findByUsername(adminUsername)
            .orElseThrow(() -> CustomResponseException.CustomException(404, "User not found"));

    if (!"ADMIN".equals(admin.getRole())) {
        throw CustomResponseException.CustomException(403, "You are not allowed to handle reports");
    }

    Report report = reportRepo.findById(reportsActionRequest.reportId())
            .orElseThrow(() -> CustomResponseException.CustomException(404, "Report not found"));

    if (reportsActionRequest.status()) {
        report.setStatus(Report.Status.RESOLVED);
       
        if (report.getReportedPost() != null) {
            if (reportsActionRequest.remove()) {
                posteRepo.delete(report.getReportedPost());
            } else {
                report.getReportedPost().setHide(true);
                posteRepo.save(report.getReportedPost());
            }
        }
        if (report.getReportedUser() != null) {
            if (reportsActionRequest.remove()) {
                userRepo.delete(report.getReportedUser());
            } else {
                report.getReportedUser().setActive(false);
                userRepo.save(report.getReportedUser());
            }
        }
    } else {
        report.setStatus(Report.Status.REJECTED);
    }

    reportRepo.save(report);
}
}
