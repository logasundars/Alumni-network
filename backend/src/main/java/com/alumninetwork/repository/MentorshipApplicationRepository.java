package com.alumninetwork.repository;

import com.alumninetwork.entity.MentorshipApplication;
import com.alumninetwork.entity.ApplicationStatus;
import com.alumninetwork.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipApplicationRepository extends JpaRepository<MentorshipApplication, Long> {
    
    // Find all applications where user is mentor
    List<MentorshipApplication> findByMentorOrderByCreatedAtDesc(User mentor);
    
    // Find all applications where user is applicant
    List<MentorshipApplication> findByApplicantOrderByCreatedAtDesc(User applicant);
    
    // Find applications by status
    List<MentorshipApplication> findByStatusOrderByCreatedAtDesc(ApplicationStatus status);
    
    // Find applications by mentor and status
    List<MentorshipApplication> findByMentorAndStatusOrderByCreatedAtDesc(User mentor, ApplicationStatus status);
    
    // Find applications by applicant and status
    List<MentorshipApplication> findByApplicantAndStatusOrderByCreatedAtDesc(User applicant, ApplicationStatus status);
    
    // Count pending applications for a mentor
    long countByMentorAndStatus(User mentor, ApplicationStatus status);
    
    // Count applications by applicant and status
    long countByApplicantAndStatus(User applicant, ApplicationStatus status);
    
    // Find applications by type
    List<MentorshipApplication> findByTypeOrderByCreatedAtDesc(com.alumninetwork.entity.MentorshipType type);
    
    // Check if application exists between mentor and applicant
    boolean existsByMentorAndApplicantAndStatus(User mentor, User applicant, ApplicationStatus status);

    // Find all applications for a specific mentorship
    List<MentorshipApplication> findByMentorshipOrderByCreatedAtDesc(com.alumninetwork.entity.Mentorship mentorship);
    // Count applications for a specific mentorship and status
    long countByMentorshipAndStatus(com.alumninetwork.entity.Mentorship mentorship, ApplicationStatus status);
} 