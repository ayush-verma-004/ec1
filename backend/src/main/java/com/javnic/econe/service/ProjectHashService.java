package com.javnic.econe.service;

import com.javnic.econe.entity.CarbonCredit;
import com.javnic.econe.entity.ProjectHashDocument;

public interface ProjectHashService {
    String createHashDocument(CarbonCredit credit);

    void addVerificationEvent(String carbonCreditId, String verifierId, String stage, String notes);

    void addSaleEvent(String carbonCreditId, String sellerId, String buyerId, Double amount, Double price);

    ProjectHashDocument getPublicCertificate(String hash);
}
