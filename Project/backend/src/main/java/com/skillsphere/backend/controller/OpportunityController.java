package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.Opportunity;
import com.skillsphere.backend.repository.OpportunityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityRepository opportunityRepository;

    public OpportunityController(OpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOpportunities() {
        Map<String, Object> response = new HashMap<>();
        List<Opportunity> opportunities = opportunityRepository.findAll();
        response.put("success", true);
        response.put("opportunities", opportunities);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOpportunityById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Optional<Opportunity> opp = opportunityRepository.findById(id);
        if (opp.isPresent()) {
            response.put("success", true);
            response.put("opportunity", opp.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Opportunity not found");
            return ResponseEntity.status(404).body(response);
        }
    }
}
