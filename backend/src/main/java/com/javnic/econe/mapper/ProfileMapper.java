package com.javnic.econe.mapper;


import com.javnic.econe.dto.profile.*;
import com.javnic.econe.entity.*;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

    // Farmer Profile Mappings
    public FarmerProfile toFarmerProfile(FarmerProfileDto dto) {
        if (dto == null) return null;

        return FarmerProfile.builder()
                .fullName(dto.getFullName())
                .phoneNumber(dto.getPhoneNumber())
                .aadharNumber(dto.getAadharNumber())
                .address(toFarmerAddress(dto.getAddress()))
                .farmDetails(toFarmDetails(dto.getFarmDetails()))
                .bankAccountNumber(dto.getBankAccountNumber())
                .ifscCode(dto.getIfscCode())
                .cropTypes(dto.getCropTypes())
                .build();
    }

    public FarmerProfileDto toFarmerProfileDto(FarmerProfile entity) {
        if (entity == null) return null;

        return FarmerProfileDto.builder()
                .fullName(entity.getFullName())
                .phoneNumber(entity.getPhoneNumber())
                .aadharNumber(entity.getAadharNumber())
                .address(toFarmerAddressDto(entity.getAddress()))
                .farmDetails(toFarmDetailsDto(entity.getFarmDetails()))
                .bankAccountNumber(entity.getBankAccountNumber())
                .ifscCode(entity.getIfscCode())
                .cropTypes(entity.getCropTypes())
                .build();
    }

    public void updateFarmerProfile(FarmerProfileDto dto, FarmerProfile entity) {
        if (dto == null || entity == null) return;

        entity.setFullName(dto.getFullName());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setAddress(toFarmerAddress(dto.getAddress()));
        entity.setFarmDetails(toFarmDetails(dto.getFarmDetails()));
        entity.setBankAccountNumber(dto.getBankAccountNumber());
        entity.setIfscCode(dto.getIfscCode());
        entity.setCropTypes(dto.getCropTypes());
    }

    private FarmerProfile.Address toFarmerAddress(FarmerProfileDto.AddressDto dto) {
        if (dto == null) return null;

        return FarmerProfile.Address.builder()
                .village(dto.getVillage())
                .district(dto.getDistrict())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .build();
    }

    private FarmerProfileDto.AddressDto toFarmerAddressDto(FarmerProfile.Address entity) {
        if (entity == null) return null;

        return FarmerProfileDto.AddressDto.builder()
                .village(entity.getVillage())
                .district(entity.getDistrict())
                .state(entity.getState())
                .pincode(entity.getPincode())
                .build();
    }

    private FarmerProfile.FarmDetails toFarmDetails(FarmerProfileDto.FarmDetailsDto dto) {
        if (dto == null) return null;

        return FarmerProfile.FarmDetails.builder()
                .landAreaInAcres(dto.getLandAreaInAcres())
                .soilType(dto.getSoilType())
                .irrigationAvailable(dto.getIrrigationAvailable())
                .build();
    }

    private FarmerProfileDto.FarmDetailsDto toFarmDetailsDto(FarmerProfile.FarmDetails entity) {
        if (entity == null) return null;

        return FarmerProfileDto.FarmDetailsDto.builder()
                .landAreaInAcres(entity.getLandAreaInAcres())
                .soilType(entity.getSoilType())
                .irrigationAvailable(entity.getIrrigationAvailable())
                .build();
    }

    // Businessman Profile Mappings
    public BusinessmanProfile toBusinessmanProfile(BusinessmanProfileDto dto) {
        if (dto == null) return null;

        return BusinessmanProfile.builder()
                .fullName(dto.getFullName())
                .phoneNumber(dto.getPhoneNumber())
                .companyName(dto.getCompanyName())
                .gstNumber(dto.getGstNumber())
                .panNumber(dto.getPanNumber())
                .businessAddress(toBusinessAddress(dto.getBusinessAddress()))
                .businessType(dto.getBusinessType())
                .interestedCommodities(dto.getInterestedCommodities())
                .bankAccountNumber(dto.getBankAccountNumber())
                .ifscCode(dto.getIfscCode())
                .build();
    }

    public BusinessmanProfileDto toBusinessmanProfileDto(BusinessmanProfile entity) {
        if (entity == null) return null;

        return BusinessmanProfileDto.builder()
                .fullName(entity.getFullName())
                .phoneNumber(entity.getPhoneNumber())
                .companyName(entity.getCompanyName())
                .gstNumber(entity.getGstNumber())
                .panNumber(entity.getPanNumber())
                .businessAddress(toBusinessAddressDto(entity.getBusinessAddress()))
                .businessType(entity.getBusinessType())
                .interestedCommodities(entity.getInterestedCommodities())
                .bankAccountNumber(entity.getBankAccountNumber())
                .ifscCode(entity.getIfscCode())
                .build();
    }

    public void updateBusinessmanProfile(BusinessmanProfileDto dto, BusinessmanProfile entity) {
        if (dto == null || entity == null) return;

        entity.setFullName(dto.getFullName());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setCompanyName(dto.getCompanyName());
        entity.setBusinessAddress(toBusinessAddress(dto.getBusinessAddress()));
        entity.setBusinessType(dto.getBusinessType());
        entity.setInterestedCommodities(dto.getInterestedCommodities());
        entity.setBankAccountNumber(dto.getBankAccountNumber());
        entity.setIfscCode(dto.getIfscCode());
    }

    private BusinessmanProfile.BusinessAddress toBusinessAddress(BusinessmanProfileDto.BusinessAddressDto dto) {
        if (dto == null) return null;

        return BusinessmanProfile.BusinessAddress.builder()
                .addressLine1(dto.getAddressLine1())
                .addressLine2(dto.getAddressLine2())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .build();
    }

    private BusinessmanProfileDto.BusinessAddressDto toBusinessAddressDto(BusinessmanProfile.BusinessAddress entity) {
        if (entity == null) return null;

        return BusinessmanProfileDto.BusinessAddressDto.builder()
                .addressLine1(entity.getAddressLine1())
                .addressLine2(entity.getAddressLine2())
                .city(entity.getCity())
                .state(entity.getState())
                .pincode(entity.getPincode())
                .build();
    }

    // NGO Profile Mappings
    public NGOProfile toNGOProfile(NGOProfileDto dto) {
        if (dto == null) return null;

        return NGOProfile.builder()
                .organizationName(dto.getOrganizationName())
                .registrationNumber(dto.getRegistrationNumber())
                .contactPersonName(dto.getContactPersonName())
                .phoneNumber(dto.getPhoneNumber())
                .address(toNGOAddress(dto.getAddress()))
                .focusAreas(dto.getFocusAreas())
                .website(dto.getWebsite())
                .yearsOfOperation(dto.getYearsOfOperation())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .allowedRadiusKm(dto.getAllowedRadiusKm())
                .build();
    }

    public NGOProfileDto toNGOProfileDto(NGOProfile entity) {
        if (entity == null) return null;

        return NGOProfileDto.builder()
                .organizationName(entity.getOrganizationName())
                .registrationNumber(entity.getRegistrationNumber())
                .contactPersonName(entity.getContactPersonName())
                .phoneNumber(entity.getPhoneNumber())
                .address(toNGOAddressDto(entity.getAddress()))
                .focusAreas(entity.getFocusAreas())
                .website(entity.getWebsite())
                .yearsOfOperation(entity.getYearsOfOperation())
                .build();
    }

    public void updateNGOProfile(NGOProfileDto dto, NGOProfile entity) {
        if (dto == null || entity == null) return;

        entity.setOrganizationName(dto.getOrganizationName());
        entity.setContactPersonName(dto.getContactPersonName());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setAddress(toNGOAddress(dto.getAddress()));
        entity.setFocusAreas(dto.getFocusAreas());
        entity.setWebsite(dto.getWebsite());
        entity.setYearsOfOperation(dto.getYearsOfOperation());
    }

    private NGOProfile.NGOAddress toNGOAddress(NGOProfileDto.NGOAddressDto dto) {
        if (dto == null) return null;

        return NGOProfile.NGOAddress.builder()
                .addressLine1(dto.getAddressLine1())
                .addressLine2(dto.getAddressLine2())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .build();
    }

    private NGOProfileDto.NGOAddressDto toNGOAddressDto(NGOProfile.NGOAddress entity) {
        if (entity == null) return null;

        return NGOProfileDto.NGOAddressDto.builder()
                .addressLine1(entity.getAddressLine1())
                .addressLine2(entity.getAddressLine2())
                .city(entity.getCity())
                .state(entity.getState())
                .pincode(entity.getPincode())
                .build();
    }

    // Government Profile Mappings
    public GovernmentProfile toGovernmentProfile(GovernmentProfileDto dto) {
        if (dto == null) return null;

        return GovernmentProfile.builder()
                .departmentName(dto.getDepartmentName())
                .officerName(dto.getOfficerName())
                .designation(dto.getDesignation())
                .phoneNumber(dto.getPhoneNumber())
                .officeAddress(dto.getOfficeAddress())
                .employeeId(dto.getEmployeeId())
                .build();
    }

    public GovernmentProfileDto toGovernmentProfileDto(GovernmentProfile entity) {
        if (entity == null) return null;

        return GovernmentProfileDto.builder()
                .departmentName(entity.getDepartmentName())
                .officerName(entity.getOfficerName())
                .designation(entity.getDesignation())
                .phoneNumber(entity.getPhoneNumber())
                .officeAddress(entity.getOfficeAddress())
                .employeeId(entity.getEmployeeId())
                .build();
    }

    public void updateGovernmentProfile(GovernmentProfileDto dto, GovernmentProfile entity) {
        if (dto == null || entity == null) return;

        entity.setDepartmentName(dto.getDepartmentName());
        entity.setOfficerName(dto.getOfficerName());
        entity.setDesignation(dto.getDesignation());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setOfficeAddress(dto.getOfficeAddress());
        entity.setEmployeeId(dto.getEmployeeId());
    }
}