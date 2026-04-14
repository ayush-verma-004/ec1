package com.javnic.econe.controller;

import com.javnic.econe.entity.CarbonCreditTransaction;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.CarbonTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class TransactionController {

    private final CarbonTransactionService transactionService;
    private final SecurityUtils securityUtils;

    @GetMapping("/my-history")
    public ResponseEntity<List<CarbonCreditTransaction>> getMyTransactionHistory() {
        String userId = securityUtils.getCurrentUser().getId();
        List<CarbonCreditTransaction> transactions =
                transactionService.getUserTransactionHistory(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<CarbonCreditTransaction> getTransactionDetails(
            @PathVariable String transactionId) {
        CarbonCreditTransaction transaction = transactionService.getTransaction(transactionId);
        return ResponseEntity.ok(transaction);
    }
}