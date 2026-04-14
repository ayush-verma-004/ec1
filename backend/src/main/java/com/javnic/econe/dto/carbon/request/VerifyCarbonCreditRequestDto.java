package com.javnic.econe.dto.carbon.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyCarbonCreditRequestDto {

    @NotBlank(message = "Carbon credit ID is required")
    private String carbonCreditId;

    @NotNull(message = "Approval status is required")
    private Boolean approved;

    private String verificationNotes;
    private String rejectionReason;
}
