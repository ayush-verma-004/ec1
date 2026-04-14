package com.javnic.econe.dto.carbon.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableCreditsDto {
    private Long totalCredits;
    private Double totalCarbonAmount;
    private Double averagePrice;
    private Double minPrice;
    private Double maxPrice;
}