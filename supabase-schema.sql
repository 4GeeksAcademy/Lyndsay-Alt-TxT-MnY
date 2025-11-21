-- BillTrack Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT,
  country_code TEXT DEFAULT '+1',
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID DEFAULT uuid_generate_v4(), -- For MVP, we'll use a default user
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  due_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('utilities', 'rent_mortgage', 'insurance', 'subscriptions', 'credit_cards', 'loans', 'other')),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('paid', 'due_soon', 'overdue', 'upcoming')),
  sms_enabled BOOLEAN DEFAULT FALSE,
  payment_date DATE,
  last_reminder_sent TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID DEFAULT '00000000-0000-0000-0000-000000000001', -- For MVP, use default user
  gift_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  event_type TEXT NOT NULL CHECK (event_type IN ('birthday', 'christmas', 'anniversary', 'graduation', 'wedding', 'baby_shower', 'other')),
  event_date DATE NOT NULL,
  purchased BOOLEAN DEFAULT FALSE,
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to bills table
DROP TRIGGER IF EXISTS update_bills_updated_at ON bills;
CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON bills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to gifts table
DROP TRIGGER IF EXISTS update_gifts_updated_at ON gifts;
CREATE TRIGGER update_gifts_updated_at
  BEFORE UPDATE ON gifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_category ON bills(category);
CREATE INDEX IF NOT EXISTS idx_gifts_user_id ON gifts(user_id);
CREATE INDEX IF NOT EXISTS idx_gifts_event_date ON gifts(event_date);
CREATE INDEX IF NOT EXISTS idx_gifts_event_type ON gifts(event_type);
CREATE INDEX IF NOT EXISTS idx_gifts_purchased ON gifts(purchased);

-- Insert a default user for MVP (single-user mode)
INSERT INTO users (id, phone_number, country_code, phone_verified)
VALUES ('00000000-0000-0000-0000-000000000001', NULL, '+1', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert access for all users" ON users;
DROP POLICY IF EXISTS "Enable update access for all users" ON users;
DROP POLICY IF EXISTS "Enable delete access for all users" ON users;

DROP POLICY IF EXISTS "Enable read access for all users" ON bills;
DROP POLICY IF EXISTS "Enable insert access for all users" ON bills;
DROP POLICY IF EXISTS "Enable update access for all users" ON bills;
DROP POLICY IF EXISTS "Enable delete access for all users" ON bills;

-- Users table policies: Allow public access for MVP (single-user mode)
-- In production, you would use auth.uid() to restrict access
CREATE POLICY "Enable read access for all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON users
  FOR DELETE USING (true);

-- Bills table policies: Allow public access for MVP (single-user mode)
-- In production, you would use: user_id = auth.uid()
CREATE POLICY "Enable read access for all users" ON bills
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON bills
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON bills
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON bills
  FOR DELETE USING (true);

-- Gifts table policies: Allow public access for MVP (single-user mode)
DROP POLICY IF EXISTS "Enable read access for all users" ON gifts;
DROP POLICY IF EXISTS "Enable insert access for all users" ON gifts;
DROP POLICY IF EXISTS "Enable update access for all users" ON gifts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON gifts;

CREATE POLICY "Enable read access for all users" ON gifts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON gifts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON gifts
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON gifts
  FOR DELETE USING (true);
