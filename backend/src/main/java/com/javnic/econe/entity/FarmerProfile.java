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
@Document(collection = "farmer_profiles")
public class FarmerProfile {
    @Id
    private String id;

    private String userId;

    private String fullName;

    private String phoneNumber;

    private String aadharNumber;

    private Address address;

    private FarmDetails farmDetails;

    private String bankAccountNumber;

    private String ifscCode;

    private List<String> cropTypes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        private String village;
        private String district;
        private String state;
        private String pincode;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FarmDetails {
        private Double landAreaInAcres;
        private String soilType;
        private Boolean irrigationAvailable;
    }
}