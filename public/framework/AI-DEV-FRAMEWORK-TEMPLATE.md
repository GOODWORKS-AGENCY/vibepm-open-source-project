**\# AI-Driven Development Framework — Full System Template**

\> A complete, reusable framework for building software with AI agents. Includes: agent instructions, knowledge base architecture, task tracking with gamification, multi-agent coordination, and dependency-aware project management. Plug into any Supabase \+ React project.

\---

**\#\# Table of Contents**

1\. \[What This Framework Is\](\#1-what-this-framework-is)  
2\. \[System Architecture\](\#2-system-architecture)  
3\. \[File Structure\](\#3-file-structure)  
4\. \[Part A — Agent Instructions (CLAUDE.md)\](\#part-a--agent-instructions-claudemd)  
5\. \[Part B — Multi-Agent Config (AGENTS.md)\](\#part-b--multi-agent-config-agentsmd)  
6\. \[Part C — Knowledge Base\](\#part-c--knowledge-base)  
   \- \[C1. Master Knowledge Base (prod.md)\](\#c1-master-knowledge-base-prodmd)  
   \- \[C2. Skill Files\](\#c2-skill-files)  
   \- \[C3. Tool Files\](\#c3-tool-files)  
   \- \[C4. Workflow Files\](\#c4-workflow-files)  
   \- \[C5. Index Files\](\#c5-index-files)  
7\. \[Part D — Task Dependency Graph (PRD.json)\](\#part-d--task-dependency-graph-prdjson)  
8\. \[Part E — Coding Rules\](\#part-e--coding-rules)  
9\. \[Part F — Task Tracking Database\](\#part-f--task-tracking-database)  
10\. \[Part G — Integration Checklist\](\#part-g--integration-checklist)  
11\. \[Greenfield Quick Start\](\#greenfield-quick-start)  
12\. \[Brownfield Quick Start\](\#brownfield-quick-start)

\---

**\#\# 1\. What This Framework Is**

This is a **\*\*complete system for AI-assisted software development\*\***. It was extracted from a production project (200+ tasks, 50+ migrations, 33 modules, 128 knowledge files, 4 AI agents) and made generic.

It gives you:

| Layer | What It Does | Key Files |  
|-------|-------------|-----------|  
| **\*\*Agent Instructions\*\*** | Tells AI agents about your project, conventions, and how to work | \`.claude/CLAUDE.md\`, \`AGENTS.md\` |  
| **\*\*Knowledge Base\*\*** | Domain context AI agents load per-task (skills, tools, workflows) | \`knowledge/\*\*/\*.md\` |  
| **\*\*Task System\*\*** | Database-backed task queue with priorities, dependencies, XP, phases | \`project\_tasks\` table \+ UI |  
| **\*\*Dependency Graph\*\*** | Machine-readable task ordering for AI agents | \`knowledge/PRD.json\` |  
| **\*\*Coding Rules\*\*** | Conventions AI agents must follow | \`.claude/rules/\*.md\` |

**\#\#\# Why it works**

AI agents are only as good as their context. This framework ensures:

1\. **\*\*Every task has context\*\*** — \`wat\_references\` links to knowledge files so the agent knows WHAT to build and HOW  
2\. **\*\*Every task has ordering\*\*** — dependencies prevent agents from building feature B before feature A exists  
3\. **\*\*Every task has conventions\*\*** — rules files enforce coding standards without manual review  
4\. **\*\*Multiple agents coordinate\*\*** — the task queue prevents conflicts and assigns work by specialization

\---

**\#\# 2\. System Architecture**

\`\`\`  
YOUR PROJECT  
\============

┌─────────────────────────────────────────────────────────────────────┐  
│                                                                     │  
│  .claude/CLAUDE.md           Primary agent instructions             │  
│  .claude/rules/\*.md          Coding conventions \+ task protocol     │  
│  AGENTS.md                   Secondary agent instructions           │  
│                                                                     │  
│  knowledge/                                                         │  
│  ├── prod.md                 Master domain reference                │  
│  ├── PRD.json                Task dependency graph                  │  
│  ├── skills.md               Index → skill files                    │  
│  ├── tools.md                Index → tool files                     │  
│  ├── workflows.md            Index → workflow files                 │  
│  ├── skills/                 WHAT to build (domain knowledge)       │  
│  │   ├── shared/             Cross-cutting concerns                 │  
│  │   └── \[module\]/           Per-module domain knowledge            │  
│  ├── tools/                  HOW to build (specifications)          │  
│  │   ├── db/                 Database schemas \+ CRUD specs          │  
│  │   ├── api/                API endpoint specs                     │  
│  │   ├── ui/                 UI component specs                     │  
│  │   └── automation/         Automation/pipeline specs              │  
│  └── workflows/              WHEN things happen (business processes)│  
│      ├── shared/             Cross-cutting workflows                │  
│      └── \[module\]/           Per-module workflows                   │  
│                                                                     │  
│  supabase/migrations/        Task seeds \+ schema migrations         │  
│  /project-tracker            Visual dashboard                       │  
│                                                                     │  
└─────────────────────────────────────────────────────────────────────┘  
\`\`\`

**\#\#\# Data flow for a single task**

\`\`\`  
Agent starts session  
    │  
    ▼  
Query project\_tasks for next pending task (by priority, by assigned\_to)  
    │  
    ▼  
Read wat\_references → load knowledge files (skill \+ tool \+ workflow)  
    │  
    ▼  
Read .claude/rules/ → understand conventions  
    │  
    ▼  
Build the feature / write the migration / implement the hook  
    │  
    ▼  
Verify (tsc, build, lint)  
    │  
    ▼  
Mark task completed → earn XP → next task  
\`\`\`

\---

**\#\# 3\. File Structure**

Create this structure in your project root:

\`\`\`  
your-project/  
├── .claude/  
│   ├── CLAUDE.md                          ← Primary agent instructions  
│   └── rules/  
│       ├── architecture.md                ← Architecture conventions  
│       ├── code-style.md                  ← Code style rules  
│       ├── database.md                    ← Database conventions  
│       ├── task-process.md                ← Task protocol \+ phase guide  
│       └── testing.md                     ← Testing conventions  
├── AGENTS.md                              ← Secondary agent instructions  
├── knowledge/  
│   ├── prod.md                            ← Master domain reference  
│   ├── PRD.json                           ← Task dependency graph  
│   ├── skills.md                          ← Skill index  
│   ├── tools.md                           ← Tool index  
│   ├── workflows.md                       ← Workflow index  
│   ├── skills/  
│   │   ├── shared/  
│   │   │   └── \[topic\].skill.md  
│   │   └── \[module\]/  
│   │       └── \[module\].skill.md  
│   ├── tools/  
│   │   ├── db/  
│   │   │   └── \[entity\]-crud.tool.md  
│   │   ├── api/  
│   │   │   └── \[function\].tool.md  
│   │   └── ui/  
│   │       └── \[component\].tool.md  
│   └── workflows/  
│       ├── shared/  
│       │   └── \[process\].workflow.md  
│       └── \[module\]/  
│           └── \[workflow\].workflow.md  
├── supabase/  
│   └── migrations/  
│       └── XXXXX\_project\_tasks.sql  
└── src/  
    ├── features/project-tracker/          ← Task tracker UI  
    └── pages/project-tracker/  
\`\`\`

\---

**\#\# Part A — Agent Instructions (CLAUDE.md)**

This is the **\*\*primary agent config file\*\***. It tells Claude Code (or any AI agent) everything about your project.

**\*\*File: \`.claude/CLAUDE.md\`\*\***

\`\`\`markdown  
**\# \[Your Project Name\] — Claude Code Instructions**

**\#\# Project Overview**  
\- **\*\*Stack\*\***: \[React 18 \+ TypeScript \+ Vite\] ← your stack  
\- **\*\*State\*\***: \[TanStack Query (server), React state (view)\] ← your state management  
\- **\*\*UI\*\***: \[shadcn/ui \+ Radix \+ Tailwind CSS\] ← your UI library  
\- **\*\*Backend\*\***: \[Supabase (PostgreSQL \+ Auth \+ Edge Functions)\] ← your backend  
\- **\*\*Forms\*\***: \[react-hook-form \+ zod\] ← your form library  
\- **\*\*Architecture\*\***: \[Brief architecture description\]

**\#\# Key Commands**  
\- **\*\*Dev server\*\***: \`npm run dev\`  
\- **\*\*Build\*\***: \`npm run build\`  
\- **\*\*Lint\*\***: \`npm run lint\`  
\- **\*\*Type check\*\***: \`npx tsc \--noEmit\`  
\- **\*\*DB migrations\*\***: \`npx supabase db push\`  
\- **\*\*Generate types\*\***: \`npx supabase gen types typescript \--project-id \<id\> \> src/types/database.types.ts\`

**\#\# Task Tracking Protocol**  
\- **\*\*Before starting work\*\***: Query \`project\_tasks\` for the next highest-priority  
  pending task. Mark it \`in\_progress\`.  
\- **\*\*After completing work\*\***: Update the task to \`completed\` with  
  \`progress\_pct \= 100\` and \`completed\_at \= now()\`.  
\- **\*\*If blocked\*\***: Set status to \`blocked\` and add a note explaining the blocker.  
\- **\*\*Task tracker UI\*\***: Available at \`/project-tracker\` route.  
\- **\*\*Direct update\*\*** (for CLI sessions):  
  \`\`\`sql  
  UPDATE project\_tasks SET status \= 'completed', progress\_pct \= 100,  
    completed\_at \= now() WHERE task\_code \= 'P1-01';  
  \`\`\`  
\- **\*\*Process template\*\***: See \`.claude/rules/task-process.md\` for the full guide.  
\- **\*\*Current phase\*\***: Check \`project\_tasks\` for the latest active phase.

**\#\# Project Structure**  
\`\`\`  
src/  
├── app/                    \# App-level setup  
├── components/  
│   ├── ui/                 \# UI library components  
│   ├── layout/             \# Shell, navigation  
│   └── common/             \# Shared components  
├── features/               \# Feature/domain logic by module  
│   └── \[module\]/  
│       ├── hooks/  
│       ├── api/  
│       ├── components/  
│       └── types.ts  
├── hooks/                  \# Global shared hooks  
├── lib/                    \# Utilities  
├── pages/                  \# Route pages  
├── types/                  \# TypeScript types  
└── styles/                 \# Global styles  
\`\`\`

**\#\# Knowledge Base**  
Domain knowledge is in \`knowledge/\`. Load relevant files based on task:  
\- \`knowledge/prod.md\` — Full domain reference  
\- \`knowledge/skills.md\` — Skill index  
\- \`knowledge/tools.md\` — Tool index  
\- \`knowledge/workflows.md\` — Workflow index  
\- \`knowledge/PRD.json\` — Task dependency graph

**\#\#\# Loading by task type:**  
\- **\*\*Working on a specific module\*\***: Load \`knowledge/skills/\[module\]/\[module\].skill.md\`  
\- **\*\*Implementing CRUD\*\***: Load \`knowledge/tools/db/\[entity\]-crud.tool.md\`  
\- **\*\*Building an API endpoint\*\***: Load \`knowledge/tools/api/\[function\].tool.md\`  
\- **\*\*Implementing a workflow\*\***: Load \`knowledge/workflows/\[module\]/\[workflow\].workflow.md\`  
\- **\*\*Cross-cutting concerns\*\***: Load \`knowledge/skills/shared/\[topic\].skill.md\`

**\#\# Conventions**  
\- See \`.claude/rules/\` for detailed coding conventions  
\- \[List your top 3-5 conventions here\]

**\#\# Module Map**  
| Module | Route | Purpose |  
|--------|-------|---------|  
| \[Module 1\] | \`/route1\` | \[Description\] |  
| \[Module 2\] | \`/route2\` | \[Description\] |  
| ... | ... | ... |  
\`\`\`

\#\#\# What makes a good CLAUDE.md

| Section | Purpose | Why It Matters |  
|---------|---------|---------------|  
| \*\*Project Overview\*\* | Tech stack at a glance | Agent picks the right patterns |  
| \*\*Key Commands\*\* | Build, test, lint commands | Agent can verify its own work |  
| \*\*Task Protocol\*\* | SQL queries for task management | Agent knows the workflow |  
| \*\*Project Structure\*\* | Directory tree | Agent knows where to put files |  
| \*\*Knowledge Base\*\* | How to load context | Agent loads the right docs per task |  
| \*\*Conventions\*\* | Code style rules | Agent follows your patterns |  
| \*\*Module Map\*\* | Routes and modules | Agent understands the app |

\---

\#\# Part B — Multi-Agent Config (AGENTS.md)

This configures a \*\*second AI agent\*\* (e.g., Codex, Cursor, Copilot). It lives at the repo root so any tool can find it.

\*\*File: \`AGENTS.md\`\*\*

\`\`\`markdown  
\# \[Your Project Name\] — \[Agent Name\] Instructions

\#\# What Is This Project?  
\[1-2 sentence overview\]

\#\# Your Role (\[Agent Name\])  
You are one of \[N\] AI agents building this platform:  
\- \*\*\[Agent 1 Name\]\*\*: \[Specialization — e.g., Architecture, complex UI, AI agents\]  
\- \*\*\[Agent 2 Name\]\*\*: \[Specialization — e.g., Database migrations, RLS, CRUD\]

You specialize in \*\*\[your focus area\]\*\*.

\#\# Task Tracking Protocol  
\*\*CRITICAL — Follow this before and after every task:\*\*

1\. \*\*Before starting\*\*: Query for your next task:  
   \`\`\`sql  
   SELECT task\_code, title, priority, dependencies, wat\_references  
   FROM project\_tasks  
   WHERE status \= 'pending' AND assigned\_to \= '\[agent-name\]'  
   ORDER BY priority DESC LIMIT 1;  
   \`\`\`

2\. **\*\*Mark in\_progress\*\***:  
   \`\`\`sql  
   UPDATE project\_tasks SET status \= 'in\_progress', started\_at \= now()  
   WHERE task\_code \= 'PXX-YY';  
   \`\`\`

3\. **\*\*Mark completed\*\***:  
   \`\`\`sql  
   UPDATE project\_tasks SET status \= 'completed', progress\_pct \= 100,  
     completed\_at \= now() WHERE task\_code \= 'PXX-YY';  
   \`\`\`

4\. **\*\*If blocked\*\***:  
   \`\`\`sql  
   UPDATE project\_tasks SET status \= 'blocked', notes \= 'Reason'  
   WHERE task\_code \= 'PXX-YY';  
   \`\`\`

**\#\# Database Connection**  
\- **\*\*Project ref\*\***: \`\[your-supabase-ref\]\`  
\- **\*\*Push\*\***: \`npx supabase db push\`  
\- **\*\*Gen types\*\***: \`npx supabase gen types typescript \--project-id \[ref\] \> src/types/database.types.ts\`

**\#\# Knowledge Base**  
Before working on any task, **\*\*read the referenced knowledge files\*\***:  
\- \`knowledge/skills/\[module\]/\[module\].skill.md\` — domain overview  
\- \`knowledge/tools/db/\[entity\]-crud.tool.md\` — schema specs  
\- \`knowledge/workflows/\[module\]/\[workflow\].workflow.md\` — process context  
\- \`.claude/rules/database.md\` — naming and RLS patterns

**\#\# Database Conventions**  
\[Paste your key DB conventions — common columns, RLS pattern, trigger patterns\]

**\#\# Task Completion Checklist**  
For each task:  
1\. Read referenced knowledge files  
2\. Do the work  
3\. Verify: \`npx tsc \--noEmit && npm run build\`  
4\. Update task status  
5\. Move to next task

**\#\# Your Task Queue**  
\[Optional: paste the agent's current task queue here for context\]  
\`\`\`

\#\#\# Key differences between CLAUDE.md and AGENTS.md

| | CLAUDE.md | AGENTS.md |  
|---|-----------|-----------|  
| \*\*Location\*\* | \`.claude/CLAUDE.md\` | Repo root \`AGENTS.md\` |  
| \*\*Read by\*\* | Claude Code | Codex, Cursor, Copilot, etc. |  
| \*\*Scope\*\* | Full project context | Agent-specific context |  
| \*\*Task filter\*\* | All tasks or \`assigned\_to \= 'agent-1'\` | \`assigned\_to \= 'agent-2'\` only |  
| \*\*Detail level\*\* | High-level conventions \+ knowledge loading | Specific conventions for that agent's work |

\---

\#\# Part C — Knowledge Base

The knowledge base is the \*\*brain\*\* of the system. It stores domain knowledge that AI agents load on-demand per task.

\#\#\# Three types of knowledge files

| Type | Question It Answers | File Pattern | Example |  
|------|-------------------|--------------|---------|  
| \*\*Skill\*\* | WHAT to build (domain concepts, data model, relationships) | \`skills/\[module\]/\[module\].skill.md\` | \`skills/members/members.skill.md\` |  
| \*\*Tool\*\* | HOW to build (schema specs, API contracts, UI specs) | \`tools/\[type\]/\[name\].tool.md\` | \`tools/db/contacts-crud.tool.md\` |  
| \*\*Workflow\*\* | WHEN things happen (business processes, event chains) | \`workflows/\[module\]/\[name\].workflow.md\` | \`workflows/sales/lead-qualification.workflow.md\` |

\#\#\# C1. Master Knowledge Base (prod.md)

The master doc covers \*\*every module\*\* in one file. AI agents read this for broad context.

\*\*File: \`knowledge/prod.md\`\*\*

\`\`\`markdown  
\# \[Your Project Name\] — Master Knowledge Base

\#\# Part 1: Platform Overview

\#\#\# Mission  
\[1-2 sentences: what your app does\]

\#\#\# Architecture  
\- \*\*Stack\*\*: \[your stack\]  
\- \*\*Multi-tenant\*\*: \[yes/no, how\]  
\- \*\*Data flow\*\*: \[brief description\]

\#\#\# Module Map  
| \# | Module | Route | Description |  
|---|--------|-------|-------------|  
| 1 | \[Module\] | /route | \[Purpose\] |  
| 2 | ... | ... | ... |

\---

\#\# Part 2: \[Module 1 Name\]  
\- \*\*Purpose\*\*: \[What it does\]  
\- \*\*Route\*\*: /route | \*\*Key Entities\*\*: table1, table2  
\- \*\*Actions\*\*: Create, Read, Update, Delete, \[domain-specific actions\]  
\- \*\*Cascade Triggers\*\*: \[What happens downstream when things change\]  
\- \*\*Related Modules\*\*: \[Which other modules it talks to\]  
\- \*\*Knowledge\*\*: skills/\[module\]/\[module\].skill.md, tools/db/\[entity\]-crud.tool.md

\#\# Part 3: \[Module 2 Name\]  
\[Same pattern...\]

\---

\#\# Part N: Cross-Module Workflow Families

\#\#\# 1\. \[Workflow Family Name\]  
\[Module A\] → \[Module B\] → \[Module C\]  
\- \[Step-by-step description of the cross-module flow\]

\---

\#\# Part N+1: Database Schema Overview

\#\#\# \[Group Name\]  
\- \`table\_name\` — \[purpose\] (key columns)

\#\#\# Common Column Pattern  
\`\`\`sql  
id              UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
created\_at      TIMESTAMPTZ NOT NULL DEFAULT now(),  
updated\_at      TIMESTAMPTZ NOT NULL DEFAULT now()  
\`\`\`  
\`\`\`

\#\#\# C2. Skill Files

One per module. Describes the \*\*domain\*\* — entities, relationships, business rules.

\*\*File: \`knowledge/skills/\[module\]/\[module\].skill.md\`\*\*

\`\`\`markdown  
\# \[Module Name\] Skill

\#\# Purpose  
\[What this module does in 2-3 sentences\]

\#\# Key Entities

\#\#\# \[Entity 1\]  
\- \*\*Table\*\*: \`entity\_name\`  
\- \*\*Fields\*\*: field1 (type), field2 (type), ...  
\- \*\*Relationships\*\*: belongs\_to \[other entity\], has\_many \[other entity\]  
\- \*\*Business Rules\*\*:  
  \- \[Rule 1\]  
  \- \[Rule 2\]

\#\#\# \[Entity 2\]  
\[Same pattern\]

\#\# Actions  
| Action | Risk Level | Description |  
|--------|-----------|-------------|  
| Create | Low | \[What happens\] |  
| Update | Low | \[What happens\] |  
| Delete | High | \[What happens, cascades\] |  
| \[Domain action\] | Medium | \[What happens\] |

\#\# Cascade Triggers  
| Trigger | Cascade Type | Target | Description |  
|---------|-------------|--------|-------------|  
| \[Entity\] created | Sync | \[Target module\] | \[What happens\] |  
| \[Entity\] updated | Deferred | \[Target module\] | \[What happens\] |

\#\# Related Modules  
\- \*\*\[Module X\]\*\*: \[How they relate\]  
\- \*\*\[Module Y\]\*\*: \[How they relate\]

\#\# Industry Labels  
| Key | Corporate | Nonprofit | \[Industry 3\] |  
|-----|-----------|-----------|---------------|  
| \[module\] | \[label\] | \[label\] | \[label\] |  
\`\`\`

**\#\#\# C3. Tool Files**

Specifications for **\*\*how to build\*\*** something — exact schemas, API contracts, UI component specs.

**\*\*File: \`knowledge/tools/db/\[entity\]-crud.tool.md\`\*\***

\`\`\`markdown  
**\# \[Entity\] CRUD Tool**

**\#\# Table Schema**

\`\`\`sql  
CREATE TABLE \[entity\_name\] (  
  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
  \-- entity-specific columns  
  \[column1\]       \[TYPE\] \[CONSTRAINTS\],  
  \[column2\]       \[TYPE\] \[CONSTRAINTS\],  
  status          TEXT NOT NULL DEFAULT 'active'  
                    CHECK (status IN ('active', 'inactive', 'archived')),  
  tags            TEXT\[\] DEFAULT '{}',  
  metadata        JSONB DEFAULT '{}',  
  created\_by      UUID REFERENCES profiles(id),  
  updated\_by      UUID REFERENCES profiles(id),  
  created\_at      TIMESTAMPTZ NOT NULL DEFAULT now(),  
  updated\_at      TIMESTAMPTZ NOT NULL DEFAULT now()  
);  
\`\`\`

**\#\# Indexes**  
\`\`\`sql  
CREATE INDEX idx\_\[entity\]\_org ON \[entity\](organization\_id);  
CREATE INDEX idx\_\[entity\]\_status ON \[entity\](status);  
\-- entity-specific indexes  
\`\`\`

**\#\# Operations**

**\#\#\# Create**  
\- **\*\*Input\*\***: { \[field1\], \[field2\], ... }  
\- **\*\*Validation\*\***: \[rules\]  
\- **\*\*Side effects\*\***: \[audit log, notifications, cascades\]

**\#\#\# Read (List)**  
\- **\*\*Filters\*\***: organization\_id (required), status, \[entity-specific\]  
\- **\*\*Pagination\*\***: \`.range(offset, offset \+ limit)\`  
\- **\*\*Sort\*\***: \[default sort\]

**\#\#\# Update**  
\- **\*\*Mutable fields\*\***: \[field1, field2, ...\]  
\- **\*\*Immutable fields\*\***: \[id, organization\_id, created\_at\]

**\#\#\# Delete**  
\- **\*\*Cascade\*\***: \[what gets deleted/nullified\]  
\- **\*\*Soft delete\*\***: \[yes/no — use status='archived' or hard delete\]  
\`\`\`

\*\*File: \`knowledge/tools/api/\[function\].tool.md\`\*\*

\`\`\`markdown  
\# \[Function Name\] API Tool

\#\# Edge Function: \`\[function-name\]\`

\#\#\# Endpoint  
\- \*\*Method\*\*: POST  
\- \*\*Path\*\*: \`/functions/v1/\[function-name\]\`  
\- \*\*Auth\*\*: Required (JWT)

\#\#\# Request  
\`\`\`json  
{  
  "action": "\[action\_type\]",  
  "params": { ... }  
}  
\`\`\`

**\#\#\# Response**  
\`\`\`json  
{  
  "success": true,  
  "data": { ... }  
}  
\`\`\`

**\#\#\# Rate Limits**  
\- \[N\] requests per minute per \[user/org\]

**\#\#\# Error Codes**  
| Code | Meaning |  
|------|---------|  
| 400 | Invalid input |  
| 401 | Not authenticated |  
| 403 | Insufficient permissions |  
| 429 | Rate limited |  
\`\`\`

\#\#\# C4. Workflow Files

Business processes that span multiple steps or modules.

\*\*File: \`knowledge/workflows/\[module\]/\[workflow\].workflow.md\`\*\*

\`\`\`markdown  
\# \[Workflow Name\]

\#\# Trigger  
\- \*\*Event\*\*: \[What starts this workflow\]  
\- \*\*Source\*\*: \[Module/UI/Schedule/Webhook\]

\#\# Risk Level: \[Low/Medium/High\]

\#\# Steps

\#\#\# Step 1: \[Step Name\]  
\- \*\*Action\*\*: \[What happens\]  
\- \*\*Entity\*\*: \[Which table/module\]  
\- \*\*Input\*\*: \[What data is needed\]  
\- \*\*Output\*\*: \[What data is produced\]

\#\#\# Step 2: \[Step Name\]  
\- \*\*Depends on\*\*: Step 1  
\- \*\*Action\*\*: \[What happens\]  
\- \*\*Entity\*\*: \[Which table/module\]

\#\#\# Step 3: \[Step Name\]  
\[Continue pattern...\]

\#\# Failure Handling  
\- \*\*Step 1 fails\*\*: \[What happens\]  
\- \*\*Step 2 fails\*\*: \[What happens\]

\#\# Cascade Triggers  
\- On completion: \[What downstream effects occur\]  
\`\`\`

**\#\#\# C5. Index Files**

Three index files help agents find the right knowledge file quickly.

**\*\*File: \`knowledge/skills.md\`\*\***

\`\`\`markdown  
**\# Skill Index**

**\#\# Shared Skills**  
| Skill | File | Description |  
|-------|------|-------------|  
| \[Topic\] | skills/shared/\[topic\].skill.md | \[Description\] |

**\#\# Module Skills**  
| \# | Module | File | Key Entities |  
|---|--------|------|-------------|  
| 1 | \[Module\] | skills/\[module\]/\[module\].skill.md | entity1, entity2 |  
| 2 | ... | ... | ... |

**\*\*Total: \[N\] skill files\*\***  
\`\`\`

**\*\*File: \`knowledge/tools.md\`\*\***

\`\`\`markdown  
**\# Tool Index**

**\#\# Database Tools**  
| Tool | File | Primary Entity |  
|------|------|---------------|  
| \[Entity\] CRUD | tools/db/\[entity\]-crud.tool.md | \[table\_name\] |

**\#\# API Tools**  
| Tool | File | Edge Function |  
|------|------|--------------|  
| \[Function\] | tools/api/\[function\].tool.md | \[function-name\] |

**\#\# UI Tools**  
| Tool | File | Description |  
|------|------|-------------|  
| \[Component\] | tools/ui/\[component\].tool.md | \[Description\] |

**\*\*Total: \[N\] tool files\*\***  
\`\`\`

**\*\*File: \`knowledge/workflows.md\`\*\***

\`\`\`markdown  
**\# Workflow Index**

**\#\# Shared Workflows**  
| Workflow | File | Risk Level | Description |  
|----------|------|-----------|-------------|  
| \[Name\] | workflows/shared/\[name\].workflow.md | \[Level\] | \[Description\] |

**\#\# \[Module\] Workflows**  
| Workflow | File | Risk Level | Key Skills | Key Tools |  
|----------|------|-----------|-----------|-----------|  
| \[Name\] | workflows/\[module\]/\[name\].workflow.md | \[Level\] | \[skill\] | \[tool\] |

**\*\*Total: \[N\] workflow files\*\***  
\`\`\`

\---

**\#\# Part D — Task Dependency Graph (PRD.json)**

A machine-readable JSON file that defines all tasks and their dependencies. AI agents can parse this to understand project structure.

**\*\*File: \`knowledge/PRD.json\`\*\***

\`\`\`json  
\[  
  {  
    "id": "project-init",  
    "description": "Initialize project with core dependencies",  
    "passes": false,  
    "priority": 100,  
    "dependencies": \[\],  
    "category": "phase1-foundation",  
    "files": \["package.json", "vite.config.ts", "tsconfig.json"\],  
    "test\_command": "npm run build",  
    "blockedBy": \[\],  
    "model": "opus",  
    "assignee": "agent-1"  
  },  
  {  
    "id": "database-schema",  
    "description": "Create core database schema",  
    "passes": false,  
    "priority": 99,  
    "dependencies": \["project-init"\],  
    "category": "phase1-foundation",  
    "files": \["supabase/migrations/00001\_core\_schema.sql"\],  
    "test\_command": "npx supabase db push",  
    "blockedBy": \["project-init"\],  
    "model": "opus",  
    "assignee": "agent-2"  
  },  
  {  
    "id": "auth-flow",  
    "description": "Implement authentication",  
    "passes": false,  
    "priority": 98,  
    "dependencies": \["database-schema"\],  
    "category": "phase1-foundation",  
    "files": \["src/features/auth/\*\*/\*"\],  
    "test\_command": "npx tsc \--noEmit",  
    "blockedBy": \["database-schema"\],  
    "model": "opus",  
    "assignee": "agent-1"  
  }  
\]  
\`\`\`

**\#\#\# PRD.json field reference**

| Field | Type | Description |  
|-------|------|-------------|  
| \`id\` | \`string\` | Unique task identifier (kebab-case) |  
| \`description\` | \`string\` | What to build |  
| \`passes\` | \`boolean\` | Does the test\_command pass? (updated as work progresses) |  
| \`priority\` | \`number\` | 1–100, higher \= do first |  
| \`dependencies\` | \`string\[\]\` | Task IDs that must pass first |  
| \`category\` | \`string\` | Phase/group (e.g., \`phase1-foundation\`) |  
| \`files\` | \`string\[\]\` | Files this task creates or modifies |  
| \`test\_command\` | \`string\` | How to verify the task is done |  
| \`blockedBy\` | \`string\[\]\` | Tasks that currently block this one |  
| \`model\` | \`string\` | Recommended AI model (opus, sonnet, haiku) |  
| \`assignee\` | \`string\` | Which agent owns this task |

**\#\#\# When to use PRD.json vs project\_tasks**

| | PRD.json | project\_tasks |  
|---|---------|---------------|  
| **\*\*Format\*\*** | JSON file in repo | PostgreSQL table |  
| **\*\*Best for\*\*** | Initial project planning, Codex/CI parsing | Runtime task management, UI dashboard |  
| **\*\*Updated by\*\*** | Manual edits or scripts | SQL mutations from agents |  
| **\*\*Stateful\*\*** | \`passes: true/false\` | \`status: pending/in\_progress/completed/blocked\` |

Use both: PRD.json for the initial plan, project\_tasks for real-time execution.

\---

**\#\# Part E — Coding Rules**

Rule files in \`.claude/rules/\` enforce conventions. Each is a focused document.

**\#\#\# architecture.md**

\`\`\`markdown  
**\# Architecture Rules**

**\#\# Feature-First Organization**  
\- Group by domain, not by file type  
\- Each feature has: \`hooks/\`, \`api/\`, \`components/\`, \`types.ts\`  
\- Shared code lives in \`src/hooks/\`, \`src/lib/\`, \`src/components/common/\`

**\#\# Data Flow**  
\- **\*\*Server state\*\***: \[Your state manager\] manages fetching, caching, invalidation  
\- **\*\*Query keys\*\***: Factory pattern — NEVER use inline key arrays  
\- **\*\*Optimistic updates\*\***: Only for low-risk, high-frequency actions

**\#\# Routing**  
\- Lazy-loaded via \`React.lazy()\` \+ \`Suspense\`  
\- Route guards for auth, roles, permissions  
\`\`\`

**\#\#\# code-style.md**

\`\`\`markdown  
**\# Code Style Conventions**

**\#\# TypeScript**  
\- Strict mode, no \`any\` types  
\- \`interface\` for object shapes, \`type\` for unions/intersections

**\#\# Naming**  
\- **\*\*Components\*\***: PascalCase, one per file  
\- **\*\*Hooks\*\***: camelCase with \`use\` prefix  
\- **\*\*Utilities\*\***: kebab-case  
\- **\*\*Database\*\***: snake\_case everywhere  
\- **\*\*Constants\*\***: UPPER\_SNAKE\_CASE

**\#\# Imports**  
\- Use \`@/\` path alias  
\- Group: external → internal libs → components → types  
\`\`\`

**\#\#\# database.md**

\`\`\`markdown  
**\# Database Conventions**

**\#\# Common Columns (every org-scoped table)**  
\`\`\`sql  
id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
created\_at      TIMESTAMPTZ NOT NULL DEFAULT now(),  
updated\_at      TIMESTAMPTZ NOT NULL DEFAULT now()  
\`\`\`

**\#\# RLS Pattern**  
\`\`\`sql  
ALTER TABLE \[table\] ENABLE ROW LEVEL SECURITY;  
CREATE POLICY "\[table\]\_select" ON \[table\]  
  FOR SELECT USING (organization\_id IN (SELECT get\_user\_org\_ids()));  
\-- INSERT, UPDATE, DELETE follow same pattern  
\`\`\`

**\#\# Migrations**  
\- Forward-only, numbered sequentially  
\- NEVER modify existing migrations  
\- Each migration is self-contained  
\`\`\`

\#\#\# task-process.md

See the \[TASK-SYSTEM-TEMPLATE.md\](./TASK-SYSTEM-TEMPLATE.md) for the complete task process template.

\#\#\# testing.md

\`\`\`markdown  
\# Testing Conventions

\#\# What to Test  
\- Business rule enforcement  
\- Permission boundary checks  
\- Data transformation accuracy  
\- Edge cases from tool specs

\#\# What NOT to Test  
\- UI library rendering  
\- Client initialization  
\- Static config objects  
\- Generated types  
\`\`\`

\---

**\#\# Part F — Task Tracking Database**

See the companion document \[TASK-SYSTEM-TEMPLATE.md\](./TASK-SYSTEM-TEMPLATE.md) for the complete database schema, React hook, UI components, gamification levels, and migration templates.

**\*\*Quick summary\*\***: A \`project\_tasks\` table with task\_code, status, priority, dependencies, xp\_reward, and wat\_references. A React dashboard at \`/project-tracker\`. AI agents query and update tasks via SQL.

\---

**\#\# Part G — Integration Checklist**

**\#\#\# For any project**

\- \[ \] Create \`.claude/CLAUDE.md\` with your project overview  
\- \[ \] Create \`.claude/rules/\` with at minimum \`code-style.md\`, \`database.md\`, \`task-process.md\`  
\- \[ \] Create \`knowledge/\` directory structure  
\- \[ \] Create \`knowledge/prod.md\` with your domain reference  
\- \[ \] Create index files: \`knowledge/skills.md\`, \`knowledge/tools.md\`, \`knowledge/workflows.md\`  
\- \[ \] Create \`knowledge/PRD.json\` with your task graph  
\- \[ \] Run the \`project\_tasks\` migration (from TASK-SYSTEM-TEMPLATE.md)  
\- \[ \] Seed your Phase 1 tasks  
\- \[ \] Add the project tracker UI (from TASK-SYSTEM-TEMPLATE.md)  
\- \[ \] Register \`/project-tracker\` route

**\#\#\# For multi-agent setups**

\- \[ \] Create \`AGENTS.md\` at repo root for secondary agent  
\- \[ \] Set \`assigned\_to\` CHECK constraint with all agent names  
\- \[ \] Assign tasks by specialization  
\- \[ \] Test that each agent can query its own task queue

**\#\#\# For knowledge-heavy projects**

\- \[ \] Create skill files for each module (\`knowledge/skills/\[module\]/\[module\].skill.md\`)  
\- \[ \] Create tool files for each entity (\`knowledge/tools/db/\[entity\]-crud.tool.md\`)  
\- \[ \] Create workflow files for each process (\`knowledge/workflows/\[module\]/\[name\].workflow.md\`)  
\- \[ \] Reference them in task \`wat\_references\` arrays  
\- \[ \] Keep index files (\`skills.md\`, \`tools.md\`, \`workflows.md\`) up to date

\---

**\#\# Greenfield Quick Start**

Starting a brand new project? Do this:

\`\`\`  
1\. npm create vite@latest my-project \-- \--template react-ts  
2\. cd my-project

3\. mkdir \-p .claude/rules  
4\. mkdir \-p knowledge/{skills/shared,tools/db,tools/api,workflows/shared}

5\. \# Create CLAUDE.md (copy template from Part A, fill in your details)  
6\. \# Create rules files (copy from Part E, customize)  
7\. \# Create prod.md (start with Part 1: Platform Overview, add modules as you go)  
8\. \# Create PRD.json (define your Phase 1 tasks)

9\. \# Run the project\_tasks migration (from TASK-SYSTEM-TEMPLATE.md)  
10\. \# Seed Phase 1 tasks  
11\. \# Add tracker UI

12\. \# Start working — the AI agent follows the task protocol from here  
\`\`\`

**\*\*Phase 1 starter tasks\*\*** (adapt to your project):

| Code | Title | Agent | Priority |  
|------|-------|-------|----------|  
| P1-01 | Project scaffolding \+ deps | agent-1 | 100 |  
| P1-02 | Core database schema | agent-2 | 99 |  
| P1-03 | Auth system | agent-1 | 98 |  
| P1-04 | Route guards \+ layouts | agent-1 | 97 |  
| P1-05 | Common components | agent-2 | 96 |

\---

**\#\# Brownfield Quick Start**

Adding to an existing project? Do this:

\`\`\`  
1\. mkdir \-p .claude/rules  
2\. mkdir \-p knowledge/{skills/shared,tools/db,tools/api,workflows/shared}

3\. \# Create CLAUDE.md — document YOUR EXISTING project structure, stack, conventions  
4\. \# Create rules files — codify your existing conventions (don't invent new ones)  
5\. \# Create prod.md — document what's already built  
6\. \# Create PRD.json — define your NEXT phase of work (not past work)

7\. \# Run the project\_tasks migration  
8\. \# Create a "Phase 0" seed migration marking existing work as complete  
9\. \# Seed your next phase as pending tasks  
10\. \# Add tracker UI

11\. \# Start working  
\`\`\`

**\*\*Brownfield Phase 0\*\*** — mark what's done:

\`\`\`sql  
INSERT INTO project\_tasks (task\_code, title, phase, category,  
  assigned\_to, priority, xp\_reward, status, progress\_pct, completed\_at)  
VALUES  
  ('P0-01', 'Initial project setup', 'phase0', 'infra',  
   'human', 100, 15, 'completed', 100, now()),  
  ('P0-02', 'Auth system', 'phase0', 'feature',  
   'human', 95, 25, 'completed', 100, now()),  
  ('P0-03', 'Core schema', 'phase0', 'infra',  
   'human', 90, 30, 'completed', 100, now())  
ON CONFLICT (task\_code) DO NOTHING;  
\`\`\`

Then seed Phase 1 (your next work) as pending tasks.

**\*\*Knowledge base tip for brownfield\*\***: You don't need to document everything at once. Create knowledge files on-demand as you create tasks that need them. Start with \`prod.md\` (overview) and add skill/tool/workflow files as each module gets its own task.

\---

**\#\# Scaling Reference**

| Project Size | Knowledge Files | Tasks | Phases | Agents |  
|-------------|----------------|-------|--------|--------|  
| **\*\*Small\*\*** (1 module, solo) | 3–5 | 10–20 | 1–2 | 1 |  
| **\*\*Medium\*\*** (5 modules, 1 team) | 15–30 | 30–80 | 3–6 | 1–2 |  
| **\*\*Large\*\*** (15+ modules, multi-team) | 50–100 | 100–200 | 8–15 | 2–3 |  
| **\*\*Enterprise\*\*** (30+ modules) | 100+ | 200+ | 15+ | 3+ |

The system scales linearly — more modules means more knowledge files and tasks, but the framework stays the same.

\---

*\*Framework version 1.0 — extracted from a production system with 200+ tasks, 128 knowledge files, 50+ migrations, 33 modules, and 4 AI agents.\**

