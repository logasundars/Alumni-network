-- Alumni Network Database Schema
-- MySQL 8.0+

-- Create database
CREATE DATABASE IF NOT EXISTS alumni_network;
USE alumni_network;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('STUDENT', 'ALUMNI', 'ADMIN') NOT NULL,
    bio TEXT,
    profile_picture VARCHAR(200),
    current_company VARCHAR(100),
    current_position VARCHAR(100),
    graduation_year VARCHAR(100),
    major VARCHAR(100),
    linkedin_url VARCHAR(200),
    github_url VARCHAR(200),
    portfolio_url VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_company (current_company),
    INDEX idx_graduation_year (graduation_year),
    INDEX idx_major (major)
);

-- Events table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(200),
    virtual_meeting_link VARCHAR(500),
    event_type ENUM('NETWORKING', 'WORKSHOP', 'SEMINAR', 'CONFERENCE', 'CAREER_FAIR', 'SOCIAL_GATHERING', 'MENTORSHIP_SESSION', 'ALUMNI_REUNION', 'GUEST_LECTURE', 'HACKATHON', 'OTHER') NOT NULL,
    status ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED') DEFAULT 'UPCOMING',
    image_url VARCHAR(200),
    max_attendees INT,
    is_registration_required BOOLEAN DEFAULT FALSE,
    is_virtual BOOLEAN DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_start_time (start_time),
    INDEX idx_event_type (event_type),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_location (location)
);

-- Event registrations table
CREATE TABLE event_registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'WAITLISTED') DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (user_id, event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_status (status)
);

-- Job postings table
CREATE TABLE job_postings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    job_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE', 'HYBRID') NOT NULL,
    experience_level ENUM('ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR', 'EXECUTIVE') NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(50) DEFAULT 'USD',
    application_url VARCHAR(200),
    contact_email VARCHAR(200),
    status ENUM('ACTIVE', 'CLOSED', 'EXPIRED', 'DRAFT', 'ARCHIVED') DEFAULT 'ACTIVE',
    application_deadline TIMESTAMP,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_company (company),
    INDEX idx_location (location),
    INDEX idx_job_type (job_type),
    INDEX idx_experience_level (experience_level),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_application_deadline (application_deadline)
);

-- Job applications table
CREATE TABLE job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_posting_id BIGINT NOT NULL,
    cover_letter TEXT,
    resume_url VARCHAR(200),
    status ENUM('PENDING', 'REVIEWING', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFER_EXTENDED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (user_id, job_posting_id),
    INDEX idx_user_id (user_id),
    INDEX idx_job_posting_id (job_posting_id),
    INDEX idx_status (status)
);

-- News posts table
CREATE TABLE news_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary VARCHAR(500),
    image_url VARCHAR(200),
    category ENUM('CAREER_DEVELOPMENT', 'INDUSTRY_NEWS', 'ALUMNI_SUCCESS', 'UNIVERSITY_UPDATES', 'TECHNOLOGY', 'BUSINESS', 'EDUCATION', 'NETWORKING', 'MENTORSHIP', 'EVENTS', 'GENERAL') NOT NULL,
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED') DEFAULT 'PUBLISHED',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_is_featured (is_featured),
    INDEX idx_created_at (created_at)
);

-- Comments table
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    news_post_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_post_id) REFERENCES news_posts(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_news_post_id (news_post_id),
    INDEX idx_created_at (created_at)
);

-- Likes table
CREATE TABLE likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    news_post_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_post_id) REFERENCES news_posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, news_post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_news_post_id (news_post_id)
);

-- Mentorships table
CREATE TABLE mentorships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    expertise VARCHAR(500),
    availability VARCHAR(500),
    status ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    type ENUM('CAREER_GUIDANCE', 'TECHNICAL_SKILLS', 'LEADERSHIP', 'ENTREPRENEURSHIP', 'NETWORKING', 'INTERVIEW_PREPARATION', 'RESUME_REVIEW', 'PROJECT_GUIDANCE', 'GENERAL') NOT NULL,
    max_mentees INT DEFAULT 5,
    current_mentees INT DEFAULT 0,
    mentor_id BIGINT NOT NULL,
    mentee_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_mentor_id (mentor_id),
    INDEX idx_mentee_id (mentee_id),
    INDEX idx_status (status),
    INDEX idx_type (type)
);

