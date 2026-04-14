package com.javnic.econe.service;

import com.javnic.econe.dto.profile.GovernmentProfileDto;

public interface GovernmentService {
    GovernmentProfileDto getGovernmentProfile(String userId);

    GovernmentProfileDto updateGovernmentProfile(String userId, GovernmentProfileDto profileDto);
}
