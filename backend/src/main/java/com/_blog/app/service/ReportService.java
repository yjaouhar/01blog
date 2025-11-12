package com._blog.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.app.dtos.ReportRequest;
import com._blog.app.entities.Report;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.ReportRepo;
import com._blog.app.shared.CustomResponseException;
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

    public List<Report> allReport() {
        return reportRepo.findAll();
    }

    public void report(ReportRequest reportRequest, UserAccount reporter) {

        if (reportRequest.reportedUser() == null && reportRequest.reportedPost() == null) {
            throw CustomResponseException.CustomException(400, "You must specify a user or a post to report");
        }
        if (reportRequest.reportedUser() != null && reportRequest.reportedPost() != null) {
            throw CustomResponseException.CustomException(400, "You can only report either a user or a post, not both");
        }
        Report report = new Report();
        report.setReason(reportRequest.reason());
        report.setReporter(reporter);
        if (reportRequest.reportedUser() != null) {
            report.setReportedUser(userUtils.findUserById(reportRequest.reportedUser()));
        }
        if (reportRequest.reportedPost() != null) {
            report.setReportedPost(posteUtils.findPostById(reportRequest.reportedPost()));
        }
        reportRepo.save(report);
    }

    public void reactForReport(ReportRequest reportRequest, UserAccount reporter) {
    }
}
