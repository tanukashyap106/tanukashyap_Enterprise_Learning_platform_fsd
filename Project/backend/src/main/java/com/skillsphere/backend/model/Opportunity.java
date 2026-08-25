package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "opportunities")
public class Opportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String type;
    private String logoText;
    private String logoBg;
    
    @Column(length = 2000)
    private String description;
    
    private String location;
    private String postedTime;

    @Column(name = "posted_at", nullable = false, updatable = false)
    private java.time.LocalDateTime postedAt = java.time.LocalDateTime.now();

    public Opportunity() {
        this.postedAt = java.time.LocalDateTime.now();
    }

    public Opportunity(String title, String company, String type, String logoText, String logoBg, String description, String location, String postedTime) {
        this.title = title;
        this.company = company;
        this.type = type;
        this.logoText = logoText;
        this.logoBg = logoBg;
        this.description = description;
        this.location = location;
        this.postedTime = postedTime;
        this.postedAt = java.time.LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLogoText() { return logoText; }
    public void setLogoText(String logoText) { this.logoText = logoText; }

    public String getLogoBg() { return logoBg; }
    public void setLogoBg(String logoBg) { this.logoBg = logoBg; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPostedTime() { return postedTime; }
    public void setPostedTime(String postedTime) { this.postedTime = postedTime; }

    public java.time.LocalDateTime getPostedAt() { return postedAt; }
    public void setPostedAt(java.time.LocalDateTime postedAt) { this.postedAt = postedAt; }
}
