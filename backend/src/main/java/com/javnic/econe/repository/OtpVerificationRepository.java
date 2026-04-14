package com.javnic.econe.repository;

import com.javnic.econe.entity.OtpVerification;
import com.javnic.econe.enums.OtpStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface OtpVerificationRepository extends MongoRepository<OtpVerification, String> {
    Optional<OtpVerification> findByUserIdAndStatus(String userId, OtpStatus status);

    Optional<OtpVerification> findByEmailAndStatus(String email, OtpStatus status);

    List<OtpVerification> findByUserId(String userId);

    void deleteByExpiryTimeBefore(LocalDateTime dateTime);
}
