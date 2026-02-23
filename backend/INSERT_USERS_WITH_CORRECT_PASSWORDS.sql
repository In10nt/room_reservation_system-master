-- Insert users with correctly hashed passwords
-- These passwords are BCrypt hashed and will work with the application

USE ocean_view_resort;

-- Delete existing users first
DELETE FROM users;

-- Insert admin user (username: admin, password: admin123)
INSERT INTO users (username, password, full_name, role, active, created_at) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Administrator', 'ADMIN', TRUE, NOW());

-- Insert receptionist user (username: receptionist, password: recep123)
INSERT INTO users (username, password, full_name, role, active, created_at) 
VALUES ('receptionist', '$2a$10$DkS9y3o5wNh8l1gEKoxP4OvZWqTlpeQeCOZzhJ6x9JYIbdqLcbvVe', 'Front Desk Receptionist', 'RECEPTIONIST', TRUE, NOW());

-- Insert manager user (username: manager, password: manager123)
INSERT INTO users (username, password, full_name, role, active, created_at) 
VALUES ('manager', '$2a$10$3i8LooNauJiRB5fZ7.qtqOqHpjt8W7PqCKFzxO0FcP9nh2ZpV/7Zu', 'Hotel Manager', 'MANAGER', TRUE, NOW());

-- Verify users were created
SELECT id, username, full_name, role, active FROM users;
