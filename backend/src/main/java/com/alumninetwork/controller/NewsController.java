package com.alumninetwork.controller;

import com.alumninetwork.dto.*;
import com.alumninetwork.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.List;
import com.alumninetwork.entity.User;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:3000")
public class NewsController {
    @Autowired
    private NewsService newsService;

    @Value("${newsapi.key}")
    private String newsApiKey;

    @GetMapping
    public List<NewsPostResponse> getAllNewsPosts() {
        return newsService.getAllNewsPosts();
    }

    @PostMapping
    public NewsPostResponse createNewsPost(@RequestBody NewsPostRequest request, Principal principal) {
        User user = (User) ((Authentication) principal).getPrincipal();
        return newsService.createNewsPost(request, user);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id, Principal principal) {
        newsService.likePost(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<?> unlikePost(@PathVariable Long id, Principal principal) {
        newsService.unlikePost(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/comment")
    public CommentResponse addComment(@PathVariable Long id, @RequestBody CommentRequest request, Principal principal) {
        return newsService.addComment(id, request, principal.getName());
    }

    @GetMapping("/{id}/comments")
    public List<CommentResponse> getComments(@PathVariable Long id) {
        return newsService.getComments(id);
    }

    @GetMapping("/external-news")
    public ResponseEntity<?> getExternalNews() {
        String url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=" + newsApiKey;
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch external news");
        }
    }
} 