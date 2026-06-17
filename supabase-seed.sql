-- ========================================
-- Adnan Fitness Club - Admin User Setup
-- ========================================
-- Copy and paste this into Supabase SQL Editor
-- AFTER running the schema.sql file

-- ========================================
-- DEFAULT ADMIN CREDENTIALS
-- Username: admin
-- Password: admin123
-- ========================================
-- IMPORTANT: Change these credentials after first login!

-- Insert Default Admin User (Password: admin123)
INSERT INTO "Admin" ("id", "username", "password", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'admin', '$2b$10$/zFGyecNBsK9zsg2jP/nrOYF7UDySVY8CNk58KZVVXEwoB41H5IEO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========================================
-- HOW TO CREATE A NEW ADMIN USER
-- ========================================
-- To create a new admin with custom credentials:
-- 1. Generate a bcrypt hash for your password
-- 2. Use the following SQL template:

-- INSERT INTO "Admin" ("id", "username", "password", "createdAt", "updatedAt")
-- VALUES (gen_random_uuid(), 'YOUR_USERNAME', 'YOUR_BCRYPT_HASH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========================================
-- VERIFY ADMIN USER CREATION
-- ========================================
-- Run this to verify the admin user was created:
SELECT id, username, createdAt FROM "Admin";

-- ========================================
-- HOW TO CHANGE ADMIN PASSWORD
-- ========================================
-- Update admin password:
-- UPDATE "Admin" SET password = 'YOUR_NEW_BCRYPT_HASH' WHERE username = 'admin';

-- ========================================
-- SAMPLE MEMBER DATA (Optional)
-- ========================================
-- Uncomment to add sample member data:

-- INSERT INTO "Member" ("id", "name", "email", "phone", "membershipFee", "status")
-- VALUES (gen_random_uuid(), 'John Doe', 'john@example.com', '+1234567890', 50.00, 'active');

-- INSERT INTO "Payment" ("id", "amount", "date", "memberId", "description")
-- VALUES (gen_random_uuid(), 50.00, CURRENT_TIMESTAMP, (SELECT id FROM "Member" WHERE name = 'John Doe' LIMIT 1), 'Monthly Membership Fee');