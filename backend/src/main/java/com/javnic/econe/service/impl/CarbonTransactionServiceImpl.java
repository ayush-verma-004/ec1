package com.javnic.econe.service.impl;

import com.javnic.econe.dto.carbon.request.TransactionRequestDto;
import com.javnic.econe.entity.*;
import com.javnic.econe.enums.*;
import com.javnic.econe.exception.ResourceNotFoundException;
import com.javnic.econe.exception.UnauthorizedException;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.repository.*;
import com.javnic.econe.service.CarbonTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarbonTransactionServiceImpl implements CarbonTransactionService {

    private final CarbonCreditRepository carbonCreditRepository;
    private final CarbonCreditTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BusinessmanProfileRepository businessmanProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final com.javnic.econe.service.ProjectHashService projectHashService;

    @Override
    @Transactional
    public CarbonCreditTransaction requestPurchase(String buyerId, TransactionRequestDto request) {
        // Validate carbon credit
        CarbonCredit credit = carbonCreditRepository.findById(request.getCarbonCreditId())
                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

        // Verify credit is listed for sale
        if (!credit.getIsListedForSale()) {
            throw new ValidationException("This credit is not listed for sale");
        }

        if (credit.getIsSold()) {
            throw new ValidationException("This credit has already been sold");
        }

        if (credit.getStatus() != CarbonCreditStatus.LISTED_FOR_SALE &&
                credit.getStatus() != CarbonCreditStatus.ACTIVE) {
            throw new ValidationException("This credit is not available for purchase");
        }

        // Cannot buy your own credit
        if (credit.getCurrentOwnerId().equals(buyerId)) {
            throw new ValidationException("You cannot purchase your own credit");
        }

        // Validate amount
        if (request.getCarbonAmount() > credit.getCarbonAmount()) {
            throw new ValidationException("Requested amount exceeds available carbon amount");
        }

        // Get buyer and seller details
        BusinessmanProfile businessmanProfile = businessmanProfileRepository.findByUserId(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));
        FarmerProfile farmerProfile = farmerProfileRepository.findById(credit.getFarmerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        User buyer = userRepository.findById(businessmanProfile.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));
        User seller = userRepository.findById(farmerProfile.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        // Calculate total
        Double totalAmount = request.getCarbonAmount() * request.getPricePerTonne();

        // Create transaction
        CarbonCreditTransaction transaction = CarbonCreditTransaction.builder()
                .carbonCreditId(credit.getId())
                .transactionType(TransactionType.BUY)
                .status(TransactionStatus.PENDING)
                .buyerId(buyerId)
                .buyerName(buyer.getEmail())
                .buyerRole(buyer.getRole().name())
                .sellerId(credit.getSellerId())
                .sellerName(seller.getEmail())
                .sellerRole(seller.getRole().name())
                .carbonAmount(request.getCarbonAmount())
                .pricePerTonne(request.getPricePerTonne())
                .totalAmount(totalAmount)
                .currency("INR")
                .requestedAt(LocalDateTime.now())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        transaction = transactionRepository.save(transaction);
        log.info("Purchase request created: {} for credit: {}", transaction.getId(), credit.getId());

        return transaction;
    }

    @Override
    @Transactional
    public CarbonCreditTransaction approvePurchase(String govId, String transactionId, String approvalNotes) {
        // Validate government user
        User govUser = userRepository.findById(govId)
                .orElseThrow(() -> new ResourceNotFoundException("Government user not found"));

        if (govUser.getRole() != UserRole.GOVERNMENT) {
            throw new UnauthorizedException("Only government officials can approve transactions");
        }

        // Get transaction
        CarbonCreditTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new ValidationException("Transaction is not pending approval");
        }

        // Get carbon credit
        CarbonCredit credit = carbonCreditRepository.findById(transaction.getCarbonCreditId())
                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

        // Update transaction
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setApprovedAt(LocalDateTime.now());
        transaction.setCompletedAt(LocalDateTime.now());
        transaction.setApprovedBy(govId);
        transaction.setApproverName(govUser.getEmail());
        transaction.setApprovalNotes(approvalNotes);
        transaction.setPaymentStatus("COMPLETED");
        transaction.setPaymentDate(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());

        // Update carbon credit ownership
        credit.setCurrentOwnerId(transaction.getBuyerId());
        credit.setIsSold(true);
        credit.setIsListedForSale(false);
        credit.setStatus(CarbonCreditStatus.SOLD);
        credit.setLastTransactionDate(LocalDateTime.now());
        credit.setUpdatedAt(LocalDateTime.now());

        // Add sale event to hash document
        projectHashService.addSaleEvent(credit.getId(), credit.getSellerId(), transaction.getBuyerId(),
                transaction.getCarbonAmount(), transaction.getPricePerTonne());

        // Update transaction with public hash
        transaction.setProjectHash(credit.getPublicHash());

        carbonCreditRepository.save(credit);
        transaction = transactionRepository.save(transaction);

        log.info("Transaction {} approved by government: {}", transactionId, govId);

        return transaction;
    }

    @Override
    @Transactional
    public CarbonCreditTransaction rejectPurchase(String govId, String transactionId, String reason) {
        User govUser = userRepository.findById(govId)
                .orElseThrow(() -> new ResourceNotFoundException("Government user not found"));

        if (govUser.getRole() != UserRole.GOVERNMENT) {
            throw new UnauthorizedException("Only government officials can reject transactions");
        }

        CarbonCreditTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new ValidationException("Transaction is not pending approval");
        }

        transaction.setStatus(TransactionStatus.REJECTED);
        transaction.setApprovedBy(govId);
        transaction.setApproverName(govUser.getEmail());
        transaction.setRejectionReason(reason);
        transaction.setUpdatedAt(LocalDateTime.now());

        transaction = transactionRepository.save(transaction);
        log.info("Transaction {} rejected by government: {}", transactionId, govId);

        return transaction;
    }

    @Override
    public List<CarbonCreditTransaction> getBuyerTransactions(String buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    @Override
    public List<CarbonCreditTransaction> getSellerTransactions(String sellerId) {
        return transactionRepository.findBySellerId(sellerId);
    }

    @Override
    public List<CarbonCreditTransaction> getUserTransactionHistory(String userId) {
        return transactionRepository.findUserTransactionHistory(userId);
    }

    @Override
    public List<CarbonCreditTransaction> getPendingTransactions() {
        return transactionRepository.findPendingTransactions();
    }

    @Override
    public CarbonCreditTransaction getTransaction(String transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
    }

    @Override
    public List<CarbonCreditTransaction> getNgoTransactions(String ngoId) {
        return transactionRepository.findByNgoId(ngoId);
    }

    @Override
    public List<CarbonCreditTransaction> getGovernmentTransactions(String govId) {
        return transactionRepository.findByGovernmentId(govId);
    }
}