package com.skillsphere.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "placements")
public class PlacementRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(nullable = false)
    private String company;

    @Column(name = "package_amount", nullable = false)
    private Double packageAmount; // LPA or Dollars

    @Column(nullable = false)
    private String type = "Full-time"; // Full-time, Internship

    @Column(nullable = false)
    private String status = "Placed"; // Placed, Offered, Interviewing

    @Column(name = "interview_rating", nullable = false)
    private Double interviewRating = 4.0;

    @Column(name = "placed_at", nullable = false)
    private LocalDateTime placedAt = LocalDateTime.now();

    public PlacementRecord() {}

    public PlacementRecord(String studentName, String studentEmail, String company, Double packageAmount, String type, String status, Double interviewRating) {
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.company = company;
        this.packageAmount = packageAmount;
        this.type = type;
        this.status = status;
        this.interviewRating = interviewRating;
        this.placedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Double getPackageAmount() {
        return packageAmount;
    }

    public void setPackageAmount(Double packageAmount) {
        this.packageAmount = packageAmount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getInterviewRating() {
        return interviewRating;
    }

    public void setInterviewRating(Double interviewRating) {
        this.interviewRating = interviewRating;
    }

    public LocalDateTime getPlacedAt() {
        return placedAt;
    }

    public void setPlacedAt(LocalDateTime placedAt) {
        this.placedAt = placedAt;
    }
}
