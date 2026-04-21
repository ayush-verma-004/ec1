package com.javnic.econe.controller.ngoController;


import com.javnic.econe.dto.land.response.LandVerificationResponseDto;
import com.javnic.econe.entity.Land;
import com.javnic.econe.service.LandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngo-land")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_NGO')")
public class NgoLandController {

    private final LandService landService;

    @GetMapping("/pending")
    public List<LandVerificationResponseDto> getPendingLands() {
        return landService.getAllUnverifyLandsInsideNgoArea();
    }

    @GetMapping("/verified")
    public List<LandVerificationResponseDto> getVerifiedLands() {
        return landService.getAllVerifyLandsInsideNgoArea();
    }

    @PutMapping("/{landId}/verify")
    public Land verifyLand(@Valid @PathVariable String landId){
        return landService.verifyLand(landId);
    }

    @PutMapping("/{landId}/reject")
    public Land rejectyLand(@Valid @PathVariable String landId){
        return landService.rejectLand(landId);
    }
}
