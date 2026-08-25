package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.PlacementRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementRecordRepository extends JpaRepository<PlacementRecord, Long> {
    List<PlacementRecord> findByStatus(String status);
    
    @Query("SELECT MAX(p.packageAmount) FROM PlacementRecord p WHERE p.status = 'Placed'")
    Double findMaxPackage();

    @Query("SELECT AVG(p.packageAmount) FROM PlacementRecord p WHERE p.status = 'Placed'")
    Double findAvgPackage();
}
