package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.UserCodeArena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCodeArenaRepository extends JpaRepository<UserCodeArena, Long> {
    List<UserCodeArena> findByUserId(Long userId);
    Optional<UserCodeArena> findByUserIdAndProblemId(Long userId, Long problemId);
}
