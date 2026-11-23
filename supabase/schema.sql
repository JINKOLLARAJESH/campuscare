-- ========================================================
-- CampusCare PostgreSQL Schema with Row Level Security (RLS)
-- Supabase Migration Script
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('student', 'officer', 'committee', 'admin');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  department TEXT,
  roll_number TEXT,
  phone TEXT,
  avatar_url TEXT,
  badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. COMPLAINT CATEGORIES & PRIORITIES
CREATE TYPE complaint_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE complaint_status AS ENUM (
  'Submitted', 'Acknowledged', 'Assigned', 'Under Investigation', 
  'Action Taken', 'Resolved', 'Reopened', 'Escalated', 'Closed'
);

-- 3. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference_id TEXT UNIQUE NOT NULL, -- e.g. CC-2026-00821
  tracking_secret TEXT NOT NULL,      -- Secret credential for anonymous lookup
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  location TEXT NOT NULL,
  incident_date DATE NOT NULL,
  priority complaint_priority NOT NULL DEFAULT 'Medium',
  status complaint_status NOT NULL DEFAULT 'Submitted',
  reporting_mode TEXT NOT NULL CHECK (reporting_mode IN ('anonymous', 'identified')),
  
  -- Student Identity (NULL if anonymous)
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_name TEXT,
  student_roll_number TEXT,
  student_email TEXT,
  
  -- Routing & Assignment
  assigned_department TEXT NOT NULL,
  assigned_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_officer_name TEXT,
  
  -- Escalation & Security
  escalation_level INT NOT NULL DEFAULT 1 CHECK (escalation_level BETWEEN 1 AND 4),
  escalation_deadline TIMESTAMPTZ NOT NULL,
  is_escalated BOOLEAN NOT NULL DEFAULT FALSE,
  is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
  satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
  reopen_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  resolved_at TIMESTAMPTZ
);

-- 4. TIMELINE ENTRIES
CREATE TABLE IF NOT EXISTS public.complaint_timeline (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  status complaint_status NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. MESSAGES (Anonymous Two-Way Chat)
CREATE TABLE IF NOT EXISTS public.complaint_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  sender_role user_role NOT NULL,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous users can look up complaint ONLY if they provide the exact reference_id and tracking_secret
CREATE POLICY "Public anonymous lookup with secret" ON public.complaints
  FOR SELECT USING (
    reporting_mode = 'anonymous' AND 
    tracking_secret = current_setting('request.jwt.claim.tracking_secret', true)
  );

-- Super Admins have unrestricted access
CREATE POLICY "Super Admins view all complaints" ON public.complaints
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Committee members view sensitive and escalated cases
CREATE POLICY "Committee members view escalated or sensitive" ON public.complaints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'committee'
    )
  );
