package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.WorkforceAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkforceAssessmentRepository extends JpaRepository<WorkforceAssessment, Long> {
}
