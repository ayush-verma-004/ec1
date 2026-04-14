package com.javnic.econe.controller.govController;

import com.javnic.econe.dto.profile.GovernmentProfileDto;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.GovernmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/government-profile")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GOVERNMENT')")
public class GovernmentProfileController {

    private final GovernmentService governmentService;
    private final SecurityUtils securityUtils;

    @GetMapping("/government")
    public ResponseEntity<GovernmentProfileDto> getGovernmentProfile() {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.GOVERNMENT);

        GovernmentProfileDto profile = governmentService.getGovernmentProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/update")
    public ResponseEntity<GovernmentProfileDto> updateGovernmentProfile(
            @Valid @RequestBody GovernmentProfileDto profileDto) {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.GOVERNMENT);

        GovernmentProfileDto profile = governmentService.updateGovernmentProfile(currentUser.getId(), profileDto);
        return ResponseEntity.ok(profile);
    }

    private void validateRole(User user, UserRole expectedRole) {
        if (user.getRole() != expectedRole) {
            throw new UnauthorizedException("Access denied for this profile type");
        }
    }
}
