package com.alumninetwork.controller;

import com.alumninetwork.dto.*;
import com.alumninetwork.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:3000")
public class NewsController {
    @Autowired
    private NewsService newsService;

    @GetMapping
    public List<NewsPostResponse> getAllNewsPosts() {
        return newsService.getAllNewsPosts();
    }

    @PostMapping
    public NewsPostResponse createNewsPost(@RequestBody NewsPostRequest request, Principal principal) {
        return newsService.createNewsPost(request, principal.getName());
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
} 