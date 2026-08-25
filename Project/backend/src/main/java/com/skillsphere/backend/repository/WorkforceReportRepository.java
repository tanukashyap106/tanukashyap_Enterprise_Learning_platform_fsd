package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.WorkforceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkforceReportRepository extends JpaRepository<WorkforceReport, Long> {
}
