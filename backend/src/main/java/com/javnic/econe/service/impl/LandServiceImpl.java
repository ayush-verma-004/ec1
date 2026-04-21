package com.javnic.econe.service.impl;

import com.javnic.econe.dto.land.request.CreateLandRequestDto;
import com.javnic.econe.dto.land.response.CreateLandResponseDto;
import com.javnic.econe.dto.land.response.LandVerificationResponseDto;
import com.javnic.econe.entity.FarmerProfile;
import com.javnic.econe.entity.Land;
import com.javnic.econe.entity.NGOProfile;
import com.javnic.econe.enums.LandStatus;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.mapper.LandMapper;
import com.javnic.econe.repository.FarmerProfileRepository;
import com.javnic.econe.repository.LandRepository;
import com.javnic.econe.repository.NGOProfileRepository;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.LandService;
import com.javnic.econe.util.GeoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;

@Slf4j
@Service
@RequiredArgsConstructor
public class LandServiceImpl implements LandService {

    private final LandRepository landRepository;
    private final NGOProfileRepository ngoProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final LandMapper landMapper;
    private final SecurityUtils securityUtils;

    @Override
    public CreateLandResponseDto createLand(CreateLandRequestDto createLandRequestDto) {

        Land land = new Land();
        land.setFarmerId(createLandRequestDto.getFarmerId());
        land.setLandArea(createLandRequestDto.getLandArea());
        land.setLandAddress(createLandRequestDto.getLandAddress());
        land.setSoilType(createLandRequestDto.getSoilType());
        land.setGeoCoordinates(createLandRequestDto.getGeoCoordinates());
        land.setStatus(LandStatus.PENDING_VERIFICATION);
        land.setLatitude(createLandRequestDto.getLatitude());
        land.setLongitude(createLandRequestDto.getLongitude());
        Land savedLand = landRepository.save(land);
        CreateLandResponseDto response = landMapper.toCreateLandResponseDto(createLandRequestDto, LandStatus.PENDING_VERIFICATION);
        response.setId(savedLand.getId());
        return response;
    }

    @Override
    public List<Land> getLandsByFarmer(String farmerId) {
        return landRepository.findByFarmerId(farmerId);
    }

    @Override
    public List<Land> getLandsInsideNgoArea() {

        String ngoId = securityUtils.getCurrentUserId();

        NGOProfile ngoProfile = ngoProfileRepository.findById(ngoId)
                .orElseThrow();

        double ngoLat = ngoProfile.getLatitude();
        double nogLon = ngoProfile.getLongitude();

        double allowedRadius = ngoProfile.getAllowedRadiusKm();

        List<Land> allLands = landRepository.findAll();
        List<Land> insideArea = new ArrayList<>();

        for (Land land : allLands) {
            double distance = GeoUtil.distanceInKm(
                    ngoLat, nogLon, land.getLatitude(), land.getLongitude());

            if (distance <= allowedRadius) {
                insideArea.add(land);
            }
        }

        return insideArea;
    }

    @Override
    public List<LandVerificationResponseDto> getAllUnverifyLandsInsideNgoArea() {
        String ngoUserId = securityUtils.getCurrentUser().getId();

        NGOProfile ngoProfile = ngoProfileRepository.findByUserId(ngoUserId)
                .orElseThrow(() -> new RuntimeException("NGO Profile not found"));

        double ngoLat = ngoProfile.getLatitude();
        double nogLon = ngoProfile.getLongitude();
        double allowedRadius = ngoProfile.getAllowedRadiusKm();

        List<Land> allLands = landRepository.findAll();
        List<LandVerificationResponseDto> result = new ArrayList<>();

        for (Land land : allLands) {
            if (land.getStatus() == LandStatus.PENDING_VERIFICATION) {
                double distance = GeoUtil.distanceInKm(ngoLat, nogLon, land.getLatitude(), land.getLongitude());
                if (distance <= allowedRadius) {
                    result.add(mapToVerificationDto(land, distance));
                }
            }
        }
        return result;
    }

    @Override
    public List<LandVerificationResponseDto> getAllVerifyLandsInsideNgoArea() {
        String ngoUserId = securityUtils.getCurrentUser().getId();

        NGOProfile ngoProfile = ngoProfileRepository.findByUserId(ngoUserId)
                .orElseThrow(() -> new RuntimeException("NGO Profile not found"));

        double ngoLat = ngoProfile.getLatitude();
        double nogLon = ngoProfile.getLongitude();
        double allowedRadius = ngoProfile.getAllowedRadiusKm();

        List<Land> allLands = landRepository.findAll();
        List<LandVerificationResponseDto> result = new ArrayList<>();

        for (Land land : allLands) {
            if (land.getStatus() == LandStatus.VERIFIED) {
                double distance = GeoUtil.distanceInKm(ngoLat, nogLon, land.getLatitude(), land.getLongitude());
                if (distance <= allowedRadius) {
                    result.add(mapToVerificationDto(land, distance));
                }
            }
        }
        return result;
    }

    private LandVerificationResponseDto mapToVerificationDto(Land land, double distance) {
        FarmerProfile farmerProfile = farmerProfileRepository.findByUserId(land.getFarmerId())
                .orElse(null);

        return LandVerificationResponseDto.builder()
                .id(land.getId())
                .farmerId(land.getFarmerId())
                .farmerName(farmerProfile != null ? farmerProfile.getFullName() : "Unknown Farmer")
                .farmerPhone(farmerProfile != null ? farmerProfile.getPhoneNumber() : "N/A")
                .landArea(land.getLandArea())
                .landAddress(land.getLandAddress())
                .soilType(land.getSoilType())
                .geoCoordinates(land.getGeoCoordinates())
                .latitude(land.getLatitude())
                .longitude(land.getLongitude())
                .status(land.getStatus())
                .distanceFromNgoKm(distance)
                .build();
    }

    @Override
    @Cacheable(value = "lands", key = "#landId")
    public Land getLand(String landId) {
        return landRepository.findById(landId)
                .orElseThrow(() -> new RuntimeException("Land not found with id: " + landId));
    }

    @Override
    @CachePut(value = "lands", key = "#landId")
    public Land verifyLand(String landId) {

        String ngoId = securityUtils.getCurrentUser().getId();

        NGOProfile ngoProfile = ngoProfileRepository.findByUserId(ngoId)
                .orElseThrow();

        Land land = landRepository.findById(landId)
                .orElseThrow();

        double distance = GeoUtil.distanceInKm(ngoProfile.getLatitude(), ngoProfile.getLongitude(),
                land.getLatitude(), land.getLongitude());

        if (distance > ngoProfile.getAllowedRadiusKm()) {
            throw new UnauthorizedException("This land is outside your verification area!");
        }

        land.setStatus(LandStatus.VERIFIED);

        return landRepository.save(land);
    }

    @Override
    @CachePut(value = "lands", key = "#landId")
    public Land rejectLand(String landId) {
        String ngoId = securityUtils.getCurrentUser().getId();

        NGOProfile ngoProfile = ngoProfileRepository.findByUserId(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO Profile not found"));

        Land land = landRepository.findById(landId)
                .orElseThrow(() -> new RuntimeException("Land not found with id: " + landId));

        double distance = GeoUtil.distanceInKm(ngoProfile.getLatitude(), ngoProfile.getLongitude(),
                land.getLatitude(), land.getLongitude());

        if (distance > ngoProfile.getAllowedRadiusKm()) {
            throw new UnauthorizedException("This land is outside your verification area!");
        }

        land.setStatus(LandStatus.REJECTED);

        return landRepository.save(land);
    }
}
