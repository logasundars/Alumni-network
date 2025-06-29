package com.alumninetwork;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ApiController {
    
    @GetMapping("/api")
    public String hello() {
        return "Hello from backend!";
    }
    
    @GetMapping("/api/test")
    public String test() {
        return "Backend test endpoint is working!";
    }
} 