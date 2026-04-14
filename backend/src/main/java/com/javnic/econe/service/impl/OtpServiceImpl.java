package com.javnic.econe.service.impl;

import com.javnic.econe.entity.OtpVerification;
import com.javnic.econe.enums.OtpStatus;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.repository.OtpVerificationRepository;
import com.javnic.econe.service.EmailService;
import com.javnic.econe.service.OtpService;
import com.javnic.econe.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpVerificationRepository otpRepository;
    private final EmailService emailService;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_OTP_ATTEMPTS = 5;

    @Override
    @Transactional
    public OtpVerification generateAndSendOtp(String userId, String email) {
        // Invalidate any existing pending OTPs
        otpRepository.findByUserIdAndStatus(userId, OtpStatus.PENDING)
                .ifPresent(existingOtp -> {
                    existingOtp.setStatus(OtpStatus.EXPIRED);
                    otpRepository.save(existingOtp);
                });

        String otp = OtpGenerator.generate();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        OtpVerification otpVerification = OtpVerification.builder()
                .userId(userId)
                .email(email)
                .otp(otp)
                .status(OtpStatus.PENDING)
                .expiryTime(expiryTime)
                .createdAt(LocalDateTime.now())
                .attemptCount(0)
                .build();

        otpRepository.save(otpVerification);

        // Send OTP via email
        emailService.sendOtpEmail(email, otp);

        log.info("OTP generated and sent for user: {}", userId);
        return otpVerification;
    }

    @Override
    @Transactional
    public boolean verifyOtp(String email, String otp) {
        OtpVerification otpVerification = otpRepository
                .findByEmailAndStatus(email, OtpStatus.PENDING)
                .orElseThrow(() -> new ValidationException("No pending OTP found for this email"));

        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(otpVerification.getExpiryTime())) {
            otpVerification.setStatus(OtpStatus.EXPIRED);
            otpRepository.save(otpVerification);
            throw new ValidationException("OTP has expired. Please request a new one.");
        }

        // Check attempt count
        if (otpVerification.getAttemptCount() >= MAX_OTP_ATTEMPTS) {
            otpVerification.setStatus(OtpStatus.EXPIRED);
            otpRepository.save(otpVerification);
            throw new ValidationException("Maximum OTP attempts exceeded. Please request a new one.");
        }

        // Increment attempt count
        otpVerification.setAttemptCount(otpVerification.getAttemptCount() + 1);

        // Verify OTP
        if (otpVerification.getOtp().equals(otp)) {
            otpVerification.setStatus(OtpStatus.VERIFIED);
            otpRepository.save(otpVerification);
            log.info("OTP verified successfully for email: {}", email);
            return true;
        }

        otpRepository.save(otpVerification);
        throw new ValidationException("Invalid OTP. Attempts remaining: " +
                (MAX_OTP_ATTEMPTS - otpVerification.getAttemptCount()));
    }

    @Override
    @Transactional
    public void cleanExpiredOtps() {
        otpRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
        log.info("Cleaned up expired OTPs");
    }
}

