package com.javnic.econe.service.impl;

import com.javnic.econe.dto.profile.NGOProfileDto;
import com.javnic.econe.entity.NGOProfile;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.exception.ResourceNotFoundException;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.mapper.ProfileMapper;
import com.javnic.econe.repository.NGOProfileRepository;
import com.javnic.econe.repository.UserRepository;
import com.javnic.econe.service.NGOService;
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
public class NGOServiceImpl implements NGOService {

    private final UserRepository userRepository;
    private final NGOProfileRepository ngoProfileRepository;
    private final ProfileMapper profileMapper;

    @Override
    @Cacheable(value = "ngos", key = "#userId")
    public NGOProfileDto getNGOProfile(String userId) {
        validateUserRole(userId, UserRole.NGO);
        NGOProfile profile = ngoProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("NGO profile not found"));
        return profileMapper.toNGOProfileDto(profile);
    }

    @Override
    @Transactional
    @CachePut(value = "ngos", key = "#userId")
    public NGOProfileDto updateNGOProfile(String userId, NGOProfileDto profileDto) {
        validateUserRole(userId, UserRole.NGO);

        NGOProfile profile = ngoProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        profileMapper.updateNGOProfile(profileDto, profile);
        profile.setUpdatedAt(LocalDateTime.now());

        profile = ngoProfileRepository.save(profile);

        log.info("NGO profile updated for user: {}", userId);
        return profileMapper.toNGOProfileDto(profile);
    }

    private void validateUserRole(String userId, UserRole expectedRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != expectedRole) {
            throw new UnauthorizedException("User role mismatch");
        }
    }
}
