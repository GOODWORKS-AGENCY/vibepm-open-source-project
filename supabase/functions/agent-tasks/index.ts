import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Agent Tasks API — the runtime loop for autonomous agents.
 *
 * Task actions:
 *   next       — get the highest-priority pending task (respects dependencies)
 *   claim      — atomically claim a task (race-safe)
 *   complete   — mark a task as completed (awards XP)
 *   block      — mark a task as blocked with a note
 *   status     — get overall progress stats
 *   list       — list tasks with optional filters
 *
 * Comment actions:
 *   comment    — add a comment to a task
 *   comments   — list comments for a task
 *
 * Agent actions:
 *   agent:register  — register/upsert an agent
 *   agent:status    — get agent status
 *   agent:pause     — pause an agent
 *   agent:resume    — resume a paused agent
 *   agent:terminate — permanently terminate an agent
 *
 * Heartbeat actions:
 *   heartbeat:start    — start a heartbeat run
 *   heartbeat:complete — complete a heartbeat run
 *   heartbeat:log      — append a log chunk to a run
 *
 * Cost actions:
 *   cost:record   — record a cost event
 *   cost:summary  — get cost summary
 *
 * Activity actions:
 *   activity:list — get recent activity log
 *
 * Wakeup actions:
 *   wakeup:request  — request an agent wakeup (idempotent)
 *   wakeup:claim    — claim a queued wakeup
 *   wakeup:finish   — mark wakeup finished
 *   wakeup:list     — list wakeup requests
 *
 * Config actions:
 *   config:update   — update agent config with revision tracking
 *   config:rollback — rollback to a previous config revision
 *   config:history  — list config revisions
 *
 * Dashboard actions:
 *   dashboard       — aggregated overview with stale run detection
 *
 * Doctor actions:
 *   doctor          — health check: tables, agents, stale runs, budget
 */

// ─── Valid agent status transitions ──────────────────────────────────────────

const VALID_TRANSITIONS: Record<string, string[]> = {
  idle: ["running", "paused", "terminated"],
  running: ["idle", "paused", "terminated"],
  paused: ["idle", "terminated"],
  terminated: [], // terminal state
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return error(401, "Missing Authorization header");
    }

    // deno-lint-ignore no-explicit-any
    const supabase: any = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) {
      return error(401, "Invalid or expired token");
    }

    const { action, ...params } = await req.json();

    // ── Task actions ──────────────────────────────────────────────────────
    switch (action) {
      case "next":
        return await handleNext(supabase, user.id, params);
      case "claim":
        return await handleClaim(supabase, user.id, params);
      case "complete":
        return await handleComplete(supabase, user.id, params);
      case "block":
        return await handleBlock(supabase, user.id, params);
      case "status":
        return await handleStatus(supabase, user.id);
      case "list":
        return await handleList(supabase, user.id, params);

      // ── Comment actions ─────────────────────────────────────────────────
      case "comment":
        return await handleAddComment(supabase, user.id, params);
      case "comments":
        return await handleListComments(supabase, user.id, params);

      // ── Agent state machine ─────────────────────────────────────────────
      case "agent:register":
        return await handleAgentRegister(supabase, user.id, params);
      case "agent:status":
        return await handleAgentStatus(supabase, user.id, params);
      case "agent:pause":
        return await handleAgentTransition(supabase, user.id, params, "paused");
      case "agent:resume":
        return await handleAgentTransition(supabase, user.id, params, "idle");
      case "agent:terminate":
        return await handleAgentTransition(supabase, user.id, params, "terminated");

      // ── Heartbeat actions ───────────────────────────────────────────────
      case "heartbeat:start":
        return await handleHeartbeatStart(supabase, user.id, params);
      case "heartbeat:complete":
        return await handleHeartbeatComplete(supabase, user.id, params);
      case "heartbeat:log":
        return await handleHeartbeatLog(supabase, user.id, params);

      // ── Cost actions ────────────────────────────────────────────────────
      case "cost:record":
        return await handleCostRecord(supabase, user.id, params);
      case "cost:summary":
        return await handleCostSummary(supabase, user.id, params);

      // ── Activity actions ────────────────────────────────────────────────
      case "activity:list":
        return await handleActivityList(supabase, user.id, params);

      // ── Wakeup actions ──────────────────────────────────────────────────
      case "wakeup:request":
        return await handleWakeupRequest(supabase, user.id, params);
      case "wakeup:claim":
        return await handleWakeupClaim(supabase, user.id, params);
      case "wakeup:finish":
        return await handleWakeupFinish(supabase, user.id, params);
      case "wakeup:list":
        return await handleWakeupList(supabase, user.id, params);

      // ── Config actions ──────────────────────────────────────────────────
      case "config:update":
        return await handleConfigUpdate(supabase, user.id, params);
      case "config:rollback":
        return await handleConfigRollback(supabase, user.id, params);
      case "config:history":
        return await handleConfigHistory(supabase, user.id, params);

      // ── Dashboard + Doctor ──────────────────────────────────────────────
      case "dashboard":
        return await handleDashboard(supabase, user.id);
      case "doctor":
        return await handleDoctor(supabase, user.id);

      default:
        return error(400, `Unknown action: ${action}`);
    }
  } catch (e) {
    console.error("agent-tasks error:", e);
    return error(500, e instanceof Error ? e.message : "Unknown error");
  }
});

// ─── Activity Logger (used by all mutation handlers) ─────────────────────────

