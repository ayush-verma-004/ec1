package com.javnic.econe.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private String orderId;
    private Double amount;
    private String currency;
    private String keyId; // Razorpay Key ID
}
