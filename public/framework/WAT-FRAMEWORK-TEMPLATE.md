**\# WAT Framework — Complete Template**

\> **\*\*Workflows, Agents, Tools\*\*** — A composable, three-layer knowledge architecture for AI-powered projects. Drop into any project to give AI coding agents structured domain knowledge, process definitions, and atomic operation specs.

\---

**\#\# Table of Contents**

1\. \[What Is the WAT Framework?\](\#1-what-is-the-wat-framework)  
2\. \[Architecture Overview\](\#2-architecture-overview)  
3\. \[Directory Structure Template\](\#3-directory-structure-template)  
4\. \[Component Relationships\](\#4-component-relationships)  
5\. \[The Four File Types\](\#5-the-four-file-types)  
6\. \[Index File Templates\](\#6-index-file-templates)  
7\. \[Skill File Templates\](\#7-skill-file-templates)  
8\. \[Workflow File Templates\](\#8-workflow-file-templates)  
9\. \[Tool File Templates\](\#9-tool-file-templates)  
10\. \[Agent Specification Template\](\#10-agent-specification-template)  
11\. \[Human-in-the-Loop Patterns\](\#11-human-in-the-loop-patterns)  
12\. \[Error Recovery and Self-Healing\](\#12-error-recovery-and-self-healing)  
13\. \[Learning and Optimization\](\#13-learning-and-optimization)  
14\. \[CLAUDE.md Integration\](\#14-claudemd-integration)  
15\. \[Sizing Guide\](\#15-sizing-guide)  
16\. \[Examples for Different Project Types\](\#16-examples-for-different-project-types)  
17\. \[Integration Checklist\](\#17-integration-checklist)

\---

**\#\# 1\. What Is the WAT Framework?**

The **\*\*WAT (Workflows, Agents, Tools)\*\*** framework organizes project intelligence into three composable layers plus a domain knowledge foundation:

\`\`\`  
WAT FRAMEWORK  
\=============

┌─────────────────────────────────────────────────────────────┐  
│                                                             │  
│   SKILLS (Foundation Layer)                                 │  
│   Domain knowledge: entities, rules, terminology            │  
│   → WHAT to build                                           │  
│                                                             │  
│   ┌─────────────────────────────────────────────────────┐   │  
│   │                                                     │   │  
│   │   WORKFLOWS (Process Layer)                         │   │  
│   │   Multi-step procedures: triggers, steps, cascades  │   │  
│   │   → WHEN things happen                              │   │  
│   │                                                     │   │  
│   │   ┌─────────────────────────────────────────────┐   │   │  
│   │   │                                             │   │   │  
│   │   │   TOOLS (Action Layer)                      │   │   │  
│   │   │   Atomic operations: CRUD, APIs, UI specs   │   │   │  
│   │   │   → HOW to build it                         │   │   │  
│   │   │                                             │   │   │  
│   │   └─────────────────────────────────────────────┘   │   │  
│   │                                                     │   │  
│   └─────────────────────────────────────────────────────┘   │  
│                                                             │  
│   AGENTS (Orchestration Layer)                              │  
│   AI behavior specs: classification, delegation, safety     │  
│   → WHO does it                                             │  
│                                                             │  
└─────────────────────────────────────────────────────────────┘  
\`\`\`

**\*\*Why four layers?\*\***

| Layer | Answers | Without It |  
|-------|---------|------------|  
| **\*\*Skills\*\*** | WHAT is the domain? | Agent builds features without understanding the business |  
| **\*\*Workflows\*\*** | WHEN do things happen? | Agent implements steps out of order or misses cascades |  
| **\*\*Tools\*\*** | HOW do I build it? | Agent guesses at schemas, API contracts, and UI patterns |  
| **\*\*Agents\*\*** | WHO does it and how do they behave? | AI agents lack safety rules, delegation patterns, risk awareness |

**\*\*The core principle:\*\*** An AI agent reads a **\*\*Skill\*\*** to understand the domain, follows a **\*\*Workflow\*\*** to execute the process, invokes **\*\*Tools\*\*** to perform each step, and obeys **\*\*Agent\*\*** rules to stay safe.

\---

**\#\# 2\. Architecture Overview**

\`\`\`  
                    ┌───────────────────┐  
                    │   User Input      │  
                    │  (NL command,     │  
                    │   UI action,      │  
                    │   webhook, cron)  │  
                    └────────┬──────────┘  
                             │  
                             ▼  
┌────────────────────────────────────────────────────────┐  
│                   AGENT LAYER                          │  
│  (agent-spec.md / grace-agent.md)                      │  
│                                                        │  
│  • Interprets input                                    │  
│  • Maintains context                                   │  
│  • Selects the right workflow                          │  
│  • Enforces safety rules                               │  
│  • Handles errors and learns                           │  
└───────────────────────┬────────────────────────────────┘  
                        │  
                        ▼  
┌────────────────────────────────────────────────────────┐  
│                   WORKFLOW LAYER                        │  
│  (workflows/\*.workflow.md)                              │  
│                                                        │  
│  • Defines step-by-step procedures                     │  
│  • References skills for domain knowledge              │  
│  • Invokes tools for atomic actions                    │  
│  • Handles edge cases and rollback                     │  
└───────────┬────────────────────────────┬───────────────┘  
            │                            │  
            ▼                            ▼  
┌───────────────────────┐   ┌───────────────────────────┐  
│     SKILL LAYER       │   │       TOOL LAYER          │  
│  (skills/\*.skill.md)  │   │   (tools/\*.tool.md)       │  
│                       │   │                           │  
│  • Domain knowledge   │   │  • Atomic actions         │  
│  • Entity schemas     │   │  • CRUD specifications    │  
│  • Business rules     │   │  • API endpoint specs     │  
│  • Industry terms     │   │  • UI component specs     │  
│  • Cascade triggers   │   │  • Automation specs       │  
└───────────────────────┘   └───────────────────────────┘  
\`\`\`

**\*\*Data flow:\*\***  
1\. Input arrives (NL command, button click, webhook, schedule)  
2\. Agent classifies intent, assembles context, selects workflow  
3\. Workflow loads relevant skills for domain knowledge  
4\. Workflow invokes tools to execute each step  
5\. Results cascade to downstream workflows  
6\. Agent logs audit trail and extracts learning

\---

**\#\# 3\. Directory Structure Template**

\`\`\`  
knowledge/                              \# Root knowledge directory  
├── README.md                           \# Optional: brief overview  
├── skills.md                           \# Skill index (master manifest)  
├── tools.md                            \# Tool index (master manifest)  
├── workflows.md                        \# Workflow index (master manifest)  
├── prod.md                             \# Full domain reference (optional)  
├── PRD.json                            \# Task dependency graph (optional)  
│  
├── skills/                             \# Domain knowledge (WHAT)  
│   ├── shared/                         \# Cross-cutting concerns  
│   │   ├── {{concern-1}}.skill.md      \# e.g., orchestration, auth, audit  
│   │   ├── {{concern-2}}.skill.md  
│   │   └── ...  
│   ├── {{module-a}}/                   \# Per-module domain knowledge  
│   │   └── {{module-a}}.skill.md  
│   ├── {{module-b}}/  
│   │   └── {{module-b}}.skill.md  
│   └── {{agent-name}}/                 \# AI agent behavior (if applicable)  
│       └── {{agent-name}}.skill.md  
│  
├── workflows/                          \# Process definitions (WHEN)  
│   ├── shared/                         \# Platform-level processes  
│   │   ├── {{process-1}}.workflow.md   \# e.g., orchestration, approval, onboarding  
│   │   └── ...  
│   ├── {{module-a}}/                   \# Per-module workflows  
│   │   ├── {{workflow-1}}.workflow.md  
│   │   └── {{workflow-2}}.workflow.md  
│   └── ai/                             \# AI agent workflows (if applicable)  
│       └── {{agent}}-{{process}}.workflow.md  
│  
└── tools/                              \# Atomic operations (HOW)  
    ├── db/                             \# Database CRUD specifications  
    │   ├── {{entity}}-crud.tool.md  
    │   └── ...  
    ├── api/                            \# API endpoint specifications  
    │   ├── {{function}}.tool.md  
    │   └── ...  
    ├── ui/                             \# UI component specifications  
    │   ├── {{component}}.tool.md  
    │   └── ...  
    └── automation/                     \# Automation engine specifications  
        ├── {{engine}}.tool.md  
        └── ...  
\`\`\`

\<\!-- CUSTOMIZE: Adjust directories to match your project.  
     \- No AI agents? Remove skills/{{agent}}/ and workflows/ai/  
     \- No UI? Remove tools/ui/  
     \- API-only? Keep tools/db/ and tools/api/, drop tools/ui/  
     \- Monolith? Flatten module directories if you have \< 5 modules  
\--\>

\---

**\#\# 4\. Component Relationships**

**\#\#\# How a Single User Action Flows Through All Layers**

\`\`\`  
User: "Record a $250 donation from Sarah Thompson for Spring Campaign"

AGENT LAYER:  
  ├── Classify intent: "record\_donation"  
  ├── Select workflow: donation-processing.workflow.md  
  └── Load context: user profile, org settings, permissions

WORKFLOW LAYER (donation-processing.workflow.md):  
  ├── Step 1: Load Skill → donations/donations.skill.md  
  │   └── Agent learns: entity schema, business rules, cascade triggers  
  ├── Step 2: Invoke Tool → db/contacts-crud.tool.md (lookup)  
  │   └── Find or create donor "Sarah Thompson"  
  ├── Step 3: Invoke Tool → db/donations-crud.tool.md (create)  
  │   └── Insert donation record: $250, Spring Campaign  
  ├── Step 4: Load Skill → shared/cascade-engine.skill.md  
  │   └── Agent learns: cascade evaluation rules  
  ├── Step 5: Invoke Tool → automation/cascade-executor.tool.md  
  │   └── Fire cascades: update campaign total, donor tier, dashboard  
  ├── Step 6: Invoke Tool → api/send-email.tool.md  
  │   └── Send thank-you receipt  
  └── Step 7: Audit log entry created

SKILL LAYER (loaded during Steps 1, 4):  
  └── Provides: entity schemas, validation rules, cascade definitions

TOOL LAYER (invoked during Steps 2, 3, 5, 6):  
  └── Executes: database queries, API calls, automation dispatches  
\`\`\`

**\#\#\# Component Dependency Matrix**

\`\`\`  
WHO DEPENDS ON WHOM  
\===================

Agent ──reads──→ Skills     (to understand the domain)  
Agent ──selects─→ Workflows (to choose the right process)  
Agent ──obeys──→ Agent Spec (its own safety rules)

Workflows ──reference──→ Skills   (for domain context at each step)  
Workflows ──invoke─────→ Tools    (for atomic actions at each step)

Skills ──cross-reference──→ Other Skills (via "Related Skills" section)  
Tools  ──are independent──→ (tools don't reference other tools directly)  
\`\`\`

**\#\#\# When to Load Each File Type**

| Situation | Load |  
|-----------|------|  
| Starting a new task | **\*\*Skill index\*\*** → find relevant skill → load it |  
| Implementing a multi-step process | **\*\*Workflow index\*\*** → find workflow → load it |  
| Writing a specific CRUD operation | **\*\*Tool index\*\*** → find tool spec → load it |  
| Building AI agent behavior | **\*\*Agent spec\*\*** \+ agent's **\*\*Skill\*\*** file |  
| Cross-module feature | Multiple **\*\*Skills\*\*** \+ relevant **\*\*Workflow\*\*** |

\---

**\#\# 5\. The Four File Types**

**\#\#\# Quick Comparison**

| Aspect | Skill | Workflow | Tool | Agent Spec |  
|--------|-------|----------|------|------------|  
| **\*\*Purpose\*\*** | Domain knowledge | Process definition | Atomic operation | AI behavior rules |  
| **\*\*Answers\*\*** | WHAT is the domain? | WHEN do things happen? | HOW do I build it? | WHO does it, safely? |  
| **\*\*Contains\*\*** | Entities, rules, terms | Steps, cascades, rollback | Input/output/error specs | Modes, safety, delegation |  
| **\*\*File suffix\*\*** | \`.skill.md\` | \`.workflow.md\` | \`.tool.md\` | \`.md\` (one file) |  
| **\*\*Loaded when\*\*** | Understanding a module | Implementing a process | Coding a specific operation | Building agent behavior |  
| **\*\*Typical count\*\*** | 10-40 files | 10-50 files | 20-50 files | 1-4 files |  
| **\*\*Typical length\*\*** | 100-400 lines | 60-130 lines | 50-150 lines | 100-300 lines |

**\#\#\# Decision Tree: Which File Type Do I Need?**

\`\`\`  
I'm building something new. What knowledge file should I create?

Is it a new business domain or module?  
  YES → Create a SKILL file  
    Does it have database tables?  
      YES → Also create TOOL files (one per entity CRUD)  
    Does it have API endpoints?  
      YES → Also create TOOL files (one per endpoint)  
    Does it have multi-step processes?  
      YES → Also create WORKFLOW files (one per process)  
  NO →  
    Is it a multi-step process triggered by an event?  
      YES → Create a WORKFLOW file  
        Does the workflow use new operations?  
          YES → Also create TOOL files for new operations  
      NO →  
        Is it a single atomic operation (CRUD, API, UI)?  
          YES → Create a TOOL file  
          NO →  
            Is it AI agent behavior?  
              YES → Create an AGENT SPEC (or update existing)  
              NO → Probably doesn't need a knowledge file  
\`\`\`

\---

**\#\# 6\. Index File Templates**

Every knowledge base has three index files — one per knowledge type.

**\#\#\# skills.md Template**

\`\`\`\`markdown  
**\# Skill Index**

Auto-generated index of all skill files in the knowledge base.

**\#\# Shared Skills**

| Skill | File | Description | Triggers |  
|-------|------|-------------|----------|  
| {{Name}} | skills/shared/{{name}}.skill.md | {{Description}} | {{When relevant}} |

**\#\# Module Skills**

| \# | Module | File | Key Entities | Available Actions |  
|---|--------|------|-------------|-------------------|  
| 1 | {{Module}} | skills/{{module}}/{{module}}.skill.md | {{entities}} | {{actions}} |

**\*\*Total: {{N}} skill files\*\*** ({{X}} shared \+ {{Y}} modules)  
\`\`\`\`

**\#\#\# workflows.md Template**

\`\`\`\`markdown  
**\# Workflow Index**

Auto-generated index of all workflow files in the knowledge base.

**\#\# Shared Workflows ({{N}})**

| Workflow | File | Risk Level | Description |  
|----------|------|-----------|-------------|  
| {{Name}} | workflows/shared/{{name}}.workflow.md | {{Risk}} | {{Description}} |

**\#\# {{Module}} Workflows ({{N}})**

| Workflow | File | Risk Level | Key Skills | Key Tools |  
|----------|------|-----------|-----------|-----------|  
| {{Name}} | workflows/{{module}}/{{name}}.workflow.md | {{Risk}} | {{skills}} | {{tools}} |

**\*\*Total: {{N}} workflow files\*\*** ({{X}} shared \+ {{Y}} module)  
\`\`\`\`

**\#\#\# tools.md Template**

\`\`\`\`markdown  
**\# Tool Index**

Auto-generated index of all tool files in the knowledge base.

**\#\# Database Tools ({{N}})**

| Tool | File | Key Operations | Primary Entity |  
|------|------|---------------|----------------|  
| {{Entity}} CRUD | tools/db/{{entity}}-crud.tool.md | Create, Read, Update, Delete | {{table\_name}} |

**\#\# API Tools ({{N}})**

| Tool | File | Edge Function | Auth Required |  
|------|------|--------------|--------------|  
| {{Name}} | tools/api/{{name}}.tool.md | {{function-name}} | {{Yes/No}} ({{auth type}}) |

**\#\# UI Tools ({{N}})**

| Tool | File | Description |  
|------|------|-------------|  
| {{Name}} | tools/ui/{{name}}.tool.md | {{Description}} |

**\#\# Automation Tools ({{N}})**

| Tool | File | Description |  
|------|------|-------------|  
| {{Name}} | tools/automation/{{name}}.tool.md | {{Description}} |

**\*\*Total: {{N}} tool files\*\*** ({{X}} DB \+ {{Y}} API \+ {{Z}} UI \+ {{W}} automation)  
\`\`\`\`

\<\!-- NOTE: For full index templates with annotations, see the companion files:  
     \- docs/SKILL-INDEX-TEMPLATE.md  
     \- docs/WORKFLOW-INDEX-TEMPLATE.md  
     (Tool index template follows the same pattern)  
\--\>

\---

**\#\# 7\. Skill File Templates**

Skills are domain knowledge files. Three archetypes:

**\#\#\# Shared Skill (cross-cutting concern)**

\`\`\`  
\# {{Skill Title}}

\#\# Metadata  
| Field | Value |  
|-------|-------|  
| Skill ID | \`shared/{{name}}\` |  
| Description | {{one-line}} |  
| Category | shared |  
| Version | 1.0.0 |  
| Triggers | {{when relevant}} |  
| Capabilities | {{what it enables}} |  
| Depends On | {{other skills}} |  
| Used By | {{who uses it}} |

\#\# Core Instructions  
\#\#\# Overview  
{{What this system does, why it exists, how it fits.}}

\#\#\# {{Key Concept 1}}  
{{Detailed explanation with examples.}}

\#\# Decision Trees  
\#\#\# {{Classification Name}}  
Is condition X? YES → A / NO → B

\#\# Business Rules  
1\. \*\*{{Rule}}\*\* — {{description}}

\#\# Usage Guidelines  
\#\#\# For Frontend / Backend / AI Agents  
{{Code snippets and patterns.}}

\#\# Examples  
\#\#\# Example 1: {{case}}  
{{Step-by-step trace.}}

\#\# Related Skills  
\- \`{{skill-id}}\` — {{relationship}}  
\`\`\`

**\#\#\# Module Skill (domain module)**

\`\`\`  
\# {{Module}} Module Skill

\#\# Metadata  
\- \*\*Module\*\*: {{Name}}  
\- \*\*Route\*\*: \`/{{route}}\`  
\- \*\*Category\*\*: {{group}}  
\- \*\*Dependencies\*\*: {{modules}}  
\- \*\*Permission Scope\*\*: \`{{module}}:read\`, \`{{module}}:write\`, \`{{module}}:delete\`

\#\# Core Instructions  
\#\#\# Purpose  
{{What and why.}}

\#\#\# Available Actions  
| Action | Description | Permission |  
|--------|-------------|-----------|  
| \`{{action}}\` | {{desc}} | \`{{perm}}\` |

\#\#\# Entity Schemas  
\#\#\#\# {{table\_name}}  
| Field | Type | Required | Description |  
|-------|------|----------|-------------|

\#\# Business Rules  
1\. {{Rule}}

\#\# Cascade Triggers  
| Event | Cascade Action |  
|-------|---------------|

\#\# Industry Terminology  
| Concept | {{Industry 1}} | {{Industry 2}} |  
|---------|---------------|---------------|

\#\# NL Command Classification  
| Intent | Example Utterances |  
|--------|-------------------|

\#\# Examples  
\#\#\# Example 1  
{{Action trace.}}  
\`\`\`

**\#\#\# AI Agent Skill (agent behavior)**

\`\`\`  
\# {{Agent}} AI

\#\# Metadata  
| Field | Value |  
|-------|-------|  
| Skill ID | \`{{agent}}/{{agent}}\` |  
| Category | ai-agent |  
| Edge Functions | \`{{func-1}}\`, \`{{func-2}}\` |  
| Depends On | {{skills}} |

\#\# Core Instructions  
\#\#\# Purpose  
{{What this agent does.}}

\#\#\# Interaction Modes  
\#\#\#\# {{Mode}} ({{speed}})  
\- Trigger: {{what activates}}  
\- Behavior: {{what happens}}

\#\#\# NL Command Classification  
{{Decision tree.}}

\#\# Business Rules  
1\. {{Safety rule}}

\#\# Examples  
\#\#\# Example 1: {{scenario}}  
{{Full classification \+ response trace.}}  
\`\`\`

\<\!-- NOTE: For the full skill template with annotations, see docs/SKILL-INDEX-TEMPLATE.md \--\>

\---

**\#\# 8\. Workflow File Templates**

Workflows are process definitions. Four archetypes:

**\#\#\# Every Workflow Step Must Have 5 Sub-Sections**

\`\`\`markdown  
**\#\#\# Step N: {{Name}}**  
\- **\*\*Action\*\***: {{WHAT happens — detailed description}}  
\- **\*\*Tool\*\***: {{WHAT system does it — tool ID or function name}}  
\- **\*\*Input\*\***: {{WHAT data goes in — field names, types, sources}}  
\- **\*\*Output\*\***: {{WHAT data comes out — field names, where it goes}}  
\- **\*\*Failure\*\***: {{WHAT happens when it breaks — error codes, recovery, impact}}  
\`\`\`

This is non-negotiable. Steps missing sub-sections produce incomplete implementations.

**\#\#\# Common Workflow Structure**

\`\`\`  
\# {{Workflow Title}}

\#\# Metadata  
\- \*\*ID\*\*: {{kebab-case-id}}  
\- \*\*Trigger\*\*: {{what starts it}}  
\- \*\*Risk Level\*\*: {{low | medium | high}}  
\- \*\*Modules Involved\*\*: {{list}}  
\- \*\*Skills Used\*\*: {{skill IDs}}  
\- \*\*Tools Used\*\*: {{tool IDs}}

\#\# Objective  
{{One sentence.}}

\#\# Preconditions  
\- {{What must be true before starting}}

\#\# Steps  
\#\#\# Step 1: {{Name}}  
\- \*\*Action\*\*: ...  
\- \*\*Tool\*\*: ...  
\- \*\*Input\*\*: ...  
\- \*\*Output\*\*: ...  
\- \*\*Failure\*\*: ...

\#\# Outputs  
\- {{What exists when done}}

\#\# Cascade Effects  
\- \*\*{{Name}}\*\*: {{What fires downstream}}

\#\# Edge Cases  
\- \*\*{{Case}}\*\*: {{How to handle}}

\#\# Rollback  
\- \*\*{{Action type}}\*\*: {{How to undo — reversible vs. non-reversible}}  
\`\`\`

**\#\#\# Archetype Differences**

| Archetype | Typical Steps | Key Characteristics |  
|-----------|--------------|---------------------|  
| **\*\*Shared / Infrastructure\*\*** | 5-10 | Dynamic risk, detailed failure handling, used by all modules |  
| **\*\*Domain / Module\*\*** | 4-8 | Static risk, clear happy path, entity-centric |  
| **\*\*High-Risk\*\*** | 6-10 | Always \`high\` risk, approval step, leadership notification, exhaustive rollback |  
| **\*\*AI Agent\*\*** | 8-12 | NL parsing, entity resolution, proposal UI, learning/archetype extraction |

\<\!-- NOTE: For the full workflow templates with annotations, see docs/WORKFLOW-INDEX-TEMPLATE.md \--\>

\---

**\#\# 9\. Tool File Templates**

Tools are atomic operation specifications. Four categories:

**\#\#\# Universal Tool Metadata**

\`\`\`markdown  
**\#\# Metadata**  
\- **\*\*Description\*\***: {{One-line purpose}}  
\- **\*\*Version\*\***: {{semver}}  
\- **\*\*Category\*\***: {{db | api | ui | automation}}  
\- **\*\*Dependencies\*\***: {{Other tools or services}}  
\- **\*\*Triggers\*\***: {{Events this tool emits after execution}}  
\- **\*\*Capabilities\*\***: {{Comma-separated list of what this tool does}}  
\`\`\`

**\#\#\# Universal Action Definition Format**

Every tool action uses this table format:

\`\`\`markdown  
**\#\#\# {{action\_name}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | {{Parameters with types, required flags, validation notes}} |  
| **\*\*Process\*\*** | {{Numbered steps describing the algorithm}} |  
| **\*\*Output\*\*** | {{Return object structure}} |  
| **\*\*Errors\*\*** | {{Error codes: UPPER\_SNAKE\_CASE with descriptions}} |  
\`\`\`

**\#\#\# Database Tool Template (\`tools/db/{{entity}}-crud.tool.md\`)**

\`\`\`\`markdown  
**\# {{Entity}} CRUD Tool**

**\#\# Metadata**  
\- **\*\*Description\*\***: CRUD operations for the \`{{table\_name}}\` table  
\- **\*\*Version\*\***: 1.0.0  
\- **\*\*Category\*\***: db  
\- **\*\*Dependencies\*\***: {{related tools, e.g., "db/audit-log-query"}}  
\- **\*\*Triggers\*\***: \`{{entity}}.created\`, \`{{entity}}.updated\`, \`{{entity}}.deleted\`  
\- **\*\*Capabilities\*\***: Create, Read, List, Update, Delete, Search, Bulk operations

**\#\# Schema**

\<\!-- ANNOTATION: The full table schema. Agents use this to write correct  
     INSERT/UPDATE statements and type definitions. \--\>

| Column | Type | Nullable | Default | Description |  
|--------|------|----------|---------|-------------|  
| \`id\` | \`uuid\` | NO | \`uuid\_generate\_v4()\` | Primary key |  
| \`organization\_id\` | \`uuid\` | NO | — | FK to organizations (tenant) |  
| \`{{field}}\` | \`{{type}}\` | {{YES/NO}} | {{default}} | {{description}} |  
| \`created\_at\` | \`timestamptz\` | NO | \`now()\` | Record creation |  
| \`updated\_at\` | \`timestamptz\` | NO | \`now()\` | Last modification |

**\*\*Indexes\*\***: \`idx\_{{table}}\_org\_id\`, \`idx\_{{table}}\_{{field}}\`  
**\*\*RLS\*\***: Enabled. Policy: \`organization\_id \= ANY(get\_user\_org\_ids())\`

**\#\# Core Actions**

**\#\#\# create\_{{entity}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | \`{ organization\_id: uuid (required), {{field}}: {{type}} (required), ... }\` |  
| **\*\*Process\*\*** | 1\. Validate required fields. 2\. Check uniqueness constraints. 3\. INSERT record. 4\. Fire \`{{entity}}.created\` trigger. 5\. Return created record with generated \`id\`. |  
| **\*\*Output\*\*** | \`{ data: {{Entity}}Record, error: null }\` |  
| **\*\*Errors\*\*** | \`MISSING\_REQUIRED\_FIELD\`: A required field was not provided. \`DUPLICATE\_{{FIELD}}\`: Uniqueness constraint violated. \`INVALID\_FK\`: Foreign key reference does not exist. |

**\#\#\# get\_{{entity}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | \`{ id: uuid (required), organization\_id: uuid (required) }\` |  
| **\*\*Process\*\*** | 1\. SELECT record by id. 2\. RLS enforces org scoping. 3\. Return record or null. |  
| **\*\*Output\*\*** | \`{ data: {{Entity}}Record | null, error: null }\` |  
| **\*\*Errors\*\*** | \`NOT\_FOUND\`: No record with the given id in this org. |

**\#\#\# list\_{{entities}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | \`{ organization\_id: uuid (required), filters?: { {{field}}: {{value}} }, sort?: { field: string, direction: 'asc' | 'desc' }, pagination?: { page: number, per\_page: number } }\` |  
| **\*\*Process\*\*** | 1\. Build query with filters. 2\. Apply sort (default: \`created\_at DESC\`). 3\. Apply pagination (default: page 1, 25 per page). 4\. Return results with total count. |  
| **\*\*Output\*\*** | \`{ data: {{Entity}}Record\[\], total: number, page: number, per\_page: number }\` |  
| **\*\*Errors\*\*** | \`INVALID\_FILTER\`: Unrecognized filter field. |

**\#\#\# update\_{{entity}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | \`{ id: uuid (required), organization\_id: uuid (required), {{field}}: {{new\_value}}, ... }\` |  
| **\*\*Process\*\*** | 1\. Verify record exists and is in org. 2\. Validate updated fields. 3\. UPDATE record, set \`updated\_at \= now()\`. 4\. Fire \`{{entity}}.updated\` trigger. 5\. Return updated record. |  
| **\*\*Output\*\*** | \`{ data: {{Entity}}Record, error: null }\` |  
| **\*\*Errors\*\*** | \`NOT\_FOUND\`: Record does not exist. \`INVALID\_TRANSITION\`: Status change is not allowed. |

**\#\#\# delete\_{{entity}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | \`{ id: uuid (required), organization\_id: uuid (required) }\` |  
| **\*\*Process\*\*** | 1\. Verify record exists. 2\. Soft-delete (set \`deleted\_at \= now()\`). 3\. Fire \`{{entity}}.deleted\` trigger. 4\. Return confirmation. |  
| **\*\*Output\*\*** | \`{ data: { id: uuid, deleted: true }, error: null }\` |  
| **\*\*Errors\*\*** | \`NOT\_FOUND\`: Record does not exist. \`HAS\_DEPENDENTS\`: Record has active child records. |  
\`\`\`\`

**\#\#\# API Tool Template (\`tools/api/{{function}}.tool.md\`)**

\`\`\`\`markdown  
**\# {{Function Name}} API Tool**

**\#\# Metadata**  
\- **\*\*Description\*\***: {{What this endpoint does}}  
\- **\*\*Version\*\***: 1.0.0  
\- **\*\*Category\*\***: api  
\- **\*\*Edge Function\*\***: \`{{function-name}}\`  
\- **\*\*Auth\*\***: {{Auth type: user session, API key, OAuth, etc.}}  
\- **\*\*Dependencies\*\***: {{Other tools invoked}}  
\- **\*\*Triggers\*\***: {{Events emitted}}  
\- **\*\*Capabilities\*\***: {{What this API enables}}

**\#\# Endpoint**

| Aspect | Details |  
|--------|---------|  
| **\*\*Method\*\*** | \`POST\` |  
| **\*\*Path\*\*** | \`/functions/v1/{{function-name}}\` |  
| **\*\*Content-Type\*\*** | \`application/json\` |  
| **\*\*Rate Limit\*\*** | {{N}} requests per minute per {{scope}} |

**\#\# Core Actions**

**\#\#\# {{primary\_action}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | \`{ {{field}}: {{type}}, {{field}}: {{type}} }\` |  
| **\*\*Process\*\*** | 1\. Validate auth token. 2\. {{Processing steps}}. 3\. Return response. |  
| **\*\*Output\*\*** | \`{ {{field}}: {{type}}, {{field}}: {{type}} }\` |  
| **\*\*Errors\*\*** | \`AUTH\_REQUIRED\`: No valid session. \`RATE\_LIMITED\`: Too many requests. \`INVALID\_INPUT\`: Malformed payload. |

**\#\# Processing Pipeline**

\<\!-- ANNOTATION: Use this for complex API tools that have an internal  
     multi-stage processing pipeline (like AI chat endpoints). \--\>

\`\`\`  
Input → {{Stage 1}} → {{Stage 2}} → {{Stage 3}} → Output  
\`\`\`

**\#\# Integration Guidelines**

\- {{How to call this endpoint from frontend/backend}}  
\- {{Auth setup requirements}}  
\- {{Rate limiting strategy}}  
\- {{Error handling patterns}}  
\`\`\`\`

**\#\#\# UI Tool Template (\`tools/ui/{{component}}.tool.md\`)**

\`\`\`\`markdown  
**\# {{Component Name}} UI Tool**

**\#\# Metadata**  
\- **\*\*Description\*\***: {{What this UI component does}}  
\- **\*\*Version\*\***: 1.0.0  
\- **\*\*Category\*\***: ui  
\- **\*\*Dependencies\*\***: {{Other tools/components}}  
\- **\*\*Triggers\*\***: {{User events emitted}}  
\- **\*\*Capabilities\*\***: {{What interactions it supports}}

**\#\# Core Actions**

**\#\#\# {{render\_action}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | \`{ {{prop}}: {{type}} }\` |  
| **\*\*Process\*\*** | 1\. {{Render logic}}. 2\. {{State management}}. 3\. {{Event handling}}. |  
| **\*\*Output\*\*** | {{What the component produces (user decision, data, etc.)}} |  
| **\*\*Errors\*\*** | \`INVALID\_STATE\`: Component cannot render in current state. |

**\#\#\# {{interaction\_action}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | {{User interaction data}} |  
| **\*\*Process\*\*** | {{What happens on interaction}} |  
| **\*\*Output\*\*** | {{Updated state or emitted event}} |  
| **\*\*Errors\*\*** | {{Validation or state errors}} |

**\#\# Integration Guidelines**

\- {{How to use this component in a page}}  
\- {{State persistence strategy}}  
\- {{Accessibility requirements}}

**\#\# Edge Cases**

\- **\*\*{{Case 1}}\*\***: {{How to handle}}  
\- **\*\*{{Case 2}}\*\***: {{How to handle}}  
\`\`\`\`

**\#\#\# Automation Tool Template (\`tools/automation/{{engine}}.tool.md\`)**

\`\`\`\`markdown  
**\# {{Engine Name}} Automation Tool**

**\#\# Metadata**  
\- **\*\*Description\*\***: {{What this automation does}}  
\- **\*\*Version\*\***: 1.0.0  
\- **\*\*Category\*\***: automation  
\- **\*\*Dependencies\*\***: {{Other tools}}  
\- **\*\*Triggers\*\***: {{Events that activate this automation}}  
\- **\*\*Capabilities\*\***: {{What it automates}}

**\#\# Core Actions**

**\#\#\# {{evaluate\_action}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | \`{ entity\_id: uuid, event\_type: string, context: {} }\` |  
| **\*\*Process\*\*** | 1\. {{Load rules}}. 2\. {{Match conditions}}. 3\. {{Classify dispatch type}}. |  
| **\*\*Output\*\*** | \`{ matched\_rules: Rule\[\], dispatched\_actions: Action\[\] }\` |  
| **\*\*Errors\*\*** | \`NO\_RULES\`: No rules configured. \`DEPTH\_EXCEEDED\`: Max recursion depth reached. \`CYCLE\_DETECTED\`: Circular dependency found. |

**\#\#\# {{execute\_action}}**

| Aspect | Details |  
|--------|---------|  
| **\*\*Input\*\*** | {{Action to execute}} |  
| **\*\*Process\*\*** | {{Execution logic with retry/backoff}} |  
| **\*\*Output\*\*** | {{Execution result}} |  
| **\*\*Errors\*\*** | {{Execution errors}} |

**\#\# Rules**

\<\!-- ANNOTATION: Hard constraints that the automation engine enforces.  
     These are non-negotiable limits. \--\>

\- **\*\*Max Depth\*\***: {{N}} — cascades cannot recurse beyond this depth  
\- **\*\*Cycle Detection\*\***: {{How cycles are detected and prevented}}  
\- **\*\*Failure Isolation\*\***: {{Failed automations don't block parent workflows}}  
\- **\*\*Rate Limiting\*\***: {{Max actions per minute/org}}

**\#\# Integration Guidelines**

\- {{How to register new rules}}  
\- {{How to invoke from workflows}}  
\- {{Priority ordering logic}}  
\`\`\`\`

\---

**\#\# 10\. Agent Specification Template**

The agent spec is a single file that defines how your AI agent(s) behave. Place it at the root of your knowledge directory or reference it from CLAUDE.md.

\`\`\`\`markdown  
**\# {{Agent Name}} — Agent Specification**

**\#\# Overview**

{{2-3 paragraphs describing:  
  \- What this agent does  
  \- How it interacts with users  
  \- What it can and cannot do  
  \- How it relates to other agents (if multi-agent)  
}}

**\#\# Interaction Modes**

**\#\#\# {{Mode 1}}: {{Fast / Simple}}**  
\- **\*\*When\*\***: {{Trigger condition}}  
\- **\*\*Behavior\*\***: {{Read-only? Single action? Q\&A?}}  
\- **\*\*Response time\*\***: {{Target}}

**\#\#\# {{Mode 2}}: {{Orchestrated / Complex}}**  
\- **\*\*When\*\***: {{Trigger condition}}  
\- **\*\*Behavior\*\***: {{Multi-step? Mutations? Approval required?}}  
\- **\*\*Response time\*\***: {{Target}}

**\#\#\# {{Mode 3}}: {{Proactive / Event-Driven}} (optional)**  
\- **\*\*When\*\***: {{System event trigger}}  
\- **\*\*Behavior\*\***: {{Suggestion card? Alert? Auto-action?}}  
\- **\*\*Response time\*\***: {{Target}}

**\#\# Workflow Selection**

\`\`\`  
Input received →  
  Classify intent:  
    Question (who/what/when/where/how/why)?  
      → Chat mode (read-only)  
    Command (create/update/delete/send)?  
      Count entities:  
        0 → Clarification request  
        1 entity, 1 action → Simple workflow  
        N entities or N actions → Orchestrated workflow  
    Ambiguous?  
      → Disambiguation prompt  
\`\`\`

**\#\# Safety Rules**

\<\!-- ANNOTATION: These are the guardrails. The agent MUST follow every  
     rule listed here. Write them as absolute statements. \--\>

1\. **\*\*{{Rule 1}}\*\***: {{e.g., Never mutate data without approval}}  
2\. **\*\*{{Rule 2}}\*\***: {{e.g., Enforce user's permission scope}}  
3\. **\*\*{{Rule 3}}\*\***: {{e.g., Log all interactions for audit}}  
4\. **\*\*{{Rule 4}}\*\***: {{e.g., Delegate analytics to specialized agent}}  
5\. **\*\*{{Rule 5}}\*\***: {{e.g., Sensitive operations require explicit confirmation}}

**\#\# Delegation Rules**

\<\!-- ANNOTATION: When this agent should hand off to another agent  
     or system. Only needed for multi-agent architectures. \--\>

| If the user asks about... | Delegate to | Via |  
|--------------------------|-------------|-----|  
| {{analytics/predictions}} | {{Agent 2}} | \`api/{{agent-2-function}}\` |  
| {{recommendations}} | {{Agent 3}} | \`api/{{agent-3-function}}\` |  
| {{research}} | {{Agent 4}} | \`api/{{agent-4-function}}\` |

**\#\# Risk Level Classification**

| Level | Criteria | Approval |  
|-------|----------|----------|  
| **\*\*Low\*\*** | Single entity CRUD, no financial impact, no external effects | Auto-execute (if org allows) |  
| **\*\*Medium\*\*** | Cross-module, financial under threshold, external comms | Step-by-step approval |  
| **\*\*High\*\*** | Bulk operations, financial over threshold, data deletion | Full approval \+ admin notification |

**\#\# Error Handling**

| Error Type | Agent Behavior |  
|-----------|---------------|  
| Transient (timeout, 503\) | Retry with backoff |  
| Validation (bad input) | Present to user with suggestion |  
| Permission (forbidden) | Explain limitation, offer alternative |  
| Cascade failure | Rollback, notify user |  
| External service down | Queue for later, continue other steps |  
\`\`\`\`

\---

**\#\# 11\. Human-in-the-Loop Patterns**

**\#\#\# When Approval Is Required**

\`\`\`  
Action evaluated →  
  Risk level?  
    LOW → Auto-execute (if org\_settings.auto\_approve\_low\_risk \= true)  
    MEDIUM → Show Proposal UI, require step-by-step approval  
    HIGH → Show Proposal UI, require explicit confirmation phrase,  
           notify admin, wait for multi-party approval if configured  
\`\`\`

**\#\#\# Approval Flow**

\`\`\`  
Agent generates plan  
       │  
       ▼  
┌──────────────────────┐  
│   Proposal UI        │  
│                      │  
│   Step 1: ✅ Approve  │  
│   Step 2: ✏️ Edit     │  
│   Step 3: ❌ Remove   │  
│                      │  
│   \[Approve All\]      │  
│   \[Cancel\]           │  
└──────────┬───────────┘  
           │  
           ▼  
    User decision?  
    ├── Approved → Execute all steps  
    ├── Edited → Re-validate, then execute  
    ├── Partial → Execute approved steps, skip rejected  
    └── Rejected → Cancel workflow, log reason  
\`\`\`

**\#\#\# Approval Timeout and Escalation**

\`\`\`  
Proposal presented  
       │  
       ├── User responds within timeout → Process decision  
       │  
       ├── Timeout (default: 5 min interactive, 24h async)  
       │   ├── Interactive → Mark as expired  
       │   └── Async → Send reminder notification  
       │  
       └── No response after escalation period (48h)  
           └── Escalate to next-level approver  
\`\`\`

\---

**\#\# 12\. Error Recovery and Self-Healing**

**\#\#\# Error Classification and Response**

| Error Category | Example | Recovery Strategy |  
|---------------|---------|-------------------|  
| **\*\*Transient\*\*** | Timeout, 503, rate limit | Automatic retry with exponential backoff (3 attempts: 1s, 2s, 4s) |  
| **\*\*Validation\*\*** | Missing field, wrong type | Return error to user with actionable message and suggestion |  
| **\*\*Permission\*\*** | Forbidden, insufficient role | Explain what permission is needed and who can grant it |  
| **\*\*Conflict\*\*** | Optimistic lock failure | Reload fresh data, prompt user to retry |  
| **\*\*External\*\*** | Third-party API down | Queue for later execution, continue other steps, alert admin |  
| **\*\*Cascade\*\*** | Depth exceeded, cycle detected | Suppress child cascade, log warning, continue parent |

**\#\#\# Partial Failure Handling**

\`\`\`  
Workflow with 5 steps:  
  Step 1: ✅ Success (committed)  
  Step 2: ✅ Success (committed)  
  Step 3: ❌ Failed  
  Step 4: ⏸️ Not started (depends on Step 3\)  
  Step 5: ⏸️ Not started (independent)

User options:  
  \[Retry Step 3\] → Re-execute with same idempotency key  
  \[Skip Step 3\]  → Skip Step 3 \+ Step 4 (dependency), execute Step 5  
  \[Abort\]        → Cancel remaining steps, keep Steps 1-2 committed

Non-reversible actions (sent emails, payments) are flagged:  
  "Step 2 sent an email — this cannot be automatically undone."  
\`\`\`

**\#\#\# Idempotency Keys**

\`\`\`  
Every external side effect gets a dedupe key:

  dedupe\_key \= hash(workflow\_id \+ step\_id \+ action \+ entity\_id)

If a step is retried with the same dedupe key:  
  \- Database mutations: INSERT ... ON CONFLICT DO NOTHING  
  \- Email sends: Provider rejects duplicate (Resend/SendGrid dedupe)  
  \- Payment processing: Stripe idempotency key prevents double-charge  
  \- Webhook dispatch: Receiver deduplicates by event ID  
\`\`\`

\---

**\#\# 13\. Learning and Optimization**

**\#\#\# What the System Learns**

| Learning Type | How It Works | Benefit |  
|--------------|-------------|---------|  
| **\*\*Workflow patterns\*\*** | Successful workflows are saved as archetype templates | Agent can suggest "Run the same flow as last time" |  
| **\*\*User corrections\*\*** | When users edit proposals, the edits are logged | Agent generates better plans over time |  
| **\*\*Failure patterns\*\*** | Common error modes are tracked and analyzed | Agent avoids known failure patterns |  
| **\*\*Timing data\*\*** | Step execution duration is recorded | Slow steps are identified for optimization |  
| **\*\*Approval patterns\*\*** | Which steps users approve/reject is tracked | Agent learns which actions need human judgment |

**\#\#\# Archetype Extraction**

\`\`\`  
After a successful workflow with 3+ steps:  
  1\. Compute similarity against existing archetypes (\>80% step-type match \= duplicate)  
  2\. If novel → save as new archetype template with:  
     \- Step types and ordering  
     \- Common parameter patterns  
     \- Success rate baseline  
  3\. Index for agent to reference in future suggestions

After a failed or aborted workflow:  
  → Delete any tentatively extracted archetype  
  → Do NOT learn from failed patterns as "good" templates  
\`\`\`

\---

**\#\# 14\. CLAUDE.md Integration**

Add this block to your \`.claude/CLAUDE.md\` to connect the WAT framework:

\`\`\`\`markdown  
**\#\# Knowledge Base**

Domain knowledge is in \`knowledge/\`. The WAT framework organizes it into three layers:

| Layer | Index File | Purpose | Load When |  
|-------|-----------|---------|-----------|  
| **\*\*Skills\*\*** | \`knowledge/skills.md\` | Domain knowledge (WHAT) | Working on a module |  
| **\*\*Workflows\*\*** | \`knowledge/workflows.md\` | Process definitions (WHEN) | Implementing a multi-step process |  
| **\*\*Tools\*\*** | \`knowledge/tools.md\` | Operation specs (HOW) | Writing a specific CRUD/API/UI operation |

**\#\#\# Loading by task type:**  
\- **\*\*Working on a specific module\*\***: Load \`knowledge/skills/\[module\]/\[module\].skill.md\`  
\- **\*\*Implementing CRUD\*\***: Load \`knowledge/tools/db/\[entity\]-crud.tool.md\`  
\- **\*\*Building an API endpoint\*\***: Load \`knowledge/tools/api/\[function\].tool.md\`  
\- **\*\*Implementing a workflow\*\***: Load \`knowledge/workflows/\[module\]/\[workflow\].workflow.md\`  
\- **\*\*Cross-cutting concerns\*\***: Load \`knowledge/skills/shared/\[topic\].skill.md\`  
\- **\*\*AI agent behavior\*\***: Load \`knowledge/skills/\[agent\]/\[agent\].skill.md\`  
\`\`\`\`

\---

**\#\# 15\. Sizing Guide**

**\#\#\# How Big Should Your Knowledge Base Be?**

| Project Size | Skills | Workflows | Tools | Agent Specs | Total Files |  
|-------------|--------|-----------|-------|------------|-------------|  
| **\*\*Small\*\*** (1-5 modules) | 3-8 | 3-10 | 5-15 | 0-1 | 11-34 |  
| **\*\*Medium\*\*** (6-15 modules) | 10-23 | 10-31 | 15-35 | 0-2 | 35-91 |  
| **\*\*Large\*\*** (16-33+ modules) | 23-47 | 25-49 | 30-70 | 1-4 | 79-170 |

**\#\#\# When to Start**

You don't need to build everything upfront. Start with:

\`\`\`  
MINIMUM VIABLE WAT  
\===================

Phase 1 (Day 1):  
  └── knowledge/  
      ├── skills.md          (index with 1-3 entries)  
      └── skills/shared/  
          └── auth.skill.md  (your auth/permission model)

Phase 2 (First module):  
  └── knowledge/  
      ├── skills/{{module}}/{{module}}.skill.md  
      └── tools/db/{{entity}}-crud.tool.md

Phase 3 (First workflow):  
  └── knowledge/  
      ├── workflows.md       (index)  
      └── workflows/{{module}}/{{process}}.workflow.md

Phase 4 (AI features):  
  └── knowledge/  
      ├── skills/{{agent}}/{{agent}}.skill.md  
      └── workflows/ai/{{agent}}-{{process}}.workflow.md

Expand as you build. Every new module \= 1 skill \+ 1-3 tools \+ 1-3 workflows.  
\`\`\`

**\#\#\# File Length Guide**

| File Type | Minimum Viable | Typical | Comprehensive |  
|-----------|---------------|---------|---------------|  
| Skill (shared) | 80 lines | 200-400 lines | 500+ lines |  
| Skill (module) | 60 lines | 150-250 lines | 400+ lines |  
| Skill (agent) | 100 lines | 200-350 lines | 500+ lines |  
| Workflow (any) | 25 lines | 60-130 lines | 140+ lines |  
| Tool (db) | 40 lines | 80-150 lines | 200+ lines |  
| Tool (api) | 30 lines | 50-100 lines | 150+ lines |  
| Tool (ui) | 30 lines | 40-80 lines | 100+ lines |  
| Tool (automation) | 40 lines | 60-100 lines | 150+ lines |  
| Agent spec | 50 lines | 100-200 lines | 300+ lines |

\---

**\#\# 16\. Examples for Different Project Types**

**\#\#\# SaaS Platform (B2B)**

\`\`\`  
knowledge/  
├── skills.md, tools.md, workflows.md  
├── skills/  
│   ├── shared/  
│   │   ├── auth.skill.md  
│   │   ├── billing.skill.md  
│   │   └── multi-tenancy.skill.md  
│   ├── projects/projects.skill.md  
│   ├── teams/teams.skill.md  
│   └── analytics/analytics.skill.md  
├── workflows/  
│   ├── shared/user-onboarding.workflow.md  
│   ├── projects/project-creation.workflow.md  
│   └── billing/subscription-upgrade.workflow.md  
└── tools/  
    ├── db/ (projects-crud, teams-crud, subscriptions-crud)  
    ├── api/ (stripe-checkout, webhook-receiver)  
    └── ui/ (data-table, settings-panel)  
\`\`\`

**\#\#\# E-Commerce**

\`\`\`  
knowledge/  
├── skills/  
│   ├── shared/ (auth, payments, inventory, notifications)  
│   ├── catalog/catalog.skill.md  
│   ├── orders/orders.skill.md  
│   └── customers/customers.skill.md  
├── workflows/  
│   ├── shared/ (user-registration, notification-dispatch)  
│   ├── orders/ (checkout-flow, fulfillment, return-processing)  
│   └── marketing/ (abandoned-cart, promotion-activation)  
└── tools/  
    ├── db/ (products-crud, orders-crud, customers-crud, inventory-crud)  
    ├── api/ (stripe-payment, shipping-rates, email-send)  
    └── automation/ (inventory-reorder, abandoned-cart-trigger)  
\`\`\`

**\#\#\# Mobile App**

\`\`\`  
knowledge/  
├── skills/  
│   ├── shared/ (auth, offline-sync, push-notifications)  
│   ├── feed/feed.skill.md  
│   ├── messaging/messaging.skill.md  
│   └── profile/profile.skill.md  
├── workflows/  
│   ├── shared/ (user-onboarding, push-notification, offline-sync)  
│   ├── content/ (post-creation, content-moderation)  
│   └── social/ (follow-request, report-user)  
└── tools/  
    ├── db/ (users-crud, posts-crud, messages-crud)  
    ├── api/ (push-send, media-upload, moderation-check)  
    └── automation/ (feed-ranking, notification-digest)  
\`\`\`

**\#\#\# AI-Powered Platform (Full WAT)**

\`\`\`  
knowledge/  
├── skills.md, tools.md, workflows.md, prod.md, PRD.json  
├── skills/  
│   ├── shared/ (orchestration, cascade, auth, audit, terminology, multi-tenancy, action-model)  
│   ├── {{33 module skills}}  
│   ├── grace/grace.skill.md  
│   ├── noa/noa.skill.md  
│   ├── ark/ark.skill.md  
│   └── raven/raven.skill.md  
├── workflows/  
│   ├── shared/ (canonical-pipeline, approval-flow, cascade-evaluation, onboarding)  
│   ├── {{35 module workflows}}  
│   └── ai/ (grace-solve, noa-insight, ark-recommendation, raven-research)  
└── tools/  
    ├── db/ (24 entity CRUD specs)  
    ├── api/ (12 edge function specs)  
    ├── ui/ (5 component specs)  
    └── automation/ (3 engine specs)  
\`\`\`

\---

**\#\# 17\. Integration Checklist**

**\#\#\# Initial Setup**

\- \[ \] Create \`knowledge/\` directory at repo root  
\- \[ \] Create three index files: \`skills.md\`, \`tools.md\`, \`workflows.md\`  
\- \[ \] Create subdirectories: \`skills/shared/\`, \`workflows/shared/\`, \`tools/db/\`  
\- \[ \] Add Knowledge Base section to \`.claude/CLAUDE.md\` (Section 14\)  
\- \[ \] Create at least one shared skill (auth/permissions is the best starting point)

**\#\#\# Per Module**

\- \[ \] Create skill file: \`knowledge/skills/{{module}}/{{module}}.skill.md\`  
\- \[ \] Create tool files: \`knowledge/tools/db/{{entity}}-crud.tool.md\` (one per entity)  
\- \[ \] Create workflow files: \`knowledge/workflows/{{module}}/{{name}}.workflow.md\` (one per process)  
\- \[ \] Add entries to all three index files  
\- \[ \] Verify skill's \`Depends On\` references valid skill IDs  
\- \[ \] Verify workflow's \`Skills Used\` and \`Tools Used\` reference valid files

**\#\#\# Per AI Agent (if applicable)**

\- \[ \] Create agent skill: \`knowledge/skills/{{agent}}/{{agent}}.skill.md\`  
\- \[ \] Create agent workflow: \`knowledge/workflows/ai/{{agent}}-{{process}}.workflow.md\`  
\- \[ \] Create API tools: \`knowledge/tools/api/{{agent}}-{{function}}.tool.md\`  
\- \[ \] Create or update agent spec (Section 10\)  
\- \[ \] Add entries to all three index files

**\#\#\# Validation**

\- \[ \] Every file referenced in an index exists on disk  
\- \[ \] Every \`wat\_references\` entry in task definitions points to a real file  
\- \[ \] Every skill's \`Depends On\` references valid IDs  
\- \[ \] Every workflow's \`Skills Used\` and \`Tools Used\` reference valid files  
\- \[ \] No circular dependencies between skills  
\- \[ \] Every workflow step has all 5 sub-sections (Action, Tool, Input, Output, Failure)  
\- \[ \] Risk levels are consistent (high-risk workflows have approval steps)  
\- \[ \] File counts match totals in index files

\---

**\#\# Quick Reference Card**

\`\`\`  
WAT FRAMEWORK CHEAT SHEET  
\==========================

SKILL  (.skill.md)    \= Domain knowledge — WHAT to build  
WORKFLOW (.workflow.md) \= Process definition — WHEN things happen  
TOOL   (.tool.md)     \= Atomic operation — HOW to build it  
AGENT SPEC (.md)      \= AI behavior — WHO does it, safely

Directory:  
  knowledge/  
  ├── skills.md, tools.md, workflows.md    (indexes)  
  ├── skills/shared/           (cross-cutting)  
  ├── skills/{{module}}/       (per-module)  
  ├── workflows/shared/        (infrastructure)  
  ├── workflows/{{module}}/    (domain processes)  
  ├── tools/db/                (CRUD specs)  
  ├── tools/api/               (endpoint specs)  
  ├── tools/ui/                (component specs)  
  └── tools/automation/        (engine specs)

Every WORKFLOW STEP has 5 sub-sections:  
  Action  → WHAT happens  
  Tool    → WHAT system does it  
  Input   → WHAT data goes in  
  Output  → WHAT data comes out  
  Failure → WHAT happens when it breaks

Every TOOL ACTION has 4 aspects:  
  Input   → Parameters, types, validation  
  Process → Numbered algorithm steps  
  Output  → Return object structure  
  Errors  → UPPER\_SNAKE\_CASE error codes

Loading order:  
  1\. Read the INDEX to find the right file  
  2\. Load the SKILL to understand the domain  
  3\. Load the WORKFLOW to understand the process  
  4\. Load the TOOL to understand the operation

Risk levels:  
  LOW    → auto-execute, standard error handling  
  MEDIUM → approval required, step-by-step review  
  HIGH   → multi-party approval, detailed rollback, admin alert  
\`\`\`

\---

**\#\# Companion Templates**

This is the master framework document. Detailed, annotated templates for each component type are available in:

| Template | File | Contents |  
|----------|------|---------|  
| CLAUDE.md | \`docs/CLAUDE-MD-TEMPLATE.md\` | Agent instructions file template |  
| Skill Index | \`docs/SKILL-INDEX-TEMPLATE.md\` | Skill file templates (3 archetypes) |  
| Workflow Index | \`docs/WORKFLOW-INDEX-TEMPLATE.md\` | Workflow file templates (4 archetypes) |  
| Tool Index | *\*(this document, Section 9)\** | Tool file templates (4 categories) |  
| Task System | \`docs/TASK-SYSTEM-TEMPLATE.md\` | Task tracking database \+ UI template |  
| AI Dev Framework | \`docs/AI-DEV-FRAMEWORK-TEMPLATE.md\` | Full framework integration template |

\---

*\*Template version 1.0 — Based on a production WAT framework powering 200+ tasks across 33 modules with 4 AI agents, 40 skills, 39 workflows, and 44 tools.\**

