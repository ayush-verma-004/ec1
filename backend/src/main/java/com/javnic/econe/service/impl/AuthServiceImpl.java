package com.javnic.econe.service.impl;

import com.javnic.econe.dto.auth.request.LoginRequestDto;
import com.javnic.econe.dto.auth.request.RefreshTokenRequestDto;
import com.javnic.econe.dto.auth.request.RegisterRequestDto;
import com.javnic.econe.dto.auth.request.VerifyOtpRequestDto;
import com.javnic.econe.dto.auth.response.LoginResponseDto;
import com.javnic.econe.entity.RefreshToken;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.enums.UserStatus;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.repository.RefreshTokenRepository;
import com.javnic.econe.repository.UserRepository;
import com.javnic.econe.security.JwtTokenProvider;
import com.javnic.econe.service.AuthService;
import com.javnic.econe.service.EmailService;
import com.javnic.econe.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final EmailService emailService;

    @Override
    @Transactional
    public void register(RegisterRequestDto request) {
        // Only FARMER and BUSINESSMAN can self-register
        if (request.getRole() != UserRole.FARMER && request.getRole() != UserRole.BUSINESSMAN) {
            throw new ValidationException("Only Farmers and Businessmen can self-register");
        }

        Optional<User> existingOpt = userRepository.findByEmail(request.getEmail());

        if (existingOpt.isPresent()) {
            User existingUser = existingOpt.get();

            if (existingUser.getStatus() == UserStatus.ACTIVE) {
                // Fully verified user
                throw new ValidationException("Email already registered. Please login.");
            }

            if (existingUser.getStatus() == UserStatus.PENDING_VERIFICATION) {
                // Not verified yet → just resend OTP

                // (optional) update password/role
                existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                existingUser.setRole(request.getRole());
                existingUser.setUpdatedAt(LocalDateTime.now());
                userRepository.save(existingUser);

                otpService.generateAndSendOtp(existingUser.getId(), existingUser.getEmail());
                log.info("Resent OTP for pending user: {}", existingUser.getEmail());
                return;
            }
        }

        // New user case
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status(UserStatus.PENDING_VERIFICATION)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        otpService.generateAndSendOtp(user.getId(), user.getEmail());
        log.info("User registered successfully: {} with role: {}", user.getEmail(), user.getRole());
    }

    @Override
    @Transactional
    public void verifyOtp(VerifyOtpRequestDto request) {
        // Verify OTP
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            throw new ValidationException("Invalid OTP");
        }

        // Update user status
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ValidationException("User not found"));

        user.setStatus(UserStatus.ACTIVE);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getEmail());

        log.info("OTP verified and user activated: {}", user.getEmail());
    }

    @Override
    @Transactional
    public LoginResponseDto login(LoginRequestDto request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Get user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        // Check if user is active
        if (user.getStatus() == UserStatus.PENDING_VERIFICATION) {
            throw new UnauthorizedException("Please verify your email first");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("Account is " + user.getStatus().name().toLowerCase());
        }

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        // Save refresh token
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in successfully: {}", user.getEmail());

        return LoginResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getAccessTokenExpiration() / 1000)
                .role(user.getRole())
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }

    @Override
    @Transactional
    public LoginResponseDto refreshToken(RefreshTokenRequestDto request) {
        // Validate refresh token
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        // Find refresh token in database
        RefreshToken refreshTokenEntity = refreshTokenRepository
                .findByTokenAndRevokedFalse(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Refresh token not found or revoked"));

        // Check expiry
        if (LocalDateTime.now().isAfter(refreshTokenEntity.getExpiryDate())) {
            throw new UnauthorizedException("Refresh token has expired");
        }

        // Get user
        String email = tokenProvider.getEmailFromToken(request.getRefreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Generate new access token
        String newAccessToken = tokenProvider.generateAccessTokenFromEmail(user.getEmail());

        log.info("Access token refreshed for user: {}", user.getEmail());

        return LoginResponseDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getAccessTokenExpiration() / 1000)
                .role(user.getRole())
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ValidationException("Invalid refresh token"));

        token.setRevoked(true);
        refreshTokenRepository.save(token);

        log.info("User logged out successfully");
    }
}
