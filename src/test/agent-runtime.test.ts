import { describe, it, expect } from 'vitest';
import {
  Agent,
  AgentStatus,
  HeartbeatRun,
  HeartbeatRunStatus,
  InvocationSource,
  RunLog,
  CostEvent,
  CostSummary,
  ActivityLogEntry,
  TaskComment,
  CommentType,
  GAMIFICATION_LEVELS,
} from '@/types/project';
import { generateAgentCli } from '@/templates/agent-cli';

// ─── Type Tests ──────────────────────────────────────────────────────────────

describe('Agent Runtime Types', () => {
  describe('Agent type', () => {
    it('has correct status values', () => {
      const statuses: AgentStatus[] = ['idle', 'running', 'paused', 'terminated'];
      expect(statuses).toHaveLength(4);
    });

    it('has budget and spend fields', () => {
      const agent: Agent = {
        id: 'test-id',
        user_id: 'user-id',
        agent_id: 'claude-code',
        status: 'idle',
        budget_monthly_cents: 5000,
        spent_monthly_cents: 1234,
        budget_reset_at: '2026-04-01T00:00:00Z',
        session_id: null,
        session_params: {},
        last_heartbeat_at: null,
        heartbeat_interval_sec: 300,
        max_concurrent_runs: 1,
        created_at: '2026-03-09T00:00:00Z',
        updated_at: '2026-03-09T00:00:00Z',
      };
      expect(agent.budget_monthly_cents).toBe(5000);
      expect(agent.spent_monthly_cents).toBe(1234);
      expect(agent.heartbeat_interval_sec).toBe(300);
    });
  });

  describe('HeartbeatRun type', () => {
    it('has all run statuses', () => {
      const statuses: HeartbeatRunStatus[] = [
        'queued', 'running', 'succeeded', 'failed', 'cancelled', 'timed_out',
      ];
      expect(statuses).toHaveLength(6);
    });

    it('has all invocation sources', () => {
      const sources: InvocationSource[] = ['scheduler', 'manual', 'callback', 'system'];
      expect(sources).toHaveLength(4);
    });

    it('tracks duration and usage', () => {
      const run: HeartbeatRun = {
        id: 'run-id',
        user_id: 'user-id',
        agent_id: 'claude-code',
        status: 'succeeded',
        invocation_source: 'scheduler',
        task_code: 'P01-01',
        context_snapshot: { goal: 'test' },
        started_at: '2026-03-09T10:00:00Z',
        finished_at: '2026-03-09T10:05:00Z',
        duration_ms: 300000,
        usage_json: { input_tokens: 5000, output_tokens: 2000 },
        result_json: { files_changed: 3 },
        error_message: null,
        created_at: '2026-03-09T10:00:00Z',
      };
      expect(run.duration_ms).toBe(300000);
      expect(run.task_code).toBe('P01-01');
    });
  });

  describe('RunLog type', () => {
    it('supports stdout, stderr, and system streams', () => {
      const streams: RunLog['stream'][] = ['stdout', 'stderr', 'system'];
      expect(streams).toHaveLength(3);
    });

    it('has sequential ordering', () => {
      const logs: RunLog[] = [
        { id: '1', run_id: 'r1', stream: 'stdout', chunk: 'Building...', seq: 0, created_at: '' },
        { id: '2', run_id: 'r1', stream: 'stdout', chunk: 'Done.', seq: 1, created_at: '' },
        { id: '3', run_id: 'r1', stream: 'stderr', chunk: 'Warning: unused var', seq: 2, created_at: '' },
      ];
      expect(logs.map(l => l.seq)).toEqual([0, 1, 2]);
      expect(logs.map(l => l.chunk).join('')).toBe('Building...Done.Warning: unused var');
    });
  });

  describe('CostEvent type', () => {
    it('tracks provider, model, and token counts', () => {
      const event: CostEvent = {
        id: 'cost-id',
        user_id: 'user-id',
        agent_id: 'claude-code',
        task_code: 'P01-01',
        provider: 'anthropic',
        model: 'claude-opus-4-20250514',
        input_tokens: 10000,
        output_tokens: 3000,
        cost_cents: 45.5,
        run_id: 'run-id',
        metadata: {},
        occurred_at: '2026-03-09T10:00:00Z',
        created_at: '2026-03-09T10:00:00Z',
      };
      expect(event.provider).toBe('anthropic');
      expect(event.cost_cents).toBe(45.5);
    });
  });

  describe('CostSummary type', () => {
    it('has rollup fields', () => {
      const summary: CostSummary = {
        period_days: 30,
        total_cost_cents: 1234.5,
        total_input_tokens: 500000,
        total_output_tokens: 150000,
        event_count: 42,
        by_agent: {
          'claude-code': { cost_cents: 1000, events: 35 },
          'agent-2': { cost_cents: 234.5, events: 7 },
        },
        by_model: {
          'claude-opus-4-20250514': { cost_cents: 900, events: 20 },
          'gemini-2.0-flash': { cost_cents: 334.5, events: 22 },
        },
      };
      expect(summary.by_agent['claude-code'].cost_cents).toBe(1000);
      expect(Object.keys(summary.by_model)).toHaveLength(2);
    });
  });

  describe('TaskComment type', () => {
    it('supports all comment types', () => {
      const types: CommentType[] = ['note', 'blocker', 'resolution', 'review', 'system'];
      expect(types).toHaveLength(5);
    });
  });

  describe('ActivityLogEntry type', () => {
    it('captures mutation context', () => {
      const entry: ActivityLogEntry = {
        id: 'log-id',
        user_id: 'user-id',
        actor: 'claude-code',
        action: 'task_claimed',
        entity_type: 'task',
        entity_id: 'P01-03',
        details: { previous_status: 'pending', title: 'Set up auth' },
        created_at: '2026-03-09T10:00:00Z',
      };
      expect(entry.action).toBe('task_claimed');
      expect(entry.details.previous_status).toBe('pending');
    });
  });
});

