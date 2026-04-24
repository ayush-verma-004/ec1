package com.javnic.econe.service;

import com.javnic.econe.dto.payment.PaymentRequestDto;
import com.javnic.econe.dto.payment.PaymentResponseDto;
import com.javnic.econe.dto.payment.PaymentVerifyDto;

public interface PaymentService {
    PaymentResponseDto createOrder(String userId, PaymentRequestDto request);
    void verifyPayment(String userId, PaymentVerifyDto request);
}
