package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "badge_type")
    private String badgeType;

    private String course;

    @Column(name = "course_key")
    private String courseKey;

    @Column(name = "course_id")
    private String courseId;

    @Column(length = 1000)
    private String description;

    private String difficulty;

    @Column(name = "xp_reward")
    private String xpReward;

    private String mode;

    @Column(name = "due_date_text")
    private String dueDateText;

    @Column(name = "due_date_full")
    private String dueDateFull;

    @Column(name = "logo_text")
    private String logoText;

    @Column(name = "logo_bg")
    private String logoBg;

    @Column(name = "logo_color")
    private String logoColor;

    // Constructors
    public Assignment() {}

    public Assignment(String title, String badgeType, String course, String courseKey, String courseId, 
                      String description, String difficulty, String xpReward, String mode, 
                      String dueDateText, String dueDateFull, String logoText, String logoBg, String logoColor) {
        this.title = title;
        this.badgeType = badgeType;
        this.course = course;
        this.courseKey = courseKey;
        this.courseId = courseId;
        this.description = description;
        this.difficulty = difficulty;
        this.xpReward = xpReward;
        this.mode = mode;
        this.dueDateText = dueDateText;
        this.dueDateFull = dueDateFull;
        this.logoText = logoText;
        this.logoBg = logoBg;
        this.logoColor = logoColor;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBadgeType() { return badgeType; }
    public void setBadgeType(String badgeType) { this.badgeType = badgeType; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getCourseKey() { return courseKey; }
    public void setCourseKey(String courseKey) { this.courseKey = courseKey; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getXpReward() { return xpReward; }
    public void setXpReward(String xpReward) { this.xpReward = xpReward; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getDueDateText() { return dueDateText; }
    public void setDueDateText(String dueDateText) { this.dueDateText = dueDateText; }

    public String getDueDateFull() { return dueDateFull; }
    public void setDueDateFull(String dueDateFull) { this.dueDateFull = dueDateFull; }

    public String getLogoText() { return logoText; }
    public void setLogoText(String logoText) { this.logoText = logoText; }

    public String getLogoBg() { return logoBg; }
    public void setLogoBg(String logoBg) { this.logoBg = logoBg; }

    public String getLogoColor() { return logoColor; }
    public void setLogoColor(String logoColor) { this.logoColor = logoColor; }
}
