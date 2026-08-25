package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workforce_settings")
public class WorkforceSettings {

    @Id
    private Long id = 1L;

    @Column
    private String companyName;

    @Column
    private String companySlug;

    @Column
    private String timezone;

    @Column
    private String currency;

    @Column
    private String adminEmail;

    @Column
    private String fiscalStart;

    @Column
    private Boolean enforce2FA;

    @Column
    private Boolean enforceSSO;

    @Column
    private String passwordRotation;

    @Column(length = 1000)
    private String ipWhitelist;

    @Column
    private String sessionTimeout;

    @Column
    private Boolean emailNotifications;

    @Column
    private Boolean slackAlerts;

    @Column
    private Boolean reviewReminders;

    @Column
    private Boolean assessmentReminders;

    @Column(length = 1000)
    private String webhookUrl;

    public WorkforceSettings() {}

    public WorkforceSettings(String companyName, String companySlug, String timezone, String currency, String adminEmail, String fiscalStart, Boolean enforce2FA, Boolean enforceSSO, String passwordRotation, String ipWhitelist, String sessionTimeout, Boolean emailNotifications, Boolean slackAlerts, Boolean reviewReminders, Boolean assessmentReminders, String webhookUrl) {
        this.companyName = companyName;
        this.companySlug = companySlug;
        this.timezone = timezone;
        this.currency = currency;
        this.adminEmail = adminEmail;
        this.fiscalStart = fiscalStart;
        this.enforce2FA = enforce2FA;
        this.enforceSSO = enforceSSO;
        this.passwordRotation = passwordRotation;
        this.ipWhitelist = ipWhitelist;
        this.sessionTimeout = sessionTimeout;
        this.emailNotifications = emailNotifications;
        this.slackAlerts = slackAlerts;
        this.reviewReminders = reviewReminders;
        this.assessmentReminders = assessmentReminders;
        this.webhookUrl = webhookUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanySlug() {
        return companySlug;
    }

    public void setCompanySlug(String companySlug) {
        this.companySlug = companySlug;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }

    public String getFiscalStart() {
        return fiscalStart;
    }

    public void setFiscalStart(String fiscalStart) {
        this.fiscalStart = fiscalStart;
    }

    public Boolean getEnforce2FA() {
        return enforce2FA;
    }

    public void setEnforce2FA(Boolean enforce2FA) {
        this.enforce2FA = enforce2FA;
    }

    public Boolean getEnforceSSO() {
        return enforceSSO;
    }

    public void setEnforceSSO(Boolean enforceSSO) {
        this.enforceSSO = enforceSSO;
    }

    public String getPasswordRotation() {
        return passwordRotation;
    }

    public void setPasswordRotation(String passwordRotation) {
        this.passwordRotation = passwordRotation;
    }

    public String getIpWhitelist() {
        return ipWhitelist;
    }

    public void setIpWhitelist(String ipWhitelist) {
        this.ipWhitelist = ipWhitelist;
    }

    public String getSessionTimeout() {
        return sessionTimeout;
    }

    public void setSessionTimeout(String sessionTimeout) {
        this.sessionTimeout = sessionTimeout;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getSlackAlerts() {
        return slackAlerts;
    }

    public void setSlackAlerts(Boolean slackAlerts) {
        this.slackAlerts = slackAlerts;
    }

    public Boolean getReviewReminders() {
        return reviewReminders;
    }

    public void setReviewReminders(Boolean reviewReminders) {
        this.reviewReminders = reviewReminders;
    }

    public Boolean getAssessmentReminders() {
        return assessmentReminders;
    }

    public void setAssessmentReminders(Boolean assessmentReminders) {
        this.assessmentReminders = assessmentReminders;
    }

    public String getWebhookUrl() {
        return webhookUrl;
    }

    public void setWebhookUrl(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
}
