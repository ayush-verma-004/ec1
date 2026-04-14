package com.javnic.econe.service;

import com.javnic.econe.dto.profile.FarmerProfileDto;

public interface FarmerService {
    FarmerProfileDto getFarmerProfile(String userId);

    FarmerProfileDto createFarmerProfile(String userId, FarmerProfileDto profileDto);

    FarmerProfileDto updateFarmerProfile(String userId, FarmerProfileDto profileDto);
}
