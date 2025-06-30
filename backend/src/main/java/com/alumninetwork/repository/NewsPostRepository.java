package com.alumninetwork.repository;

import com.alumninetwork.entity.NewsPost;
import com.alumninetwork.entity.NewsStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsPostRepository extends JpaRepository<NewsPost, Long> {
    List<NewsPost> findByStatusOrderByCreatedAtDesc(NewsStatus status);
} 