package com.javnic.econe.repository;

import com.javnic.econe.entity.BusinessmanProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessmanProfileRepository extends MongoRepository<BusinessmanProfile, String> {
    Optional<BusinessmanProfile> findByUserId(String userId);

    boolean existsByGstNumber(String gstNumber);

    boolean existsByPanNumber(String panNumber);
}

