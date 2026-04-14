package com.javnic.econe.dto.land.response;

import com.javnic.econe.enums.LandStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateLandResponseDto {

    private String id;
    private double landArea;
    private String landAddress;
    private String soilType;
    private String geoCoordinates;
    private LandStatus landStatus;

}
