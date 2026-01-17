-- Standardize profiles table and fix RLS for XP updates

DO $$ 
BEGIN 
    -- 1. Add XP column if missing (Safety check)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'xp') THEN
        ALTER TABLE public.profiles ADD COLUMN xp INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Drop the restrictive update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 3. Create a permissive policy for all profile fields
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;