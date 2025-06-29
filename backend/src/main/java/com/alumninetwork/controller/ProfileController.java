package com.alumninetwork.controller;

import com.alumninetwork.dto.ProfileUpdateRequest;
import com.alumninetwork.dto.UserProfileResponse;
import com.alumninetwork.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;
    
    @GetMapping
    public ResponseEntity<?> getUserProfile(@RequestParam String email) {
        try {
            UserProfileResponse profile = profileService.getUserProfile(email);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping
    public ResponseEntity<?> updateUserProfile(@RequestParam String email, @RequestBody ProfileUpdateRequest request) {
        try {
            UserProfileResponse updatedProfile = profileService.updateUserProfile(email, request);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 