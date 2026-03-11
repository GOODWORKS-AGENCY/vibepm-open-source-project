import { Task } from '@/types/project';

export function generateTaskSeedSql(tasks: Task[], migrationNumber: string = '00001'): string {
  if (tasks.length === 0) {
    return `-- ${migrationNumber}_project_tasks.sql\n-- No tasks to seed.\n`;
  }

  const schema = `-- ${migrationNumber}_project_tasks.sql
-- Project task tracking with gamification
-- Integration template — customize CHECK constraints, levels, and seed data below

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL,
  category TEXT NOT NULL,
  assigned_to TEXT NOT NULL DEFAULT 'agent-1'
    CHECK (assigned_to IN (
      -- ┌─────────────────────────────────────────────┐
      -- │ CUSTOMIZE: Add your agent names here         │
      -- └─────────────────────────────────────────────┘
      'agent-1', 'agent-2'
    )),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 100),
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

CREATE TABLE IF NOT EXISTS public.project_levels (
  id SERIAL PRIMARY KEY,
  level INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  xp_required INTEGER NOT NULL,
  badge_emoji TEXT
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_project_tasks_phase ON public.project_tasks(phase);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned ON public.project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_tasks_priority ON public.project_tasks(priority DESC);

-- ============================================================================
-- TRIGGER: auto-update updated_at
-- ============================================================================
-- NOTE: If you already have a handle_updated_at() function, skip this block.
-- Most Supabase projects create one in an early migration.

-- CREATE OR REPLACE FUNCTION public.handle_updated_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_tasks_updated_at
  BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- Project tasks are global (not org-scoped). All authenticated users can
-- read and manage them. Adjust these policies if you need stricter access.

ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_tasks_select" ON public.project_tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "project_tasks_insert" ON public.project_tasks
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "project_tasks_update" ON public.project_tasks
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "project_levels_select" ON public.project_levels
  FOR SELECT TO authenticated USING (true);

-- ============================================================================
-- SEED: Gamification Levels (15 levels, 0-12000 XP)
-- ============================================================================
-- Customize titles, XP thresholds, and emojis to fit your project's vibe.

INSERT INTO public.project_levels (level, title, xp_required, badge_emoji) VALUES
(1,  'Apprentice',    0,     '🔰'),
(2,  'Builder',       100,   '🔨'),
(3,  'Craftsman',     250,   '⚒️'),
(4,  'Engineer',      500,   '⚙️'),
(5,  'Specialist',    800,   '🎯'),
(6,  'Expert',        1200,  '💎'),
(7,  'Master',        1700,  '🏆'),
(8,  'Visionary',     2300,  '🔮'),
(9,  'Architect',     3000,  '🏛️'),
(10, 'Legend',        4000,  '👑'),
(11, 'Titan',         5500,  '⚡'),
(12, 'Transcendent',  7000,  '🌟'),
(13, 'Mythic',        8500,  '🐉'),
(14, 'Eternal',       10000, '♾️'),
(15, 'Ascended',      12000, '🌌')
ON CONFLICT (level) DO NOTHING;

-- ============================================================================
-- SEED: Project Tasks
-- ============================================================================
`;

  const values = tasks.map(t => {
    const deps = t.dependencies.length > 0
      ? `ARRAY[${t.dependencies.map(d => `'${d}'`).join(', ')}]`
      : `'{}'::TEXT[]`;
    const refs = t.watReferences.length > 0
      ? `ARRAY[${t.watReferences.map(r => `'${r}'`).join(', ')}]`
      : `'{}'::TEXT[]`;
    const desc = (t.description || '').replace(/'/g, "''");

    return `('${t.taskCode}', '${t.title.replace(/'/g, "''")}',
'${desc}',
'${t.phase}', '${t.category}', '${t.assignedTo || 'claude-code'}', ${t.priority}, ${t.xpReward}, 'pending', 0,
${deps}, ${refs})`;
  }).join(',\n\n');

  return schema + `INSERT INTO public.project_tasks (
  task_code, title, description,
  phase, category, assigned_to, priority, xp_reward, status, progress_pct,
  dependencies, wat_references
) VALUES

${values}

ON CONFLICT (task_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  phase = EXCLUDED.phase,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  xp_reward = EXCLUDED.xp_reward,
  dependencies = EXCLUDED.dependencies,
  wat_references = EXCLUDED.wat_references;
`;
}
