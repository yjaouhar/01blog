package com._blog.app.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._blog.app.dtos.ReportsReactionRequest;
import com._blog.app.entities.Postes;
import com._blog.app.entities.Report;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.PosteRepo;
import com._blog.app.repository.ReportRepo;
import com._blog.app.repository.UserRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.utils.PosteUtils;

@Service
public class AdminServise {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ReportRepo reportRepo;
    @Autowired
    private PosteRepo posteRepo;
    @Autowired
    private ReportService reportService;

    @Autowired
    private PosteUtils posteUtils;

    @Transactional
    public List<GlobalDataResponse.Report> handleReport(ReportsReactionRequest reportsActionRequest, UserAccount admin) {

        if (!"ADMIN".equals(admin.getRole())) {
            throw CustomResponseException.CustomException(403, "You are not allowed to handle reports");
        }

        Report report = reportRepo.findById(reportsActionRequest.reportId())
                .orElseThrow(() -> CustomResponseException.CustomException(404, "Report not found"));
        List<Report> allReports = new ArrayList<>();

        if (reportsActionRequest.status()) {

            if (report.getReportedPost() != null) {
                if (reportsActionRequest.remove()) {
                    posteRepo.delete(report.getReportedPost());
                } else {
                    report.getReportedPost().setHide(true);
                    posteRepo.save(report.getReportedPost());
                }
                allReports = reportRepo.findAllByReportedPostId(report.getReportedPost().getId());
            } else if (report.getReportedUser() != null) {
                if (report.getReportedUser().getRole().equals("ADMIN")) {
                    throw CustomResponseException.CustomException(403, "this account for admin");
                }
                if (reportsActionRequest.remove()) {
                    userRepo.delete(report.getReportedUser());
                } else {
                    report.getReportedUser().setActive(false);
                    userRepo.save(report.getReportedUser());
                }
                allReports = reportRepo.findAllByReportedUserId(report.getReportedUser().getId());
            }
        } else {
            if (report.getReportedPost() != null) {
                allReports = reportRepo.findAllByReportedPostId(report.getReportedPost().getId());
            } else if (report.getReportedUser() != null) {
                allReports = reportRepo.findAllByReportedUserId(report.getReportedUser().getId());
            }
        }
        for (Report r : allReports) {
            r.setStatus(Report.Status.RESOLVED);
        }
        reportRepo.saveAll(allReports);
        return reportService.allReport();
    }

    public GlobalDataResponse.Stats stats() {
        long totalUsers = userRepo.countUsersExceptRole("ADMIN");
        long totalPosts = posteRepo.count();
        long activeReports = reportRepo.countActiveReport(Report.Status.PENDING);
        long banned = userRepo.countByActiveFalse() + posteRepo.countByHideTrue();
        return GlobalDataResponse.Stats.builder()
                .totalPosts(totalPosts)
                .totalUsers(totalUsers)
                .activeReports(activeReports)
                .banned(banned).build();
    }

    public List<GlobalDataResponse.Users> users() {
        return userRepo.findUsersExceptRole("ADMIN").stream().map(u -> {
            return GlobalDataResponse.Users.builder()
                    .id(u.getId())
                    .avatart(u.getAvatar())
                    .username(u.getUsername())
                    .email(u.getEmail())
                    .status(u.isActive())
                    .build();
        }).toList();
    }

    @Transactional
    public void deletUser(UserAccount user, UserAccount target) {
        if (!user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "This action special for Admin");
        }
        if (target != null) {
            userRepo.deleteById(target.getId());
            if (!target.getAvatar().isBlank()) {
                File f = new File(".." + target.getAvatar());
                if (f.exists()) {
                    f.delete();
                }
            }
        }
    }

    @Transactional
    public void activeUser(UserAccount user, UserAccount target) {
        if (!user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "This action special for Admin");
        }
        target.setActive(true);
        userRepo.save(target);
    }

    @Transactional
    public void baneUser(UserAccount user, UserAccount target) {
        if (!user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "This action special for Admin");
        }
        target.setActive(false);
        userRepo.save(target);
    }

    @Transactional
    public List<GlobalDataResponse.Postes> getPostes(UserAccount user) {
        if (!user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "This action special for Admin");
        }
        return posteRepo.findAll().stream().map(p -> {
            return GlobalDataResponse.Postes.builder()
                    .id(p.getId())
                    .authore(p.getUser().getUsername())
                    .descreption(p.getDescription())
                    .hide(p.isHide())
                    .build();
        }).toList();
    }

    @Transactional
    public void deletPoste(UserAccount user, UUID postId) {
        if (!user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "This action special for Admin");
        }

        posteRepo.deleteById(postId);
    }

    @Transactional
    public void activePoste(UserAccount user, UUID poatId) {
        if (!user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "This action special for Admin");
        }
        Postes post = posteUtils.findPostById(poatId);
        post.setHide(false);
        posteRepo.save(post);

    }

    @Transactional
    public void banePoste(UserAccount user, UUID poatId) {
        if (!user.getRole().equals("ADMIN")) {
            throw CustomResponseException.CustomException(403, "This action special for Admin");
        }
        Postes post = posteUtils.findPostById(poatId);
        post.setHide(true);
        posteRepo.save(post);
    }
}
