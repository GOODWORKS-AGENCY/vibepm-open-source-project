-- 00003_agent_runtime_v2.sql
-- Wakeup queue, config revisions, stale run detection, context enrichment

-- ============================================================================
-- 1. WAKEUP REQUEST QUEUE (idempotent, deduplicating)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wakeup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'claimed', 'finished', 'failed')),
  idempotency_key TEXT,                    -- prevents duplicate wakeups
  coalesced_count INTEGER DEFAULT 1,       -- how many requests merged into this one
  requested_by TEXT NOT NULL DEFAULT 'system', -- 'user', 'agent', 'system', 'scheduler'
  reason TEXT,                             -- why the wakeup was requested
  task_code TEXT,                          -- optional: wake to work on this task
  run_id UUID REFERENCES public.heartbeat_runs(id) ON DELETE SET NULL,
  requested_at TIMESTAMPTZ DEFAULT now(),
  claimed_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_wakeup_requests_agent_status
  ON public.wakeup_requests(user_id, agent_id, status);
CREATE INDEX idx_wakeup_requests_idempotency
  ON public.wakeup_requests(user_id, agent_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

ALTER TABLE public.wakeup_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wakeup_requests_select" ON public.wakeup_requests
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "wakeup_requests_insert" ON public.wakeup_requests
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "wakeup_requests_update" ON public.wakeup_requests
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- ============================================================================
-- 2. CONFIG REVISIONS TABLE (audit trail for agent config changes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.config_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  revision_number INTEGER NOT NULL,
  before_config JSONB DEFAULT '{}',
  after_config JSONB DEFAULT '{}',
  changed_keys TEXT[] DEFAULT '{}',
  source TEXT NOT NULL DEFAULT 'patch'
    CHECK (source IN ('patch', 'register', 'rollback', 'system')),
  rolled_back_from_revision_id UUID REFERENCES public.config_revisions(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_config_revisions_agent
  ON public.config_revisions(user_id, agent_id, revision_number DESC);

ALTER TABLE public.config_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "config_revisions_select" ON public.config_revisions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "config_revisions_insert" ON public.config_revisions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 3. ADD timeout_sec TO agents TABLE
-- ============================================================================

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS timeout_sec INTEGER DEFAULT 3600;
  -- Default 1 hour timeout for runs

-- ============================================================================
-- 4. ENABLE REALTIME for new tables
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.wakeup_requests;
