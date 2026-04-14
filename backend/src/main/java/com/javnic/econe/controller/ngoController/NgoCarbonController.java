package com.javnic.econe.controller.ngoController;

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
@RequestMapping("/api/ngo-carbon")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NGO')")
public class NgoCarbonController {

    private final CarbonCreditService carbonCreditService;
    private final SecurityUtils securityUtils;

    @GetMapping("/pending-verification")
    public ResponseEntity<List<CarbonCreditResponseDto>> getPendingVerification() {
        String ngoId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditResponseDto> credits = carbonCreditService.getPendingNgoVerificationCredits(ngoId);
        return ResponseEntity.ok(credits);
    }

    @PutMapping("/verify")
    public ResponseEntity<CarbonCreditResponseDto> verifyCredit(
            @Valid @RequestBody VerifyCarbonCreditRequestDto request) {
        String ngoId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.verifyByNgo(ngoId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/reject")
    public ResponseEntity<CarbonCreditResponseDto> rejectCredit(
            @Valid @RequestBody VerifyCarbonCreditRequestDto request) {
        String ngoId = securityUtils.getCurrentUser().getId();
        CarbonCreditResponseDto response = carbonCreditService.rejectByNgo(ngoId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{creditId}")
    public ResponseEntity<CarbonCreditResponseDto> getCarbonCredit(@PathVariable String creditId) {
        CarbonCreditResponseDto credit = carbonCreditService.getCarbonCredit(creditId);
        return ResponseEntity.ok(credit);
    }
}