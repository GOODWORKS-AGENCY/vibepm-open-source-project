import { Project } from '@/types/project';

/**
 * WAT Framework Section 11 — Human-in-the-Loop Patterns
 *
 * Defines when and how agents must defer to human operators:
 * approval flows, proposal UI, timeout/escalation chains.
 */
export function generateHumanInTheLoop(project: Project): string {
  return `# Human-in-the-Loop Patterns — ${project.name}

> Not everything should be automated. This document defines the exact boundaries
> where agents must pause, propose, and wait for human approval.

---

## Approval Classification

Every agent action falls into one of three categories:

| Category | Description | Examples | Agent Behavior |
|----------|-------------|----------|---------------|
| **Auto-approve** | Low risk, easily reversible | Add UI component, create type file, add index | Execute immediately |
| **Notify** | Medium risk, reviewable after | Database migration (additive), new API endpoint, dependency addition | Execute, then notify human |
| **Gate** | High risk, hard to reverse | Schema destruction, auth changes, deployment, multi-module refactor | Propose and wait |

---

## Gate Triggers

An action requires human approval (gate) when ANY of these are true:

1. **Destructive schema change** — DROP, TRUNCATE, column removal, type change
2. **Auth/RLS modification** — Any change to authentication or row-level security
3. **Cross-module data flow** — Changes that alter how data moves between 3+ modules
4. **Deployment action** — Any push to production, CI/CD pipeline change
5. **Dependency removal** — Removing or downgrading a package dependency
6. **Agent coordination change** — Modifying task assignment rules or agent roles
7. **Cost-incurring action** — API calls to paid services, infrastructure scaling
8. **Irreversible data transformation** — Migrations that transform existing data

---

## Proposal Format

When an agent hits a gate, it must produce a structured proposal:

\`\`\`markdown
## Proposal: [ACTION_TYPE]

**Task**: [task_code] — [title]
**Agent**: [agent-id]
**Risk Level**: [HIGH/CRITICAL]
**Reversibility**: [REVERSIBLE/PARTIALLY_REVERSIBLE/IRREVERSIBLE]

### What I Want To Do
[Clear description of the proposed action]

### Why
[Reasoning linked to task requirements and knowledge files]

### Impact Assessment
- **Files affected**: [list]
- **Tables affected**: [list]
- **Modules affected**: [list]
- **Downstream tasks**: [list of task_codes that depend on this]

### Rollback Plan
[Exact steps to undo this action if needed]

### Alternatives Considered
1. [Alternative A] — rejected because [reason]
2. [Alternative B] — rejected because [reason]

### Awaiting Approval
- [ ] Approved by human operator
- [ ] Rejected — reason: ___
\`\`\`

---

## Escalation Chain

When an agent is blocked or needs approval:

\`\`\`
1. Agent marks task as 'blocked' with structured proposal in notes
   │
   ├─ Timeout: 0 (immediate for CRITICAL risk)
   ├─ Timeout: 30 min (for HIGH risk)
   └─ Timeout: 4 hours (for MEDIUM risk with notify)
       │
       ├─ If approved → Agent resumes task
       ├─ If rejected → Agent marks task as 'blocked', notes rejection reason
       └─ If timeout expires →
           ├─ CRITICAL → Remain blocked, alert again
           ├─ HIGH → Remain blocked, move to next task
           └─ MEDIUM → Auto-approve with audit log entry
\`\`\`

---

## Notification Channels

| Priority | Channel | Format |
|----------|---------|--------|
| CRITICAL | Task notes + console output | Full proposal |
| HIGH | Task notes | Proposal summary |
| MEDIUM | Task notes | One-line status |
| LOW | No notification | Logged in task history |

---

## Human Override Commands

Humans can intervene at any point with these SQL commands:

\`\`\`sql
-- Force-approve a blocked task
UPDATE project_tasks SET status = 'pending', notes = 'Human approved: [reason]'
WHERE task_code = 'PX-YY' AND status = 'blocked';

-- Force-block a running task
UPDATE project_tasks SET status = 'blocked', notes = 'Human blocked: [reason]'
WHERE task_code = 'PX-YY' AND status = 'in_progress';

-- Reassign a task
UPDATE project_tasks SET assigned_to = 'agent-2'
WHERE task_code = 'PX-YY';

-- Skip a task entirely
UPDATE project_tasks SET status = 'completed', notes = 'Skipped by human',
  progress_pct = 100, completed_at = now()
WHERE task_code = 'PX-YY';

-- Add an emergency task (top priority)
INSERT INTO project_tasks (task_code, title, description, phase, category,
  assigned_to, priority, xp_reward)
VALUES ('EMG-01', 'Emergency fix', 'Details...', 'phase1', 'infra', 'agent-1', 100, 50);
\`\`\`

---

## Audit Trail

All gated decisions are recorded:

\`\`\`sql
-- Query approval history
SELECT task_code, status, notes, updated_at
FROM project_tasks
WHERE notes LIKE '%approved%' OR notes LIKE '%rejected%' OR notes LIKE '%blocked%'
ORDER BY updated_at DESC;
\`\`\`
`;
}

