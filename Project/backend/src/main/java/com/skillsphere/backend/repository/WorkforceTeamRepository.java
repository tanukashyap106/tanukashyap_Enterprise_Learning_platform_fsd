package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.WorkforceTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkforceTeamRepository extends JpaRepository<WorkforceTeam, Long> {
}
