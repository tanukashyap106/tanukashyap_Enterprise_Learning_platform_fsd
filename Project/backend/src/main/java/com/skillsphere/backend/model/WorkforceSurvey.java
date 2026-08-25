package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workforce_surveys")
public class WorkforceSurvey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String date;

    @Column
    private String type; // "Survey" or "Initiative"

    @Column
    private String participants;

    @Column
    private String responseRate;

    @Column
    private String score;

    @Column
    private String scoreLbl;

    @Column
    private String status; // "Active", "Completed", "Ongoing"

    public WorkforceSurvey() {}

    public WorkforceSurvey(String title, String date, String type, String participants, String responseRate, String score, String scoreLbl, String status) {
        this.title = title;
        this.date = date;
        this.type = type;
        this.participants = participants;
        this.responseRate = responseRate;
        this.score = score;
        this.scoreLbl = scoreLbl;
        this.status = status;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getParticipants() {
        return participants;
    }

    public void setParticipants(String participants) {
        this.participants = participants;
    }

    public String getResponseRate() {
        return responseRate;
    }

    public void setResponseRate(String responseRate) {
        this.responseRate = responseRate;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getScoreLbl() {
        return scoreLbl;
    }

    public void setScoreLbl(String scoreLbl) {
        this.scoreLbl = scoreLbl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
