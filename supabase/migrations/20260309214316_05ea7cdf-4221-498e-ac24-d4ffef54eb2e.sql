ALTER TABLE public.project_tasks ADD COLUMN IF NOT EXISTS project_id text;
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON public.project_tasks(project_id);