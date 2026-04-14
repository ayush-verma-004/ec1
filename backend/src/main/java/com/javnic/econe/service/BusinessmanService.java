package com.javnic.econe.service;

import com.javnic.econe.dto.profile.BusinessmanProfileDto;

public interface BusinessmanService {
    BusinessmanProfileDto getBusinessmanProfile(String userId);

    BusinessmanProfileDto createBusinessmanProfile(String userId, BusinessmanProfileDto profileDto);

    BusinessmanProfileDto updateBusinessmanProfile(String userId, BusinessmanProfileDto profileDto);
}
