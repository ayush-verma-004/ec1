package com.javnic.econe.repository;

import com.javnic.econe.entity.NGOProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NGOProfileRepository extends MongoRepository<NGOProfile, String> {
    Optional<NGOProfile> findByUserId(String userId);
    boolean existsByRegistrationNumber(String registrationNumber);
}
