package com.javnic.econe.controller;

import com.javnic.econe.dto.carbon.request.AvailableCreditsDto;
import com.javnic.econe.dto.carbon.request.MarketplaceListingDto;
import com.javnic.econe.dto.carbon.response.CarbonCreditResponseDto;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.CarbonCreditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketplace")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class MarketplaceController {

    private final CarbonCreditService carbonCreditService;
    private final SecurityUtils securityUtils;

    @GetMapping("/listings")
    public ResponseEntity<List<MarketplaceListingDto>> getMarketplaceListings() {
        List<MarketplaceListingDto> listings = carbonCreditService.getMarketplaceListings();
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/stats")
    public ResponseEntity<AvailableCreditsDto> getMarketplaceStats() {
        AvailableCreditsDto stats = carbonCreditService.getAvailableCreditsStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/my-owned-credits")
    public ResponseEntity<List<CarbonCreditResponseDto>> getMyOwnedCredits() {
        String userId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditResponseDto> credits = carbonCreditService.getOwnedCredits(userId);
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/{creditId}")
    public ResponseEntity<CarbonCreditResponseDto> getCreditDetails(@PathVariable String creditId) {
        CarbonCreditResponseDto credit = carbonCreditService.getCarbonCredit(creditId);
        return ResponseEntity.ok(credit);
    }
}