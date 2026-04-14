package com.javnic.econe.dto.carbon.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketplaceListingDto {
    private String id;
    private String sellerId;
    private String sellerName;
    private Double carbonAmount;
    private String carbonType;
    private Double pricePerTonne;
    private Double totalValue;
    private String landAddress;
    private String verificationLevel;
    private LocalDateTime validUntil;
    private LocalDateTime listedAt;
}
