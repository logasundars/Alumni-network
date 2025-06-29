package com.alumninetwork.service;

import com.alumninetwork.dto.ProfileUpdateRequest;
import com.alumninetwork.dto.UserProfileResponse;
import com.alumninetwork.entity.User;
import com.alumninetwork.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {
    
    @Autowired
    private UserRepository userRepository;
    
    public UserProfileResponse getUserProfile(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return convertToProfileResponse(user);
        }
        throw new RuntimeException("User not found");
    }
    
    public UserProfileResponse updateUserProfile(String email, ProfileUpdateRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Update fields if provided
            if (request.getFirstName() != null) {
                user.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                user.setLastName(request.getLastName());
            }
            if (request.getBio() != null) {
                user.setBio(request.getBio());
            }
            if (request.getCurrentCompany() != null) {
                user.setCurrentCompany(request.getCurrentCompany());
            }
            if (request.getCurrentPosition() != null) {
                user.setCurrentPosition(request.getCurrentPosition());
            }
            if (request.getGraduationYear() != null) {
                user.setGraduationYear(request.getGraduationYear());
            }
            if (request.getMajor() != null) {
                user.setMajor(request.getMajor());
            }
            if (request.getLinkedinUrl() != null) {
                user.setLinkedinUrl(request.getLinkedinUrl());
            }
            if (request.getGithubUrl() != null) {
                user.setGithubUrl(request.getGithubUrl());
            }
            if (request.getPortfolioUrl() != null) {
                user.setPortfolioUrl(request.getPortfolioUrl());
            }
            
            User savedUser = userRepository.save(user);
            return convertToProfileResponse(savedUser);
        }
        throw new RuntimeException("User not found");
    }
    
    private UserProfileResponse convertToProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole().name());
        response.setBio(user.getBio());
        response.setProfilePicture(user.getProfilePicture());
        response.setCurrentCompany(user.getCurrentCompany());
        response.setCurrentPosition(user.getCurrentPosition());
        response.setGraduationYear(user.getGraduationYear());
        response.setMajor(user.getMajor());
        response.setLinkedinUrl(user.getLinkedinUrl());
        response.setGithubUrl(user.getGithubUrl());
        response.setPortfolioUrl(user.getPortfolioUrl());
        response.setIsActive(user.getIsActive());
        response.setIsEmailVerified(user.getIsEmailVerified());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
} 