package com.javnic.econe.dto.carbon.request;


import com.javnic.econe.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequestDto {

    @NotBlank(message = "Carbon credit ID is required")
    private String carbonCreditId;

    @NotNull(message = "Transaction type is required")
    private TransactionType transactionType;

    private String buyerId;  // For SELL transactions
    private String sellerId;  // For BUY transactions

    @NotNull(message = "Carbon amount is required")
    @Positive(message = "Amount must be positive")
    private Double carbonAmount;

    @NotNull(message = "Price per tonne is required")
    @Positive(message = "Price must be positive")
    private Double pricePerTonne;

    private String description;
    private String paymentMethod;
}