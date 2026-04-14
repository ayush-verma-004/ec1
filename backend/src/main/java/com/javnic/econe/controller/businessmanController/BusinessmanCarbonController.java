package com.javnic.econe.controller.businessmanController;

import com.javnic.econe.dto.carbon.request.ListForSaleRequestDto;
import com.javnic.econe.dto.carbon.request.MarketplaceListingDto;
import com.javnic.econe.dto.carbon.response.CarbonCreditResponseDto;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.CarbonCreditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businessman-carbon")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUSINESSMAN')")
public class BusinessmanCarbonController {

    private final CarbonCreditService carbonCreditService;
    private final SecurityUtils securityUtils;

    @GetMapping("/marketplace")
    public ResponseEntity<List<MarketplaceListingDto>> getAvailableCredits() {
        List<MarketplaceListingDto> listings = carbonCreditService.getMarketplaceListings();
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/my-credits")
    public ResponseEntity<List<CarbonCreditResponseDto>> getMyCredits() {
        String businessmanId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditResponseDto> credits = carbonCreditService.getOwnedCredits(businessmanId);
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<CarbonCreditResponseDto>> getMyListings() {
        String businessmanId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditResponseDto> listings = carbonCreditService.getSellerListedCredits(businessmanId);
        return ResponseEntity.ok(listings);
    }

    @PostMapping("/list-for-sale")
    public ResponseEntity<CarbonCreditResponseDto> listForSale(
            @Valid @RequestBody ListForSaleRequestDto request) {
        String businessmanId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.listForSale(businessmanId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{creditId}/remove-from-sale")
    public ResponseEntity<CarbonCreditResponseDto> removeFromSale(@PathVariable String creditId) {
        String businessmanId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.removeFromSale(businessmanId, creditId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{creditId}")
    public ResponseEntity<CarbonCreditResponseDto> getCreditDetails(@PathVariable String creditId) {
        CarbonCreditResponseDto credit = carbonCreditService.getCarbonCredit(creditId);
        return ResponseEntity.ok(credit);
    }
}