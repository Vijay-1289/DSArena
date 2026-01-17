-- Migration to fix drafts table for cloud sync support with slugs
ALTER TABLE public.drafts ADD COLUMN IF NOT EXISTS problem_slug TEXT;

-- Make problem_id optional as we might use problem_slug instead
ALTER TABLE public.drafts ALTER COLUMN problem_id DROP NOT NULL;

-- Remove old unique constraint
ALTER TABLE public.drafts DROP CONSTRAINT IF EXISTS drafts_user_id_problem_id_key;

-- Add composite unique constraints for both ID and Slug
-- This ensures a user can only have one draft per problem ID OR per problem slug
ALTER TABLE public.drafts ADD CONSTRAINT drafts_user_id_problem_id_unique UNIQUE (user_id, problem_id);
ALTER TABLE public.drafts ADD CONSTRAINT drafts_user_id_problem_slug_unique UNIQUE (user_id, problem_slug);

-- Enable RLS (already enabled but good to be explicit)
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Policy already exists from initial migration, but let's ensure it's there
-- CREATE POLICY "Users can manage own drafts" ON public.drafts FOR ALL TO authenticated USING (auth.uid() = user_id);
