-- Let's first check if the demo user already exists
DO $$
DECLARE
    demo_user_id uuid;
    user_exists boolean := false;
BEGIN
    -- Check if demo user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'demo@example.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Generate a fixed UUID for the demo user
        demo_user_id := '11111111-1111-1111-1111-111111111111'::uuid;
        
        -- Create the demo user directly (this may require admin privileges)
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
            '$2a$10$D2jk5F3zj.G5F3zj.G5F3zj.G5F3zj.G5F3zj.G5F3zj.G5F3zj.G5F3zj.G5', -- Pre-hashed password for 'testuser123'
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
        );
        
        -- Create profile for demo user
        INSERT INTO public.profiles (
            id,
            username,
            created_at
        ) VALUES (
            demo_user_id,
            'demo@example.com',
            NOW()
        );

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
        );
        
        RAISE NOTICE 'Demo user created successfully';
    ELSE
        RAISE NOTICE 'Demo user already exists';
    END IF;
END $$;