package com.javnic.econe.dto.land.request;

import lombok.Data;

@Data
public class CreateLandRequestDto {

    private String farmerId;
    private double landArea;
    private String landAddress;
    private String soilType;
    private String geoCoordinates;
    private double latitude;
    private double longitude;

}
