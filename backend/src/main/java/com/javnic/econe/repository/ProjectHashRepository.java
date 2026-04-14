package com.javnic.econe.repository;

import com.javnic.econe.entity.ProjectHashDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectHashRepository extends MongoRepository<ProjectHashDocument, String> {
    Optional<ProjectHashDocument> findByProjectId(String projectId);
}
