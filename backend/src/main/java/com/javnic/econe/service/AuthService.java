package com.javnic.econe.service;

import com.javnic.econe.dto.auth.request.LoginRequestDto;
import com.javnic.econe.dto.auth.request.RefreshTokenRequestDto;
import com.javnic.econe.dto.auth.request.RegisterRequestDto;
import com.javnic.econe.dto.auth.request.VerifyOtpRequestDto;
import com.javnic.econe.dto.auth.response.LoginResponseDto;

public interface AuthService {
    void register(RegisterRequestDto request);
    void verifyOtp(VerifyOtpRequestDto request);
    LoginResponseDto login(LoginRequestDto request);
    LoginResponseDto refreshToken(RefreshTokenRequestDto request);
    void logout(String refreshToken);
}
