package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workforce_messages")
public class WorkforceMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, length = 2000)
    private String text;

    @Column(nullable = false)
    private String time;

    @Column(nullable = false)
    private String initial;

    @Column(nullable = false)
    private String color;

    public WorkforceMessage() {}

    public WorkforceMessage(String sender, String role, String text, String time, String initial, String color) {
        this.sender = sender;
        this.role = role;
        this.text = text;
        this.time = time;
        this.initial = initial;
        this.color = color;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getInitial() {
        return initial;
    }

    public void setInitial(String initial) {
        this.initial = initial;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
