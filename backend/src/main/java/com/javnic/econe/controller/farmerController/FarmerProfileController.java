package com.javnic.econe.controller.farmerController;

import com.javnic.econe.dto.profile.FarmerProfileDto;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.FarmerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmer-profile")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FARMER')")
public class FarmerProfileController {

    private final FarmerService farmerService;
    private final SecurityUtils securityUtils;

    @GetMapping("/get-farmer")
    public ResponseEntity<FarmerProfileDto> getFarmerProfile() {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.FARMER);

        FarmerProfileDto profile = farmerService.getFarmerProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/create-farmer")
    public ResponseEntity<FarmerProfileDto> createFarmerProfile(
            @Valid @RequestBody FarmerProfileDto profileDto) {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.FARMER);

        FarmerProfileDto profile = farmerService.createFarmerProfile(currentUser.getId(), profileDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @PutMapping("/update-farmer")
    public ResponseEntity<FarmerProfileDto> updateFarmerProfile(
            @Valid @RequestBody FarmerProfileDto profileDto) {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.FARMER);

        FarmerProfileDto profile = farmerService.updateFarmerProfile(currentUser.getId(), profileDto);
        return ResponseEntity.ok(profile);
    }

    private void validateRole(User user, UserRole expectedRole) {
        if (user.getRole() != expectedRole) {
            throw new UnauthorizedException("Access denied for this profile type");
        }
    }
}