/**
 * WAT Framework Section 12 — Error Recovery & Self-Healing
 *
 * Defines how agents classify errors, handle partial failures,
 * maintain idempotency, and recover without human intervention
 * when possible.
 */
export function generateErrorRecovery(project: Project): string {
  return `# Error Recovery & Self-Healing — ${project.name}

> Agents will encounter errors. This document defines how they classify,
> respond to, and recover from every category of failure — automatically
> when safe, with escalation when not.

---

## Error Classification

| Class | Severity | Auto-Recovery | Examples |
|-------|----------|---------------|----------|
| **E1 — Transient** | Low | Yes (retry) | Network timeout, rate limit, temporary lock |
| **E2 — Fixable** | Medium | Yes (fix + retry) | Type error, lint failure, missing import |
| **E3 — Dependency** | Medium | Partial (wait) | Blocked by upstream task, missing migration |
| **E4 — Data** | High | No (escalate) | Schema conflict, data corruption, constraint violation |
| **E5 — System** | Critical | No (halt) | Auth failure, build system broken, Supabase down |

---

## Recovery Strategies

### E1 — Transient Errors

\`\`\`
Strategy: Exponential backoff with jitter
Max retries: 5
Backoff: 1s, 2s, 4s, 8s, 16s (+ random 0-1s jitter)
On max retries exceeded: Escalate to E5
\`\`\`

### E2 — Fixable Errors

\`\`\`
Strategy: Diagnose → Fix → Verify → Continue
Max fix attempts: 3
Process:
  1. Read error output (tsc, build, lint)
  2. Identify root cause
  3. Apply fix
  4. Re-run verification
  5. If still failing after 3 attempts → Mark blocked, escalate
\`\`\`

**Common E2 patterns:**

| Error Pattern | Auto-Fix |
|--------------|----------|
| Missing import | Add the import |
| Type mismatch | Fix the type annotation |
| Unused variable | Remove the variable |
| Missing dependency | \`npm install [package]\` |
| Lint violation | Apply auto-fix (\`npm run lint -- --fix\`) |
| Missing file reference | Create the file or update the reference |

### E3 — Dependency Errors

\`\`\`
Strategy: Skip and revisit
Process:
  1. Mark current task as 'blocked'
  2. Record which dependency is missing
  3. Check if dependency task exists
     ├─ Yes → Note dependency, move to next task
     └─ No → Create dependency task, assign appropriately
  4. Periodically re-check blocked tasks
\`\`\`

### E4 — Data Errors

\`\`\`
Strategy: STOP and escalate
Process:
  1. Do NOT attempt to fix
  2. Log full error context
  3. Mark task as 'blocked'
  4. Create structured proposal (see Human-in-the-Loop)
  5. Wait for human resolution
\`\`\`

### E5 — System Errors

\`\`\`
Strategy: HALT session
Process:
  1. Log all context
  2. Mark all in_progress tasks as 'blocked'
  3. Report system status
  4. Do not attempt further work until system recovers
\`\`\`

---

## Partial Failure Handling

When a task involves multiple steps and fails partway through:

\`\`\`
1. Identify completed steps vs. failed step
2. Assess: Can completed steps stand alone?
   ├─ YES (additive, no broken state)
   │   └─ Keep completed work, mark task as 'blocked' at failed step
   │       Note exactly which step failed and why
   └─ NO (incomplete state would break the system)
       └─ Rollback ALL steps:
           ├─ Git: git stash or git checkout -- [files]
           ├─ DB: Run down migration if applicable
           └─ Mark task as 'blocked', note partial failure
\`\`\`

### Rollback Decision Matrix

| Completed Work | Failed Step | Action |
|----------------|------------|--------|
| New files created | Build fails | Keep files, fix build error |
| Migration applied | Code fails | Keep migration, fix code |
| Code + migration | Tests fail | Keep both, fix tests |
| Auth policy change | Anything | **ROLLBACK ALL** |
| Data transformation | Anything | **ROLLBACK ALL** |

---

## Idempotency Keys

All agent actions must be idempotent. Repeated execution produces the same result:

### File Operations
\`\`\`
- CREATE file: Check if exists first, skip if identical
- MODIFY file: Use exact string matching (Edit tool), verify before/after
- DELETE file: Check if exists, skip if already gone
\`\`\`

### Database Operations
\`\`\`sql
-- Use ON CONFLICT for inserts
INSERT INTO project_tasks (task_code, title, ...)
VALUES ('P1-01', 'Setup', ...)
ON CONFLICT (task_code) DO NOTHING;

-- Use conditional updates
UPDATE project_tasks SET status = 'completed'
WHERE task_code = 'P1-01' AND status != 'completed';
\`\`\`

### Migration Safety
\`\`\`sql
-- Always check before creating
CREATE TABLE IF NOT EXISTS ...;
CREATE INDEX IF NOT EXISTS ...;

-- Use DO blocks for conditional operations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'my_enum') THEN
    CREATE TYPE my_enum AS ENUM ('a', 'b', 'c');
  END IF;
END $$;
\`\`\`

---

## Health Checks

Before starting any task, agents run these checks:

\`\`\`bash
# 1. Can we compile?
npx tsc --noEmit

# 2. Can we build?
npm run build

# 3. Is the database reachable?
npx supabase status

# 4. Are there uncommitted changes from another agent?
git status --porcelain
\`\`\`

If any check fails, diagnose before proceeding — never start a task on a broken baseline.

---

## Circuit Breaker

If an agent encounters 3+ consecutive errors (any class):

\`\`\`
1. STOP all task execution
2. Run full health check suite
3. Report status:
   - Last 3 errors (class, message, task)
   - Health check results
   - Recommendation (fix or escalate)
4. Wait for human acknowledgment before resuming
\`\`\`
`;
}

