package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workforce_assessments")
public class WorkforceAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String category;
    private String status;
    private Integer participants;
    private String score;

    @Column(name = "pass_rate")
    private String passRate;

    @Column(name = "icon_bg")
    private String iconBg;

    @Column(name = "icon_name")
    private String iconName;

    public WorkforceAssessment() {}

    public WorkforceAssessment(String title, String category, String status, Integer participants, String score, String passRate, String iconBg, String iconName) {
        this.title = title;
        this.category = category;
        this.status = status;
        this.participants = participants;
        this.score = score;
        this.passRate = passRate;
        this.iconBg = iconBg;
        this.iconName = iconName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getParticipants() {
        return participants;
    }

    public void setParticipants(Integer participants) {
        this.participants = participants;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getPassRate() {
        return passRate;
    }

    public void setPassRate(String passRate) {
        this.passRate = passRate;
    }

    public String getIconBg() {
        return iconBg;
    }

    public void setIconBg(String iconBg) {
        this.iconBg = iconBg;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }
}
