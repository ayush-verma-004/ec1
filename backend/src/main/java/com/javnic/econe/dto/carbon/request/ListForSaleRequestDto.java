package com.javnic.econe.dto.carbon.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for listing carbon credit for sale
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListForSaleRequestDto {

    @NotBlank(message = "Carbon credit ID is required")
    private String carbonCreditId;

    @NotNull(message = "Price per tonne is required")
    @Positive(message = "Price must be positive")
    private Double pricePerTonne;
}