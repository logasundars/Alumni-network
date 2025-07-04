package com.alumninetwork.entity;

public enum MentorshipStatus {
    PENDING("Pending"),
    ACTIVE("Active"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    REJECTED("Rejected");
    
    private final String displayName;
    
    MentorshipStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 