package com.alumninetwork.repository;

import com.alumninetwork.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByNewsPostIdOrderByCreatedAtAsc(Long newsPostId);
} 