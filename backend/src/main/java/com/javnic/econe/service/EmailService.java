package com.javnic.econe.service;

public interface EmailService {
    void sendOtpEmail(String to, String otp);
    void sendWelcomeEmail(String to, String name);
    void sendPasswordResetEmail(String to, String resetLink);
}