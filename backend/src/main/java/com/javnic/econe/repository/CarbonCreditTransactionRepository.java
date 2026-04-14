package com.javnic.econe.repository;

import com.javnic.econe.entity.CarbonCreditTransaction;
import com.javnic.econe.enums.TransactionStatus;
import com.javnic.econe.enums.TransactionType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CarbonCreditTransactionRepository extends MongoRepository<CarbonCreditTransaction, String> {

    // Find by carbon credit
    List<CarbonCreditTransaction> findByCarbonCreditId(String carbonCreditId);

    // Find by seller
    List<CarbonCreditTransaction> findBySellerId(String sellerId);

    // Find by buyer
    List<CarbonCreditTransaction> findByBuyerId(String buyerId);

    // Find by status
    List<CarbonCreditTransaction> findByStatus(TransactionStatus status);

    // Find by type
    List<CarbonCreditTransaction> findByTransactionType(TransactionType type);

    // Find pending transactions for approval
    @Query("{ 'status': 'PENDING' }")
    List<CarbonCreditTransaction> findPendingTransactions();

    // Find completed transactions in date range
    @Query("{ 'status': 'COMPLETED', 'completedAt': { $gte: ?0, $lte: ?1 } }")
    List<CarbonCreditTransaction> findCompletedTransactionsBetween(
            LocalDateTime start, LocalDateTime end);

    // Find user's transaction history (as buyer or seller)
    @Query("{ $or: [ { 'buyerId': ?0 }, { 'sellerId': ?0 } ] }")
    List<CarbonCreditTransaction> findUserTransactionHistory(String userId);

    // Statistics
    @Query(value = "{ 'sellerId': ?0, 'status': 'COMPLETED' }", count = true)
    Long countCompletedSalesBySeller(String sellerId);

    @Query(value = "{ 'buyerId': ?0, 'status': 'COMPLETED' }", count = true)
    Long countCompletedPurchasesByBuyer(String buyerId);

    // Revenue calculation
    @Query(value = "{ 'sellerId': ?0, 'status': 'COMPLETED' }", fields = "{ 'totalAmount': 1 }")
    List<CarbonCreditTransaction> findCompletedSalesForRevenue(String sellerId);
}