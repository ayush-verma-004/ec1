package com.javnic.econe.controller.farmerController;

import com.javnic.econe.dto.carbon.request.CreateCarbonCreditRequestDto;
import com.javnic.econe.dto.carbon.request.ListForSaleRequestDto;
import com.javnic.econe.dto.carbon.response.CarbonCreditResponseDto;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.CarbonCreditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer-carbon")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FARMER')")
public class FarmerCarbonController {

    private final CarbonCreditService carbonCreditService;
    private final SecurityUtils securityUtils;

    @PostMapping("/create")
    public ResponseEntity<CarbonCreditResponseDto> createCarbonCredit(
            @Valid @RequestBody CreateCarbonCreditRequestDto request) {
        String farmerId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.createCarbonCredit(farmerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-credits")
    public ResponseEntity<List<CarbonCreditResponseDto>> getMyCarbonCredits() {
        String farmerId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditResponseDto> credits = carbonCreditService.getFarmerCarbonCredits(farmerId);
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/land/{landId}")
    public ResponseEntity<List<CarbonCreditResponseDto>> getLandCredits(@PathVariable String landId) {
        List<CarbonCreditResponseDto> credits = carbonCreditService.getLandCarbonCredits(landId);
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/{creditId}")
    public ResponseEntity<CarbonCreditResponseDto> getCarbonCredit(@PathVariable String creditId) {
        CarbonCreditResponseDto credit = carbonCreditService.getCarbonCredit(creditId);
        return ResponseEntity.ok(credit);
    }

    // Task 5 - List for sale
    @PostMapping("/list-for-sale")
    public ResponseEntity<CarbonCreditResponseDto> listForSale(
            @Valid @RequestBody ListForSaleRequestDto request) {
        String farmerId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.listForSale(farmerId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{creditId}/remove-from-sale")
    public ResponseEntity<CarbonCreditResponseDto> removeFromSale(@PathVariable String creditId) {
        String farmerId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.removeFromSale(farmerId, creditId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<CarbonCreditResponseDto>> getMyListings() {
        String farmerId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditResponseDto> listings = carbonCreditService.getSellerListedCredits(farmerId);
        return ResponseEntity.ok(listings);
    }
}
