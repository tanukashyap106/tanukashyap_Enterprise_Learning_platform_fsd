package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(String courseId);
    List<Assignment> findByCourseKey(String courseKey);
}
