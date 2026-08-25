package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.StudyBuddyMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface StudyBuddyMessageRepository extends JpaRepository<StudyBuddyMessage, Long> {
    List<StudyBuddyMessage> findByUserIdOrderByIdAsc(Long userId);
    
    @Transactional
    void deleteByUserId(Long userId);
}
