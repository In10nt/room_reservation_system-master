-- Verify and Fix Guest Users
-- Run this script in MySQL Workbench

-- 1. Check current users and their roles
SELECT id, username, full_name, email, role, active, created_at 
FROM users 
ORDER BY created_at DESC;

-- 2. Check if role column is large enough (should be VARCHAR(20))
DESCRIBE users;

-- 3. Delete all GUEST users (they may have incorrect role data)
-- IMPORTANT: This will delete all guest accounts - they need to re-register
DELETE FROM users WHERE role = 'GUEST';

-- 4. Verify deletion
SELECT COUNT(*) as guest_count FROM users WHERE role = 'GUEST';

-- 5. Keep only admin/staff users
SELECT id, username, full_name, role 
FROM users 
WHERE role IN ('ADMIN', 'MANAGER', 'RECEPTIONIST');

-- After running this script:
-- 1. Restart your Spring Boot backend
-- 2. Have guests register new accounts via the customer-register.html page
-- 3. The new accounts will have the correct GUEST role with proper JWT tokens
