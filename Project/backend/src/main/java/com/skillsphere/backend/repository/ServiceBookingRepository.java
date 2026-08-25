package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.ServiceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {
    List<ServiceBooking> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
