package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.StudyBuddyMessage;
import com.skillsphere.backend.repository.StudyBuddyMessageRepository;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class StudyBuddyController {

    private final StudyBuddyMessageRepository messageRepository;
    private final UserRepository userRepository;

    public StudyBuddyController(StudyBuddyMessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
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

    @GetMapping("/messages")
    public ResponseEntity<Map<String, Object>> getMessages() {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<StudyBuddyMessage> messages = messageRepository.findByUserIdOrderByIdAsc(user.getId());
        response.put("success", true);
        response.put("messages", messages);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/messages")
    public ResponseEntity<Map<String, Object>> saveMessage(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String sender = (String) body.get("sender");
        String text = (String) body.get("text");
        String time = (String) body.get("time");
        String type = (String) body.get("type");
        String title = (String) body.get("title");
        String intro = (String) body.get("intro");
        String howItWorks = null;
        String codeSnippet = null;

        if (body.get("howItWorks") instanceof List) {
            try {
                List<?> list = (List<?>) body.get("howItWorks");
                howItWorks = String.join("\n", list.stream().map(Object::toString).toArray(String[]::new));
            } catch (Exception e) {}
        } else if (body.get("howItWorks") instanceof String) {
            howItWorks = (String) body.get("howItWorks");
        }

        if (body.get("codeSnippet") != null) {
            codeSnippet = (String) body.get("codeSnippet");
        }

        if (sender == null || time == null) {
            response.put("success", false);
            response.put("message", "Sender and time are required fields");
            return ResponseEntity.status(400).body(response);
        }

        StudyBuddyMessage msg = new StudyBuddyMessage(
            user.getId(),
            sender,
            text,
            time,
            type,
            title,
            intro,
            howItWorks,
            codeSnippet
        );

        messageRepository.save(msg);
        response.put("success", true);
        response.put("message", msg);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/messages")
    public ResponseEntity<Map<String, Object>> clearMessages() {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        messageRepository.deleteByUserId(user.getId());
        response.put("success", true);
        response.put("message", "Study Buddy message history cleared successfully");
        return ResponseEntity.ok(response);
    }
}