async function logActivity(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  actor: string,
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, unknown> = {}
) {
  await supabase.from("activity_log").insert({
    user_id: userId,
    actor,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
}

// ─── Task Handlers ───────────────────────────────────────────────────────────

async function handleNext(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { agent_id?: string }
) {
  const agentId = params.agent_id || "claude-code";

  // Check if agent is paused or terminated
  const { data: agent } = await supabase
    .from("agents")
    .select("status, budget_monthly_cents, spent_monthly_cents")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .single();

  if (agent) {
    if (agent.status === "paused") {
      return json({ task: null, message: "Agent is paused" });
    }
    if (agent.status === "terminated") {
      return json({ task: null, message: "Agent is terminated" });
    }
    // Budget hard stop
    if (agent.budget_monthly_cents > 0 && agent.spent_monthly_cents >= agent.budget_monthly_cents) {
      return json({ task: null, message: "Monthly budget exhausted" });
    }
  }

  const { data: allTasks, error: fetchErr } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("priority", { ascending: false });

  if (fetchErr) return error(500, fetchErr.message);
  if (!allTasks || allTasks.length === 0) {
    return json({ task: null, message: "No tasks found" });
  }

  const completedCodes = new Set(
    allTasks
      .filter((t: Record<string, unknown>) => t.status === "completed")
      .map((t: Record<string, unknown>) => t.task_code)
  );

  const eligible = allTasks.find((t: Record<string, unknown>) => {
    if (t.status !== "pending") return false;
    if (t.assigned_to !== agentId) return false;
    const deps = (t.dependencies as string[]) || [];
    return deps.every((d: string) => completedCodes.has(d));
  });

  if (!eligible) {
    const blocked = allTasks.filter(
      (t: Record<string, unknown>) => t.status === "pending" && t.assigned_to === agentId
    );
    if (blocked.length > 0) {
      const unmetDeps = ((blocked[0].dependencies as string[]) || []).filter(
        (d: string) => !completedCodes.has(d)
      );
      return json({
        task: null,
        message: `${blocked.length} pending tasks but next is blocked by: ${unmetDeps.join(", ")}`,
      });
    }
    return json({ task: null, message: "All tasks completed or assigned to other agents" });
  }

  return json({ task: eligible });
}

/**
 * Atomic claim — uses conditional update to prevent race conditions.
 * If another agent already claimed the task, the WHERE clause won't match
 * and we return 409 Conflict.
 */
async function handleClaim(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { task_code: string; agent_id?: string }
) {
  if (!params.task_code) return error(400, "task_code required");
  const agentId = params.agent_id || "claude-code";

  // Check agent status before allowing claim
  const { data: agent } = await supabase
    .from("agents")
    .select("status, budget_monthly_cents, spent_monthly_cents")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .single();

  if (agent?.status === "paused") return error(403, "Agent is paused");
  if (agent?.status === "terminated") return error(403, "Agent is terminated");
  if (agent && agent.budget_monthly_cents > 0 && agent.spent_monthly_cents >= agent.budget_monthly_cents) {
    return error(403, "Monthly budget exhausted");
  }

  // First verify the task exists and get its data
  const { data: task, error: fetchErr } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("task_code", params.task_code)
    .eq("user_id", userId)
    .single();

  if (fetchErr || !task) return error(404, "Task not found");

  // Check dependencies before attempting atomic claim
  const deps = (task.dependencies as string[]) || [];
  if (deps.length > 0) {
    const { data: depTasks } = await supabase
      .from("project_tasks")
      .select("task_code, status")
      .eq("user_id", userId)
      .in("task_code", deps);

    const unmet = deps.filter(
      (d: string) =>
        !depTasks?.find(
          (dt: Record<string, unknown>) => dt.task_code === d && dt.status === "completed"
        )
    );
    if (unmet.length > 0) {
      return error(409, `Unmet dependencies: ${unmet.join(", ")}`);
    }
  }

  // ATOMIC CLAIM: Only update if status is still 'pending'
  // This is the race-safe pattern from Paperclip
  const now = new Date().toISOString();
  const { data: claimed, error: updateErr } = await supabase
    .from("project_tasks")
    .update({
      status: "in_progress",
      assigned_to: agentId,
      started_at: now,
      updated_at: now,
    })
    .eq("task_code", params.task_code)
    .eq("user_id", userId)
    .eq("status", "pending") // ← KEY: only claims if still pending
    .select();

  if (updateErr) return error(500, updateErr.message);

  // If no rows were updated, another agent got there first
  if (!claimed || claimed.length === 0) {
    return error(409, `Task ${params.task_code} is no longer pending — another agent may have claimed it`);
  }

  await logActivity(supabase, userId, agentId, "task_claimed", "task", params.task_code, {
    title: task.title,
    previous_status: "pending",
  });

  return json({
    claimed: true,
    task_code: params.task_code,
    wat_references: task.wat_references || [],
    message: `Claimed ${params.task_code}: ${task.title}`,
  });
}

async function handleComplete(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { task_code: string; notes?: string; agent_id?: string }
) {
  if (!params.task_code) return error(400, "task_code required");
  const agentId = params.agent_id || "claude-code";

  const { data: task, error: fetchErr } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("task_code", params.task_code)
    .eq("user_id", userId)
    .single();

  if (fetchErr || !task) return error(404, "Task not found");
  if (task.status === "completed") {
    return error(409, "Task is already completed");
  }

  const previousStatus = task.status;
  const updates: Record<string, unknown> = {
    status: "completed",
    progress_pct: 100,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (params.notes) updates.notes = params.notes;

  const { error: updateErr } = await supabase
    .from("project_tasks")
    .update(updates)
    .eq("task_code", params.task_code)
    .eq("user_id", userId);

  if (updateErr) return error(500, updateErr.message);

  // Calculate total XP
  const { data: allTasks } = await supabase
    .from("project_tasks")
    .select("xp_reward, status")
    .eq("user_id", userId);

  const totalXp = (allTasks || [])
    .filter((t: Record<string, unknown>) => t.status === "completed")
    .reduce((sum: number, t: Record<string, unknown>) => sum + ((t.xp_reward as number) || 0), 0);

  const { data: levels } = await supabase
    .from("project_levels")
    .select("*")
    .order("xp_required", { ascending: false });

  const currentLevel = levels?.find((l: Record<string, unknown>) => totalXp >= (l.xp_required as number));

  await logActivity(supabase, userId, agentId, "task_completed", "task", params.task_code, {
    title: task.title,
    previous_status: previousStatus,
    xp_earned: task.xp_reward,
    total_xp: totalXp,
  });

  return json({
    completed: true,
    task_code: params.task_code,
    xp_earned: task.xp_reward,
    total_xp: totalXp,
    level: currentLevel
      ? { level: currentLevel.level, title: currentLevel.title, badge: currentLevel.badge_emoji }
      : null,
  });
}

async function handleBlock(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { task_code: string; notes: string; agent_id?: string }
) {
  if (!params.task_code) return error(400, "task_code required");
  if (!params.notes) return error(400, "notes required when blocking");
  const agentId = params.agent_id || "claude-code";

  const { data: task } = await supabase
    .from("project_tasks")
    .select("status, title")
    .eq("task_code", params.task_code)
    .eq("user_id", userId)
    .single();

  const { error: updateErr } = await supabase
    .from("project_tasks")
    .update({
      status: "blocked",
      notes: params.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("task_code", params.task_code)
    .eq("user_id", userId);

  if (updateErr) return error(500, updateErr.message);

  // Auto-create a blocker comment
  await supabase.from("task_comments").insert({
    user_id: userId,
    task_code: params.task_code,
    author: agentId,
    body: params.notes,
    comment_type: "blocker",
  });

  await logActivity(supabase, userId, agentId, "task_blocked", "task", params.task_code, {
    title: task?.title,
    previous_status: task?.status,
    reason: params.notes,
  });

  return json({
    blocked: true,
    task_code: params.task_code,
    message: `Blocked ${params.task_code}: ${params.notes}`,
  });
}

async function handleStatus(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  const { data: tasks, error: fetchErr } = await supabase
    .from("project_tasks")
    .select("status, xp_reward, phase, assigned_to")
    .eq("user_id", userId);

  if (fetchErr) return error(500, fetchErr.message);
  if (!tasks || tasks.length === 0) {
    return json({ total: 0, message: "No tasks found" });
  }

  const completed = tasks.filter((t: Record<string, unknown>) => t.status === "completed");
  const earnedXp = completed.reduce((s: number, t: Record<string, unknown>) => s + ((t.xp_reward as number) || 0), 0);
  const totalXp = tasks.reduce((s: number, t: Record<string, unknown>) => s + ((t.xp_reward as number) || 0), 0);

  const phases: Record<string, { total: number; completed: number }> = {};
  for (const t of tasks) {
    const phase = t.phase as string;
    if (!phases[phase]) phases[phase] = { total: 0, completed: 0 };
    phases[phase].total++;
    if (t.status === "completed") phases[phase].completed++;
  }

  const agents: Record<string, { total: number; completed: number }> = {};
  for (const t of tasks) {
    const agent = t.assigned_to as string;
    if (!agents[agent]) agents[agent] = { total: 0, completed: 0 };
    agents[agent].total++;
    if (t.status === "completed") agents[agent].completed++;
  }

  // Include agent statuses
  const { data: agentRecords } = await supabase
    .from("agents")
    .select("agent_id, status, spent_monthly_cents, budget_monthly_cents")
    .eq("user_id", userId);

  return json({
    total: tasks.length,
    completed: completed.length,
    in_progress: tasks.filter((t: Record<string, unknown>) => t.status === "in_progress").length,
    pending: tasks.filter((t: Record<string, unknown>) => t.status === "pending").length,
    blocked: tasks.filter((t: Record<string, unknown>) => t.status === "blocked").length,
    xp: { earned: earnedXp, total: totalXp },
    progress_pct: Math.round((completed.length / tasks.length) * 100),
    phases,
    agents,
    agent_statuses: agentRecords || [],
  });
}

async function handleList(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { phase?: string; status?: string; assigned_to?: string }
) {
  let query = supabase
    .from("project_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("priority", { ascending: false });

  if (params.phase) query = query.eq("phase", params.phase);
  if (params.status) query = query.eq("status", params.status);
  if (params.assigned_to) query = query.eq("assigned_to", params.assigned_to);

  const { data, error: fetchErr } = await query;
  if (fetchErr) return error(500, fetchErr.message);

  return json({ tasks: data || [], count: data?.length || 0 });
}

// ─── Comment Handlers ────────────────────────────────────────────────────────

async function handleAddComment(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { task_code: string; body: string; author?: string; comment_type?: string }
) {
  if (!params.task_code) return error(400, "task_code required");
  if (!params.body) return error(400, "body required");

  const author = params.author || "user";
  const commentType = params.comment_type || "note";

  const { data, error: insertErr } = await supabase
    .from("task_comments")
    .insert({
      user_id: userId,
      task_code: params.task_code,
      author,
      body: params.body,
      comment_type: commentType,
    })
    .select()
    .single();

  if (insertErr) return error(500, insertErr.message);

  await logActivity(supabase, userId, author, "comment_added", "task", params.task_code, {
    comment_type: commentType,
    body_preview: params.body.slice(0, 100),
  });

  return json({ comment: data });
}

async function handleListComments(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { task_code: string }
) {
  if (!params.task_code) return error(400, "task_code required");

  const { data, error: fetchErr } = await supabase
    .from("task_comments")
    .select("*")
    .eq("user_id", userId)
    .eq("task_code", params.task_code)
    .order("created_at", { ascending: true });

  if (fetchErr) return error(500, fetchErr.message);

  return json({ comments: data || [], count: data?.length || 0 });
}

// ─── Agent State Machine Handlers ────────────────────────────────────────────

async function handleAgentRegister(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: {
    agent_id: string;
    budget_monthly_cents?: number;
    heartbeat_interval_sec?: number;
  }
) {
  if (!params.agent_id) return error(400, "agent_id required");

  const { data, error: upsertErr } = await supabase
    .from("agents")
    .upsert(
      {
        user_id: userId,
        agent_id: params.agent_id,
        status: "idle",
        budget_monthly_cents: params.budget_monthly_cents || 0,
        heartbeat_interval_sec: params.heartbeat_interval_sec || 300,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,agent_id" }
    )
    .select()
    .single();

  if (upsertErr) return error(500, upsertErr.message);

  await logActivity(supabase, userId, params.agent_id, "agent_registered", "agent", params.agent_id, {
    budget_monthly_cents: params.budget_monthly_cents || 0,
  });

  return json({ agent: data });
}

async function handleAgentStatus(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { agent_id?: string }
) {
  const agentId = params.agent_id || "claude-code";

  const { data: agent, error: fetchErr } = await supabase
    .from("agents")
    .select("*")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .single();

  if (fetchErr || !agent) return error(404, `Agent '${agentId}' not found`);

  // Get recent runs
  const { data: recentRuns } = await supabase
    .from("heartbeat_runs")
    .select("id, status, started_at, finished_at, duration_ms, task_code")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .order("started_at", { ascending: false })
    .limit(5);

  // Get current month spend
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: costData } = await supabase
    .from("cost_events")
    .select("cost_cents")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .gte("occurred_at", startOfMonth.toISOString());

  const monthlySpend = (costData || []).reduce(
    (sum: number, e: Record<string, unknown>) => sum + Number(e.cost_cents || 0),
    0
  );

  return json({
    agent,
    recent_runs: recentRuns || [],
    monthly_spend_cents: monthlySpend,
  });
}

async function handleAgentTransition(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { agent_id?: string; reason?: string },
  targetStatus: string
) {
  const agentId = params.agent_id || "claude-code";

  const { data: agent, error: fetchErr } = await supabase
    .from("agents")
    .select("status")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .single();

  if (fetchErr || !agent) return error(404, `Agent '${agentId}' not found`);

  const currentStatus = agent.status as string;
  const allowed = VALID_TRANSITIONS[currentStatus] || [];

  if (!allowed.includes(targetStatus)) {
    return error(
      422,
      `Invalid transition: ${currentStatus} → ${targetStatus}. Allowed: ${allowed.join(", ") || "none"}`
    );
  }

  const { error: updateErr } = await supabase
    .from("agents")
    .update({
      status: targetStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("agent_id", agentId);

  if (updateErr) return error(500, updateErr.message);

  await logActivity(supabase, userId, "user", `agent_${targetStatus}`, "agent", agentId, {
    previous_status: currentStatus,
    reason: params.reason,
  });

  return json({
    agent_id: agentId,
    previous_status: currentStatus,
    status: targetStatus,
    message: `Agent ${agentId}: ${currentStatus} → ${targetStatus}`,
  });
}

// ─── Heartbeat Handlers ─────────────────────────────────────────────────────

async function handleHeartbeatStart(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: {
    agent_id?: string;
    task_code?: string;
    invocation_source?: string;
    context_snapshot?: Record<string, unknown>;
  }
) {
  const agentId = params.agent_id || "claude-code";

  // Check agent can run
  const { data: agent } = await supabase
    .from("agents")
    .select("status, max_concurrent_runs, budget_monthly_cents, spent_monthly_cents")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .single();

  if (agent?.status === "paused") return error(403, "Agent is paused");
  if (agent?.status === "terminated") return error(403, "Agent is terminated");
  if (agent && agent.budget_monthly_cents > 0 && agent.spent_monthly_cents >= agent.budget_monthly_cents) {
    return error(403, "Monthly budget exhausted");
  }

  // Check max concurrent runs
  const maxConcurrent = agent?.max_concurrent_runs || 1;
  const { data: activeRuns } = await supabase
    .from("heartbeat_runs")
    .select("id")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .in("status", ["queued", "running"]);

  if ((activeRuns?.length || 0) >= maxConcurrent) {
    return error(409, `Agent already has ${activeRuns?.length} active run(s) (max: ${maxConcurrent})`);
  }

  const now = new Date().toISOString();

  // Build enriched context snapshot
  const contextSnapshot: Record<string, unknown> = {
    ...(params.context_snapshot || {}),
    wake_source: params.invocation_source || "manual",
    agent_id: agentId,
    started_at: now,
  };

  // Enrich with task details if working on a specific task
  if (params.task_code) {
    const { data: taskData } = await supabase
      .from("project_tasks")
      .select("task_code, title, description, phase, dependencies, wat_references, notes")
      .eq("user_id", userId)
      .eq("task_code", params.task_code)
      .single();

    if (taskData) {
      contextSnapshot.task = taskData;
    }

    // Include recent comments for context
    const { data: recentComments } = await supabase
      .from("task_comments")
      .select("author, body, comment_type, created_at")
      .eq("user_id", userId)
      .eq("task_code", params.task_code)
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentComments && recentComments.length > 0) {
      contextSnapshot.recent_comments = recentComments;
    }
  }

  // Include budget snapshot
  if (agent) {
    contextSnapshot.budget = {
      monthly_cents: agent.budget_monthly_cents,
      spent_cents: agent.spent_monthly_cents,
      remaining_cents: Math.max(0, (agent.budget_monthly_cents as number) - (agent.spent_monthly_cents as number)),
    };
  }

  // Create the run
  const { data: run, error: insertErr } = await supabase
    .from("heartbeat_runs")
    .insert({
      user_id: userId,
      agent_id: agentId,
      status: "running",
      invocation_source: params.invocation_source || "manual",
      task_code: params.task_code || null,
      context_snapshot: contextSnapshot,
      started_at: now,
    })
    .select()
    .single();

  if (insertErr) return error(500, insertErr.message);

  // Update agent status to running
  await supabase
    .from("agents")
    .update({ status: "running", last_heartbeat_at: now, updated_at: now })
    .eq("user_id", userId)
    .eq("agent_id", agentId);

  await logActivity(supabase, userId, agentId, "heartbeat_started", "run", run.id, {
    task_code: params.task_code,
    invocation_source: params.invocation_source || "manual",
  });

  return json({ run });
}

async function handleHeartbeatComplete(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: {
    run_id: string;
    status?: string;
    result_json?: Record<string, unknown>;
    usage_json?: Record<string, unknown>;
    error_message?: string;
    agent_id?: string;
  }
) {
  if (!params.run_id) return error(400, "run_id required");
  const agentId = params.agent_id || "claude-code";

  const finalStatus = params.status || "succeeded";
  if (!["succeeded", "failed", "cancelled", "timed_out"].includes(finalStatus)) {
    return error(400, `Invalid final status: ${finalStatus}`);
  }

  const now = new Date();
  const { data: run, error: fetchErr } = await supabase
    .from("heartbeat_runs")
    .select("started_at")
    .eq("id", params.run_id)
    .eq("user_id", userId)
    .single();

  if (fetchErr || !run) return error(404, "Run not found");

  const durationMs = run.started_at
    ? now.getTime() - new Date(run.started_at as string).getTime()
    : null;

  const { error: updateErr } = await supabase
    .from("heartbeat_runs")
    .update({
      status: finalStatus,
      finished_at: now.toISOString(),
      duration_ms: durationMs,
      result_json: params.result_json || {},
      usage_json: params.usage_json || {},
      error_message: params.error_message || null,
    })
    .eq("id", params.run_id)
    .eq("user_id", userId);

  if (updateErr) return error(500, updateErr.message);

  // Return agent to idle (unless paused/terminated)
  const { data: agent } = await supabase
    .from("agents")
    .select("status")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .single();

  if (agent?.status === "running") {
    await supabase
      .from("agents")
      .update({ status: "idle", updated_at: now.toISOString() })
      .eq("user_id", userId)
      .eq("agent_id", agentId);
  }

  await logActivity(supabase, userId, agentId, `heartbeat_${finalStatus}`, "run", params.run_id, {
    duration_ms: durationMs,
    error_message: params.error_message,
  });

  return json({
    run_id: params.run_id,
    status: finalStatus,
    duration_ms: durationMs,
  });
}

async function handleHeartbeatLog(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { run_id: string; stream?: string; chunk: string; seq?: number }
) {
  if (!params.run_id) return error(400, "run_id required");
  if (!params.chunk) return error(400, "chunk required");

  // Auto-increment seq if not provided
  let seq = params.seq;
  if (seq === undefined) {
    const { data: lastLog } = await supabase
      .from("run_logs")
      .select("seq")
      .eq("run_id", params.run_id)
      .order("seq", { ascending: false })
      .limit(1);

    seq = lastLog && lastLog.length > 0 ? (lastLog[0].seq as number) + 1 : 0;
  }

  const { error: insertErr } = await supabase.from("run_logs").insert({
    run_id: params.run_id,
    stream: params.stream || "stdout",
    chunk: params.chunk,
    seq,
  });

  if (insertErr) return error(500, insertErr.message);

  return json({ logged: true, seq });
}

// ─── Cost Handlers ───────────────────────────────────────────────────────────

async function handleCostRecord(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: {
    agent_id?: string;
    task_code?: string;
    provider: string;
    model: string;
    input_tokens?: number;
    output_tokens?: number;
    cost_cents: number;
    run_id?: string;
    metadata?: Record<string, unknown>;
  }
) {
  if (!params.provider) return error(400, "provider required");
  if (!params.model) return error(400, "model required");
  if (params.cost_cents === undefined) return error(400, "cost_cents required");

  const agentId = params.agent_id || "claude-code";

  const { data, error: insertErr } = await supabase
    .from("cost_events")
    .insert({
      user_id: userId,
      agent_id: agentId,
      task_code: params.task_code || null,
      provider: params.provider,
      model: params.model,
      input_tokens: params.input_tokens || 0,
      output_tokens: params.output_tokens || 0,
      cost_cents: params.cost_cents,
      run_id: params.run_id || null,
      metadata: params.metadata || {},
      occurred_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertErr) return error(500, insertErr.message);

  // Update agent's monthly spend
  await supabase.rpc("increment_agent_spend", {
    p_user_id: userId,
    p_agent_id: agentId,
    p_cents: params.cost_cents,
  }).then(undefined, () => {
    // RPC may not exist yet — fall back to manual update
    return supabase
      .from("agents")
      .select("spent_monthly_cents")
      .eq("user_id", userId)
      .eq("agent_id", agentId)
      .single()
      .then(({ data: agent }) => {
        if (agent) {
          return supabase
            .from("agents")
            .update({
              spent_monthly_cents: (agent.spent_monthly_cents as number) + params.cost_cents,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("agent_id", agentId);
        }
      });
  });

  return json({ cost_event: data });
}

async function handleCostSummary(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { agent_id?: string; days?: number }
) {
  const days = params.days || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  let query = supabase
    .from("cost_events")
    .select("agent_id, provider, model, input_tokens, output_tokens, cost_cents, task_code, occurred_at")
    .eq("user_id", userId)
    .gte("occurred_at", since.toISOString())
    .order("occurred_at", { ascending: false });

  if (params.agent_id) {
    query = query.eq("agent_id", params.agent_id);
  }

  const { data, error: fetchErr } = await query;
  if (fetchErr) return error(500, fetchErr.message);

  const events = data || [];
  const totalCents = events.reduce((s: number, e: Record<string, unknown>) => s + Number(e.cost_cents || 0), 0);
  const totalInputTokens = events.reduce((s: number, e: Record<string, unknown>) => s + Number(e.input_tokens || 0), 0);
  const totalOutputTokens = events.reduce((s: number, e: Record<string, unknown>) => s + Number(e.output_tokens || 0), 0);

  // By agent
  const byAgent: Record<string, { cost_cents: number; events: number }> = {};
  for (const e of events) {
    const aid = e.agent_id as string;
    if (!byAgent[aid]) byAgent[aid] = { cost_cents: 0, events: 0 };
    byAgent[aid].cost_cents += Number(e.cost_cents || 0);
    byAgent[aid].events++;
  }

  // By model
  const byModel: Record<string, { cost_cents: number; events: number }> = {};
  for (const e of events) {
    const model = e.model as string;
    if (!byModel[model]) byModel[model] = { cost_cents: 0, events: 0 };
    byModel[model].cost_cents += Number(e.cost_cents || 0);
    byModel[model].events++;
  }

  return json({
    period_days: days,
    total_cost_cents: totalCents,
    total_input_tokens: totalInputTokens,
    total_output_tokens: totalOutputTokens,
    event_count: events.length,
    by_agent: byAgent,
    by_model: byModel,
  });
}

// ─── Activity Handlers ──────────────────────────────────────────────────────

async function handleActivityList(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { limit?: number; entity_type?: string; entity_id?: string }
) {
  let query = supabase
    .from("activity_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(params.limit || 50);

  if (params.entity_type) query = query.eq("entity_type", params.entity_type);
  if (params.entity_id) query = query.eq("entity_id", params.entity_id);

  const { data, error: fetchErr } = await query;
  if (fetchErr) return error(500, fetchErr.message);

  return json({ activities: data || [], count: data?.length || 0 });
}

// ─── Wakeup Handlers ─────────────────────────────────────────────────────────

async function handleWakeupRequest(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: {
    agent_id?: string;
    reason?: string;
    task_code?: string;
    idempotency_key?: string;
    requested_by?: string;
  }
) {
  const agentId = params.agent_id || "claude-code";

  // Idempotency check: if same key exists and is still queued, coalesce
  if (params.idempotency_key) {
    const { data: existing } = await supabase
      .from("wakeup_requests")
      .select("id, coalesced_count")
      .eq("user_id", userId)
      .eq("agent_id", agentId)
      .eq("idempotency_key", params.idempotency_key)
      .eq("status", "queued")
      .single();

    if (existing) {
      // Coalesce: increment count instead of creating duplicate
      await supabase
        .from("wakeup_requests")
        .update({ coalesced_count: (existing.coalesced_count as number) + 1 })
        .eq("id", existing.id);

      return json({
        coalesced: true,
        wakeup_id: existing.id,
        coalesced_count: (existing.coalesced_count as number) + 1,
        message: `Wakeup coalesced (${(existing.coalesced_count as number) + 1} requests merged)`,
      });
    }
  }

  const { data, error: insertErr } = await supabase
    .from("wakeup_requests")
    .insert({
      user_id: userId,
      agent_id: agentId,
      status: "queued",
      idempotency_key: params.idempotency_key || null,
      requested_by: params.requested_by || "system",
      reason: params.reason || null,
      task_code: params.task_code || null,
    })
    .select()
    .single();

  if (insertErr) return error(500, insertErr.message);

  await logActivity(supabase, userId, params.requested_by || "system", "wakeup_requested", "agent", agentId, {
    reason: params.reason,
    task_code: params.task_code,
    idempotency_key: params.idempotency_key,
  });

  return json({ wakeup: data });
}

async function handleWakeupClaim(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { agent_id?: string; wakeup_id?: string }
) {
  const agentId = params.agent_id || "claude-code";

  // Claim the oldest queued wakeup for this agent (or a specific one)
  let query = supabase
    .from("wakeup_requests")
    .select("*")
    .eq("user_id", userId)
    .eq("agent_id", agentId)
    .eq("status", "queued")
    .order("requested_at", { ascending: true })
    .limit(1);

  if (params.wakeup_id) {
    query = supabase
      .from("wakeup_requests")
      .select("*")
      .eq("id", params.wakeup_id)
      .eq("user_id", userId)
      .eq("status", "queued");
  }

  const { data: wakeups } = await query;
  if (!wakeups || wakeups.length === 0) {
    return json({ wakeup: null, message: "No queued wakeup requests" });
  }

  const wakeup = wakeups[0];
  const now = new Date().toISOString();

  // Atomic claim
  const { data: claimed, error: updateErr } = await supabase
    .from("wakeup_requests")
    .update({ status: "claimed", claimed_at: now })
    .eq("id", wakeup.id)
    .eq("status", "queued")
    .select();

  if (updateErr) return error(500, updateErr.message);
  if (!claimed || claimed.length === 0) {
    return error(409, "Wakeup was already claimed");
  }

  return json({ wakeup: claimed[0] });
}

async function handleWakeupFinish(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { wakeup_id: string; run_id?: string; error_msg?: string }
) {
  if (!params.wakeup_id) return error(400, "wakeup_id required");

  const finalStatus = params.error_msg ? "failed" : "finished";

  const { error: updateErr } = await supabase
    .from("wakeup_requests")
    .update({
      status: finalStatus,
      finished_at: new Date().toISOString(),
      run_id: params.run_id || null,
      error: params.error_msg || null,
    })
    .eq("id", params.wakeup_id)
    .eq("user_id", userId);

  if (updateErr) return error(500, updateErr.message);

  return json({ wakeup_id: params.wakeup_id, status: finalStatus });
}

async function handleWakeupList(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { agent_id?: string; status?: string; limit?: number }
) {
  let query = supabase
    .from("wakeup_requests")
    .select("*")
    .eq("user_id", userId)
    .order("requested_at", { ascending: false })
    .limit(params.limit || 20);

  if (params.agent_id) query = query.eq("agent_id", params.agent_id);
  if (params.status) query = query.eq("status", params.status);

  const { data, error: fetchErr } = await query;
  if (fetchErr) return error(500, fetchErr.message);

  return json({ wakeups: data || [], count: data?.length || 0 });
}

// ─── Config Handlers ─────────────────────────────────────────────────────────

async function handleConfigUpdate(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: {
    agent_id: string;
    config: Record<string, unknown>;
  }
) {
  if (!params.agent_id) return error(400, "agent_id required");
  if (!params.config) return error(400, "config required");

  // Get current agent config
  const { data: agent, error: fetchErr } = await supabase
    .from("agents")
    .select("*")
    .eq("user_id", userId)
    .eq("agent_id", params.agent_id)
    .single();

  if (fetchErr || !agent) return error(404, `Agent '${params.agent_id}' not found`);

  // Determine what changed
  const beforeConfig: Record<string, unknown> = {
    budget_monthly_cents: agent.budget_monthly_cents,
    heartbeat_interval_sec: agent.heartbeat_interval_sec,
    max_concurrent_runs: agent.max_concurrent_runs,
    timeout_sec: agent.timeout_sec,
    session_params: agent.session_params,
  };

  const afterConfig = { ...beforeConfig, ...params.config };

  const changedKeys = Object.keys(params.config).filter(
    (k) => JSON.stringify(beforeConfig[k]) !== JSON.stringify(params.config[k])
  );

  if (changedKeys.length === 0) {
    return json({ message: "No changes detected", revision: null });
  }

  // Get next revision number
  const { data: lastRevision } = await supabase
    .from("config_revisions")
    .select("revision_number")
    .eq("user_id", userId)
    .eq("agent_id", params.agent_id)
    .order("revision_number", { ascending: false })
    .limit(1);

  const revisionNumber = lastRevision && lastRevision.length > 0
    ? (lastRevision[0].revision_number as number) + 1
    : 1;

  // Save revision
  const { data: revision, error: revisionErr } = await supabase
    .from("config_revisions")
    .insert({
      user_id: userId,
      agent_id: params.agent_id,
      revision_number: revisionNumber,
      before_config: beforeConfig,
      after_config: afterConfig,
      changed_keys: changedKeys,
      source: "patch",
    })
    .select()
    .single();

  if (revisionErr) return error(500, revisionErr.message);

  // Apply the config changes to the agent
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if ("budget_monthly_cents" in params.config) updates.budget_monthly_cents = params.config.budget_monthly_cents;
  if ("heartbeat_interval_sec" in params.config) updates.heartbeat_interval_sec = params.config.heartbeat_interval_sec;
  if ("max_concurrent_runs" in params.config) updates.max_concurrent_runs = params.config.max_concurrent_runs;
  if ("timeout_sec" in params.config) updates.timeout_sec = params.config.timeout_sec;
  if ("session_params" in params.config) updates.session_params = params.config.session_params;

  await supabase
    .from("agents")
    .update(updates)
    .eq("user_id", userId)
    .eq("agent_id", params.agent_id);

  await logActivity(supabase, userId, "user", "config_updated", "agent", params.agent_id, {
    revision_number: revisionNumber,
    changed_keys: changedKeys,
  });

  return json({ revision, changed_keys: changedKeys });
}

async function handleConfigRollback(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { agent_id: string; revision_id: string }
) {
  if (!params.agent_id) return error(400, "agent_id required");
  if (!params.revision_id) return error(400, "revision_id required");

  // Get the target revision
  const { data: targetRevision, error: fetchErr } = await supabase
    .from("config_revisions")
    .select("*")
    .eq("id", params.revision_id)
    .eq("user_id", userId)
    .eq("agent_id", params.agent_id)
    .single();

  if (fetchErr || !targetRevision) return error(404, "Revision not found");

  // Get current config for the rollback revision record
  const { data: agent } = await supabase
    .from("agents")
    .select("budget_monthly_cents, heartbeat_interval_sec, max_concurrent_runs, timeout_sec, session_params")
    .eq("user_id", userId)
    .eq("agent_id", params.agent_id)
    .single();

  // Get next revision number
  const { data: lastRevision } = await supabase
    .from("config_revisions")
    .select("revision_number")
    .eq("user_id", userId)
    .eq("agent_id", params.agent_id)
    .order("revision_number", { ascending: false })
    .limit(1);

  const revisionNumber = lastRevision && lastRevision.length > 0
    ? (lastRevision[0].revision_number as number) + 1
    : 1;

  const rollbackConfig = targetRevision.before_config as Record<string, unknown>;

  // Create rollback revision
  await supabase.from("config_revisions").insert({
    user_id: userId,
    agent_id: params.agent_id,
    revision_number: revisionNumber,
    before_config: agent || {},
    after_config: rollbackConfig,
    changed_keys: Object.keys(rollbackConfig),
    source: "rollback",
    rolled_back_from_revision_id: params.revision_id,
  });

  // Apply the rolled-back config
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if ("budget_monthly_cents" in rollbackConfig) updates.budget_monthly_cents = rollbackConfig.budget_monthly_cents;
  if ("heartbeat_interval_sec" in rollbackConfig) updates.heartbeat_interval_sec = rollbackConfig.heartbeat_interval_sec;
  if ("max_concurrent_runs" in rollbackConfig) updates.max_concurrent_runs = rollbackConfig.max_concurrent_runs;
  if ("timeout_sec" in rollbackConfig) updates.timeout_sec = rollbackConfig.timeout_sec;
  if ("session_params" in rollbackConfig) updates.session_params = rollbackConfig.session_params;

  await supabase
    .from("agents")
    .update(updates)
    .eq("user_id", userId)
    .eq("agent_id", params.agent_id);

  await logActivity(supabase, userId, "user", "config_rolled_back", "agent", params.agent_id, {
    rolled_back_to_revision: targetRevision.revision_number,
    revision_number: revisionNumber,
  });

  return json({
    rolled_back: true,
    to_revision: targetRevision.revision_number,
    new_revision: revisionNumber,
  });
}

async function handleConfigHistory(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: { agent_id: string; limit?: number }
) {
  if (!params.agent_id) return error(400, "agent_id required");

  const { data, error: fetchErr } = await supabase
    .from("config_revisions")
    .select("*")
    .eq("user_id", userId)
    .eq("agent_id", params.agent_id)
    .order("revision_number", { ascending: false })
    .limit(params.limit || 20);

  if (fetchErr) return error(500, fetchErr.message);

  return json({ revisions: data || [], count: data?.length || 0 });
}

// ─── Dashboard Handler ──────────────────────────────────────────────────────

const STALE_RUN_THRESHOLD_MS = 60 * 60 * 1000; // 60 minutes

async function handleDashboard(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  // Parallel queries for efficiency
  const [tasksRes, agentsRes, runsRes, costsRes, wakeupsRes] = await Promise.all([
    supabase.from("project_tasks").select("status, xp_reward, phase").eq("user_id", userId),
    supabase.from("agents").select("agent_id, status, budget_monthly_cents, spent_monthly_cents").eq("user_id", userId),
    supabase.from("heartbeat_runs").select("id, agent_id, status, started_at, task_code").eq("user_id", userId).in("status", ["queued", "running"]),
    (() => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      return supabase.from("cost_events").select("cost_cents, agent_id").eq("user_id", userId).gte("occurred_at", startOfMonth.toISOString());
    })(),
    supabase.from("wakeup_requests").select("id").eq("user_id", userId).eq("status", "queued"),
  ]);

  const tasks = tasksRes.data || [];
  const agents = agentsRes.data || [];
  const activeRuns = runsRes.data || [];
  const costEvents = costsRes.data || [];
  const pendingWakeups = wakeupsRes.data || [];

  // Task buckets
  const taskBuckets = {
    pending: tasks.filter((t: Record<string, unknown>) => t.status === "pending").length,
    in_progress: tasks.filter((t: Record<string, unknown>) => t.status === "in_progress").length,
    completed: tasks.filter((t: Record<string, unknown>) => t.status === "completed").length,
    blocked: tasks.filter((t: Record<string, unknown>) => t.status === "blocked").length,
  };

  // Agent buckets
  const agentBuckets = {
    idle: agents.filter((a: Record<string, unknown>) => a.status === "idle").length,
    running: agents.filter((a: Record<string, unknown>) => a.status === "running").length,
    paused: agents.filter((a: Record<string, unknown>) => a.status === "paused").length,
    terminated: agents.filter((a: Record<string, unknown>) => a.status === "terminated").length,
  };

  // Monthly costs
  const monthSpendCents = costEvents.reduce(
    (s: number, e: Record<string, unknown>) => s + Number(e.cost_cents || 0), 0
  );
  const monthBudgetCents = agents.reduce(
    (s: number, a: Record<string, unknown>) => s + Number(a.budget_monthly_cents || 0), 0
  );

  // Stale run detection
  const now = Date.now();
  const staleRuns = activeRuns.filter((r: Record<string, unknown>) => {
    if (!r.started_at) return false;
    const elapsed = now - new Date(r.started_at as string).getTime();
    return elapsed > STALE_RUN_THRESHOLD_MS;
  });

  // XP
  const earnedXp = tasks
    .filter((t: Record<string, unknown>) => t.status === "completed")
    .reduce((s: number, t: Record<string, unknown>) => s + ((t.xp_reward as number) || 0), 0);
  const totalXp = tasks.reduce(
    (s: number, t: Record<string, unknown>) => s + ((t.xp_reward as number) || 0), 0
  );

  return json({
    tasks: taskBuckets,
    agents: agentBuckets,
    costs: {
      month_spend_cents: monthSpendCents,
      month_budget_cents: monthBudgetCents,
      utilization_pct: monthBudgetCents > 0
        ? Math.round((monthSpendCents / monthBudgetCents) * 100)
        : 0,
    },
    runs: {
      active: activeRuns.length,
      stale: staleRuns.length,
      stale_runs: staleRuns.map((r: Record<string, unknown>) => ({
        id: r.id,
        agent_id: r.agent_id,
        task_code: r.task_code,
        started_at: r.started_at,
        elapsed_min: Math.round((now - new Date(r.started_at as string).getTime()) / 60000),
      })),
    },
    wakeups: { pending: pendingWakeups.length },
    xp: { earned: earnedXp, total: totalXp },
    progress_pct: tasks.length > 0
      ? Math.round((taskBuckets.completed / tasks.length) * 100)
      : 0,
  });
}

// ─── Doctor Handler ─────────────────────────────────────────────────────────

async function handleDoctor(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  const checks: Array<{
    name: string;
    status: "ok" | "warn" | "fail";
    message: string;
    can_repair?: boolean;
  }> = [];

  // 1. Check project_tasks table exists and has data
  const { data: tasks, error: tasksErr } = await supabase
    .from("project_tasks")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (tasksErr) {
    checks.push({
      name: "project_tasks",
      status: "fail",
      message: `Table error: ${tasksErr.message}`,
      can_repair: true,
    });
  } else {
    checks.push({
      name: "project_tasks",
      status: tasks && tasks.length > 0 ? "ok" : "warn",
      message: tasks && tasks.length > 0 ? "Table exists with data" : "Table exists but no tasks seeded",
    });
  }

  // 2. Check agents table and registration
  const { data: agents, error: agentsErr } = await supabase
    .from("agents")
    .select("agent_id, status, budget_monthly_cents, spent_monthly_cents")
    .eq("user_id", userId);

  if (agentsErr) {
    checks.push({
      name: "agents",
      status: "fail",
      message: `Table error: ${agentsErr.message}. Run migration 00002_agent_runtime.sql`,
      can_repair: true,
    });
  } else if (!agents || agents.length === 0) {
    checks.push({
      name: "agents",
      status: "warn",
      message: "No agents registered. Run: agent.sh register",
      can_repair: true,
    });
  } else {
    const terminated = agents.filter((a: Record<string, unknown>) => a.status === "terminated");
    const overBudget = agents.filter(
      (a: Record<string, unknown>) =>
        (a.budget_monthly_cents as number) > 0 &&
        (a.spent_monthly_cents as number) >= (a.budget_monthly_cents as number)
    );

    checks.push({
      name: "agents",
      status: terminated.length > 0 || overBudget.length > 0 ? "warn" : "ok",
      message: `${agents.length} registered, ${terminated.length} terminated, ${overBudget.length} over budget`,
    });
  }

  // 3. Check for stale runs (running > 60 min)
  const { data: staleRuns } = await supabase
    .from("heartbeat_runs")
    .select("id, agent_id, started_at")
    .eq("user_id", userId)
    .in("status", ["queued", "running"]);

  const now = Date.now();
  const stale = (staleRuns || []).filter((r: Record<string, unknown>) => {
    if (!r.started_at) return false;
    return now - new Date(r.started_at as string).getTime() > STALE_RUN_THRESHOLD_MS;
  });

  if (stale.length > 0) {
    checks.push({
      name: "stale_runs",
      status: "warn",
      message: `${stale.length} run(s) have been active for >60 minutes`,
      can_repair: true,
    });
  } else {
    checks.push({
      name: "stale_runs",
      status: "ok",
      message: "No stale runs detected",
    });
  }

  // 4. Check gamification levels
  const { data: levels, error: levelsErr } = await supabase
    .from("project_levels")
    .select("id")
    .limit(1);

  checks.push({
    name: "project_levels",
    status: levelsErr ? "fail" : levels && levels.length > 0 ? "ok" : "warn",
    message: levelsErr
      ? `Table error: ${levelsErr.message}`
      : levels && levels.length > 0
        ? "Gamification levels loaded"
        : "No levels found — seed with migration",
  });

  // 5. Check wakeup queue health
  const { data: queuedWakeups } = await supabase
    .from("wakeup_requests")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "queued");

  const { data: claimedWakeups } = await supabase
    .from("wakeup_requests")
    .select("id, claimed_at")
    .eq("user_id", userId)
    .eq("status", "claimed");

  const staleWakeups = (claimedWakeups || []).filter((w: Record<string, unknown>) => {
    if (!w.claimed_at) return false;
    return now - new Date(w.claimed_at as string).getTime() > STALE_RUN_THRESHOLD_MS;
  });

  checks.push({
    name: "wakeup_queue",
    status: staleWakeups.length > 0 ? "warn" : "ok",
    message: `${(queuedWakeups || []).length} queued, ${(claimedWakeups || []).length} claimed, ${staleWakeups.length} stale`,
  });

  // 6. Check budget utilization
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: monthCosts } = await supabase
    .from("cost_events")
    .select("cost_cents")
    .eq("user_id", userId)
    .gte("occurred_at", startOfMonth.toISOString());

  const monthSpend = (monthCosts || []).reduce(
    (s: number, e: Record<string, unknown>) => s + Number(e.cost_cents || 0), 0
  );

  const totalBudget = (agents || []).reduce(
    (s: number, a: Record<string, unknown>) => s + Number(a.budget_monthly_cents || 0), 0
  );

  checks.push({
    name: "budget",
    status: totalBudget > 0 && monthSpend >= totalBudget * 0.8 ? "warn" : "ok",
    message: totalBudget > 0
      ? `$${(monthSpend / 100).toFixed(2)} / $${(totalBudget / 100).toFixed(2)} (${Math.round((monthSpend / totalBudget) * 100)}%)`
      : `$${(monthSpend / 100).toFixed(2)} spent (no budget set)`,
  });

  const overallStatus = checks.some((c) => c.status === "fail")
    ? "fail"
    : checks.some((c) => c.status === "warn")
      ? "warn"
      : "ok";

  return json({
    status: overallStatus,
    checks,
    summary: `${checks.filter((c) => c.status === "ok").length}/${checks.length} checks passed`,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function error(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
