
-- Add user_id to project_tasks
ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing RLS policies if any
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Public read access to project_tasks" ON public.project_tasks;

-- Enable RLS
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own tasks
CREATE POLICY "Users can view their own tasks"
  ON public.project_tasks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own tasks"
  ON public.project_tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tasks"
  ON public.project_tasks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own tasks"
  ON public.project_tasks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- project_levels should be readable by everyone (reference data)
ALTER TABLE public.project_levels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read levels" ON public.project_levels;
CREATE POLICY "Anyone can read levels"
  ON public.project_levels FOR SELECT
  TO authenticated
  USING (true);
