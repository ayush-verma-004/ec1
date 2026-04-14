package com.javnic.econe.service.impl;

import com.javnic.econe.dto.profile.BusinessmanProfileDto;
import com.javnic.econe.entity.BusinessmanProfile;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.exception.ResourceNotFoundException;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.mapper.ProfileMapper;
import com.javnic.econe.repository.BusinessmanProfileRepository;
import com.javnic.econe.repository.UserRepository;
import com.javnic.econe.service.BusinessmanService;
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
public class BusinessmanServiceImpl implements BusinessmanService {

    private final UserRepository userRepository;
    private final BusinessmanProfileRepository businessmanProfileRepository;
    private final ProfileMapper profileMapper;

    @Override
    @Cacheable(value = "businessmen", key = "#userId")
    public BusinessmanProfileDto getBusinessmanProfile(String userId) {
        validateUserRole(userId, UserRole.BUSINESSMAN);
        BusinessmanProfile profile = businessmanProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Businessman profile not found"));
        return profileMapper.toBusinessmanProfileDto(profile);
    }

    @Override
    @Transactional
    @CachePut(value = "businessmen", key = "#userId")
    public BusinessmanProfileDto createBusinessmanProfile(String userId, BusinessmanProfileDto profileDto) {
        User user = validateUserRole(userId, UserRole.BUSINESSMAN);

        if (businessmanProfileRepository.findByUserId(userId).isPresent()) {
            throw new ValidationException("Profile already exists. Use update instead.");
        }

        // Validate GST and PAN uniqueness
        if (profileDto.getGstNumber() != null &&
                businessmanProfileRepository.existsByGstNumber(profileDto.getGstNumber())) {
            throw new ValidationException("GST number already registered");
        }

        if (profileDto.getPanNumber() != null &&
                businessmanProfileRepository.existsByPanNumber(profileDto.getPanNumber())) {
            throw new ValidationException("PAN number already registered");
        }

        BusinessmanProfile profile = profileMapper.toBusinessmanProfile(profileDto);
        profile.setUserId(userId);
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());

        profile = businessmanProfileRepository.save(profile);

        user.setProfileId(profile.getId());
        userRepository.save(user);

        log.info("Businessman profile created for user: {}", userId);
        return profileMapper.toBusinessmanProfileDto(profile);
    }

    @Override
    @Transactional
    @CachePut(value = "businessmen", key = "#userId")
    public BusinessmanProfileDto updateBusinessmanProfile(String userId, BusinessmanProfileDto profileDto) {
        validateUserRole(userId, UserRole.BUSINESSMAN);

        BusinessmanProfile profile = businessmanProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        profileMapper.updateBusinessmanProfile(profileDto, profile);
        profile.setUpdatedAt(LocalDateTime.now());

        profile = businessmanProfileRepository.save(profile);

        log.info("Businessman profile updated for user: {}", userId);
        return profileMapper.toBusinessmanProfileDto(profile);
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
