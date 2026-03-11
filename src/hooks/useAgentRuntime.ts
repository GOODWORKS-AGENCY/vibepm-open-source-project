import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase as _supabase } from '@/integrations/supabase/client';

// Cast to any to allow querying tables not yet in the generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = _supabase as any;
import { useToast } from '@/hooks/use-toast';
import type {
  Agent,
  AgentStatus,
  HeartbeatRun,
  RunLog,
  CostEvent,
  CostSummary,
  ActivityLogEntry,
  TaskComment,
  WakeupRequest,
  ConfigRevision,
  DashboardData,
  DoctorResult,
} from '@/types/project';

// ─── Agent API caller ────────────────────────────────────────────────────────

async function callAgentApi(action: string, params: Record<string, unknown> = {}) {

  const res = await supabase.functions.invoke('agent-tasks', {
    body: { action, ...params },
  });

  if (res.error) throw new Error(res.error.message);
  return res.data;
}

// ─── useAgents: agent state machine ──────────────────────────────────────────

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Error loading agents', description: error.message, variant: 'destructive' });
    } else {
      setAgents((data || []) as unknown as Agent[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('agents-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => {
        fetchAgents();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAgents]);

  const registerAgent = useCallback(async (
    agentId: string,
    opts?: { budget_monthly_cents?: number; heartbeat_interval_sec?: number }
  ) => {
    const data = await callAgentApi('agent:register', { agent_id: agentId, ...opts });
    await fetchAgents();
    return data.agent as Agent;
  }, [fetchAgents]);

  const pauseAgent = useCallback(async (agentId: string, reason?: string) => {
    await callAgentApi('agent:pause', { agent_id: agentId, reason });
    await fetchAgents();
  }, [fetchAgents]);

  const resumeAgent = useCallback(async (agentId: string) => {
    await callAgentApi('agent:resume', { agent_id: agentId });
    await fetchAgents();
  }, [fetchAgents]);

  const terminateAgent = useCallback(async (agentId: string, reason?: string) => {
    await callAgentApi('agent:terminate', { agent_id: agentId, reason });
    await fetchAgents();
  }, [fetchAgents]);

  const getAgentStatus = useCallback(async (agentId: string) => {
    return await callAgentApi('agent:status', { agent_id: agentId });
  }, []);

  return {
    agents,
    isLoading,
    registerAgent,
    pauseAgent,
    resumeAgent,
    terminateAgent,
    getAgentStatus,
    refresh: fetchAgents,
  };
}

// ─── useHeartbeats: run management ───────────────────────────────────────────

export function useHeartbeats(agentId?: string) {
  const [runs, setRuns] = useState<HeartbeatRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRuns = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from('heartbeat_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(50);

    if (agentId) query = query.eq('agent_id', agentId);

    const { data, error } = await query;
    if (error) {
      toast({ title: 'Error loading runs', description: error.message, variant: 'destructive' });
    } else {
      setRuns((data || []) as unknown as HeartbeatRun[]);
    }
    setIsLoading(false);
  }, [agentId, toast]);

  useEffect(() => { fetchRuns(); }, [fetchRuns]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('heartbeat-runs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'heartbeat_runs' }, () => {
        fetchRuns();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchRuns]);

  const startRun = useCallback(async (
    agentId: string,
    opts?: { task_code?: string; invocation_source?: string; context_snapshot?: Record<string, unknown> }
  ) => {
    const data = await callAgentApi('heartbeat:start', { agent_id: agentId, ...opts });
    await fetchRuns();
    return data.run as HeartbeatRun;
  }, [fetchRuns]);

  const completeRun = useCallback(async (
    runId: string,
    opts?: { status?: string; result_json?: Record<string, unknown>; error_message?: string; agent_id?: string }
  ) => {
    const data = await callAgentApi('heartbeat:complete', { run_id: runId, ...opts });
    await fetchRuns();
    return data;
  }, [fetchRuns]);

  const appendLog = useCallback(async (runId: string, chunk: string, stream?: string) => {
    return await callAgentApi('heartbeat:log', { run_id: runId, chunk, stream });
  }, []);

  const activeRun = useMemo(
    () => runs.find(r => r.status === 'running' || r.status === 'queued'),
    [runs]
  );

  return {
    runs,
    activeRun,
    isLoading,
    startRun,
    completeRun,
    appendLog,
    refresh: fetchRuns,
  };
}

// ─── useRunLogs: streaming log viewer ────────────────────────────────────────

