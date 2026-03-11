-- Drop the projects table (no longer needed — projects are stored in localStorage)
DROP TABLE IF EXISTS public.projects CASCADE;

-- Drop user-scoped RLS policies first (they depend on user_id)
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.project_tasks;

-- Remove project_id and user_id columns
ALTER TABLE public.project_tasks DROP COLUMN IF EXISTS project_id;
ALTER TABLE public.project_tasks DROP COLUMN IF EXISTS user_id;

-- Open RLS policies (BYOB users secure via their own Supabase instance)
CREATE POLICY "Open read" ON public.project_tasks FOR SELECT USING (true);
CREATE POLICY "Open insert" ON public.project_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Open update" ON public.project_tasks FOR UPDATE USING (true);
CREATE POLICY "Open delete" ON public.project_tasks FOR DELETE USING (true);