// ─── Agent State Machine Tests ──────────────────────────────────────────────

describe('Agent State Machine', () => {
  const VALID_TRANSITIONS: Record<string, string[]> = {
    idle: ['running', 'paused', 'terminated'],
    running: ['idle', 'paused', 'terminated'],
    paused: ['idle', 'terminated'],
    terminated: [],
  };

  it('idle can transition to running, paused, terminated', () => {
    expect(VALID_TRANSITIONS['idle']).toContain('running');
    expect(VALID_TRANSITIONS['idle']).toContain('paused');
    expect(VALID_TRANSITIONS['idle']).toContain('terminated');
  });

  it('running can transition to idle, paused, terminated', () => {
    expect(VALID_TRANSITIONS['running']).toContain('idle');
    expect(VALID_TRANSITIONS['running']).toContain('paused');
    expect(VALID_TRANSITIONS['running']).toContain('terminated');
  });

  it('paused can transition to idle or terminated only', () => {
    expect(VALID_TRANSITIONS['paused']).toEqual(['idle', 'terminated']);
  });

  it('terminated is a terminal state', () => {
    expect(VALID_TRANSITIONS['terminated']).toEqual([]);
  });

  it('no state can transition to itself', () => {
    for (const [state, targets] of Object.entries(VALID_TRANSITIONS)) {
      expect(targets).not.toContain(state);
    }
  });

  it('terminated cannot be reached from terminated', () => {
    expect(VALID_TRANSITIONS['terminated']).not.toContain('terminated');
  });
});

// ─── Agent CLI Template Tests ────────────────────────────────────────────────

