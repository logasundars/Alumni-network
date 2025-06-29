package com.alumninetwork.dto;

import com.alumninetwork.entity.EventStatus;
import com.alumninetwork.entity.EventType;
import java.time.LocalDateTime;

public class EventRequest {
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String virtualMeetingLink;
    private EventType eventType;
    private EventStatus status;
    private String imageUrl;
    private Integer maxAttendees;
    private Boolean isRegistrationRequired;
    private Boolean isVirtual;
    
    // Constructors
    public EventRequest() {}
    
    // Getters and Setters
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
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getVirtualMeetingLink() {
        return virtualMeetingLink;
    }
    
    public void setVirtualMeetingLink(String virtualMeetingLink) {
        this.virtualMeetingLink = virtualMeetingLink;
    }
    
    public EventType getEventType() {
        return eventType;
    }
    
    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }
    
    public EventStatus getStatus() {
        return status;
    }
    
    public void setStatus(EventStatus status) {
        this.status = status;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Integer getMaxAttendees() {
        return maxAttendees;
    }
    
    public void setMaxAttendees(Integer maxAttendees) {
        this.maxAttendees = maxAttendees;
    }
    
    public Boolean getIsRegistrationRequired() {
        return isRegistrationRequired;
    }
    
    public void setIsRegistrationRequired(Boolean isRegistrationRequired) {
        this.isRegistrationRequired = isRegistrationRequired;
    }
    
    public Boolean getIsVirtual() {
        return isVirtual;
    }
    
    public void setIsVirtual(Boolean isVirtual) {
        this.isVirtual = isVirtual;
    }
} 