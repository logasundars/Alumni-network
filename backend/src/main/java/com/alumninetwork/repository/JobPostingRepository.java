package com.alumninetwork.repository;

import com.alumninetwork.entity.JobPosting;
import com.alumninetwork.entity.JobStatus;
import com.alumninetwork.entity.JobType;
import com.alumninetwork.entity.ExperienceLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    
    // Find active job postings
    List<JobPosting> findByStatusOrderByCreatedAtDesc(JobStatus status);
    
    // Find jobs by company
    List<JobPosting> findByCompanyContainingIgnoreCaseOrderByCreatedAtDesc(String company);
    
    // Find jobs by location
    List<JobPosting> findByLocationContainingIgnoreCaseOrderByCreatedAtDesc(String location);
    
    // Find jobs by job type
    List<JobPosting> findByJobTypeOrderByCreatedAtDesc(JobType jobType);
    
    // Find jobs by experience level
    List<JobPosting> findByExperienceLevelOrderByCreatedAtDesc(ExperienceLevel experienceLevel);
    
    // Find jobs by poster
    List<JobPosting> findByPostedByIdOrderByCreatedAtDesc(Long postedById);
    
    // Find jobs with salary range
    @Query("SELECT j FROM JobPosting j WHERE j.salaryMin >= :minSalary AND j.salaryMax <= :maxSalary ORDER BY j.createdAt DESC")
    List<JobPosting> findJobsBySalaryRange(@Param("minSalary") Double minSalary, @Param("maxSalary") Double maxSalary);
    
    // Find jobs that haven't expired
    @Query("SELECT j FROM JobPosting j WHERE (j.applicationDeadline IS NULL OR j.applicationDeadline > :now) AND j.status = 'ACTIVE' ORDER BY j.createdAt DESC")
    List<JobPosting> findActiveJobsNotExpired(@Param("now") LocalDateTime now);
    
    // Search jobs by title, description, or company
    @Query("SELECT j FROM JobPosting j WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(j.company) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY j.createdAt DESC")
    List<JobPosting> searchJobs(@Param("searchTerm") String searchTerm);
    
    // Find remote jobs
    List<JobPosting> findByJobTypeAndStatusOrderByCreatedAtDesc(JobType jobType, JobStatus status);
    
    // Find jobs by multiple criteria
    @Query("SELECT j FROM JobPosting j WHERE j.status = :status AND (:jobType IS NULL OR j.jobType = :jobType) AND (:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel) ORDER BY j.createdAt DESC")
    List<JobPosting> findJobsByCriteria(@Param("status") JobStatus status, @Param("jobType") JobType jobType, @Param("experienceLevel") ExperienceLevel experienceLevel);
} 