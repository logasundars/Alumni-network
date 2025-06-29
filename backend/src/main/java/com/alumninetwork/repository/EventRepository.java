package com.alumninetwork.repository;

import com.alumninetwork.entity.Event;
import com.alumninetwork.entity.EventStatus;
import com.alumninetwork.entity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find all upcoming events
    List<Event> findByStatusOrderByStartTimeAsc(EventStatus status);
    
    // Find events by type
    List<Event> findByEventTypeOrderByStartTimeAsc(EventType eventType);
    
    // Find events by organizer
    List<Event> findByOrganizerIdOrderByStartTimeDesc(Long organizerId);
    
    // Find events within a date range
    @Query("SELECT e FROM Event e WHERE e.startTime >= :startDate AND e.startTime <= :endDate ORDER BY e.startTime ASC")
    List<Event> findEventsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find upcoming events
    @Query("SELECT e FROM Event e WHERE e.startTime > :now AND e.status = 'UPCOMING' ORDER BY e.startTime ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);
    
    // Search events by title or description
    @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY e.startTime ASC")
    List<Event> searchEvents(@Param("searchTerm") String searchTerm);
    
    // Find virtual events
    List<Event> findByIsVirtualTrueOrderByStartTimeAsc();
    
    // Find events by location
    List<Event> findByLocationContainingIgnoreCaseOrderByStartTimeAsc(String location);
} 