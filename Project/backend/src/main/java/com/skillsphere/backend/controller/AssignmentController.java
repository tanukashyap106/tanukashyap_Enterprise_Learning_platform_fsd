package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.Assignment;
import com.skillsphere.backend.model.UserAssignment;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.AssignmentRepository;
import com.skillsphere.backend.repository.UserAssignmentRepository;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentRepository assignmentRepository;
    private final UserAssignmentRepository userAssignmentRepository;
    private final UserRepository userRepository;

    public AssignmentController(AssignmentRepository assignmentRepository,
                                UserAssignmentRepository userAssignmentRepository,
                                UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.userAssignmentRepository = userAssignmentRepository;
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
    public ResponseEntity<Map<String, Object>> getAssignments() {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<Assignment> allAssignments = assignmentRepository.findAll();
        List<UserAssignment> userSubmissions = userAssignmentRepository.findByUserId(user.getId());

        // Create a mapping from assignmentId -> UserAssignment
        Map<Long, UserAssignment> submissionsMap = new HashMap<>();
        for (UserAssignment sub : userSubmissions) {
            submissionsMap.put(sub.getAssignmentId(), sub);
        }

        List<Map<String, Object>> mergedList = new ArrayList<>();
        for (Assignment asg : allAssignments) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", asg.getId());
            item.put("title", asg.getTitle());
            item.put("badgeType", asg.getBadgeType());
            item.put("course", asg.getCourse());
            item.put("courseKey", asg.getCourseKey());
            item.put("courseId", asg.getCourseId());
            item.put("description", asg.getDescription());
            item.put("difficulty", asg.getDifficulty());
            item.put("xpReward", asg.getXpReward());
            item.put("mode", asg.getMode());
            item.put("dueDateText", asg.getDueDateText());
            item.put("dueDateFull", asg.getDueDateFull());
            item.put("logoText", asg.getLogoText());
            item.put("logoBg", asg.getLogoBg());
            item.put("logoColor", asg.getLogoColor());

            // Determine status based on user enrollment and submissions
            String status = "pending";
            String submissionUrl = "";
            String videoUrl = "";
            String comments = "";
            String submittedAt = "";
            String grade = "";
            String feedback = "";

            // Check if course is enrolled
            boolean isEnrolled = false;
            if (user.getEnrolledCourses() != null && !user.getEnrolledCourses().isEmpty()) {
                String[] enrolledList = user.getEnrolledCourses().split(",");
                for (String enc : enrolledList) {
                    if (enc.trim().equals(asg.getCourseId())) {
                        isEnrolled = true;
                        break;
                    }
                }
            }

            if (!isEnrolled) {
                status = "locked";
            }

            if (submissionsMap.containsKey(asg.getId())) {
                UserAssignment sub = submissionsMap.get(asg.getId());
                status = sub.getStatus();
                submissionUrl = sub.getSubmissionUrl() != null ? sub.getSubmissionUrl() : "";
                videoUrl = sub.getVideoUrl() != null ? sub.getVideoUrl() : "";
                comments = sub.getComments() != null ? sub.getComments() : "";
                submittedAt = sub.getSubmittedAt() != null ? sub.getSubmittedAt().toString() : "";
                grade = sub.getGrade() != null ? sub.getGrade() : "";
                feedback = sub.getFeedback() != null ? sub.getFeedback() : "";
            }

            item.put("status", status);
            item.put("submissionUrl", submissionUrl);
            item.put("videoUrl", videoUrl);
            item.put("comments", comments);
            item.put("submittedAt", submittedAt);
            item.put("grade", grade);
            item.put("feedback", feedback);

            mergedList.add(item);
        }

        response.put("success", true);
        response.put("assignments", mergedList);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitAssignment(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String assignmentIdStr = request.get("assignmentId");
        String submissionUrl = request.get("submissionUrl");
        String videoUrl = request.get("videoUrl");
        String comments = request.get("comments");

        if (assignmentIdStr == null || submissionUrl == null || submissionUrl.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Assignment ID and Submission URL are required");
            return ResponseEntity.badRequest().body(response);
        }

        Long assignmentId = Long.parseLong(assignmentIdStr);
        Optional<Assignment> asgOpt = assignmentRepository.findById(assignmentId);
        if (asgOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Assignment not found");
            return ResponseEntity.notFound().build();
        }

        Assignment asg = asgOpt.get();

        // Save or update user submission
        UserAssignment userAsg = userAssignmentRepository.findByUserIdAndAssignmentId(user.getId(), assignmentId)
                .orElse(new UserAssignment(user.getId(), assignmentId, "submitted"));

        userAsg.setStatus("submitted");
        userAsg.setSubmissionUrl(submissionUrl);
        userAsg.setVideoUrl(videoUrl);
        userAsg.setComments(comments);
        userAsg.setSubmittedAt(LocalDateTime.now());
        userAssignmentRepository.save(userAsg);

        // Award XP to student
        int xpReward = 100;
        try {
            String cleanXp = asg.getXpReward().replaceAll("[^0-9]", "");
            if (!cleanXp.isEmpty()) {
                xpReward = Integer.parseInt(cleanXp);
            }
        } catch (Exception e) {
            // fallback
        }

        user.setXp((user.getXp() != null ? user.getXp() : 0) + xpReward);
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Assignment submitted successfully!");
        response.put("xpEarned", xpReward);
        response.put("xp", user.getXp());
        return ResponseEntity.ok(response);
    }
}
