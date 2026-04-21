package com.javnic.econe.dto.land.response;

import com.javnic.econe.entity.Land;
import com.javnic.econe.enums.LandStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandVerificationResponseDto {
    private String id;
    private String farmerId;
    private String farmerName;
    private String farmerPhone;
    private double landArea;
    private String landAddress;
    private String soilType;
    private String geoCoordinates;
    private double latitude;
    private double longitude;
    private LandStatus status;
    private double distanceFromNgoKm;
}
