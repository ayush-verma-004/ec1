package com.javnic.econe.service;

import com.javnic.econe.dto.land.request.CreateLandRequestDto;
import com.javnic.econe.dto.land.response.CreateLandResponseDto;
import com.javnic.econe.entity.Land;

import java.util.List;

public interface LandService {
    CreateLandResponseDto createLand(CreateLandRequestDto createLandRequestDto);
    List<Land> getLandsByFarmer(String farmerId);
    List<Land> getLandsInsideNgoArea();
    List<Land> getAllUnverifyLandsInsideNgoArea();
    List<Land> getAllVerifyLandsInsideNgoArea();
    Land getLand(String landId);
    Land verifyLand(String landId);
    Land rejectLand(String landId);
}
