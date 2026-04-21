
package com.javnic.econe.service.impl;

import com.javnic.econe.dto.carbon.request.*;
import com.javnic.econe.dto.carbon.response.CarbonCreditResponseDto;
import com.javnic.econe.entity.*;
import com.javnic.econe.enums.*;
import com.javnic.econe.exception.ResourceNotFoundException;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.repository.*;
import com.javnic.econe.service.CarbonCreditService;
import com.javnic.econe.util.GeoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarbonCreditServiceImpl implements CarbonCreditService {

        private final FarmerProfileRepository farmerProfileRepository;
        private final CarbonCreditRepository carbonCreditRepository;
        private final LandRepository landRepository;
        private final UserRepository userRepository;
        private final NGOProfileRepository ngoProfileRepository;
        private final com.javnic.econe.service.ProjectHashService projectHashService;

        @Override
        @Transactional
        @CachePut(value = "carbonCredits", key = "#result.id")
        public CarbonCreditResponseDto createCarbonCredit(String userId, CreateCarbonCreditRequestDto request) {
                // Validate land ownership
                Land land = landRepository.findById(request.getLandId())
                                .orElseThrow(() -> new ResourceNotFoundException("Land not found"));

                // Ownership check: land.farmerId stores the user's ID directly
                if (!land.getFarmerId().equals(userId)) {
                        throw new UnauthorizedException("You don't own this land");
                }

                // Land must be verified
                if (land.getStatus() != LandStatus.VERIFIED) {
                        throw new ValidationException("Land must be verified before creating carbon credits");
                }

                // Create carbon credit — use userId as farmerId (consistent with land ownership)
                String farmerId = userId;
                CarbonCredit credit = CarbonCredit.builder()
                                .farmerId(farmerId)
                                .landId(request.getLandId())
                                .carbonAmount(request.getCarbonAmount())
                                .carbonType(request.getCarbonType().name())
                                .methodology(request.getMethodology())
                                .projectName(request.getProjectName())
                                .projectDescription(request.getProjectDescription())
                                .validityYears(request.getValidityYears())
                                .assessmentDate(request.getAssessmentDate() != null
                                                ? request.getAssessmentDate().atStartOfDay()
                                                : LocalDateTime.now())
                                .assessmentReport(request.getAssessmentReport())
                                .status(CarbonCreditStatus.PENDING_NGO_VERIFICATION)
                                .verificationLevel(VerificationLevel.NONE)
                                .isListedForSale(false)
                                .isSold(false)
                                .currentOwnerId(farmerId)
                                .sellerId(farmerId)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .createdBy(farmerId)
                                .build();

                // Generate Public Hash Document
                String publicHash = projectHashService.createHashDocument(credit);
                credit.setPublicHash(publicHash);

                credit = carbonCreditRepository.save(credit);
                log.info("Carbon credit created: {} by farmer: {}", credit.getId(), farmerId);

                return mapToResponseDto(credit);
        }

        @Override
        @Cacheable(value = "carbonCredits", key = "#creditId")
        public CarbonCreditResponseDto getCarbonCredit(String creditId) {
                CarbonCredit credit = carbonCreditRepository.findById(creditId)
                                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));
                return mapToResponseDto(credit);
        }

        @Override
        public List<CarbonCreditResponseDto> getFarmerCarbonCredits(String farmerId) {
                return carbonCreditRepository.findByFarmerId(farmerId)
                                .stream()
                                .map(this::mapToResponseDto)
                                .collect(Collectors.toList());
        }

        @Override
        public List<CarbonCreditResponseDto> getLandCarbonCredits(String landId) {
                return carbonCreditRepository.findByLandId(landId)
                                .stream()
                                .map(this::mapToResponseDto)
                                .collect(Collectors.toList());
        }

        @Override
        public List<CarbonCreditResponseDto> getPendingNgoVerificationCredits(String ngoId) {
                NGOProfile ngoProfile = ngoProfileRepository.findByUserId(ngoId)
                                .orElseThrow(() -> new ResourceNotFoundException("NGO profile not found"));

                // Get all pending credits and filter by NGO's area
                List<CarbonCredit> pendingCredits = carbonCreditRepository
                                .findByStatus(CarbonCreditStatus.PENDING_NGO_VERIFICATION);

                return pendingCredits.stream()
                                .filter(credit -> isWithinNgoArea(credit, ngoProfile))
                                .map(this::mapToResponseDto)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        @CachePut(value = "carbonCredits", key = "#result.id")
        public CarbonCreditResponseDto verifyByNgo(String ngoId, VerifyCarbonCreditRequestDto request) {
                CarbonCredit credit = carbonCreditRepository.findById(request.getCarbonCreditId())
                                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

                if (credit.getStatus() != CarbonCreditStatus.PENDING_NGO_VERIFICATION) {
                        throw new ValidationException("Credit is not pending NGO verification");
                }

                NGOProfile ngoProfile = ngoProfileRepository.findByUserId(ngoId)
                                .orElseThrow(() -> new ResourceNotFoundException("NGO profile not found"));

                // Verify NGO jurisdiction
                if (!isWithinNgoArea(credit, ngoProfile)) {
                        throw new UnauthorizedException("This credit is outside your verification area");
                }

                // User ngoUser = userRepository.findById(ngoId)
                // .orElseThrow(() -> new ResourceNotFoundException("NGO user not found"));

                credit.setStatus(CarbonCreditStatus.PENDING_GOV_VERIFICATION);
                credit.setVerificationLevel(VerificationLevel.LEVEL_1_NGO);
                credit.setNgoId(ngoId);
                credit.setNgoVerifiedAt(LocalDateTime.now());
                credit.setNgoVerificationNotes(request.getVerificationNotes());
                credit.setNgoVerifierName(ngoProfile.getContactPersonName());
                credit.setUpdatedAt(LocalDateTime.now());
                credit.setLastModifiedBy(ngoId);

                credit = carbonCreditRepository.save(credit);

                // Add hash verification event
                projectHashService.addVerificationEvent(credit.getId(), ngoId, "VERIFIED_LEVEL_1",
                                request.getVerificationNotes());

                log.info("Carbon credit {} verified by NGO: {}", credit.getId(), ngoId);

                return mapToResponseDto(credit);
        }

        @Override
        @Transactional
        @CachePut(value = "carbonCredits", key = "#result.id")
        public CarbonCreditResponseDto rejectByNgo(String ngoId, VerifyCarbonCreditRequestDto request) {
                CarbonCredit credit = carbonCreditRepository.findById(request.getCarbonCreditId())
                                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

                if (credit.getStatus() != CarbonCreditStatus.PENDING_NGO_VERIFICATION) {
                        throw new ValidationException("Credit is not pending NGO verification");
                }

                NGOProfile ngoProfile = ngoProfileRepository.findByUserId(ngoId)
                                .orElseThrow(() -> new ResourceNotFoundException("NGO profile not found"));

                credit.setStatus(CarbonCreditStatus.NGO_REJECTED);
                credit.setNgoId(ngoId);
                credit.setNgoVerificationNotes(request.getRejectionReason());
                credit.setNgoVerifierName(ngoProfile.getContactPersonName());
                credit.setUpdatedAt(LocalDateTime.now());

                credit = carbonCreditRepository.save(credit);
                log.info("Carbon credit {} rejected by NGO: {}", credit.getId(), ngoId);

                return mapToResponseDto(credit);
        }

        @Override
        public List<CarbonCreditResponseDto> getPendingGovVerificationCredits() {
                return carbonCreditRepository.findByStatus(CarbonCreditStatus.PENDING_GOV_VERIFICATION)
                                .stream()
                                .map(this::mapToResponseDto)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        @CachePut(value = "carbonCredits", key = "#result.id")
        public CarbonCreditResponseDto verifyByGovernment(String govId, VerifyCarbonCreditRequestDto request) {
                CarbonCredit credit = carbonCreditRepository.findById(request.getCarbonCreditId())
                                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

                if (credit.getStatus() != CarbonCreditStatus.PENDING_GOV_VERIFICATION) {
                        throw new ValidationException("Credit is not pending government verification");
                }

                User govUser = userRepository.findById(govId)
                                .orElseThrow(() -> new ResourceNotFoundException("Government user not found"));

                // Set validity period
                LocalDateTime validFrom = LocalDateTime.now();
                LocalDateTime validUntil = validFrom.plusYears(credit.getValidityYears());

                credit.setStatus(CarbonCreditStatus.ACTIVE);
                credit.setVerificationLevel(VerificationLevel.LEVEL_2_GOV);
                credit.setGovernmentId(govId);
                credit.setGovVerifiedAt(LocalDateTime.now());
                credit.setGovVerificationNotes(request.getVerificationNotes());
                credit.setGovVerifierName(govUser.getEmail());
                credit.setValidFrom(validFrom);
                credit.setValidUntil(validUntil);
                credit.setUpdatedAt(LocalDateTime.now());
                credit.setLastModifiedBy(govId);

                credit = carbonCreditRepository.save(credit);

                // Add hash verification event
                projectHashService.addVerificationEvent(credit.getId(), govId, "VERIFIED_LEVEL_2",
                                request.getVerificationNotes());

                log.info("Carbon credit {} verified by Government: {}", credit.getId(), govId);

                return mapToResponseDto(credit);
        }

        @Override
        @Transactional
        @CachePut(value = "carbonCredits", key = "#result.id")
        public CarbonCreditResponseDto rejectByGovernment(String govId, VerifyCarbonCreditRequestDto request) {
                CarbonCredit credit = carbonCreditRepository.findById(request.getCarbonCreditId())
                                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

                credit.setStatus(CarbonCreditStatus.GOV_REJECTED);
                credit.setGovernmentId(govId);
                credit.setGovVerificationNotes(request.getRejectionReason());
                credit.setUpdatedAt(LocalDateTime.now());

                credit = carbonCreditRepository.save(credit);
                log.info("Carbon credit {} rejected by Government: {}", credit.getId(), govId);

                return mapToResponseDto(credit);
        }

        @Override
        @Transactional
        @Caching(put = { @CachePut(value = "carbonCredits", key = "#result.id") }, evict = {
                        @CacheEvict(value = "marketplaceListings", allEntries = true) })
        public CarbonCreditResponseDto listForSale(String userId, ListForSaleRequestDto request) {
                CarbonCredit credit = carbonCreditRepository.findById(request.getCarbonCreditId())
                                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

                // Ownership check: currentOwnerId was stored as userId
                if (!credit.getCurrentOwnerId().equals(userId)) {
                        throw new UnauthorizedException("You don't own this credit");
                }

                String sellerId = userId;

                // Must be active and verified
                if (credit.getStatus() != CarbonCreditStatus.ACTIVE) {
                        throw new ValidationException("Only active credits can be listed for sale");
                }

                if (credit.getIsSold()) {
                        throw new ValidationException("This credit has already been sold");
                }

                credit.setIsListedForSale(true);
                credit.setPricePerTonne(request.getPricePerTonne());
                credit.setTotalValue(credit.getCarbonAmount() * request.getPricePerTonne());
                credit.setSellerId(sellerId);
                credit.setStatus(CarbonCreditStatus.LISTED_FOR_SALE);
                credit.setUpdatedAt(LocalDateTime.now());

                credit = carbonCreditRepository.save(credit);
                log.info("Carbon credit {} listed for sale by: {}", credit.getId(), sellerId);

                return mapToResponseDto(credit);
        }

        @Override
        @Transactional
        @Caching(put = { @CachePut(value = "carbonCredits", key = "#result.id") }, evict = {
                        @CacheEvict(value = "marketplaceListings", allEntries = true) })
        public CarbonCreditResponseDto removeFromSale(String sellerId, String creditId) {
                CarbonCredit credit = carbonCreditRepository.findById(creditId)
                                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

                if (!credit.getCurrentOwnerId().equals(sellerId)) {
                        throw new UnauthorizedException("You don't own this credit");
                }

                credit.setIsListedForSale(false);
                credit.setPricePerTonne(null);
                credit.setTotalValue(null);
                credit.setStatus(CarbonCreditStatus.ACTIVE);
                credit.setUpdatedAt(LocalDateTime.now());

                credit = carbonCreditRepository.save(credit);
                log.info("Carbon credit {} removed from sale", credit.getId());

                return mapToResponseDto(credit);
        }

        @Override
        @Cacheable(value = "marketplaceListings")
        public List<MarketplaceListingDto> getMarketplaceListings() {
                return carbonCreditRepository.findActiveListedCredits()
                                .stream()
                                .map(this::mapToMarketplaceDto)
                                .collect(Collectors.toList());
        }

        @Override
        public List<CarbonCreditResponseDto> getSellerListedCredits(String sellerId) {
                // sellerId here is the userId passed from the controller
                return carbonCreditRepository.findByCurrentOwnerId(sellerId)
                                .stream()
                                .filter(CarbonCredit::getIsListedForSale)
                                .map(this::mapToResponseDto)
                                .collect(Collectors.toList());
        }

        @Override
        public AvailableCreditsDto getAvailableCreditsStats() {
                List<CarbonCredit> availableCredits = carbonCreditRepository.findActiveListedCredits();

                return AvailableCreditsDto.builder()
                                .totalCredits((long) availableCredits.size())
                                .totalCarbonAmount(availableCredits.stream()
                                                .mapToDouble(CarbonCredit::getCarbonAmount)
                                                .sum())
                                .averagePrice(availableCredits.stream()
                                                .mapToDouble(CarbonCredit::getPricePerTonne)
                                                .average()
                                                .orElse(0.0))
                                .minPrice(availableCredits.stream()
                                                .mapToDouble(CarbonCredit::getPricePerTonne)
                                                .min()
                                                .orElse(0.0))
                                .maxPrice(availableCredits.stream()
                                                .mapToDouble(CarbonCredit::getPricePerTonne)
                                                .max()
                                                .orElse(0.0))
                                .build();
        }

        @Override
        public List<CarbonCreditResponseDto> getOwnedCredits(String ownerId) {
                return carbonCreditRepository.findByCurrentOwnerId(ownerId)
                                .stream()
                                .map(this::mapToResponseDto)
                                .collect(Collectors.toList());
        }

        // Helper methods
        private boolean isWithinNgoArea(CarbonCredit credit, NGOProfile ngoProfile) {
                Land land = landRepository.findById(credit.getLandId()).orElse(null);
                if (land == null)
                        return false;

                double distance = GeoUtil.distanceInKm(
                                ngoProfile.getLatitude(), ngoProfile.getLongitude(),
                                land.getLatitude(), land.getLongitude());

                return distance <= ngoProfile.getAllowedRadiusKm();
        }

        private CarbonCreditResponseDto mapToResponseDto(CarbonCredit credit) {
                Land land = landRepository.findById(credit.getLandId()).orElse(null);
                User farmer = userRepository.findById(credit.getFarmerId()).orElse(null);

                return CarbonCreditResponseDto.builder()
                                .id(credit.getId())
                                .farmerId(credit.getFarmerId())
                                .farmerName(farmer != null ? farmer.getEmail() : "Unknown")
                                .landId(credit.getLandId())
                                .landAddress(land != null ? land.getLandAddress() : "Unknown")
                                .carbonAmount(credit.getCarbonAmount())
                                .carbonType(credit.getCarbonType())
                                .status(credit.getStatus())
                                .verificationLevel(credit.getVerificationLevel().name())
                                .validFrom(credit.getValidFrom())
                                .validUntil(credit.getValidUntil())
                                .isListedForSale(credit.getIsListedForSale())
                                .pricePerTonne(credit.getPricePerTonne())
                                .totalValue(credit.getTotalValue())
                                .certificateUrl(credit.getCertificateUrl())
                                .createdAt(credit.getCreatedAt())
                                .publicHash(credit.getPublicHash())
                                .build();
        }

        private MarketplaceListingDto mapToMarketplaceDto(CarbonCredit credit) {
                Land land = landRepository.findById(credit.getLandId()).orElse(null);
                User seller = userRepository.findById(credit.getSellerId()).orElse(null);

                return MarketplaceListingDto.builder()
                                .id(credit.getId())
                                .sellerId(credit.getSellerId())
                                .sellerName(seller != null ? seller.getEmail() : "Unknown")
                                .carbonAmount(credit.getCarbonAmount())
                                .carbonType(credit.getCarbonType())
                                .pricePerTonne(credit.getPricePerTonne())
                                .totalValue(credit.getTotalValue())
                                .landAddress(land != null ? land.getLandAddress() : "Unknown")
                                .verificationLevel(credit.getVerificationLevel().name())
                                .validUntil(credit.getValidUntil())
                                .listedAt(credit.getUpdatedAt())
                                .build();
        }
}