describe('Agent CLI Template (extended)', () => {
  const output = generateAgentCli('https://test.supabase.co');

  // Original actions still work
  it('has all original actions', () => {
    expect(output).toContain('next)');
    expect(output).toContain('claim)');
    expect(output).toContain('complete)');
    expect(output).toContain('block)');
    expect(output).toContain('status)');
    expect(output).toContain('list)');
    expect(output).toContain('loop)');
  });

  // New comment actions
  it('has comment actions', () => {
    expect(output).toContain('comment)');
    expect(output).toContain('comments)');
    expect(output).toContain('action');
    expect(output).toContain('comment');
  });

  // New agent management actions
  it('has agent management actions', () => {
    expect(output).toContain('register)');
    expect(output).toContain('pause)');
    expect(output).toContain('resume)');
    expect(output).toContain('agent:register');
    expect(output).toContain('agent:pause');
    expect(output).toContain('agent:resume');
  });

  // Heartbeat action
  it('has heartbeat action', () => {
    expect(output).toContain('heartbeat)');
    expect(output).toContain('heartbeat:start');
  });

  // Cost actions
  it('has cost actions', () => {
    expect(output).toContain('cost)');
    expect(output).toContain('costs)');
    expect(output).toContain('cost:record');
    expect(output).toContain('cost:summary');
  });

  // Activity action
  it('has activity action', () => {
    expect(output).toContain('activity)');
    expect(output).toContain('activity:list');
  });

  // Help text covers all sections
  it('help text lists all action categories', () => {
    expect(output).toContain('Task Actions:');
    expect(output).toContain('Comment Actions:');
    expect(output).toContain('Agent Actions:');
    expect(output).toContain('Runtime Actions:');
  });

  it('includes the Supabase URL', () => {
    expect(output).toContain('https://test.supabase.co');
  });

  it('mentions atomic claim in help', () => {
    expect(output).toContain('atomic');
  });
});

// ─── Migration SQL Tests ────────────────────────────────────────────────────

describe('Migration SQL (00002_agent_runtime)', () => {
  // We test that the SQL file exists and has the expected content by reading it
  // In a real test, we'd run it against a test database. Here we verify structure.
  const fs = require('fs');
  const path = require('path');
  const migrationPath = path.resolve(__dirname, '../../supabase/migrations/00002_agent_runtime.sql');

  let sql: string;
  try {
    sql = fs.readFileSync(migrationPath, 'utf-8');
  } catch {
    sql = '';
  }

  it('migration file exists', () => {
    expect(sql.length).toBeGreaterThan(0);
  });

  it('creates agents table with status check constraint', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.agents');
    expect(sql).toContain("('idle', 'running', 'paused', 'terminated')");
  });

  it('creates heartbeat_runs table', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.heartbeat_runs');
    expect(sql).toContain("('queued', 'running', 'succeeded', 'failed', 'cancelled', 'timed_out')");
  });

  it('creates run_logs table with stream types', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.run_logs');
    expect(sql).toContain("('stdout', 'stderr', 'system')");
  });

  it('creates cost_events table', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.cost_events');
    expect(sql).toContain('cost_cents');
    expect(sql).toContain('input_tokens');
    expect(sql).toContain('output_tokens');
  });

  it('creates activity_log table', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.activity_log');
    expect(sql).toContain('entity_type');
    expect(sql).toContain('entity_id');
  });

  it('creates task_comments table with comment types', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.task_comments');
    expect(sql).toContain("('note', 'blocker', 'resolution', 'review', 'system')");
  });

  it('has RLS policies on all tables', () => {
    expect(sql).toContain('ENABLE ROW LEVEL SECURITY');
    const rlsCount = (sql.match(/ENABLE ROW LEVEL SECURITY/g) || []).length;
    expect(rlsCount).toBeGreaterThanOrEqual(6); // agents, heartbeat_runs, run_logs, cost_events, activity_log, task_comments
  });

  it('has indexes on key columns', () => {
    expect(sql).toContain('idx_agents_user_status');
    expect(sql).toContain('idx_heartbeat_runs_agent');
    expect(sql).toContain('idx_run_logs_run_seq');
    expect(sql).toContain('idx_cost_events_agent');
    expect(sql).toContain('idx_activity_log_user');
    expect(sql).toContain('idx_task_comments_task');
  });

  it('enables realtime for new tables', () => {
    expect(sql).toContain('ALTER PUBLICATION supabase_realtime ADD TABLE public.agents');
    expect(sql).toContain('ALTER PUBLICATION supabase_realtime ADD TABLE public.heartbeat_runs');
    expect(sql).toContain('ALTER PUBLICATION supabase_realtime ADD TABLE public.run_logs');
    expect(sql).toContain('ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log');
    expect(sql).toContain('ALTER PUBLICATION supabase_realtime ADD TABLE public.task_comments');
  });

  it('agents table has unique constraint on (user_id, agent_id)', () => {
    expect(sql).toContain('UNIQUE(user_id, agent_id)');
  });

  it('agents table has budget fields', () => {
    expect(sql).toContain('budget_monthly_cents');
    expect(sql).toContain('spent_monthly_cents');
    expect(sql).toContain('budget_reset_at');
  });

  it('agents table has session persistence fields', () => {
    expect(sql).toContain('session_id');
    expect(sql).toContain('session_params');
  });

  it('heartbeat_runs has invocation sources', () => {
    expect(sql).toContain("('scheduler', 'manual', 'callback', 'system')");
  });

  it('run_logs references heartbeat_runs with cascade delete', () => {
    expect(sql).toContain('REFERENCES public.heartbeat_runs(id) ON DELETE CASCADE');
  });

  it('cost_events references heartbeat_runs with set null', () => {
    expect(sql).toContain('REFERENCES public.heartbeat_runs(id) ON DELETE SET NULL');
  });
});

