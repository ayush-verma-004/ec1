package com.javnic.econe.repository;

import com.javnic.econe.entity.GovernmentProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GovernmentProfileRepository extends MongoRepository<GovernmentProfile, String> {
    Optional<GovernmentProfile> findByUserId(String userId);

    boolean existsByEmployeeId(String employeeId);
}
