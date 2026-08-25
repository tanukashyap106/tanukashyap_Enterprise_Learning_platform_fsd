package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.AssessmentResult;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.AssessmentResultRepository;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentResultController {

    private final AssessmentResultRepository assessmentResultRepository;
    private final UserRepository userRepository;

    public AssessmentResultController(AssessmentResultRepository assessmentResultRepository, UserRepository userRepository) {
        this.assessmentResultRepository = assessmentResultRepository;
        this.userRepository = userRepository;
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
    public ResponseEntity<Map<String, Object>> getMyResults() {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<AssessmentResult> results = assessmentResultRepository.findByUserEmailOrderByCreatedAtDesc(user.getEmail());
        response.put("success", true);
        response.put("results", results);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitResult(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String quizId = (String) body.get("quizId");
        String quizTitle = (String) body.get("quizTitle");
        Integer score = (Integer) body.get("score");
        Integer totalQuestions = (Integer) body.get("totalQuestions");

        if (quizId == null || quizTitle == null || score == null || totalQuestions == null) {
            response.put("success", false);
            response.put("message", "Missing quiz submit fields");
            return ResponseEntity.badRequest().body(response);
        }

        AssessmentResult result = new AssessmentResult();
        result.setQuizId(quizId);
        result.setQuizTitle(quizTitle);
        result.setScore(score);
        result.setTotalQuestions(totalQuestions);
        result.setUserEmail(user.getEmail());

        assessmentResultRepository.save(result);

        response.put("success", true);
        response.put("result", result);
        return ResponseEntity.ok(response);
    }
}
