package com.javnic.econe.service.impl;

import com.javnic.econe.dto.user.request.CreateNGORequestDto;
import com.javnic.econe.dto.user.response.UserResponseDto;
import com.javnic.econe.entity.NGOProfile;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.enums.UserStatus;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.mapper.ProfileMapper;
import com.javnic.econe.repository.NGOProfileRepository;
import com.javnic.econe.repository.UserRepository;
import com.javnic.econe.service.OtpService;
import com.javnic.econe.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final NGOProfileRepository ngoProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    // private final EmailService emailService;
    private final ProfileMapper profileMapper;

    @Override
    @Transactional
    public UserResponseDto createNGO(CreateNGORequestDto request, String createdByUserId) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        // Check if registration number already exists
        if (ngoProfileRepository.existsByRegistrationNumber(
                request.getProfile().getRegistrationNumber())) {
            throw new ValidationException("NGO registration number already exists");
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.NGO)
                .status(UserStatus.PENDING_VERIFICATION)
                .createdBy(createdByUserId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        // Create NGO profile
        NGOProfile profile = profileMapper.toNGOProfile(request.getProfile());
        profile.setUserId(user.getId());
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setLatitude(50);
        profile.setLongitude(40);
        profile.setAllowedRadiusKm(100);
        profile = ngoProfileRepository.save(profile);

        // Update user with profile ID
        user.setProfileId(profile.getId());
        user = userRepository.save(user);

        // Generate and send OTP
        otpService.generateAndSendOtp(user.getId(), user.getEmail());

        log.info("NGO user created successfully by government user: {}", createdByUserId);

        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .profileId(user.getProfileId())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
