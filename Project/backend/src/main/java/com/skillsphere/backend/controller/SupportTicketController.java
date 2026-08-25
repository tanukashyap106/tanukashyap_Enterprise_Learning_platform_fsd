package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.SupportTicket;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.SupportTicketRepository;
import com.skillsphere.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tickets")
public class SupportTicketController {

    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;

    public SupportTicketController(SupportTicketRepository supportTicketRepository, UserRepository userRepository) {
        this.supportTicketRepository = supportTicketRepository;
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
    public ResponseEntity<Map<String, Object>> getMyTickets() {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<SupportTicket> tickets = supportTicketRepository.findByUserEmailOrderByCreatedAtDesc(user.getEmail());
        response.put("success", true);
        response.put("tickets", tickets);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createTicket(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        User user = getAuthenticatedUser();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String subject = body.get("subject");
        String category = body.get("category");
        if (subject == null || category == null) {
            response.put("success", false);
            response.put("message", "Missing subject or category");
            return ResponseEntity.badRequest().body(response);
        }

        SupportTicket ticket = new SupportTicket();
        ticket.setTicketId("T-" + (1000 + new Random().nextInt(9000)));
        ticket.setSubject(subject);
        ticket.setCategory(category);
        ticket.setStatus("Open");
        ticket.setUserEmail(user.getEmail());

        supportTicketRepository.save(ticket);

        response.put("success", true);
        response.put("ticket", ticket);
        return ResponseEntity.ok(response);
    }
}
