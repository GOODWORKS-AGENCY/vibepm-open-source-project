**\# Master Knowledge Base (prod.md) — Complete Framework Template**

\> **\*\*The prod.md file is the single-document domain reference for your entire platform.\*\*** It gives any AI agent or developer a complete understanding of every module, entity, workflow family, database table, and cross-cutting concern — in one file. Drop this template into any project to create a comprehensive domain knowledge document that agents can load for full-platform context.

\---

**\#\# Table of Contents**

1\. \[What Is a Master Knowledge Base?\](\#1-what-is-a-master-knowledge-base)  
2\. \[Document Structure\](\#2-document-structure)  
3\. \[Part 1: Platform Overview Template\](\#3-part-1-platform-overview-template)  
4\. \[Module Entry Templates\](\#4-module-entry-templates)  
5\. \[Cross-Module Workflow Families Template\](\#5-cross-module-workflow-families-template)  
6\. \[Database Schema Overview Template\](\#6-database-schema-overview-template)  
7\. \[Reference Tables Template\](\#7-reference-tables-template)  
8\. \[Section-by-Section Annotation Guide\](\#8-section-by-section-annotation-guide)  
9\. \[Four Module Archetypes\](\#9-four-module-archetypes)  
10\. \[How Agents Use prod.md\](\#10-how-agents-use-prodmd)  
11\. \[Relationship to Other Knowledge Files\](\#11-relationship-to-other-knowledge-files)  
12\. \[Sizing Guide\](\#12-sizing-guide)  
13\. \[Examples for Different Project Types\](\#13-examples-for-different-project-types)  
14\. \[Integration Checklist\](\#14-integration-checklist)

\---

**\#\# 1\. What Is a Master Knowledge Base?**

A **\*\*Master Knowledge Base\*\*** (\`prod.md\`) is the single-document domain reference for your entire platform. It's the "atlas" — a high-level map of every module, entity, relationship, and pattern, designed to be loaded by an AI agent when it needs full-platform context.

**\#\#\# What It Does**

\`\`\`  
Agent receives task: "Add a donation campaign tracking feature"  
   │  
   ├── Option A: Load prod.md (full context)  
   │   └── Agent learns: ALL 33 modules, ALL entity relationships,  
   │       ALL cascade triggers, ALL cross-module workflows  
   │       → Can design a feature that integrates correctly with  
   │         Members, Finances, Marketing, Analytics, and Campaigns  
   │  
   └── Option B: Load only donations.skill.md (single module)  
        └── Agent learns: Donations module in depth  
            → Misses connections to Campaign module, Finance module,  
              and the Campaign-to-Conversion workflow family  
\`\`\`

**\#\#\# prod.md vs. Skill Files vs. CLAUDE.md**

| File | Scope | Depth | When to Load |  
|------|-------|-------|-------------|  
| **\*\*prod.md\*\*** | Entire platform | Summary (1-10 lines per module) | Cross-module features, architectural decisions, new agent onboarding |  
| **\*\*Skill files\*\*** | Single module | Deep (100-400 lines per module) | Working on a specific module's implementation |  
| **\*\*CLAUDE.md\*\*** | Project conventions | Conventions, not domain | Every session (auto-loaded) |

**\*\*Key principle:\*\*** prod.md is **\*\*wide but shallow\*\*** — it covers everything at summary depth. Skill files are **\*\*narrow but deep\*\*** — they cover one module exhaustively. An agent loads prod.md for context, then loads specific skill files for implementation detail.

**\#\#\# Why It Matters**

Without a master knowledge base, agents:  
\- Design features that duplicate existing module capabilities  
\- Miss cross-module integration points (a new event feature that doesn't connect to Members)  
\- Create entity schemas that conflict with existing table patterns  
\- Build workflows that don't trigger the right cascades  
\- Misunderstand the module taxonomy (which group does this belong to?)

With a master knowledge base, agents:  
\- See the full module landscape before designing features  
\- Identify all integration points across modules  
\- Follow established entity and schema patterns  
\- Wire up cross-module cascade triggers correctly  
\- Place new features in the correct module group

\---

**\#\# 2\. Document Structure**

The master knowledge base follows a rigid multi-part structure:

\`\`\`  
MASTER KNOWLEDGE BASE ANATOMY  
\==============================

┌──────────────────────────────────────────────────────────────┐  
│  \# {{Project Name}} — Master Knowledge Base                  │  
│                                                              │  
│  \#\# Part 1: Platform Overview                                │  
│  Mission, architecture, module map, AI agents,               │  
│  orchestration pipeline, cascade engine,                     │  
│  industry adaptation, permission model                       │  
│                                                              │  
│  \#\# Parts 2-N: Module Entries (one per module)               │  
│  Purpose, route/shell/group, key entities,                   │  
│  industry labels, actions, cascade triggers,                 │  
│  related modules, knowledge file references                  │  
│                                                              │  
│  \#\# Part N+1: Cross-Module Workflow Families                 │  
│  End-to-end process chains spanning 3-5 modules              │  
│                                                              │  
│  \#\# Part N+2: Database Schema Overview                       │  
│  All tables grouped by domain, common column patterns        │  
│                                                              │  
│  \#\# Part N+3: Risk Level Reference                           │  
│  Risk classification with auto-execute and approval rules    │  
│                                                              │  
│  \#\# Part N+4: Knowledge File Reference                       │  
│  Counts and locations of all knowledge files                 │  
│                                                              │  
└──────────────────────────────────────────────────────────────┘  
\`\`\`

**\#\#\# Information Density**

Each section targets a specific information density:

| Section | Lines Per Entry | Total Lines (Large Project) |  
|---------|----------------|---------------------------|  
| Platform Overview | N/A (one block) | 60-100 |  
| Module Entry | 6-10 lines | 200-400 (for 20-40 modules) |  
| Workflow Families | 3-4 lines each | 20-40 |  
| Database Schema | 1-2 lines per table | 50-100 |  
| Reference Tables | 1 line per row | 20-40 |  
| **\*\*Total\*\*** | | **\*\*350-680 lines\*\*** |

The entire file should fit within an LLM context window as a single load. If it exceeds \~700 lines, consider whether some modules can be consolidated.

\---

**\#\# 3\. Part 1: Platform Overview Template**

Part 1 is the foundational context. Every agent reads this first to understand the platform's architecture, module taxonomy, and cross-cutting patterns.

\`\`\`\`markdown  
**\# {{Project Name}} — Master Knowledge Base**

**\#\# Part 1: Platform Overview**

**\#\#\# Mission**

\<\!-- ANNOTATION: One paragraph (2-4 sentences) describing:  
     1\. What the platform does (core value proposition)  
     2\. Who it serves (target users/organizations)  
     3\. What makes it unique (adaptive, multi-tenant, AI-powered, etc.)  
     This gives agents the business context they need to make  
     design decisions aligned with the product's purpose. \--\>

{{Project Name}} is a {{type of platform}} that {{core value proposition}}. It {{key differentiator}} across {{target contexts/industries}} while maintaining {{shared foundation description}}.

**\#\#\# Architecture**

\<\!-- ANNOTATION: Bullet-point summary of the technical stack and patterns.  
     Agents use this to know:  
     \- What frameworks to use (don't introduce conflicting libraries)  
     \- How data flows (query patterns, state management)  
     \- How code is organized (feature-first, etc.)  
     \- How multi-tenancy works (RLS, org scoping, etc.)  
     Keep each bullet to one line. 5-8 bullets max. \--\>

\- **\*\*Stack\*\***: {{Frontend framework}} \+ {{Language}} \+ {{Build tool}}, {{State management}}, {{UI library}}, {{Backend}} ({{Database}} \+ {{Auth}} \+ {{API layer}})  
\- **\*\*Multi-tenant\*\***: {{How tenant isolation works. E.g., "organization\_id on every row, RLS enforced at database level"}}  
\- **\*\*Shell modes\*\***: {{Layout variations. E.g., "Full (sidebar \+ workspace), Focused (toolbar \+ workspace), Embedded (no chrome)"}}  
\- **\*\*Data flow\*\***: {{State management pattern. E.g., "TanStack Query for server state, query key factory pattern"}}  
\- **\*\*Feature-first\*\***: {{Code organization. E.g., "Code organized by domain (features/\[module\]/hooks/, features/\[module\]/api/)"}}

**\#\#\# Module Map ({{N}} Modules)**

\<\!-- ANNOTATION: The module map is the MOST REFERENCED section of prod.md.  
     Agents consult this to:  
     1\. Find the right module for a feature  
     2\. Determine routes and shell modes  
     3\. Understand module grouping and taxonomy  
     4\. See the default label vs industry-adaptive label

     COLUMNS:  
     \- \#: Sequential number (for Part references)  
     \- Module: Internal name used in code and knowledge files  
     \- Route: URL path for this module  
     \- Shell: Layout mode (full, focused, embedded)  
     \- Group: Navigation grouping category  
     \- Default Label: What the user sees (may be overridden by industry) \--\>

| \# | Module | Route | Shell | Group | Default Label |  
|---|--------|-------|-------|-------|--------------|  
| 1 | {{Module Name}} | /{{route}} | {{full/focused/embedded}} | {{Group}} | {{Label}} |  
| 2 | {{Module Name}} | /{{route}} | {{full/focused/embedded}} | {{Group}} | {{Label}} |  
| ... | ... | ... | ... | ... | ... |

\<\!-- ANNOTATION: Group modules logically. Common groupings:  
     \- Core: Dashboard, home, landing  
     \- People/CRM: Contacts, leads, accounts  
     \- Finance: Donations, budgets, expenses, accounting  
     \- Engagement: Events, volunteers, communications  
     \- Productivity: Tasks, agile, project management  
     \- Intelligence: Analytics, reporting, data studio  
     \- Operations: Procurement, contracts, logistics  
     \- Outreach: Marketing, campaigns, email  
     \- Collaboration: Chat, channels, messaging  
     \- AI: AI agent surfaces  
     \- Admin: Settings, security, governance  
     \- Platform: Integrations, connectors  
     \- Service: Support, ticketing \--\>

**\#\#\# AI Agents**

\<\!-- ANNOTATION: Only include this section if the platform has AI agent surfaces.  
     Each agent gets a row with role, edge functions, and access level.  
     This tells agents WHICH AI to delegate to for different tasks. \--\>

| Agent | Role | Edge Functions | Access Level |  
|-------|------|---------------|-------------|  
| **\*\*{{Agent 1}}\*\*** | {{One-line role description}} | {{function-1}}, {{function-2}} | {{Read/write scope}} |  
| **\*\*{{Agent 2}}\*\*** | {{One-line role description}} | {{function-1}} | {{Read/write scope}} |

**\#\#\# Orchestration Pipeline ({{N}} Stages)**

\<\!-- ANNOTATION: Only include if the platform has a multi-stage processing pipeline.  
     Each stage is a numbered item with a bold name and brief description.  
     This gives agents the canonical process flow for all automated actions. \--\>

1\. **\*\*{{Stage 1}}\*\*** — {{What happens: triggers, inputs}}  
2\. **\*\*{{Stage 2}}\*\*** — {{What happens: context loading, role checking}}  
3\. **\*\*{{Stage 3}}\*\*** — {{What happens: classification, entity resolution}}  
4\. **\*\*{{Stage 4}}\*\*** — {{What happens: validation, permissions, risk}}  
5\. **\*\*{{Stage 5}}\*\*** — {{What happens: human review, approval}}  
6\. **\*\*{{Stage 6}}\*\*** — {{What happens: execution, transactions, retries}}  
7\. **\*\*{{Stage 7}}\*\*** — {{What happens: audit, learning, cascades}}

**\#\#\# Cascade Engine**

\<\!-- ANNOTATION: Only include if the platform has a cascade/automation system.  
     List each dispatch type with a brief description.  
     Include safety limits (max depth, cycle detection). \--\>

\- **\*\*{{Type 1}}\*\***: {{Description and when used}}  
\- **\*\*{{Type 2}}\*\***: {{Description and when used}}  
\- **\*\*{{Type 3}}\*\***: {{Description and when used}}  
\- **\*\*{{Type 4}}\*\***: {{Description and when used}}  
\- Max depth: {{N}}, {{cycle detection mechanism}}

**\#\#\# Industry Adaptation**

\<\!-- ANNOTATION: Only include if the platform adapts terminology across industries.  
     The table maps generic module concepts to industry-specific labels.  
     Agents use this to render correct labels based on org.industry\_type.

     ROWS: One per concept that changes across industries.  
     COLUMNS: One per industry the platform supports.  
     The "default" industry should be listed first. \--\>

| Key | {{Industry 1 (default)}} | {{Industry 2}} | {{Industry 3}} | {{Industry 4}} | {{Industry 5}} |  
|-----|--------------------------|----------------|----------------|----------------|----------------|  
| {{Concept 1}} | {{Label}} | {{Label}} | {{Label}} | {{Label}} | {{Label}} |  
| {{Concept 2}} | {{Label}} | {{Label}} | {{Label}} | {{Label}} | {{Label}} |

**\#\#\# Permission Model ({{N}} Layers)**

\<\!-- ANNOTATION: Summarize the permission/authorization model.  
     Each layer is a numbered item with the enforcement mechanism.  
     Agents use this to know WHERE to check permissions for different operations. \--\>

1\. **\*\*{{Layer 1}}\*\***: {{How it works. E.g., "Route guards: ProtectedRoute, AdminRoute"}}  
2\. **\*\*{{Layer 2}}\*\***: {{How it works. E.g., "Module-level: module\_registry.is\_enabled per org"}}  
3\. **\*\*{{Layer 3}}\*\***: {{How it works. E.g., "RBAC roles with additive permission sets"}}  
4\. **\*\*{{Layer 4}}\*\***: {{How it works. E.g., "Field-level scopes in role definitions"}}  
5\. **\*\*{{Layer 5}}\*\***: {{How it works. E.g., "RLS policies at database level"}}  
\`\`\`\`

\---

**\#\# 4\. Module Entry Templates**

Each module gets one section in prod.md. The entry is a compact summary — 6-10 lines — that tells an agent everything it needs to know to decide whether to load the full skill file.

**\#\#\# Module Entry Fields**

Every module entry uses a consistent set of bullet-point fields:

| Field | Required? | Description | What Agents Extract |  
|-------|-----------|-------------|-------------------|  
| **\*\*Purpose\*\*** | Always | One sentence describing what the module does | Whether this module is relevant to the task |  
| **\*\*Route\*\*** / **\*\*Shell\*\*** / **\*\*Group\*\*** | Always | URL path, layout mode, nav grouping | Route configuration, shell mode, navigation placement |  
| **\*\*Key Entities\*\*** | Always | Comma-separated database table names | Which tables belong to this module |  
| **\*\*Industry Labels\*\*** | If adaptive | Label per industry type | Correct UI labels for the org's industry |  
| **\*\*Edge Functions\*\*** | If AI module | Serverless function names | Which functions to implement/call |  
| **\*\*Actions\*\*** | Always | Comma-separated verb phrases | What operations the module supports |  
| **\*\*Cascade Triggers\*\*** | If has cascades | Event → effect mappings | What downstream effects to expect |  
| **\*\*Related Modules\*\*** | Always | Modules this one integrates with | Cross-module dependencies |  
| **\*\*Knowledge\*\*** | Always | Paths to skill/tool/workflow files | What to load for deep implementation |

**\#\#\# Four Module Archetypes**

\`\`\`\`markdown  
\<\!-- \============================================================  
     ARCHETYPE 1: STANDARD DOMAIN MODULE  
     Most modules fall here. Has entities, industry labels, cascades.  
     Examples: Members, Donations, Events, Tasks, Leads, Accounts  
     \============================================================ \--\>

**\#\# Part {{N}}: {{Module Name}}**  
\- **\*\*Purpose\*\***: {{One sentence: what it does and why it exists}}  
\- **\*\*Route\*\***: /{{route}} | **\*\*Shell\*\***: {{full/focused/embedded}} | **\*\*Group\*\***: {{Group}}  
\- **\*\*Key Entities\*\***: {{table1}}, {{table2}}, {{table3}}  
\- **\*\*Industry Labels\*\***: {{Industry1}}: {{Label1}}, {{Industry2}}: {{Label2}}, {{Industry3}}: {{Label3}}, {{Industry4}}: {{Label4}}, {{Industry5}}: {{Label5}}  
\- **\*\*Actions\*\***: {{verb phrase 1}}, {{verb phrase 2}}, {{verb phrase 3}}, {{verb phrase 4}}  
\- **\*\*Cascade Triggers\*\***: {{Event1}} → {{effect1}}; {{Event2}} → {{effect2}}; {{Event3}} → {{effect3}}  
\- **\*\*Related Modules\*\***: {{Module1}}, {{Module2}}, {{Module3}}  
\- **\*\*Knowledge\*\***: skills/{{module}}/{{module}}.skill.md, tools/db/{{entity}}-crud.tool.md

\<\!-- \============================================================  
     ARCHETYPE 2: INFRASTRUCTURE / ADMIN MODULE  
     No industry labels, no cascade triggers. Supports the platform itself.  
     Examples: Organization, Settings, Admin Security, Admin Governance  
     \============================================================ \--\>

**\#\# Part {{N}}: {{Module Name}}**  
\- **\*\*Purpose\*\***: {{One sentence describing the admin/infrastructure function}}  
\- **\*\*Route\*\***: /{{route}} | **\*\*Shell\*\***: {{full}} | **\*\*Group\*\***: Admin  
\- **\*\*Key Entities\*\***: {{table1}}, {{table2}}  
\- **\*\*Actions\*\***: {{verb phrase 1}}, {{verb phrase 2}}, {{verb phrase 3}}  
\- **\*\*Related Modules\*\***: {{Module1}}, {{Module2}}  
\- **\*\*Knowledge\*\***: skills/{{module}}/{{module}}.skill.md

\<\!-- \============================================================  
     ARCHETYPE 3: AI AGENT MODULE  
     Has edge functions instead of key entities. No industry labels.  
     Describes interaction modes instead of CRUD actions.  
     Examples: Grace AI, Noa AI, Ark AI, Raven AI  
     \============================================================ \--\>

**\#\# Part {{N}}: {{Agent Name}} AI**  
\- **\*\*Purpose\*\***: {{One sentence describing the AI agent's role}}  
\- **\*\*Route\*\***: /{{route}} | **\*\*Shell\*\***: {{full/embedded}} | **\*\*Group\*\***: AI  
\- **\*\*Edge Functions\*\***: {{function-1}}, {{function-2}}  
\- **\*\*Interaction Modes\*\***: {{Mode1}} ({{speed/description}}), {{Mode2}} ({{speed/description}})  
\- **\*\*Related Modules\*\***: {{Module1}}, {{Module2}} (or "All")  
\- **\*\*Knowledge\*\***: skills/{{agent}}/{{agent}}.skill.md, tools/api/{{function}}.tool.md

\<\!-- \============================================================  
     ARCHETYPE 4: INTELLIGENCE / TOOLING MODULE  
     Read-focused, connects to many other modules.  
     No industry labels, may not have cascade triggers.  
     Examples: Analytics, Data Studio, Storybuilder, Connectors  
     \============================================================ \--\>

**\#\# Part {{N}}: {{Module Name}}**  
\- **\*\*Purpose\*\***: {{One sentence describing the intelligence/tooling function}}  
\- **\*\*Route\*\***: /{{route}} | **\*\*Shell\*\***: {{focused/full}} | **\*\*Group\*\***: {{Intelligence/Platform}}  
\- **\*\*Key Entities\*\***: {{table1}}, {{table2}}  
\- **\*\*Actions\*\***: {{verb phrase 1}}, {{verb phrase 2}}, {{verb phrase 3}}  
\- **\*\*Related Modules\*\***: All (or {{specific modules}})  
\- **\*\*Knowledge\*\***: skills/{{module}}/{{module}}.skill.md  
\`\`\`\`

**\#\#\# Ordering Modules**

Modules should be ordered by dependency depth — foundational modules first, dependent modules later:

\`\`\`  
RECOMMENDED MODULE ORDERING  
\============================

1\. Core/Dashboard (depends on nothing, aggregates everything)  
2\. People/CRM modules (contacts, leads, accounts — foundational entities)  
3\. Engagement modules (events, volunteers — depend on people)  
4\. Finance modules (donations, budgets, expenses, accounting — depend on people)  
5\. Productivity modules (tasks, agile — cross-cutting)  
6\. Outreach modules (marketing, communications — depend on people \+ finance)  
7\. Operations modules (procurement, contracts — depend on finance)  
8\. Service modules (support — depends on people)  
9\. Intelligence modules (analytics, data studio — read from everything)  
10\. AI agent modules (orchestrate across everything)  
11\. Collaboration modules (chat, channels)  
12\. Platform modules (connectors, settings)  
13\. Admin modules (security, governance)  
14\. External-facing modules (portals)  
\`\`\`

\---

**\#\# 5\. Cross-Module Workflow Families Template**

Workflow families describe end-to-end processes that span 3+ modules. They show how modules connect in practice.

\`\`\`\`markdown  
**\#\# Part {{N+1}}: Cross-Module Workflow Families**

\<\!-- ANNOTATION: Each workflow family represents an end-to-end business process  
     that spans multiple modules. The format is:  
     1\. Bold numbered name  
     2\. Module chain: Module A → Module B → Module C  
     3\. One-line process description: verb → verb → verb → verb

     These help agents understand:  
     \- Which modules MUST integrate for key business processes  
     \- The expected data flow direction between modules  
     \- Which modules are upstream/downstream of each other

     Include 4-10 workflow families. Focus on the most important  
     end-to-end processes that cross 3+ modules. \--\>

**\#\#\# 1\. {{Workflow Family Name}}**  
{{Module A}} → {{Module B}} → {{Module C}} → {{Module D}}  
\- {{Step-by-step: verb → verb → verb → verb → verb}}

**\#\#\# 2\. {{Workflow Family Name}}**  
{{Module A}} → {{Module B}} → {{Module C}} → {{Module D}}  
\- {{Step-by-step}}

**\#\#\# 3\. {{Workflow Family Name}}**  
{{Module A}} → {{Module B}} → {{Module C}}  
\- {{Step-by-step}}

\<\!-- Continue for 4-10 families... \--\>  
\`\`\`\`

**\#\#\# Common Workflow Family Patterns**

| Pattern | Description | Example |  
|---------|-------------|---------|  
| **\*\*Lead-to-Revenue\*\*** | Prospect → qualify → opportunity → close → book | Leads → Accounts → Deals → Accounting |  
| **\*\*Campaign-to-Conversion\*\*** | Plan → target → send → engage → convert | Marketing → Communications → Members → Donations |  
| **\*\*Request-to-Fulfill\*\*** | Create ticket → route → resolve → survey | Support → Tasks → Communications → Analytics |  
| **\*\*Procure-to-Pay\*\*** | Requisition → approve → PO → receive → pay | Procurement → Contracts → Accounting |  
| **\*\*Plan-to-Deliver\*\*** | Plan → schedule → staff → execute → report | Tasks → Events → Volunteers → Analytics |  
| **\*\*AI-Assisted Loop\*\*** | Request → orchestrate → delegate → approve → execute | Grace → Specialist AI → Any Module → Audit |

\---

**\#\# 6\. Database Schema Overview Template**

The schema overview lists every table grouped by domain. It's a quick reference — not a full schema (that's in tool files).

\`\`\`\`markdown  
**\#\# Part {{N+2}}: Database Schema Overview**

\<\!-- ANNOTATION: List every database table in the platform, grouped by domain.  
     Each table gets a single line with:  
     \- Table name (backtick formatted)  
     \- Dash separator  
     \- Brief description (key columns in parentheses)

     This section answers the question: "What tables exist and where do they fit?"  
     For full column definitions, agents load the relevant tool file.

     Group tables by domain, matching the module groups from Part 1\.  
     Common groupings: Identity & Access, Platform, CRM, Engagement,  
     Finance, Marketing & Communications, Support, Operations. \--\>

**\#\#\# {{Domain Group 1: e.g., Identity & Access}}**  
\- \`{{table\_name}}\` — {{brief description}} ({{key columns}})  
\- \`{{table\_name}}\` — {{brief description}} ({{key columns}})

**\#\#\# {{Domain Group 2: e.g., Platform}}**  
\- \`{{table\_name}}\` — {{brief description}} ({{key columns}})  
\- \`{{table\_name}}\` — {{brief description}} ({{key columns}})

**\#\#\# {{Domain Group 3: e.g., CRM}}**  
\- \`{{table\_name}}\` — {{brief description}} ({{key columns}})  
\- \`{{table\_name}}\` — {{brief description}} ({{key columns}})

**\#\#\# {{Domain Group 4: e.g., Engagement}}**  
\- \`{{table\_name}}\` — {{brief description}}  
\- \`{{table\_name}}\` — {{brief description}}

**\#\#\# {{Domain Group 5: e.g., Finance}}**  
\- \`{{table\_name}}\` — {{brief description}}  
\- \`{{table\_name}}\` — {{brief description}}

**\#\#\# {{Continue for all domain groups...}}**

**\#\#\# Common Column Pattern (All Org-Scoped Tables)**

\<\!-- ANNOTATION: Show the common column pattern that every org-scoped table follows.  
     This is a SQL snippet that agents reference when creating new tables.  
     Include: id, organization\_id, created\_at, updated\_at, and any  
     other columns common to most tables (tags, metadata). \--\>

\`\`\`sql  
id              UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
created\_at      TIMESTAMPTZ NOT NULL DEFAULT now(),  
updated\_at      TIMESTAMPTZ NOT NULL DEFAULT now(),  
tags            TEXT\[\] DEFAULT '{}',  
metadata        JSONB DEFAULT '{}'  
\`\`\`  
\`\`\`\`

\---

**\#\# 7\. Reference Tables Template**

The final sections provide quick-reference lookup tables for risk levels and knowledge file inventory.

\`\`\`\`markdown  
**\#\# Part {{N+3}}: Risk Level Reference**

\<\!-- ANNOTATION: A concise table mapping risk levels to auto-execute policy,  
     approval requirements, and example operations. Agents use this to  
     classify operations correctly. \--\>

| Level | Auto-Execute | Approval | Examples |  
|-------|-------------|----------|----------|  
| **\*\*Low\*\*** | {{Yes/No}} | {{None/Required}} | {{Example operations}} |  
| **\*\*Medium\*\*** | {{Yes/No}} | {{Type of approval}} | {{Example operations}} |  
| **\*\*High\*\*** | {{Yes/No}} | {{Type of approval}} | {{Example operations}} |

\---

**\#\# Part {{N+4}}: Knowledge File Reference**

\<\!-- ANNOTATION: An inventory of all knowledge files in the project.  
     This tells agents (and humans) the total scope of the knowledge base  
     and where to find each file type.

     Columns:  
     \- Category: File type (Shared Skills, Module Skills, DB Tools, etc.)  
     \- Count: Number of files  
     \- Location: Directory path  
     \- Pattern: File naming pattern (glob) \--\>

| Category | Count | Location | Pattern |  
|----------|-------|----------|---------|  
| {{Category 1}} | {{N}} | {{directory/}} | {{\*.type.md}} |  
| {{Category 2}} | {{N}} | {{directory/}} | {{\*.type.md}} |  
| **\*\*Total\*\*** | **\*\*{{N}}\*\*** | | |  
\`\`\`\`

\---

**\#\# 8\. Section-by-Section Annotation Guide**

**\#\#\# What Each Section Provides to Agents**

| Section | What Agents Learn | Without It |  
|---------|------------------|-----------|  
| **\*\*Mission\*\*** | Business context for design decisions | Agent builds features that don't align with product direction |  
| **\*\*Architecture\*\*** | Stack constraints and patterns | Agent introduces conflicting libraries or patterns |  
| **\*\*Module Map\*\*** | Full module taxonomy | Agent creates features that duplicate existing modules |  
| **\*\*AI Agents\*\*** | Which AI handles what | Agent builds features in the wrong AI surface |  
| **\*\*Orchestration Pipeline\*\*** | Process flow stages | Agent skips validation, approval, or audit stages |  
| **\*\*Cascade Engine\*\*** | Automation dispatch types | Agent misclassifies risk or misses cascade triggers |  
| **\*\*Industry Adaptation\*\*** | Label overrides per industry | Agent hardcodes labels instead of using terminology system |  
| **\*\*Permission Model\*\*** | Authorization layers | Agent skips permission checks or checks at wrong layer |  
| **\*\*Module Entries\*\*** | Per-module quick reference | Agent doesn't know what a module does or what it connects to |  
| **\*\*Workflow Families\*\*** | End-to-end process chains | Agent designs features that break cross-module processes |  
| **\*\*Database Schema\*\*** | Table inventory | Agent creates redundant tables or uses wrong table names |  
| **\*\*Risk Reference\*\*** | Operation classification | Agent auto-executes operations that should require approval |  
| **\*\*Knowledge Reference\*\*** | File counts and locations | Agent can't find the right knowledge file to load |

**\#\#\# Module Entry Field Guide**

| Field | How to Write It | Common Mistakes |  
|-------|----------------|----------------|  
| **\*\*Purpose\*\*** | One sentence, starts with a noun or gerund. Focus on WHAT and WHY. | Too vague ("Manages data") or too long (multiple sentences) |  
| **\*\*Route/Shell/Group\*\*** | Exact values, pipe-separated. Must match route config and shell mode. | Wrong shell mode, missing route prefix |  
| **\*\*Key Entities\*\*** | Comma-separated table names (snake\_case). Only primary tables for this module. | Including shared tables (audit\_log) or tables owned by other modules |  
| **\*\*Industry Labels\*\*** | \`IndustryName: Label\` format. One per supported industry. Only include if the label actually changes. | Including industries where the label is the same as default |  
| **\*\*Actions\*\*** | Comma-separated verb phrases (imperative). 4-8 actions that summarize the module's capabilities. | Listing individual CRUD operations (too granular) or just "Manage everything" (too vague) |  
| **\*\*Cascade Triggers\*\*** | \`Event → Effect\` format, semicolon-separated. Only list triggers that fire automatically. | Listing user-initiated actions as cascades |  
| **\*\*Related Modules\*\*** | Module names from the Module Map. List modules with actual data/workflow connections. | Listing ALL modules (use "All" if truly universal) or missing key connections |  
| **\*\*Knowledge\*\*** | Comma-separated file paths relative to \`knowledge/\`. Include skill \+ all relevant tool files. | Missing tool files, pointing to non-existent files |

\---

**\#\# 9\. Four Module Archetypes**

**\#\#\# Archetype Decision Tree**

\`\`\`  
Is this module a domain module with business entities?  
  YES →  
    Does it adapt terminology across industries?  
      YES → ARCHETYPE 1: Standard Domain Module  
      NO →  
        Does it have cascade triggers?  
          YES → ARCHETYPE 1 (without Industry Labels)  
          NO → ARCHETYPE 4: Intelligence / Tooling Module  
  NO →  
    Is it an AI agent surface?  
      YES → ARCHETYPE 3: AI Agent Module  
      NO →  
        Is it admin/infrastructure?  
          YES → ARCHETYPE 2: Infrastructure / Admin Module  
          NO → ARCHETYPE 4: Intelligence / Tooling Module  
\`\`\`

**\#\#\# Archetype Comparison**

| Aspect | Standard Domain | Infrastructure | AI Agent | Intelligence |  
|--------|----------------|---------------|----------|-------------|  
| **\*\*Industry Labels\*\*** | Yes | No | No | No |  
| **\*\*Cascade Triggers\*\*** | Yes | No | Sometimes | No |  
| **\*\*Key Entities\*\*** | Yes (tables) | Yes (config tables) | No (edge functions) | Yes (analytical tables) |  
| **\*\*Edge Functions\*\*** | No | No | Yes | No |  
| **\*\*Interaction Modes\*\*** | No | No | Yes | No |  
| **\*\*Related Modules\*\*** | Specific list | Specific list | "All" or broad | "All" or broad |  
| **\*\*Example Count\*\*** | 60-70% of modules | 10-15% | 5-15% | 10-15% |

**\#\#\# Field Inclusion Matrix**

| Field | Standard | Infrastructure | AI Agent | Intelligence |  
|-------|:--------:|:--------------:|:--------:|:------------:|  
| Purpose | ✅ | ✅ | ✅ | ✅ |  
| Route/Shell/Group | ✅ | ✅ | ✅ | ✅ |  
| Key Entities | ✅ | ✅ | — | ✅ |  
| Edge Functions | — | — | ✅ | — |  
| Industry Labels | ✅ | — | — | — |  
| Interaction Modes | — | — | ✅ | — |  
| Actions | ✅ | ✅ | — | ✅ |  
| Cascade Triggers | ✅ | — | Sometimes | — |  
| Related Modules | ✅ | ✅ | ✅ | ✅ |  
| Knowledge | ✅ | ✅ | ✅ | ✅ |

\---

**\#\# 10\. How Agents Use prod.md**

**\#\#\# Loading Strategy**

\`\`\`  
WHEN TO LOAD prod.md  
\====================

Load prod.md when:  
  ├── Designing a new feature that touches 2+ modules  
  ├── Adding a new module to the platform  
  ├── Understanding the module taxonomy (what goes where)  
  ├── Building cross-module integrations or workflows  
  ├── Reviewing overall architecture before major changes  
  ├── Onboarding to an unfamiliar codebase  
  └── Creating database schema for a new entity

Do NOT load prod.md when:  
  ├── Working on a single module (load the skill file instead)  
  ├── Fixing a bug in a specific function (load the tool file)  
  ├── Following a specific workflow (load the workflow file)  
  └── File is too large for context (use specific skill files)  
\`\`\`

**\#\#\# Agent Reading Pattern**

\`\`\`  
Agent loads prod.md:  
  │  
  ├── Step 1: Read Part 1 (Platform Overview)  
  │   └── Understand architecture, module taxonomy, patterns  
  │  
  ├── Step 2: Find relevant module entries (Parts 2-N)  
  │   ├── Read the target module's entry  
  │   ├── Read "Related Modules" entries  
  │   └── Note Knowledge file paths for deep loading  
  │  
  ├── Step 3: Check Workflow Families (Part N+1)  
  │   └── Find any end-to-end process that includes the target module  
  │  
  ├── Step 4: Check Database Schema (Part N+2)  
  │   └── Find tables related to the task  
  │  
  └── Step 5: Load specific knowledge files  
      └── Follow Knowledge paths from module entries to load  
          skill files, tool files, and workflow files  
\`\`\`

**\#\#\# CLAUDE.md Integration**

Add this to your \`.claude/CLAUDE.md\` to connect prod.md:

\`\`\`\`markdown  
**\#\# Knowledge Base**  
Domain knowledge is in \`knowledge/\`. Load relevant files based on task:  
\- @knowledge/prod.md — Full domain reference (all {{N}} modules)  
\- @knowledge/skills.md — Skill index (find the right domain skill to load)  
\- @knowledge/tools.md — Tool index (find the right tool spec)  
\- @knowledge/workflows.md — Workflow index (find the right process)

**\#\#\# Loading by task type:**  
\- **\*\*Full platform context\*\***: Load \`knowledge/prod.md\`  
\- **\*\*Working on a specific module\*\***: Load \`knowledge/skills/\[module\]/\[module\].skill.md\`  
\- **\*\*Implementing CRUD operations\*\***: Load \`knowledge/tools/db/\[entity\]-crud.tool.md\`  
\- **\*\*Building an edge function\*\***: Load \`knowledge/tools/api/\[function-name\].tool.md\`  
\- **\*\*Implementing a workflow\*\***: Load \`knowledge/workflows/\[module\]/\[workflow-name\].workflow.md\`  
\- **\*\*Cross-cutting concerns\*\***: Load \`knowledge/skills/shared/\[topic\].skill.md\`  
\`\`\`\`

\---

**\#\# 11\. Relationship to Other Knowledge Files**

**\#\#\# How prod.md Relates to the WAT Framework**

\`\`\`  
prod.md (ATLAS — wide, shallow)  
  │  
  ├── References → skills.md (index)  
  │   └── skills/\[module\]/\[module\].skill.md (deep domain knowledge)  
  │  
  ├── References → tools.md (index)  
  │   └── tools/\[category\]/\[name\].tool.md (atomic operation specs)  
  │  
  ├── References → workflows.md (index)  
  │   └── workflows/\[module\]/\[name\].workflow.md (process definitions)  
  │  
  └── Summarizes all of the above in one document  
\`\`\`

**\#\#\# When to Update prod.md**

| Event | Update Required |  
|-------|----------------|  
| New module added | Add new Part entry with all fields |  
| Module renamed | Update Module Map table \+ module entry |  
| New entity table created | Add to Database Schema Overview |  
| New knowledge file created | Update Knowledge File Reference counts |  
| New workflow family identified | Add to Cross-Module Workflow Families |  
| Industry added/removed | Update Industry Adaptation table \+ all module Industry Labels |  
| Permission model changed | Update Permission Model section |  
| New AI agent added | Add to AI Agents table \+ new module entry |  
| Module removed | Remove Part entry, update Module Map |

**\#\#\# File Cross-Reference**

| Knowledge in prod.md | Deeper Detail In |  
|---------------------|-----------------|  
| Module Map (table) | \`module-registry.ts\` (code), individual skill files |  
| Key Entities (per module) | \`tools/db/\[entity\]-crud.tool.md\` (full schema) |  
| Actions (per module) | \`skills/\[module\]/\[module\].skill.md\` (full action list) |  
| Cascade Triggers (per module) | \`skills/shared/cascade-engine.skill.md\` \+ \`tools/automation/cascade-executor.tool.md\` |  
| Workflow Families | \`workflows/\[module\]/\[name\].workflow.md\` (full step-by-step) |  
| Database Schema | \`tools/db/\[entity\]-crud.tool.md\` (full column definitions) |  
| Industry Adaptation | \`skills/shared/terminology.skill.md\` (full mapping) |  
| Permission Model | \`skills/shared/auth-permissions.skill.md\` (full 5-layer model) |

\---

**\#\# 12\. Sizing Guide**

**\#\#\# How Big Should prod.md Be?**

| Project Size | Modules | Module Entries | Workflow Families | DB Tables | Total Lines |  
|-------------|---------|---------------|------------------|-----------|-------------|  
| **\*\*Small\*\*** (MVP) | 3-8 | 3-8 parts | 1-3 | 5-15 | 80-200 |  
| **\*\*Medium\*\*** | 8-15 | 8-15 parts | 3-6 | 15-40 | 200-380 |  
| **\*\*Large\*\*** | 15-30 | 15-30 parts | 5-8 | 40-80 | 380-550 |  
| **\*\*Very Large\*\*** | 30+ | 30+ parts | 7-10 | 80+ | 500-700 |

**\#\#\# Target: Under 700 Lines**

prod.md should be loadable in a single context window alongside other files. If it exceeds \~700 lines:

1\. Shorten module entry descriptions (each should be 6-10 lines max)  
2\. Consolidate similar modules into grouped entries  
3\. Move database schema details to tool files (just list table names)  
4\. Remove sections that duplicate CLAUDE.md content

**\#\#\# What to Include vs. What to Leave Out**

| Include in prod.md | Leave for Skill/Tool/Workflow Files |  
|-------------------|-------------------------------------|  
| Module purpose (1 sentence) | Full entity schemas (100+ lines) |  
| Key entity table names | Column definitions, types, constraints |  
| Action verbs (comma list) | Full action specifications with Input/Process/Output/Errors |  
| Cascade trigger summaries | Full cascade rule definitions |  
| Industry label overrides | Full terminology mapping tables |  
| Database table names | Full table schemas with indexes and RLS |  
| Cross-module workflow chains | Full step-by-step workflow definitions |

\---

**\#\# 13\. Examples for Different Project Types**

**\#\#\# SaaS Platform (B2B)**

\`\`\`\`markdown  
**\# Acme — Master Knowledge Base**

**\#\# Part 1: Platform Overview**

**\#\#\# Mission**  
Acme is a project management platform for agencies that consolidates projects, time tracking, billing, and client management into a single workspace. It adapts across agency types (creative, development, marketing) while maintaining a unified data model.

**\#\#\# Architecture**  
\- **\*\*Stack\*\***: Next.js 14 \+ TypeScript, Prisma, Tailwind CSS, Vercel \+ Supabase  
\- **\*\*Multi-tenant\*\***: \`workspace\_id\` on every row, RLS enforced  
\- **\*\*Data flow\*\***: React Query for server state, tRPC for type-safe APIs

**\#\#\# Module Map (8 Modules)**  
| \# | Module | Route | Shell | Group | Default Label |  
|---|--------|-------|-------|-------|--------------|  
| 1 | Dashboard | /dashboard | full | Core | Dashboard |  
| 2 | Projects | /projects | full | Work | Projects |  
| 3 | Tasks | /tasks | full | Work | Tasks |  
| 4 | Time | /time | full | Billing | Time Tracking |  
| 5 | Invoicing | /invoices | full | Billing | Invoices |  
| 6 | Clients | /clients | full | CRM | Clients |  
| 7 | Team | /team | full | Admin | Team |  
| 8 | Settings | /settings | full | Admin | Settings |

**\#\# Part 2: Projects**  
\- **\*\*Purpose\*\***: Project lifecycle from proposal through delivery with task breakdown, milestones, and budget tracking  
\- **\*\*Route\*\***: /projects | **\*\*Shell\*\***: full | **\*\*Group\*\***: Work  
\- **\*\*Key Entities\*\***: projects, milestones, project\_members, project\_budgets  
\- **\*\*Actions\*\***: Create project, set milestones, assign team, track budget, update status, archive  
\- **\*\*Cascade Triggers\*\***: Project complete → generate final invoice; milestone hit → notification  
\- **\*\*Related Modules\*\***: Tasks, Time, Invoicing, Clients  
\- **\*\*Knowledge\*\***: skills/projects/projects.skill.md, tools/db/projects-crud.tool.md

**\#\# Part 9: Cross-Module Workflow Families**  
**\#\#\# 1\. Proposal-to-Delivery**  
Clients → Projects → Tasks → Time → Invoicing  
\- Win client → create project → break into tasks → track time → invoice at milestones

**\#\# Part 10: Database Schema Overview**  
**\#\#\# Work**  
\- \`projects\` — project records (name, client\_id, status, budget, dates)  
\- \`milestones\` — project milestones (project\_id, name, due\_date, status)  
\- \`tasks\` — task records (project\_id, assignee\_id, status, due\_date)  
**\#\#\# Billing**  
\- \`time\_entries\` — tracked time (task\_id, user\_id, duration, billable)  
\- \`invoices\` — invoice records (client\_id, project\_id, amount, status)  
\`\`\`\`

**\#\#\# E-Commerce**

\`\`\`\`markdown  
**\# ShopCore — Master Knowledge Base**

**\#\# Part 1: Platform Overview**

**\#\#\# Mission**  
ShopCore is a multi-vendor e-commerce platform that manages product catalogs, orders, fulfillment, and customer relationships across independent storefronts.

**\#\#\# Architecture**  
\- **\*\*Stack\*\***: React 18 \+ TypeScript \+ Vite, Zustand, shadcn/ui, Supabase  
\- **\*\*Multi-tenant\*\***: \`store\_id\` on every row, RLS enforced  
\- **\*\*Data flow\*\***: TanStack Query, Stripe Connect for payments

**\#\#\# Module Map (12 Modules)**  
| \# | Module | Route | Shell | Group | Default Label |  
|---|--------|-------|-------|-------|--------------|  
| 1 | Dashboard | /dashboard | full | Core | Dashboard |  
| 2 | Products | /products | full | Catalog | Products |  
| 3 | Orders | /orders | full | Sales | Orders |  
| 4 | Customers | /customers | full | People | Customers |  
| 5 | Inventory | /inventory | full | Operations | Inventory |  
| 6 | Shipping | /shipping | full | Operations | Shipping |  
| 7 | Coupons | /coupons | full | Marketing | Coupons |  
| 8 | Reviews | /reviews | full | Engagement | Reviews |  
| 9 | Analytics | /analytics | focused | Intelligence | Analytics |  
| 10 | Payments | /payments | full | Finance | Payments |  
| 11 | Storefront | /storefront | embedded | Public | Storefront |  
| 12 | Settings | /settings | full | Admin | Settings |

**\#\# Part 2: Products**  
\- **\*\*Purpose\*\***: Product catalog management — listings, variants, pricing, images, categories  
\- **\*\*Route\*\***: /products | **\*\*Shell\*\***: full | **\*\*Group\*\***: Catalog  
\- **\*\*Key Entities\*\***: products, product\_variants, product\_images, categories, product\_categories  
\- **\*\*Actions\*\***: Create product, manage variants, set pricing, upload images, categorize, publish/draft  
\- **\*\*Cascade Triggers\*\***: Stock zero → auto-unpublish; price change → cart update notification  
\- **\*\*Related Modules\*\***: Inventory, Orders, Analytics  
\- **\*\*Knowledge\*\***: skills/products/products.skill.md, tools/db/products-crud.tool.md

**\#\# Part 13: Cross-Module Workflow Families**  
**\#\#\# 1\. Browse-to-Buy**  
Storefront → Products → Orders → Payments → Shipping  
\- Browse catalog → add to cart → checkout → pay → fulfill → deliver

**\#\#\# 2\. Inventory Lifecycle**  
Products → Inventory → Orders → Shipping  
\- Stock received → update inventory → allocate to orders → ship → deduct  
\`\`\`\`

**\#\#\# AI-Powered Platform (Full WAT)**

\`\`\`\`markdown  
**\# Solve with Grace — Master Knowledge Base**

**\#\# Part 1: Platform Overview**  
**\#\#\# Mission**  
Solve with Grace is an industry-adaptive unified work platform that consolidates CRM, finance, marketing, operations, collaboration, and AI-assisted intelligence into a single multi-tenant system.

**\#\#\# Module Map (33 Modules)**  
| \# | Module | Route | Shell | Group | Default Label |  
| 1-33 rows... |

**\#\#\# AI Agents**  
| Agent | Role | Edge Functions | Access Level |  
| 4 agents... |

**\#\#\# Orchestration Pipeline (7 Stages)**  
1-7 stages...

**\#\#\# Cascade Engine**  
4 dispatch types \+ safety limits...

**\#\#\# Industry Adaptation**  
7 concepts × 5 industries...

**\#\#\# Permission Model (5 Layers)**  
5 layers...

**\#\# Parts 2-34: Module Entries**  
33 individual module entries (6-10 lines each)...

**\#\# Part 35: Cross-Module Workflow Families**  
7 end-to-end process chains...

**\#\# Part 36: Database Schema Overview**  
60+ tables grouped by 8 domains...

**\#\# Part 37: Risk Level Reference**  
3-level risk classification table...

**\#\# Part 38: Knowledge File Reference**  
126 knowledge files across 9 categories...  
\`\`\`\`

\---

**\#\# 14\. Integration Checklist**

**\#\#\# Creating prod.md**

\- \[ \] Create \`knowledge/prod.md\`  
\- \[ \] Write Part 1: Platform Overview  
  \- \[ \] Mission (1 paragraph)  
  \- \[ \] Architecture (5-8 bullets)  
  \- \[ \] Module Map (all modules in one table)  
  \- \[ \] AI Agents table (if applicable)  
  \- \[ \] Orchestration Pipeline (if applicable)  
  \- \[ \] Cascade Engine (if applicable)  
  \- \[ \] Industry Adaptation table (if applicable)  
  \- \[ \] Permission Model (numbered layers)  
\- \[ \] Write module entries (Parts 2-N, one per module)  
  \- \[ \] Each entry has correct archetype fields  
  \- \[ \] Each entry is 6-10 lines  
  \- \[ \] Modules ordered by dependency depth  
\- \[ \] Write Cross-Module Workflow Families (Part N+1)  
  \- \[ \] 4-10 families covering key end-to-end processes  
  \- \[ \] Each family shows 3-5 module chain  
\- \[ \] Write Database Schema Overview (Part N+2)  
  \- \[ \] All tables listed, grouped by domain  
  \- \[ \] Common column pattern included  
\- \[ \] Write Risk Level Reference (Part N+3)  
\- \[ \] Write Knowledge File Reference (Part N+4)  
\- \[ \] Reference prod.md in CLAUDE.md

**\#\#\# Per Module Entry**

\- \[ \] Purpose is one clear sentence  
\- \[ \] Route/Shell/Group matches actual configuration  
\- \[ \] Key Entities lists only tables owned by this module  
\- \[ \] Industry Labels included only if labels actually differ (skip for Standard Domain if not adaptive)  
\- \[ \] Actions are 4-8 verb phrases at the right granularity  
\- \[ \] Cascade Triggers use \`Event → Effect\` format (or omitted if none)  
\- \[ \] Related Modules list actual integration partners  
\- \[ \] Knowledge paths point to files that exist on disk

**\#\#\# Keeping prod.md Updated**

\- \[ \] Update Module Map when modules are added/removed/renamed  
\- \[ \] Update module entries when entities, actions, or integrations change  
\- \[ \] Update Database Schema when new tables are created  
\- \[ \] Update Workflow Families when new cross-module processes emerge  
\- \[ \] Update Knowledge File Reference counts after adding/removing files  
\- \[ \] Verify total line count stays under 700 lines

**\#\#\# Validation**

\- \[ \] Every module in Module Map has a corresponding Part entry  
\- \[ \] Every Part entry's Knowledge paths point to real files  
\- \[ \] Every Key Entity table name appears in Database Schema Overview  
\- \[ \] Every Related Module reference is a valid module from the Module Map  
\- \[ \] Workflow Families reference modules that exist in the Module Map  
\- \[ \] Industry Labels are consistent across all module entries that use them  
\- \[ \] Part numbers are sequential with no gaps  
\- \[ \] File is under 700 lines total

\---

**\#\# Quick Reference Card**

\`\`\`  
MASTER KNOWLEDGE BASE (prod.md) CHEAT SHEET  
\============================================

PURPOSE: Single-document domain reference — wide but shallow.  
         Load for full-platform context; use skill files for depth.

STRUCTURE:  
  Part 1: Platform Overview  
    Mission, Architecture, Module Map, AI Agents,  
    Orchestration, Cascades, Industry, Permissions  
  Parts 2-N: Module Entries (one per module, 6-10 lines each)  
    Purpose, Route/Shell/Group, Key Entities, Industry Labels,  
    Actions, Cascade Triggers, Related Modules, Knowledge paths  
  Part N+1: Cross-Module Workflow Families (4-10 families)  
    Module chain \+ step-by-step description  
  Part N+2: Database Schema Overview (tables by domain)  
  Part N+3: Risk Level Reference  
  Part N+4: Knowledge File Reference

4 MODULE ARCHETYPES:  
  Standard Domain:  Has entities, industry labels, cascades (60-70%)  
  Infrastructure:   Admin/config, no labels, no cascades (10-15%)  
  AI Agent:         Edge functions, interaction modes (5-15%)  
  Intelligence:     Read-focused, connects broadly (10-15%)

SIZING TARGETS:  
  Small project:  80-200 lines (3-8 modules)  
  Medium project: 200-380 lines (8-15 modules)  
  Large project:  380-550 lines (15-30 modules)  
  Maximum:        \~700 lines (to fit in LLM context)

LOAD prod.md WHEN:  
  ✅ Cross-module features  
  ✅ New module design  
  ✅ Architecture decisions  
  ✅ Codebase onboarding

DON'T LOAD WHEN:  
  ❌ Single-module work (load skill file)  
  ❌ Bug fix (load tool file)  
  ❌ Process implementation (load workflow file)  
\`\`\`

\---

**\#\# Companion Templates**

This document is part of the WAT Framework template library:

| Template | File | Contents |  
|----------|------|---------|  
| CLAUDE.md | \`docs/CLAUDE-MD-TEMPLATE.md\` | Agent instructions file template |  
| Skill Index | \`docs/SKILL-INDEX-TEMPLATE.md\` | Skill file templates (3 archetypes) |  
| Workflow Index | \`docs/WORKFLOW-INDEX-TEMPLATE.md\` | Workflow file templates (4 archetypes) |  
| Tool Index | \`docs/TOOL-INDEX-TEMPLATE.md\` | Tool file templates (4 categories) |  
| **\*\*Master KB (prod.md)\*\*** | **\*\*\`docs/PROD-KNOWLEDGE-BASE-TEMPLATE.md\`\*\*** | **\*\*Full domain reference template ← You are here\*\*** |  
| WAT Framework | \`docs/WAT-FRAMEWORK-TEMPLATE.md\` | Master framework template (all layers) |  
| Task System | \`docs/TASK-SYSTEM-TEMPLATE.md\` | Task tracking database \+ UI template |  
| AI Dev Framework | \`docs/AI-DEV-FRAMEWORK-TEMPLATE.md\` | Full framework integration template |

\---

*\*Template version 1.0 — Based on a production master knowledge base covering 33 modules, 4 AI agents, 60+ database tables, 7 workflow families, and 126 knowledge files in a 526-line single-document reference.\**

