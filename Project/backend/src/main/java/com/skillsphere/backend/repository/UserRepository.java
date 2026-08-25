package com.skillsphere.backend.repository;

import com.skillsphere.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
    java.util.List<User> findTop10ByRoleOrderByXpDesc(String role);

    @org.springframework.data.jpa.repository.Query("SELECT count(u) FROM User u WHERE u.xp > ?1")
    long countByXpGreaterThan(Integer xp);

    @org.springframework.data.jpa.repository.Query("SELECT count(u) FROM User u WHERE u.xp > ?1 AND u.college = ?2")
    long countByXpGreaterThanAndCollege(Integer xp, String college);

    @org.springframework.data.jpa.repository.Query("SELECT count(u) FROM User u WHERE u.xp > ?1 AND u.branch = ?2")
    long countByXpGreaterThanAndBranch(Integer xp, String branch);
}
