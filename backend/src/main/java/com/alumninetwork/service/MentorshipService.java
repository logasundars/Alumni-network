package com.alumninetwork.service;

import com.alumninetwork.dto.MentorshipDto;
import com.alumninetwork.dto.MentorshipApplicationDto;
import com.alumninetwork.dto.UserDto;
import com.alumninetwork.entity.Mentorship;
import com.alumninetwork.entity.MentorshipApplication;
import com.alumninetwork.entity.MentorshipStatus;
import com.alumninetwork.entity.ApplicationStatus;
import com.alumninetwork.entity.User;
import com.alumninetwork.repository.MentorshipRepository;
import com.alumninetwork.repository.MentorshipApplicationRepository;
import com.alumninetwork.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MentorshipService {
    
    @Autowired
    private MentorshipRepository mentorshipRepository;
    
    @Autowired
    private MentorshipApplicationRepository applicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Mentorship Operations
    
    public List<MentorshipDto> getAllMentorships() {
        return mentorshipRepository.findByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MentorshipDto> getMentorshipsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        List<Mentorship> mentorships = mentorshipRepository.findByMentorOrderByCreatedAtDesc(user.get());
        mentorships.addAll(mentorshipRepository.findByMenteeOrderByCreatedAtDesc(user.get()));
        
        return mentorships.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MentorshipDto> getMentorshipsByStatus(MentorshipStatus status) {
        return mentorshipRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public MentorshipDto createMentorship(MentorshipDto mentorshipDto) {
        Optional<User> mentor = userRepository.findById(mentorshipDto.getMentor().getId());
        Optional<User> mentee = userRepository.findById(mentorshipDto.getMentee().getId());
        
        if (mentor.isEmpty() || mentee.isEmpty()) {
            throw new RuntimeException("Mentor or mentee not found");
        }
        
        Mentorship mentorship = new Mentorship();
        mentorship.setMentor(mentor.get());
        mentorship.setMentee(mentee.get());
        mentorship.setType(mentorshipDto.getType());
        mentorship.setTitle(mentorshipDto.getTitle());
        mentorship.setDescription(mentorshipDto.getDescription());
        mentorship.setDurationMonths(mentorshipDto.getDurationMonths());
        mentorship.setMeetingFrequency(mentorshipDto.getMeetingFrequency());
        mentorship.setPreferredCommunication(mentorshipDto.getPreferredCommunication());
        mentorship.setAreasOfExpertise(mentorshipDto.getAreasOfExpertise());
        mentorship.setGoals(mentorshipDto.getGoals());
        mentorship.setStartDate(mentorshipDto.getStartDate());
        mentorship.setEndDate(mentorshipDto.getEndDate());
        mentorship.setStatus(MentorshipStatus.ACTIVE);
        
        Mentorship savedMentorship = mentorshipRepository.save(mentorship);
        return convertToDto(savedMentorship);
    }
    
    public MentorshipDto updateMentorshipStatus(Long mentorshipId, MentorshipStatus status) {
        Optional<Mentorship> mentorship = mentorshipRepository.findById(mentorshipId);
        if (mentorship.isEmpty()) {
            throw new RuntimeException("Mentorship not found");
        }
        
        Mentorship existingMentorship = mentorship.get();
        existingMentorship.setStatus(status);
        existingMentorship.setUpdatedAt(LocalDateTime.now());
        
        if (status == MentorshipStatus.COMPLETED) {
            existingMentorship.setEndDate(LocalDateTime.now());
        }
        
        Mentorship savedMentorship = mentorshipRepository.save(existingMentorship);
        return convertToDto(savedMentorship);
    }
    
    public void deleteMentorship(Long mentorshipId) {
        Optional<Mentorship> mentorship = mentorshipRepository.findById(mentorshipId);
        if (mentorship.isPresent()) {
            Mentorship existingMentorship = mentorship.get();
            existingMentorship.setIsActive(false);
            existingMentorship.setStatus(MentorshipStatus.CANCELLED);
            existingMentorship.setUpdatedAt(LocalDateTime.now());
            mentorshipRepository.save(existingMentorship);
        }
    }
    
    // Mentorship Application Operations
    
    public List<MentorshipApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::convertApplicationToDto)
                .collect(Collectors.toList());
    }
    
    public List<MentorshipApplicationDto> getApplicationsByMentor(Long mentorId) {
        Optional<User> mentor = userRepository.findById(mentorId);
        if (mentor.isEmpty()) {
            throw new RuntimeException("Mentor not found");
        }
        
        return applicationRepository.findByMentorOrderByCreatedAtDesc(mentor.get())
                .stream()
                .map(this::convertApplicationToDto)
                .collect(Collectors.toList());
    }
    
    public List<MentorshipApplicationDto> getApplicationsByApplicant(Long applicantId) {
        Optional<User> applicant = userRepository.findById(applicantId);
        if (applicant.isEmpty()) {
            throw new RuntimeException("Applicant not found");
        }
        
        return applicationRepository.findByApplicantOrderByCreatedAtDesc(applicant.get())
                .stream()
                .map(this::convertApplicationToDto)
                .collect(Collectors.toList());
    }
    
    public List<MentorshipApplicationDto> getPendingApplications() {
        return applicationRepository.findByStatusOrderByCreatedAtDesc(ApplicationStatus.PENDING)
                .stream()
                .map(this::convertApplicationToDto)
                .collect(Collectors.toList());
    }
    
    public MentorshipApplicationDto createApplication(MentorshipApplicationDto applicationDto, Long mentorshipId) {
        Optional<Mentorship> mentorship = mentorshipRepository.findById(mentorshipId);
        if (mentorship.isEmpty()) {
            throw new RuntimeException("Mentorship not found");
        }
        Optional<User> applicant = userRepository.findById(applicationDto.getApplicant().getId());
        if (applicant.isEmpty()) {
            throw new RuntimeException("Applicant not found");
        }
        // Check if application already exists for this mentorship
        List<MentorshipApplication> existing = applicationRepository.findByMentorshipOrderByCreatedAtDesc(mentorship.get());
        boolean alreadyApplied = existing.stream().anyMatch(a -> a.getApplicant().getId().equals(applicant.get().getId()) && a.getStatus() == ApplicationStatus.PENDING);
        if (alreadyApplied) {
            throw new RuntimeException("Application already exists for this mentorship");
        }
        MentorshipApplication application = new MentorshipApplication();
        application.setMentorship(mentorship.get());
        application.setMentor(mentorship.get().getMentor());
        application.setApplicant(applicant.get());
        application.setType(applicationDto.getType());
        application.setTitle(applicationDto.getTitle());
        application.setMotivation(applicationDto.getMotivation());
        application.setGoals(applicationDto.getGoals());
        application.setCurrentSkills(applicationDto.getCurrentSkills());
        application.setDesiredSkills(applicationDto.getDesiredSkills());
        application.setPreferredCommunication(applicationDto.getPreferredCommunication());
        application.setAvailability(applicationDto.getAvailability());
        application.setDurationMonths(applicationDto.getDurationMonths());
        application.setMeetingFrequency(applicationDto.getMeetingFrequency());
        application.setAdditionalNotes(applicationDto.getAdditionalNotes());
        application.setStatus(ApplicationStatus.PENDING);
        MentorshipApplication savedApplication = applicationRepository.save(application);
        return convertApplicationToDto(savedApplication);
    }

    public List<MentorshipApplicationDto> getApplicationsByMentorship(Long mentorshipId) {
        Optional<Mentorship> mentorship = mentorshipRepository.findById(mentorshipId);
        if (mentorship.isEmpty()) {
            throw new RuntimeException("Mentorship not found");
        }
        return applicationRepository.findByMentorshipOrderByCreatedAtDesc(mentorship.get())
            .stream().map(this::convertApplicationToDto).collect(Collectors.toList());
    }

    public long getRegistrationCountForMentorship(Long mentorshipId) {
        Optional<Mentorship> mentorship = mentorshipRepository.findById(mentorshipId);
        if (mentorship.isEmpty()) {
            throw new RuntimeException("Mentorship not found");
        }
        return applicationRepository.countByMentorshipAndStatus(mentorship.get(), ApplicationStatus.PENDING);
    }
    
    public MentorshipApplicationDto respondToApplication(Long applicationId, ApplicationStatus status, String response) {
        Optional<MentorshipApplication> application = applicationRepository.findById(applicationId);
        if (application.isEmpty()) {
            throw new RuntimeException("Application not found");
        }
        
        MentorshipApplication existingApplication = application.get();
        existingApplication.setStatus(status);
        existingApplication.setMentorResponse(response);
        existingApplication.setRespondedAt(LocalDateTime.now());
        existingApplication.setUpdatedAt(LocalDateTime.now());
        
        // If accepted, create a mentorship
        if (status == ApplicationStatus.ACCEPTED) {
            MentorshipDto mentorshipDto = new MentorshipDto();
            mentorshipDto.setMentor(convertUserToDto(existingApplication.getMentor()));
            mentorshipDto.setMentee(convertUserToDto(existingApplication.getApplicant()));
            mentorshipDto.setType(existingApplication.getType());
            mentorshipDto.setTitle(existingApplication.getTitle());
            mentorshipDto.setGoals(existingApplication.getGoals());
            mentorshipDto.setPreferredCommunication(existingApplication.getPreferredCommunication());
            mentorshipDto.setDurationMonths(existingApplication.getDurationMonths());
            mentorshipDto.setMeetingFrequency(existingApplication.getMeetingFrequency());
            mentorshipDto.setStartDate(LocalDateTime.now());
            
            createMentorship(mentorshipDto);
        }
        
        MentorshipApplication savedApplication = applicationRepository.save(existingApplication);
        return convertApplicationToDto(savedApplication);
    }
    
    public long getRegistrationCountForMentor(Long mentorId) {
        Optional<User> mentor = userRepository.findById(mentorId);
        if (mentor.isEmpty()) {
            throw new RuntimeException("Mentor not found");
        }
        // Count all applications for this mentor (optionally filter by status)
        return applicationRepository.countByMentorAndStatus(mentor.get(), ApplicationStatus.PENDING);
    }
    
    // Helper methods for conversion
    
    private MentorshipDto convertToDto(Mentorship mentorship) {
        MentorshipDto dto = new MentorshipDto();
        dto.setId(mentorship.getId());
        dto.setMentor(convertUserToDto(mentorship.getMentor()));
        dto.setMentee(convertUserToDto(mentorship.getMentee()));
        dto.setType(mentorship.getType());
        dto.setStatus(mentorship.getStatus());
        dto.setTitle(mentorship.getTitle());
        dto.setDescription(mentorship.getDescription());
        dto.setDurationMonths(mentorship.getDurationMonths());
        dto.setMeetingFrequency(mentorship.getMeetingFrequency());
        dto.setPreferredCommunication(mentorship.getPreferredCommunication());
        dto.setAreasOfExpertise(mentorship.getAreasOfExpertise());
        dto.setGoals(mentorship.getGoals());
        dto.setStartDate(mentorship.getStartDate());
        dto.setEndDate(mentorship.getEndDate());
        dto.setCreatedAt(mentorship.getCreatedAt());
        dto.setUpdatedAt(mentorship.getUpdatedAt());
        dto.setIsActive(mentorship.getIsActive());
        return dto;
    }
    
    private MentorshipApplicationDto convertApplicationToDto(MentorshipApplication application) {
        MentorshipApplicationDto dto = new MentorshipApplicationDto();
        dto.setId(application.getId());
        dto.setMentor(convertUserToDto(application.getMentor()));
        dto.setApplicant(convertUserToDto(application.getApplicant()));
        dto.setType(application.getType());
        dto.setStatus(application.getStatus());
        dto.setTitle(application.getTitle());
        dto.setMotivation(application.getMotivation());
        dto.setGoals(application.getGoals());
        dto.setCurrentSkills(application.getCurrentSkills());
        dto.setDesiredSkills(application.getDesiredSkills());
        dto.setPreferredCommunication(application.getPreferredCommunication());
        dto.setAvailability(application.getAvailability());
        dto.setDurationMonths(application.getDurationMonths());
        dto.setMeetingFrequency(application.getMeetingFrequency());
        dto.setAdditionalNotes(application.getAdditionalNotes());
        dto.setMentorResponse(application.getMentorResponse());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        dto.setRespondedAt(application.getRespondedAt());
        return dto;
    }
    
    private UserDto convertUserToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setBio(user.getBio());
        dto.setCurrentCompany(user.getCurrentCompany());
        dto.setCurrentPosition(user.getCurrentPosition());
        dto.setGraduationYear(user.getGraduationYear());
        dto.setMajor(user.getMajor());
        dto.setLinkedinUrl(user.getLinkedinUrl());
        dto.setGithubUrl(user.getGithubUrl());
        dto.setPortfolioUrl(user.getPortfolioUrl());
        dto.setIsActive(user.getIsActive());
        dto.setIsEmailVerified(user.getIsEmailVerified());
        return dto;
    }
} 