package com.javnic.econe.service;

import com.javnic.econe.dto.carbon.request.*;
import com.javnic.econe.dto.carbon.response.CarbonCreditResponseDto;

import java.util.List;

public interface CarbonCreditService {

    // Farmer Operations (Task 3.2)
    CarbonCreditResponseDto createCarbonCredit(String farmerId, CreateCarbonCreditRequestDto request);

    CarbonCreditResponseDto getCarbonCredit(String creditId);

    List<CarbonCreditResponseDto> getFarmerCarbonCredits(String farmerId);

    List<CarbonCreditResponseDto> getLandCarbonCredits(String landId);

    // NGO Operations (Task 3.2.2 - Level 1 Verification)
    List<CarbonCreditResponseDto> getPendingNgoVerificationCredits(String ngoId);

    CarbonCreditResponseDto verifyByNgo(String ngoId, VerifyCarbonCreditRequestDto request);

    CarbonCreditResponseDto rejectByNgo(String ngoId, VerifyCarbonCreditRequestDto request);

    // Government Operations (Task 4 - Level 2 Verification)
    List<CarbonCreditResponseDto> getPendingGovVerificationCredits();

    CarbonCreditResponseDto verifyByGovernment(String govId, VerifyCarbonCreditRequestDto request);

    CarbonCreditResponseDto rejectByGovernment(String govId, VerifyCarbonCreditRequestDto request);

    // Marketplace Operations (Task 5)
    CarbonCreditResponseDto listForSale(String sellerId, ListForSaleRequestDto request);

    CarbonCreditResponseDto removeFromSale(String sellerId, String creditId);

    List<MarketplaceListingDto> getMarketplaceListings();

    List<CarbonCreditResponseDto> getSellerListedCredits(String sellerId);

    AvailableCreditsDto getAvailableCreditsStats();

    // Owner's credits
    List<CarbonCreditResponseDto> getOwnedCredits(String ownerId);
}