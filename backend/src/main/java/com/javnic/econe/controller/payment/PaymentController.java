package com.javnic.econe.controller.payment;

import com.javnic.econe.dto.payment.PaymentRequestDto;
import com.javnic.econe.dto.payment.PaymentResponseDto;
import com.javnic.econe.dto.payment.PaymentVerifyDto;
import com.javnic.econe.service.PaymentService;
import com.javnic.econe.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final SecurityUtils securityUtils;

    @PostMapping("/create-order")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDto> createOrder(@Valid @RequestBody PaymentRequestDto request) {
        String userId = securityUtils.getCurrentUserId();
        PaymentResponseDto response = paymentService.createOrder(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> verifyPayment(@Valid @RequestBody PaymentVerifyDto request) {
        String userId = securityUtils.getCurrentUserId();
        paymentService.verifyPayment(userId, request);
        return ResponseEntity.ok(Map.of("message", "Payment verified successfully", "status", "success"));
    }
}
