package com.javnic.econe.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "government_profiles")
public class GovernmentProfile {
    @Id
    private String id;

    private String userId;

    private String departmentName;

    private String officerName;

    private String designation;

    private String phoneNumber;

    private String officeAddress;

    private String employeeId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}