package com.oceanview.dto;

/**
 * Login Response DTO
 */
public class LoginResponse {
    
    private String token;
    private String username;
    private String fullName;
    private String email;
    private String contactNumber;
    private String address;
    private String role;
    private String message;
    
    public LoginResponse() {
    }
    
    public LoginResponse(String token, String username, String fullName, String role, String message) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.message = message;
    }
    
    public LoginResponse(String token, String username, String fullName, String email, String contactNumber, String address, String role, String message) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.address = address;
        this.role = role;
        this.message = message;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getContactNumber() {
        return contactNumber;
    }
    
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
}
