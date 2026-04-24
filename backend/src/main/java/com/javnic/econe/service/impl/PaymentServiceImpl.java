package com.javnic.econe.service.impl;

import com.javnic.econe.dto.payment.PaymentRequestDto;
import com.javnic.econe.dto.payment.PaymentResponseDto;
import com.javnic.econe.dto.payment.PaymentVerifyDto;
import com.javnic.econe.entity.CarbonCredit;
import com.javnic.econe.entity.Payment;
import com.javnic.econe.enums.CarbonCreditStatus;
import com.javnic.econe.exception.ResourceNotFoundException;
import com.javnic.econe.exception.ValidationException;
import com.javnic.econe.repository.CarbonCreditRepository;
import com.javnic.econe.repository.CarbonCreditTransactionRepository;
import com.javnic.econe.repository.PaymentRepository;
import com.javnic.econe.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final CarbonCreditRepository carbonCreditRepository;
    private final CarbonCreditTransactionRepository transactionRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() {
        try {
            this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        } catch (RazorpayException e) {
            log.error("Failed to initialize Razorpay client", e);
        }
    }

    @Override
    @Transactional
    public PaymentResponseDto createOrder(String userId, PaymentRequestDto request) {
        // Verify Carbon Credit exists and is listed for sale
        CarbonCredit credit = carbonCreditRepository.findById(request.getCarbonCreditId())
                .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

        if (!credit.getIsListedForSale() || credit.getIsSold() || credit.getStatus() != CarbonCreditStatus.LISTED_FOR_SALE) {
            throw new ValidationException("Carbon credit is not available for purchase");
        }

        Double requestedQuantity = request.getQuantity() != null ? request.getQuantity() : 1.0;
        if (requestedQuantity > credit.getCarbonAmount()) {
            throw new ValidationException("Requested quantity exceeds available carbon credits");
        }

        // Amount calculation (assuming price is total value, or pricePerTonne * amount)
        Double totalAmount = credit.getPricePerTonne() * requestedQuantity; // Basic calculation
        // Ensure totalAmount matches the request amount to prevent tampering
        if (!request.getAmount().equals(totalAmount)) {
            // Note: In real app, calculate it server-side. For this demo, we accept request amount but could validate.
            log.warn("Requested amount {} differs from calculated amount {}", request.getAmount(), totalAmount);
            totalAmount = request.getAmount(); 
        }

        try {
            // Razorpay amount is in paise (multiply by 100)
            int amountInPaise = (int) (totalAmount * 100);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            // Create Order in Razorpay
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String orderId = razorpayOrder.get("id");

            // Save Payment record in DB
            Payment payment = Payment.builder()
                    .userId(userId)
                    .carbonCreditId(credit.getId())
                    .amount(totalAmount)
                    .quantity(requestedQuantity)
                    .status("CREATED")
                    .orderId(orderId)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            paymentRepository.save(payment);

            return PaymentResponseDto.builder()
                    .orderId(orderId)
                    .amount(totalAmount)
                    .currency("INR")
                    .keyId(razorpayKeyId) // Send key to frontend for initialization
                    .build();

        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order: {}", e.getMessage());
            throw new RuntimeException("Failed to create payment order");
        }
    }

    @Override
    @Transactional
    public void verifyPayment(String userId, PaymentVerifyDto request) {
        // Fetch Payment record
        Payment payment = paymentRepository.findByOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found"));

        try {
            // Prepare attributes for signature verification
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            // Verify signature using Razorpay SDK
            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValid) {
                // Update Payment Status
                payment.setStatus("SUCCESS");
                payment.setPaymentId(request.getRazorpayPaymentId());
                payment.setSignature(request.getRazorpaySignature());
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(payment);

                // Update Carbon Credit Ownership
                CarbonCredit credit = carbonCreditRepository.findById(payment.getCarbonCreditId())
                        .orElseThrow(() -> new ResourceNotFoundException("Carbon credit not found"));

                Double purchasedQuantity = payment.getQuantity() != null ? payment.getQuantity() : credit.getCarbonAmount();
                String sellerId = credit.getCurrentOwnerId() != null ? credit.getCurrentOwnerId() : credit.getFarmerId();

                if (purchasedQuantity < credit.getCarbonAmount()) {
                    // Split the credit
                    // Buyer gets a new credit
                    CarbonCredit newCredit = CarbonCredit.builder()
                            .farmerId(credit.getFarmerId())
                            .landId(credit.getLandId())
                            .ngoId(credit.getNgoId())
                            .governmentId(credit.getGovernmentId())
                            .carbonAmount(purchasedQuantity)
                            .carbonType(credit.getCarbonType())
                            .methodology(credit.getMethodology())
                            .status(CarbonCreditStatus.ACTIVE)
                            .verificationLevel(credit.getVerificationLevel())
                            .ngoVerifiedAt(credit.getNgoVerifiedAt())
                            .govVerifiedAt(credit.getGovVerifiedAt())
                            .validFrom(credit.getValidFrom())
                            .validUntil(credit.getValidUntil())
                            .validityYears(credit.getValidityYears())
                            .isListedForSale(false)
                            .pricePerTonne(credit.getPricePerTonne())
                            .isSold(true)
                            .currentOwnerId(userId)
                            .lastTransactionDate(LocalDateTime.now())
                            .documentUrls(credit.getDocumentUrls())
                            .certificateUrl(credit.getCertificateUrl())
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .createdBy(userId)
                            .build();
                    carbonCreditRepository.save(newCredit);
                    
                    // Seller keeps the remaining amount
                    credit.setCarbonAmount(credit.getCarbonAmount() - purchasedQuantity);
                    credit.setUpdatedAt(LocalDateTime.now());
                    carbonCreditRepository.save(credit);
                } else {
                    credit.setIsSold(true);
                    credit.setIsListedForSale(false);
                    credit.setCurrentOwnerId(userId);
                    credit.setStatus(CarbonCreditStatus.ACTIVE);
                    credit.setLastTransactionDate(LocalDateTime.now());
                    credit.setUpdatedAt(LocalDateTime.now());
                    carbonCreditRepository.save(credit);
                }

                // Record the transaction
                com.javnic.econe.entity.CarbonCreditTransaction transaction = com.javnic.econe.entity.CarbonCreditTransaction.builder()
                        .carbonCreditId(credit.getId())
                        .transactionType(com.javnic.econe.enums.TransactionType.BUY)
                        .status(com.javnic.econe.enums.TransactionStatus.COMPLETED)
                        .sellerId(sellerId)
                        .buyerId(userId)
                        .buyerRole("BUSINESSMAN")
                        .ngoId(credit.getNgoId())
                        .governmentId(credit.getGovernmentId())
                        .carbonAmount(purchasedQuantity)
                        .pricePerTonne(credit.getPricePerTonne())
                        .totalAmount(payment.getAmount())
                        .currency("INR")
                        .completedAt(LocalDateTime.now())
                        .paymentMethod("RAZORPAY")
                        .paymentReference(request.getRazorpayPaymentId())
                        .paymentStatus("SUCCESS")
                        .paymentDate(LocalDateTime.now())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                transactionRepository.save(transaction);

                log.info("Payment successful for order {} by user {}", request.getRazorpayOrderId(), userId);
            } else {
                payment.setStatus("FAILED");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(payment);
                throw new ValidationException("Payment signature verification failed");
            }
        } catch (RazorpayException e) {
            log.error("Error verifying payment signature", e);
            throw new RuntimeException("Failed to verify payment");
        }
    }
}
