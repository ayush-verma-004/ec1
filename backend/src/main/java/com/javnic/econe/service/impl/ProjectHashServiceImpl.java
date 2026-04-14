package com.javnic.econe.service.impl;

import com.javnic.econe.entity.CarbonCredit;
import com.javnic.econe.entity.ProjectHashDocument;
import com.javnic.econe.exception.ResourceNotFoundException;
import com.javnic.econe.repository.ProjectHashRepository;
import com.javnic.econe.service.ProjectHashService;
import com.javnic.econe.util.HashGenerationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectHashServiceImpl implements ProjectHashService {

    private final ProjectHashRepository projectHashRepository;

    @Override
    @Transactional
    public String createHashDocument(CarbonCredit credit) {
        String hash = generateUniqueHash();

        Map<String, Object> details = new HashMap<>();
        details.put("projectName", credit.getProjectName());
        details.put("carbonAmount", credit.getCarbonAmount());
        details.put("carbonType", credit.getCarbonType());
        details.put("location", credit.getLandId()); // Using ID as proxy for location for now
        details.put("methodology", credit.getMethodology());
        details.put("farmerId", credit.getFarmerId());

        ProjectHashDocument doc = ProjectHashDocument.builder()
                .publicHash(hash)
                .projectId(credit.getId())
                .projectDetails(details)
                .verificationStatus("CREATED")
                .currentOwner(credit.getFarmerId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Add initial history
        addHistoryEvent(doc, "PROJECT_CREATED", "Project registered by farmer", credit.getFarmerId());

        projectHashRepository.save(doc);
        log.info("Created public hash document {} for project {}", hash, credit.getId());

        return hash;
    }

    @Override
    @Transactional
    public void addVerificationEvent(String carbonCreditId, String verifierId, String stage, String notes) {
        ProjectHashDocument doc = projectHashRepository.findByProjectId(carbonCreditId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Hash document not found for project: " + carbonCreditId));

        doc.setVerificationStatus(stage); // e.g., "VERIFIED_LEVEL_1"
        doc.setUpdatedAt(LocalDateTime.now());

        addHistoryEvent(doc, "VERIFICATION_" + stage, notes, verifierId);

        projectHashRepository.save(doc);
        log.info("Added verification event to hash document {}", doc.getPublicHash());
    }

    @Override
    @Transactional
    public void addSaleEvent(String carbonCreditId, String sellerId, String buyerId, Double amount, Double price) {
        ProjectHashDocument doc = projectHashRepository.findByProjectId(carbonCreditId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Hash document not found for project: " + carbonCreditId));

        doc.setCurrentOwner(buyerId);
        doc.setVerificationStatus("SOLD");
        doc.setUpdatedAt(LocalDateTime.now());

        String note = String.format("Sold %.2f tonnes at %.2f per tonne", amount, price);
        addHistoryEvent(doc, "OWNERSHIP_TRANSFER", note, "Seller: " + sellerId + " -> Buyer: " + buyerId);

        projectHashRepository.save(doc);
        log.info("Added sale event to hash document {}", doc.getPublicHash());
    }

    @Override
    public ProjectHashDocument getPublicCertificate(String hash) {
        return projectHashRepository.findById(hash)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found for hash: " + hash));
    }

    private String generateUniqueHash() {
        String hash;
        int retries = 0;
        do {
            hash = HashGenerationUtil.generateHash();
            if (projectHashRepository.existsById(hash)) {
                hash = null; // Try again
                retries++;
            }
        } while (hash == null && retries < 5);

        if (hash == null) {
            throw new RuntimeException("Failed to generate unique hash after multiple retries");
        }
        return hash;
    }

    private void addHistoryEvent(ProjectHashDocument doc, String type, String description, String actor) {
        Map<String, Object> event = new HashMap<>();
        event.put("timestamp", LocalDateTime.now());
        event.put("type", type);
        event.put("description", description);
        event.put("actor", actor);
        doc.getHistory().add(event);
    }
}
