package com._blog.app.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._blog.app.repository.RefreshTokenRepo;


@Service
public class RefreshTokenClenupService {

    private final RefreshTokenRepo refTokenRepo;

    public RefreshTokenClenupService(RefreshTokenRepo refTokenRepo) {
        this.refTokenRepo = refTokenRepo;
    }

    @Transactional
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExperRefreshToken() {
        refTokenRepo.deleteAllByExpiryDateBefore(LocalDateTime.now());
    }

}
