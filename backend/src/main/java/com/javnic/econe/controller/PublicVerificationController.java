package com.javnic.econe.controller;

import com.javnic.econe.entity.ProjectHashDocument;
import com.javnic.econe.service.ProjectHashService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/verify")
@RequiredArgsConstructor
public class PublicVerificationController {

    private final ProjectHashService projectHashService;

    @GetMapping("/{hash}")
    public ResponseEntity<ProjectHashDocument> verifyCertificate(@PathVariable String hash) {
        return ResponseEntity.ok(projectHashService.getPublicCertificate(hash));
    }
}
