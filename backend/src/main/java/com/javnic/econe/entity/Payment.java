package com.javnic.econe.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    
    private String userId;
    private String carbonCreditId;
    private Double amount;
    private Double quantity;
    
    private String status; // "CREATED", "SUCCESS", "FAILED"
    
    private String orderId; // Razorpay Order ID
    private String paymentId; // Razorpay Payment ID
    private String signature; // Razorpay Signature
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
