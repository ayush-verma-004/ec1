package com.javnic.econe.config;

import com.javnic.econe.repository.OtpVerificationRepository;
import com.javnic.econe.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduledTasks {

    private final OtpVerificationRepository otpRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    // Clean up expired OTPs every hour
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredOtps() {
        log.info("Starting cleanup of expired OTPs");
        otpRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
        log.info("Completed cleanup of expired OTPs");
    }

    // Clean up expired refresh tokens every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void cleanupExpiredRefreshTokens() {
        log.info("Starting cleanup of expired refresh tokens");
        refreshTokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
        log.info("Completed cleanup of expired refresh tokens");
    }
}