-- 00001_project_tasks.sql
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
INSERT INTO public.project_tasks (
  task_code, title, description,
  phase, category, assigned_to, priority, xp_reward, status, progress_pct,
  dependencies, wat_references
) VALUES

('P01-01', 'Initialize Vite + React + TypeScript project',
'Set up project scaffolding with Vite, React 18, TypeScript, SWC plugin, path aliases (@/ → src/)',
'phase1', 'infra', 'claude-code', 100, 25, 'pending', 0,
'{}'::TEXT[], '{}'::TEXT[]),

('P01-02', 'Configure shadcn/ui and Tailwind CSS',
'Install shadcn/ui, Tailwind CSS, custom theme tokens (vibe-glow, vibe-cyan, vibe-amber, vibe-rose), custom fonts (Space Grotesk, JetBrains Mono)',
'phase1', 'ui', 'claude-code', 95, 20, 'pending', 0,
ARRAY['P01-01'], '{}'::TEXT[]),

('P01-03', 'Set up Supabase client and auth',
'Configure Supabase client with env vars (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY), create AuthProvider context, ProtectedRoute component',
'phase1', 'infra', 'claude-code', 90, 30, 'pending', 0,
ARRAY['P01-01'], ARRAY['knowledge/skills/shared/auth.skill.md']),

('P01-04', 'Implement localStorage project store',
'Create src/lib/store.ts with CRUD operations for projects under vibepm_projects key. Include useProjects hook wrapper.',
'phase1', 'feature', 'claude-code', 85, 25, 'pending', 0,
ARRAY['P01-01'], ARRAY['knowledge/tools/db/projects-crud.tool.md']),

('P01-05', 'Set up routing with react-router-dom v6',
'Configure all routes: / (landing), /auth, /new, /projects, /projects/:id (with nested tasks/knowledge/export), /project-tracker, /framework, /system. Protected routes with auth guard.',
'phase1', 'infra', 'claude-code', 80, 25, 'pending', 0,
ARRAY['P01-03'], ARRAY['knowledge/skills/project-tracker/project-tracker.skill.md', 'knowledge/tools/db/tasks-crud.tool.md', 'knowledge/tools/db/phases-crud.tool.md', 'knowledge/tools/db/project-levels-crud.tool.md', 'knowledge/tools/db/projects-crud.tool.md', 'knowledge/skills/shared/auth.skill.md']),

('P02-01', 'Build brain dump UI with sections and file upload',
'Create NewProject page step 1: project name, description, expandable brain dump sections with rich text, file upload support for reference docs',
'phase2', 'ui', 'claude-code', 100, 35, 'pending', 0,
ARRAY['P01-05'], '{}'::TEXT[]),

('P02-02', 'Integrate AI analysis edge function',
'Wire brain dump to generate-project edge function (step: analyze). Parse response into AnalysisResult with modules, entities, phases, shared concerns.',
'phase2', 'feature', 'claude-code', 95, 35, 'pending', 0,
ARRAY['P02-01'], ARRAY['knowledge/tools/db/phases-crud.tool.md', 'knowledge/tools/db/modules-crud.tool.md']),

('P02-03', 'Integrate AI task generation',
'Wire analysis to generate-project edge function (step: generate-tasks). Parse response into GeneratedTask[] with task_code, wat_references, dependencies.',
'phase2', 'feature', 'claude-code', 90, 30, 'pending', 0,
ARRAY['P02-02'], ARRAY['knowledge/tools/db/tasks-crud.tool.md']),

('P02-04', 'Build review and save step',
'Create wizard step 4: display generated tasks, knowledge files, config files with counts. Save button persists to localStorage.',
'phase2', 'ui', 'claude-code', 85, 25, 'pending', 0,
ARRAY['P02-03'], ARRAY['knowledge/tools/db/tasks-crud.tool.md']),

('P03-01', 'Create CLAUDE.md template generator',
'Implement generateClaudeMd(project) following the 12-section template: overview, commands, task protocol, structure, knowledge base, conventions, module map, environment, database, AI agents, rules, deployment',
'phase3', 'feature', 'claude-code', 100, 35, 'pending', 0,
ARRAY['P02-03'], '{}'::TEXT[]),

('P03-02', 'Create rules file generators',
'Implement 5 rules generators: code-style, database, architecture, task-process, testing — each produces a .claude/rules/*.md file',
'phase3', 'feature', 'claude-code', 95, 30, 'pending', 0,
ARRAY['P03-01'], '{}'::TEXT[]),

('P03-03', 'Create skill file generators',
'Implement generateSkillFile (module), generateSharedSkillFile (cross-cutting), generateAgentSkillFile (AI agent), generateSkillIndex — following WAT Skill Index Template',
'phase3', 'feature', 'claude-code', 90, 35, 'pending', 0,
ARRAY['P03-01'], '{}'::TEXT[]),

('P03-04', 'Create tool file generators',
'Implement generateDbTool (entity CRUD), generateApiTool (edge functions), generateUiTool (component specs), generateAutomationTool, generateToolIndex — following Tool Index Template',
'phase3', 'feature', 'claude-code', 85, 35, 'pending', 0,
ARRAY['P03-01'], '{}'::TEXT[]),

