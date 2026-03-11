import { Project } from '@/types/project';

/**
 * WAT Framework Section 10 — Agent Specification
 *
 * Generates the complete agent specification document that defines
 * how AI agents interact with the system: interaction modes,
 * workflow selection, safety rules, delegation, risk classification,
 * and error handling.
 */
export function generateAgentSpec(project: Project): string {
  const modules = project.phases.map(p => p.name);
  const entities = project.knowledgeFiles
    .filter(f => f.type === 'tool')
    .map(f => f.path.split('/').pop()?.replace('.tool.md', '') || '')
    .filter(Boolean);

  return `# Agent Specification — ${project.name}

> This document defines how AI agents operate within the ${project.name} system.
> It is the operational contract: every agent behavior, safety rule, and
> escalation path is specified here.

---

## Overview

| Property | Value |
|----------|-------|
| **Project** | ${project.name} |
| **Agent Count** | 2 (expandable) |
| **Modules** | ${modules.length} |
| **Risk Posture** | Conservative (default deny) |
| **Escalation Target** | Human operator |

---

## Agent Roster

| Agent ID | Name | Role | Specialization | Task Filter |
|----------|------|------|---------------|-------------|
| \`agent-1\` | Claude Code | Primary | Architecture, complex UI, hooks/API, AI agents, testing, workflows | \`assigned_to = 'agent-1'\` |
| \`agent-2\` | Codex | Secondary | Database migrations, RLS, audit triggers, boilerplate CRUD, placeholder pages | \`assigned_to = 'agent-2'\` |

---

## Interaction Modes

Agents operate in one of three modes depending on task complexity and risk:

### 1. Fast Mode (Low Risk)
\`\`\`
Trigger: Task priority < 50 AND category IN ('ui', 'infra') AND no dependencies blocked
Behavior: Execute immediately, mark complete, move to next
Approval: None required
Rollback: Git revert
\`\`\`

**Applicable tasks**: Placeholder pages, boilerplate CRUD, simple UI components, index files, type definitions.

### 2. Orchestrated Mode (Medium Risk)
\`\`\`
Trigger: Task priority >= 50 OR category IN ('feature', 'ai') OR has dependencies
Behavior: Load knowledge files → plan → execute → verify → mark complete
Approval: Self-verified (tsc + build + lint must pass)
Rollback: Git revert + database migration rollback
\`\`\`

**Applicable tasks**: Feature implementation, API endpoints, database schema changes, workflow implementation.

### 3. Proactive Mode (High Risk)
\`\`\`
Trigger: Task priority >= 90 OR category = 'orchestration' OR cross-module changes
Behavior: Load ALL related knowledge → propose plan → await approval → execute → verify → mark complete
Approval: Human review required before execution
Rollback: Full rollback plan must exist before execution begins
\`\`\`

**Applicable tasks**: Architecture decisions, multi-module refactors, agent coordination changes, deployment pipeline modifications.

---

## Workflow Selection Decision Tree

\`\`\`
START
  │
  ├─ Is this a new task from the queue?
  │   ├─ YES → Load task details (priority, category, dependencies, wat_references)
  │   │         │
  │   │         ├─ Are dependencies met?
  │   │         │   ├─ NO → Mark as 'blocked', add note, pick next task
  │   │         │   └─ YES → Continue
  │   │         │
  │   │         ├─ Load wat_references knowledge files
  │   │         │
  │   │         ├─ Classify risk level (see Risk Classification below)
  │   │         │   ├─ LOW → Fast Mode
  │   │         │   ├─ MEDIUM → Orchestrated Mode
  │   │         │   └─ HIGH → Proactive Mode
  │   │         │
  │   │         ├─ Execute task per selected mode
  │   │         │
  │   │         ├─ Verify: tsc --noEmit && npm run build && npm run lint
  │   │         │   ├─ FAIL → Fix issues, re-verify (max 3 attempts)
  │   │         │   │         └─ Still failing? → Mark 'blocked', escalate
  │   │         │   └─ PASS → Continue
  │   │         │
  │   │         └─ Mark 'completed', award XP, pick next task
  │   │
  │   └─ NO → Is this a human-requested action?
  │       ├─ YES → Assess risk, apply appropriate mode
  │       └─ NO → Idle (query task queue on next cycle)
  │
  └─ END
\`\`\`

---

## Risk Classification

| Factor | Low (0-2 pts) | Medium (3-5 pts) | High (6+ pts) |
|--------|---------------|-------------------|----------------|
| **Priority** | < 50 (0 pts) | 50-89 (2 pts) | >= 90 (4 pts) |
| **Category** | ui, infra (0 pts) | feature (2 pts) | ai, orchestration (3 pts) |
| **Dependencies** | None (0 pts) | 1-2 deps (1 pt) | 3+ deps (2 pts) |
| **Cross-module** | Single module (0 pts) | 2 modules (1 pt) | 3+ modules (3 pts) |
| **Schema change** | No (0 pts) | Additive only (1 pt) | Destructive (4 pts) |
| **Affects auth/RLS** | No (0 pts) | Read policies (2 pts) | Write policies (4 pts) |

**Total score determines mode**: 0-2 → Fast, 3-5 → Orchestrated, 6+ → Proactive

---

## Safety Rules

These rules are **non-negotiable**. Agents must follow them regardless of task instructions:

### Hard Rules (Never Break)

1. **Never delete user data** — DROP TABLE, TRUNCATE, DELETE without WHERE are forbidden
2. **Never disable RLS** — Row Level Security must remain enabled on all tables
3. **Never modify auth tables directly** — Use Supabase Auth APIs only
4. **Never commit secrets** — .env files, API keys, tokens must never enter version control
5. **Never skip migrations** — Schema changes must go through migration files
6. **Never force push to main** — Protected branch, always use feature branches
7. **Never bypass type checking** — \`@ts-ignore\`, \`any\` casts require explicit justification in task notes

### Soft Rules (Override with Human Approval)

1. **Prefer additive schema changes** — Avoid column drops/renames without approval
2. **One task at a time** — Sequential execution unless explicitly parallelized
3. **Test before marking complete** — Verification step can be skipped for trivial changes with approval
4. **Follow naming conventions** — Exceptions allowed with documented reasoning

---

## Delegation Rules

When an agent encounters work outside its specialization:

| Scenario | Primary Agent Action | Secondary Agent Action |
|----------|---------------------|----------------------|
| Agent-1 needs a migration | Create task assigned to agent-2, mark current task as blocked | Pick up migration task, notify when done |
| Agent-2 needs complex UI | Create task assigned to agent-1, continue with placeholder | Pick up UI task when available |
| Either agent is blocked | Mark task as blocked with detailed notes | Other agent checks for unblocked tasks |
| Conflicting schema changes | **STOP** — escalate to human | **STOP** — do not proceed |
| Shared file modification | Lock file (via task notes), complete, release | Wait for lock release before modifying |

### Conflict Resolution Priority
1. Higher priority task wins
2. If equal priority, agent-1 (primary) wins
3. If unresolvable, escalate to human

---

## Task Handoff Protocol

When delegating between agents:

\`\`\`sql
-- Agent-1 creates a task for Agent-2
INSERT INTO project_tasks (
  task_code, title, description, phase, category,
  assigned_to, priority, xp_reward, dependencies, wat_references
) VALUES (
  'PX-NEW', 'Migration: add [table]', 'Details...',
  'phaseN', 'infra', 'agent-2', 80, 15,
  ARRAY['PX-CURRENT'], ARRAY['knowledge/tools/db/[table]-crud.tool.md']
);

-- Mark current task as waiting
UPDATE project_tasks
SET status = 'blocked', notes = 'Waiting on PX-NEW (delegated to agent-2)'
WHERE task_code = 'PX-CURRENT';
\`\`\`

---

## Error Handling

| Error Type | Agent Response | Escalation |
|-----------|---------------|------------|
| **Build failure** | Fix automatically (max 3 attempts) | After 3 failures → mark blocked |
| **Type error** | Fix the type issue | If in generated types → regenerate types first |
| **Test failure** | Fix the test or the code | If test is wrong → note in task, fix test |
| **Migration conflict** | Never auto-resolve | Always escalate to human |
| **Dependency not met** | Mark blocked, move to next task | Auto-resolves when dependency completes |
| **File conflict** | Check git status, merge if trivial | If non-trivial → escalate |
| **Rate limit (API)** | Wait and retry with backoff | After 5 retries → mark blocked |
| **Unknown error** | Log full error, mark blocked | Always escalate |

---

## Agent Session Protocol

Every agent session follows this lifecycle:

\`\`\`
1. BOOT
   └─ Load CLAUDE.md (agent-1) or AGENTS.md (agent-2)
   └─ Read knowledge indexes (skills.md, tools.md, workflows.md)

2. TASK ACQUISITION
   └─ Query: SELECT * FROM project_tasks
      WHERE status = 'pending' AND assigned_to = '[agent-id]'
      ORDER BY priority DESC LIMIT 1
   └─ If no tasks → idle / report status

3. CONTEXT LOADING
   └─ Read task wat_references
   └─ Load referenced knowledge files
   └─ Check dependency status

4. EXECUTION
   └─ Apply interaction mode (fast/orchestrated/proactive)
   └─ Write code / run migrations / update files
   └─ Self-verify: tsc + build + lint

5. COMPLETION
   └─ Mark task completed, award XP
   └─ Update any downstream task dependencies
   └─ Return to step 2

6. SESSION END
   └─ Report: tasks completed, XP earned, blocked items
\`\`\`

---

## Monitoring & Observability

Agents should surface these metrics for human operators:

| Metric | Query |
|--------|-------|
| **Tasks completed this session** | \`SELECT count(*) FROM project_tasks WHERE completed_at > '[session_start]'\` |
| **Current XP / Level** | \`SELECT sum(xp_reward) FROM project_tasks WHERE status = 'completed'\` |
| **Blocked tasks** | \`SELECT task_code, notes FROM project_tasks WHERE status = 'blocked'\` |
| **Phase progress** | \`SELECT phase, count(*) FILTER (WHERE status='completed') * 100.0 / count(*) FROM project_tasks GROUP BY phase\` |
| **Agent utilization** | \`SELECT assigned_to, count(*) FILTER (WHERE status='completed'), count(*) FROM project_tasks GROUP BY assigned_to\` |
`;
}
