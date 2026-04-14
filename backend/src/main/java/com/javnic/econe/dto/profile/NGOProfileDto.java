package com.javnic.econe.dto.profile;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NGOProfileDto {
    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotBlank(message = "Contact person name is required")
    private String contactPersonName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number")
    private String phoneNumber;

    private NGOAddressDto address;

    private List<String> focusAreas;

    private String website;

    @Positive(message = "Years of operation must be positive")
    private Integer yearsOfOperation;

    private double latitude;

    private double longitude;

    private double allowedRadiusKm;
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NGOAddressDto {
        @NotBlank(message = "Address line 1 is required")
        private String addressLine1;

        private String addressLine2;

        @NotBlank(message = "City is required")
        private String city;

        @NotBlank(message = "State is required")
        private String state;

        @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
        private String pincode;
    }
}