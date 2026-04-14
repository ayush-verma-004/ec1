package com.javnic.econe.service;

import com.javnic.econe.dto.carbon.request.TransactionRequestDto;
import com.javnic.econe.entity.CarbonCreditTransaction;
import java.util.List;

public interface CarbonTransactionService {

    // Task 7 - Buy/Sell Operations
    CarbonCreditTransaction requestPurchase(String buyerId, TransactionRequestDto request);
    CarbonCreditTransaction approvePurchase(String govId, String transactionId, String approvalNotes);
    CarbonCreditTransaction rejectPurchase(String govId, String transactionId, String reason);

    // Transaction History
    List<CarbonCreditTransaction> getBuyerTransactions(String buyerId);
    List<CarbonCreditTransaction> getSellerTransactions(String sellerId);
    List<CarbonCreditTransaction> getUserTransactionHistory(String userId);
    List<CarbonCreditTransaction> getPendingTransactions();

    // Transaction Details
    CarbonCreditTransaction getTransaction(String transactionId);
}
