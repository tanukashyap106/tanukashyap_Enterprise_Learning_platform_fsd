package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.CodeArenaProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodeArenaProblemRepository extends JpaRepository<CodeArenaProblem, Long> {
    Optional<CodeArenaProblem> findByTitle(String title);
}
