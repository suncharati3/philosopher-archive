import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pghxhmiiauprqrijelzu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaHhobWlpYXVwcnFyaWplbHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MTA0NDYsImV4cCI6MjA1MzM4NjQ0Nn0.vvFf7RCOTb09ndXEE7JejcFzjlinjWBmPCuT355BWSw";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);