package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.CourseRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRequestRepository extends JpaRepository<CourseRequest, Long> {
    List<CourseRequest> findByUserId(Long userId);
    List<CourseRequest> findByStatus(String status);
}
