package com.javnic.econe.repository;

import com.javnic.econe.entity.User;
import com.javnic.econe.enums.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByCreatedBy(String createdBy);
    
    List<com.javnic.econe.entity.User> findByStatusAndCreatedAtBefore(com.javnic.econe.enums.UserStatus status, java.time.LocalDateTime dateTime);
}
