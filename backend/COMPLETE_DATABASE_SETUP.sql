-- ============================================
-- Ocean View Resort - Complete Database Setup
-- ============================================
-- This script creates the database, tables, and inserts default users
-- Run this in MySQL Workbench or MySQL Command Line Client

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS ocean_view_resort;

-- Step 2: Use the database
USE ocean_view_resort;

-- Step 3: Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS users;

-- Step 4: Create Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'RECEPTIONIST', 'MANAGER') NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 5: Create Reservations Table
CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_number VARCHAR(255) NOT NULL UNIQUE,
    guest_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_number VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    room_type ENUM('STANDARD', 'DELUXE', 'SUITE', 'FAMILY', 'PRESIDENTIAL') NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status ENUM('CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW') DEFAULT 'CONFIRMED',
    number_of_guests INT,
    special_requests VARCHAR(500),
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reservation_number (reservation_number),
    INDEX idx_guest_name (guest_name),
    INDEX idx_check_in_date (check_in_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 6: Insert Default Users
-- Note: These passwords are BCrypt hashed versions of the plain text passwords
-- admin123 -> $2a$10$xqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxqxq
-- recep123 -> $2a$10$yqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyqyq
-- manager123 -> $2a$10$zqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzqzq

-- Admin User (username: admin, password: admin123)
INSERT INTO users (username, password, full_name, role, active, created_at) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator', 'ADMIN', TRUE, NOW());

-- Receptionist User (username: receptionist, password: recep123)
INSERT INTO users (username, password, full_name, role, active, created_at) 
VALUES ('receptionist', '$2a$10$DkS9y3o5wNh8l1gEKoxP4OvZWqTlpeQeCOZzhJ6x9JYIbdqLcbvVe', 'Front Desk Receptionist', 'RECEPTIONIST', TRUE, NOW());

-- Manager User (username: manager, password: manager123)
INSERT INTO users (username, password, full_name, role, active, created_at) 
VALUES ('manager', '$2a$10$3i8LooNauJiRB5fZ7.qtqOqHpjt8W7PqCKFzxO0FcP9nh2ZpV/7Zu', 'Hotel Manager', 'MANAGER', TRUE, NOW());

-- Step 7: Insert Sample Reservations (Optional - for testing)
INSERT INTO reservations (reservation_number, guest_name, address, contact_number, email, room_type, check_in_date, check_out_date, status, number_of_guests, total_amount, created_at, updated_at)
VALUES 
('RES1001', 'John Doe', '123 Main St, Colombo', '0771234567', 'john.doe@email.com', 'DELUXE', '2026-03-01', '2026-03-05', 'CONFIRMED', 2, 32000.00, NOW(), NOW()),
('RES1002', 'Jane Smith', '456 Beach Rd, Galle', '0772345678', 'jane.smith@email.com', 'SUITE', '2026-03-10', '2026-03-15', 'CONFIRMED', 2, 60000.00, NOW(), NOW()),
('RES1003', 'Bob Johnson', '789 Hill St, Kandy', '0773456789', 'bob.johnson@email.com', 'FAMILY', '2026-03-20', '2026-03-25', 'CONFIRMED', 4, 75000.00, NOW(), NOW());

-- Step 8: Verify Setup
SELECT 'Database setup completed successfully!' AS Status;

-- Show created tables
SHOW TABLES;

-- Show users count
SELECT COUNT(*) AS total_users FROM users;

-- Show reservations count
SELECT COUNT(*) AS total_reservations FROM reservations;

-- Display all users
SELECT id, username, full_name, role, active FROM users;

-- Display all reservations
SELECT id, reservation_number, guest_name, room_type, check_in_date, check_out_date, status, total_amount FROM reservations;

-- ============================================
-- Room Type Pricing Reference
-- ============================================
-- STANDARD: LKR 5,000 per night
-- DELUXE: LKR 8,000 per night
-- SUITE: LKR 12,000 per night
-- FAMILY: LKR 15,000 per night
-- PRESIDENTIAL: LKR 25,000 per night

-- ============================================
-- Default Login Credentials
-- ============================================
-- Admin:
--   Username: admin
--   Password: admin123
--
-- Receptionist:
--   Username: receptionist
--   Password: recep123
--
-- Manager:
--   Username: manager
--   Password: manager123
-- ============================================
