package com.alumninetwork.service;

import com.alumninetwork.dto.JobPostingRequest;
import com.alumninetwork.dto.JobPostingResponse;
import com.alumninetwork.entity.*;
import com.alumninetwork.repository.JobPostingRepository;
import com.alumninetwork.repository.JobApplicationRepository;
import com.alumninetwork.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobService {
    
    @Autowired
    private JobPostingRepository jobPostingRepository;
    
    @Autowired
    private JobApplicationRepository jobApplicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Job Posting Methods
    public List<JobPostingResponse> getAllJobPostings() {
        return jobPostingRepository.findByStatusOrderByCreatedAtDesc(JobStatus.ACTIVE)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public JobPostingResponse getJobPostingById(Long id) {
        Optional<JobPosting> jobPosting = jobPostingRepository.findById(id);
        return jobPosting.map(this::convertToResponse).orElse(null);
    }
    
    public JobPostingResponse createJobPosting(JobPostingRequest request, String userEmail) {
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        // Only ALUMNI and ADMIN can post jobs
        UserRole role = user.get().getRole();
        if (role == UserRole.STUDENT) {
            throw new RuntimeException("Students are not allowed to post jobs");
        }
        
        JobPosting jobPosting = new JobPosting();
        jobPosting.setTitle(request.getTitle());
        jobPosting.setDescription(request.getDescription());
        jobPosting.setCompany(request.getCompany());
        jobPosting.setLocation(request.getLocation());
        jobPosting.setJobType(request.getJobType());
        jobPosting.setExperienceLevel(request.getExperienceLevel());
        
        // Handle optional fields with null checks
        jobPosting.setRequirements(request.getRequirements());
        jobPosting.setResponsibilities(request.getResponsibilities());
        jobPosting.setBenefits(request.getBenefits());
        jobPosting.setSalaryMin(request.getSalaryMin());
        jobPosting.setSalaryMax(request.getSalaryMax());
        jobPosting.setSalaryCurrency(request.getSalaryCurrency() != null ? request.getSalaryCurrency() : "USD");
        jobPosting.setApplicationUrl(request.getApplicationUrl());
        jobPosting.setContactEmail(request.getContactEmail());
        jobPosting.setStatus(request.getStatus() != null ? request.getStatus() : JobStatus.ACTIVE);
        jobPosting.setApplicationDeadline(request.getApplicationDeadline());
        jobPosting.setPostedBy(user.get());
        jobPosting.setCreatedAt(LocalDateTime.now());
        jobPosting.setUpdatedAt(LocalDateTime.now());
        
        JobPosting savedJob = jobPostingRepository.save(jobPosting);
        return convertToResponse(savedJob);
    }
    
    public JobPostingResponse updateJobPosting(Long id, JobPostingRequest request, String userEmail) {
        Optional<JobPosting> existingJob = jobPostingRepository.findById(id);
        if (existingJob.isEmpty()) {
            throw new RuntimeException("Job posting not found");
        }
        
        JobPosting jobPosting = existingJob.get();
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty() || !jobPosting.getPostedBy().getId().equals(user.get().getId())) {
            throw new RuntimeException("Unauthorized to update this job posting");
        }
        
        jobPosting.setTitle(request.getTitle());
        jobPosting.setDescription(request.getDescription());
        jobPosting.setCompany(request.getCompany());
        jobPosting.setLocation(request.getLocation());
        jobPosting.setJobType(request.getJobType());
        jobPosting.setExperienceLevel(request.getExperienceLevel());
        jobPosting.setRequirements(request.getRequirements());
        jobPosting.setResponsibilities(request.getResponsibilities());
        jobPosting.setBenefits(request.getBenefits());
        jobPosting.setSalaryMin(request.getSalaryMin());
        jobPosting.setSalaryMax(request.getSalaryMax());
        jobPosting.setSalaryCurrency(request.getSalaryCurrency());
        jobPosting.setApplicationUrl(request.getApplicationUrl());
        jobPosting.setContactEmail(request.getContactEmail());
        jobPosting.setStatus(request.getStatus());
        jobPosting.setApplicationDeadline(request.getApplicationDeadline());
        jobPosting.setUpdatedAt(LocalDateTime.now());
        
        JobPosting savedJob = jobPostingRepository.save(jobPosting);
        return convertToResponse(savedJob);
    }
    
    public void deleteJobPosting(Long id, String userEmail) {
        Optional<JobPosting> jobPosting = jobPostingRepository.findById(id);
        if (jobPosting.isEmpty()) {
            throw new RuntimeException("Job posting not found");
        }
        
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty() || !jobPosting.get().getPostedBy().getId().equals(user.get().getId())) {
            throw new RuntimeException("Unauthorized to delete this job posting");
        }
        
        jobPostingRepository.deleteById(id);
    }
    
    public List<JobPostingResponse> searchJobPostings(String searchTerm) {
        return jobPostingRepository.searchJobs(searchTerm)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<JobPostingResponse> getJobPostingsByCompany(String company) {
        return jobPostingRepository.findByCompanyContainingIgnoreCaseOrderByCreatedAtDesc(company)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<JobPostingResponse> getJobPostingsByType(JobType jobType) {
        return jobPostingRepository.findByJobTypeOrderByCreatedAtDesc(jobType)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<JobPostingResponse> getJobPostingsByExperienceLevel(ExperienceLevel experienceLevel) {
        return jobPostingRepository.findByExperienceLevelOrderByCreatedAtDesc(experienceLevel)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<JobPostingResponse> getJobPostingsByUser(String userEmail) {
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        return jobPostingRepository.findByPostedByIdOrderByCreatedAtDesc(user.get().getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Job Application Methods
    public JobApplication applyForJob(Long jobId, String userEmail, String coverLetter, String resumeUrl) {
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        Optional<JobPosting> jobPosting = jobPostingRepository.findById(jobId);
        if (jobPosting.isEmpty()) {
            throw new RuntimeException("Job posting not found");
        }
        
        // Check if user has already applied
        Optional<JobApplication> existingApplication = jobApplicationRepository
                .findByApplicantIdAndJobPostingId(user.get().getId(), jobId);
        if (existingApplication.isPresent()) {
            throw new RuntimeException("You have already applied for this job");
        }
        
        JobApplication application = new JobApplication();
        application.setApplicant(user.get());
        application.setJobPosting(jobPosting.get());
        application.setCoverLetter(coverLetter);
        application.setResumeUrl(resumeUrl);
        application.setStatus(ApplicationStatus.PENDING);
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        
        return jobApplicationRepository.save(application);
    }
    
    public List<JobApplication> getUserApplications(String userEmail) {
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        return jobApplicationRepository.findByApplicantIdOrderByCreatedAtDesc(user.get().getId());
    }
    
    public List<JobApplication> getJobApplications(Long jobId, String userEmail) {
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        Optional<JobPosting> jobPosting = jobPostingRepository.findById(jobId);
        if (jobPosting.isEmpty()) {
            throw new RuntimeException("Job posting not found");
        }
        
        // Check if user is the job poster
        if (!jobPosting.get().getPostedBy().getId().equals(user.get().getId())) {
            throw new RuntimeException("Unauthorized to view applications for this job");
        }
        
        return jobApplicationRepository.findByJobPostingIdOrderByCreatedAtDesc(jobId);
    }
    
    public JobApplication updateApplicationStatus(Long applicationId, ApplicationStatus status, String userEmail) {
        Optional<JobApplication> application = jobApplicationRepository.findById(applicationId);
        if (application.isEmpty()) {
            throw new RuntimeException("Application not found");
        }
        
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        // Check if user is the job poster
        if (!application.get().getJobPosting().getPostedBy().getId().equals(user.get().getId())) {
            throw new RuntimeException("Unauthorized to update this application");
        }
        
        JobApplication jobApplication = application.get();
        jobApplication.setStatus(status);
        jobApplication.setUpdatedAt(LocalDateTime.now());
        
        return jobApplicationRepository.save(jobApplication);
    }
    
    // Helper method to convert JobPosting to JobPostingResponse
    private JobPostingResponse convertToResponse(JobPosting jobPosting) {
        JobPostingResponse response = new JobPostingResponse();
        response.setId(jobPosting.getId());
        response.setTitle(jobPosting.getTitle());
        response.setDescription(jobPosting.getDescription());
        response.setCompany(jobPosting.getCompany());
        response.setLocation(jobPosting.getLocation());
        response.setJobType(jobPosting.getJobType());
        response.setExperienceLevel(jobPosting.getExperienceLevel());
        response.setRequirements(jobPosting.getRequirements());
        response.setResponsibilities(jobPosting.getResponsibilities());
        response.setBenefits(jobPosting.getBenefits());
        response.setSalaryMin(jobPosting.getSalaryMin());
        response.setSalaryMax(jobPosting.getSalaryMax());
        response.setSalaryCurrency(jobPosting.getSalaryCurrency());
        response.setApplicationUrl(jobPosting.getApplicationUrl());
        response.setContactEmail(jobPosting.getContactEmail());
        response.setStatus(jobPosting.getStatus());
        response.setApplicationDeadline(jobPosting.getApplicationDeadline());
        response.setPostedByName(jobPosting.getPostedBy().getFirstName() + " " + jobPosting.getPostedBy().getLastName());
        response.setPostedByEmail(jobPosting.getPostedBy().getEmail());
        response.setCreatedAt(jobPosting.getCreatedAt());
        response.setUpdatedAt(jobPosting.getUpdatedAt());
        
        // Get application count
        Long applicationCount = jobApplicationRepository.countByJobPostingId(jobPosting.getId());
        response.setApplicationCount(applicationCount);
        
        return response;
    }
} 