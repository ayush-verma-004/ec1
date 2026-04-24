package com.javnic.econe.entity;

import com.javnic.econe.enums.CarbonCreditStatus;
import com.javnic.econe.enums.VerificationLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "carbon_credits")
public class CarbonCredit {

    @Id
    private String id;
    
    @Version
    private Long version;

    // Reference IDs
    private String farmerId;
    private String landId;
    private String ngoId; // NGO that verified at Level 1
    private String governmentId; // Government that verified at Level 2

    // Credit Details
    private Double carbonAmount; // in tonnes
    private String carbonType; // e.g., "Soil Carbon", "Biomass", etc.
    private String methodology; // Calculation methodology used

    // Verification
    private CarbonCreditStatus status;
    private VerificationLevel verificationLevel;

    // Level 1 Verification (NGO)
    private LocalDateTime ngoVerifiedAt;
    private String ngoVerificationNotes;
    private String ngoVerifierName;

    // Level 2 Verification (Government)
    private LocalDateTime govVerifiedAt;
    private String govVerificationNotes;
    private String govVerifierName;

    // Validity Period
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Integer validityYears; // typically 5-10 years

    // Market Information
    private Boolean isListedForSale;
    private Double pricePerTonne;
    private Double totalValue;
    private String sellerId; // can be farmer or current owner

    // Transaction tracking
    private Boolean isSold;
    private String currentOwnerId;
    private LocalDateTime lastTransactionDate;

    // Supporting Documents
    private String[] documentUrls;
    private String certificateUrl;

    // Audit Trail
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String lastModifiedBy;

    // Metadata
    private String projectName;
    private String projectDescription;
    private LocalDateTime assessmentDate;
    private String assessmentReport;

    // Public Verification
    private String publicHash;
}