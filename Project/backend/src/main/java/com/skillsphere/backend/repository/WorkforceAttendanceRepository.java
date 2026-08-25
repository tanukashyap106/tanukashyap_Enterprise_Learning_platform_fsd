package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.WorkforceAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkforceAttendanceRepository extends JpaRepository<WorkforceAttendance, Long> {
}
