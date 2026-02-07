-- Fix Admin Password Hash
-- Run this SQL command to update the admin password to work with "admin123"
-- You can run this via MySQL command line or phpMyAdmin

UPDATE `admins` 
SET `password` = '$2y$12$H74uX9e8uQGzXxmktQXNtu1pj.mt6I67iPn2jjCWMs5yAYQpurK.W' 
WHERE `username` = 'admin' OR `email` = 'admin@civiccast.com';

-- Verify the update
SELECT `id`, `username`, `email`, `name` FROM `admins` WHERE `username` = 'admin';
