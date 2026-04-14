package com.javnic.econe.repository;

import com.javnic.econe.entity.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUserId(String userId);

    void deleteByUserId(String userId);

    void deleteByExpiryDateBefore(LocalDateTime dateTime);

    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);
}
