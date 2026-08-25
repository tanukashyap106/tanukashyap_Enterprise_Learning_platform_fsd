package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workforce_reports")
public class WorkforceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String category;

    @Column
    private String frequency;

    @Column
    private String lastGen;

    @Column
    private String format;

    @Column
    private String formatType;

    @Column
    private String status;

    public WorkforceReport() {}

    public WorkforceReport(String title, String category, String frequency, String lastGen, String format, String formatType, String status) {
        this.title = title;
        this.category = category;
        this.frequency = frequency;
        this.lastGen = lastGen;
        this.format = format;
        this.formatType = formatType;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getLastGen() {
        return lastGen;
    }

    public void setLastGen(String lastGen) {
        this.lastGen = lastGen;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getFormatType() {
        return formatType;
    }

    public void setFormatType(String formatType) {
        this.formatType = formatType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
