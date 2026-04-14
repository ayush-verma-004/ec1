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
@Document(collection = "ngo_profiles")
public class NGOProfile {
    @Id
    private String id;

    private String userId;

    private String organizationName;

    private String registrationNumber;

    private String contactPersonName;

    private String phoneNumber;

    private NGOAddress address;

    private List<String> focusAreas;

    private String website;

    private Integer yearsOfOperation;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private double latitude;

    private double longitude;

    private double allowedRadiusKm;

//    private boolean isProfileUpdated = false;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NGOAddress {
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pincode;
    }

}