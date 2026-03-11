
-- Remove overly permissive public policies from project_tasks
DROP POLICY IF EXISTS "Anyone can delete project_tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Anyone can insert project_tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Anyone can read project_tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Anyone can update project_tasks" ON public.project_tasks;

-- Add project_id column to link tasks to a specific project
ALTER TABLE public.project_tasks ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
CREATE INDEX idx_project_tasks_project_id ON public.project_tasks(project_id);
