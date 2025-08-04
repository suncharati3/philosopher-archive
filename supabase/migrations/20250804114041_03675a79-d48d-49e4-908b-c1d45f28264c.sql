-- Confirm the demo user's email directly in the database
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'demo.user@gmail.com' AND email_confirmed_at IS NULL;