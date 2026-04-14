package com.javnic.econe.entity;

import com.javnic.econe.enums.OtpStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "otp_verifications")
public class OtpVerification {
    @Id
    private String id;

    @Indexed
    private String userId;

    private String email;

    private String otp;

    private OtpStatus status;

    private LocalDateTime expiryTime;

    private LocalDateTime createdAt;

    private int attemptCount;
}