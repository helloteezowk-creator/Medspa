-- ============================================================
-- LUMINA MEDICAL SPA - HOSTINGER MySQL DATABASE SCHEMA
-- Create these tables in Hostinger hPanel -> phpMyAdmin
-- ============================================================

CREATE DATABASE IF NOT EXISTS lumina_medspa DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lumina_medspa;

-- 1. Consultations Table (Stores all patient booking inquiries)
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    treatments TEXT NOT NULL,
    preferred_clinician VARCHAR(100) DEFAULT 'First Available Master Clinician',
    preferred_date VARCHAR(30) NOT NULL,
    preferred_time VARCHAR(30) NOT NULL,
    notes TEXT,
    status ENUM('new', 'contacted', 'scheduled', 'completed', 'cancelled') DEFAULT 'new',
    estimated_value DECIMAL(10,2) DEFAULT 450.00,
    source VARCHAR(100) DEFAULT 'Website Booking Form',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Verified Reviews Table (Anti-spam patient testimonials)
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    author_name VARCHAR(60) NOT NULL,
    author_location VARCHAR(60) DEFAULT 'Beverly Hills, CA',
    treatment VARCHAR(100) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(500) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    status ENUM('published', 'pending', 'flagged') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Users Table (Patient accounts)
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    role ENUM('patient', 'admin') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Administrator Account
INSERT IGNORE INTO users (user_id, email, display_name, role)
VALUES ('admin-root', 'helloteezowk@gmail.com', 'Clinic Administrator', 'admin');
