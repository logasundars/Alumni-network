package com.alumninetwork.repository;

import com.alumninetwork.entity.Mentorship;
import com.alumninetwork.entity.MentorshipStatus;
import com.alumninetwork.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipRepository extends JpaRepository<Mentorship, Long> {
    
    // Find all mentorships where user is mentor
    List<Mentorship> findByMentorOrderByCreatedAtDesc(User mentor);
    
    // Find all mentorships where user is mentee
    List<Mentorship> findByMenteeOrderByCreatedAtDesc(User mentee);
    
    // Find active mentorships for a user (as mentor or mentee)
    @Query("SELECT m FROM Mentorship m WHERE (m.mentor = :user OR m.mentee = :user) AND m.status = :status AND m.isActive = true")
    List<Mentorship> findByUserAndStatus(@Param("user") User user, @Param("status") MentorshipStatus status);
    
    // Find all active mentorships
    List<Mentorship> findByIsActiveTrueOrderByCreatedAtDesc();
    
    // Find mentorships by status
    List<Mentorship> findByStatusOrderByCreatedAtDesc(MentorshipStatus status);
    
    // Find mentorships by type
    List<Mentorship> findByTypeOrderByCreatedAtDesc(com.alumninetwork.entity.MentorshipType type);
    
    // Find mentorships by mentor and status
    List<Mentorship> findByMentorAndStatusOrderByCreatedAtDesc(User mentor, MentorshipStatus status);
    
    // Find mentorships by mentee and status
    List<Mentorship> findByMenteeAndStatusOrderByCreatedAtDesc(User mentee, MentorshipStatus status);
    
    // Count active mentorships for a user
    @Query("SELECT COUNT(m) FROM Mentorship m WHERE (m.mentor = :user OR m.mentee = :user) AND m.status = 'ACTIVE' AND m.isActive = true")
    long countActiveMentorshipsByUser(@Param("user") User user);
    
    // Count pending mentorships for a user
    @Query("SELECT COUNT(m) FROM Mentorship m WHERE (m.mentor = :user OR m.mentee = :user) AND m.status = 'PENDING' AND m.isActive = true")
    long countPendingMentorshipsByUser(@Param("user") User user);
} 