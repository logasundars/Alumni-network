package com.alumninetwork.repository;

import com.alumninetwork.entity.JobApplication;
import com.alumninetwork.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    
    // Find applications by applicant
    List<JobApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);
    
    // Find applications by job posting
    List<JobApplication> findByJobPostingIdOrderByCreatedAtDesc(Long jobPostingId);
    
    // Find applications by status
    List<JobApplication> findByStatusOrderByCreatedAtDesc(ApplicationStatus status);
    
    // Find applications by applicant and status
    List<JobApplication> findByApplicantIdAndStatusOrderByCreatedAtDesc(Long applicantId, ApplicationStatus status);
    
    // Find applications by job posting and status
    List<JobApplication> findByJobPostingIdAndStatusOrderByCreatedAtDesc(Long jobPostingId, ApplicationStatus status);
    
    // Check if user has already applied to a job
    Optional<JobApplication> findByApplicantIdAndJobPostingId(Long applicantId, Long jobPostingId);
    
    // Count applications by job posting
    long countByJobPostingId(Long jobPostingId);
    
    // Count applications by status
    long countByStatus(ApplicationStatus status);
} 