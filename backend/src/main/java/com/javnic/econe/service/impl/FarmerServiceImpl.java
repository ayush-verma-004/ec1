package com.javnic.econe.service.impl;

import com.javnic.econe.dto.profile.FarmerProfileDto;
import com.javnic.econe.entity.FarmerProfile;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.exception.ResourceNotFoundException;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.mapper.ProfileMapper;
import com.javnic.econe.repository.FarmerProfileRepository;
import com.javnic.econe.repository.UserRepository;
import com.javnic.econe.service.FarmerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;

@Slf4j
@Service
@RequiredArgsConstructor
public class FarmerServiceImpl implements FarmerService {

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final ProfileMapper profileMapper;

    @Override
    @Cacheable(value = "farmers", key = "#userId")
    public FarmerProfileDto getFarmerProfile(String userId) {
        validateUserRole(userId, UserRole.FARMER);
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found"));
        return profileMapper.toFarmerProfileDto(profile);
    }

    @Override
    @Transactional
    @CachePut(value = "farmers", key = "#userId")
    public FarmerProfileDto createFarmerProfile(String userId, FarmerProfileDto profileDto) {
        User user = validateUserRole(userId, UserRole.FARMER);

        // Check if profile already exists
        if (farmerProfileRepository.findByUserId(userId).isPresent()) {
            throw new ValidationException("Profile already exists. Use update instead.");
        }

        // Check Aadhar uniqueness
        if (farmerProfileRepository.existsByAadharNumber(profileDto.getAadharNumber())) {
            throw new ValidationException("Aadhar number already registered");
        }

        FarmerProfile profile = profileMapper.toFarmerProfile(profileDto);
        profile.setUserId(userId);
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());

        profile = farmerProfileRepository.save(profile);

        // Update user with profile ID
        user.setProfileId(profile.getId());
        userRepository.save(user);

        log.info("Farmer profile created for user: {}", userId);
        return profileMapper.toFarmerProfileDto(profile);
    }

    @Override
    @Transactional
    @CachePut(value = "farmers", key = "#userId")
    public FarmerProfileDto updateFarmerProfile(String userId, FarmerProfileDto profileDto) {
        validateUserRole(userId, UserRole.FARMER);

        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        // Update fields
        profileMapper.updateFarmerProfile(profileDto, profile);
        profile.setUpdatedAt(LocalDateTime.now());

        profile = farmerProfileRepository.save(profile);

        log.info("Farmer profile updated for user: {}", userId);
        return profileMapper.toFarmerProfileDto(profile);
    }

    private User validateUserRole(String userId, UserRole expectedRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != expectedRole) {
            throw new UnauthorizedException("User role mismatch");
        }

        return user;
    }
}
