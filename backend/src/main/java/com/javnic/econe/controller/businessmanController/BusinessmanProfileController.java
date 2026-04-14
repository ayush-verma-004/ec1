package com.javnic.econe.controller.businessmanController;

import com.javnic.econe.dto.profile.BusinessmanProfileDto;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.BusinessmanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/businessman-profile")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUSINESSMAN')")
public class BusinessmanProfileController {

    private final BusinessmanService businessmanService;
    private final SecurityUtils securityUtils;

    @GetMapping("/get-businessman")
    public ResponseEntity<BusinessmanProfileDto> getBusinessmanProfile() {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.BUSINESSMAN);

        BusinessmanProfileDto profile = businessmanService.getBusinessmanProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/create-businessman")
    public ResponseEntity<BusinessmanProfileDto> createBusinessmanProfile(
            @Valid @RequestBody BusinessmanProfileDto profileDto) {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.BUSINESSMAN);

        BusinessmanProfileDto profile = businessmanService.createBusinessmanProfile(currentUser.getId(), profileDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @PutMapping("/update-businessman")
    public ResponseEntity<BusinessmanProfileDto> updateBusinessmanProfile(
            @Valid @RequestBody BusinessmanProfileDto profileDto) {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.BUSINESSMAN);

        BusinessmanProfileDto profile = businessmanService.updateBusinessmanProfile(currentUser.getId(), profileDto);
        return ResponseEntity.ok(profile);
    }

    private void validateRole(User user, UserRole expectedRole) {
        if (user.getRole() != expectedRole) {
            throw new UnauthorizedException("Access denied for this profile type");
        }
    }
}
