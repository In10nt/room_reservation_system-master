-- RESET DATABASE AND LET APPLICATION CREATE USERS
-- Run this in MySQL Workbench

USE ocean_view_resort;

-- Delete all existing users
DELETE FROM users;

-- Verify users are deleted
SELECT COUNT(*) as user_count FROM users;

-- Now RESTART your backend application
-- The DataInitializer will automatically create the default users with correct passwords
