package com.javnic.econe.service.impl;

import com.javnic.econe.entity.OtpVerification;
import com.javnic.econe.enums.OtpStatus;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.repository.OtpVerificationRepository;
import com.javnic.econe.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceImplTest {

    @Mock
    private OtpVerificationRepository otpRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OtpServiceImpl otpService;

    private OtpVerification otpVerification;

    @BeforeEach
    void setUp() {
        otpVerification = OtpVerification.builder()
                .id("1")
                .userId("user1")
                .email("test@example.com")
                .otp("123456")
                .status(OtpStatus.PENDING)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .attemptCount(0)
                .build();
    }

    @Test
    void generateAndSendOtp_Success() {
        when(otpRepository.findByUserIdAndStatus(anyString(), eq(OtpStatus.PENDING))).thenReturn(Optional.empty());
        when(otpRepository.save(any(OtpVerification.class))).thenReturn(otpVerification);

        OtpVerification result = otpService.generateAndSendOtp("user1", "test@example.com");

        assertNotNull(result);
        verify(otpRepository).save(any(OtpVerification.class));
        verify(emailService).sendOtpEmail(anyString(), anyString());
    }

    @Test
    void verifyOtp_Success() {
        when(otpRepository.findByEmailAndStatus(anyString(), eq(OtpStatus.PENDING)))
                .thenReturn(Optional.of(otpVerification));
        when(otpRepository.save(any(OtpVerification.class))).thenReturn(otpVerification);

        boolean result = otpService.verifyOtp("test@example.com", "123456");

        assertTrue(result);
        assertEquals(OtpStatus.VERIFIED, otpVerification.getStatus());
        verify(otpRepository).save(otpVerification);
    }

    @Test
    void verifyOtp_InvalidOtp_ThrowsException() {
        when(otpRepository.findByEmailAndStatus(anyString(), eq(OtpStatus.PENDING)))
                .thenReturn(Optional.of(otpVerification));

        assertThrows(ValidationException.class, () -> otpService.verifyOtp("test@example.com", "654321"));
        assertEquals(1, otpVerification.getAttemptCount());
        verify(otpRepository).save(otpVerification);
    }

    @Test
    void verifyOtp_ExpiredOtp_ThrowsException() {
        otpVerification.setExpiryTime(LocalDateTime.now().minusMinutes(1));
        when(otpRepository.findByEmailAndStatus(anyString(), eq(OtpStatus.PENDING)))
                .thenReturn(Optional.of(otpVerification));

        assertThrows(ValidationException.class, () -> otpService.verifyOtp("test@example.com", "123456"));
        assertEquals(OtpStatus.EXPIRED, otpVerification.getStatus());
        verify(otpRepository).save(otpVerification);
    }

    @Test
    void verifyOtp_MaxAttemptsExceeded_ThrowsException() {
        otpVerification.setAttemptCount(5);
        when(otpRepository.findByEmailAndStatus(anyString(), eq(OtpStatus.PENDING)))
                .thenReturn(Optional.of(otpVerification));

        assertThrows(ValidationException.class, () -> otpService.verifyOtp("test@example.com", "123456"));
        assertEquals(OtpStatus.EXPIRED, otpVerification.getStatus());
        verify(otpRepository).save(otpVerification);
    }
}
