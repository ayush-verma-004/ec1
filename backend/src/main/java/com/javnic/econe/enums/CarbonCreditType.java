package com.javnic.econe.enums;

// CarbonCreditType.java
public enum CarbonCreditType {
    SOIL_CARBON("Soil Carbon Sequestration"),
    BIOMASS("Biomass Carbon"),
    AGROFORESTRY("Agroforestry"),
    ORGANIC_FARMING("Organic Farming Practices"),
    CROP_RESIDUE("Crop Residue Management"),
    WATER_CONSERVATION("Water Conservation"),
    RENEWABLE_ENERGY("Renewable Energy Usage");

    private final String description;

    CarbonCreditType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
