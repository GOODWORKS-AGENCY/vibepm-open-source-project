**\# Master Pipeline — Complete System Hierarchy Template**

\> **\*\*This is the keystone document.\*\*** It shows how every system in the AI development framework connects — from raw vision documents through knowledge files, agent instructions, task database, and the agent session protocol. Every other template in this library covers one piece; this template shows the complete pipeline in chronological order with explicit dependencies. Drop this into any project to give agents (and humans) the full operational map.

\---

**\#\# Table of Contents**

1\. \[What Is the Master Pipeline?\](\#1-what-is-the-master-pipeline)  
2\. \[The Complete Hierarchy\](\#2-the-complete-hierarchy)  
3\. \[Phase A: Knowledge Creation\](\#3-phase-a-knowledge-creation)  
4\. \[Phase B: Project Infrastructure\](\#4-phase-b-project-infrastructure)  
5\. \[Phase C: Per-Phase Lifecycle\](\#5-phase-c-per-phase-lifecycle)  
6\. \[Phase D: Agent Session Protocol\](\#6-phase-d-agent-session-protocol)  
7\. \[The File Dependency Graph\](\#7-the-file-dependency-graph)  
8\. \[Navigation Order for Agents\](\#8-navigation-order-for-agents)  
9\. \[The wat\_references Bridge\](\#9-the-wat\_references-bridge)  
10\. \[System Creation Timeline\](\#10-system-creation-timeline)  
11\. \[System Maintenance Protocol\](\#11-system-maintenance-protocol)  
12\. \[Connection to Each Template\](\#12-connection-to-each-template)  
13\. \[Sizing Guide\](\#13-sizing-guide)  
14\. \[Examples\](\#14-examples)  
15\. \[Validation Checklist\](\#15-validation-checklist)  
16\. \[Quick Reference Card\](\#16-quick-reference-card)

\---

**\#\# 1\. What Is the Master Pipeline?**

The Master Pipeline is the **\*\*complete operational map\*\*** of how an AI-driven development project works, from the first rough idea to an agent autonomously building features. It answers: "In what order does everything happen, and how does each piece connect to the others?"

**\#\#\# The Problem**

You have 11+ systems that must work together:

\`\`\`  
Raw ideas → Consolidated docs → Knowledge files → Indexes → prod.md → PRD.json  
→ CLAUDE.md → Rules files → Task database → Task seeding → Tracker UI  
→ Agent session → Task pickup → Knowledge loading → Building → Verification  
\`\`\`

Without a pipeline document, agents and humans don't know:  
\- What comes first and what depends on what  
\- Where to find information at each stage  
\- What to update when something changes  
\- How the task database connects to knowledge files  
\- What an agent actually does when it starts a session

**\#\#\# The Four Phases**

The pipeline operates in **\*\*four phases\*\***, each with a different frequency:

| Phase | Name | When | Frequency | Output |  
|-------|------|------|-----------|--------|  
| **\*\*A\*\*** | Knowledge Creation | Project start | Once (then maintained) | 128+ knowledge files, indexes, prod.md, PRD.json |  
| **\*\*B\*\*** | Project Infrastructure | Project start | Once | CLAUDE.md, rules, task DB, tracker UI, app scaffold |  
| **\*\*C\*\*** | Per-Phase Lifecycle | Each development phase | 7-18 times per project | Phase plan, task migration, knowledge updates, completion migration |  
| **\*\*D\*\*** | Agent Session Protocol | Every work session | 100-500+ times per project | Features built, tasks completed, code verified |

**\*\*Phase A\*\*** and **\*\*B\*\*** happen once at the start. **\*\*Phase C\*\*** repeats for each development phase. **\*\*Phase D\*\*** repeats for every single task an agent picks up.

\---

**\#\# 2\. The Complete Hierarchy**

**\#\#\# The 25-Step Pipeline**

\`\`\`  
THE COMPLETE AI DEVELOPMENT PIPELINE  
═════════════════════════════════════

PHASE A: KNOWLEDGE CREATION (one-time, project start)  
──────────────────────────────────────────────────────  
Step 1   Raw Vision Documents  
         └─ User writes rough ideas, feature lists, entity descriptions  
         └─ Input: Brain → Output: Rough Ideas folder (3-8 documents)

Step 2   Consolidation into 3 Canonical References  
         └─ Merge overlapping docs, resolve conflicts, standardize terms  
         └─ Input: Rough Ideas → Output: Architecture Spec \+ Current State \+ Domain Encyclopedia

Step 3   Knowledge File Generation (Skills → Tools → Workflows)  
         └─ Extract structured files from consolidated docs  
         └─ Input: 3 canonical refs → Output: 40+ skill files, 44+ tool files, 39+ workflow files  
         └─ ORDER MATTERS: Skills first, then Tools, then Workflows

Step 4   Index Generation  
         └─ Auto-generate catalogs by scanning directories  
         └─ Input: knowledge/\*/ directories → Output: skills.md, tools.md, workflows.md

Step 5   Master Reference (prod.md)  
         └─ Compress entire knowledge base into one loadable document  
         └─ Input: All knowledge files → Output: prod.md (under 700 lines)

Step 6   Dependency Graph (PRD.json)  
         └─ Define task DAG with priorities, dependencies, file scopes  
         └─ Input: Module list \+ dependency analysis → Output: PRD.json

PHASE B: PROJECT INFRASTRUCTURE (one-time, project start)  
─────────────────────────────────────────────────────────  
Step 7   Agent Instructions (CLAUDE.md \+ AGENTS.md)  
         └─ Tell agents how to navigate the project  
         └─ Input: Project structure \+ knowledge/ paths → Output: .claude/CLAUDE.md, AGENTS.md  
         └─ CLAUDE.md is AUTO-LOADED every session

Step 8   Convention Rules (.claude/rules/\*.md)  
         └─ Coding standards, database patterns, architecture rules  
         └─ Input: Tech decisions \+ patterns → Output: 5-6 rule files  
         └─ code-style.md, database.md, architecture.md, testing.md, ai-agents.md, task-process.md

Step 9   Task Database Schema  
         └─ Create project\_tasks \+ project\_levels tables  
         └─ Input: Schema design → Output: SQL migration (e.g., 00005\_project\_tasks.sql)  
         └─ project\_tasks has: task\_code, status, priority, dependencies, wat\_references

Step 10  Task Seeding (Initial Migration)  
         └─ Seed 50-200 tasks into DB with wat\_references pointing to knowledge files  
         └─ Input: PRD.json \+ knowledge file paths → Output: SQL migration with INSERT statements  
         └─ THIS IS THE BRIDGE: task rows → wat\_references → knowledge files

Step 11  Project Tracker UI  
         └─ Build dashboard for humans to see progress  
         └─ Input: project\_tasks table → Output: /project-tracker route with phase filters

Step 12  Application Scaffolding  
         └─ Initialize project (Vite \+ React \+ TS \+ dependencies)  
         └─ Input: Tech stack decisions → Output: package.json, tsconfig, configs

PHASE C: PER-PHASE LIFECYCLE (repeated 7-18 times)  
──────────────────────────────────────────────────  
Step 13  Define Phase Tasks  
         └─ Plan the phase in a .claude/plans/ markdown file  
         └─ Input: What to build next → Output: Plan file with task table

Step 14  Create Task Seeding Migration  
         └─ Write SQL INSERT for new tasks with wat\_references  
         └─ Input: Plan file → Output: supabase/migrations/000XX\_phaseN.sql

Step 15  Push Migration  
         └─ Execute: npx supabase db push  
         └─ Input: Migration file → Output: Tasks in database

Step 16  Update Project Tracker UI  
         └─ Add new phase to PHASES array in ProjectTasksPage.tsx  
         └─ Input: Phase name → Output: Phase appears in dropdown

Step 17  Create Knowledge Files (if needed)  
         └─ New modules need skill files, new entities need tool files  
         └─ Input: Task requirements → Output: New .skill.md / .tool.md / .workflow.md files  
         └─ RULE: If wat\_references is empty, no knowledge file needed

Step 18  Work the Tasks  
         └─ Agents pick up tasks and build features (→ triggers Phase D)  
         └─ Input: Pending tasks → Output: Completed features

Step 19  Create Completion Migration  
         └─ Mark all phase tasks as completed in DB  
         └─ Input: Phase task list → Output: supabase/migrations/000XX\_mark\_phaseN\_complete.sql

PHASE D: AGENT SESSION PROTOCOL (repeated 100-500+ times)  
─────────────────────────────────────────────────────────  
Step 20  Agent Starts → CLAUDE.md Auto-Loaded  
         └─ Agent reads CLAUDE.md \+ .claude/rules/\* automatically  
         └─ Input: Session start → Output: Agent has conventions, project structure, task protocol

Step 21  Query for Next Task  
         └─ SELECT task\_code, priority, dependencies, wat\_references  
            FROM project\_tasks WHERE status \= 'pending'  
            ORDER BY priority DESC LIMIT 1;  
         └─ Mark task as in\_progress

Step 22  Load Knowledge Files via wat\_references  
         └─ Read the skill/tool/workflow files listed in the task's wat\_references array  
         └─ Input: wat\_references array → Output: Agent has domain knowledge for this task

Step 23  Build the Feature  
         └─ Follow .claude/rules/\* conventions (code-style, database, architecture)  
         └─ Create/modify files listed in the task scope  
         └─ Input: Knowledge \+ conventions → Output: Implementation

Step 24  Verify with Test Command  
         └─ Run the test\_command (tsc \--noEmit → npm run build → test suite)  
         └─ Input: Built feature → Output: Pass/fail verification

Step 25  Mark Complete → Pick Next Task  
         └─ UPDATE project\_tasks SET status \= 'completed', completed\_at \= now()  
         └─ Return to Step 21 (pick next task)  
\`\`\`

**\#\#\# Dependency Chain**

\`\`\`  
WHAT DEPENDS ON WHAT  
═════════════════════

Step 1 (Raw Ideas) ────────────────────────────────────────── no dependencies  
  │  
  ▼  
Step 2 (Consolidation) ──────────────────────────────────── depends on Step 1  
  │  
  ▼  
Step 3 (Knowledge Files) ────────────────────────────────── depends on Step 2  
  │  
  ├──→ Step 4 (Indexes) ─────────────────────────────────── depends on Step 3  
  ├──→ Step 5 (prod.md) ─────────────────────────────────── depends on Steps 3+4  
  └──→ Step 6 (PRD.json) ────────────────────────────────── depends on Steps 3+5  
         │  
         ├──→ Step 7 (CLAUDE.md) ──────────── depends on Steps 3-6 (references knowledge/)  
         ├──→ Step 8 (Rules) ──────────────── no knowledge dependency (conventions only)  
         ├──→ Step 9 (Task DB Schema) ─────── no knowledge dependency (infrastructure)  
         ├──→ Step 10 (Task Seeding) ──────── depends on Steps 6+9 (PRD → SQL with wat\_refs)  
         ├──→ Step 11 (Tracker UI) ────────── depends on Step 9 (reads task DB)  
         └──→ Step 12 (App Scaffold) ──────── no knowledge dependency (code setup)  
                │  
                ▼  
         Steps 13-19 (Phase Lifecycle) ────── depends on all of Phase B  
                │  
                ▼  
         Steps 20-25 (Agent Session) ──────── depends on all of Phase B \+ Phase C  
\`\`\`

\---

**\#\# 3\. Phase A: Knowledge Creation**

Phase A transforms raw vision documents into a structured, machine-readable knowledge base. This happens **\*\*once\*\*** at project start and is **\*\*maintained\*\*** as the project evolves.

**\#\#\# Step 1: Raw Vision Documents**

\`\`\`\`markdown  
\<\!-- WHERE: Rough Ideas folder (or any source location)  
     WHO: Product owner, founder, or domain expert  
     WHAT: Unstructured documents describing the platform vision \--\>

Source documents typically include:  
\- Vision/engine document (the "I want to build this" doc)  
\- Module definitions with action lists  
\- Entity descriptions (prose, not structured)  
\- Use cases and workflow examples (10-15 per module)  
\- Industry adaptation notes  
\- UI/UX specifications and layouts

Target: 3-8 documents, 2,000-50,000 total lines depending on project size  
\`\`\`\`

**\#\#\# Step 2: Consolidation**

\`\`\`\`markdown  
\<\!-- WHERE: knowledge/ directory (root level docs)  
     WHO: AI agent (Claude Code) reading all source docs  
     WHAT: Merge overlapping sources into 3 canonical references \--\>

Three canonical references:

1\. ARCHITECTURAL SPECIFICATION  
   └─ Architecture, database catalog, security model, orchestration pipeline  
   └─ Sourced from: technical docs, schema notes, security specs

2\. CURRENT STATE ASSESSMENT  
   └─ Module maturity, system metrics, gaps, build order  
   └─ Sourced from: status docs, audit results, codebase analysis

3\. DOMAIN ENCYCLOPEDIA  
   └─ Module purposes, 15 use cases \+ 15 workflows \+ 15 cascades per module  
   └─ Sourced from: vision docs, use case docs, industry adaptation docs  
\`\`\`\`

**\#\#\# Step 3: Knowledge File Generation**

\`\`\`\`markdown  
\<\!-- WHERE: knowledge/skills/, knowledge/tools/, knowledge/workflows/  
     WHO: AI agent generating structured files from consolidated docs  
     WHAT: 128+ structured .md files following WAT framework \--\>

EXTRACTION ORDER (critical — each layer depends on the previous):

  1\. Shared Skills (7 files)  
     └─ Cross-cutting: orchestration, cascade, auth, audit, multi-tenancy, action-model, terminology  
     └─ Source: Architectural Specification sections 4-7

  2\. Module Skills (33 files)  
     └─ One per module: metadata \+ purpose \+ actions table \+ entity schemas  
     └─ Source: Domain Encyclopedia (purpose) \+ Arch Spec (schemas) \+ Vision Docs (actions)

  3\. DB Tools (24 files)  
     └─ One per major entity: schema \+ CRUD actions with Input/Process/Output/Errors  
     └─ Source: Arch Spec database catalog \+ Vision Doc action definitions

  4\. API Tools (12 files)  
     └─ One per edge function: endpoint \+ processing pipeline \+ actions  
     └─ Source: Arch Spec edge function specs \+ Vision Doc interaction patterns

  5\. UI Tools (5 files) \+ Automation Tools (3 files)  
     └─ Complex interactive components and engines  
     └─ Source: UI/UX Specs \+ Arch Spec cascade engine

  6\. Shared Workflows (4 files)  
     └─ Platform-level processes: canonical pipeline, cascade evaluation, approval, onboarding  
     └─ Source: Arch Spec orchestration pipeline

  7\. Domain Workflows (35 files)  
     └─ Business processes: 3-5 per module, selected from Domain Encyclopedia examples  
     └─ Source: Domain Encyclopedia workflow examples (best 3-5 of 15 per module)  
\`\`\`\`

**\#\#\# Steps 4-6: Indexes, prod.md, PRD.json**

\`\`\`\`markdown  
\<\!-- These are generated AFTER all knowledge files exist \--\>

Step 4: Index files (auto-generated by scanning directories)  
  └─ knowledge/skills.md  — table of all 40 skill files  
  └─ knowledge/tools.md   — table of all 44 tool files (by category)  
  └─ knowledge/workflows.md — table of all 39 workflow files

Step 5: Master reference (compressed from all knowledge files)  
  └─ knowledge/prod.md — under 700 lines covering all modules  
  └─ Part 1: Platform Overview (architecture, module map, pipeline)  
  └─ Parts 2-N: Module entries (6-10 lines each)  
  └─ Parts N+1-4: Workflow families, schema overview, risk levels, file reference

Step 6: Dependency graph (machine-readable task DAG)  
  └─ knowledge/PRD.json — 50-200 tasks with dependencies, priorities, file scopes  
  └─ Each task has: id, description, priority, dependencies, blockedBy,  
     category, files, test\_command, model, assignee  
\`\`\`\`

\---

**\#\# 4\. Phase B: Project Infrastructure**

Phase B sets up the systems that agents use during development. This happens **\*\*once\*\*** at project start.

**\#\#\# Step 7: Agent Instructions**

\`\`\`\`markdown  
\<\!-- WHERE: .claude/CLAUDE.md (auto-loaded) \+ AGENTS.md (for secondary agents)  
     CRITICAL: CLAUDE.md is loaded into context at the START of every session \--\>

CLAUDE.md must contain:  
  \- Project overview (stack, architecture)  
  \- Key commands (dev, build, lint, type-check)  
  \- Task tracking protocol (query → work → mark complete)  
  \- Project structure (directory tree)  
  \- Knowledge base structure (knowledge/ directory tree)  
  \- Loading instructions: WHEN to load WHICH knowledge file  
  \- Module map (all modules with routes)

AGENTS.md (for secondary agents like Codex):  
  \- Role definition (what this agent specializes in)  
  \- Task tracking protocol (same as CLAUDE.md)  
  \- Connection details (Supabase project ref, credentials)  
  \- Key commands  
  \- Simplified project structure

THE KEY SECTION IN CLAUDE.md:  
\`\`\`markdown  
**\#\# Knowledge Base**  
Domain knowledge is in \`knowledge/\`. Load relevant files based on task:  
\- @knowledge/prod.md — Full domain reference (all N modules)  
\- @knowledge/skills.md — Skill index  
\- @knowledge/tools.md — Tool index  
\- @knowledge/workflows.md — Workflow index

**\#\#\# Loading by task type:**  
\- **\*\*Working on a specific module\*\***: Load \`knowledge/skills/\[module\]/\[module\].skill.md\`  
\- **\*\*Implementing CRUD\*\***: Load \`knowledge/tools/db/\[entity\]-crud.tool.md\`  
\- **\*\*Building an edge function\*\***: Load \`knowledge/tools/api/\[function\].tool.md\`  
\- **\*\*Implementing a workflow\*\***: Load \`knowledge/workflows/\[module\]/\[workflow\].workflow.md\`  
\`\`\`  
\`\`\`\`

**\#\#\# Step 8: Convention Rules**

\`\`\`\`markdown  
\<\!-- WHERE: .claude/rules/\*.md (auto-loaded alongside CLAUDE.md)  
     THESE define HOW to write code, not WHAT to build \--\>

Standard rule files:

  code-style.md        TypeScript conventions, naming, imports, component patterns  
  database.md          PostgreSQL patterns, RLS, indexes, migrations, common columns  
  architecture.md      Feature-first organization, data flow, shell modes, routing  
  testing.md           Test strategy, what to test, what not to test, RLS testing  
  ai-agents.md         AI agent conventions, canonical pipeline, risk levels, safety rules  
  task-process.md      Task protocol, phase management, knowledge file creation rules

Rule files are CONVENTIONS (style, patterns, standards).  
Knowledge files are DOMAIN (entities, actions, schemas, workflows).  
CLAUDE.md is the BRIDGE — it references both.  
\`\`\`\`

**\#\#\# Steps 9-12: Task System \+ App Scaffold**

\`\`\`\`markdown  
Step 9: Task Database Schema  
  └─ Migration: CREATE TABLE project\_tasks (...)  
  └─ Critical columns: task\_code, status, priority, dependencies, wat\_references  
  └─ Also: project\_levels for gamification (XP \+ levels)  
  └─ RLS enabled, indexes on phase/status/priority

Step 10: Task Seeding  
  └─ Migration: INSERT INTO project\_tasks (...) VALUES (...)  
  └─ Each task row includes:  
     \- task\_code: 'P1-01', 'P2-05', etc.  
     \- priority: 1-100 (global, unique)  
     \- dependencies: ARRAY\['P1-04'\] (what must complete first)  
     \- wat\_references: ARRAY\['knowledge/skills/members/members.skill.md'\]  
       ↑ THIS IS THE BRIDGE between task DB and knowledge files

Step 11: Project Tracker UI  
  └─ React page at /project-tracker  
  └─ Phase dropdown, status filter, agent filter  
  └─ ProgressDashboard (XP, level, stats)  
  └─ TaskCard components with status change controls

Step 12: Application Scaffolding  
  └─ Vite \+ React \+ TypeScript \+ dependencies  
  └─ shadcn/ui components, Tailwind, Supabase client  
  └─ Directory structure (src/features/, src/pages/, etc.)  
\`\`\`\`

\---

**\#\# 5\. Phase C: Per-Phase Lifecycle**

Phase C is the **\*\*repeatable loop\*\*** for adding new development phases. It runs 7-18 times over the life of a project.

**\#\#\# The 7-Step Phase Loop**

\`\`\`  
PHASE LIFECYCLE (Steps 13-19)  
══════════════════════════════

Step 13: PLAN → Write .claude/plans/phaseN.md  
  │               Define tasks, priorities, dependencies,  
  │               knowledge file requirements  
  │  
  ▼  
Step 14: SEED → Write supabase/migrations/000XX\_phaseN.sql  
  │               INSERT task rows with wat\_references  
  │               ON CONFLICT DO UPDATE (idempotent)  
  │  
  ▼  
Step 15: PUSH → Run npx supabase db push  
  │               Tasks now live in database  
  │  
  ▼  
Step 16: UI → Update ProjectTasksPage.tsx PHASES array  
  │               Phase appears in tracker dropdown  
  │  
  ▼  
Step 17: KNOWLEDGE → Create new skill/tool/workflow files  
  │                    Only if new modules or entities  
  │                    Update indexes (skills.md, tools.md, workflows.md)  
  │  
  ▼  
Step 18: WORK → Agents execute tasks (→ Phase D loop)  
  │               Each task picked up, built, verified, completed  
  │  
  ▼  
Step 19: CLOSE → Write supabase/migrations/000XX\_mark\_phaseN\_complete.sql  
                   ON CONFLICT DO UPDATE SET status \= 'completed'  
                   Phase is done  
\`\`\`

**\#\#\# When to Create Knowledge Files (Step 17\)**

| Task Type | Knowledge Files Needed | Example |  
|-----------|----------------------|---------|  
| New module | Skill file \+ DB tool files \+ 2-4 workflow files | Adding a "Billing" module |  
| New entity in existing module | DB tool file | Adding \`subscriptions\` table to Billing |  
| New edge function | API tool file | Adding \`process-payment\` function |  
| New business process | Workflow file | Adding \`subscription-renewal\` workflow |  
| UI-only work | None | Restyling the dashboard |  
| Refactoring | None | Moving files, renaming functions |  
| Bug fixes | None | Fixing a query, patching a component |

**\*\*Rule\*\***: If a task's \`wat\_references\` array is empty, no knowledge file is needed.

\---

**\#\# 6\. Phase D: Agent Session Protocol**

Phase D is what happens **\*\*every time an agent starts a work session\*\***. This is the most frequently executed phase (100-500+ times per project).

**\#\#\# The Agent Loop (Steps 20-25)**

\`\`\`  
AGENT SESSION PROTOCOL  
═══════════════════════

Step 20: SESSION START  
  │  
  │  CLAUDE.md is AUTO-LOADED into context  
  │  .claude/rules/\*.md are AUTO-LOADED into context  
  │  
  │  Agent now knows:  
  │  ├── Project structure (directories, routes, modules)  
  │  ├── Coding conventions (TypeScript, database, architecture)  
  │  ├── Task protocol (query → work → verify → complete)  
  │  ├── Knowledge loading instructions (which files for which tasks)  
  │  └── Current phase and project history  
  │  
  ▼  
Step 21: QUERY FOR NEXT TASK  
  │  
  │  \`\`\`sql  
  │  SELECT task\_code, title, priority, dependencies, wat\_references  
  │  FROM project\_tasks  
  │  WHERE status \= 'pending'  
  │    AND assigned\_to \= '{{agent-name}}'  
  │  ORDER BY priority DESC  
  │  LIMIT 1;  
  │  \`\`\`  
  │  
  │  Then mark it in\_progress:  
  │  \`\`\`sql  
  │  UPDATE project\_tasks  
  │  SET status \= 'in\_progress', started\_at \= now()  
  │  WHERE task\_code \= '{{task\_code}}';  
  │  \`\`\`  
  │  
  │  Agent now knows:  
  │  ├── WHAT to build (title \+ description)  
  │  ├── WHAT blocks it (dependencies)  
  │  └── WHERE to find domain knowledge (wat\_references)  
  │  
  ▼  
Step 22: LOAD KNOWLEDGE FILES  
  │  
  │  Read each file in the task's wat\_references array:  
  │  
  │  Example task row:  
  │    task\_code: 'P2-04'  
  │    wat\_references: \[  
  │      'knowledge/skills/members/members.skill.md',  
  │      'knowledge/workflows/members/new-member-welcome.workflow.md'  
  │    \]  
  │  
  │  Agent loads these files → now has:  
  │  ├── Entity schemas (field names, types, constraints)  
  │  ├── Available actions (what operations this module supports)  
  │  ├── Workflow steps (what order things happen)  
  │  ├── Tool specs (Input/Process/Output/Errors for each action)  
  │  └── Cross-module dependencies (what other modules to wire up)  
  │  
  ▼  
Step 23: BUILD THE FEATURE  
  │  
  │  Following .claude/rules/\* conventions:  
  │  ├── code-style.md → TypeScript patterns, naming, imports  
  │  ├── database.md → RLS, indexes, common columns, snake\_case  
  │  ├── architecture.md → Feature-first organization, query keys, mutations  
  │  ├── ai-agents.md → AI safety, canonical pipeline, risk levels  
  │  └── testing.md → What to test and how  
  │  
  │  Create/modify files in the task's scope:  
  │  ├── Database migrations (supabase/migrations/)  
  │  ├── Hooks and API layer (src/features/{{module}}/hooks/)  
  │  ├── Components (src/features/{{module}}/components/)  
  │  ├── Pages (src/pages/{{module}}/)  
  │  └── Types (src/features/{{module}}/types.ts)  
  │  
  ▼  
Step 24: VERIFY  
  │  
  │  Run the test command (escalates by task type):  
  │  ├── Database tasks: npx supabase db push  
  │  ├── Foundation code: npx tsc \--noEmit  
  │  ├── Module features: npm run build  
  │  ├── Production tasks: npm run test && npm run build  
  │  
  │  If PASS → continue to Step 25  
  │  If FAIL → debug, fix, re-verify (do NOT mark complete)  
  │  
  ▼  
Step 25: MARK COMPLETE → LOOP  
  │  
  │  \`\`\`sql  
  │  UPDATE project\_tasks  
  │  SET status \= 'completed', progress\_pct \= 100, completed\_at \= now()  
  │  WHERE task\_code \= '{{task\_code}}';  
  │  \`\`\`  
  │  
  │  If BLOCKED:  
  │  \`\`\`sql  
  │  UPDATE project\_tasks  
  │  SET status \= 'blocked', notes \= '{{reason}}'  
  │  WHERE task\_code \= '{{task\_code}}';  
  │  \`\`\`  
  │  
  └──→ Return to Step 21 (pick next task)  
\`\`\`

**\#\#\# Multi-Agent Coordination**

When two agents (e.g., Claude Code \+ Codex) work on the same project:

\`\`\`  
MULTI-AGENT TASK FLOW  
═════════════════════

Claude Code queries:  
  WHERE assigned\_to \= 'claude-code' AND status \= 'pending'  
  → Gets: architecture, hooks, UI, AI agent tasks

Codex queries:  
  WHERE assigned\_to \= 'codex' AND status \= 'pending'  
  → Gets: database migrations, RLS, audit triggers, CRUD tasks

Both follow the SAME protocol (Steps 20-25).  
Both read the SAME knowledge files.  
Both update the SAME project\_tasks table.

The task database is the coordination mechanism:  
  \- Codex creates migration → marks P2-01 complete  
  \- Claude Code's dependency check: P2-01 in dependencies?  
    YES and P2-01 is complete → task is unblocked  
    YES and P2-01 is pending → task stays blocked  
\`\`\`

\---

**\#\# 7\. The File Dependency Graph**

This shows **\*\*which files reference which other files\*\*** — the complete cross-reference map.

\`\`\`  
FILE DEPENDENCY GRAPH  
═════════════════════

.claude/CLAUDE.md (auto-loaded every session)  
  │  
  ├── REFERENCES → .claude/rules/task-process.md  
  │                  └── Defines: task protocol, phase lifecycle, DB schema  
  │  
  ├── REFERENCES → .claude/rules/code-style.md  
  │                  └── Defines: TypeScript, naming, component patterns  
  │  
  ├── REFERENCES → .claude/rules/database.md  
  │                  └── Defines: PostgreSQL patterns, RLS, migrations  
  │  
  ├── REFERENCES → .claude/rules/architecture.md  
  │                  └── Defines: Feature-first org, data flow, routing  
  │  
  ├── REFERENCES → .claude/rules/testing.md  
  │                  └── Defines: Test strategy, what/how to test  
  │  
  ├── REFERENCES → .claude/rules/ai-agents.md  
  │                  └── Defines: AI agent conventions, pipeline, risk levels  
  │  
  ├── REFERENCES → knowledge/prod.md  
  │   │              └── Summarizes: ALL modules, entities, workflows  
  │   │  
  │   ├── REFERENCES → knowledge/skills.md (index)  
  │   │                  └── Lists: all 40 skill files  
  │   │  
  │   ├── REFERENCES → knowledge/tools.md (index)  
  │   │                  └── Lists: all 44 tool files  
  │   │  
  │   └── REFERENCES → knowledge/workflows.md (index)  
  │                      └── Lists: all 39 workflow files  
  │  
  └── REFERENCES → knowledge/PRD.json  
                     └── Defines: task DAG with priorities and dependencies

project\_tasks TABLE (in Supabase)  
  │  
  ├── SEEDED FROM → supabase/migrations/000XX\_\*.sql  
  │                   └── SQL INSERT statements with task data  
  │  
  ├── COLUMN: wat\_references → POINTS TO → knowledge/\*\*/\*.md files  
  │   │                          └── The bridge between tasks and knowledge  
  │   │  
  │   ├── knowledge/skills/{{module}}/{{module}}.skill.md  
  │   ├── knowledge/tools/db/{{entity}}-crud.tool.md  
  │   ├── knowledge/tools/api/{{function}}.tool.md  
  │   └── knowledge/workflows/{{module}}/{{process}}.workflow.md  
  │  
  ├── COLUMN: dependencies → POINTS TO → other task\_codes  
  │                            └── DAG edges between tasks  
  │  
  └── VISUALIZED BY → src/pages/project-tracker/ProjectTasksPage.tsx  
                        └── UI dashboard reading from project\_tasks table  
\`\`\`

\---

**\#\# 8\. Navigation Order for Agents**

When an agent receives a task, it reads files in a **\*\*specific order\*\***. This order ensures context builds correctly.

**\#\#\# Reading Order (Per Task)**

\`\`\`  
AGENT READING ORDER FOR EACH TASK  
═══════════════════════════════════

1\. CLAUDE.md (auto-loaded — already in context)  
   └─ Provides: project structure, commands, task protocol, knowledge paths

2\. .claude/rules/\*.md (auto-loaded — already in context)  
   └─ Provides: coding conventions, database patterns, architecture rules

3\. Task query result (from project\_tasks)  
   └─ Provides: task\_code, title, description, dependencies, wat\_references

4\. wat\_references\[0\]: Primary skill file  
   └─ Example: knowledge/skills/members/members.skill.md  
   └─ Provides: module metadata, purpose, available actions, entity schemas  
   └─ READ THIS FIRST — it's the "what am I building?" context

5\. wat\_references\[1\]: Primary tool file  
   └─ Example: knowledge/tools/db/contacts-crud.tool.md  
   └─ Provides: specific action specs with Input/Process/Output/Errors  
   └─ READ THIS SECOND — it's the "how do I implement each action?" spec

6\. wat\_references\[2+\]: Workflow files, secondary tools  
   └─ Example: knowledge/workflows/members/new-member-welcome.workflow.md  
   └─ Provides: multi-step process with tool references and failure handling  
   └─ READ THESE LAST — they show how actions chain together

7\. (Optional) knowledge/prod.md  
   └─ Only if the task touches multiple modules or the agent needs  
      full-platform context for cross-module integration  
   └─ Provides: module map, all entity relationships, workflow families  
\`\`\`

**\#\#\# Context Priority**

\`\`\`  
WHAT TAKES PRIORITY WHEN INFORMATION CONFLICTS  
════════════════════════════════════════════════

1\. .claude/rules/\*.md       ← HIGHEST (coding conventions override everything)  
2\. CLAUDE.md                ← Project structure and task protocol  
3\. Skill file               ← Domain knowledge (what entities and actions exist)  
4\. Tool file                ← Implementation spec (how to build each action)  
5\. Workflow file             ← Process definition (when to chain actions)  
6\. prod.md                  ← Summary (only for cross-module context)  
7\. Source documents          ← LOWEST (never load raw docs during development)  
\`\`\`

\---

**\#\# 9\. The wat\_references Bridge**

The \`wat\_references\` column in \`project\_tasks\` is the **\*\*critical bridge\*\*** between the task execution system and the knowledge base. It tells agents exactly which knowledge files to load for each task.

**\#\#\# How It Works**

\`\`\`  
TASK ROW → wat\_references → KNOWLEDGE FILES  
═════════════════════════════════════════════

task\_code: 'P2-04'  
title: 'Members module — UI (list, detail, create/edit)'  
wat\_references: \[  
  'knowledge/skills/members/members.skill.md',  
  'knowledge/workflows/members/new-member-welcome.workflow.md'  
\]

Agent picks up P2-04:  
  1\. Reads wat\_references array  
  2\. Loads members.skill.md → learns entity schemas, available actions  
  3\. Loads new-member-welcome.workflow.md → learns the welcome workflow steps  
  4\. Now has all domain context needed to build the Members UI  
\`\`\`

**\#\#\# wat\_references Patterns**

| Task Type | wat\_references Pattern | Example |  
|-----------|----------------------|---------|  
| **\*\*DB schema migration\*\*** | Skill file \+ DB tool file | \`\['skills/members/members.skill.md', 'tools/db/contacts-crud.tool.md'\]\` |  
| **\*\*RLS \+ audit triggers\*\*** | Database rule file only | \`\['.claude/rules/database.md'\]\` |  
| **\*\*Hooks \+ API layer\*\*** | DB tool file(s) | \`\['tools/db/contacts-crud.tool.md', 'tools/db/segments-crud.tool.md'\]\` |  
| **\*\*UI (pages \+ components)\*\*** | Skill file \+ workflow file | \`\['skills/members/members.skill.md', 'workflows/members/new-member-welcome.workflow.md'\]\` |  
| **\*\*AI agent implementation\*\*** | Skill file \+ API tool \+ workflow | \`\['skills/grace/grace.skill.md', 'tools/api/grace-chat.tool.md', 'workflows/ai/grace-solve.workflow.md'\]\` |  
| **\*\*Orchestration engine\*\*** | Shared skill \+ shared workflow \+ automation tool | \`\['skills/shared/orchestration.skill.md', 'workflows/shared/canonical-pipeline.workflow.md'\]\` |  
| **\*\*Cross-module workflow\*\*** | Workflow file | \`\['workflows/sales/lead-to-revenue.workflow.md'\]\` |  
| **\*\*Testing / polish\*\*** | Testing rule file | \`\['.claude/rules/testing.md'\]\` |  
| **\*\*Pure UI / CSS work\*\*** | Empty | \`'{}'::TEXT\[\]\` (no knowledge files needed) |

**\#\#\# Template for Seeding wat\_references**

\`\`\`sql  
\-- Module DB schema task  
('P2-01', 'Members module — DB schema', ...,  
 ARRAY\['knowledge/skills/members/members.skill.md',  
        'knowledge/tools/db/contacts-crud.tool.md',  
        'knowledge/tools/db/households-crud.tool.md'\]),

\-- Module UI task  
('P2-04', 'Members module — UI', ...,  
 ARRAY\['knowledge/skills/members/members.skill.md',  
        'knowledge/workflows/members/new-member-welcome.workflow.md'\]),

\-- AI agent task  
('P6-04', 'Grace AI — Edge function \+ chat', ...,  
 ARRAY\['knowledge/skills/grace/grace.skill.md',  
        'knowledge/tools/api/grace-chat.tool.md',  
        'knowledge/workflows/ai/grace-solve.workflow.md'\]),

\-- UI-only task (no knowledge needed)  
('P18-01', 'Dark theme CSS overhaul', ...,  
 '{}'::TEXT\[\]),  
\`\`\`

\---

**\#\# 10\. System Creation Timeline**

If building this entire system from scratch, here is the **\*\*exact chronological order\*\***:

\`\`\`  
CREATION TIMELINE (from zero to autonomous agent development)  
══════════════════════════════════════════════════════════════

DAY 1: SOURCE MATERIAL  
─────────────────────  
\[ \] Write (or gather) vision documents  
\[ \] Write (or gather) feature specs, use cases, entity descriptions  
\[ \] Write (or gather) technical architecture notes  
→ Output: 3-8 source documents in Rough Ideas folder

DAY 2: KNOWLEDGE BASE  
─────────────────────  
\[ \] Consolidate source docs into 3 canonical references  
\[ \] Generate shared skills (7 files)  
\[ \] Generate module skills (N files, one per module)  
\[ \] Generate DB tools (N files, one per major entity)  
\[ \] Generate API tools (N files, one per edge function)  
\[ \] Generate UI \+ Automation tools (N files)  
\[ \] Generate shared workflows (3-5 files)  
\[ \] Generate domain workflows (N files, 3-5 per module)  
\[ \] Generate index files (skills.md, tools.md, workflows.md)  
\[ \] Generate prod.md (master reference, under 700 lines)  
\[ \] Generate PRD.json (task dependency graph)  
→ Output: 128+ knowledge files in knowledge/ directory

DAY 3: AGENT INSTRUCTIONS  
─────────────────────────  
\[ \] Write CLAUDE.md (references knowledge/, defines task protocol)  
\[ \] Write AGENTS.md (for secondary agents, if multi-agent)  
\[ \] Write .claude/rules/code-style.md  
\[ \] Write .claude/rules/database.md  
\[ \] Write .claude/rules/architecture.md  
\[ \] Write .claude/rules/testing.md  
\[ \] Write .claude/rules/ai-agents.md (if platform has AI agents)  
\[ \] Write .claude/rules/task-process.md  
→ Output: Agent instruction files in .claude/

DAY 4: TASK SYSTEM  
─────────────────  
\[ \] Create project\_tasks schema migration  
\[ \] Create project\_levels schema migration (if gamification)  
\[ \] Seed initial tasks (50-200 rows with wat\_references)  
\[ \] Push migrations to Supabase  
\[ \] Build Project Tracker UI page  
→ Output: Task tracking database \+ UI dashboard

DAY 5+: DEVELOPMENT  
───────────────────  
\[ \] Agents start picking up tasks autonomously  
\[ \] Phase C loops for each development phase  
\[ \] Phase D loops for each task  
→ Output: Features built, modules completed, project progresses  
\`\`\`

\---

**\#\# 11\. System Maintenance Protocol**

**\#\#\# What to Update When**

| Event | Update | Files Affected |  
|-------|--------|---------------|  
| **\*\*New module added\*\*** | Skill file \+ DB tool(s) \+ workflows \+ prod.md entry \+ index updates | \`knowledge/skills/{{module}}/\`, \`knowledge/tools/db/\`, \`knowledge/workflows/{{module}}/\`, \`knowledge/prod.md\`, \`knowledge/skills.md\`, \`knowledge/tools.md\`, \`knowledge/workflows.md\` |  
| **\*\*New development phase\*\*** | Plan file \+ task seed migration \+ tracker UI \+ knowledge files if needed | \`.claude/plans/\`, \`supabase/migrations/\`, \`src/pages/project-tracker/ProjectTasksPage.tsx\` |  
| **\*\*New entity in existing module\*\*** | DB tool file \+ update skill file schema \+ update tools.md index | \`knowledge/tools/db/{{entity}}-crud.tool.md\`, \`knowledge/skills/{{module}}/{{module}}.skill.md\`, \`knowledge/tools.md\` |  
| **\*\*New edge function\*\*** | API tool file \+ update tools.md index | \`knowledge/tools/api/{{function}}.tool.md\`, \`knowledge/tools.md\` |  
| **\*\*New business process\*\*** | Workflow file \+ update workflows.md index | \`knowledge/workflows/{{module}}/{{process}}.workflow.md\`, \`knowledge/workflows.md\` |  
| **\*\*Convention change\*\*** | Rule file update | \`.claude/rules/{{rule}}.md\` |  
| **\*\*New industry supported\*\*** | Terminology skill \+ prod.md industry table \+ module industry labels | \`knowledge/skills/shared/terminology.skill.md\`, \`knowledge/prod.md\` |  
| **\*\*Module renamed\*\*** | Skill file \+ prod.md \+ CLAUDE.md module map \+ index files | Multiple files |  
| **\*\*Phase completed\*\*** | Completion migration | \`supabase/migrations/000XX\_mark\_phaseN\_complete.sql\` |

**\#\#\# Maintenance Order**

When making updates, follow this order to avoid broken references:

\`\`\`  
MAINTENANCE ORDER  
══════════════════

1\. Knowledge files first (skills → tools → workflows)  
2\. Index files second (skills.md, tools.md, workflows.md)  
3\. prod.md third (if module map or schema changed)  
4\. CLAUDE.md fourth (if project structure changed)  
5\. Task migrations fifth (if new tasks added)  
6\. Tracker UI sixth (if new phase added)  
\`\`\`

\---

**\#\# 12\. Connection to Each Template**

Each of the existing templates maps to a specific stage in the pipeline:

| Template | Pipeline Stage | Phase | Steps |  
|----------|---------------|-------|-------|  
| **\*\*KNOWLEDGE-ASSEMBLY-TEMPLATE.md\*\*** | Source → Knowledge files | Phase A | Steps 1-3 |  
| **\*\*SKILL-INDEX-TEMPLATE.md\*\*** | Skill file creation | Phase A | Step 3 (skills) |  
| **\*\*TOOL-INDEX-TEMPLATE.md\*\*** | Tool file creation | Phase A | Step 3 (tools) |  
| **\*\*WORKFLOW-INDEX-TEMPLATE.md\*\*** | Workflow file creation | Phase A | Step 3 (workflows) |  
| **\*\*PROD-KNOWLEDGE-BASE-TEMPLATE.md\*\*** | Master reference creation | Phase A | Step 5 |  
| **\*\*PRD-DEPENDENCY-GRAPH-TEMPLATE.md\*\*** | Task DAG creation | Phase A | Step 6 |  
| **\*\*CLAUDE-MD-TEMPLATE.md\*\*** | Agent instructions | Phase B | Step 7 |  
| **\*\*AI-DEV-FRAMEWORK-TEMPLATE.md\*\*** | Full framework setup | Phase B | Steps 7-12 |  
| **\*\*TASK-SYSTEM-TEMPLATE.md\*\*** | Task database \+ UI | Phase B | Steps 9-11 |  
| **\*\*TASK-SYSTEM-GUIDE.md\*\*** | Task protocol reference | Phase C+D | Steps 13-25 |  
| **\*\*WAT-FRAMEWORK-TEMPLATE.md\*\*** | Overall WAT architecture | Phase A | Steps 1-6 (all) |  
| **\*\*MASTER-PIPELINE-TEMPLATE.md\*\*** | Everything | All Phases | Steps 1-25 |

\`\`\`  
TEMPLATE COVERAGE MAP  
═════════════════════

Phase A (Knowledge Creation)  
  Step 1-2: KNOWLEDGE-ASSEMBLY-TEMPLATE.md  
  Step 3a:  SKILL-INDEX-TEMPLATE.md  
  Step 3b:  TOOL-INDEX-TEMPLATE.md  
  Step 3c:  WORKFLOW-INDEX-TEMPLATE.md  
  Step 3-6: WAT-FRAMEWORK-TEMPLATE.md (umbrella)  
  Step 5:   PROD-KNOWLEDGE-BASE-TEMPLATE.md  
  Step 6:   PRD-DEPENDENCY-GRAPH-TEMPLATE.md

Phase B (Infrastructure)  
  Step 7:     CLAUDE-MD-TEMPLATE.md  
  Step 7-12:  AI-DEV-FRAMEWORK-TEMPLATE.md (umbrella)  
  Step 9-11:  TASK-SYSTEM-TEMPLATE.md

Phase C (Phase Lifecycle)  
  Steps 13-19: TASK-SYSTEM-GUIDE.md

Phase D (Agent Session)  
  Steps 20-25: TASK-SYSTEM-GUIDE.md

ALL:  
  Steps 1-25:  MASTER-PIPELINE-TEMPLATE.md (this document)  
\`\`\`

\---

**\#\# 13\. Sizing Guide**

**\#\#\# Pipeline Scale by Project Size**

| Aspect | Small (MVP) | Medium | Large | Very Large |  
|--------|------------|--------|-------|-----------|  
| **\*\*Source docs\*\*** | 2-4 (1K-3K lines) | 4-8 (3K-10K) | 6-12 (10K-30K) | 8-15 (20K-50K) |  
| **\*\*Modules\*\*** | 3-8 | 8-15 | 15-30 | 30+ |  
| **\*\*Knowledge files\*\*** | 20-50 | 50-80 | 80-130 | 130-170 |  
| **\*\*Task database rows\*\*** | 20-50 | 50-100 | 100-160 | 160-300 |  
| **\*\*Development phases\*\*** | 3-5 | 5-8 | 8-12 | 12-20 |  
| **\*\*Agents\*\*** | 1 | 1-2 | 2 | 2-3 |  
| **\*\*Phase C cycles\*\*** | 3-5 | 5-8 | 8-12 | 12-20 |  
| **\*\*Phase D cycles\*\*** | 20-50 | 50-100 | 100-200 | 200-500 |  
| **\*\*Rule files\*\*** | 3-4 | 4-5 | 5-6 | 6-8 |  
| **\*\*Total pipeline setup\*\*** | 1-2 days | 2-4 days | 4-7 days | 7-14 days |

**\#\#\# What to Skip for Small Projects**

| Component | Small Project | Reason |  
|-----------|:------------:|--------|  
| Consolidation (Step 2\) | Skip if source docs don't overlap | One doc \= no conflicts to resolve |  
| PRD.json (Step 6\) | Optional | Task DB alone may be sufficient |  
| AGENTS.md (Step 7\) | Skip if single agent | Only needed for multi-agent |  
| Gamification (project\_levels) | Optional | Nice-to-have, not essential |  
| AI rules (.claude/rules/ai-agents.md) | Skip if no AI features | Only for platforms with AI agents |  
| Automation tools | Skip if no cascade engine | Only for platforms with automation |

\---

**\#\# 14\. Examples**

**\#\#\# Small Project (SaaS MVP, 3 phases, 25 tasks)**

\`\`\`  
PHASE A: Knowledge Creation  
  Source docs: 1 product spec (800 lines)  
  Knowledge files: 4 skills \+ 6 DB tools \+ 2 API tools \+ 5 workflows \= 17 files  
  Indexes: skills.md, tools.md, workflows.md  
  prod.md: 120 lines  
  PRD.json: Skipped (task DB is enough)

PHASE B: Infrastructure  
  CLAUDE.md: 80 lines (no AGENTS.md — single agent)  
  Rules: 3 files (code-style, database, architecture)  
  Task DB: project\_tasks table, 25 rows seeded  
  Tracker UI: Simple page with status badges

PHASE C: 3 cycles  
  Phase 1: Foundation (8 tasks)  
  Phase 2: Core features (12 tasks)  
  Phase 3: Polish \+ deploy (5 tasks)

PHASE D: \~25 agent sessions  
  Each session: query → load 1-2 knowledge files → build → verify → complete  
\`\`\`

**\#\#\# Large Project (33 modules, 18 phases, 200+ tasks)**

\`\`\`  
PHASE A: Knowledge Creation  
  Source docs: 6 files (38,000 lines total)  
  Consolidated docs: 3 files (30,000 lines total)  
  Knowledge files: 40 skills \+ 44 tools \+ 39 workflows \= 123 files  
  Indexes: skills.md (55 lines), tools.md (70 lines), workflows.md (105 lines)  
  prod.md: 525 lines  
  PRD.json: 713 lines, 50 initial tasks

PHASE B: Infrastructure  
  CLAUDE.md: 118 lines \+ AGENTS.md: 342 lines (2 agents)  
  Rules: 6 files (code-style, database, architecture, testing, ai-agents, task-process)  
  Task DB: project\_tasks (200+ rows) \+ project\_levels (15 levels)  
  Tracker UI: Full page with phase dropdown, status/agent filters, XP dashboard

PHASE C: 18 cycles  
  Phase 1: Foundation (30 tasks)  
  Phase 1.5: Task tracker (3 tasks)  
  Phase 2: Core modules (20 tasks)  
  Phase 3-6: Domain modules \+ AI (47 tasks)  
  Phase 7: Production readiness (3 tasks)  
  Phase 8-13: Advanced systems (60 tasks)  
  Phase 14-17: Extended production (40 tasks)  
  Phase 18: UI/UX overhaul (7 tasks)

PHASE D: 200+ agent sessions  
  Split between Claude Code (architecture, UI, AI) and Codex (migrations, CRUD)  
  Each session: query → load 2-4 knowledge files → build → verify → complete  
\`\`\`

\---

**\#\# 15\. Validation Checklist**

**\#\#\# Phase A: Knowledge Base Complete**

\- \[ \] All source documents inventoried and classified  
\- \[ \] 3 canonical references created (or source docs are clean enough to skip)  
\- \[ \] Shared skills created (orchestration, cascade, auth, audit, multi-tenancy, action-model, terminology)  
\- \[ \] Module skills created (one per module, with metadata \+ actions \+ schemas)  
\- \[ \] DB tools created (one per major entity, with 4-aspect action format)  
\- \[ \] API tools created (one per edge function, with endpoint \+ pipeline)  
\- \[ \] Workflow files created (shared \+ domain, with structured steps)  
\- \[ \] Index files generated (skills.md, tools.md, workflows.md)  
\- \[ \] prod.md created (under 700 lines, covers all modules)  
\- \[ \] PRD.json created (if needed — task DAG with priorities)

**\#\#\# Phase B: Infrastructure Complete**

\- \[ \] CLAUDE.md written with: project overview, commands, task protocol, knowledge loading instructions  
\- \[ \] AGENTS.md written (if multi-agent)  
\- \[ \] All rule files written (.claude/rules/\*.md)  
\- \[ \] project\_tasks table created (migration pushed)  
\- \[ \] project\_levels table created (if gamification)  
\- \[ \] Tasks seeded with wat\_references pointing to knowledge files  
\- \[ \] Project Tracker UI built and accessible  
\- \[ \] Application scaffolded (build passes)

**\#\#\# Phase C: Phase Lifecycle Working**

\- \[ \] Plan file template works (.claude/plans/)  
\- \[ \] Task seeding migration template works (INSERT with ON CONFLICT)  
\- \[ \] Migration push succeeds (npx supabase db push)  
\- \[ \] Tracker UI shows new phases in dropdown  
\- \[ \] Knowledge file creation process is clear (when to create, when to skip)  
\- \[ \] Completion migration template works (mark all tasks done)

**\#\#\# Phase D: Agent Session Protocol Working**

\- \[ \] CLAUDE.md auto-loads and provides correct context  
\- \[ \] Rules files auto-load and provide correct conventions  
\- \[ \] Task query returns correct next task (highest priority, pending, correct assignee)  
\- \[ \] wat\_references paths point to files that exist  
\- \[ \] Knowledge files provide sufficient context to build the feature  
\- \[ \] Test commands pass after successful implementation  
\- \[ \] Task status updates correctly (pending → in\_progress → completed)  
\- \[ \] Multi-agent coordination works (if applicable)

**\#\#\# Cross-System Integrity**

\- \[ \] Every task's wat\_references point to files that exist on disk  
\- \[ \] Every module in prod.md has a corresponding skill file  
\- \[ \] Every skill action has a corresponding tool action  
\- \[ \] Every workflow step references a real tool file  
\- \[ \] CLAUDE.md knowledge loading instructions match actual directory structure  
\- \[ \] Task dependencies form a valid DAG (no cycles)  
\- \[ \] Priority values are globally unique (no collisions)

\---

**\#\# 16\. Quick Reference Card**

\`\`\`  
MASTER PIPELINE CHEAT SHEET  
═════════════════════════════

THE 4 PHASES:  
  A. Knowledge Creation  (once)     → 128+ knowledge files  
  B. Project Infrastructure (once)  → CLAUDE.md \+ rules \+ task DB \+ tracker  
  C. Per-Phase Lifecycle (7-18x)    → Plan → seed → push → work → close  
  D. Agent Session Protocol (100x+) → Query → load → build → verify → complete

THE 25 STEPS:  
  Phase A (1-6):   Raw ideas → Consolidate → Skills → Tools → Workflows  
                   → Indexes → prod.md → PRD.json  
  Phase B (7-12):  CLAUDE.md → Rules → Task DB → Seed tasks → Tracker UI  
                   → App scaffold  
  Phase C (13-19): Plan → Seed migration → Push → Update UI → Knowledge  
                   → Work tasks → Completion migration  
  Phase D (20-25): CLAUDE.md loaded → Query task → Load wat\_references  
                   → Build feature → Verify → Mark complete → Loop

THE KEY BRIDGE:  
  project\_tasks.wat\_references → knowledge/\*\*/\*.md  
  Task rows point to the exact knowledge files the agent should load.

FILE READING ORDER (per task):  
  1\. CLAUDE.md (auto)      → project structure, task protocol  
  2\. .claude/rules/\* (auto) → coding conventions  
  3\. Task query result      → what to build, wat\_references  
  4\. Skill file             → entities, actions, schemas  
  5\. Tool file              → Input/Process/Output/Errors per action  
  6\. Workflow file           → multi-step process with tool refs  
  7\. prod.md (if needed)    → cross-module context

CREATION ORDER (from scratch):  
  Day 1: Source docs  
  Day 2: Knowledge base (skills → tools → workflows → indexes → prod.md)  
  Day 3: Agent instructions (CLAUDE.md \+ rules)  
  Day 4: Task system (DB \+ seed \+ tracker UI)  
  Day 5+: Agents work autonomously

MAINTENANCE ORDER:  
  Knowledge files → Indexes → prod.md → CLAUDE.md → Task migrations → Tracker UI

TEMPLATES (12 total):  
  Phase A: KNOWLEDGE-ASSEMBLY, SKILL-INDEX, TOOL-INDEX, WORKFLOW-INDEX,  
           PROD-KNOWLEDGE-BASE, PRD-DEPENDENCY-GRAPH, WAT-FRAMEWORK  
  Phase B: CLAUDE-MD, AI-DEV-FRAMEWORK, TASK-SYSTEM  
  Phase C+D: TASK-SYSTEM-GUIDE  
  All: MASTER-PIPELINE (this document)  
\`\`\`

\---

**\#\# Companion Templates**

This document is the capstone of the WAT Framework template library:

| Template | File | Pipeline Stage |  
|----------|------|---------------|  
| Knowledge Assembly | \`docs/KNOWLEDGE-ASSEMBLY-TEMPLATE.md\` | Phase A: Steps 1-3 |  
| Skill Index | \`docs/SKILL-INDEX-TEMPLATE.md\` | Phase A: Step 3a |  
| Workflow Index | \`docs/WORKFLOW-INDEX-TEMPLATE.md\` | Phase A: Step 3c |  
| Tool Index | \`docs/TOOL-INDEX-TEMPLATE.md\` | Phase A: Step 3b |  
| Master KB (prod.md) | \`docs/PROD-KNOWLEDGE-BASE-TEMPLATE.md\` | Phase A: Step 5 |  
| Dependency Graph | \`docs/PRD-DEPENDENCY-GRAPH-TEMPLATE.md\` | Phase A: Step 6 |  
| CLAUDE.md | \`docs/CLAUDE-MD-TEMPLATE.md\` | Phase B: Step 7 |  
| AI Dev Framework | \`docs/AI-DEV-FRAMEWORK-TEMPLATE.md\` | Phase B: Steps 7-12 |  
| Task System | \`docs/TASK-SYSTEM-TEMPLATE.md\` | Phase B: Steps 9-11 |  
| Task System Guide | \`docs/TASK-SYSTEM-GUIDE.md\` | Phase C+D: Steps 13-25 |  
| WAT Framework | \`docs/WAT-FRAMEWORK-TEMPLATE.md\` | Phase A: Steps 1-6 |  
| **\*\*Master Pipeline\*\*** | **\*\*\`docs/MASTER-PIPELINE-TEMPLATE.md\`\*\*** | **\*\*All: Steps 1-25 \<-- You are here\*\*** |

\---

*\*Template version 1.0 — Based on a production pipeline with 4 phases, 25 steps, 200+ tasks across 18 development phases, 2 AI agents (Claude Code \+ Codex), 137 knowledge files, 50+ database migrations, a gamified task tracker with 15 XP levels, and full autonomous agent session protocol.\**

