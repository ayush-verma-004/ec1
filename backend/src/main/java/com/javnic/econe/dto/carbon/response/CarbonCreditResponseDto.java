package com.javnic.econe.dto.carbon.response;

import com.javnic.econe.enums.CarbonCreditStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Response DTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarbonCreditResponseDto {
    private String id;
    private String farmerId;
    private String farmerName;
    private String landId;
    private String landAddress;
    private Double carbonAmount;
    private String carbonType;
    private CarbonCreditStatus status;
    private String verificationLevel;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Boolean isListedForSale;
    private Double pricePerTonne;
    private Double totalValue;
    private String certificateUrl;
    private LocalDateTime createdAt;
    private String publicHash;
}
