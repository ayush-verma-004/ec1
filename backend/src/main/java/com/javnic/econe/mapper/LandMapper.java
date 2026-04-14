package com.javnic.econe.mapper;

import com.javnic.econe.dto.land.request.CreateLandRequestDto;
import com.javnic.econe.dto.land.response.CreateLandResponseDto;
import com.javnic.econe.enums.LandStatus;
import org.springframework.stereotype.Component;

@Component
public class LandMapper {

    public CreateLandResponseDto toCreateLandResponseDto(CreateLandRequestDto createLandRequestDto,
            LandStatus landStatus) {
        if (createLandRequestDto == null)
            return null;

        return CreateLandResponseDto.builder()
                .landArea(createLandRequestDto.getLandArea())
                .landAddress(createLandRequestDto.getLandAddress())
                .soilType(createLandRequestDto.getSoilType())
                .geoCoordinates(createLandRequestDto.getGeoCoordinates())
                .landStatus(landStatus)
                .build();
    }
}