('P03-05', 'Create workflow file generators',
'Implement generateWorkflowFile (module), generateSharedWorkflowFile (cross-module), generateWorkflowIndex — following WAT Framework Template',
'phase3', 'feature', 'claude-code', 80, 30, 'pending', 0,
ARRAY['P03-01'], '{}'::TEXT[]),

('P03-06', 'Create task seed SQL generator',
'Implement generateTaskSeedSql: project_tasks table, project_levels table (15 levels, 0-12000 XP), indexes, RLS, UPDATE trigger, seed INSERT with ON CONFLICT',
'phase3', 'feature', 'claude-code', 75, 30, 'pending', 0,
ARRAY['P03-01'], ARRAY['knowledge/tools/db/tasks-crud.tool.md', 'knowledge/tools/db/project-levels-crud.tool.md', 'knowledge/skills/shared/auth.skill.md']),

('P03-07', 'Create orchestrator (generate-from-templates.ts)',
'Central function generateConfigFromTemplates(analysis, tasks) that calls ALL generators in the right order and returns { path, content }[] for the complete framework',
'phase3', 'orchestration', 'claude-code', 70, 50, 'pending', 0,
ARRAY['P03-02', 'P03-03', 'P03-04', 'P03-05', 'P03-06'], ARRAY['knowledge/tools/db/tasks-crud.tool.md']),

('P04-01', 'Build project dashboard page',
'Create ProjectDashboard with overview stats, phase progress, XP/level display, nested route outlet for tasks/knowledge/export tabs',
'phase4', 'ui', 'claude-code', 100, 35, 'pending', 0,
ARRAY['P03-07'], ARRAY['knowledge/skills/project-dashboard/project-dashboard.skill.md', 'knowledge/tools/ui/project-dashboard-ui.tool.md', 'knowledge/tools/db/tasks-crud.tool.md']),

('P04-02', 'Build task viewer tab',
'Create ProjectTasks tab: task list grouped by phase, status badges, dependency graph visualization, progress bars',
'phase4', 'ui', 'claude-code', 95, 30, 'pending', 0,
ARRAY['P04-01'], ARRAY['knowledge/tools/db/tasks-crud.tool.md']),

('P04-03', 'Build knowledge viewer tab',
'Create Knowledge tab: file tree organized by type (skills/tools/workflows), content preview pane, type badges',
'phase4', 'ui', 'claude-code', 90, 25, 'pending', 0,
ARRAY['P04-01'], ARRAY['knowledge/skills/knowledge-viewer/knowledge-viewer.skill.md', 'knowledge/tools/ui/knowledge-viewer-ui.tool.md', 'knowledge/workflows/knowledge-viewer/knowledge-viewer-core.workflow.md']),

('P04-04', 'Build export page with ZIP download',
'Create ProjectExport: file browser, content preview, JSZip packaging, download as {project-name}-context.zip',
'phase4', 'feature', 'claude-code', 85, 30, 'pending', 0,
ARRAY['P04-01'], '{}'::TEXT[]),

('P05-01', 'Implement wat_references reconciliation',
'Add computeKnowledgePaths() and reconcileWatReferences() to orchestrator. Three-pass strategy: resolve existing refs (exact → normalized → fuzzy), infer from task content, deduplicate.',
'phase5', 'feature', 'claude-code', 100, 50, 'pending', 0,
ARRAY['P03-07'], '{}'::TEXT[]),

('P05-02', 'Align gamification levels to 15-level spec',
'Update GAMIFICATION_LEVELS in types/project.ts to 15 levels (0-12000 XP) matching task seed SQL: Apprentice → Ascended',
'phase5', 'infra', 'claude-code', 95, 15, 'pending', 0,
'{}'::TEXT[], '{}'::TEXT[]),

('P05-03', 'Move operational docs into knowledge/',
'Relocate agent-spec.md, human-in-the-loop.md, error-recovery.md, learning-optimization.md, integration-checklist.md from repo root into knowledge/',
'phase5', 'infra', 'claude-code', 90, 15, 'pending', 0,
'{}'::TEXT[], '{}'::TEXT[]),

('P05-04', 'Dogfood: generate engine for VibePM itself',
'Create scripts/generate-self.ts that runs generateConfigFromTemplates with hand-crafted VibePM analysis. Write output to repo.',
'phase5', 'orchestration', 'claude-code', 85, 35, 'pending', 0,
ARRAY['P05-01', 'P05-02', 'P05-03'], '{}'::TEXT[]),

('P06-01', 'Add error handling to AI generation pipeline',
'Add retry logic, user-facing error messages, rate limit handling, partial failure recovery to the wizard generation steps',
'phase6', 'feature', 'claude-code', 100, 30, 'pending', 0,
ARRAY['P05-04'], '{}'::TEXT[]),

('P06-02', 'Build framework documentation site',
'Create /framework route with template documentation rendered from public/framework/*.md files',
'phase6', 'ui', 'claude-code', 90, 25, 'pending', 0,
ARRAY['P05-04'], '{}'::TEXT[]),

('P06-03', 'Performance optimization',
'Code-split routes with lazy loading, optimize bundle size, add loading states for AI calls',
'phase6', 'infra', 'claude-code', 80, 25, 'pending', 0,
ARRAY['P05-04'], '{}'::TEXT[])

ON CONFLICT (task_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  phase = EXCLUDED.phase,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  xp_reward = EXCLUDED.xp_reward,
  dependencies = EXCLUDED.dependencies,
  wat_references = EXCLUDED.wat_references;