// ─── Edge Function Logic Tests ──────────────────────────────────────────────

describe('Edge Function Logic (unit-testable patterns)', () => {
  // We can't call the edge function directly, but we can test the logic patterns
  // that the edge function implements

  describe('atomic checkout semantics', () => {
    it('prevents double-claim by checking status=pending in WHERE', () => {
      // Simulate: two agents try to claim the same task
      const task = { task_code: 'P01-01', status: 'pending', assigned_to: null };

      // Agent 1 claims (would succeed)
      const agent1CanClaim = task.status === 'pending';
      expect(agent1CanClaim).toBe(true);

      // After agent 1 claims, status changes
      task.status = 'in_progress';
      task.assigned_to = 'claude-code';

      // Agent 2 tries to claim (status is no longer pending → blocked)
      const agent2CanClaim = task.status === 'pending';
      expect(agent2CanClaim).toBe(false);
    });
  });

  describe('dependency resolution', () => {
    it('finds eligible task when all deps are completed', () => {
      const tasks = [
        { task_code: 'P01-01', status: 'completed', dependencies: [], assigned_to: 'claude-code' },
        { task_code: 'P01-02', status: 'pending', dependencies: ['P01-01'], assigned_to: 'claude-code' },
        { task_code: 'P01-03', status: 'pending', dependencies: ['P01-01', 'P01-02'], assigned_to: 'claude-code' },
      ];

      const completedCodes = new Set(
        tasks.filter(t => t.status === 'completed').map(t => t.task_code)
      );

      const eligible = tasks.find(t => {
        if (t.status !== 'pending') return false;
        if (t.assigned_to !== 'claude-code') return false;
        return t.dependencies.every(d => completedCodes.has(d));
      });

      expect(eligible?.task_code).toBe('P01-02');
    });

    it('returns null when deps are unmet', () => {
      const tasks = [
        { task_code: 'P01-01', status: 'in_progress', dependencies: [], assigned_to: 'claude-code' },
        { task_code: 'P01-02', status: 'pending', dependencies: ['P01-01'], assigned_to: 'claude-code' },
      ];

      const completedCodes = new Set(
        tasks.filter(t => t.status === 'completed').map(t => t.task_code)
      );

      const eligible = tasks.find(t => {
        if (t.status !== 'pending') return false;
        return t.dependencies.every(d => completedCodes.has(d));
      });

      expect(eligible).toBeUndefined();
    });
  });

  describe('budget enforcement', () => {
    it('blocks operations when budget is exhausted', () => {
      const agent = { budget_monthly_cents: 5000, spent_monthly_cents: 5000 };
      const budgetExhausted = agent.budget_monthly_cents > 0 &&
        agent.spent_monthly_cents >= agent.budget_monthly_cents;
      expect(budgetExhausted).toBe(true);
    });

    it('allows operations when under budget', () => {
      const agent = { budget_monthly_cents: 5000, spent_monthly_cents: 4999 };
      const budgetExhausted = agent.budget_monthly_cents > 0 &&
        agent.spent_monthly_cents >= agent.budget_monthly_cents;
      expect(budgetExhausted).toBe(false);
    });

    it('allows operations when no budget is set', () => {
      const agent = { budget_monthly_cents: 0, spent_monthly_cents: 99999 };
      const budgetExhausted = agent.budget_monthly_cents > 0 &&
        agent.spent_monthly_cents >= agent.budget_monthly_cents;
      expect(budgetExhausted).toBe(false);
    });
  });

  describe('state machine transitions', () => {
    const VALID_TRANSITIONS: Record<string, string[]> = {
      idle: ['running', 'paused', 'terminated'],
      running: ['idle', 'paused', 'terminated'],
      paused: ['idle', 'terminated'],
      terminated: [],
    };

    function canTransition(from: string, to: string): boolean {
      return (VALID_TRANSITIONS[from] || []).includes(to);
    }

    it('validates allowed transitions', () => {
      expect(canTransition('idle', 'running')).toBe(true);
      expect(canTransition('running', 'idle')).toBe(true);
      expect(canTransition('paused', 'idle')).toBe(true);
    });

    it('rejects invalid transitions', () => {
      expect(canTransition('terminated', 'idle')).toBe(false);
      expect(canTransition('terminated', 'running')).toBe(false);
      expect(canTransition('paused', 'running')).toBe(false);
    });

    it('all states except terminated can reach terminated', () => {
      for (const state of ['idle', 'running', 'paused']) {
        expect(canTransition(state, 'terminated')).toBe(true);
      }
    });
  });

  describe('XP calculation', () => {
    it('sums XP from completed tasks only', () => {
      const tasks = [
        { status: 'completed', xp_reward: 25 },
        { status: 'completed', xp_reward: 30 },
        { status: 'in_progress', xp_reward: 50 },
        { status: 'pending', xp_reward: 35 },
      ];

      const totalXp = tasks
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.xp_reward || 0), 0);

      expect(totalXp).toBe(55);
    });

    it('determines correct level from XP', () => {
      const levels = [...GAMIFICATION_LEVELS];
      const xp = 3500;

      const sorted = [...levels].sort((a, b) => b.xpRequired - a.xpRequired);
      const current = sorted.find(l => xp >= l.xpRequired);

      expect(current?.title).toBe('Architect'); // level 9, xp 3000
    });
  });

  describe('cost aggregation', () => {
    it('rolls up costs by agent', () => {
      const events = [
        { agent_id: 'claude-code', cost_cents: 10 },
        { agent_id: 'claude-code', cost_cents: 20 },
        { agent_id: 'agent-2', cost_cents: 5 },
      ];

      const byAgent: Record<string, { cost_cents: number; events: number }> = {};
      for (const e of events) {
        if (!byAgent[e.agent_id]) byAgent[e.agent_id] = { cost_cents: 0, events: 0 };
        byAgent[e.agent_id].cost_cents += e.cost_cents;
        byAgent[e.agent_id].events++;
      }

      expect(byAgent['claude-code']).toEqual({ cost_cents: 30, events: 2 });
      expect(byAgent['agent-2']).toEqual({ cost_cents: 5, events: 1 });
    });

    it('rolls up costs by model', () => {
      const events = [
        { model: 'claude-opus-4', cost_cents: 45 },
        { model: 'gemini-flash', cost_cents: 2 },
        { model: 'gemini-flash', cost_cents: 3 },
      ];

      const byModel: Record<string, { cost_cents: number; events: number }> = {};
      for (const e of events) {
        if (!byModel[e.model]) byModel[e.model] = { cost_cents: 0, events: 0 };
        byModel[e.model].cost_cents += e.cost_cents;
        byModel[e.model].events++;
      }

      expect(byModel['claude-opus-4']).toEqual({ cost_cents: 45, events: 1 });
      expect(byModel['gemini-flash']).toEqual({ cost_cents: 5, events: 2 });
    });
  });

  describe('heartbeat run lifecycle', () => {
    it('calculates duration from start to finish', () => {
      const startedAt = new Date('2026-03-09T10:00:00Z');
      const finishedAt = new Date('2026-03-09T10:05:30Z');
      const durationMs = finishedAt.getTime() - startedAt.getTime();
      expect(durationMs).toBe(330000); // 5 min 30 sec
    });

    it('enforces max concurrent runs', () => {
      const maxConcurrent = 1;
      const activeRuns = [{ id: 'run-1', status: 'running' }];
      const canStart = activeRuns.length < maxConcurrent;
      expect(canStart).toBe(false);
    });

    it('allows starting when no active runs', () => {
      const maxConcurrent = 1;
      const activeRuns: unknown[] = [];
      const canStart = activeRuns.length < maxConcurrent;
      expect(canStart).toBe(true);
    });
  });

  describe('wakeup idempotency', () => {
    it('coalesces duplicate wakeup requests', () => {
      // Simulate: same idempotency key arrives twice
      const queue: Array<{ id: string; idempotency_key: string; coalesced_count: number; status: string }> = [];

      // First request
      queue.push({ id: 'w1', idempotency_key: 'agent-2026030910', coalesced_count: 1, status: 'queued' });

      // Second request with same key — find existing queued entry
      const existing = queue.find(
        w => w.idempotency_key === 'agent-2026030910' && w.status === 'queued'
      );

      expect(existing).toBeDefined();

      // Coalesce instead of creating new
      if (existing) {
        existing.coalesced_count++;
      }

      expect(queue).toHaveLength(1);
      expect(queue[0].coalesced_count).toBe(2);
    });

    it('creates new entry when no matching key exists', () => {
      const queue: Array<{ id: string; idempotency_key: string; coalesced_count: number; status: string }> = [];
      queue.push({ id: 'w1', idempotency_key: 'agent-hour1', coalesced_count: 1, status: 'queued' });

      const existing = queue.find(
        w => w.idempotency_key === 'agent-hour2' && w.status === 'queued'
      );
      expect(existing).toBeUndefined();
      // Would create new entry
    });

    it('does not coalesce already-claimed requests', () => {
      const queue = [
        { id: 'w1', idempotency_key: 'agent-hour1', coalesced_count: 1, status: 'claimed' },
      ];

      const existing = queue.find(
        w => w.idempotency_key === 'agent-hour1' && w.status === 'queued'
      );
      expect(existing).toBeUndefined();
      // Would create new entry since existing is claimed, not queued
    });
  });

  describe('config revision tracking', () => {
    it('detects changed keys', () => {
      const before = { budget_monthly_cents: 5000, heartbeat_interval_sec: 300, max_concurrent_runs: 1 };
      const patch = { budget_monthly_cents: 10000, heartbeat_interval_sec: 300 };

      const changedKeys = Object.keys(patch).filter(
        k => JSON.stringify(before[k as keyof typeof before]) !== JSON.stringify(patch[k as keyof typeof patch])
      );

      expect(changedKeys).toEqual(['budget_monthly_cents']);
    });

    it('returns empty when no changes', () => {
      const before = { budget_monthly_cents: 5000, heartbeat_interval_sec: 300 };
      const patch = { budget_monthly_cents: 5000, heartbeat_interval_sec: 300 };

      const changedKeys = Object.keys(patch).filter(
        k => JSON.stringify(before[k as keyof typeof before]) !== JSON.stringify(patch[k as keyof typeof patch])
      );

      expect(changedKeys).toEqual([]);
    });

    it('tracks revision numbers sequentially', () => {
      const revisions = [
        { revision_number: 1, source: 'register' },
        { revision_number: 2, source: 'patch' },
        { revision_number: 3, source: 'rollback' },
      ];
      const nextRevision = revisions.length > 0
        ? Math.max(...revisions.map(r => r.revision_number)) + 1
        : 1;
      expect(nextRevision).toBe(4);
    });
  });

  describe('stale run detection', () => {
    const STALE_THRESHOLD_MS = 60 * 60 * 1000; // 60 min

    it('detects runs older than threshold', () => {
      const now = Date.now();
      const runs = [
        { id: 'r1', started_at: new Date(now - 90 * 60 * 1000).toISOString(), status: 'running' },
        { id: 'r2', started_at: new Date(now - 30 * 60 * 1000).toISOString(), status: 'running' },
        { id: 'r3', started_at: new Date(now - 5 * 60 * 1000).toISOString(), status: 'running' },
      ];

      const stale = runs.filter(r => {
        const elapsed = now - new Date(r.started_at).getTime();
        return elapsed > STALE_THRESHOLD_MS;
      });

      expect(stale).toHaveLength(1);
      expect(stale[0].id).toBe('r1');
    });

    it('reports elapsed time in minutes', () => {
      const now = Date.now();
      const startedAt = new Date(now - 75 * 60 * 1000).toISOString();
      const elapsedMin = Math.round((now - new Date(startedAt).getTime()) / 60000);
      expect(elapsedMin).toBe(75);
    });
  });

  describe('dashboard aggregation', () => {
    it('buckets tasks correctly', () => {
      const tasks = [
        { status: 'pending' }, { status: 'pending' },
        { status: 'in_progress' },
        { status: 'completed' }, { status: 'completed' }, { status: 'completed' },
        { status: 'blocked' },
      ];

      const buckets = {
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        blocked: tasks.filter(t => t.status === 'blocked').length,
      };

      expect(buckets).toEqual({ pending: 2, in_progress: 1, completed: 3, blocked: 1 });
    });

    it('calculates budget utilization', () => {
      const monthSpend = 4500;
      const monthBudget = 10000;
      const utilization = monthBudget > 0 ? Math.round((monthSpend / monthBudget) * 100) : 0;
      expect(utilization).toBe(45);
    });

    it('handles zero budget gracefully', () => {
      const utilization = 0 > 0 ? Math.round((500 / 0) * 100) : 0;
      expect(utilization).toBe(0);
    });
  });

  describe('doctor health checks', () => {
    it('reports overall status based on worst check', () => {
      const checks: { name: string; status: 'ok' | 'warn' | 'fail' }[] = [
        { name: 'tasks', status: 'ok' },
        { name: 'agents', status: 'warn' },
        { name: 'levels', status: 'ok' },
      ];

      const overall = checks.some(c => c.status === 'fail')
        ? 'fail'
        : checks.some(c => c.status === 'warn')
          ? 'warn'
          : 'ok';

      expect(overall).toBe('warn');
    });

    it('reports ok when all checks pass', () => {
      const checks: { name: string; status: 'ok' | 'warn' | 'fail' }[] = [
        { name: 'tasks', status: 'ok' },
        { name: 'agents', status: 'ok' },
      ];

      const overall = checks.some(c => c.status === 'fail')
        ? 'fail'
        : checks.some(c => c.status === 'warn')
          ? 'warn'
          : 'ok';

      expect(overall).toBe('ok');
    });

    it('fail overrides warn', () => {
      const checks: { name: string; status: 'ok' | 'warn' | 'fail' }[] = [
        { name: 'tasks', status: 'fail' },
        { name: 'agents', status: 'warn' },
      ];

      const overall = checks.some(c => c.status === 'fail')
        ? 'fail'
        : checks.some(c => c.status === 'warn')
          ? 'warn'
          : 'ok';

      expect(overall).toBe('fail');
    });
  });

  describe('context snapshot enrichment', () => {
    it('builds context with task details and budget', () => {
      const task = {
        task_code: 'P01-03',
        title: 'Set up auth',
        description: 'Configure Supabase auth',
        wat_references: ['knowledge/skills/shared/auth.skill.md'],
      };

      const agent = {
        budget_monthly_cents: 5000,
        spent_monthly_cents: 1200,
      };

      const context: Record<string, unknown> = {
        wake_source: 'manual',
        agent_id: 'claude-code',
        task,
        budget: {
          monthly_cents: agent.budget_monthly_cents,
          spent_cents: agent.spent_monthly_cents,
          remaining_cents: agent.budget_monthly_cents - agent.spent_monthly_cents,
        },
      };

      expect(context.task).toBeDefined();
      expect((context.budget as Record<string, number>).remaining_cents).toBe(3800);
      expect(context.wake_source).toBe('manual');
    });
  });
});

