package com.alumninetwork.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentorships")
public class Mentorship {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentee_id", nullable = false)
    private User mentee;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "mentorship_type", nullable = false)
    private MentorshipType type;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MentorshipStatus status;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "duration_months")
    private Integer durationMonths;
    
    @Column(name = "meeting_frequency")
    private String meetingFrequency; // e.g., "Weekly", "Bi-weekly", "Monthly"
    
    @Column(name = "preferred_communication")
    private String preferredCommunication; // e.g., "Email", "Video Call", "Phone"
    
    @Column(name = "areas_of_expertise", columnDefinition = "TEXT")
    private String areasOfExpertise; // Comma-separated list
    
    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Constructors
    public Mentorship() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Mentorship(User mentor, User mentee, MentorshipType type, String title) {
        this();
        this.mentor = mentor;
        this.mentee = mentee;
        this.type = type;
        this.title = title;
        this.status = MentorshipStatus.PENDING;
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
    
    public User getMentee() {
        return mentee;
    }
    
    public void setMentee(User mentee) {
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
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 