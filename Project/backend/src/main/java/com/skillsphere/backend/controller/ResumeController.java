package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.Resume;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.ResumeRepository;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;

    public ResumeController(UserRepository userRepository, ResumeRepository resumeRepository) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
    }

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Claims)) {
            return null;
        }
        Claims claims = (Claims) principal;
        Long userId = Long.parseLong(claims.getSubject());
        return userRepository.findById(userId).orElse(null);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getResume() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Optional<Resume> resumeOpt = resumeRepository.findByUserId(user.getId());
        if (resumeOpt.isPresent()) {
            Resume resume = resumeOpt.get();
            response.put("success", true);
            response.put("selectedTemplate", resume.getSelectedTemplate());
            response.put("content", resume.getContent());
            response.put("updatedAt", resume.getUpdatedAt());
        } else {
            response.put("success", false);
            response.put("message", "No resume found");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveResume(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String selectedTemplate = body.getOrDefault("selectedTemplate", "modern").toString();
        String content = body.getOrDefault("content", "").toString();

        Optional<Resume> resumeOpt = resumeRepository.findByUserId(user.getId());
        Resume resume;
        if (resumeOpt.isPresent()) {
            resume = resumeOpt.get();
        } else {
            resume = new Resume();
            resume.setUserId(user.getId());
        }

        resume.setSelectedTemplate(selectedTemplate);
        resume.setContent(content);
        resume.setUpdatedAt(LocalDateTime.now());
        resumeRepository.save(resume);

        response.put("success", true);
        response.put("message", "Resume saved successfully");
        return ResponseEntity.ok(response);
    }
}
