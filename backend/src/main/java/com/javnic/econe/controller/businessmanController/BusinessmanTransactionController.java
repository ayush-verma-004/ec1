package com.javnic.econe.controller.businessmanController;

import com.javnic.econe.dto.carbon.request.TransactionRequestDto;
import com.javnic.econe.entity.CarbonCreditTransaction;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.CarbonTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businessman-transaction")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BUSINESSMAN')")
public class BusinessmanTransactionController {

    private final CarbonTransactionService transactionService;
    private final SecurityUtils securityUtils;

    // Task 7.4 - Request to Buy
    @PostMapping("/request-purchase")
    public ResponseEntity<CarbonCreditTransaction> requestPurchase(
            @Valid @RequestBody TransactionRequestDto request) {
        String buyerId = securityUtils.getCurrentUser().getId();
        CarbonCreditTransaction transaction = transactionService.requestPurchase(buyerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    // Task 7.3 - View Purchase History
    @GetMapping("/my-purchases")
    public ResponseEntity<List<CarbonCreditTransaction>> getMyPurchases() {
        String buyerId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditTransaction> transactions = transactionService.getBuyerTransactions(buyerId);
        return ResponseEntity.ok(transactions);
    }

    // Task 7.2 - View Selling History (if businessman also sells)
    @GetMapping("/my-sales")
    public ResponseEntity<List<CarbonCreditTransaction>> getMySales() {
        String sellerId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditTransaction> transactions = transactionService.getSellerTransactions(sellerId);
        return ResponseEntity.ok(transactions);
    }

    // Complete transaction history
    @GetMapping("/my-history")
    public ResponseEntity<List<CarbonCreditTransaction>> getMyTransactionHistory() {
        String userId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditTransaction> transactions = transactionService.getUserTransactionHistory(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<CarbonCreditTransaction> getTransactionDetails(
            @PathVariable String transactionId) {
        CarbonCreditTransaction transaction = transactionService.getTransaction(transactionId);
        return ResponseEntity.ok(transaction);
    }
}