package com._blog.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.app.dtos.ReportRequest;
import com._blog.app.entities.UserAccount;
import com._blog.app.model.JwtUserPrincipal;
import com._blog.app.service.ReportService;
import com._blog.app.shared.GlobalResponse;
import com._blog.app.utils.UserUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @Autowired
    private UserUtils userUtils;

 
  @PostMapping()
  public ResponseEntity<GlobalResponse<?>> declaration(@RequestBody @Valid ReportRequest reportRequest) {
      JwtUserPrincipal principal = UserUtils.getPrincipal();
      UserAccount reporter = userUtils.findUserByUsername(principal.getUsername());
        System.out.println("===> report " + reporter.getUsername() + " <=====> "+reportRequest.reason() + " <====> " + reportRequest.reportedPost());
        reportService.report(reportRequest, reporter);
        return new ResponseEntity<>(new GlobalResponse<>("report success !"), HttpStatus.OK);
    }

    // @PostMapping("/react")
    // public ResponseEntity<GlobalResponse<?>> react(@RequestBody @Valid ReportRequest reportRequest,
    //         Principal principal) {
    //     UserAccount reporter = userUtils.findUserByUsername(principal.getName());
    //     reportService.report(reportRequest, reporter);
    //     return new ResponseEntity<>(new GlobalResponse<>("report success !"), HttpStatus.OK);
    // }

}
