package com.javnic.econe.controller.farmerController;

import com.javnic.econe.entity.CarbonCreditTransaction;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.CarbonTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer-transaction")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FARMER')")
public class FarmerTransactionController {

    private final CarbonTransactionService transactionService;
    private final SecurityUtils securityUtils;

    // Task 5.4 - View Sale Requests
    @GetMapping("/my-sales")
    public ResponseEntity<List<CarbonCreditTransaction>> getMySales() {
        String farmerId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditTransaction> transactions = transactionService.getSellerTransactions(farmerId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<CarbonCreditTransaction>> getMyTransactionHistory() {
        String farmerId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditTransaction> transactions =
                transactionService.getUserTransactionHistory(farmerId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<CarbonCreditTransaction> getTransactionDetails(
            @PathVariable String transactionId) {
        CarbonCreditTransaction transaction = transactionService.getTransaction(transactionId);
        return ResponseEntity.ok(transaction);
    }
}