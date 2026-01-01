-- Allow users to update their own exam_eligibility ONLY to block themselves (never to unblock)
-- This fixes the case where an admin approves a retake (is_eligible=true) and the user fails again,
-- but the frontend cannot flip is_eligible back to false due to missing UPDATE policy.

-- Enable RLS (no-op if already enabled)
ALTER TABLE public.exam_eligibility ENABLE ROW LEVEL SECURITY;

-- Policy: users can update their own eligibility record, but only when setting is_eligible = false
DROP POLICY IF EXISTS "Users can self-block eligibility" ON public.exam_eligibility;
CREATE POLICY "Users can self-block eligibility"
ON public.exam_eligibility
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND is_eligible = false
  AND (last_exam_passed IS NULL OR last_exam_passed = false)
);
