package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.*;
import com.skillsphere.backend.repository.*;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/workforce")
public class WorkforceController {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final WorkforceMessageRepository workforceMessageRepository;
    private final WorkforceTeamRepository workforceTeamRepository;
    private final WorkforceSurveyRepository workforceSurveyRepository;
    private final WorkforceReportRepository workforceReportRepository;
    private final WorkforceSettingsRepository workforceSettingsRepository;
    private final WorkforceAttendanceRepository workforceAttendanceRepository;
    private final WorkforceAssessmentRepository workforceAssessmentRepository;

    public WorkforceController(
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository,
            LeaveRequestRepository leaveRequestRepository,
            UserRepository userRepository,
            WorkforceMessageRepository workforceMessageRepository,
            WorkforceTeamRepository workforceTeamRepository,
            WorkforceSurveyRepository workforceSurveyRepository,
            WorkforceReportRepository workforceReportRepository,
            WorkforceSettingsRepository workforceSettingsRepository,
            WorkforceAttendanceRepository workforceAttendanceRepository,
            WorkforceAssessmentRepository workforceAssessmentRepository) {
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
        this.workforceMessageRepository = workforceMessageRepository;
        this.workforceTeamRepository = workforceTeamRepository;
        this.workforceSurveyRepository = workforceSurveyRepository;
        this.workforceReportRepository = workforceReportRepository;
        this.workforceSettingsRepository = workforceSettingsRepository;
        this.workforceAttendanceRepository = workforceAttendanceRepository;
        this.workforceAssessmentRepository = workforceAssessmentRepository;
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

    @GetMapping("/employees")
    public ResponseEntity<Map<String, Object>> getAllEmployees() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<Employee> employees = employeeRepository.findAll();
        response.put("success", true);
        response.put("employees", employees);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/employees")
    public ResponseEntity<Map<String, Object>> createEmployee(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String name = (String) body.get("name");
        String role = (String) body.get("role");
        String dept = (String) body.get("dept");
        String status = body.containsKey("status") ? (String) body.get("status") : "Active";
        
        Object scoreObj = body.get("score");
        int score = 85;
        if (scoreObj instanceof Number) {
            score = ((Number) scoreObj).intValue();
        } else if (scoreObj instanceof String) {
            try { score = Integer.parseInt((String) scoreObj); } catch (Exception ignored) {}
        }

        if (name == null || name.trim().isEmpty() || role == null || role.trim().isEmpty() || dept == null || dept.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Name, role, and dept are required");
            return ResponseEntity.status(400).body(response);
        }

        Employee employee = new Employee(name.trim(), role.trim(), dept.trim(), status, score);
        Employee saved = employeeRepository.save(employee);

        response.put("success", true);
        response.put("employee", saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projects")
    public ResponseEntity<Map<String, Object>> getAllProjects() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<Project> projects = projectRepository.findAll();
        response.put("success", true);
        response.put("projects", projects);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/projects")
    public ResponseEntity<Map<String, Object>> createProject(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String title = (String) body.get("title");
        String assignee = (String) body.get("assignee");
        String priority = body.containsKey("priority") ? (String) body.get("priority") : "Medium";
        
        Object progressObj = body.get("progress");
        int progress = 10;
        if (progressObj instanceof Number) {
            progress = ((Number) progressObj).intValue();
        } else if (progressObj instanceof String) {
            try { progress = Integer.parseInt((String) progressObj); } catch (Exception ignored) {}
        }

        if (title == null || title.trim().isEmpty() || assignee == null || assignee.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Title and assignee are required");
            return ResponseEntity.status(400).body(response);
        }

        Project project = new Project(title.trim(), assignee.trim(), progress, priority);
        Project saved = projectRepository.save(project);

        response.put("success", true);
        response.put("project", saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/leaves")
    public ResponseEntity<Map<String, Object>> getAllLeaves() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        List<LeaveRequest> leaves = leaveRequestRepository.findAll();
        response.put("success", true);
        response.put("leaveRequests", leaves);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/leaves/{id}/decision")
    public ResponseEntity<Map<String, Object>> handleLeaveDecision(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String decision = body.get("decision"); // "APPROVED" or "REJECTED"
        if (decision == null || (!decision.equals("APPROVED") && !decision.equals("REJECTED"))) {
            response.put("success", false);
            response.put("message", "Decision must be either APPROVED or REJECTED");
            return ResponseEntity.status(400).body(response);
        }

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id).orElse(null);
        if (leaveRequest == null) {
            response.put("success", false);
            response.put("message", "Leave request not found");
            return ResponseEntity.status(404).body(response);
        }

        leaveRequest.setStatus(decision);
        leaveRequestRepository.save(leaveRequest);

        // If approved, update matching employee's status to "On Leave"
        if (decision.equals("APPROVED")) {
            Optional<Employee> empOpt = employeeRepository.findByName(leaveRequest.getName());
            if (empOpt.isPresent()) {
                Employee employee = empOpt.get();
                employee.setStatus("On Leave");
                employeeRepository.save(employee);
            }
        }

        response.put("success", true);
        response.put("message", "Leave decision processed successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/leaves")
    public ResponseEntity<Map<String, Object>> submitLeaveRequest(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String employeeName = (String) body.get("employeeName");
        String employeeEmail = (String) body.get("employeeEmail");
        String role = (String) body.get("role");
        String dept = (String) body.get("dept");
        String leaveType = (String) body.get("leaveType");
        String startDate = (String) body.get("startDate");
        String endDate = (String) body.get("endDate");
        String reason = (String) body.get("reason");
        String empId = (String) body.get("empId");
        String requestDate = (String) body.get("requestDate");
        
        Object daysObj = body.get("days");
        Integer days = 1;
        if (daysObj instanceof Number) {
            days = ((Number) daysObj).intValue();
        } else if (daysObj instanceof String) {
            try { days = Integer.parseInt((String) daysObj); } catch (Exception ignored) {}
        }

        if (employeeName == null || employeeName.trim().isEmpty() || leaveType == null || leaveType.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Employee Name and Leave Type are required");
            return ResponseEntity.status(400).body(response);
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployeeName(employeeName.trim());
        leaveRequest.setEmployeeEmail(employeeEmail != null ? employeeEmail.trim() : null);
        leaveRequest.setRole(role != null ? role.trim() : null);
        leaveRequest.setDept(dept != null ? dept.trim() : null);
        leaveRequest.setLeaveType(leaveType.trim());
        leaveRequest.setStartDate(startDate);
        leaveRequest.setEndDate(endDate);
        leaveRequest.setReason(reason != null ? reason.trim() : null);
        leaveRequest.setEmpId(empId);
        leaveRequest.setRequestDate(requestDate != null ? requestDate : java.time.LocalDate.now().toString());
        leaveRequest.setStatus("PENDING");
        leaveRequest.setDays(days);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        response.put("success", true);
        response.put("leaveRequest", saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/messages")
    public ResponseEntity<Map<String, Object>> getWorkforceMessages() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        if (workforceMessageRepository.count() == 0) {
            workforceMessageRepository.save(new WorkforceMessage("Sophia", "Manager", "Welcome team! Let's utilize this board for daily sync-ups.", "9:00 AM", "S", "purple"));
            workforceMessageRepository.save(new WorkforceMessage("Marcus", "Dev", "Got it. I'll update the project progress here.", "9:15 AM", "M", "blue"));
        }

        response.put("success", true);
        response.put("messages", workforceMessageRepository.findAll());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/messages")
    public ResponseEntity<Map<String, Object>> sendWorkforceMessage(@RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        String text = body.get("text");
        if (text == null || text.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Message text is required");
            return ResponseEntity.status(400).body(response);
        }

        String sender = user.getFullName() != null ? user.getFullName() : user.getUsername();
        String role = user.getRole();
        
        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("hh:mm a");
        String time = java.time.LocalTime.now().format(dtf);
        
        String initial = sender.isEmpty() ? "U" : String.valueOf(sender.charAt(0)).toUpperCase();
        String color = "indigo";

        WorkforceMessage msg = new WorkforceMessage(sender, role, text.trim(), time, initial, color);
        WorkforceMessage saved = workforceMessageRepository.save(msg);

        response.put("success", true);
        response.put("message", saved);
        return ResponseEntity.ok(response);
    }

    // ─── TEAMS ENDPOINTS ─────────────────────────────────────────────────────
    @GetMapping("/teams")
    public ResponseEntity<Map<String, Object>> getTeams() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (workforceTeamRepository.count() == 0) {
            workforceTeamRepository.save(new WorkforceTeam("Product Development", "Building innovative solutions", "Aman Verma", "Engineering", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", 28, "Engineering", "Active"));
            workforceTeamRepository.save(new WorkforceTeam("Marketing Team", "Driving growth & brand", "Sneha Iyer", "Marketing", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", 16, "Marketing", "Active"));
            workforceTeamRepository.save(new WorkforceTeam("Customer Success", "Ensuring client satisfaction", "Riya Sharma", "Operations", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", 24, "Operations", "Active"));
            workforceTeamRepository.save(new WorkforceTeam("Data Analytics", "Data-driven insights", "Vikram Singh", "Data", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", 18, "Data Science", "Active"));
            workforceTeamRepository.save(new WorkforceTeam("HR Team", "People & Culture", "Neha Patel", "Human Resources", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", 12, "Human Resources", "Inactive"));
        }

        response.put("success", true);
        response.put("teams", workforceTeamRepository.findAll());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/teams")
    public ResponseEntity<Map<String, Object>> createTeam(@RequestBody WorkforceTeam team) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (team.getName() == null || team.getName().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Team name is required");
            return ResponseEntity.status(400).body(response);
        }

        if (team.getStatus() == null) team.setStatus("Active");
        if (team.getMembers() == null) team.setMembers(10);
        if (team.getLeadAvatar() == null || team.getLeadAvatar().trim().isEmpty()) {
            team.setLeadAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80");
        }

        WorkforceTeam saved = workforceTeamRepository.save(team);
        response.put("success", true);
        response.put("team", saved);
        return ResponseEntity.ok(response);
    }

    // ─── SURVEYS / INITIATIVES ENDPOINTS ──────────────────────────────────────
    @GetMapping("/surveys")
    public ResponseEntity<Map<String, Object>> getSurveys() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (workforceSurveyRepository.count() == 0) {
            workforceSurveyRepository.save(new WorkforceSurvey("Employee Satisfaction Survey", "May 2025", "Survey", "412", "72%", "78%", "Good", "Completed"));
            workforceSurveyRepository.save(new WorkforceSurvey("Work-Life Balance Survey", "April 2025", "Survey", "398", "68%", "72%", "Good", "Completed"));
            workforceSurveyRepository.save(new WorkforceSurvey("Recognition Program", "Q2 2025", "Initiative", "—", "—", "85%", "Excellent", "Ongoing"));
            workforceSurveyRepository.save(new WorkforceSurvey("Team Engagement Pulse", "Weekly", "Survey", "210", "85%", "80%", "Excellent", "Active"));
            workforceSurveyRepository.save(new WorkforceSurvey("Leadership Feedback", "April 2025", "Survey", "186", "60%", "65%", "Average", "Completed"));
        }

        response.put("success", true);
        response.put("surveys", workforceSurveyRepository.findAll());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/surveys")
    public ResponseEntity<Map<String, Object>> createSurvey(@RequestBody WorkforceSurvey survey) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (survey.getTitle() == null || survey.getTitle().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Survey title is required");
            return ResponseEntity.status(400).body(response);
        }

        if (survey.getStatus() == null) survey.setStatus("Active");
        if (survey.getParticipants() == null) survey.setParticipants("0");
        if (survey.getResponseRate() == null) survey.setResponseRate("0%");
        if (survey.getScore() == null) survey.setScore("80%");
        if (survey.getScoreLbl() == null) survey.setScoreLbl("Good");

        WorkforceSurvey saved = workforceSurveyRepository.save(survey);
        response.put("success", true);
        response.put("survey", saved);
        return ResponseEntity.ok(response);
    }

    // ─── REPORTS ENDPOINTS ───────────────────────────────────────────────────
    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (workforceReportRepository.count() == 0) {
            workforceReportRepository.save(new WorkforceReport("Workforce Skill Competency Matrix", "Skills", "Monthly", "24 May 2025", "PDF / Excel", "pdf", "Ready"));
            workforceReportRepository.save(new WorkforceReport("Quarterly Performance & Review Summary", "Performance", "Quarterly", "20 May 2025", "PDF", "pdf", "Ready"));
            workforceReportRepository.save(new WorkforceReport("Monthly Attendance & Punctuality Log", "Attendance", "Monthly", "01 May 2025", "CSV / Excel", "csv", "Ready"));
            workforceReportRepository.save(new WorkforceReport("Employee Engagement & Culture Score", "Engagement", "Weekly", "25 May 2025", "PDF", "pdf", "Ready"));
            workforceReportRepository.save(new WorkforceReport("Training ROI & Skill Completion Report", "Learning", "Monthly", "15 May 2025", "Excel", "excel", "Ready"));
            workforceReportRepository.save(new WorkforceReport("Departmental Productivity Benchmark", "Analytics", "Bi-Weekly", "22 May 2025", "PDF", "pdf", "Ready"));
        }

        response.put("success", true);
        response.put("reports", workforceReportRepository.findAll());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reports")
    public ResponseEntity<Map<String, Object>> createReport(@RequestBody WorkforceReport report) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (report.getTitle() == null || report.getTitle().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Report title is required");
            return ResponseEntity.status(400).body(response);
        }

        if (report.getLastGen() == null) report.setLastGen("Just Now");
        if (report.getStatus() == null) report.setStatus("Ready");
        if (report.getFormatType() == null) {
            report.setFormatType(report.getFormat().toLowerCase().contains("pdf") ? "pdf" : "excel");
        }

        WorkforceReport saved = workforceReportRepository.save(report);
        response.put("success", true);
        response.put("report", saved);
        return ResponseEntity.ok(response);
    }

    // ─── SETTINGS ENDPOINTS ──────────────────────────────────────────────────
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        WorkforceSettings settings = workforceSettingsRepository.findById(1L).orElse(null);
        if (settings == null) {
            settings = new WorkforceSettings(
                "SkillSphere Workforce Global",
                "skillsphere.app/org/global-workforce",
                "(UTC+05:30) India Standard Time (IST)",
                "USD ($)",
                "arjun.mehta@skillsphere.app",
                "April",
                true, true, "90 Days",
                "192.168.1.0/24, 10.0.0.0/16",
                "30 Minutes",
                true, true, true, true,
                "https://api.skillsphere.app/v1/webhooks/workforce-events"
            );
            settings = workforceSettingsRepository.save(settings);
        }

        response.put("success", true);
        response.put("settings", settings);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody WorkforceSettings updated) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        WorkforceSettings existing = workforceSettingsRepository.findById(1L).orElse(null);
        if (existing == null) {
            existing = new WorkforceSettings();
        }

        existing.setCompanyName(updated.getCompanyName());
        existing.setCompanySlug(updated.getCompanySlug());
        existing.setTimezone(updated.getTimezone());
        existing.setCurrency(updated.getCurrency());
        existing.setAdminEmail(updated.getAdminEmail());
        existing.setFiscalStart(updated.getFiscalStart());
        existing.setEnforce2FA(updated.getEnforce2FA());
        existing.setEnforceSSO(updated.getEnforceSSO());
        existing.setPasswordRotation(updated.getPasswordRotation());
        existing.setIpWhitelist(updated.getIpWhitelist());
        existing.setSessionTimeout(updated.getSessionTimeout());
        existing.setEmailNotifications(updated.getEmailNotifications());
        existing.setSlackAlerts(updated.getSlackAlerts());
        existing.setReviewReminders(updated.getReviewReminders());
        existing.setAssessmentReminders(updated.getAssessmentReminders());
        existing.setWebhookUrl(updated.getWebhookUrl());

        WorkforceSettings saved = workforceSettingsRepository.save(existing);
        response.put("success", true);
        response.put("settings", saved);
        return ResponseEntity.ok(response);
    }

    // ─── ATTENDANCE ENDPOINTS ────────────────────────────────────────────────
    @GetMapping("/attendance")
    public ResponseEntity<Map<String, Object>> getAttendance() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (workforceAttendanceRepository.count() == 0) {
            workforceAttendanceRepository.save(new WorkforceAttendance("EMP001", "Aman Verma", "Engineering", "Present", "09:05 AM", "06:12 PM", "09h 07m", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"));
            workforceAttendanceRepository.save(new WorkforceAttendance("EMP002", "Sneha Iyer", "Marketing", "Present", "09:00 AM", "05:58 PM", "08h 58m", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"));
            workforceAttendanceRepository.save(new WorkforceAttendance("EMP003", "Riya Sharma", "Operations", "On Leave", "—", "—", "—", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"));
            workforceAttendanceRepository.save(new WorkforceAttendance("EMP004", "Vikram Singh", "Data Science", "Late", "09:45 AM", "06:10 PM", "08h 25m", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"));
            workforceAttendanceRepository.save(new WorkforceAttendance("EMP005", "Neha Patel", "Human Resources", "Absent", "—", "—", "—", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"));
        }

        response.put("success", true);
        response.put("attendance", workforceAttendanceRepository.findAll());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/attendance")
    public ResponseEntity<Map<String, Object>> saveAttendance(@RequestBody WorkforceAttendance attendance) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (attendance.getName() == null || attendance.getName().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Employee Name is required");
            return ResponseEntity.status(400).body(response);
        }

        if (attendance.getEmpId() == null) attendance.setEmpId("EMP" + (100 + workforceAttendanceRepository.count()));
        if (attendance.getStatus() == null) attendance.setStatus("Present");
        if (attendance.getCheckIn() == null) attendance.setCheckIn("09:00 AM");
        if (attendance.getCheckOut() == null) attendance.setCheckOut("06:00 PM");
        if (attendance.getWorkHours() == null) attendance.setWorkHours("09h 00m");
        if (attendance.getAvatar() == null) attendance.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80");

        WorkforceAttendance saved = workforceAttendanceRepository.save(attendance);
        response.put("success", true);
        response.put("attendance", saved);
        return ResponseEntity.ok(response);
    }

    // ─── ASSESSMENTS ENDPOINTS ───────────────────────────────────────────────
    @GetMapping("/assessments")
    public ResponseEntity<Map<String, Object>> getAssessments() {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (workforceAssessmentRepository.count() == 0) {
            workforceAssessmentRepository.save(new WorkforceAssessment("Java Programming Assessment", "Technical", "Completed", 120, "82%", "94%", "#fae8de", "FaCode"));
            workforceAssessmentRepository.save(new WorkforceAssessment("Leadership Skills Evaluation", "Behavioral", "Completed", 95, "76%", "89%", "#faf0e6", "FaUsers"));
            workforceAssessmentRepository.save(new WorkforceAssessment("Data Analysis Test", "Technical", "In Progress", 64, "68%", "81%", "#f3e8f8", "FaChartBar"));
            workforceAssessmentRepository.save(new WorkforceAssessment("Communication Skills Test", "Behavioral", "Not Started", 48, "-", "-", "#fef7e0", "FaComments"));
        }

        response.put("success", true);
        response.put("assessments", workforceAssessmentRepository.findAll());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assessments")
    public ResponseEntity<Map<String, Object>> saveAssessment(@RequestBody WorkforceAssessment assessment) {
        User user = getAuthenticatedUser();
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            return ResponseEntity.status(401).body(response);
        }

        if (assessment.getTitle() == null || assessment.getTitle().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Assessment title is required");
            return ResponseEntity.status(400).body(response);
        }

        if (assessment.getCategory() == null) assessment.setCategory("Technical");
        if (assessment.getStatus() == null) assessment.setStatus("Active");
        if (assessment.getParticipants() == null) assessment.setParticipants(0);
        if (assessment.getScore() == null) assessment.setScore("-");
        if (assessment.getPassRate() == null) assessment.setPassRate("-");
        if (assessment.getIconBg() == null) assessment.setIconBg("#fae8de");
        if (assessment.getIconName() == null) assessment.setIconName("FaCode");

        WorkforceAssessment saved = workforceAssessmentRepository.save(assessment);
        response.put("success", true);
        response.put("assessment", saved);
        return ResponseEntity.ok(response);
    }
}
