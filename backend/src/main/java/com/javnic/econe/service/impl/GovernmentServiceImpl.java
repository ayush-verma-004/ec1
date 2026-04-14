package com.javnic.econe.service.impl;

import com.javnic.econe.dto.profile.GovernmentProfileDto;
import com.javnic.econe.entity.GovernmentProfile;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.exception.ResourceNotFoundException;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.mapper.ProfileMapper;
import com.javnic.econe.repository.GovernmentProfileRepository;
import com.javnic.econe.repository.UserRepository;
import com.javnic.econe.service.GovernmentService;
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
public class GovernmentServiceImpl implements GovernmentService {

    private final UserRepository userRepository;
    private final GovernmentProfileRepository governmentProfileRepository;
    private final ProfileMapper profileMapper;

    @Override
    @Cacheable(value = "government", key = "#userId")
    public GovernmentProfileDto getGovernmentProfile(String userId) {
        validateUserRole(userId, UserRole.GOVERNMENT);
        GovernmentProfile profile = governmentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Government profile not found"));
        return profileMapper.toGovernmentProfileDto(profile);
    }

    @Override
    @Transactional
    @CachePut(value = "government", key = "#userId")
    public GovernmentProfileDto updateGovernmentProfile(String userId, GovernmentProfileDto profileDto) {
        validateUserRole(userId, UserRole.GOVERNMENT);

        GovernmentProfile profile = governmentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        profileMapper.updateGovernmentProfile(profileDto, profile);
        profile.setUpdatedAt(LocalDateTime.now());

        profile = governmentProfileRepository.save(profile);

        log.info("Government profile updated for user: {}", userId);
        return profileMapper.toGovernmentProfileDto(profile);
    }

    private void validateUserRole(String userId, UserRole expectedRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != expectedRole) {
            throw new UnauthorizedException("User role mismatch");
        }
    }
}
