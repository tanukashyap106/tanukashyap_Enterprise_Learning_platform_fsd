package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "trainers")
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private Double rating = 4.5;

    @Column(name = "sessions_conducted", nullable = false)
    private Integer sessionsConducted = 0;

    @Column(name = "feedback_score", nullable = false)
    private Double feedbackScore = 4.5;

    @Column(nullable = false)
    private String status = "Active"; // Active, Inactive

    public Trainer() {}

    public Trainer(String name, String email, Double rating, Integer sessionsConducted, Double feedbackScore, String status) {
        this.name = name;
        this.email = email;
        this.rating = rating;
        this.sessionsConducted = sessionsConducted;
        this.feedbackScore = feedbackScore;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getSessionsConducted() {
        return sessionsConducted;
    }

    public void setSessionsConducted(Integer sessionsConducted) {
        this.sessionsConducted = sessionsConducted;
    }

    public Double getFeedbackScore() {
        return feedbackScore;
    }

    public void setFeedbackScore(Double feedbackScore) {
        this.feedbackScore = feedbackScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
