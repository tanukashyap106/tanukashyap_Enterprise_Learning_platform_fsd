package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.WorkforceSurvey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkforceSurveyRepository extends JpaRepository<WorkforceSurvey, Long> {
}
