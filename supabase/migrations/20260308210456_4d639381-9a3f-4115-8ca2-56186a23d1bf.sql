
-- Project Tasks table (source of truth for all work)
CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL,
  category TEXT NOT NULL,
  assigned_to TEXT NOT NULL DEFAULT 'claude-code',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 100),
  progress_pct INTEGER DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  xp_reward INTEGER DEFAULT 10,
  dependencies TEXT[] DEFAULT '{}',
  wat_references TEXT[] DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Project Levels table (gamification)
CREATE TABLE public.project_levels (
  id SERIAL PRIMARY KEY,
  level INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  xp_required INTEGER NOT NULL,
  badge_emoji TEXT
);

-- Indexes for performance
CREATE INDEX idx_project_tasks_phase ON public.project_tasks(phase);
CREATE INDEX idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX idx_project_tasks_priority ON public.project_tasks(priority DESC);

-- Enable RLS
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_levels ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required for this app)
CREATE POLICY "Anyone can read project_tasks" ON public.project_tasks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert project_tasks" ON public.project_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update project_tasks" ON public.project_tasks FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete project_tasks" ON public.project_tasks FOR DELETE USING (true);

CREATE POLICY "Anyone can read project_levels" ON public.project_levels FOR SELECT USING (true);
CREATE POLICY "Anyone can insert project_levels" ON public.project_levels FOR INSERT WITH CHECK (true);

-- Seed gamification levels
INSERT INTO public.project_levels (level, title, xp_required, badge_emoji) VALUES
(1, 'Apprentice', 0, '🔰'),
(2, 'Builder', 100, '🔨'),
(3, 'Craftsman', 250, '⚒️'),
(4, 'Engineer', 500, '⚙️'),
(5, 'Specialist', 800, '🎯'),
(6, 'Expert', 1200, '💎'),
(7, 'Master', 1700, '🏆'),
(8, 'Visionary', 2300, '🔮'),
(9, 'Architect', 3000, '🏛️'),
(10, 'Legend', 4000, '👑'),
(11, 'Mythic', 5200, '⚡'),
(12, 'Titan', 6500, '🌟'),
(13, 'Ascendant', 8000, '🔥'),
(14, 'Transcendent', 10000, '💫'),
(15, 'Omega', 12000, '🌌')
ON CONFLICT (level) DO NOTHING;

-- Enable realtime for project_tasks
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_tasks;
