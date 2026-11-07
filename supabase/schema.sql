-- ====================================================================
-- Lumina Medical Spa — Supabase Appointments & Single Admin Schema
-- Run this in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/rowniscxjvtyyyawadrs/sql)
-- ====================================================================

-- 1. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_date DATE,
  preferred_time_slot TEXT,
  practitioner TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public web visitors to submit consultation requests
DROP POLICY IF EXISTS "Allow public insert to appointments" ON appointments;
CREATE POLICY "Allow public insert to appointments"
  ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading appointments for admin management
DROP POLICY IF EXISTS "Allow read appointments" ON appointments;
CREATE POLICY "Allow read appointments"
  ON appointments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow updating appointment status
DROP POLICY IF EXISTS "Allow update appointments" ON appointments;
CREATE POLICY "Allow update appointments"
  ON appointments
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);


-- 2. SINGLE ADMIN ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'super_admin',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on admin_accounts
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;

-- Allow initial single slot registration
DROP POLICY IF EXISTS "Allow insert admin_accounts" ON admin_accounts;
CREATE POLICY "Allow insert admin_accounts"
  ON admin_accounts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading admin_accounts for verification
DROP POLICY IF EXISTS "Allow select admin_accounts" ON admin_accounts;
CREATE POLICY "Allow select admin_accounts"
  ON admin_accounts
  FOR SELECT
  TO anon, authenticated
  USING (true);
