package com.thinkconstructive.rest_demo.model;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "vendorId", "vendorName", "vendorAddress", "vendorPhoneNumber" })
public class CloudStud {
    private String studId;
    private String studName;
    private String studAddress;
    private String studPhoneNumber;

    public CloudStud(){

    }
    
    public CloudStud(String studId, String studName, String studAddress, String studPhoneNumber) {
        this.studId = studId;
        this.studName = studName;
        this.studAddress = studAddress;
        this.studPhoneNumber = studPhoneNumber;
    }
       public String getVendorId() {
        return studId;
    }

    public void setVendorId(String studId) {
        this.studId = studId;
    }

    public String getVendorName() {
        return studName;
    }

    public void setVendorName(String studName) {
        this.studName = studName;
    }

    public String getVendorAddress() {
        return studAddress;
    }

    public void setVendorAddress(String studAddress) {
        this.studAddress = studAddress;
    }

    public String getVendorPhoneNumber() {
        return studPhoneNumber;
    }

    public void setVendorPhoneNumber(String studPhoneNumber) {
        this.studPhoneNumber = studPhoneNumber;
    }
}
