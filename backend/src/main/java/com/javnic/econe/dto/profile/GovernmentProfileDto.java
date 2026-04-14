package com.javnic.econe.dto.profile;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GovernmentProfileDto {
    @NotBlank(message = "Department name is required")
    private String departmentName;

    @NotBlank(message = "Officer name is required")
    private String officerName;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number")
    private String phoneNumber;

    @NotBlank(message = "Office address is required")
    private String officeAddress;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;
}