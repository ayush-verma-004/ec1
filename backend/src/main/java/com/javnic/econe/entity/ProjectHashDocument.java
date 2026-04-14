package com.javnic.econe.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "project_hash_documents")
public class ProjectHashDocument {

    @Id
    private String publicHash; // e.g., "XY9876"

    private String projectId; // CarbonCreditId
    private Map<String, Object> projectDetails; // Snapshot of important details

    private String verificationStatus; // e.g., "PENDING", "VERIFIED", "SOLD"
    private String currentOwner; // Owner ID or Name

    @Builder.Default
    private List<Map<String, Object>> history = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
