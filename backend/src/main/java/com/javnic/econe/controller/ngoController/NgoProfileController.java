package com.javnic.econe.controller.ngoController;

import com.javnic.econe.dto.profile.NGOProfileDto;
import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.NGOService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ngo-profile")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NGO')")
public class NgoProfileController {

    private final NGOService ngoService;
    private final SecurityUtils securityUtils;

    @GetMapping("/ngo")
    public ResponseEntity<NGOProfileDto> getNGOProfile() {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.NGO);

        NGOProfileDto profile = ngoService.getNGOProfile(currentUser.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/create")
    public ResponseEntity<NGOProfileDto> updateNGOProfile(
            @Valid @RequestBody NGOProfileDto profileDto) {
        User currentUser = securityUtils.getCurrentUser();
        validateRole(currentUser, UserRole.NGO);

        NGOProfileDto profile = ngoService.updateNGOProfile(currentUser.getId(), profileDto);
        return ResponseEntity.ok(profile);
    }

    private void validateRole(User user, UserRole expectedRole) {
        if (user.getRole() != expectedRole) {
            throw new UnauthorizedException("Access denied for this profile type");
        }
    }
}
