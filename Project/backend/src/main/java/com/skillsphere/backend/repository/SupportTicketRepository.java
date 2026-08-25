package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
