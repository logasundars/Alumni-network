package com.alumninetwork.dto;

import com.alumninetwork.entity.NewsCategory;

public class NewsPostRequest {
    private String title;
    private String content;
    private String summary;
    private String imageUrl;
    private NewsCategory category;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public NewsCategory getCategory() { return category; }
    public void setCategory(NewsCategory category) { this.category = category; }
} 