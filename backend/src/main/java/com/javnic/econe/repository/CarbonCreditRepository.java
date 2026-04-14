package com.javnic.econe.repository;

import com.javnic.econe.entity.CarbonCredit;
import com.javnic.econe.enums.CarbonCreditStatus;
import com.javnic.econe.enums.VerificationLevel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CarbonCreditRepository extends MongoRepository<CarbonCredit, String> {

    // Find by farmer
    List<CarbonCredit> findByFarmerId(String farmerId);

    // Find by land
    List<CarbonCredit> findByLandId(String landId);

    // Find by status
    List<CarbonCredit> findByStatus(CarbonCreditStatus status);

    // Find by verification level
    List<CarbonCredit> findByVerificationLevel(VerificationLevel level);

    // Find credits pending NGO verification
    List<CarbonCredit> findByStatusAndNgoId(CarbonCreditStatus status, String ngoId);

    // Find credits pending Government verification
    @Query("{ 'status': ?0 }")
    List<CarbonCredit> findByStatusForGovernment(CarbonCreditStatus status);

    // Find active credits listed for sale
    @Query("{ 'isListedForSale': true, 'status': 'ACTIVE', 'isSold': false }")
    List<CarbonCredit> findActiveListedCredits();

    // Find credits by current owner
    List<CarbonCredit> findByCurrentOwnerId(String ownerId);

    // Find credits expiring soon
    @Query("{ 'validUntil': { $lt: ?0, $gt: ?1 }, 'status': 'ACTIVE' }")
    List<CarbonCredit> findCreditsExpiringSoon(LocalDateTime before, LocalDateTime after);

    // Find sold credits
    @Query("{ 'isSold': true, 'sellerId': ?0 }")
    List<CarbonCredit> findSoldCreditsBySeller(String sellerId);

    // Find purchased credits
    @Query("{ 'isSold': true, 'currentOwnerId': ?0 }")
    List<CarbonCredit> findPurchasedCreditsByBuyer(String buyerId);

    // Statistics queries
    @Query(value = "{ 'farmerId': ?0, 'status': 'ACTIVE' }", count = true)
    Long countActiveCreditsByFarmer(String farmerId);

    @Query(value = "{ 'status': 'ACTIVE', 'isListedForSale': true }", count = true)
    Long countActiveMarketplaceListings();
}