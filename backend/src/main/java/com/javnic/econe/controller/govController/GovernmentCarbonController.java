package com.javnic.econe.controller.govController;

import com.javnic.econe.dto.carbon.request.AvailableCreditsDto;
import com.javnic.econe.dto.carbon.request.VerifyCarbonCreditRequestDto;
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
@RequestMapping("/api/government-carbon")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GOVERNMENT')")
public class GovernmentCarbonController {

    private final CarbonCreditService carbonCreditService;
    private final SecurityUtils securityUtils;

    @GetMapping("/pending-verification")
    public ResponseEntity<List<CarbonCreditResponseDto>> getPendingVerification() {
        List<CarbonCreditResponseDto> credits = carbonCreditService.getPendingGovVerificationCredits();
        return ResponseEntity.ok(credits);
    }

    @PutMapping("/verify")
    public ResponseEntity<CarbonCreditResponseDto> verifyCredit(
            @Valid @RequestBody VerifyCarbonCreditRequestDto request) {
        String govId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.verifyByGovernment(govId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/reject")
    public ResponseEntity<CarbonCreditResponseDto> rejectCredit(
            @Valid @RequestBody VerifyCarbonCreditRequestDto request) {
        String govId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.rejectByGovernment(govId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{creditId}")
    public ResponseEntity<CarbonCreditResponseDto> getCarbonCredit(@PathVariable String creditId) {
        CarbonCreditResponseDto credit = carbonCreditService.getCarbonCredit(creditId);
        return ResponseEntity.ok(credit);
    }

    @GetMapping("/marketplace/stats")
    public ResponseEntity<AvailableCreditsDto> getMarketplaceStats() {
        AvailableCreditsDto stats = carbonCreditService.getAvailableCreditsStats();
        return ResponseEntity.ok(stats);
    }
}