package com.javnic.econe.controller.farmerController;

import com.javnic.econe.dto.land.request.CreateLandRequestDto;
import com.javnic.econe.dto.land.response.CreateLandResponseDto;
import com.javnic.econe.entity.Land;
import com.javnic.econe.service.LandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer-land")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_FARMER')")
public class FramerLandController {

    private final LandService landService;

    @PostMapping("/create")
    public CreateLandResponseDto createLand(@Valid @RequestBody CreateLandRequestDto createLandRequestDto) {
        return landService.createLand(createLandRequestDto);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Land> getFarmerLands(@PathVariable String farmerId) {
        return landService.getLandsByFarmer(farmerId);
    }

    @GetMapping("/{landId}")
    public Land getLand(@PathVariable String landId) {
        return landService.getLand(landId);
    }
}
