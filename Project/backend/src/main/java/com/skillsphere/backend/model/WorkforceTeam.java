package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workforce_teams")
public class WorkforceTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column
    private String leadName;

    @Column
    private String leadDept;

    @Column
    private String leadAvatar;

    @Column
    private Integer members;

    @Column
    private String dept;

    @Column
    private String status; // "Active" or "Inactive"

    public WorkforceTeam() {}

    public WorkforceTeam(String name, String description, String leadName, String leadDept, String leadAvatar, Integer members, String dept, String status) {
        this.name = name;
        this.description = description;
        this.leadName = leadName;
        this.leadDept = leadDept;
        this.leadAvatar = leadAvatar;
        this.members = members;
        this.dept = dept;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLeadName() {
        return leadName;
    }

    public void setLeadName(String leadName) {
        this.leadName = leadName;
    }

    public String getLeadDept() {
        return leadDept;
    }

    public void setLeadDept(String leadDept) {
        this.leadDept = leadDept;
    }

    public String getLeadAvatar() {
        return leadAvatar;
    }

    public void setLeadAvatar(String leadAvatar) {
        this.leadAvatar = leadAvatar;
    }

    public Integer getMembers() {
        return members;
    }

    public void setMembers(Integer members) {
        this.members = members;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
