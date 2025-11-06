package com._blog.app.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.app.dtos.ReportsReactionRequest;
import com._blog.app.entities.Report;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.PosteRepo;
import com._blog.app.repository.ReportRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;

@Service
public class AdminServise {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ReportRepo reportRepo;
    @Autowired
    private PosteRepo posteRepo;
    @Autowired
    private NotificationService notificationService;
    public void handleReport(ReportsReactionRequest reportsActionRequest, UserAccount admin) {

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
                    String content = "Your post titled '" + report.getReportedPost().getTitle() + "' was removed by admin due to reports.";
                    notificationService.insertNotification(report.getReportedPost().getUser(), content);
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
            report.setReactedAt(LocalDateTime.now());
        } else {
            report.setStatus(Report.Status.REJECTED);
            report.setReactedAt(LocalDateTime.now());
        }

        reportRepo.save(report);
    }
}
