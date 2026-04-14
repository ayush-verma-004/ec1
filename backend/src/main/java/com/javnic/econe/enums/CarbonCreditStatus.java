package com.javnic.econe.enums;

public enum CarbonCreditStatus {
    DRAFT,                      // Initial creation
    PENDING_NGO_VERIFICATION,   // Submitted for Level 1 verification
    NGO_VERIFIED,               // Level 1 verified by NGO
    NGO_REJECTED,               // Rejected by NGO
    PENDING_GOV_VERIFICATION,   // Submitted for Level 2 verification
    GOV_VERIFIED,               // Level 2 verified by Government
    GOV_REJECTED,               // Rejected by Government
    ACTIVE,                     // Fully verified and active
    LISTED_FOR_SALE,            // Listed on marketplace
    SOLD,                       // Sold to buyer
    EXPIRED,                    // Validity period expired
    REVOKED                     // Revoked by authorities
}
