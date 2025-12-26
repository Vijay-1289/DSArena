-- Fix: allow saving progress/submissions for slug-identified problems.

-- 1) user_solved
ALTER TABLE public.user_solved
  ADD COLUMN IF NOT EXISTS problem_slug text;

ALTER TABLE public.user_solved
  ALTER COLUMN problem_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_solved_problem_ref_check'
  ) THEN
    ALTER TABLE public.user_solved
      ADD CONSTRAINT user_solved_problem_ref_check
      CHECK (problem_id IS NOT NULL OR problem_slug IS NOT NULL);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS user_solved_user_problem_id_uniq
  ON public.user_solved (user_id, problem_id)
  WHERE problem_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_solved_user_problem_slug_uniq
  ON public.user_solved (user_id, problem_slug)
  WHERE problem_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_solved_user_id_idx
  ON public.user_solved (user_id);

CREATE INDEX IF NOT EXISTS user_solved_problem_slug_idx
  ON public.user_solved (problem_slug);


-- 2) submissions
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS problem_slug text;

ALTER TABLE public.submissions
  ALTER COLUMN problem_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'submissions_problem_ref_check'
  ) THEN
    ALTER TABLE public.submissions
      ADD CONSTRAINT submissions_problem_ref_check
      CHECK (problem_id IS NOT NULL OR problem_slug IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS submissions_user_id_idx
  ON public.submissions (user_id);

CREATE INDEX IF NOT EXISTS submissions_problem_slug_idx
  ON public.submissions (problem_slug);
