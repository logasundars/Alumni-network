package com.alumninetwork.service;

import com.alumninetwork.dto.*;
import com.alumninetwork.entity.*;
import com.alumninetwork.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NewsService {
    @Autowired
    private NewsPostRepository newsPostRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private UserRepository userRepository;

    public List<NewsPostResponse> getAllNewsPosts() {
        return newsPostRepository.findByStatusOrderByCreatedAtDesc(NewsStatus.PUBLISHED)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public NewsPostResponse createNewsPost(NewsPostRequest request, User author) {
        NewsPost post = new NewsPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        post.setImageUrl(request.getImageUrl());
        post.setCategory(NewsCategory.valueOf(request.getCategory()));
        post.setAuthor(author);
        newsPostRepository.save(post);
        return toResponse(post);
    }

    public void likePost(Long postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        NewsPost post = newsPostRepository.findById(postId).orElseThrow();
        if (likeRepository.findByUserAndNewsPost(user, post).isEmpty()) {
            Like like = new Like();
            like.setUser(user);
            like.setNewsPost(post);
            likeRepository.save(like);
        }
    }

    public void unlikePost(Long postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        NewsPost post = newsPostRepository.findById(postId).orElseThrow();
        likeRepository.findByUserAndNewsPost(user, post).ifPresent(likeRepository::delete);
    }

    public CommentResponse addComment(Long postId, CommentRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        NewsPost post = newsPostRepository.findById(postId).orElseThrow();
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAuthor(user);
        comment.setNewsPost(post);
        commentRepository.save(comment);
        return toCommentResponse(comment);
    }

    public List<CommentResponse> getComments(Long postId) {
        return commentRepository.findByNewsPostIdOrderByCreatedAtAsc(postId)
                .stream().map(this::toCommentResponse).collect(Collectors.toList());
    }

    private NewsPostResponse toResponse(NewsPost post) {
        NewsPostResponse resp = new NewsPostResponse();
        resp.setId(post.getId());
        resp.setTitle(post.getTitle());
        resp.setContent(post.getContent());
        resp.setSummary(post.getSummary());
        resp.setImageUrl(post.getImageUrl());
        resp.setCategory(post.getCategory());
        resp.setStatus(post.getStatus());
        resp.setIsFeatured(post.getIsFeatured());
        resp.setViewCount(post.getViewCount());
        resp.setAuthorName(post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName());
        resp.setAuthorId(post.getAuthor().getId());
        resp.setCreatedAt(post.getCreatedAt());
        resp.setUpdatedAt(post.getUpdatedAt());
        resp.setLikeCount(post.getLikes().size());
        resp.setCommentCount(post.getComments().size());
        resp.setComments(post.getComments().stream().map(this::toCommentResponse).collect(Collectors.toList()));
        return resp;
    }

    private CommentResponse toCommentResponse(Comment comment) {
        CommentResponse resp = new CommentResponse();
        resp.setId(comment.getId());
        resp.setContent(comment.getContent());
        resp.setAuthorName(comment.getAuthor().getFirstName() + " " + comment.getAuthor().getLastName());
        resp.setAuthorId(comment.getAuthor().getId());
        resp.setCreatedAt(comment.getCreatedAt());
        return resp;
    }
} 