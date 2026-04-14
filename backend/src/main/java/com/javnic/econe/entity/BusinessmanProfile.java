package com.javnic.econe.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "businessman_profiles")
public class BusinessmanProfile {
    @Id
    private String id;

    private String userId;

    private String fullName;

    private String phoneNumber;

    private String companyName;

    private String gstNumber;

    private String panNumber;

    private BusinessAddress businessAddress;

    private String businessType;

    private List<String> interestedCommodities;

    private String bankAccountNumber;

    private String ifscCode;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BusinessAddress {
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pincode;
    }
}