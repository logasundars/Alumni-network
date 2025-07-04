package com.alumninetwork.entity;

public enum MentorshipType {
    CAREER_GUIDANCE("Career Guidance"),
    TECHNICAL_SKILLS("Technical Skills"),
    LEADERSHIP("Leadership Development"),
    ENTREPRENEURSHIP("Entrepreneurship"),
    NETWORKING("Networking"),
    INTERVIEW_PREPARATION("Interview Preparation"),
    RESUME_REVIEW("Resume Review"),
    SOFT_SKILLS("Soft Skills"),
    INDUSTRY_INSIGHTS("Industry Insights"),
    ACADEMIC_GUIDANCE("Academic Guidance");
    
    private final String displayName;
    
    MentorshipType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 