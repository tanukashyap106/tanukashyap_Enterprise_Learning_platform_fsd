package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "code_arena_problems")
public class CodeArenaProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard

    @Column(name = "xp_val")
    private Integer xpVal;

    @Column(nullable = false)
    private String acceptance;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "starter_code", length = 4000)
    private String starterCode;

    @Column(nullable = false)
    private String topic;

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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getXpVal() {
        return xpVal;
    }

    public void setXpVal(Integer xpVal) {
        this.xpVal = xpVal;
    }

    public String getAcceptance() {
        return acceptance;
    }

    public void setAcceptance(String acceptance) {
        this.acceptance = acceptance;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStarterCode() {
        return starterCode;
    }

    public void setStarterCode(String starterCode) {
        this.starterCode = starterCode;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}
