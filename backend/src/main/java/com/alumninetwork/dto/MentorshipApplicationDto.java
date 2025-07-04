package com.alumninetwork.dto;

import com.alumninetwork.entity.ApplicationStatus;
import com.alumninetwork.entity.MentorshipType;
import java.time.LocalDateTime;

public class MentorshipApplicationDto {
    private Long id;
    private UserDto mentor;
    private UserDto applicant;
    private MentorshipType type;
    private ApplicationStatus status;
    private String title;
    private String motivation;
    private String goals;
    private String currentSkills;
    private String desiredSkills;
    private String preferredCommunication;
    private String availability;
    private Integer durationMonths;
    private String meetingFrequency;
    private String additionalNotes;
    private String mentorResponse;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime respondedAt;
    
    // Constructors
    public MentorshipApplicationDto() {}
    
    public MentorshipApplicationDto(Long id, UserDto mentor, UserDto applicant, 
                                  MentorshipType type, ApplicationStatus status, 
                                  String title, String motivation) {
        this.id = id;
        this.mentor = mentor;
        this.applicant = applicant;
        this.type = type;
        this.status = status;
        this.title = title;
        this.motivation = motivation;
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
    
    public UserDto getApplicant() {
        return applicant;
    }
    
    public void setApplicant(UserDto applicant) {
        this.applicant = applicant;
    }
    
    public MentorshipType getType() {
        return type;
    }
    
    public void setType(MentorshipType type) {
        this.type = type;
    }
    
    public ApplicationStatus getStatus() {
        return status;
    }
    
    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMotivation() {
        return motivation;
    }
    
    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }
    
    public String getGoals() {
        return goals;
    }
    
    public void setGoals(String goals) {
        this.goals = goals;
    }
    
    public String getCurrentSkills() {
        return currentSkills;
    }
    
    public void setCurrentSkills(String currentSkills) {
        this.currentSkills = currentSkills;
    }
    
    public String getDesiredSkills() {
        return desiredSkills;
    }
    
    public void setDesiredSkills(String desiredSkills) {
        this.desiredSkills = desiredSkills;
    }
    
    public String getPreferredCommunication() {
        return preferredCommunication;
    }
    
    public void setPreferredCommunication(String preferredCommunication) {
        this.preferredCommunication = preferredCommunication;
    }
    
    public String getAvailability() {
        return availability;
    }
    
    public void setAvailability(String availability) {
        this.availability = availability;
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
    
    public String getAdditionalNotes() {
        return additionalNotes;
    }
    
    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }
    
    public String getMentorResponse() {
        return mentorResponse;
    }
    
    public void setMentorResponse(String mentorResponse) {
        this.mentorResponse = mentorResponse;
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
    
    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }
    
    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
} 