// ─── Migration SQL V2 Tests ─────────────────────────────────────────────────

describe('Migration SQL (00003_agent_runtime_v2)', () => {
  const fs = require('fs');
  const path = require('path');
  const migrationPath = path.resolve(__dirname, '../../supabase/migrations/00003_agent_runtime_v2.sql');

  let sql: string;
  try {
    sql = fs.readFileSync(migrationPath, 'utf-8');
  } catch {
    sql = '';
  }

  it('migration file exists', () => {
    expect(sql.length).toBeGreaterThan(0);
  });

  it('creates wakeup_requests table', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.wakeup_requests');
    expect(sql).toContain('idempotency_key');
    expect(sql).toContain('coalesced_count');
  });

  it('creates config_revisions table', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.config_revisions');
    expect(sql).toContain('before_config');
    expect(sql).toContain('after_config');
    expect(sql).toContain('changed_keys');
    expect(sql).toContain('rolled_back_from_revision_id');
  });

  it('adds timeout_sec to agents', () => {
    expect(sql).toContain('timeout_sec');
  });

  it('has RLS on new tables', () => {
    expect(sql).toContain('wakeup_requests_select');
    expect(sql).toContain('config_revisions_select');
  });

  it('has idempotency index', () => {
    expect(sql).toContain('idx_wakeup_requests_idempotency');
  });
});

// ─── Agent CLI V2 Tests ─────────────────────────────────────────────────────

describe('Agent CLI Template (v2 actions)', () => {
  const output = generateAgentCli('https://test.supabase.co');

  it('has wakeup action', () => {
    expect(output).toContain('wakeup)');
    expect(output).toContain('wakeup:request');
  });

  it('has dashboard action', () => {
    expect(output).toContain('dashboard)');
    expect(output).toContain('dashboard');
  });

  it('has doctor action', () => {
    expect(output).toContain('doctor)');
    expect(output).toContain('doctor');
  });

  it('has config actions', () => {
    expect(output).toContain('config)');
    expect(output).toContain('config-history)');
    expect(output).toContain('config:update');
    expect(output).toContain('config:history');
  });

  it('help text includes Diagnostics section', () => {
    expect(output).toContain('Diagnostics:');
    expect(output).toContain('dashboard');
    expect(output).toContain('doctor');
  });

  it('wakeup uses hourly idempotency key', () => {
    expect(output).toContain('idempotency_key');
    expect(output).toContain('date +%Y%m%d%H');
  });
});
