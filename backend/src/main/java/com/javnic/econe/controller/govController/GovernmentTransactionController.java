package com.javnic.econe.controller.govController;

import com.javnic.econe.entity.CarbonCreditTransaction;
import com.javnic.econe.security.SecurityUtils;
import com.javnic.econe.service.CarbonTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/government-transaction")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GOVERNMENT')")
public class GovernmentTransactionController {

    private final CarbonTransactionService transactionService;
    private final SecurityUtils securityUtils;

    @GetMapping("/pending")
    public ResponseEntity<List<CarbonCreditTransaction>> getPendingTransactions() {
        List<CarbonCreditTransaction> transactions = transactionService.getPendingTransactions();
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{transactionId}/approve")
    public ResponseEntity<CarbonCreditTransaction> approveTransaction(
            @PathVariable String transactionId,
            @RequestBody(required = false) Map<String, String> body) {
        String govId = securityUtils.getCurrentUser().getId();
        String notes = body != null ? body.get("approvalNotes") : null;
        CarbonCreditTransaction transaction =
                transactionService.approvePurchase(govId, transactionId, notes);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/{transactionId}/reject")
    public ResponseEntity<CarbonCreditTransaction> rejectTransaction(
            @PathVariable String transactionId,
            @RequestBody Map<String, String> body) {
        String govId = securityUtils.getCurrentUser().getId();
        String reason = body.get("rejectionReason");
        CarbonCreditTransaction transaction =
                transactionService.rejectPurchase(govId, transactionId, reason);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<CarbonCreditTransaction> getTransactionDetails(
            @PathVariable String transactionId) {
        CarbonCreditTransaction transaction = transactionService.getTransaction(transactionId);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CarbonCreditTransaction>> getAllTransactions() {
        // Government can view all transactions
        List<CarbonCreditTransaction> transactions = transactionService.getPendingTransactions();
        return ResponseEntity.ok(transactions);
    }
}