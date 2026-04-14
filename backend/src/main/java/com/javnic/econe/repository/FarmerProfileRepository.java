package com.javnic.econe.repository;

import com.javnic.econe.entity.FarmerProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerProfileRepository extends MongoRepository<FarmerProfile, String> {
    Optional<FarmerProfile> findByUserId(String userId);

    boolean existsByAadharNumber(String aadharNumber);
}
