package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.UserAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAssignmentRepository extends JpaRepository<UserAssignment, Long> {
    List<UserAssignment> findByUserId(Long userId);
    Optional<UserAssignment> findByUserIdAndAssignmentId(Long userId, Long assignmentId);
}
