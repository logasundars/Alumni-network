package com.alumninetwork.controller;

import com.alumninetwork.dto.ProfileUpdateRequest;
import com.alumninetwork.dto.UserProfileResponse;
import com.alumninetwork.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import org.springframework.http.HttpStatus;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(
    origins = "http://localhost:3000",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS}
)
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

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("email") String email, @RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("No image uploaded");
        }
        try {
            // Create uploads directory if it doesn't exist
            String uploadDir = "uploads";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // Generate unique filename
            String ext = StringUtils.getFilenameExtension(image.getOriginalFilename());
            String filename = UUID.randomUUID().toString() + (ext != null ? "." + ext : "");
            Path filepath = Paths.get(uploadDir, filename);
            Files.copy(image.getInputStream(), filepath);

            // Build image URL (assuming server runs at localhost:8080)
            String imageUrl = "/uploads/" + filename;

            // Optionally update user's profilePicture field here (or let frontend call update profile)
            // profileService.updateProfilePicture(email, imageUrl);

            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }
} 