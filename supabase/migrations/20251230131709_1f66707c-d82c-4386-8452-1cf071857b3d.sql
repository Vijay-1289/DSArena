-- Create user preferences table for onboarding data
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  preferred_language TEXT NOT NULL,
  coding_familiarity INTEGER NOT NULL CHECK (coding_familiarity >= 1 AND coding_familiarity <= 5),
  onboarding_completed BOOLEAN DEFAULT TRUE,
  recommended_level TEXT DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own preferences"
ON public.user_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
ON public.user_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
ON public.user_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Create learning_plan table to track recommended problems
CREATE TABLE public.learning_plan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  problem_id TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  track_id TEXT NOT NULL,
  level TEXT NOT NULL,
  topic TEXT,
  display_order INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  failed_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_plan ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for learning_plan
CREATE POLICY "Users can view own learning plan"
ON public.learning_plan
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning plan"
ON public.learning_plan
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning plan"
ON public.learning_plan
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own learning plan"
ON public.learning_plan
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_learning_plan_user_id ON public.learning_plan(user_id);
CREATE INDEX idx_learning_plan_problem_id ON public.learning_plan(problem_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);