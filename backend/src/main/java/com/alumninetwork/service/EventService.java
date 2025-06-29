package com.alumninetwork.service;

import com.alumninetwork.dto.EventRequest;
import com.alumninetwork.dto.EventResponse;
import com.alumninetwork.entity.Event;
import com.alumninetwork.entity.EventStatus;
import com.alumninetwork.entity.EventType;
import com.alumninetwork.entity.User;
import com.alumninetwork.repository.EventRepository;
import com.alumninetwork.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<EventResponse> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }
    
    public List<EventResponse> getUpcomingEvents() {
        List<Event> events = eventRepository.findUpcomingEvents(LocalDateTime.now());
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }
    
    public List<EventResponse> getEventsByType(EventType eventType) {
        List<Event> events = eventRepository.findByEventTypeOrderByStartTimeAsc(eventType);
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }
    
    public List<EventResponse> getEventsByOrganizer(String organizerEmail) {
        Optional<User> userOpt = userRepository.findByEmail(organizerEmail);
        if (userOpt.isPresent()) {
            List<Event> events = eventRepository.findByOrganizerIdOrderByStartTimeDesc(userOpt.get().getId());
            return events.stream()
                    .map(this::convertToEventResponse)
                    .collect(Collectors.toList());
        }
        throw new RuntimeException("Organizer not found");
    }
    
    public List<EventResponse> searchEvents(String searchTerm) {
        List<Event> events = eventRepository.searchEvents(searchTerm);
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }
    
    public EventResponse getEventById(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            return convertToEventResponse(eventOpt.get());
        }
        throw new RuntimeException("Event not found");
    }
    
    public EventResponse createEvent(EventRequest request, String organizerEmail) {
        Optional<User> userOpt = userRepository.findByEmail(organizerEmail);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Organizer not found");
        }
        
        User organizer = userOpt.get();
        
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setLocation(request.getLocation());
        event.setVirtualMeetingLink(request.getVirtualMeetingLink());
        event.setEventType(request.getEventType());
        event.setStatus(request.getStatus() != null ? request.getStatus() : EventStatus.UPCOMING);
        event.setImageUrl(request.getImageUrl());
        event.setMaxAttendees(request.getMaxAttendees());
        event.setIsRegistrationRequired(request.getIsRegistrationRequired() != null ? request.getIsRegistrationRequired() : false);
        event.setIsVirtual(request.getIsVirtual() != null ? request.getIsVirtual() : false);
        event.setOrganizer(organizer);
        
        Event savedEvent = eventRepository.save(event);
        return convertToEventResponse(savedEvent);
    }
    
    public EventResponse updateEvent(Long eventId, EventRequest request, String organizerEmail) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent()) {
            throw new RuntimeException("Event not found");
        }
        
        Event event = eventOpt.get();
        
        // Check if the user is the organizer
        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new RuntimeException("Only the organizer can update this event");
        }
        
        // Update fields if provided
        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getStartTime() != null) {
            event.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            event.setEndTime(request.getEndTime());
        }
        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }
        if (request.getVirtualMeetingLink() != null) {
            event.setVirtualMeetingLink(request.getVirtualMeetingLink());
        }
        if (request.getEventType() != null) {
            event.setEventType(request.getEventType());
        }
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }
        if (request.getImageUrl() != null) {
            event.setImageUrl(request.getImageUrl());
        }
        if (request.getMaxAttendees() != null) {
            event.setMaxAttendees(request.getMaxAttendees());
        }
        if (request.getIsRegistrationRequired() != null) {
            event.setIsRegistrationRequired(request.getIsRegistrationRequired());
        }
        if (request.getIsVirtual() != null) {
            event.setIsVirtual(request.getIsVirtual());
        }
        
        Event savedEvent = eventRepository.save(event);
        return convertToEventResponse(savedEvent);
    }
    
    public void deleteEvent(Long eventId, String organizerEmail) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent()) {
            throw new RuntimeException("Event not found");
        }
        
        Event event = eventOpt.get();
        
        // Check if the user is the organizer
        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new RuntimeException("Only the organizer can delete this event");
        }
        
        eventRepository.delete(event);
    }
    
    private EventResponse convertToEventResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setStartTime(event.getStartTime());
        response.setEndTime(event.getEndTime());
        response.setLocation(event.getLocation());
        response.setVirtualMeetingLink(event.getVirtualMeetingLink());
        response.setEventType(event.getEventType());
        response.setStatus(event.getStatus());
        response.setImageUrl(event.getImageUrl());
        response.setMaxAttendees(event.getMaxAttendees());
        response.setIsRegistrationRequired(event.getIsRegistrationRequired());
        response.setIsVirtual(event.getIsVirtual());
        response.setOrganizerName(event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName());
        response.setOrganizerEmail(event.getOrganizer().getEmail());
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());
        return response;
    }
} 