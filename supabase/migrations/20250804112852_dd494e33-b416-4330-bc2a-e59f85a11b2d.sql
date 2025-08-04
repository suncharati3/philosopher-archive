-- Create demo user for testing purposes
-- Note: This inserts directly into auth.users which is usually handled by Supabase Auth
-- This is a special case for creating a demo account

-- First, let's create the demo user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo-user-1234-5678-9012-123456789012'::uuid,
  'authenticated',
  'authenticated',
  'demo@philosopher-archive.com',
  '$2a$10$oDNHUE9eCQzjZgMw1/f2X.lZ5cxz5Q9Zn7Q5KRrV.Z8zXW9Y2U3cW', -- hash for 'testuser123'
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create the profile for the demo user
INSERT INTO public.profiles (
  id,
  username,
  created_at,
  updated_at
) VALUES (
  'demo-user-1234-5678-9012-123456789012'::uuid,
  'demo@philosopher-archive.com',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Give the demo user some initial tokens
INSERT INTO public.token_transactions (
  user_id,
  amount,
  transaction_type,
  description,
  created_at
) VALUES (
  'demo-user-1234-5678-9012-123456789012'::uuid,
  1000,
  'purchase',
  'Demo user initial tokens',
  NOW()
) ON CONFLICT DO NOTHING;