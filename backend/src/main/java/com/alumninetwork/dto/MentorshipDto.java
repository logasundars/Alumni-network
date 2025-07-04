package com.alumninetwork.dto;

import com.alumninetwork.entity.MentorshipStatus;
import com.alumninetwork.entity.MentorshipType;
import java.time.LocalDateTime;

public class MentorshipDto {
    private Long id;
    private UserDto mentor;
    private UserDto mentee;
    private MentorshipType type;
    private MentorshipStatus status;
    private String title;
    private String description;
    private Integer durationMonths;
    private String meetingFrequency;
    private String preferredCommunication;
    private String areasOfExpertise;
    private String goals;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
    
    // Constructors
    public MentorshipDto() {}
    
    public MentorshipDto(Long id, UserDto mentor, UserDto mentee, MentorshipType type, 
                        MentorshipStatus status, String title) {
        this.id = id;
        this.mentor = mentor;
        this.mentee = mentee;
        this.type = type;
        this.status = status;
        this.title = title;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public UserDto getMentor() {
        return mentor;
    }
    
    public void setMentor(UserDto mentor) {
        this.mentor = mentor;
    }
    
    public UserDto getMentee() {
        return mentee;
    }
    
    public void setMentee(UserDto mentee) {
        this.mentee = mentee;
    }
    
    public MentorshipType getType() {
        return type;
    }
    
    public void setType(MentorshipType type) {
        this.type = type;
    }
    
    public MentorshipStatus getStatus() {
        return status;
    }
    
    public void setStatus(MentorshipStatus status) {
        this.status = status;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getDurationMonths() {
        return durationMonths;
    }
    
    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }
    
    public String getMeetingFrequency() {
        return meetingFrequency;
    }
    
    public void setMeetingFrequency(String meetingFrequency) {
        this.meetingFrequency = meetingFrequency;
    }
    
    public String getPreferredCommunication() {
        return preferredCommunication;
    }
    
    public void setPreferredCommunication(String preferredCommunication) {
        this.preferredCommunication = preferredCommunication;
    }
    
    public String getAreasOfExpertise() {
        return areasOfExpertise;
    }
    
    public void setAreasOfExpertise(String areasOfExpertise) {
        this.areasOfExpertise = areasOfExpertise;
    }
    
    public String getGoals() {
        return goals;
    }
    
    public void setGoals(String goals) {
        this.goals = goals;
    }
    
    public LocalDateTime getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }
    
    public LocalDateTime getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
} 