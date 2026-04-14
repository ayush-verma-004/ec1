package com.javnic.econe.entity;

import com.javnic.econe.enums.LandStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "farmer_lands")
public class Land {

    @Id
    private String id;

    private String farmerId;

    private double landArea;

    private String landAddress;

    private String soilType;

    private String geoCoordinates;

    private double latitude;

    private double longitude;

    private LandStatus status = LandStatus.PENDING_VERIFICATION;

}
