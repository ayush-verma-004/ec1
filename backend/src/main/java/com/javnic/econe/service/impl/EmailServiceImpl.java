package com.javnic.econe.service.impl;

import com.javnic.econe.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Async
    @Override
    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Verify Your Email - Agriculture Platform");
            message.setText(buildOtpEmailBody(otp));

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", to, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    @Async
    @Override
    public void sendWelcomeEmail(String to, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Welcome to Agriculture Platform");
            message.setText(buildWelcomeEmailBody(name));

            mailSender.send(message);
            log.info("Welcome email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", to, e);
        }
    }

    @Async
    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Reset Your Password - Agriculture Platform");
            message.setText(buildPasswordResetEmailBody(resetLink));

            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", to, e);
        }
    }

    private String buildOtpEmailBody(String otp) {
        return String.format("""
                Dear User,
                
                Your OTP for email verification is: %s
                
                This OTP is valid for 10 minutes.
                
                If you did not request this OTP, please ignore this email.
                
                Best regards,
                Agriculture Platform Team
                """, otp);
    }

    private String buildWelcomeEmailBody(String name) {
        return String.format("""
                Dear %s,
                
                Welcome to Agriculture Platform!
                
                Your account has been successfully verified. You can now access all features of the platform.
                
                Thank you for joining us.
                
                Best regards,
                Agriculture Platform Team
                """, name);
    }

    private String buildPasswordResetEmailBody(String resetLink) {
        return String.format("""
                Dear User,
                
                You have requested to reset your password.
                
                Click the link below to reset your password:
                %s
                
                This link is valid for 1 hour.
                
                If you did not request this, please ignore this email.
                
                Best regards,
                Agriculture Platform Team
                """, resetLink);
    }
}
