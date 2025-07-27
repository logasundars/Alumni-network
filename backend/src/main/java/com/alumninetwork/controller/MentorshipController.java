package com.alumninetwork.controller;

import com.alumninetwork.dto.MentorshipDto;
import com.alumninetwork.dto.MentorshipApplicationDto;
import com.alumninetwork.entity.ApplicationStatus;
import com.alumninetwork.entity.MentorshipStatus;
import com.alumninetwork.service.MentorshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentorship")
@CrossOrigin(origins = "http://localhost:3000")
public class MentorshipController {
    
    @Autowired
    private MentorshipService mentorshipService;
    
    // Mentorship endpoints
    
    @GetMapping("/all")
    public ResponseEntity<List<MentorshipDto>> getAllMentorships() {
        try {
            List<MentorshipDto> mentorships = mentorshipService.getAllMentorships();
            return ResponseEntity.ok(mentorships);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MentorshipDto>> getMentorshipsByUser(@PathVariable Long userId) {
        try {
            List<MentorshipDto> mentorships = mentorshipService.getMentorshipsByUser(userId);
            return ResponseEntity.ok(mentorships);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MentorshipDto>> getMentorshipsByStatus(@PathVariable MentorshipStatus status) {
        try {
            List<MentorshipDto> mentorships = mentorshipService.getMentorshipsByStatus(status);
            return ResponseEntity.ok(mentorships);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/create")
    public ResponseEntity<MentorshipDto> createMentorship(@RequestBody MentorshipDto mentorshipDto) {
        try {
            MentorshipDto createdMentorship = mentorshipService.createMentorship(mentorshipDto);
            return ResponseEntity.ok(createdMentorship);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{mentorshipId}/status")
    public ResponseEntity<MentorshipDto> updateMentorshipStatus(
            @PathVariable Long mentorshipId, 
            @RequestParam MentorshipStatus status) {
        try {
            MentorshipDto updatedMentorship = mentorshipService.updateMentorshipStatus(mentorshipId, status);
            return ResponseEntity.ok(updatedMentorship);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{mentorshipId}")
    public ResponseEntity<Void> deleteMentorship(@PathVariable Long mentorshipId) {
        try {
            mentorshipService.deleteMentorship(mentorshipId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Mentorship Application endpoints
    
    @GetMapping("/applications/all")
    public ResponseEntity<List<MentorshipApplicationDto>> getAllApplications() {
        try {
            List<MentorshipApplicationDto> applications = mentorshipService.getAllApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/applications/mentor/{mentorId}")
    public ResponseEntity<List<MentorshipApplicationDto>> getApplicationsByMentor(@PathVariable Long mentorId) {
        try {
            List<MentorshipApplicationDto> applications = mentorshipService.getApplicationsByMentor(mentorId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/applications/applicant/{applicantId}")
    public ResponseEntity<List<MentorshipApplicationDto>> getApplicationsByApplicant(@PathVariable Long applicantId) {
        try {
            List<MentorshipApplicationDto> applications = mentorshipService.getApplicationsByApplicant(applicantId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/applications/pending")
    public ResponseEntity<List<MentorshipApplicationDto>> getPendingApplications() {
        try {
            List<MentorshipApplicationDto> applications = mentorshipService.getPendingApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/applications/create/{mentorshipId}")
    public ResponseEntity<MentorshipApplicationDto> createApplicationForMentorship(@RequestBody MentorshipApplicationDto applicationDto, @PathVariable Long mentorshipId) {
        try {
            MentorshipApplicationDto createdApplication = mentorshipService.createApplication(applicationDto, mentorshipId);
            return ResponseEntity.ok(createdApplication);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/applications/mentorship/{mentorshipId}")
    public ResponseEntity<List<MentorshipApplicationDto>> getApplicationsByMentorship(@PathVariable Long mentorshipId) {
        try {
            List<MentorshipApplicationDto> applications = mentorshipService.getApplicationsByMentorship(mentorshipId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/applications/{applicationId}/respond")
    public ResponseEntity<MentorshipApplicationDto> respondToApplication(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String response) {
        try {
            MentorshipApplicationDto updatedApplication = mentorshipService.respondToApplication(applicationId, status, response);
            return ResponseEntity.ok(updatedApplication);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/applications/count/{mentorId}")
    public ResponseEntity<Long> getRegistrationCountForMentor(@PathVariable Long mentorId) {
        try {
            long count = mentorshipService.getRegistrationCountForMentor(mentorId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/applications/count/mentorship/{mentorshipId}")
    public ResponseEntity<Long> getRegistrationCountForMentorship(@PathVariable Long mentorshipId) {
        try {
            long count = mentorshipService.getRegistrationCountForMentorship(mentorshipId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Utility endpoints
    
    @GetMapping("/types")
    public ResponseEntity<com.alumninetwork.entity.MentorshipType[]> getMentorshipTypes() {
        return ResponseEntity.ok(com.alumninetwork.entity.MentorshipType.values());
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<MentorshipStatus[]> getMentorshipStatuses() {
        return ResponseEntity.ok(MentorshipStatus.values());
    }
    
    @GetMapping("/application-statuses")
    public ResponseEntity<ApplicationStatus[]> getApplicationStatuses() {
        return ResponseEntity.ok(ApplicationStatus.values());
    }
} 