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
import com.javnic.econe.service.EmailService;
import com.javnic.econe.service.OtpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private OtpService otpService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;
    private RegisterRequestDto registerRequest;
    private LoginRequestDto loginRequest;
    private RefreshToken refreshToken;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id("1")
                .email("test@example.com")
                .password("encodedPassword")
                .role(UserRole.FARMER)
                .status(UserStatus.ACTIVE)
                .build();

        registerRequest = new RegisterRequestDto();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password");
        registerRequest.setRole(UserRole.FARMER);

        loginRequest = new LoginRequestDto();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        refreshToken = RefreshToken.builder()
                .id("1")
                .token("refreshToken")
                .userId("1")
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        authService.register(registerRequest);

        verify(userRepository).save(any(User.class));
        verify(otpService).generateAndSendOtp(anyString(), anyString());
    }

    @Test
    void register_InvalidRole_ThrowsException() {
        registerRequest.setRole(UserRole.GOVERNMENT); // Assuming GOVERNMENT cannot self-register

        assertThrows(ValidationException.class, () -> authService.register(registerRequest));
    }

    @Test
    void register_EmailExists_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(ValidationException.class, () -> authService.register(registerRequest));
    }

    @Test
    void verifyOtp_Success() {
        VerifyOtpRequestDto request = new VerifyOtpRequestDto();
        request.setEmail("test@example.com");
        request.setOtp("123456");

        when(otpService.verifyOtp(anyString(), anyString())).thenReturn(true);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        authService.verifyOtp(request);

        verify(userRepository).save(any(User.class));
        verify(emailService).sendWelcomeEmail(anyString(), anyString());
    }

    @Test
    void verifyOtp_InvalidOtp_ThrowsException() {
        VerifyOtpRequestDto request = new VerifyOtpRequestDto();
        request.setEmail("test@example.com");
        request.setOtp("123456");

        when(otpService.verifyOtp(anyString(), anyString())).thenReturn(false);

        assertThrows(ValidationException.class, () -> authService.verifyOtp(request));
    }

    @Test
    void login_Success() {
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(tokenProvider.generateAccessToken(any(Authentication.class))).thenReturn("accessToken");
        when(tokenProvider.generateRefreshToken(anyString())).thenReturn("refreshToken");
        when(tokenProvider.getAccessTokenExpiration()).thenReturn(3600000L);

        LoginResponseDto response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void login_PendingVerification_ThrowsException() {
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }

    @Test
    void refreshToken_Success() {
        RefreshTokenRequestDto request = new RefreshTokenRequestDto();
        request.setRefreshToken("refreshToken");

        when(tokenProvider.validateToken(anyString())).thenReturn(true);
        when(refreshTokenRepository.findByTokenAndRevokedFalse(anyString())).thenReturn(Optional.of(refreshToken));
        when(tokenProvider.getEmailFromToken(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(tokenProvider.generateAccessTokenFromEmail(anyString())).thenReturn("newAccessToken");
        when(tokenProvider.getAccessTokenExpiration()).thenReturn(3600000L);

        LoginResponseDto response = authService.refreshToken(request);

        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
    }

    @Test
    void logout_Success() {
        when(refreshTokenRepository.findByToken(anyString())).thenReturn(Optional.of(refreshToken));

        authService.logout("refreshToken");

        assertTrue(refreshToken.isRevoked());
        verify(refreshTokenRepository).save(refreshToken);
    }
}
