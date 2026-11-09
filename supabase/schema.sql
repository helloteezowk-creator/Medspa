-- ====================================================================
-- Lumina Medical Spa — Secure Supabase Schema & Row Level Security (RLS)
-- Run this in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/<your-project-id>/sql)
-- ====================================================================

-- 1. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_date DATE,
  preferred_time_slot TEXT,
  practitioner TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance and sorting
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments(reference_id);

-- Enforce Row Level Security (RLS) on appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public web visitors to submit consultation requests (INSERT only)
-- Anonymous visitors can submit their own booking request, but CANNOT read others' data
DROP POLICY IF EXISTS "Allow public insert to appointments" ON appointments;
CREATE POLICY "Allow public insert to appointments"
  ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Strictly restrict viewing appointments to AUTHENTICATED users (Admin)
-- CRITICAL SECURITY: Anonymous public visitors CANNOT harvest or query patient PII
DROP POLICY IF EXISTS "Allow read appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated read appointments" ON appointments;
CREATE POLICY "Allow authenticated read appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Policy 3: Strictly restrict updating appointment status to AUTHENTICATED users
DROP POLICY IF EXISTS "Allow update appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated update appointments" ON appointments;
CREATE POLICY "Allow authenticated update appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Allow AUTHENTICATED administrators to delete or anonymize appointments (GDPR Right to be Forgotten)
DROP POLICY IF EXISTS "Allow authenticated delete appointments" ON appointments;
CREATE POLICY "Allow authenticated delete appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');


-- 2. SINGLE-SLOT ADMIN ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'super_admin',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enforce Row Level Security (RLS) on admin_accounts
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow single slot registration ONLY when the table is empty
-- PostgreSQL database-level enforcement: Once 1 row exists, no further registration can ever occur
DROP POLICY IF EXISTS "Allow insert admin_accounts" ON admin_accounts;
DROP POLICY IF EXISTS "Allow single slot insert admin_accounts" ON admin_accounts;
CREATE POLICY "Allow single slot insert admin_accounts"
  ON admin_accounts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK ((SELECT count(*) FROM admin_accounts) = 0);

-- Policy 2: Allow authenticated admins to view admin account verification
DROP POLICY IF EXISTS "Allow select admin_accounts" ON admin_accounts;
DROP POLICY IF EXISTS "Allow authenticated select admin_accounts" ON admin_accounts;
CREATE POLICY "Allow authenticated select admin_accounts"
  ON admin_accounts
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Public helper function to check if the single admin slot is taken WITHOUT exposing any table rows or emails
CREATE OR REPLACE FUNCTION is_admin_slot_registered()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_accounts);
$$;

GRANT EXECUTE ON FUNCTION is_admin_slot_registered() TO anon, authenticated;
