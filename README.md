# Alumni Network Platform

A comprehensive alumni networking platform built with React, Spring Boot, and MySQL.

## 🚀 Features

### For Students
- Event Calendar with alumni-hosted events
- Job Opportunities from alumni
- Profile Settings
- News Feed with like/comment functionality
- Mentor Connection

### For Alumni
- Event Management & Calendar
- Job Posting Platform
- News Sharing
- Profile Settings
- Mentor Creation & Management
- Student Guidance Tools

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for components
- React Router for navigation
- Axios for API calls
- Framer Motion for animations
- React Query for state management

### Backend
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven for dependency management

### Database
- MySQL 8.0

## 📁 Project Structure

```
alumni-network/
├── frontend/                 # React application
├── backend/                  # Spring Boot application
├── database/                 # SQL scripts
└── docs/                     # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alumni-network
   ```

2. **Database Setup**
   ```bash
   # Start MySQL and create database
   mysql -u root -p
   source database/schema.sql;
   ```

3. **Backend Setup**
   ```