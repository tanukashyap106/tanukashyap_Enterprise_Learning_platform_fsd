package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.CodeArenaProblem;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.model.UserCodeArena;
import com.skillsphere.backend.repository.CodeArenaProblemRepository;
import com.skillsphere.backend.repository.UserRepository;
import com.skillsphere.backend.repository.UserCodeArenaRepository;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/codearena")
public class CodeArenaController {

    private final UserRepository userRepository;
    private final CodeArenaProblemRepository problemRepository;
    private final UserCodeArenaRepository userCodeRepository;

    public CodeArenaController(
            UserRepository userRepository,
            CodeArenaProblemRepository problemRepository,
            UserCodeArenaRepository userCodeRepository) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.userCodeRepository = userCodeRepository;
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

    @GetMapping("/problems")
    public ResponseEntity<Map<String, Object>> getProblems() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<CodeArenaProblem> problemsList = problemRepository.findAll();
        List<UserCodeArena> userSubmissions = userCodeRepository.findByUserId(user.getId());

        Map<Long, UserCodeArena> submissionMap = new HashMap<>();
        for (UserCodeArena sub : userSubmissions) {
            submissionMap.put(sub.getProblemId(), sub);
        }

        List<Map<String, Object>> mappedProblems = new ArrayList<>();
        for (CodeArenaProblem prob : problemsList) {
            Map<String, Object> probMap = new HashMap<>();
            probMap.put("id", prob.getId());
            probMap.put("title", prob.getTitle());
            probMap.put("company", prob.getCompany());
            probMap.put("difficulty", prob.getDifficulty());
            probMap.put("xpVal", "+" + prob.getXpVal() + " XP");
            probMap.put("acceptance", prob.getAcceptance());
            probMap.put("desc", prob.getDescription());
            probMap.put("starterCode", prob.getStarterCode());
            probMap.put("topic", prob.getTopic());

            UserCodeArena sub = submissionMap.get(prob.getId());
            probMap.put("solved", sub != null && "solved".equals(sub.getStatus()));
            probMap.put("bookmarked", sub != null && sub.getIsBookmarked());
            probMap.put("userCode", sub != null ? sub.getSubmittedCode() : "");

            mappedProblems.add(probMap);
        }

        long globalRank = userRepository.countByXpGreaterThan(user.getXp()) + 1;
        long collegeRank = 18;
        if (user.getCollege() != null && !user.getCollege().trim().isEmpty()) {
            collegeRank = userRepository.countByXpGreaterThanAndCollege(user.getXp(), user.getCollege()) + 1;
        }
        long friendsRank = 2;
        if (user.getBranch() != null && !user.getBranch().trim().isEmpty()) {
            friendsRank = userRepository.countByXpGreaterThanAndBranch(user.getXp(), user.getBranch()) + 1;
        }

        response.put("success", true);
        response.put("problems", mappedProblems);
        response.put("globalRank", globalRank);
        response.put("collegeRank", collegeRank);
        response.put("friendsRank", friendsRank);
        response.put("contestRegistered", user.getContestRegistered());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/contest/register")
    public ResponseEntity<Map<String, Object>> registerContest() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        user.setContestRegistered(true);
        userRepository.save(user);

        response.put("success", true);
        response.put("contestRegistered", true);
        response.put("message", "Registered for CodeSprint 113 Contest!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitProblem(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Long problemId = Long.parseLong(body.get("problemId").toString());
        String code = body.get("code").toString();
        String status = body.getOrDefault("status", "solved").toString();

        Optional<CodeArenaProblem> probOpt = problemRepository.findById(problemId);
        if (probOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Problem not found");
            return ResponseEntity.status(404).body(response);
        }

        CodeArenaProblem problem = probOpt.get();

        Optional<UserCodeArena> userSubOpt = userCodeRepository.findByUserIdAndProblemId(user.getId(), problemId);
        UserCodeArena sub;
        boolean firstTimeSolved = false;

        if (userSubOpt.isPresent()) {
            sub = userSubOpt.get();
            if (!"solved".equals(sub.getStatus()) && "solved".equals(status)) {
                firstTimeSolved = true;
            }
            sub.setStatus(status);
            sub.setSubmittedCode(code);
            sub.setSolvedAt(LocalDateTime.now());
        } else {
            sub = new UserCodeArena();
            sub.setUserId(user.getId());
            sub.setProblemId(problemId);
            sub.setStatus(status);
            sub.setSubmittedCode(code);
            sub.setIsBookmarked(false);
            sub.setSolvedAt(LocalDateTime.now());
            if ("solved".equals(status)) {
                firstTimeSolved = true;
            }
        }

        userCodeRepository.save(sub);

        if (firstTimeSolved) {
            user.setXp(user.getXp() + problem.getXpVal());
            // Record activity mapping in user's profile
            try {
                String today = java.time.LocalDate.now().toString();
                String actMap = user.getActivityMap();
                if (actMap == null || actMap.isEmpty() || "{}".equals(actMap)) {
                    user.setActivityMap("{\"" + today + "\":1}");
                } else {
                    // Quick parse and increment today's count
                    if (actMap.contains(today)) {
                        int index = actMap.indexOf(today) + today.length() + 2;
                        int end = actMap.indexOf(",", index);
                        if (end == -1) end = actMap.indexOf("}", index);
                        int count = Integer.parseInt(actMap.substring(index, end).trim());
                        user.setActivityMap(actMap.replace("\"" + today + "\":" + count, "\"" + today + "\":" + (count + 1)));
                    } else {
                        user.setActivityMap(actMap.replace("}", ",\"" + today + "\":1}"));
                    }
                }
            } catch (Exception e) {
                // Ignore parsing errors
            }
            userRepository.save(user);
        }

        response.put("success", true);
        response.put("message", "Solution submitted successfully");
        response.put("xp", user.getXp());
        response.put("solved", "solved".equals(sub.getStatus()));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Long problemId = Long.parseLong(body.get("problemId").toString());

        Optional<UserCodeArena> userSubOpt = userCodeRepository.findByUserIdAndProblemId(user.getId(), problemId);
        UserCodeArena sub;
        boolean currentBookmarkState;

        if (userSubOpt.isPresent()) {
            sub = userSubOpt.get();
            currentBookmarkState = !sub.getIsBookmarked();
            sub.setIsBookmarked(currentBookmarkState);
        } else {
            sub = new UserCodeArena();
            sub.setUserId(user.getId());
            sub.setProblemId(problemId);
            sub.setStatus("attempted");
            sub.setSubmittedCode("");
            currentBookmarkState = true;
            sub.setIsBookmarked(currentBookmarkState);
            sub.setSolvedAt(LocalDateTime.now());
        }

        userCodeRepository.save(sub);

        response.put("success", true);
        response.put("bookmarked", currentBookmarkState);
        response.put("message", currentBookmarkState ? "Problem bookmarked" : "Bookmark removed");
        return ResponseEntity.ok(response);
    }
}
