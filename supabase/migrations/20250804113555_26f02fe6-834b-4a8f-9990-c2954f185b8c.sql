-- Create demo user using Supabase's built-in functions
-- This uses the proper auth.users format and will trigger the profile creation

DO $$
DECLARE
    demo_user_id uuid;
BEGIN
    -- Insert demo user with a proper UUID
    demo_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
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
        demo_user_id,
        'authenticated',
        'authenticated',
        'demo@example.com',
        crypt('testuser123', gen_salt('bf')), -- Properly hash the password
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

    -- Create profile for demo user (in case trigger doesn't work)
    INSERT INTO public.profiles (
        id,
        username,
        created_at
    ) VALUES (
        demo_user_id,
        'demo@example.com',
        NOW()
    ) ON CONFLICT (id) DO NOTHING;

    -- Give demo user initial tokens
    INSERT INTO public.token_transactions (
        user_id,
        amount,
        transaction_type,
        description,
        created_at
    ) VALUES (
        demo_user_id,
        1000,
        'purchase',
        'Demo user initial tokens',
        NOW()
    ) ON CONFLICT DO NOTHING;

END $$;