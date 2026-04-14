package com.javnic.econe.service.impl;

import com.javnic.econe.dto.land.request.CreateLandRequestDto;
import com.javnic.econe.dto.land.response.CreateLandResponseDto;
import com.javnic.econe.entity.Land;
import com.javnic.econe.entity.NGOProfile;
import com.javnic.econe.enums.LandStatus;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.mapper.LandMapper;
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
    private final LandMapper landMapper;
    private final SecurityUtils securityUtils;

    @Override
    // @CachePut removed: Return type is DTO but cache expects Entity
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
        landRepository.save(land);
        return landMapper.toCreateLandResponseDto(createLandRequestDto, LandStatus.PENDING_VERIFICATION);
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
    public List<Land> getAllUnverifyLandsInsideNgoArea() {
        String ngoId = " ";

        // String nId = securityUtils.getCurrentUserId();

        NGOProfile ngoProfile = ngoProfileRepository.findById(ngoId)
                .orElseThrow();

        double ngoLat = ngoProfile.getLatitude();
        double nogLon = ngoProfile.getLongitude();

        double allowedRadius = ngoProfile.getAllowedRadiusKm();

        List<Land> allLands = landRepository.findAll();
        List<Land> insideArea = new ArrayList<>();

        for (Land land : allLands) {

            LandStatus landStatus = land.getStatus();

            double distance = GeoUtil.distanceInKm(
                    ngoLat, nogLon, land.getLatitude(), land.getLongitude());

            if (distance <= allowedRadius && landStatus == LandStatus.PENDING_VERIFICATION) {
                insideArea.add(land);
            }
        }

        return insideArea;
    }

    @Override
    public List<Land> getAllVerifyLandsInsideNgoArea() {
        String ngoId = " ";

        // String nId = securityUtils.getCurrentUserId();

        // String currentUserId = securityUtils.getCurrentUser().getId();

        NGOProfile ngoProfile = ngoProfileRepository.findById(ngoId)
                .orElseThrow();

        double ngoLat = ngoProfile.getLatitude();
        double nogLon = ngoProfile.getLongitude();

        double allowedRadius = ngoProfile.getAllowedRadiusKm();

        List<Land> allLands = landRepository.findAll();
        List<Land> insideArea = new ArrayList<>();

        for (Land land : allLands) {

            LandStatus landStatus = land.getStatus();

            double distance = GeoUtil.distanceInKm(
                    ngoLat, nogLon, land.getLatitude(), land.getLongitude());

            if (distance <= allowedRadius && landStatus == LandStatus.PENDING_VERIFICATION) {
                insideArea.add(land);
            }
        }

        return insideArea;
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
        Land land = getLand(landId);
        land.setStatus(LandStatus.REJECTED);

        String ngoId = securityUtils.getCurrentUser().getId();

        NGOProfile ngoProfile = ngoProfileRepository.findByUserId(ngoId)
                .orElseThrow();

        // Land lan = getLand(landId); // Removed redundant call

        double distance = GeoUtil.distanceInKm(ngoProfile.getLatitude(), ngoProfile.getLongitude(),
                land.getLatitude(), land.getLongitude());

        if (distance > ngoProfile.getAllowedRadiusKm()) {
            throw new UnauthorizedException("This land is outside your verification area!");
        }

        land.setStatus(LandStatus.REJECTED);

        return landRepository.save(land);
    }
}