export function useRunLogs(runId: string | null) {
  const [logs, setLogs] = useState<RunLog[]>([]);
  const fetchLogs = useCallback(async () => {
    if (!runId) return;
    const { data } = await supabase
      .from('run_logs')
      .select('*')
      .eq('run_id', runId)
      .order('seq', { ascending: true });

    setLogs((data || []) as unknown as RunLog[]);
  }, [runId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Realtime subscription for live streaming
  useEffect(() => {
    if (!runId) return;
    const channel = supabase
      .channel(`run-logs-${runId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'run_logs',
        filter: `run_id=eq.${runId}`,
      }, (payload) => {
        setLogs(prev => [...prev, payload.new as unknown as RunLog]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [runId]);

  const fullOutput = useMemo(
    () => logs.map(l => l.chunk).join(''),
    [logs]
  );

  return { logs, fullOutput };
}

// ─── useCosts: cost tracking ─────────────────────────────────────────────────

export function useCosts(agentId?: string) {
  const [events, setEvents] = useState<CostEvent[]>([]);
  const [summary, setSummary] = useState<CostSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from('cost_events')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(100);

    if (agentId) query = query.eq('agent_id', agentId);

    const { data, error } = await query;
    if (error) {
      toast({ title: 'Error loading costs', description: error.message, variant: 'destructive' });
    } else {
      setEvents((data || []) as unknown as CostEvent[]);
    }
    setIsLoading(false);
  }, [agentId, toast]);

  const fetchSummary = useCallback(async (days = 30) => {
    const data = await callAgentApi('cost:summary', { agent_id: agentId, days });
    setSummary(data as CostSummary);
    return data as CostSummary;
  }, [agentId]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const recordCost = useCallback(async (params: {
    provider: string;
    model: string;
    input_tokens?: number;
    output_tokens?: number;
    cost_cents: number;
    task_code?: string;
    run_id?: string;
    agent_id?: string;
  }) => {
    const data = await callAgentApi('cost:record', params);
    await fetchEvents();
    return data.cost_event as CostEvent;
  }, [fetchEvents]);

  return {
    events,
    summary,
    isLoading,
    recordCost,
    fetchSummary,
    refresh: fetchEvents,
  };
}

// ─── useTaskComments: per-task discussion ────────────────────────────────────

export function useTaskComments(taskCode: string | null) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchComments = useCallback(async () => {
    if (!taskCode) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('task_comments')
      .select('*')
      .eq('task_code', taskCode)
      .order('created_at', { ascending: true });

    setComments((data || []) as unknown as TaskComment[]);
    setIsLoading(false);
  }, [taskCode]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // Realtime
  useEffect(() => {
    if (!taskCode) return;
    const channel = supabase
      .channel(`task-comments-${taskCode}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'task_comments',
        filter: `task_code=eq.${taskCode}`,
      }, () => {
        fetchComments();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [taskCode, fetchComments]);

  const addComment = useCallback(async (body: string, opts?: { author?: string; comment_type?: string }) => {
    if (!taskCode) return;
    const data = await callAgentApi('comment', {
      task_code: taskCode,
      body,
      ...opts,
    });
    await fetchComments();
    return data.comment as TaskComment;
  }, [taskCode, fetchComments]);

  return { comments, isLoading, addComment, refresh: fetchComments };
}

// ─── useActivityLog: audit trail ─────────────────────────────────────────────

export function useActivityLog(opts?: { entityType?: string; entityId?: string; limit?: number }) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(opts?.limit || 50);

    if (opts?.entityType) query = query.eq('entity_type', opts.entityType);
    if (opts?.entityId) query = query.eq('entity_id', opts.entityId);

    const { data } = await query;
    setActivities((data || []) as unknown as ActivityLogEntry[]);
    setIsLoading(false);
  }, [opts?.entityType, opts?.entityId, opts?.limit]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('activity-log-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
        fetchActivities();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchActivities]);

  return { activities, isLoading, refresh: fetchActivities };
}

// ─── useWakeups: wakeup request queue ────────────────────────────────────────

export function useWakeups(agentId?: string) {
  const [wakeups, setWakeups] = useState<WakeupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchWakeups = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from('wakeup_requests')
      .select('*')
      .order('requested_at', { ascending: false })
      .limit(20);

    if (agentId) query = query.eq('agent_id', agentId);

    const { data } = await query;
    setWakeups((data || []) as unknown as WakeupRequest[]);
    setIsLoading(false);
  }, [agentId]);

  useEffect(() => { fetchWakeups(); }, [fetchWakeups]);

  useEffect(() => {
    const channel = supabase
      .channel('wakeup-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wakeup_requests' }, () => {
        fetchWakeups();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchWakeups]);

  const requestWakeup = useCallback(async (
    agentId: string,
    opts?: { reason?: string; task_code?: string; idempotency_key?: string }
  ) => {
    const data = await callAgentApi('wakeup:request', { agent_id: agentId, ...opts });
    await fetchWakeups();
    return data;
  }, [fetchWakeups]);

  const pendingCount = useMemo(
    () => wakeups.filter(w => w.status === 'queued').length,
    [wakeups]
  );

  return { wakeups, pendingCount, isLoading, requestWakeup, refresh: fetchWakeups };
}

// ─── useConfigHistory: config revision tracking ──────────────────────────────

export function useConfigHistory(agentId: string) {
  const [revisions, setRevisions] = useState<ConfigRevision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchRevisions = useCallback(async () => {
    if (!agentId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('config_revisions')
      .select('*')
      .eq('agent_id', agentId)
      .order('revision_number', { ascending: false })
      .limit(20);

    setRevisions((data || []) as unknown as ConfigRevision[]);
    setIsLoading(false);
  }, [agentId]);

  useEffect(() => { fetchRevisions(); }, [fetchRevisions]);

  const updateConfig = useCallback(async (config: Record<string, unknown>) => {
    const data = await callAgentApi('config:update', { agent_id: agentId, config });
    await fetchRevisions();
    return data;
  }, [agentId, fetchRevisions]);

  const rollback = useCallback(async (revisionId: string) => {
    const data = await callAgentApi('config:rollback', { agent_id: agentId, revision_id: revisionId });
    await fetchRevisions();
    return data;
  }, [agentId, fetchRevisions]);

  return { revisions, isLoading, updateConfig, rollback, refresh: fetchRevisions };
}

// ─── useDashboard: aggregated overview ───────────────────────────────────────

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    const result = await callAgentApi('dashboard');
    setData(result as DashboardData);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, refresh: fetch };
}

// ─── useDoctor: health checks ────────────────────────────────────────────────

export function useDoctor() {
  const [result, setResult] = useState<DoctorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runChecks = useCallback(async () => {
    setIsLoading(true);
    const data = await callAgentApi('doctor');
    setResult(data as DoctorResult);
    setIsLoading(false);
    return data as DoctorResult;
  }, []);

  return { result, isLoading, runChecks };
}
