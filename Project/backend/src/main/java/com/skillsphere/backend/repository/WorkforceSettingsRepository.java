package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.WorkforceSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkforceSettingsRepository extends JpaRepository<WorkforceSettings, Long> {
}
