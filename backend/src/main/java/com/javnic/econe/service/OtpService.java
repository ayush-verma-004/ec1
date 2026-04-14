package com.javnic.econe.service;

import com.javnic.econe.entity.OtpVerification;

public interface OtpService {
    OtpVerification generateAndSendOtp(String userId, String email);
    boolean verifyOtp(String email, String otp);
    void cleanExpiredOtps();
}