/**
 * WAT Framework Section 13 — Learning & Optimization
 *
 * Defines how the system improves over time: archetype extraction,
 * workflow pattern recognition, user correction incorporation,
 * and performance optimization.
 */
export function generateLearningOptimization(project: Project): string {
  const moduleCount = project.phases.length;

  return `# Learning & Optimization — ${project.name}

> The system gets better over time. This document defines how agents
> extract patterns, incorporate corrections, and optimize their workflow
> — without breaking the deterministic task protocol.

---

## Pattern Recognition

### Task Archetypes

As agents complete tasks, patterns emerge. These archetypes help predict effort and approach:

| Archetype | Typical Priority | Typical XP | Common Category | Knowledge Pattern |
|-----------|-----------------|------------|-----------------|-------------------|
| **CRUD Module** | 60-70 | 15-25 | feature | skill + db tool + workflow |
| **UI Component** | 40-50 | 10-15 | ui | skill + ui tool |
| **Database Migration** | 70-80 | 15-20 | infra | db tool only |
| **API Endpoint** | 60-80 | 15-25 | feature | api tool + skill |
| **Auth/RLS Policy** | 85-95 | 20-30 | infra | db tool + shared skill |
| **Workflow Implementation** | 70-85 | 20-30 | feature | workflow + skill + tools |
| **AI Agent Feature** | 80-95 | 25-40 | ai | agent skill + api tool + workflow |
| **Cross-Module Integration** | 85-95 | 30-50 | orchestration | multiple skills + shared workflow |

### Extraction Process

After every 10 completed tasks, review patterns:

\`\`\`sql
-- Find common task shapes
SELECT category,
  avg(priority) as avg_priority,
  avg(xp_reward) as avg_xp,
  count(*) as task_count,
  avg(EXTRACT(EPOCH FROM (completed_at - started_at))/3600) as avg_hours
FROM project_tasks
WHERE status = 'completed'
GROUP BY category
ORDER BY task_count DESC;
\`\`\`

---

## Workflow Pattern Optimization

### Measuring Workflow Efficiency

Track which knowledge file combinations lead to faster task completion:

\`\`\`sql
-- Which wat_references combinations correlate with fast completion?
SELECT wat_references,
  count(*) as times_used,
  avg(EXTRACT(EPOCH FROM (completed_at - started_at))/3600) as avg_hours,
  avg(progress_pct) as avg_completion
FROM project_tasks
WHERE status = 'completed'
GROUP BY wat_references
ORDER BY avg_hours ASC;
\`\`\`

### Knowledge Gap Detection

Tasks that take unusually long or get blocked often indicate missing knowledge:

\`\`\`sql
-- Find tasks that struggled (blocked or slow)
SELECT task_code, title, category, wat_references, notes
FROM project_tasks
WHERE status = 'blocked'
   OR (status = 'completed'
       AND EXTRACT(EPOCH FROM (completed_at - started_at)) >
           2 * (SELECT avg(EXTRACT(EPOCH FROM (completed_at - started_at)))
                 FROM project_tasks WHERE status = 'completed'))
ORDER BY priority DESC;
\`\`\`

**Response**: If a knowledge gap is detected, create a new knowledge file:
1. Identify the missing domain/tool/workflow
2. Create the appropriate .skill.md, .tool.md, or .workflow.md file
3. Update the relevant index file (skills.md, tools.md, workflows.md)
4. Add the new file to wat_references of related pending tasks

---

## User Correction Handling

When a human corrects an agent's output:

### Correction Categories

| Category | Agent Response | System Update |
|----------|---------------|---------------|
| **Code style** | Apply correction | Update \`.claude/rules/code-style.md\` with new rule |
| **Architecture** | Refactor as directed | Update \`.claude/rules/architecture.md\` |
| **Naming convention** | Rename as directed | Update relevant rules file |
| **Business logic** | Fix logic | Update relevant skill file with corrected domain knowledge |
| **Database schema** | Apply migration | Update relevant tool file |
| **Rejected approach** | Revert and redo | Note rejected approach in task notes (avoids repeating) |

### Correction Protocol

\`\`\`
1. Human provides correction
2. Agent applies the correction to current task
3. Agent identifies if correction implies a RULE change:
   ├─ YES → Propose update to relevant rules/knowledge file
   │         (Agent does NOT auto-update rules — proposes via task notes)
   └─ NO → Apply as one-off fix
4. Agent notes the correction in task notes for future reference
\`\`\`

---

## Performance Metrics

### Per-Session Metrics

| Metric | Target | Red Flag |
|--------|--------|----------|
| Tasks completed | 3-8 per session | < 1 (blocked) or > 15 (too shallow) |
| Build failures | < 2 per session | > 5 (quality issue) |
| Blocked tasks | < 1 per session | > 3 (dependency or knowledge gap) |
| Corrections received | 0-1 per session | > 3 (misunderstanding scope) |
| XP earned | Varies by task mix | 0 (nothing completed) |

### Per-Phase Metrics

| Metric | Calculation |
|--------|-------------|
| Phase velocity | Tasks completed per session in this phase |
| Phase quality | Corrections per task in this phase |
| Phase coverage | % of tasks with passing verification |
| Blocking rate | % of tasks that were blocked at some point |

\`\`\`sql
-- Phase health dashboard
SELECT
  phase,
  count(*) as total_tasks,
  count(*) FILTER (WHERE status = 'completed') as completed,
  count(*) FILTER (WHERE status = 'blocked') as blocked,
  count(*) FILTER (WHERE status = 'in_progress') as in_progress,
  count(*) FILTER (WHERE status = 'pending') as pending,
  round(100.0 * count(*) FILTER (WHERE status = 'completed') / count(*), 1) as pct_complete,
  sum(xp_reward) FILTER (WHERE status = 'completed') as xp_earned
FROM project_tasks
GROUP BY phase
ORDER BY phase;
\`\`\`

---

## Optimization Rules

### DO Optimize

1. **Knowledge loading order** — Load most-referenced files first
2. **Task batching** — Group related tasks when dependencies allow
3. **Verification caching** — Skip full rebuild if only adding new files
4. **Parallel delegation** — Both agents can work simultaneously on independent tasks

### DO NOT Optimize

1. **Task protocol** — Never skip query → claim → execute → verify → complete
2. **Safety checks** — Never skip risk classification
3. **Knowledge loading** — Never skip reading wat_references
4. **Verification** — Never skip tsc + build after code changes
5. **Human gates** — Never auto-approve gated actions

---

## Scaling Expectations

| Project Size | Tasks | Phases | Avg Session Output | Full Build Time |
|-------------|-------|--------|-------------------|-----------------|
| Small (${moduleCount <= 3 ? moduleCount : 3} modules) | 10-20 | 1-2 | 5-8 tasks | Minutes |
| Medium (5-10 modules) | 30-80 | 3-6 | 3-5 tasks | Minutes |
| Large (15+ modules) | 100-200 | 8-15 | 2-4 tasks | 5-10 min |
| Enterprise (30+ modules) | 200+ | 15+ | 1-3 tasks | 10+ min |

As project size grows, individual tasks become more complex but the protocol stays identical.
The system scales linearly — more modules means more knowledge files and tasks, but the
framework structure remains the same.
`;
}
