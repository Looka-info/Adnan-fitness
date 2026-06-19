-- Supabase Database Schema Migration
-- Cleaned PostgreSQL schema optimized for Supabase
-- Run these SQL commands in the Supabase SQL editor

-- Create Admin table
CREATE TABLE IF NOT EXISTS admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Member table
CREATE TABLE IF NOT EXISTS member (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  picture TEXT,
  details TEXT,
  membership_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  last_payment_date TIMESTAMPTZ,
  membership_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Payment table
CREATE TABLE IF NOT EXISTS payment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10, 2) NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  description TEXT,
  member_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_payment_member FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE
);

-- Create Expense table
CREATE TABLE IF NOT EXISTS expense (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_member_status ON member(status);
CREATE INDEX idx_member_created_at ON member(created_at);
CREATE INDEX idx_payment_member_id ON payment(member_id);
CREATE INDEX idx_payment_date ON payment(date);
CREATE INDEX idx_expense_date ON expense(date);
CREATE INDEX idx_expense_category ON expense(category);

-- Enable Row Level Security (RLS) - optional but recommended
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE member ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access on admin" ON admin FOR SELECT USING (true);
CREATE POLICY "Allow public insert on admin" ON admin FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on admin" ON admin FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on admin" ON admin FOR DELETE USING (true);

CREATE POLICY "Allow public read access on member" ON member FOR SELECT USING (true);
CREATE POLICY "Allow public insert on member" ON member FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on member" ON member FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on member" ON member FOR DELETE USING (true);

CREATE POLICY "Allow public read access on payment" ON payment FOR SELECT USING (true);
CREATE POLICY "Allow public insert on payment" ON payment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on payment" ON payment FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on payment" ON payment FOR DELETE USING (true);

CREATE POLICY "Allow public read access on expense" ON expense FOR SELECT USING (true);
CREATE POLICY "Allow public insert on expense" ON expense FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on expense" ON expense FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on expense" ON expense FOR DELETE USING (true);
