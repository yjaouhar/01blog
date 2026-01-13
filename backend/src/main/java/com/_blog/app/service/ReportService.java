package com._blog.app.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.app.dtos.ReportRequest;
import com._blog.app.entities.Postes;
import com._blog.app.entities.Report;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.ReportRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.utils.PosteUtils;
import com._blog.app.utils.UserUtils;

@Service
public class ReportService {

    @Autowired
    private ReportRepo reportRepo;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private PosteUtils posteUtils;

    public List<GlobalDataResponse.Report> allReport() {
        return reportRepo.findAll().stream().map(r -> {
            String typ;
            String target;
            UUID targetId;

            if (r.getReportedPost() != null) {
                typ = "post";
                target = r.getReportedPost().getDescription();
                targetId = r.getReportedPost().getId();
            } else {
                typ = "user";
                target = r.getReportedUser().getUsername();
                targetId = r.getReportedUser().getId();

            }
            return GlobalDataResponse.Report.builder()
                    .id(r.getId())
                    .time(r.getCreatedAt())
                    .type(typ)
                    .targetId(targetId)
                    .reporter(r.getReporter().getUsername())
                    .target(target)
                    .reason(r.getReason())
                    .status(r.getStatus().toString()).build();
        }).toList();

    }

    public void report(ReportRequest reportRequest, UserAccount reporter) {

        if (reportRequest.reportedUser() == null && reportRequest.reportedPost() == null) {
            throw CustomResponseException.CustomException(400, "You must specify a user or a post to report");
        }
        if (reportRequest.reportedUser() != null && reportRequest.reportedPost() != null) {
            throw CustomResponseException.CustomException(400, "You can only report either a user or a post, not both");
        }
        UserAccount currentUser = userUtils.findUserById(UserUtils.getPrincipal().getId());
        Report report = new Report();
        if (reportRequest.reportedUser() != null) {
            UserAccount user = userUtils.findUserById(reportRequest.reportedUser());
            if (!user.isActive()) {
                throw CustomResponseException.CustomException(403, "this user is bane");

            }
            if (user.getId().equals(currentUser.getId())) {
                throw CustomResponseException.CustomException(403, "can not report your profile");
            }
            if (user.getRole().equals("ADMIN")) {
                throw CustomResponseException.CustomException(403, "can not report admin");
            }
            boolean exist = reportRepo.existsByReporterIdAndReportedUserId(reporter.getId(),
                    reportRequest.reportedUser());
            if (exist) {
                throw CustomResponseException.CustomException(409, "You have already reported this content");
            }
            report.setReportedUser(userUtils.findUserById(reportRequest.reportedUser()));
        }
        if (reportRequest.reportedPost() != null) {
            Postes post = posteUtils.findPostById(reportRequest.reportedPost());
            if (post.isHide()) {
                throw CustomResponseException.CustomException(403, "this post is hide");
            }
            if (post.getUser().getId().equals(currentUser.getId())) {
                throw CustomResponseException.CustomException(403, "can not report your post");
            }
            if (post.getUser().getRole().equals("ADMIN")) {
                throw CustomResponseException.CustomException(403, "can not report admin post");
            }
            boolean exist = reportRepo.existsByReporterIdAndReportedPostId(reporter.getId(),
                    reportRequest.reportedPost());
            if (exist) {
                throw CustomResponseException.CustomException(409, "You have already reported this content");
            }
            report.setReportedPost(posteUtils.findPostById(reportRequest.reportedPost()));
        }
        report.setReason(reportRequest.reason());
        report.setReporter(reporter);
        reportRepo.save(report);
    }

}
