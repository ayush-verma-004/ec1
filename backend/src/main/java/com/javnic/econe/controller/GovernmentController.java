package com.javnic.econe.controller;

import com.javnic.econe.dto.user.request.CreateNGORequestDto;
import com.javnic.econe.dto.user.response.UserResponseDto;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/government")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('GOVERNMENT')")
public class GovernmentController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    @PostMapping("/ngo")
    public ResponseEntity<UserResponseDto> createNGO(@Valid @RequestBody CreateNGORequestDto request) {
        String currentUserId = securityUtils.getCurrentUser().getId();
        UserResponseDto response = userService.createNGO(request, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}