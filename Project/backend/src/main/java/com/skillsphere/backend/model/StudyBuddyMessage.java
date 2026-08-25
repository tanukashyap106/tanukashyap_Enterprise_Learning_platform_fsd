package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "study_buddy_messages")
public class StudyBuddyMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String sender;

    @Column(length = 4000)
    private String text;

    @Column(nullable = false)
    private String time;

    @Column
    private String type; // "text", "explanation", "quiz", etc.

    @Column
    private String title;

    @Column(length = 4000)
    private String intro;

    @Column(length = 4000)
    private String howItWorks;

    @Column(length = 4000)
    private String codeSnippet;

    public StudyBuddyMessage() {}

    public StudyBuddyMessage(Long userId, String sender, String text, String time, String type, String title, String intro, String howItWorks, String codeSnippet) {
        this.userId = userId;
        this.sender = sender;
        this.text = text;
        this.time = time;
        this.type = type;
        this.title = title;
        this.intro = intro;
        this.howItWorks = howItWorks;
        this.codeSnippet = codeSnippet;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIntro() {
        return intro;
    }

    public void setIntro(String intro) {
        this.intro = intro;
    }

    public String getHowItWorks() {
        return howItWorks;
    }

    public void setHowItWorks(String howItWorks) {
        this.howItWorks = howItWorks;
    }

    public String getCodeSnippet() {
        return codeSnippet;
    }

    public void setCodeSnippet(String codeSnippet) {
        this.codeSnippet = codeSnippet;
    }
}
