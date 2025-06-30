package com.alumninetwork.repository;

import com.alumninetwork.entity.Like;
import com.alumninetwork.entity.NewsPost;
import com.alumninetwork.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndNewsPost(User user, NewsPost newsPost);
    int countByNewsPost(NewsPost newsPost);
} 