-- Insert sample data
INSERT INTO users (username, email, password, first_name, last_name, role, bio, current_company, current_position, graduation_year, major) VALUES
('john_doe', 'john.doe@email.com', '$2a$10$encrypted_password_hash', 'John', 'Doe', 'ALUMNI', 'Software engineer with 5+ years of experience in full-stack development.', 'Tech Corp', 'Senior Software Engineer', '2019', 'Computer Science'),
('jane_smith', 'jane.smith@email.com', '$2a$10$encrypted_password_hash', 'Jane', 'Smith', 'ALUMNI', 'Product manager passionate about creating user-centric solutions.', 'Innovation Inc', 'Product Manager', '2020', 'Business Administration'),
('mike_student', 'mike.student@email.com', '$2a$10$encrypted_password_hash', 'Mike', 'Johnson', 'STUDENT', 'Final year computer science student interested in AI and machine learning.', NULL, NULL, '2024', 'Computer Science'),
('sarah_alumni', 'sarah.alumni@email.com', '$2a$10$encrypted_password_hash', 'Sarah', 'Wilson', 'ALUMNI', 'Data scientist working on cutting-edge machine learning projects.', 'DataTech', 'Lead Data Scientist', '2018', 'Statistics');

-- Insert sample events
INSERT INTO events (title, description, start_time, end_time, location, event_type, user_id) VALUES
('Alumni Networking Mixer', 'Join fellow alumni for an evening of networking and career discussions.', '2024-02-15 18:00:00', '2024-02-15 21:00:00', 'Downtown Conference Center', 'NETWORKING', 1),
('Tech Career Workshop', 'Learn about the latest trends in technology and how to advance your career.', '2024-02-20 14:00:00', '2024-02-20 17:00:00', 'University Tech Building', 'WORKSHOP', 2),
('Annual Alumni Reunion', 'Celebrate our community and reconnect with old friends and classmates.', '2024-03-10 19:00:00', '2024-03-10 23:00:00', 'Grand Hotel Ballroom', 'ALUMNI_REUNION', 1);

-- Insert sample job postings
INSERT INTO job_postings (title, description, company, location, job_type, experience_level, user_id) VALUES
('Senior Software Engineer', 'We are looking for a talented software engineer to join our growing team.', 'Tech Corp', 'San Francisco, CA', 'FULL_TIME', 'SENIOR', 1),
('Product Manager Intern', 'Great opportunity for students to gain real-world product management experience.', 'Innovation Inc', 'Remote', 'INTERNSHIP', 'ENTRY_LEVEL', 2),
('Data Scientist', 'Join our data science team and work on exciting machine learning projects.', 'DataTech', 'New York, NY', 'FULL_TIME', 'MID_LEVEL', 4);

-- Insert sample news posts
INSERT INTO news_posts (title, content, category, user_id) VALUES
('Alumni Success Story: From Student to CEO', 'Read about how our alumni John Doe built a successful tech startup...', 'ALUMNI_SUCCESS', 1),
('Latest Trends in Software Development', 'Explore the newest technologies and methodologies shaping the industry...', 'TECHNOLOGY', 2),
('Career Tips for Recent Graduates', 'Essential advice for navigating the job market and building your career...', 'CAREER_DEVELOPMENT', 3);

-- Insert sample mentorships
INSERT INTO mentorships (title, description, expertise, type, mentor_id) VALUES
('Career Guidance for Tech Students', 'Get personalized advice on building your tech career from an experienced professional.', 'Software Development, Career Planning, Interview Preparation', 'CAREER_GUIDANCE', 1),
('Data Science Mentorship', 'Learn about data science, machine learning, and how to break into the field.', 'Machine Learning, Data Analysis, Python, Statistics', 'TECHNICAL_SKILLS', 4); 