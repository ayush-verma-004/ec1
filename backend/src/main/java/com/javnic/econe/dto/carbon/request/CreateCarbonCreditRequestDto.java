package com.javnic.econe.dto.carbon.request;

import com.javnic.econe.enums.CarbonCreditType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCarbonCreditRequestDto {

    @NotBlank(message = "Land ID is required")
    private String landId;

    @NotNull(message = "Carbon amount is required")
    @Positive(message = "Carbon amount must be positive")
    private Double carbonAmount;

    @NotNull(message = "Carbon type is required")
    private CarbonCreditType carbonType;

    @NotBlank(message = "Methodology is required")
    private String methodology;

    @NotBlank(message = "Project name is required")
    private String projectName;

    private String projectDescription;

    @NotNull(message = "Validity years is required")
    @Min(value = 1, message = "Validity must be at least 1 year")
    @Max(value = 10, message = "Validity cannot exceed 10 years")
    private Integer validityYears;

    @NotNull(message = "Assessment date is required")
    private LocalDateTime assessmentDate;

    private String assessmentReport;
}
