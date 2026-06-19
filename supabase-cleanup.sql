-- Supabase Database Cleanup & Reset Commands
-- Run these SQL commands in the Supabase SQL editor to remove all tables and policies

-- ============================================
-- OPTION 1: FULL CLEANUP (Recommended for reset)
-- ============================================
-- Drop all tables and policies in the correct order

-- Drop RLS Policies first
DROP POLICY IF EXISTS "Allow public read access on admin" ON admin;
DROP POLICY IF EXISTS "Allow public insert on admin" ON admin;
DROP POLICY IF EXISTS "Allow public update on admin" ON admin;

DROP POLICY IF EXISTS "Allow public read access on member" ON member;
DROP POLICY IF EXISTS "Allow public insert on member" ON member;
DROP POLICY IF EXISTS "Allow public update on member" ON member;

DROP POLICY IF EXISTS "Allow public read access on payment" ON payment;
DROP POLICY IF EXISTS "Allow public insert on payment" ON payment;
DROP POLICY IF EXISTS "Allow public update on payment" ON payment;

DROP POLICY IF EXISTS "Allow public read access on expense" ON expense;
DROP POLICY IF EXISTS "Allow public insert on expense" ON expense;
DROP POLICY IF EXISTS "Allow public update on expense" ON expense;

-- Drop indexes
DROP INDEX IF EXISTS idx_member_status;
DROP INDEX IF EXISTS idx_member_created_at;
DROP INDEX IF EXISTS idx_payment_member_id;
DROP INDEX IF EXISTS idx_payment_date;
DROP INDEX IF EXISTS idx_expense_date;
DROP INDEX IF EXISTS idx_expense_category;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS expense CASCADE;
DROP TABLE IF EXISTS member CASCADE;
DROP TABLE IF EXISTS admin CASCADE;

-- ============================================
-- OPTION 2: DELETE ALL DATA (Keep tables)
-- ============================================
-- Use this if you want to keep the schema but clear all data

-- TRUNCATE payment;
-- TRUNCATE expense;
-- TRUNCATE member;
-- TRUNCATE admin;

-- ============================================
-- OPTION 3: DELETE SPECIFIC TABLE DATA
-- ============================================
-- Use these individually if you only want to reset certain tables

-- DELETE FROM admin;
-- DELETE FROM member;
-- DELETE FROM payment;
-- DELETE FROM expense;

-- ============================================
-- VERIFICATION: Check if tables exist
-- ============================================
-- Run this after cleanup to verify everything is removed

-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public'
-- ORDER BY table_name;

-- Expected result: No rows (all tables deleted)
