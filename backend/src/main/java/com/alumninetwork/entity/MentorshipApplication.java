package com.alumninetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentorship_applications")
public class MentorshipApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "mentorship_type", nullable = false)
    private MentorshipType type;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "motivation", columnDefinition = "TEXT", nullable = false)
    private String motivation;
    
    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;
    
    @Column(name = "current_skills", columnDefinition = "TEXT")
    private String currentSkills;
    
    @Column(name = "desired_skills", columnDefinition = "TEXT")
    private String desiredSkills;
    
    @Column(name = "preferred_communication")
    private String preferredCommunication;
    
    @Column(name = "availability", columnDefinition = "TEXT")
    private String availability;
    
    @Column(name = "duration_months")
    private Integer durationMonths;
    
    @Column(name = "meeting_frequency")
    private String meetingFrequency;
    
    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;
    
    @Column(name = "mentor_response", columnDefinition = "TEXT")
    private String mentorResponse;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "responded_at")
    private LocalDateTime respondedAt;
    
    // Constructors
    public MentorshipApplication() {
        this.createdAt = LocalDateTime.now();
        this.status = ApplicationStatus.PENDING;
    }
    
    public MentorshipApplication(User mentor, User applicant, MentorshipType type, String title, String motivation) {
        this();
        this.mentor = mentor;
        this.applicant = applicant;
        this.type = type;
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
    
    public User getMentor() {
        return mentor;
    }
    
    public void setMentor(User mentor) {
        this.mentor = mentor;
    }
    
    public User getApplicant() {
        return applicant;
    }
    
    public void setApplicant(User applicant) {
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
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 