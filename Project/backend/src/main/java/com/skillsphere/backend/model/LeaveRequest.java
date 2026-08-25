package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String name;

    @Column(nullable = true)
    private String type;

    @Column(nullable = true, length = 1000)
    private String details;

    @Column(nullable = false)
    private String status = "PENDING";

    // New workforce specific fields
    @Column(nullable = true)
    private String employeeName;

    @Column(nullable = true)
    private String employeeEmail;

    @Column(nullable = true)
    private String role;

    @Column(nullable = true)
    private String dept;

    @Column(nullable = true)
    private String leaveType;

    @Column(nullable = true)
    private String startDate;

    @Column(nullable = true)
    private String endDate;

    @Column(nullable = true)
    private Integer days;

    @Column(nullable = true, length = 1000)
    private String reason;

    @Column(nullable = true)
    private String empId;

    @Column(nullable = true)
    private String requestDate;

    public LeaveRequest() {}

    public LeaveRequest(String name, String type, String details, String status) {
        this.name = name;
        this.type = type;
        this.details = details;
        this.status = status;
        this.employeeName = name;
        this.leaveType = type;
        this.reason = details;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.employeeName != null ? this.employeeName : this.name;
    }

    public void setName(String name) {
        this.name = name;
        this.employeeName = name;
    }

    public String getType() {
        return this.leaveType != null ? this.leaveType : this.type;
    }

    public void setType(String type) {
        this.type = type;
        this.leaveType = type;
    }

    public String getDetails() {
        return this.reason != null ? this.reason : this.details;
    }

    public void setDetails(String details) {
        this.details = details;
        this.reason = details;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
        this.name = employeeName;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
        this.type = leaveType;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
        this.details = reason;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(String requestDate) {
        this.requestDate = requestDate;
    }
}
