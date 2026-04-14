package com.javnic.econe.controller.ngoController;


import com.javnic.econe.entity.Land;
import com.javnic.econe.service.LandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ngo-land")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NGO')")
public class NgoLandController {

    private final LandService landService;

    @PutMapping("/{landId}/verify")
    public Land verifyLand(@Valid @PathVariable String landId){
        return landService.verifyLand(landId);
    }

    @PutMapping("/{landId}/reject")
    public Land rejectyLand(@Valid @PathVariable String landId){
        return landService.rejectLand(landId);
    }
}
