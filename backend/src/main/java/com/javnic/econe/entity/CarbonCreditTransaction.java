package com.javnic.econe.entity;

import com.javnic.econe.enums.TransactionStatus;
import com.javnic.econe.enums.TransactionType;
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
@Document(collection = "carbon_credit_transactions")
public class CarbonCreditTransaction {

    @Id
    private String id;

    // Transaction Details
    private String carbonCreditId;
    private String projectHash;
    private TransactionType transactionType;
    private TransactionStatus status;

    // Parties Involved
    private String sellerId;
    private String sellerName;
    private String sellerRole; // FARMER, BUSINESSMAN, etc.

    private String buyerId;
    private String buyerName;
    private String buyerRole;

    private String ngoId;
    private String governmentId;

    // Financial Details
    private Double carbonAmount; // tonnes
    private Double pricePerTonne;
    private Double totalAmount;
    private String currency; // INR

    // Request & Approval
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;

    private String approvedBy; // Government official ID
    private String approverName;
    private String approvalNotes;
    private String rejectionReason;

    // Payment Information
    private String paymentMethod;
    private String paymentReference;
    private String paymentStatus;
    private LocalDateTime paymentDate;

    // Supporting Documents
    private String contractUrl;
    private String invoiceUrl;
    private String receiptUrl;

    // Metadata
    private String description;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
