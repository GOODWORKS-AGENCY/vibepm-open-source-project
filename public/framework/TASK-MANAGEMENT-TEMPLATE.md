**\# Task Management Process Template**

**\#\# System Overview**

Five files keep the project organized. Both AI agents (Claude Code \+ Codex) follow this process.

\`\`\`  
PROJECT TASK SYSTEM  
\===================

Source of Truth: project\_tasks table in Supabase (PostgreSQL)  
Visual Dashboard: /project-tracker route (requires auth)  
XP \+ Levels: project\_levels table (15 levels, 0-12000 XP)

┌──────────────────────────────────────────────────────────────────┐  
│                                                                  │  
│  .claude/plans/\*.md        Readable phase plans (context for AI) │  
│         ↓                                                        │  
│  supabase/migrations/      SQL that seeds tasks into DB          │  
│         ↓                                                        │  
│  project\_tasks table       Source of truth for status/progress   │  
│         ↓                                                        │  
│  /project-tracker UI       Dashboard for humans to see progress  │  
│                                                                  │  
│  CLAUDE.md \+ AGENTS.md     Tell AI agents to follow the protocol │  
│  knowledge/                Domain context loaded per task         │  
│                                                                  │  
└──────────────────────────────────────────────────────────────────┘  
\`\`\`

\---

**\#\# Task Protocol (Every Work Session)**

**\#\#\# Before Starting Work**  
\`\`\`sql  
\-- Find next task  
SELECT task\_code, title, priority, dependencies, wat\_references  
FROM project\_tasks  
WHERE status \= 'pending'  
ORDER BY priority DESC  
LIMIT 1;

\-- Mark it in\_progress  
UPDATE project\_tasks  
SET status \= 'in\_progress', started\_at \= now()  
WHERE task\_code \= 'PXX-YY';  
\`\`\`

**\#\#\# After Completing Work**  
\`\`\`sql  
UPDATE project\_tasks  
SET status \= 'completed', progress\_pct \= 100, completed\_at \= now()  
WHERE task\_code \= 'PXX-YY';  
\`\`\`

**\#\#\# If Blocked**  
\`\`\`sql  
UPDATE project\_tasks  
SET status \= 'blocked', notes \= 'Reason for blocker'  
WHERE task\_code \= 'PXX-YY';  
\`\`\`

**\#\#\# Always Verify After Changes**  
\`\`\`bash  
npx tsc \--noEmit     \# Zero type errors  
npx vite build       \# Clean build  
\`\`\`

\---

**\#\# Adding a New Phase (Step-by-Step)**

**\#\#\# Step 1: Define Tasks**

Create or update a plan file in \`.claude/plans/\` with a table of tasks:

| Field | Format | Example |  
|-------|--------|---------|  
| \`task\_code\` | \`P{phase}-{number}\` | \`P18-01\` |  
| \`title\` | Short imperative description | \`Dark navy theme — CSS variables overhaul\` |  
| \`description\` | Detailed spec (what to build, files to touch) | \`Replace OKLCH values in globals.css...\` |  
| \`phase\` | \`phase{N}\` | \`phase18\` |  
| \`category\` | One of: \`feature\`, \`infra\`, \`ai\`, \`ui\`, \`orchestration\` | \`ui\` |  
| \`assigned\_to\` | \`claude-code\` or \`codex\` | \`claude-code\` |  
| \`priority\` | 1-100 (higher \= do first within phase) | \`100\` |  
| \`xp\_reward\` | Based on complexity (15-50 typical) | \`30\` |  
| \`dependencies\` | Array of task\_codes that must complete first | \`ARRAY\['P18-01'\]\` |  
| \`wat\_references\` | Array of knowledge file paths to load | \`ARRAY\['knowledge/skills/shared/foo.md'\]\` |

**\#\#\# Step 2: Create Migration to Seed Tasks**

File: \`supabase/migrations/000XX\_phaseN\_description.sql\`

\`\`\`sql  
\-- 000XX\_phaseN\_description.sql  
\-- Phase N: \[Phase Name\] — \[N\] tasks

INSERT INTO public.project\_tasks (  
  task\_code, title, description, phase, category,  
  assigned\_to, priority, xp\_reward, status, progress\_pct,  
  dependencies, wat\_references  
) VALUES

('PXX-01', 'Task title',  
 'Detailed description of what to build.',  
 'phaseXX', 'category', 'claude-code', 100, 30, 'pending', 0,  
 '{}'::TEXT\[\], '{}'::TEXT\[\]),

('PXX-02', 'Second task',  
 'Description.',  
 'phaseXX', 'category', 'claude-code', 95, 25, 'pending', 0,  
 ARRAY\['PXX-01'\], ARRAY\['knowledge/skills/module/module.skill.md'\])

ON CONFLICT (task\_code) DO UPDATE SET  
  title \= EXCLUDED.title,  
  description \= EXCLUDED.description,  
  phase \= EXCLUDED.phase,  
  category \= EXCLUDED.category,  
  priority \= EXCLUDED.priority,  
  xp\_reward \= EXCLUDED.xp\_reward,  
  dependencies \= EXCLUDED.dependencies;  
\`\`\`

**\#\#\# Step 3: Push Migration**

\`\`\`bash  
npx supabase db push  
\`\`\`

**\#\#\# Step 4: Update Project Tracker UI**

Add the new phase to the \`PHASES\` array in \`src/pages/project-tracker/ProjectTasksPage.tsx\`:

\`\`\`ts  
{ value: 'phaseXX', label: 'Phase XX: Phase Name' },  
\`\`\`

**\#\#\# Step 5: Create Knowledge Files (If Needed)**

| Knowledge Type | When to Create | Template Location |  
|---------------|----------------|-------------------|  
| **\*\*Skill\*\*** | New domain module or concept | \`knowledge/skills/\[module\]/\[module\].skill.md\` |  
| **\*\*Tool\*\*** | New DB schema, API endpoint, or UI component spec | \`knowledge/tools/\[type\]/\[name\].tool.md\` |  
| **\*\*Workflow\*\*** | New multi-step business process | \`knowledge/workflows/\[module\]/\[name\].workflow.md\` |  
| **\*\*Skip all\*\*** | Pure UI/CSS, refactoring, bug fixes, config changes | No knowledge files needed |

**\*\*Rule of thumb\*\***: If a task's \`wat\_references\` array is empty, no knowledge file is needed.

**\#\#\# Step 6: Work the Tasks**

Follow the Task Protocol above. Work in priority order within the phase, respecting dependencies.

**\#\#\# Step 7: Create Completion Migration**

After all tasks in the phase are done:

\`\`\`sql  
\-- 000XX\_mark\_phaseN\_complete.sql  
\-- Phase N: \[Name\] — all N tasks complete

INSERT INTO public.project\_tasks (  
  task\_code, title, phase, category,  
  assigned\_to, priority, xp\_reward, status, progress\_pct,  
  started\_at, completed\_at  
) VALUES  
  ('PXX-01', 'Task title', 'phaseXX', 'category', 'claude-code', 100, 30, 'completed', 100, now(), now()),  
  ('PXX-02', 'Task title', 'phaseXX', 'category', 'claude-code', 95, 25, 'completed', 100, now(), now())  
ON CONFLICT (task\_code) DO UPDATE SET  
  status \= 'completed',  
  progress\_pct \= 100,  
  completed\_at \= now();  
\`\`\`

\---

**\#\# Database Schema Reference**

**\#\#\# project\_tasks**  
\`\`\`sql  
task\_code    TEXT NOT NULL UNIQUE          \-- P18-01  
title        TEXT NOT NULL  
description  TEXT  
phase        TEXT NOT NULL                 \-- phase18  
category     TEXT NOT NULL                 \-- feature, infra, ai, ui, orchestration  
assigned\_to  TEXT NOT NULL DEFAULT 'claude-code'  \-- claude-code | codex  
status       TEXT NOT NULL DEFAULT 'pending'      \-- pending | in\_progress | completed | blocked  
priority     INTEGER NOT NULL             \-- 1-100 (higher \= first)  
progress\_pct INTEGER DEFAULT 0            \-- 0-100  
xp\_reward    INTEGER DEFAULT 10           \-- XP earned on completion  
dependencies TEXT\[\] DEFAULT '{}'          \-- Array of blocking task\_codes  
wat\_references TEXT\[\] DEFAULT '{}'        \-- Array of knowledge file paths  
notes        TEXT                         \-- Blocker notes, context  
started\_at   TIMESTAMPTZ  
completed\_at TIMESTAMPTZ  
\`\`\`

**\#\#\# project\_levels**  
\`\`\`sql  
level        INTEGER NOT NULL UNIQUE  
title        TEXT NOT NULL                \-- Apprentice, Builder, ..., Ascended  
xp\_required  INTEGER NOT NULL            \-- 0, 100, 250, ..., 12000  
badge\_emoji  TEXT                        \-- Unicode emoji  
\`\`\`

Current levels: 1-15 (Apprentice → Ascended, 0-12000 XP)

\---

**\#\# AI Agent Assignments**

| Agent | File It Reads | Specialization |  
|-------|--------------|----------------|  
| **\*\*Claude Code\*\*** | \`.claude/CLAUDE.md\` \+ \`.claude/rules/\*\` | Architecture, complex UI, hooks/API, AI agents, testing, workflows |  
| **\*\*Codex\*\*** | \`AGENTS.md\` (repo root) | Database migrations, RLS, audit triggers, boilerplate CRUD, placeholder pages |

Both agents follow the same Task Protocol. Filter by \`assigned\_to\` when picking tasks.

\---

**\#\# Knowledge Base Structure**

\`\`\`  
knowledge/  
├── prod.md          Full domain reference (all 33 modules)  
├── PRD.json         Task dependency graph  
├── skills.md        Index of all skill files  
├── tools.md         Index of all tool files  
├── workflows.md     Index of all workflow files  
├── skills/          Domain knowledge per module (WHAT to build)  
│   ├── shared/      Cross-cutting: orchestration, audit, cascade, auth  
│   └── \[module\]/    Per-module: members, donations, events, etc.  
├── tools/           Specifications (HOW to build)  
│   ├── db/          CRUD tool specs per entity  
│   ├── api/         Edge function specs  
│   ├── ui/          UI component specs  
│   └── automation/  Automation engine specs  
└── workflows/       Business processes (WHEN things happen)  
    ├── shared/      Canonical pipeline, cascade evaluation  
    └── \[module\]/    Per-module workflows  
\`\`\`

**\#\#\# Loading by Task Type**  
\- **\*\*Working on a specific module\*\***: Load \`knowledge/skills/\[module\]/\[module\].skill.md\`  
\- **\*\*Implementing CRUD\*\***: Load \`knowledge/tools/db/\[entity\]-crud.tool.md\`  
\- **\*\*Building an edge function\*\***: Load \`knowledge/tools/api/\[function-name\].tool.md\`  
\- **\*\*Implementing a workflow\*\***: Load \`knowledge/workflows/\[module\]/\[workflow\].workflow.md\`  
\- **\*\*Cross-cutting concerns\*\***: Load \`knowledge/skills/shared/\[topic\].skill.md\`

\---

**\#\# Project History**

| Phase | Name | Tasks | Status |  
|-------|------|-------|--------|  
| 1 | Foundation | 30 | Complete |  
| 1.5 | Task Tracker | 3 | Complete |  
| 2 | Core Modules | 20 | Complete |  
| 3 | CRM \+ Support | 15 | Complete |  
| 4 | Finance | 11 | Complete |  
| 5 | Marketing \+ Collaboration | 11 | Complete |  
| 6 | AI Agents \+ Orchestration | 10 | Complete |  
| 7 | Production Readiness | 3 | Complete |  
| 8 | Orchestration Runtime | 10 | Complete |  
| 9 | AI Edge Functions | 12 | Complete |  
| 10 | Communication & Automation | 8 | Complete |  
| 11 | Module Maturity | 10 | Complete |  
| 12 | Connectors & Observability | 10 | Complete |  
| 13 | Advanced Intelligence | 10 | Complete |  
| 14-17 | Extended Production | \~40 | Complete |  
| **\*\*18\*\*** | **\*\*UI/UX Overhaul\*\*** | **\*\*7\*\*** | **\*\*Current\*\*** |

Total: 200+ tasks, 50+ migrations, 16 edge functions, 75+ hooks, 33 modules

