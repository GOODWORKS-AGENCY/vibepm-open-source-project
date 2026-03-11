-- 00002_agent_runtime.sql
-- Agent runtime: atomic checkout, cost tracking, activity log,
-- heartbeat system, run logs, task comments, agent state machine

-- ============================================================================
-- 1. AGENTS TABLE (state machine)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,                 -- e.g. 'claude-code', 'agent-2'
  status TEXT NOT NULL DEFAULT 'idle'
    CHECK (status IN ('idle', 'running', 'paused', 'terminated')),
  budget_monthly_cents INTEGER DEFAULT 0,
  spent_monthly_cents INTEGER DEFAULT 0,
  budget_reset_at TIMESTAMPTZ DEFAULT date_trunc('month', now()) + INTERVAL '1 month',
  session_id TEXT,                        -- persistent session across heartbeats
  session_params JSONB DEFAULT '{}',
  last_heartbeat_at TIMESTAMPTZ,
  heartbeat_interval_sec INTEGER DEFAULT 300,
  max_concurrent_runs INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

CREATE INDEX idx_agents_user_status ON public.agents(user_id, status);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agents_select" ON public.agents
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "agents_insert" ON public.agents
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "agents_update" ON public.agents
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- ============================================================================
-- 2. HEARTBEAT RUNS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.heartbeat_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled', 'timed_out')),
  invocation_source TEXT NOT NULL DEFAULT 'manual'
    CHECK (invocation_source IN ('scheduler', 'manual', 'callback', 'system')),
  task_code TEXT,                          -- task being worked on (if any)
  context_snapshot JSONB DEFAULT '{}',     -- goal summary, budget snapshot
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  usage_json JSONB DEFAULT '{}',           -- token counts
  result_json JSONB DEFAULT '{}',          -- outcome summary
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_heartbeat_runs_agent ON public.heartbeat_runs(user_id, agent_id, started_at DESC);
CREATE INDEX idx_heartbeat_runs_status ON public.heartbeat_runs(user_id, status);

ALTER TABLE public.heartbeat_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "heartbeat_runs_select" ON public.heartbeat_runs
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "heartbeat_runs_insert" ON public.heartbeat_runs
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "heartbeat_runs_update" ON public.heartbeat_runs
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- ============================================================================
-- 3. RUN LOGS TABLE (streaming output)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.run_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.heartbeat_runs(id) ON DELETE CASCADE,
  stream TEXT NOT NULL DEFAULT 'stdout'
    CHECK (stream IN ('stdout', 'stderr', 'system')),
  chunk TEXT NOT NULL,
  seq INTEGER NOT NULL,                    -- ordering within a run
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_run_logs_run_seq ON public.run_logs(run_id, seq);

ALTER TABLE public.run_logs ENABLE ROW LEVEL SECURITY;

-- RLS via join to heartbeat_runs.user_id
CREATE POLICY "run_logs_select" ON public.run_logs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.heartbeat_runs hr
    WHERE hr.id = run_id AND hr.user_id = auth.uid()
  ));
CREATE POLICY "run_logs_insert" ON public.run_logs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.heartbeat_runs hr
    WHERE hr.id = run_id AND hr.user_id = auth.uid()
  ));

-- ============================================================================
-- 4. COST EVENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cost_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  task_code TEXT,                           -- which task incurred the cost
  provider TEXT NOT NULL,                   -- 'anthropic', 'openai', 'google', etc.
  model TEXT NOT NULL,                      -- 'claude-opus-4-20250514', 'gemini-2.0-flash', etc.
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_cents NUMERIC(10,4) NOT NULL DEFAULT 0,
  run_id UUID REFERENCES public.heartbeat_runs(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cost_events_agent ON public.cost_events(user_id, agent_id, occurred_at DESC);
CREATE INDEX idx_cost_events_monthly ON public.cost_events(user_id, occurred_at);

ALTER TABLE public.cost_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cost_events_select" ON public.cost_events
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "cost_events_insert" ON public.cost_events
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 5. ACTIVITY LOG TABLE (audit trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor TEXT NOT NULL,                      -- 'claude-code', 'agent-2', 'user'
  action TEXT NOT NULL,                     -- 'task_claimed', 'task_completed', 'agent_paused', etc.
  entity_type TEXT NOT NULL,                -- 'task', 'agent', 'run', 'cost'
  entity_id TEXT NOT NULL,                  -- task_code, agent_id, run_id, etc.
  details JSONB DEFAULT '{}',              -- before/after, reason, context
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activity_log_user ON public.activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_log_entity ON public.activity_log(user_id, entity_type, entity_id);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_log_select" ON public.activity_log
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "activity_log_insert" ON public.activity_log
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 6. TASK COMMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_code TEXT NOT NULL,
  author TEXT NOT NULL,                    -- 'claude-code', 'agent-2', 'user'
  body TEXT NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'note'
    CHECK (comment_type IN ('note', 'blocker', 'resolution', 'review', 'system')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_task_comments_task ON public.task_comments(task_code, created_at);
CREATE INDEX idx_task_comments_user ON public.task_comments(user_id, created_at DESC);

ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_comments_select" ON public.task_comments
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "task_comments_insert" ON public.task_comments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 7. ENABLE REALTIME for new tables
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.heartbeat_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.run_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_comments;
