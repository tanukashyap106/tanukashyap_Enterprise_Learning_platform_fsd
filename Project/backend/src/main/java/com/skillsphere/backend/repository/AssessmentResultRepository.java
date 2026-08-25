package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
    List<AssessmentResult> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
