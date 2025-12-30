-- Drop existing foreign key constraint if it exists
ALTER TABLE public.drafts DROP CONSTRAINT IF EXISTS drafts_problem_id_fkey;

-- Add problem_slug column to store text-based problem IDs
ALTER TABLE public.drafts ADD COLUMN IF NOT EXISTS problem_slug TEXT;

-- Create unique constraint for user_id + problem_slug
CREATE UNIQUE INDEX IF NOT EXISTS drafts_user_problem_slug_unique ON public.drafts(user_id, problem_slug);

-- Update RLS policies to be more permissive for the new column
DROP POLICY IF EXISTS "Users can manage own drafts" ON public.drafts;

CREATE POLICY "Users can view own drafts"
ON public.drafts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
ON public.drafts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
ON public.drafts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
ON public.drafts
FOR DELETE
USING (auth.uid() = user_id);