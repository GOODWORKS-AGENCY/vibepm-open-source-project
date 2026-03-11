# VibePM — Complete Technical Specification

> **Purpose**: This document contains everything needed to rebuild VibePM from scratch using VS Code + Claude Code. It covers architecture, data flow, every component, every template, database schema, edge functions, and the complete generation pipeline.

---

## Table of Contents

1. [What VibePM Is](#1-what-vibepm-is)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture Overview](#4-architecture-overview)
5. [Data Flow & Pipeline](#5-data-flow--pipeline)
6. [Database Schema](#6-database-schema)
7. [Edge Functions](#7-edge-functions)
8. [Frontend Routing](#8-frontend-routing)
9. [State Management](#9-state-management)
10. [Design System](#10-design-system)
11. [Component Inventory](#11-component-inventory)
12. [Template Engine (Complete)](#12-template-engine-complete)
13. [The Generation Orchestrator](#13-the-generation-orchestrator)
14. [Agent Runtime System](#14-agent-runtime-system)
15. [Export System](#15-export-system)
16. [Gamification System](#16-gamification-system)
17. [Rebuild Instructions](#17-rebuild-instructions)
18. [Known Issues & Fixes](#18-known-issues--fixes)

---

## 1. What VibePM Is

VibePM is an **AI-powered project scaffolding platform** that transforms raw project ideas ("brain dumps") into complete, deployment-ready development frameworks for AI agents.

### What It Produces

From a text description of your project, VibePM generates:

| Output | Description |
|--------|-------------|
| `.claude/CLAUDE.md` | Primary AI agent instructions file |
| `.claude/rules/*.md` | 5 coding convention files |
| `AGENTS.md` | Multi-agent coordination config |
| `knowledge/prod.md` | Master knowledge base (platform atlas) |
| `knowledge/PRD.json` | Task dependency graph |
| `knowledge/skills/*.skill.md` | Domain knowledge files (WHAT to build) |
| `knowledge/tools/*.tool.md` | Implementation specs (HOW to build) |
| `knowledge/workflows/*.workflow.md` | Process definitions (WHEN things happen) |
| `knowledge/skills.md`, `tools.md`, `workflows.md` | Index files |
| `supabase/migrations/00001_project_tasks.sql` | Database migration + task seed SQL |
| `src/hooks/useProjectTasks.ts` | React data fetching hook |
| `src/components/ProgressRing.tsx` | Progress visualization component |
| `src/components/TaskCard.tsx` | Task display component |
| `src/pages/ProjectTasksPage.tsx` | Full tracker page |
| `scripts/agent.sh` | Agent CLI (bash script for task loop) |
| `doc/VISION.md`, `PRODUCT.md`, `SPEC.md` | Strategic documents |
| `SETUP.md` | Deployment guide |
| `tasks/tasks.json` | Raw task data |
| `supabase/functions/agent-tasks/index.ts` | Edge function for agent API |

### Core Philosophy

- **BYOB (Bring Your Own Backend)**: Users export a ZIP and deploy to their own Supabase + VS Code environment
- **WAT Framework**: Workflows, Agents, Tools — a 3-layer knowledge architecture
- **Zero-config default**: Works with localStorage only; optional Supabase sync
- **AI does creative work, templates do structured work**: The AI analyzes and generates tasks; deterministic templates generate all config/knowledge files

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite (SWC plugin), port 8080 |
| **UI Library** | shadcn/ui (Radix primitives) |
| **Styling** | Tailwind CSS + custom design tokens |
| **Animation** | Framer Motion |
| **Routing** | react-router-dom v6 |
| **Server State** | TanStack Query |
| **Local State** | localStorage via `src/lib/store.ts` |
| **Forms** | react-hook-form + zod |
| **Backend** | Supabase (PostgreSQL + Edge Functions + Auth) |
| **AI** | Supabase Edge Function → Lovable AI Gateway → Google Gemini 2.5 Flash |
| **Export** | JSZip (client-side ZIP generation) |
| **Fonts** | Space Grotesk (display), JetBrains Mono (mono) |

### Dependencies (Key)

```json
{
  "@supabase/supabase-js": "^2.98.0",
  "@tanstack/react-query": "^5.83.0",
  "framer-motion": "^12.35.1",
  "jszip": "^3.10.1",
  "react-router-dom": "^6.30.1",
  "recharts": "^2.15.4",
  "zod": "^3.25.76"
}
```

---

## 3. Project Structure

```
vibepm/
├── .claude/CLAUDE.md                    # Agent instructions (for VibePM itself)
├── public/
│   ├── framework/                       # Static framework template docs (9 .md files)
│   └── VIBEPM_TECHNICAL_SPEC.md         # This document
├── src/
│   ├── App.tsx                          # Root component + route definitions
│   ├── main.tsx                         # Entry point
│   ├── index.css                        # Tailwind + design tokens (217 lines)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx            # Sidebar + header wrapper
│   │   │   └── AppSidebar.tsx           # Navigation sidebar
│   │   ├── landing/
│   │   │   ├── Emblems.tsx              # SVG emblem components
│   │   │   └── LandingNav.tsx           # Landing page navigation
│   │   ├── NavLink.tsx                  # Active-aware navigation link
│   │   └── ui/                          # ~50 shadcn/ui components
│   ├── hooks/
│   │   ├── useProjects.ts               # localStorage CRUD for projects
│   │   ├── useProjectTasks.ts           # Supabase task CRUD + realtime
│   │   ├── useAgentRuntime.ts           # Agent state machine hooks (8 hooks)
│   │   ├── use-mobile.tsx               # Mobile detection
│   │   └── use-toast.ts                 # Toast notifications
│   ├── integrations/
│   │   ├── lovable/index.ts             # Lovable platform integration
│   │   └── supabase/
│   │       ├── client.ts                # Auto-generated Supabase client
│   │       └── types.ts                 # Auto-generated database types
│   ├── lib/
│   │   ├── ai-generate.ts               # AI API calls (analyze + generate-tasks)
│   │   ├── generate-from-templates.ts   # THE ORCHESTRATOR (768 lines)
│   │   ├── store.ts                     # localStorage CRUD (91 lines)
│   │   └── utils.ts                     # cn() utility
│   ├── pages/
│   │   ├── Landing.tsx                  # Public landing page (553 lines)
│   │   ├── NewProject.tsx               # 4-step wizard (693 lines)
│   │   ├── Projects.tsx                 # Project list
│   │   ├── ProjectDashboard.tsx         # Project detail + nested routes
│   │   ├── ProjectTasks.tsx             # Kanban-style task board
│   │   ├── ProjectTracker.tsx           # Full tracker with sync (697 lines)
│   │   ├── ProjectTrackerWrapper.tsx    # Wrapper for route params
│   │   ├── ProjectKnowledge.tsx         # Knowledge file browser
│   │   ├── ProjectExport.tsx            # File browser + ZIP download
│   │   ├── FrameworkDocs.tsx            # Framework documentation viewer
│   │   ├── SystemOverview.tsx           # Pipeline visualization
│   │   └── NotFound.tsx                 # 404 page
│   ├── templates/                       # 19 template generators
│   │   ├── claude-md.ts                 # CLAUDE.md generator
│   │   ├── agents-md.ts                 # AGENTS.md generator
│   │   ├── prod-md.ts                   # prod.md (master knowledge base)
│   │   ├── prd-json.ts                  # PRD.json (dependency graph)
│   │   ├── pipeline.ts                  # Pipeline reference
│   │   ├── rules-files.ts              # 5 rules file generators
│   │   ├── skill-file.ts               # Skill file generators (4 functions)
│   │   ├── tool-file.ts                # Tool file generators (5 functions)
│   │   ├── workflow-file.ts            # Workflow file generators (3 functions)
│   │   ├── task-seed.ts                # SQL migration generator
│   │   ├── task-tracker-ui.ts          # React component generators (5 functions)
│   │   ├── agent-cli.ts                # agent.sh script generator
│   │   ├── agent-spec.ts               # Agent specification
│   │   ├── agent-tasks-function.ts     # Edge function template
│   │   ├── setup-guide.ts              # SETUP.md generator
│   │   ├── integration-checklist.ts    # Integration checklist
│   │   ├── strategic-docs.ts           # VISION.md, PRODUCT.md, SPEC.md
│   │   ├── design-system.ts            # Design system skill file
│   │   └── wat-patterns.ts             # WAT pattern docs (3 functions)
│   ├── test/
│   │   ├── setup.ts                     # Test setup (matchMedia mock)
│   │   ├── example.test.ts
│   │   ├── templates.test.ts
│   │   ├── generate-from-templates.test.ts
│   │   └── agent-runtime.test.ts
│   └── types/
│       └── project.ts                   # All TypeScript types (271 lines)
├── supabase/
│   ├── config.toml                      # Supabase configuration
│   └── functions/
│       ├── generate-project/index.ts    # AI generation edge function
│       └── agent-tasks/index.ts         # Agent runtime API (1787 lines)
├── tailwind.config.ts                   # Tailwind configuration
├── vite.config.ts                       # Vite configuration
├── vitest.config.ts                     # Test configuration
└── package.json
```

---

## 4. Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                  │
│  React pages + shadcn/ui + Framer Motion            │
│  Routes: /, /new, /projects, /projects/:id/*        │
├─────────────────────────────────────────────────────┤
│  DATA LAYER                                          │
│  localStorage (projects) + Supabase (tasks/levels)  │
│  Hooks: useProjects, useProjectTasks, useAgentRuntime│
├─────────────────────────────────────────────────────┤
│  GENERATION LAYER                                    │
│  AI (edge function) + Templates (deterministic)     │
│  generate-from-templates.ts = THE ORCHESTRATOR      │
└─────────────────────────────────────────────────────┘
```

### Dual Storage Model

| Data | Storage | Why |
|------|---------|-----|
| Projects (name, desc, stack, phases, tasks, generated files, XP) | `localStorage` under key `vibepm_projects` | Zero-config, works offline, BYOB philosophy |
| Tasks (for agent access) | Supabase `project_tasks` table | Agents need a queryable API endpoint |
| Gamification levels | Supabase `project_levels` table | Shared reference data |

---

## 5. Data Flow & Pipeline

### The Complete Generation Pipeline

```
USER INPUT                    AI (Creative)              TEMPLATES (Deterministic)
──────────                    ─────────────              ────────────────────────

Step 1: Brain Dump
├── Project name
├── Description
├── Uploaded .md/.txt files
└── Brain dump sections
         │
         ▼
Step 2: Analyze (AI Call)
         │
         │  POST /functions/v1/generate-project
         │  body: { step: "analyze", data: { projectName, projectDesc, brainDump } }
         │
         ▼
    AnalysisResult {
      projectName, description,
      stack: { framework, language, buildTool, backend, ui, stateManagement, forms, validation },
      entities: string[],           // e.g. ["users", "projects", "tasks"]
      sharedConcerns: string[],     // e.g. ["auth", "audit"]
      modules: Module[],            // { name, description, route, entities, actions, relatedModules }
      phases: Phase[],              // { number, name, description }
      agents?: Agent[],             // { name, role }
      workflowFamilies?: WorkflowFamily[]
    }
         │
         ▼
Step 3a: Generate Tasks (AI Call)
         │
         │  POST /functions/v1/generate-project
         │  body: { step: "generate-tasks", data: { analysis } }
         │
         ▼
    GeneratedTask[] (15-60 tasks) {
      task_code: "P01-01",          // Phase-padded sequential
      title, description,
      phase: "phase1",
      category: "feature" | "infra" | "ai" | "ui" | "orchestration",
      assigned_to: "claude-code",
      priority: 1-100,
      xp_reward: 15-50,
      dependencies: string[],       // Task codes that must complete first
      wat_references: string[]       // Knowledge file paths to load
    }
         │
         ▼
Step 3b: Generate Framework (LOCAL — No AI)
         │
         │  generateConfigFromTemplates(analysis, tasks)
         │  src/lib/generate-from-templates.ts
         │
         │  SUB-STEPS:
         │  1. Extract modules from analysis
         │  2. Compute all knowledge file paths that will be generated
         │  3. RECONCILE: Fix AI-generated wat_references to point to real paths
         │     - Pass 1: Exact match
         │     - Pass 2: Normalized path match (slug comparison)
         │     - Pass 3: Fuzzy stem match
         │     - Pass 4: If zero resolved, INFER from task title/description
         │  4. Build Project object from analysis + reconciled tasks
         │  5. Call ALL template generators → produce 30-60+ files
         │
         ▼
    { path: string; content: string }[]  (30-60+ files)
         │
         ▼
Step 4: Save
    ├── store.createProject() → localStorage
    │   project.generatedFiles = all generated files
    │   project.knowledgeFiles = subset filtered from generatedFiles
    │   project.tasks = task array
    │
    └── seedTasks() → Supabase project_tasks table
        Maps each task to DB format with project_id
```

### The WAT Reference Reconciliation System

This is the most critical piece of the pipeline. The AI generates `wat_references` arrays for tasks, but these are "best guesses" — they may not match the exact paths the template engine will produce. The reconciliation system fixes this:

```typescript
// Three-pass resolution strategy:
function reconcileWatReferences(tasks, knowledgePaths, modules, entities) {
  // For each task's wat_references:
  //   Pass 1: Exact match against generated paths
  //   Pass 2: Normalize both paths (lowercase, slug) and match
  //   Pass 3: Extract filename stem, strip suffixes, fuzzy match
  //   Pass 4: If still zero matches, INFER from task content:
  //     - Match module names in title/description → add module skill
  //     - Match entities → add DB tool
  //     - Match keywords (auth, search, etc.) → add shared skill
  //     - Match category (infra→DB tool, ui→UI tool, etc.)
}
```

---

## 6. Database Schema

### Table: `project_tasks`

```sql
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_code TEXT NOT NULL,                    -- "P01-01" format
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL,                        -- "phase1", "phase2", etc.
  category TEXT NOT NULL,                     -- "feature", "infra", "ai", "ui", "orchestration"
  assigned_to TEXT NOT NULL DEFAULT 'claude-code',
  status TEXT NOT NULL DEFAULT 'pending',     -- "pending", "in_progress", "completed", "blocked"
  priority INTEGER NOT NULL DEFAULT 1,        -- 1-100, higher = do first
  progress_pct INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 10,
  dependencies TEXT[] DEFAULT '{}',           -- Array of task_codes
  wat_references TEXT[] DEFAULT '{}',         -- Array of knowledge file paths
  notes TEXT,
  project_id TEXT,                            -- Links to localStorage project
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**RLS Policies**: Currently wide open (public read/write/insert/delete). For production, scope to authenticated users with `user_id`.

### Table: `project_levels`

```sql
CREATE TABLE project_levels (
  id SERIAL PRIMARY KEY,
  level INTEGER NOT NULL,
  title TEXT NOT NULL,
  xp_required INTEGER NOT NULL,
  badge_emoji TEXT
);

-- 15 levels from Apprentice (0 XP) to Ascended (12,000 XP)
```

### Tables Referenced by Agent Runtime (not in current DB schema — exist in the agent-tasks edge function)

The `agent-tasks` edge function references these additional tables that agents would create in their own Supabase:

| Table | Purpose |
|-------|---------|
| `agents` | Agent state machine (idle/running/paused/terminated), budget tracking |
| `heartbeat_runs` | Execution run tracking (start/complete/fail) |
| `run_logs` | Streaming log chunks per run |
| `cost_events` | Token usage and cost tracking per agent/model |
| `activity_log` | Audit trail for all mutations |
| `task_comments` | Per-task discussion threads |
| `wakeup_requests` | Agent wakeup queue (idempotent) |
| `config_revisions` | Agent config version history |

---

## 7. Edge Functions

### 1. `generate-project` (AI Generation)

**Location**: `supabase/functions/generate-project/index.ts`
**Purpose**: Creative AI work — analyzing brain dumps and generating task lists
**Model**: `google/gemini-2.5-flash` via Lovable AI Gateway
**API Key**: `LOVABLE_API_KEY` (server-side secret)

#### Actions

| Action | Input | Output |
|--------|-------|--------|
| `analyze` | `{ projectName, projectDesc, brainDump }` | `AnalysisResult` (modules, entities, phases, stack) |
| `generate-tasks` | `{ analysis: AnalysisResult }` | `{ tasks: GeneratedTask[] }` |

#### AI Call Pattern

```typescript
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: systemPrompt + "\n\nIMPORTANT: Return your response as a valid JSON object." },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  }),
});
```

Response parsing strips markdown code blocks if present:
```typescript
const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
```

### 2. `agent-tasks` (Agent Runtime API)

**Location**: `supabase/functions/agent-tasks/index.ts`
**Purpose**: The autonomous agent loop — task claiming, completion, heartbeats, cost tracking
**Size**: 1,787 lines
**Auth**: Requires `Authorization: Bearer <user_jwt>` header

#### Action Categories

**Task Actions:**
| Action | Purpose |
|--------|---------|
| `next` | Get highest-priority pending task (respects dependencies) |
| `claim` | Atomically claim a task (race-safe — uses conditional UPDATE WHERE status='pending') |
| `complete` | Mark task completed, calculate XP |
| `block` | Mark task blocked with reason, auto-creates blocker comment |
| `status` | Get overall progress stats |
| `list` | List tasks with optional phase/status filters |

**Agent State Machine:**
| Action | Purpose |
|--------|---------|
| `agent:register` | Register/upsert agent with budget and heartbeat config |
| `agent:status` | Get agent status and config |
| `agent:pause` | Pause agent (rejects future claims) |
| `agent:resume` | Resume paused agent |
| `agent:terminate` | Permanently terminate agent |

**Valid State Transitions:**
```
idle → running, paused, terminated
running → idle, paused, terminated
paused → idle, terminated
terminated → (none — terminal state)
```

**Heartbeat/Run Actions:**
| Action | Purpose |
|--------|---------|
| `heartbeat:start` | Start a tracked execution run |
| `heartbeat:complete` | Complete a run with status/result |
| `heartbeat:log` | Append streaming log chunk |

**Cost/Activity Actions:**
| Action | Purpose |
|--------|---------|
| `cost:record` | Record token usage event |
| `cost:summary` | Get aggregated cost summary by agent/model |
| `activity:list` | Get recent activity log entries |

**Wakeup Actions:**
| Action | Purpose |
|--------|---------|
| `wakeup:request` | Request agent wakeup (idempotent via key) |
| `wakeup:claim` | Claim a queued wakeup |
| `wakeup:finish` | Mark wakeup finished |
| `wakeup:list` | List wakeup requests |

**Config Actions:**
| Action | Purpose |
|--------|---------|
| `config:update` | Update agent config with revision tracking |
| `config:rollback` | Rollback to previous revision |
| `config:history` | List config revision history |

**Dashboard/Doctor:**
| Action | Purpose |
|--------|---------|
| `dashboard` | Aggregated overview with stale run detection |
| `doctor` | Health check: tables, agents, stale runs, budget |

---

## 8. Frontend Routing

```typescript
// src/App.tsx
<Routes>
  <Route path="/" element={<AppLayout><Projects /></AppLayout>} />
  <Route path="/new" element={<AppLayout><NewProject /></AppLayout>} />
  <Route path="/projects" element={<AppLayout><Projects /></AppLayout>} />
  <Route path="/projects/:id" element={<AppLayout><ProjectDashboard /></AppLayout>}>
    <Route path="tasks" element={<ProjectTasks />} />
    <Route path="tracker" element={<ProjectTrackerWrapper />} />
    <Route path="knowledge" element={<ProjectKnowledge />} />
    <Route path="export" element={<ProjectExport />} />
  </Route>
  <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
</Routes>
```

**Note**: The Landing page (`/landing`) and auth routes are currently not in the router. The `Landing.tsx` component exists but is not mounted. The root `/` shows `Projects` directly.

---

## 9. State Management

### localStorage (`src/lib/store.ts`)

```typescript
const STORAGE_KEY = 'vibepm_projects';

// CRUD operations:
getProjects(): Project[]
getProject(id: string): Project | undefined
createProject(name, description, stack): Project
saveProject(project: Project): Project
deleteProject(id: string): void
updateTaskStatus(projectId, taskCode, status): Project | undefined
```

### Project Type (`src/types/project.ts`)

```typescript
interface Project {
  id: string;                          // crypto.randomUUID()
  name: string;
  description: string;
  stack: ProjectStack;                 // framework, language, buildTool, backend, ui, etc.
  phases: Phase[];                     // { id, number, name, description, status }
  tasks: Task[];                       // Full task objects
  knowledgeFiles: KnowledgeFile[];     // { path, type, content }
  generatedFiles: GeneratedFile[];     // { path, content } — ALL generated output
  xp: { current: number; level: number };
  createdAt: string;
  updatedAt: string;
}
```

### Supabase Hooks (`src/hooks/useProjectTasks.ts`)

```typescript
function useProjectTasks(projectId?: string) {
  // Returns:
  tasks: ProjectTask[]          // From Supabase, filtered by project_id
  levels: ProjectLevel[]        // Gamification levels
  stats: TaskStats              // Computed: total, completed, inProgress, pending, blocked, XP
  currentLevel: ProjectLevel    // Current XP level
  nextLevel: ProjectLevel       // Next level to reach
  phases: string[]              // Unique phase names
  isLoading: boolean
  
  // Mutations:
  updateTaskStatus(taskCode, newStatus)    // Updates single task
  seedTasks(tasks[])                       // Bulk upsert (onConflict: 'task_code')
  refresh()                                // Re-fetch
}
```

### Agent Runtime Hooks (`src/hooks/useAgentRuntime.ts`)

8 composable hooks for the full agent lifecycle:

| Hook | Purpose |
|------|---------|
| `useAgents()` | Agent CRUD + state machine + realtime |
| `useHeartbeats(agentId?)` | Run management + realtime |
| `useRunLogs(runId)` | Streaming log viewer + realtime |
| `useCosts(agentId?)` | Cost tracking + summary |
| `useTaskComments(taskCode)` | Per-task discussion + realtime |
| `useActivityLog(opts?)` | Audit trail + realtime |
| `useWakeups(agentId?)` | Wakeup request queue + realtime |
| `useConfigHistory(agentId)` | Config revision tracking |
| `useDashboard()` | Aggregated overview |
| `useDoctor()` | Health checks |

---

## 10. Design System

### Color Tokens (HSL)

```css
/* Light Mode */
:root {
  --background: 220 20% 97%;
  --foreground: 220 25% 10%;
  --primary: 262 83% 58%;          /* Purple */
  --accent: 168 75% 42%;           /* Teal/Cyan */
  --destructive: 0 84% 60%;       /* Red */
  --muted: 220 14% 95%;
  --border: 220 13% 88%;
  
  /* Custom brand colors */
  --vibe-glow: 262 83% 58%;       /* Purple glow */
  --vibe-cyan: 168 75% 42%;       /* Teal */
  --vibe-amber: 38 92% 50%;       /* Amber */
  --vibe-rose: 346 77% 50%;       /* Rose */
  
  /* Sidebar (dark by default) */
  --sidebar-background: 220 25% 10%;
  --sidebar-foreground: 220 14% 92%;
}

/* Dark Mode */
.dark {
  --background: 220 25% 6%;
  --primary: 262 83% 62%;
  --accent: 168 75% 48%;
  /* ... adjusted for dark backgrounds */
}
```

### Utility Classes

```css
.glow-primary     /* Purple box-shadow glow */
.glow-accent      /* Teal box-shadow glow */
.gradient-primary /* Purple → Teal gradient background */
.gradient-text    /* Purple → Teal gradient text */
.gradient-text-warm /* Amber → Rose gradient text */
.gradient-text-cool /* Teal → Purple gradient text */
.bento-card       /* Hover glow border + lift effect */
.shimmer-badge    /* Animated shimmer background */
.orb-float        /* Floating animation for decorative orbs */
.glass-nav        /* Glassmorphism navbar */
.noise-overlay    /* SVG noise texture */
.landing-grid     /* Grid background pattern */
```

### Typography

```typescript
fontFamily: {
  display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
}
```

### Tailwind Custom Colors

```typescript
// tailwind.config.ts
vibe: {
  glow: "hsl(var(--vibe-glow))",
  cyan: "hsl(var(--vibe-cyan))",
  amber: "hsl(var(--vibe-amber))",
  rose: "hsl(var(--vibe-rose))",
}
```

---

## 11. Component Inventory

### Page Components

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| `Landing` | `pages/Landing.tsx` | 553 | Public landing page with hero, features, FAQ |
| `NewProject` | `pages/NewProject.tsx` | 693 | 4-step wizard: Brain Dump → Analyze → Generate → Save |
| `Projects` | `pages/Projects.tsx` | 91 | Project list with cards, progress, XP badges |
| `ProjectDashboard` | `pages/ProjectDashboard.tsx` | 224 | Project detail with tab navigation + nested routes |
| `ProjectTasks` | `pages/ProjectTasks.tsx` | 134 | Kanban-style 4-column task board |
| `ProjectTracker` | `pages/ProjectTracker.tsx` | 697 | Full tracker with filters, sync, seed, pull, notes |
| `ProjectKnowledge` | `pages/ProjectKnowledge.tsx` | 101 | Knowledge file browser (skills/tools/workflows) |
| `ProjectExport` | `pages/ProjectExport.tsx` | 151 | File browser + ZIP download |
| `SystemOverview` | `pages/SystemOverview.tsx` | 74 | Pipeline chain visualization |

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `AppLayout` | `components/layout/AppLayout.tsx` | Sidebar + header + main content |
| `AppSidebar` | `components/layout/AppSidebar.tsx` | Navigation: New Project, My Projects |
| `LandingNav` | `components/landing/LandingNav.tsx` | Landing page top navigation |
| `Emblems` | `components/landing/Emblems.tsx` | 5 SVG emblem components |
| `NavLink` | `components/NavLink.tsx` | Active-aware route link |

### UI Components (shadcn/ui)

50+ pre-built components in `src/components/ui/`:
Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, InputOTP, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toaster, Toggle, ToggleGroup, Tooltip

---

## 12. Template Engine (Complete)

### Template Functions Map

Each template function takes project data and returns a string of generated content.

#### Config Templates

| Function | File | Output Path | Description |
|----------|------|-------------|-------------|
| `generateClaudeMd(project, modules)` | `claude-md.ts` | `.claude/CLAUDE.md` | Primary agent instructions (190 lines) |
| `generateAgentsMd(project)` | `agents-md.ts` | `AGENTS.md` | Multi-agent coordination config |
| `generateCodeStyleRules(stack)` | `rules-files.ts` | `.claude/rules/code-style.md` | Code style conventions |
| `generateDatabaseRules()` | `rules-files.ts` | `.claude/rules/database.md` | Database conventions |
| `generateArchitectureRules()` | `rules-files.ts` | `.claude/rules/architecture.md` | Architecture patterns |
| `generateTaskProcessRules()` | `rules-files.ts` | `.claude/rules/task-process.md` | Task protocol rules |
| `generateTestingRules()` | `rules-files.ts` | `.claude/rules/testing.md` | Testing conventions |

#### Knowledge Templates

| Function | File | Output Path | Description |
|----------|------|-------------|-------------|
| `generateProdMd(project, modules)` | `prod-md.ts` | `knowledge/prod.md` | Master knowledge base (platform atlas) |
| `generatePrdJson(tasks)` | `prd-json.ts` | `knowledge/PRD.json` | Task dependency graph |
| `generatePipelineReference(name)` | `pipeline.ts` | `knowledge/pipeline.md` | Pipeline reference doc |
| `generateSkillFile(module)` | `skill-file.ts` | `knowledge/skills/{slug}/{slug}.skill.md` | Module domain knowledge |
| `generateSharedSkillFile(name, desc)` | `skill-file.ts` | `knowledge/skills/shared/{slug}.skill.md` | Cross-cutting concern |
| `generateAgentSkillFile(name, role, caps, modules)` | `skill-file.ts` | `knowledge/skills/agents/{slug}.skill.md` | AI agent skill |
| `generateSkillIndex(modules, agents, concerns)` | `skill-file.ts` | `knowledge/skills.md` | Skill index manifest |
| `generateDbTool(entity, module, ownerModule)` | `tool-file.ts` | `knowledge/tools/db/{slug}-crud.tool.md` | Database CRUD spec |
| `generateApiTool(name, desc)` | `tool-file.ts` | `knowledge/tools/api/{slug}-api.tool.md` | API endpoint spec |
| `generateUiTool(name, module)` | `tool-file.ts` | `knowledge/tools/ui/{slug}-ui.tool.md` | UI component spec |
| `generateAutomationTool(name, desc)` | `tool-file.ts` | `knowledge/tools/automation/cascade-engine.tool.md` | Automation spec (when >3 modules) |
| `generateToolIndex(db, api, ui, auto)` | `tool-file.ts` | `knowledge/tools.md` | Tool index manifest |
| `generateWorkflowFile(name, module, steps)` | `workflow-file.ts` | `knowledge/workflows/{slug}/{slug}-core.workflow.md` | Module workflow |
| `generateSharedWorkflowFile(name, desc, steps, modules)` | `workflow-file.ts` | `knowledge/workflows/shared/{name}.workflow.md` | Cross-module workflow |
| `generateWorkflowIndex(entries, shared)` | `workflow-file.ts` | `knowledge/workflows.md` | Workflow index manifest |

#### Infrastructure Templates

| Function | File | Output Path | Description |
|----------|------|-------------|-------------|
| `generateTaskSeedSql(tasks)` | `task-seed.ts` | `supabase/migrations/00001_project_tasks.sql` | Migration + task seed SQL |
| `generateAgentCli(supabaseUrl)` | `agent-cli.ts` | `scripts/agent.sh` | Bash CLI for agent task loop |
| `generateAgentTasksFunction()` | `agent-tasks-function.ts` | `supabase/functions/agent-tasks/index.ts` | Portable edge function |

#### UI Code Templates

| Function | File | Output Path | Description |
|----------|------|-------------|-------------|
| `generateUseProjectTasksHook()` | `task-tracker-ui.ts` | `src/hooks/useProjectTasks.ts` | React hook for task CRUD |
| `generateProgressRingComponent()` | `task-tracker-ui.ts` | `src/components/ProgressRing.tsx` | SVG progress ring |
| `generateTaskCardComponent()` | `task-tracker-ui.ts` | `src/components/TaskCard.tsx` | Task display card |
| `generateProjectTasksPage(phases)` | `task-tracker-ui.ts` | `src/pages/ProjectTasksPage.tsx` | Full tracker page |
| `generateRouteRegistration()` | `task-tracker-ui.ts` | `src/routes/project-tracker-route.ts` | Route registration snippet |

#### Strategic Documents

| Function | File | Output Path | Description |
|----------|------|-------------|-------------|
| `generateVisionMd(project)` | `strategic-docs.ts` | `doc/VISION.md` | Product vision document |
| `generateProductMd(project)` | `strategic-docs.ts` | `doc/PRODUCT.md` | Product requirements |
| `generateSpecMd(project)` | `strategic-docs.ts` | `doc/SPEC.md` | V1 implementation contract |
| `generateSetupGuide(project)` | `setup-guide.ts` | `SETUP.md` | Deployment guide |

#### WAT Patterns & Operational Docs

| Function | File | Output Path | Description |
|----------|------|-------------|-------------|
| `generateIntegrationChecklist(project)` | `integration-checklist.ts` | `knowledge/integration-checklist.md` | Integration checklist |
| `generateAgentSpec(project)` | `agent-spec.ts` | `knowledge/agent-spec.md` | Agent specification |
| `generateHumanInTheLoop(project)` | `wat-patterns.ts` | `knowledge/human-in-the-loop.md` | Human-in-the-loop patterns |
| `generateErrorRecovery(project)` | `wat-patterns.ts` | `knowledge/error-recovery.md` | Error recovery protocols |
| `generateLearningOptimization(project)` | `wat-patterns.ts` | `knowledge/learning-optimization.md` | Learning/optimization patterns |
| `generateDesignSystemSkill(project)` | `design-system.ts` | `.claude/skills/design-guide/SKILL.md` | Design system skill |

---

## 13. The Generation Orchestrator

**File**: `src/lib/generate-from-templates.ts` (768 lines)

This is the heart of VibePM. It calls every template generator in the correct order.

### Orchestration Flow

```
generateConfigFromTemplates(analysis, tasks)
│
├── 1. extractModules(analysis) → Module[]
├── 2. computeKnowledgePaths(analysis, modules) → string[]
├── 3. reconcileWatReferences(tasks, paths, modules, entities) → tasks with fixed refs
├── 4. buildProjectForTemplates(analysis, reconciledTasks) → Project
│
├── SECTION 1: Agent Instructions & Rules (7 files)
│   ├── .claude/CLAUDE.md
│   ├── AGENTS.md
│   └── .claude/rules/*.md (5 files)
│
├── SECTION 2: Master References (3 files)
│   ├── knowledge/prod.md
│   ├── knowledge/PRD.json
│   └── knowledge/pipeline.md
│
├── SECTION 3: Skills (N files)
│   ├── knowledge/skills/shared/{concern}.skill.md (per shared concern)
│   ├── knowledge/skills/{module}/{module}.skill.md (per module)
│   ├── knowledge/skills/agents/{agent}.skill.md (per AI agent)
│   └── knowledge/skills.md (index)
│
├── SECTION 4: Tools (N files)
│   ├── knowledge/tools/db/{entity}-crud.tool.md (per entity)
│   ├── knowledge/tools/api/{module}-api.tool.md (per module)
│   ├── knowledge/tools/ui/{module}-ui.tool.md (per module)
│   ├── knowledge/tools/automation/cascade-engine.tool.md (if >3 modules)
│   └── knowledge/tools.md (index)
│
├── SECTION 5: Workflows (N files)
│   ├── knowledge/workflows/{module}/{module}-core.workflow.md (per module)
│   ├── knowledge/workflows/shared/onboarding.workflow.md (if ≥2 modules)
│   ├── knowledge/workflows/shared/data-cascade.workflow.md (if ≥2 modules)
│   └── knowledge/workflows.md (index)
│
├── SECTION 6: Database & Tasks (1 file)
│   └── supabase/migrations/00001_project_tasks.sql
│
├── SECTION 7: Tracker UI Code (5 files)
│   ├── src/hooks/useProjectTasks.ts
│   ├── src/components/ProgressRing.tsx
│   ├── src/components/TaskCard.tsx
│   ├── src/pages/ProjectTasksPage.tsx
│   └── src/routes/project-tracker-route.ts
│
├── SECTION 8: WAT Patterns (5 files)
│   ├── knowledge/integration-checklist.md
│   ├── knowledge/agent-spec.md
│   ├── knowledge/human-in-the-loop.md
│   ├── knowledge/error-recovery.md
│   └── knowledge/learning-optimization.md
│
├── SECTION 9: Strategic Docs (3 files)
│   ├── doc/VISION.md
│   ├── doc/PRODUCT.md
│   └── doc/SPEC.md
│
├── SECTION 10: Skills (1 file)
│   └── .claude/skills/design-guide/SKILL.md
│
└── SECTION 11: Agent Runtime (1 file)
    └── scripts/agent.sh
```

### File Count Formula

For a project with M modules, E entities, C shared concerns, A agents:
- Fixed files: 7 (instructions) + 3 (master refs) + 1 (migration) + 5 (tracker UI) + 5 (WAT patterns) + 3 (strategic docs) + 1 (design skill) + 1 (agent CLI) = **26 fixed**
- Skill files: C + M + A + 1 (index)
- Tool files: E + M (API) + M (UI) + 1 (index) + (1 if M > 3)
- Workflow files: M + 1 (index) + (2 if M ≥ 2)

**Typical**: 30-60 files for a 5-10 module project

---

## 14. Agent Runtime System

### The Agent Task Loop

```
Agent starts (Claude Code, Cursor, etc.)
    │
    ├── 1. Read .claude/CLAUDE.md
    ├── 2. Call: ./scripts/agent.sh next
    │       → POST /functions/v1/agent-tasks { action: "next", agent_id: "claude-code" }
    │       → Returns highest-priority pending task with all deps completed
    │
    ├── 3. Call: ./scripts/agent.sh claim P01-03
    │       → Atomic claim (WHERE status='pending') — race-safe
    │
    ├── 4. Load wat_references[]
    │       → Read each knowledge file for domain context
    │
    ├── 5. Do the work
    │       → Implement the task
    │
    ├── 6. Verify: npx tsc --noEmit && npm run build
    │
    ├── 7. Call: ./scripts/agent.sh complete P01-03
    │       → Awards XP, calculates level
    │
    └── 8. Loop → Go to step 2
```

### Budget Controls

```typescript
// Agent registration includes budget:
{
  agent_id: "claude-code",
  budget_monthly_cents: 5000,      // $50/month cap
  heartbeat_interval_sec: 300      // 5-minute heartbeats
}

// Budget enforcement happens at:
// - next: Rejects if spent >= budget
// - claim: Rejects if spent >= budget
// Budget resets monthly via budget_reset_at timestamp
```

### Multi-Agent Coordination

```
Agent A (claude-code): assigned_to = 'claude-code'
Agent B (agent-2):     assigned_to = 'agent-2'

Both query the SAME project_tasks table.
Each filters by assigned_to.
Cross-agent dependencies resolved via dependencies[] array.
```

---

## 15. Export System

### What Gets Exported

```typescript
// src/pages/ProjectExport.tsx
const allFiles = useMemo(() => {
  const files = [...project.generatedFiles];   // 30-60 orchestrator files
  
  files.push({ path: "SETUP.md", content: generateSetupGuide(project) });
  
  if (project.tasks.length > 0) {
    files.push({ path: "tasks/tasks.json", content: JSON.stringify(project.tasks, null, 2) });
  }
  
  files.push({ path: "supabase/functions/agent-tasks/index.ts", content: generateAgentTasksFunction() });
  
  return files;
}, [project]);
```

### ZIP Generation

```typescript
const zip = new JSZip();
for (const file of allFiles) {
  zip.file(file.path, file.content);
}
const blob = await zip.generateAsync({ type: "blob" });
// Trigger download
```

### Export → Deploy Flow

1. User downloads ZIP from VibePM
2. Unzips into a new project folder
3. Reads `SETUP.md` for instructions:
   - Create Supabase project
   - Run migration: `supabase db push`
   - Deploy edge function: `supabase functions deploy agent-tasks`
   - Set environment variables
   - Open in VS Code with Claude Code
4. Claude Code reads `.claude/CLAUDE.md` and starts the task loop

---

## 16. Gamification System

### XP Levels

```typescript
const GAMIFICATION_LEVELS = [
  { level: 1,  title: 'Apprentice',    xpRequired: 0,     badge: '🔰' },
  { level: 2,  title: 'Builder',       xpRequired: 100,   badge: '🔨' },
  { level: 3,  title: 'Craftsman',     xpRequired: 250,   badge: '⚒️' },
  { level: 4,  title: 'Engineer',      xpRequired: 500,   badge: '⚙️' },
  { level: 5,  title: 'Specialist',    xpRequired: 800,   badge: '🎯' },
  { level: 6,  title: 'Expert',        xpRequired: 1200,  badge: '💎' },
  { level: 7,  title: 'Master',        xpRequired: 1700,  badge: '🏆' },
  { level: 8,  title: 'Visionary',     xpRequired: 2300,  badge: '🔮' },
  { level: 9,  title: 'Architect',     xpRequired: 3000,  badge: '🏛️' },
  { level: 10, title: 'Legend',        xpRequired: 4000,  badge: '👑' },
  { level: 11, title: 'Titan',         xpRequired: 5500,  badge: '⚡' },
  { level: 12, title: 'Transcendent',  xpRequired: 7000,  badge: '🌟' },
  { level: 13, title: 'Mythic',        xpRequired: 8500,  badge: '🐉' },
  { level: 14, title: 'Eternal',       xpRequired: 10000, badge: '♾️' },
  { level: 15, title: 'Ascended',      xpRequired: 12000, badge: '🌌' },
];
```

### XP Awards

| Task Complexity | XP Reward |
|----------------|-----------|
| Simple | 15 |
| Medium | 25 |
| Complex | 35 |
| Epic | 50 |

### XP Calculation

- Stored in `project.xp.current` (localStorage)
- Also calculated from completed tasks in Supabase
- Level = highest level where `xpRequired <= currentXP`
- Progress to next level shown as percentage bar

---

## 17. Rebuild Instructions

### Phase 1: Foundation (Days 1-2)

1. **Scaffold project**
   ```bash
   npm create vite@latest vibepm -- --template react-ts
   cd vibepm
   ```

2. **Install dependencies**
   ```bash
   npm install @supabase/supabase-js @tanstack/react-query react-router-dom framer-motion jszip zod react-hook-form @hookform/resolvers recharts sonner next-themes
   npx shadcn-ui@latest init
   ```

3. **Set up Tailwind** with the design tokens from Section 10

4. **Create types** (`src/types/project.ts`) — all interfaces from Section 9

5. **Create store** (`src/lib/store.ts`) — localStorage CRUD (91 lines)

6. **Create Supabase client** and connect project

### Phase 2: Database (Day 2)

1. Create `project_tasks` table with schema from Section 6
2. Create `project_levels` table and seed 15 levels
3. Set up RLS policies (currently wide open — add user_id scoping for production)

### Phase 3: Templates (Days 3-5)

Build all 19 template files in `src/templates/`. Each is a pure function:
`(projectData) → string`

Start with:
1. `claude-md.ts` — the core agent instructions
2. `rules-files.ts` — 5 coding convention generators
3. `skill-file.ts`, `tool-file.ts`, `workflow-file.ts` — knowledge file generators
4. `prod-md.ts` — master knowledge base
5. `prd-json.ts` — dependency graph
6. `task-seed.ts` — SQL migration generator
7. `task-tracker-ui.ts` — React component generators
8. Remaining templates

### Phase 4: Orchestrator (Day 5)

Build `src/lib/generate-from-templates.ts` — the 768-line orchestrator that:
1. Extracts modules from analysis
2. Computes all knowledge file paths
3. Reconciles AI-generated wat_references
4. Calls every template generator
5. Returns array of `{ path, content }`

### Phase 5: AI Edge Function (Day 6)

Deploy `generate-project` edge function with:
1. `analyze` action — system prompt for project analysis
2. `generate-tasks` action — system prompt for task generation
3. JSON response parsing with markdown code block stripping

### Phase 6: Pages (Days 7-10)

Build pages in this order:
1. `Projects.tsx` — project list
2. `NewProject.tsx` — 4-step wizard (most complex page)
3. `ProjectDashboard.tsx` — project detail with tabs
4. `ProjectTasks.tsx` — Kanban board
5. `ProjectTracker.tsx` — full tracker with sync
6. `ProjectKnowledge.tsx` — file browser
7. `ProjectExport.tsx` — file browser + ZIP download
8. `Landing.tsx` — public landing page

### Phase 7: Agent Runtime (Days 11-12)

1. Deploy `agent-tasks` edge function (1,787 lines)
2. Build `useAgentRuntime.ts` hooks
3. Create remaining agent-related database tables

### Phase 8: Polish (Days 13-14)

1. Add animations (Framer Motion)
2. Landing page design
3. Error handling
4. Test suite

---

## 18. Known Issues & Fixes

### Issue 1: seedTasks Missing project_id in ProjectDashboard

**File**: `src/pages/ProjectDashboard.tsx` line 48
**Bug**: The `handleSeedToTracker` function maps tasks but never includes `project_id`
**Fix**: Add `project_id: id` to the mapped task object

### Issue 2: useProjectTasks seedTasks Missing project_id

**File**: `src/hooks/useProjectTasks.ts` line 184
**Bug**: The `seedTasks` upsert mapping doesn't include `project_id`
**Fix**: Add `project_id: t.project_id || projectId` to the upsert mapping, and pass `projectId` through the dependency array

### Issue 3: Landing Page Not Mounted

**File**: `src/App.tsx`
**Status**: The `Landing.tsx` component exists (553 lines) but is not in the route table. Root `/` shows `Projects` directly.

### Issue 4: Auth Not Implemented

**Status**: No `ProtectedRoute` component in the current router. The `useAuth` hook and auth page referenced in CLAUDE.md knowledge don't exist in the current codebase. All routes are public.

### Issue 5: Agent Runtime Tables Not Created

**Status**: The `agent-tasks` edge function references tables (`agents`, `heartbeat_runs`, `run_logs`, `cost_events`, `activity_log`, `task_comments`, `wakeup_requests`, `config_revisions`) that don't exist in the current database schema. The edge function will fail for agent-related actions until these tables are created.

---

## Appendix A: AI System Prompts

### Analyze Prompt

```
You are VibePM, an AI that analyzes raw project ideas and extracts structured project definitions following the WAT (Workflows, Agents, Tools) framework.

Given a brain dump of project ideas, extract:
1. A clear project name and description
2. The tech stack
3. All domain entities (database tables/models)
4. All modules (feature areas with routes, entities, CRUD actions, archetype)
5. Development phases
6. Shared/cross-cutting concerns
7. AI Agents (if any)
8. Key Workflow Families

Return JSON with: projectName, description, stack, entities[], sharedConcerns[], agents[], workflowFamilies[], modules[], phases[]
```

### Generate Tasks Prompt

```
You are VibePM's task generator. Given a project analysis, generate a complete task list.

TASK FORMAT:
- task_code: P{phase}-{seq} (zero-padded)
- title: Short imperative description
- phase: "phase{N}"
- category: feature | infra | ai | ui | orchestration
- assigned_to: "claude-code"
- priority: 1-100
- xp_reward: 15 (simple) to 50 (epic)
- dependencies: task_code[]
- wat_references: knowledge file paths[]

RULES:
- Phase 1: setup, schema, auth, shared infrastructure
- Each module needs: schema task, CRUD task, UI task
- Dependencies form valid DAG (no cycles)
- 15-60 tasks depending on complexity
```

---

## Appendix B: The WAT Framework

```
WAT FRAMEWORK
=============

┌─────────────────────────────────────────────────────┐
│  SKILLS (Foundation Layer)                           │
│  Domain knowledge: entities, rules, terminology     │
│  → WHAT to build                                    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  WORKFLOWS (Process Layer)                   │    │
│  │  Multi-step procedures: triggers, steps      │    │
│  │  → WHEN things happen                        │    │
│  │                                              │    │
│  │  ┌─────────────────────────────────────┐     │    │
│  │  │  TOOLS (Execution Layer)            │     │    │
│  │  │  Atomic operations: CRUD, API, UI   │     │    │
│  │  │  → HOW to build                     │     │    │
│  │  └─────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘

AGENTS (Orchestration Layer)
Tasks, dependencies, priorities, budget, heartbeats
→ WHO builds and in what order
```

### File Type Contracts

| Type | Format | Key Sections |
|------|--------|-------------|
| **Skill** | YAML frontmatter + markdown | Domain, Entities, Decision Trees, Terminology |
| **Tool** | 4-aspect format | Input, Process, Output, Errors |
| **Workflow** | 5-section steps | Action, Tool, Input, Output, Failure |

---

## Appendix C: Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | `.env` (auto) | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` (auto) | Supabase anon key |
| `LOVABLE_API_KEY` | Supabase secret | AI gateway authentication |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret | Server-side DB access |
| `SUPABASE_URL` | Supabase secret | Used by edge functions |

---

*Document generated from VibePM source code. Last updated: 2026-03-11.*
