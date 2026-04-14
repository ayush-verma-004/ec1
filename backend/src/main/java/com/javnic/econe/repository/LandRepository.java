package com.javnic.econe.repository;

import com.javnic.econe.entity.Land;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LandRepository extends MongoRepository<Land, String> {
    List<Land> findByFarmerId(String farmerId);
}
