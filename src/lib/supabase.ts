import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase integration
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[CampusCare]%c Running in autonomous LocalStorage mode with full persistence. To connect live Supabase, define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.',
    'color: #2563EB; font-weight: bold;',
    'color: inherit;'
  );
}
