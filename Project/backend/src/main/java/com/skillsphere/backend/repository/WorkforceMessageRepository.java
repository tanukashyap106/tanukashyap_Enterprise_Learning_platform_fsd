package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.WorkforceMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkforceMessageRepository extends JpaRepository<WorkforceMessage, Long> {
}
