package com.alumninetwork.controller;

import com.alumninetwork.dto.JobPostingRequest;
import com.alumninetwork.dto.JobPostingResponse;
import com.alumninetwork.entity.*;
import com.alumninetwork.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {
    
    @Autowired
    private JobService jobService;
    
    // Job Posting Endpoints
    @GetMapping
    public ResponseEntity<List<JobPostingResponse>> getAllJobPostings() {
        try {
            List<JobPostingResponse> jobs = jobService.getAllJobPostings();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<JobPostingResponse> getJobPostingById(@PathVariable Long id) {
        try {
            JobPostingResponse job = jobService.getJobPostingById(id);
            if (job != null) {
                return ResponseEntity.ok(job);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<JobPostingResponse> createJobPosting(
            @RequestBody JobPostingRequest request,
            @RequestParam String userEmail) {
        try {
            System.out.println("Received job posting request: " + request.getTitle());
            System.out.println("User email: " + userEmail);
            
            JobPostingResponse job = jobService.createJobPosting(request, userEmail);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            System.err.println("Error creating job posting: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<JobPostingResponse> updateJobPosting(
            @PathVariable Long id,
            @RequestBody JobPostingRequest request,
            @RequestParam String userEmail) {
        try {
            JobPostingResponse job = jobService.updateJobPosting(id, request, userEmail);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobPosting(
            @PathVariable Long id,
            @RequestParam String userEmail) {
        try {
            jobService.deleteJobPosting(id, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<JobPostingResponse>> searchJobPostings(@RequestParam String q) {
        try {
            List<JobPostingResponse> jobs = jobService.searchJobPostings(q);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/company/{company}")
    public ResponseEntity<List<JobPostingResponse>> getJobPostingsByCompany(@PathVariable String company) {
        try {
            List<JobPostingResponse> jobs = jobService.getJobPostingsByCompany(company);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/type/{jobType}")
    public ResponseEntity<List<JobPostingResponse>> getJobPostingsByType(@PathVariable JobType jobType) {
        try {
            List<JobPostingResponse> jobs = jobService.getJobPostingsByType(jobType);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/experience/{experienceLevel}")
    public ResponseEntity<List<JobPostingResponse>> getJobPostingsByExperienceLevel(@PathVariable ExperienceLevel experienceLevel) {
        try {
            List<JobPostingResponse> jobs = jobService.getJobPostingsByExperienceLevel(experienceLevel);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/my-postings")
    public ResponseEntity<List<JobPostingResponse>> getMyJobPostings(@RequestParam String userEmail) {
        try {
            List<JobPostingResponse> jobs = jobService.getJobPostingsByUser(userEmail);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Job Application Endpoints
    @PostMapping("/{jobId}/apply")
    public ResponseEntity<JobApplication> applyForJob(
            @PathVariable Long jobId,
            @RequestParam String userEmail,
            @RequestBody Map<String, String> applicationData) {
        try {
            String coverLetter = applicationData.get("coverLetter");
            String resumeUrl = applicationData.get("resumeUrl");
            
            JobApplication application = jobService.applyForJob(jobId, userEmail, coverLetter, resumeUrl);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/applications/my")
    public ResponseEntity<List<JobApplication>> getMyApplications(@RequestParam String userEmail) {
        try {
            List<JobApplication> applications = jobService.getUserApplications(userEmail);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<JobApplication>> getJobApplications(
            @PathVariable Long jobId,
            @RequestParam String userEmail) {
        try {
            List<JobApplication> applications = jobService.getJobApplications(jobId, userEmail);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<JobApplication> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            @RequestParam String userEmail) {
        try {
            JobApplication application = jobService.updateApplicationStatus(applicationId, status, userEmail);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Enum endpoints for frontend
    @GetMapping("/types")
    public ResponseEntity<JobType[]> getJobTypes() {
        return ResponseEntity.ok(JobType.values());
    }
    
    @GetMapping("/experience-levels")
    public ResponseEntity<ExperienceLevel[]> getExperienceLevels() {
        return ResponseEntity.ok(ExperienceLevel.values());
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<JobStatus[]> getJobStatuses() {
        return ResponseEntity.ok(JobStatus.values());
    }
    
    @GetMapping("/application-statuses")
    public ResponseEntity<ApplicationStatus[]> getApplicationStatuses() {
        return ResponseEntity.ok(ApplicationStatus.values());
    }
} 