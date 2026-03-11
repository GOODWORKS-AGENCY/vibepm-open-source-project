**\# Skill Index Framework Template**

\> A complete, reusable template for building a **\*\*knowledge/skills\*\*** system that AI coding agents can load per-task. Drop into any project — greenfield or brownfield.

\---

**\#\# Table of Contents**

1\. \[What Is a Skill Index?\](\#1-what-is-a-skill-index)  
2\. \[Anatomy of the Skill Index\](\#2-anatomy-of-the-skill-index)  
3\. \[The Three Skill Archetypes\](\#3-the-three-skill-archetypes)  
4\. \[Skill Index Template (skills.md)\](\#4-skill-index-template)  
5\. \[Shared Skill Template\](\#5-shared-skill-template)  
6\. \[Module Skill Template\](\#6-module-skill-template)  
7\. \[AI Agent Skill Template\](\#7-ai-agent-skill-template)  
8\. \[Section-by-Section Annotation Guide\](\#8-section-by-section-annotation-guide)  
9\. \[How Agents Load Skills\](\#9-how-agents-load-skills)  
10\. \[Sizing Guide\](\#10-sizing-guide)  
11\. \[Examples for Different Project Types\](\#11-examples-for-different-project-types)  
12\. \[Integration Checklist\](\#12-integration-checklist)

\---

**\#\# 1\. What Is a Skill Index?**

A **\*\*Skill Index\*\*** is a master manifest file (\`skills.md\`) that catalogs every skill file in your knowledge base. AI agents read the index first, then load only the skill files relevant to their current task.

\`\`\`  
HOW IT WORKS  
\============

Agent picks up task  
       |  
       v  
Read skills.md (index)  
       |  
       v  
Match task's wat\_references\[\] to skill files  
       |  
       v  
Load matched skill files into context  
       |  
       v  
Agent now knows:  
  \- WHAT the domain is (entities, rules, terminology)  
  \- HOW things connect (dependencies, cascades)  
  \- WHAT to build (schemas, actions, examples)  
\`\`\`

**\*\*Why not just put everything in CLAUDE.md?\*\***  
\- CLAUDE.md gives the agent *\*general instructions\** (stack, conventions, commands).  
\- Skill files give the agent *\*domain-specific knowledge\** loaded on demand.  
\- A 50-module platform with all domain knowledge in CLAUDE.md would be 10,000+ lines and blow through context windows. Skills keep it surgical.

**\*\*The three file types in a knowledge base:\*\***

| Type | Purpose | Loaded When |  
|------|---------|-------------|  
| **\*\*Skill\*\*** | Domain knowledge — WHAT to build | Working on a module or cross-cutting concept |  
| **\*\*Tool\*\*** | Build specifications — HOW to build | Implementing a specific CRUD, API, or UI spec |  
| **\*\*Workflow\*\*** | Process definitions — WHEN things happen | Implementing a multi-step business process |

This template covers **\*\*Skills\*\***. See companion templates for Tools and Workflows.

\---

**\#\# 2\. Anatomy of the Skill Index**

The skill index is a single markdown file that serves as a lookup table. It has two sections:

\`\`\`  
skills.md  
├── Shared Skills Table     (cross-cutting concerns used by all modules)  
└── Module Skills Table     (per-module domain knowledge)  
\`\`\`

Each row in the index links to a skill file on disk:

\`\`\`  
knowledge/  
├── skills.md                  \<-- The index (this file)  
├── skills/  
│   ├── shared/                \<-- Cross-cutting skills  
│   │   ├── auth.skill.md  
│   │   ├── audit.skill.md  
│   │   ├── orchestration.skill.md  
│   │   └── ...  
│   ├── {{module-a}}/          \<-- Per-module skills  
│   │   └── {{module-a}}.skill.md  
│   ├── {{module-b}}/  
│   │   └── {{module-b}}.skill.md  
│   └── {{ai-agent}}/         \<-- AI agent skills (if applicable)  
│       └── {{ai-agent}}.skill.md  
\`\`\`

**\*\*File naming convention:\*\*** \`{name}.skill.md\` — always ends in \`.skill.md\`.

\---

**\#\# 3\. The Three Skill Archetypes**

Every skill file follows one of three patterns. Choose the right one based on what you're documenting.

**\#\#\# Archetype A: Shared Skill (Cross-Cutting Concern)**

**\*\*Use for:\*\*** System-wide patterns that span all modules — authentication, orchestration, audit logging, cascade rules, terminology, multi-tenancy.

**\*\*Distinguishing traits:\*\***  
\- No module route or UI  
\- Used by all (or most) modules  
\- Defines infrastructure-level behavior  
\- Contains decision trees and classification logic  
\- Heavy on rules, light on entity schemas

**\*\*Examples:\*\***  
\- \`shared/orchestration\` — Pipeline that all workflows follow  
\- \`shared/auth-permissions\` — Permission model used everywhere  
\- \`shared/cascade-engine\` — Cross-module automation rules  
\- \`shared/audit\` — Immutable audit logging  
\- \`shared/multi-tenancy\` — Organization scoping and data isolation

**\#\#\# Archetype B: Module Skill (Domain Knowledge)**

**\*\*Use for:\*\*** A specific business domain / feature module — members, donations, events, tasks, deals, tickets, etc.

**\*\*Distinguishing traits:\*\***  
\- Has a module route (\`/members\`, \`/donations\`, etc.)  
\- Defines entity schemas with full field tables  
\- Lists available actions with permission requirements  
\- Includes cascade triggers (what happens when entities change)  
\- Has industry terminology variations  
\- Has NL command classification (if AI-enabled)

**\*\*Examples:\*\***  
\- \`members/members\` — People directory  
\- \`donations/donations\` — Gift and revenue lifecycle  
\- \`events/events\` — Event management  
\- \`customer-support/customer-support\` — Ticketing and SLA

**\#\#\# Archetype C: AI Agent Skill (Agent Behavior)**

**\*\*Use for:\*\*** An AI agent's behavior, capabilities, and interaction patterns.

**\*\*Distinguishing traits:\*\***  
\- Defines interaction modes (chat, orchestrated, proactive)  
\- Describes NL command classification logic  
\- Lists edge functions with input/output schemas  
\- Defines delegation rules (when to hand off to other agents)  
\- Contains conversation examples with full classification traces

**\*\*Examples:\*\***  
\- \`grace/grace\` — Conversational orchestrator  
\- \`noa/noa\` — Analytics and predictions  
\- \`ark/ark\` — Recommendations engine  
\- \`raven/raven\` — Research agent

\---

**\#\# 4\. Skill Index Template**

Copy this file to \`knowledge/skills.md\` and customize.

\`\`\`\`markdown  
**\# Skill Index**

Auto-generated index of all skill files in the knowledge base.

\<\!-- ANNOTATION: This is the master manifest. AI agents read this first to find  
     the right skill file for their current task. Keep it sorted and up to date.  
     The agent matches task.wat\_references\[\] entries against the File column. \--\>

**\#\# Shared Skills**

\<\!-- ANNOTATION: Cross-cutting concerns that apply to all or most modules.  
     These are loaded when working on infrastructure, security, or platform-wide features. \--\>

| Skill | File | Description | Triggers |  
|-------|------|-------------|----------|  
| {{Skill Name}} | skills/shared/{{name}}.skill.md | {{One-line description}} | {{When this skill is relevant}} |  
| {{Skill Name}} | skills/shared/{{name}}.skill.md | {{One-line description}} | {{When this skill is relevant}} |

\<\!-- CUSTOMIZE: Add one row per shared skill. Typical projects have 3-10 shared skills.  
     Common shared skills:  
     \- Authentication & Authorization  
     \- Audit / Activity Logging  
     \- Multi-Tenancy / Organization Scoping  
     \- Notification System  
     \- Orchestration Pipeline (if AI-enabled)  
     \- Cascade / Event Bus (if cross-module automation exists)  
     \- Terminology / i18n (if multi-industry or multi-locale)  
     \- Error Handling Patterns  
\--\>

**\#\# Module Skills**

\<\!-- ANNOTATION: One skill file per domain module. Each skill defines the entities,  
     actions, business rules, and cascades for that module. \--\>

| \# | Module | File | Key Entities | Available Actions |  
|---|--------|------|-------------|-------------------|  
| 1 | {{Module Name}} | skills/{{module}}/{{module}}.skill.md | {{Entity1, Entity2}} | {{Action1, Action2, Action3}} |  
| 2 | {{Module Name}} | skills/{{module}}/{{module}}.skill.md | {{Entity1, Entity2}} | {{Action1, Action2, Action3}} |

\<\!-- CUSTOMIZE: Add one row per module. Order by module number or dependency order.  
     Key Entities \= the main database tables/objects this module manages.  
     Available Actions \= the main operations users can perform.  
\--\>

**\#\# AI Agent Skills (Optional)**

\<\!-- ANNOTATION: Only needed if your project has AI agents. Each agent gets its own  
     skill file that defines how it interprets commands, delegates work, and interacts. \--\>

| Agent | File | Capabilities | Edge Functions |  
|-------|------|-------------|----------------|  
| {{Agent Name}} | skills/{{agent}}/{{agent}}.skill.md | {{Capability list}} | {{edge-function-1, edge-function-2}} |

\<\!-- CUSTOMIZE: Remove this section entirely if your project has no AI agents. \--\>

**\*\*Total: {{N}} skill files\*\*** ({{X}} shared \+ {{Y}} modules \+ {{Z}} agents)  
\`\`\`\`

\---

**\#\# 5\. Shared Skill Template**

Copy to \`knowledge/skills/shared/{{name}}.skill.md\` for each cross-cutting concern.

\`\`\`\`markdown  
**\# {{Skill Title}}**

\> **\*\*{{Tagline}}\*\***  
\> {{1-2 sentence summary of what this skill covers and why it matters.}}

\---

**\#\# Metadata**

\<\!-- ANNOTATION: The metadata table is machine-parseable. AI agents use it to  
     understand dependencies, trigger conditions, and scope before reading the  
     full skill content. Keep every field filled in. \--\>

| Field         | Value                                                        |  
|---------------|--------------------------------------------------------------|  
| Skill ID      | \`shared/{{name}}\`                                            |  
| Description   | {{One-line description}}                                     |  
| Category      | shared                                                       |  
| Version       | {{semver}}                                                   |  
| Last Updated  | {{YYYY-MM-DD}}                                               |  
| Triggers      | {{When this skill's logic is invoked}}                       |  
| Capabilities  | {{Comma-separated list of what this skill enables}}          |  
| Depends On    | {{Other skill IDs this depends on, or "None"}}               |  
| Used By       | {{Which modules/agents use this skill}}                      |

\---

**\#\# Core Instructions**

\<\!-- ANNOTATION: This is the main content. Write it as if you're teaching a new  
     developer (or AI agent) everything they need to implement or maintain this  
     system. Be exhaustive — this is the authoritative reference. \--\>

**\#\#\# Overview**

{{2-3 paragraphs explaining:  
  \- What this system does  
  \- Why it exists (what problem it solves)  
  \- How it fits into the broader architecture  
}}

**\#\#\# {{Subsection: Key Concept 1}}**

{{Detailed explanation of the first major concept.  
  Include:  
  \- Definition  
  \- Characteristics / constraints  
  \- Code/schema examples  
  \- Use cases  
}}

**\#\#\# {{Subsection: Key Concept 2}}**

{{Repeat for each major concept. Shared skills typically have 3-7 key concepts.}}

**\#\#\# {{Subsection: Key Concept N}}**

\<\!-- TIP: Use ASCII diagrams for flows and decision paths:

\`\`\`  
Step A \--\> Step B \--\> Step C  
              |  
              v  
         Step D (conditional)  
\`\`\`  
\--\>

\---

**\#\# Decision Trees**

\<\!-- ANNOTATION: Decision trees help agents classify situations without ambiguity.  
     Write them as indented YES/NO branches. Include one tree per major  
     classification the agent needs to make. \--\>

**\#\#\# {{Classification Name}}**

\`\`\`  
Is condition X true?  
  YES \--\> Outcome A  
  NO  \--\>  
    Is condition Y true?  
      YES \--\> Outcome B  
      NO  \--\> Outcome C  
\`\`\`

\<\!-- CUSTOMIZE: Remove this section if your shared skill doesn't require  
     classification logic. Not all shared skills need decision trees. \--\>

\---

**\#\# Entity Schema**

\<\!-- ANNOTATION: Only include this section if the shared skill owns database tables.  
     Many shared skills (like orchestration patterns) define behavior but don't own  
     tables — in that case, remove this section. \--\>

**\#\#\# {{table\_name}}**

| Column            | Type        | Description                                       |  
|-------------------|-----------|---------------------------------------------------|  
| id                | uuid      | Primary key                                       |  
| organization\_id   | uuid      | FK to organizations                               |  
| {{column}}        | {{type}}  | {{description}}                                   |  
| created\_at        | timestamptz | Creation timestamp                               |  
| updated\_at        | timestamptz | Last modification timestamp                      |

\<\!-- CUSTOMIZE: Add one table block per database table this skill owns. \--\>

\---

**\#\# Business Rules**

\<\!-- ANNOTATION: Numbered rules that the agent MUST follow when implementing or  
     modifying anything related to this skill. Write them as absolute statements.  
     Business rules are non-negotiable — they're the "laws" of this system. \--\>

1\. **\*\*{{Rule name}}.\*\*** {{Detailed rule description. Be specific about what must  
   happen, what must not happen, and what the consequences are.}}

2\. **\*\*{{Rule name}}.\*\*** {{Rule description.}}

3\. **\*\*{{Rule name}}.\*\*** {{Rule description.}}

\<\!-- CUSTOMIZE: Aim for 5-10 business rules. Each rule should be independently  
     testable. If a rule has exceptions, state them explicitly. \--\>

\---

**\#\# Usage Guidelines**

\<\!-- ANNOTATION: Practical guidance on HOW to use this skill's systems. Separate  
     sections for different consumers (frontend, backend, AI agents). Include  
     code snippets that developers can copy-paste. \--\>

**\#\#\# For Frontend Components**

{{Hook names, component patterns, and usage examples.}}

\`\`\`tsx  
// Example usage  
{{code snippet}}  
\`\`\`

**\#\#\# For Backend Services**

{{Function names, edge function patterns, and usage examples.}}

\`\`\`typescript  
// Example usage  
{{code snippet}}  
\`\`\`

**\#\#\# For AI Agents**

{{How each AI agent interacts with this system.}}

\<\!-- CUSTOMIZE: Remove sections that don't apply. A purely backend skill  
     doesn't need frontend guidelines, and vice versa. \--\>

\---

**\#\# Examples**

\<\!-- ANNOTATION: Concrete, realistic examples that show the skill in action.  
     Include 2-3 examples progressing from simple to complex. Each example  
     should trace through the full flow so the agent can pattern-match. \--\>

**\#\#\# Example 1: {{Simple Case}}**

\`\`\`  
{{Step-by-step trace through the flow}}  
\`\`\`

**\#\#\# Example 2: {{Medium Complexity Case}}**

\`\`\`  
{{Step-by-step trace}}  
\`\`\`

**\#\#\# Example 3: {{Complex / Edge Case}}**

\`\`\`  
{{Step-by-step trace}}  
\`\`\`

\---

**\#\# Related Skills**

\<\!-- ANNOTATION: Links to other skill files that interact with this one.  
     This helps agents load the right dependencies when working on features  
     that span multiple skills. Use Skill ID format. \--\>

\- \`{{skill-id}}\` \-- {{How this skill relates}}  
\- \`{{skill-id}}\` \-- {{How this skill relates}}

\<\!-- CUSTOMIZE: List every skill that directly interacts with this one.  
     A good rule of thumb: if modifying this skill would require changes  
     in another skill, list it here. \--\>  
\`\`\`\`

\---

**\#\# 6\. Module Skill Template**

Copy to \`knowledge/skills/{{module}}/{{module}}.skill.md\` for each domain module.

\`\`\`\`markdown  
**\# {{Module Name}} Module Skill**

**\#\# Metadata**

\<\!-- ANNOTATION: Module skills use a simpler metadata block than shared skills.  
     The key differences: module skills have a Route, Icon, and Permission Scope. \--\>

\- **\*\*Module\*\***: {{Display Name}} / {{Alternate Name}}  
\- **\*\*Route\*\***: \`/{{route}}\`  
\- **\*\*Version\*\***: {{semver}}  
\- **\*\*Default Industry\*\***: {{Default industry context, e.g., "Corporate"}}  
\- **\*\*Category\*\***: {{Category group, e.g., "Core — People & Relationships"}}  
\- **\*\*Dependencies\*\***: {{Comma-separated list of other modules this depends on}}  
\- **\*\*Icon\*\***: \`{{Lucide/icon name}}\`  
\- **\*\*Permission Scope\*\***: \`{{module}}:read\`, \`{{module}}:write\`, \`{{module}}:delete\`

\---

**\#\# Core Instructions**

**\#\#\# Purpose**

\<\!-- ANNOTATION: 1-2 paragraphs explaining WHAT this module does and WHY it exists.  
     Focus on the business value, not the technical implementation. An AI agent  
     reading this should understand the module's role in the broader platform. \--\>

{{Paragraph 1: What the module does and what business problem it solves.}}

{{Paragraph 2: How it relates to other modules — what data it consumes and produces.}}

**\#\#\# Available Actions**

\<\!-- ANNOTATION: Every operation a user (or AI agent) can perform in this module.  
     Each action maps to a backend operation and has a permission requirement.  
     This table is the action vocabulary — agents use it to classify user intents. \--\>

| Action              | Description                                              | Permission Required  |  
|---------------------|----------------------------------------------------------|----------------------|  
| \`{{action\_name}}\`   | {{What this action does}}                                | \`{{module}}:write\`   |  
| \`{{action\_name}}\`   | {{What this action does}}                                | \`{{module}}:read\`    |  
| \`{{action\_name}}\`   | {{What this action does}}                                | \`{{module}}:delete\`  |

\<\!-- CUSTOMIZE: List every user-facing action. Aim for 8-15 actions per module.  
     Use snake\_case for action names. Each action should be atomic and testable. \--\>

**\#\#\# Entity Schemas**

\<\!-- ANNOTATION: Full field-level schema for every database table this module owns.  
     This is the authoritative reference — more detailed than the migration SQL.  
     Include type, required flag, and description for every column. \--\>

**\#\#\#\# {{table\_name}}**

| Field               | Type        | Required | Description                                          |  
|---------------------|-------------|----------|------------------------------------------------------|  
| \`id\`                | \`uuid\`      | auto     | Primary key                                          |  
| \`organization\_id\`   | \`uuid\`      | yes      | FK to \`organizations.id\` (tenant)                    |  
| \`{{field\_name}}\`    | \`{{type}}\`  | {{yes/no/auto}} | {{Description}}                               |  
| \`created\_at\`        | \`timestamp\` | auto     | Record creation timestamp                            |  
| \`updated\_at\`        | \`timestamp\` | auto     | Last update timestamp                                |

**\*\*Relationships\*\***: {{Describe how this table relates to other tables.  
  Use format: \`table\` has-many \`other\_table\`, belongs-to \`parent\_table\`.}}

\<\!-- CUSTOMIZE: Add one entity schema block per table. Most modules have 1-4 tables.  
     Include all columns, even auto-generated ones, so the agent has the full picture. \--\>

**\#\#\#\# {{second\_table\_name}}**

| Field               | Type        | Required | Description                                          |  
|---------------------|-------------|----------|------------------------------------------------------|  
| ...                 | ...         | ...      | ...                                                  |

\---

**\#\# Business Rules**

\<\!-- ANNOTATION: The non-negotiable rules of this module. These govern validation,  
     state transitions, data integrity, and behavioral constraints. An agent MUST  
     follow every rule listed here. \--\>

1\. **\*\*{{Rule name}}\*\***: {{Detailed description. Include the constraint, the reason,  
   and what should happen when the rule is violated.}}

2\. **\*\*{{Rule name}}\*\***: {{Description.}}

\<\!-- CUSTOMIZE: Aim for 5-10 rules. Common categories:  
     \- Uniqueness constraints (email unique per org, etc.)  
     \- State machine transitions (which status changes are valid)  
     \- Computed fields (auto-maintained flags and counters)  
     \- Cascade behavior (what happens on create/update/delete)  
     \- Soft delete policy  
     \- Required fields and validation rules  
\--\>

\---

**\#\# Cascade Triggers**

\<\!-- ANNOTATION: What happens AFTER an action in this module completes.  
     Cascades are the "then" in "when X happens, then do Y in module Z."  
     These connect this module to the rest of the platform. \--\>

| Trigger Event                         | Cascade Action                                               |  
|---------------------------------------|--------------------------------------------------------------|  
| {{Entity}} created                    | {{What happens in response}}                                 |  
| {{Entity}} updated ({{field}})        | {{What happens in response}}                                 |  
| {{Entity}} deleted                    | {{What happens in response}}                                 |  
| {{Condition met}} (e.g., threshold)   | {{What happens in response}}                                 |

\<\!-- CUSTOMIZE: List every cascade trigger. Include the source event (left column)  
     and the downstream effect (right column). Reference target modules by name. \--\>

\---

**\#\# Industry Terminology Variations**

\<\!-- ANNOTATION: How labels change based on the organization's industry type.  
     This table drives the terminology system — the t() function resolves labels  
     using this mapping. If your project is single-industry, remove this section. \--\>

| Concept         | {{Industry 1}} | {{Industry 2}} | {{Industry 3}} | {{Industry 4}} |  
|-----------------|----------------|----------------|-----------------|-----------------|  
| Module Name     | {{label}}      | {{label}}       | {{label}}       | {{label}}       |  
| Single Record   | {{label}}      | {{label}}       | {{label}}       | {{label}}       |  
| {{Key concept}} | {{label}}      | {{label}}       | {{label}}       | {{label}}       |

\<\!-- CUSTOMIZE: Remove this section if your project only serves one industry.  
     Include one row per user-facing label that differs across industries. \--\>

\---

**\#\# NL Command Classification**

\<\!-- ANNOTATION: How an AI agent maps natural language to actions. Each row shows  
     an intent (from the Available Actions table) with example utterances a user  
     might type. This is the training data for intent classification. \--\>

| Intent              | Example Utterances                                                         |  
|---------------------|----------------------------------------------------------------------------|  
| \`{{action\_name}}\`   | "{{Example 1}}", "{{Example 2}}"                                          |  
| \`{{action\_name}}\`   | "{{Example 1}}", "{{Example 2}}"                                          |

**\*\*Disambiguation\*\***: {{Rules for resolving ambiguous commands, e.g., industry-specific  
synonyms, module-specific jargon, context-dependent interpretation.}}

\<\!-- CUSTOMIZE: Remove this section if your project has no AI agents. \--\>

\---

**\#\# Usage Guidelines**

\<\!-- ANNOTATION: Practical tips for building with this module. Include both  
     "always do" and "never do" guidance. \--\>

\- {{Guideline 1: What data to always return in queries.}}  
\- {{Guideline 2: Default values to set on creation.}}  
\- {{Guideline 3: Search behavior (fuzzy matching, filters, pagination).}}  
\- {{Guideline 4: Privacy/security considerations for this module's data.}}

\---

**\#\# Examples**

\<\!-- ANNOTATION: Realistic examples showing how a user interacts with this module  
     through an AI agent. Each example shows: user input \-\> classification \-\>  
     action \-\> response. Agents pattern-match against these. \--\>

**\#\#\# Example 1 \-- "{{Natural language command}}"**

**\*\*Classification\*\***: \`{{action\_name}}\`

**\*\*Action\*\***:  
\`\`\`json  
{  
  "action": "{{action\_name}}",  
  "params": {  
    "{{field}}": "{{value}}"  
  }  
}  
\`\`\`

**\*\*Response\*\***: {{What the agent says back.}}

**\#\#\# Example 2 \-- "{{Natural language command}}"**

**\*\*Classification\*\***: \`{{action\_name}}\`

**\*\*Action\*\***: {{Description of the query or operation.}}

**\#\#\# Example 3 \-- "{{Complex multi-step command}}"**

**\*\*Classification\*\***: \`{{action\_name}}\`

**\*\*Action\*\***: {{Description, including multi-step workflow if applicable.}}

\<\!-- CUSTOMIZE: Include 2-5 examples. At least one should be a simple CRUD  
     operation and one should be a complex query or multi-step action.  
     Remove this section if your project has no AI agents. \--\>  
\`\`\`\`

\---

**\#\# 7\. AI Agent Skill Template**

Copy to \`knowledge/skills/{{agent}}/{{agent}}.skill.md\` for each AI agent.

\`\`\`\`markdown  
**\# {{Agent Name}} AI**

\> {{One-line tagline describing the agent's role.}}  
\> {{1-2 sentence expansion of what the agent does.}}

\---

**\#\# Metadata**

| Field         | Value                                                        |  
|---------------|--------------------------------------------------------------|  
| Skill ID      | \`{{agent}}/{{agent}}\`                                        |  
| Description   | {{One-line description}}                                     |  
| Module        | {{Agent Display Name}} (\`/{{route}}\`)                        |  
| Category      | ai-agent                                                     |  
| Version       | {{semver}}                                                   |  
| Last Updated  | {{YYYY-MM-DD}}                                               |  
| Edge Functions| \`{{function-1}}\`, \`{{function-2}}\`                           |  
| Triggers      | {{What causes this agent to activate}}                       |  
| Capabilities  | {{Comma-separated list of capabilities}}                     |  
| Depends On    | {{Skill IDs this agent depends on}}                          |  
| Used By       | {{Who/what uses this agent}}                                 |

\---

**\#\# Core Instructions**

**\#\#\# Purpose**

{{2-3 paragraphs explaining:  
  \- What this agent does  
  \- How it differs from other agents  
  \- What it can and cannot do (access boundaries)  
}}

**\#\#\# Interaction Modes**

\<\!-- ANNOTATION: Each mode defines a distinct way users interact with the agent.  
     Most agents have 2-3 modes ranging from simple (Q\&A) to complex (orchestrated).  
     Define the trigger, response time target, examples, and behavior for each mode. \--\>

**\#\#\#\# {{Mode 1 Name}} ({{speed/complexity label}})**

{{Description of this interaction mode.}}

\- **\*\*Trigger\*\***: {{What activates this mode}}  
\- **\*\*Response time target\*\***: {{e.g., \< 2 seconds}}  
\- **\*\*Examples\*\***: {{2-3 example user inputs}}  
\- **\*\*Behavior\*\***: {{What the agent does — read-only? mutations? proposals?}}

**\#\#\#\# {{Mode 2 Name}} ({{speed/complexity label}})**

{{Description.}}

\- **\*\*Trigger\*\***: {{What activates this mode}}  
\- **\*\*Response time target\*\***: {{e.g., \< 5 seconds}}  
\- **\*\*Examples\*\***: {{2-3 example user inputs}}  
\- **\*\*Behavior\*\***: {{What the agent does}}

**\#\#\#\# {{Mode 3 Name}} ({{speed/complexity label}})**

{{Description.}}

\- **\*\*Trigger\*\***: {{What activates this mode}}  
\- **\*\*Response time target\*\***: {{e.g., \< 10 seconds}}  
\- **\*\*Examples\*\***: {{2-3 example user inputs}}  
\- **\*\*Behavior\*\***: {{What the agent does}}

**\#\#\# NL Command Classification**

\<\!-- ANNOTATION: The decision tree the agent uses to classify every user input.  
     This must be deterministic — given the same input, the same classification  
     should always result. \--\>

**\#\#\#\# Classification Logic**

\`\`\`  
Input received \--\>  
  {{First branching question}}?  
    YES \--\> {{Outcome or next question}}  
    NO  \--\> {{Outcome or next question}}  
      {{Sub-question}}?  
        {{...continue branching...}}  
\`\`\`

**\#\#\#\# Intent Extraction**

{{Agent name}} extracts the following from every command:

1\. **\*\*{{Field 1}}\*\*** \-- {{What is extracted and how}}  
2\. **\*\*{{Field 2}}\*\*** \-- {{What is extracted and how}}  
3\. **\*\*{{Field 3}}\*\*** \-- {{What is extracted and how}}

**\#\#\# Key Capabilities**

\<\!-- ANNOTATION: Detailed explanation of each major capability. Include examples  
     with input/output traces so agents can pattern-match. \--\>

**\#\#\#\# {{Capability 1}}**

{{Description with code/trace example.}}

\`\`\`  
User: "{{example input}}"

Agent extracts:  
  {{field}}: "{{value}}"  
  {{field}}: "{{value}}"  
\`\`\`

**\#\#\#\# {{Capability 2}}**

{{Description with code/trace example.}}

\---

**\#\# Business Rules**

\<\!-- ANNOTATION: The safety and behavioral rules this agent MUST follow.  
     These are the guardrails — they prevent the agent from doing harm. \--\>

1\. **\*\*{{Rule name}}.\*\*** {{Rule description.}}

2\. **\*\*{{Rule name}}.\*\*** {{Rule description.}}

\<\!-- CUSTOMIZE: Common AI agent rules:  
     \- Never mutate without approval  
     \- Enforce user's permission scope  
     \- Log all interactions  
     \- Delegate analytics/recommendations to specialized agents  
     \- Sensitive operations always require confirmation  
     \- Risk levels determine approval flow  
\--\>

\---

**\#\# Cascade Triggers**

| Source Event                         | Cascade Action                                                | Priority |  
|--------------------------------------|---------------------------------------------------------------|----------|  
| {{Event}}                            | {{What the agent does in response}}                           | {{Critical/High/Medium/Low}} |  
| {{Event}}                            | {{What the agent does in response}}                           | {{Priority}} |

\---

**\#\# Industry Terminology Variations**

\<\!-- ANNOTATION: How the agent's labels change per industry. Remove if single-industry. \--\>

| Platform Term        | {{Industry 1}}  | {{Industry 2}}  | {{Industry 3}}  | {{Industry 4}}  |  
|----------------------|-----------------|-----------------|------------------|------------------|  
| {{Agent Name}}       | {{label}}       | {{label}}        | {{label}}        | {{label}}        |  
| {{Mode 1 Name}}      | {{label}}       | {{label}}        | {{label}}        | {{label}}        |  
| {{Mode 2 Name}}      | {{label}}       | {{label}}        | {{label}}        | {{label}}        |

\---

**\#\# Usage Guidelines**

**\#\#\# When to Use This Skill**

\- {{Scenario 1}}  
\- {{Scenario 2}}  
\- {{Scenario 3}}

**\#\#\# When NOT to Use This Skill**

\- {{Anti-pattern 1 — use {{other skill}} instead}}  
\- {{Anti-pattern 2 — use {{other skill}} instead}}

**\#\#\# Edge Function Details**

**\#\#\#\# \`{{function-name}}\`**

{{What this edge function does.}}

\`\`\`  
Input:  { {{field}}, {{field}}, {{field}} }  
Output: { {{field}}, {{field}}, {{field}} }  
\`\`\`

**\#\#\#\# \`{{function-name}}\`**

{{What this edge function does.}}

\`\`\`  
Input:  { {{field}}, {{field}} }  
Output: { {{field}} }  
\`\`\`

\---

**\#\# Examples**

**\#\#\# Example 1: {{Simple Interaction}}**

\`\`\`  
User: "{{input}}"

Classification: {{mode}} mode ({{reason}})  
Processing:  
  \- {{Step 1}}  
  \- {{Step 2}}

Agent response:  
  "{{response text}}"

{{UI behavior: No proposal shown / Proposal shown / Suggestion card shown}}  
\`\`\`

**\#\#\# Example 2: {{Multi-Step Interaction}}**

\`\`\`  
User: "{{input}}"

Classification: {{mode}} mode ({{reason}})  
Context assembly:  
  \- {{Context item 1}}  
  \- {{Context item 2}}

Agent builds workflow (Proposal UI):  
  Step 1: {{action}} in {{module}}  
  Step 2: {{action}} in {{module}}  
  Step 3: {{action}} in {{module}}

  Risk level: {{LOW/MEDIUM/HIGH}}  
  \[Approve All\] \[Edit\] \[Cancel\]

User clicks \[Approve All\] \--\> {{outcome}}  
\`\`\`

**\#\#\# Example 3: {{Proactive / Event-Driven Interaction}}**

\`\`\`  
Event: {{trigger event}}

Agent suggestion card appears:  
  "{{suggestion text}}

   \[Accept All\] \[Customize\] \[Dismiss\]"

User clicks \[Customize\]:  
  \- {{modification 1}}  
  \- {{modification 2}}

Agent executes:  
  Step 1: {{action}}  
  Step 2: {{action}}  
\`\`\`

\---

**\#\# Related Skills**

\- \`{{skill-id}}\` \-- {{Relationship description}}  
\- \`{{skill-id}}\` \-- {{Relationship description}}  
\`\`\`\`

\---

**\#\# 8\. Section-by-Section Annotation Guide**

Why each section exists and what the agent uses it for:

**\#\#\# Metadata Table**

| Field | Why It Exists | How the Agent Uses It |  
|-------|--------------|----------------------|  
| **\*\*Skill ID\*\*** | Unique identifier for cross-referencing | Agents match \`wat\_references\[\]\` to this ID |  
| **\*\*Description\*\*** | Quick summary | Agent decides if this skill is relevant to the task |  
| **\*\*Category\*\*** | Grouping (\`shared\`, \`module\`, \`ai-agent\`) | Helps agent understand the skill's scope |  
| **\*\*Version\*\*** | Change tracking | Agent knows if it's reading the latest version |  
| **\*\*Last Updated\*\*** | Freshness signal | Agent prioritizes recent skills over stale ones |  
| **\*\*Triggers\*\*** | When this skill's logic fires | Agent knows when to apply this skill's rules |  
| **\*\*Capabilities\*\*** | What this skill enables | Agent matches task requirements to capabilities |  
| **\*\*Depends On\*\*** | Other skills needed for context | Agent loads dependencies alongside this skill |  
| **\*\*Used By\*\*** | Who consumes this skill | Agent understands blast radius of changes |

**\#\#\# Core Instructions**

| Section | Purpose |  
|---------|---------|  
| **\*\*Overview\*\*** | Gives the agent the "big picture" before diving into details |  
| **\*\*Subsections\*\*** | Teach the agent each major concept sequentially |  
| **\*\*ASCII diagrams\*\*** | Visual flows the agent can trace step-by-step |  
| **\*\*Code examples\*\*** | Patterns the agent can copy and adapt |

**\#\#\# Decision Trees**

| Purpose | How the Agent Uses It |  
|---------|----------------------|  
| Remove ambiguity | Agent follows branches to classify situations deterministically |  
| Define risk levels | Agent knows when to auto-approve vs. require human approval |  
| Route actions | Agent knows which execution path to follow |

**\#\#\# Entity Schema**

| Purpose | How the Agent Uses It |  
|---------|----------------------|  
| Define data shape | Agent generates correct SQL, types, and validation |  
| Show relationships | Agent understands JOINs and foreign keys |  
| Mark required fields | Agent validates input before mutations |  
| Show constraints | Agent enforces uniqueness, enums, and check constraints |

**\#\#\# Business Rules**

| Purpose | How the Agent Uses It |  
|---------|----------------------|  
| Non-negotiable constraints | Agent NEVER violates these rules |  
| State machine transitions | Agent validates status changes |  
| Side effect definitions | Agent knows what cascades to expect |  
| Exception handling | Agent knows how to handle edge cases |

**\#\#\# Cascade Triggers**

| Purpose | How the Agent Uses It |  
|---------|----------------------|  
| Cross-module effects | Agent knows what will happen downstream |  
| Automation rules | Agent includes cascades in workflow planning |  
| Impact assessment | Agent calculates risk level based on cascade scope |

**\#\#\# Industry Terminology**

| Purpose | How the Agent Uses It |  
|---------|----------------------|  
| Label resolution | Agent uses the right words for the user's industry |  
| Disambiguation | Agent interprets industry-specific terms correctly |  
| UI rendering | Agent generates labels that match the org's context |

**\#\#\# NL Command Classification**

| Purpose | How the Agent Uses It |  
|---------|----------------------|  
| Intent mapping | Agent converts user speech to structured actions |  
| Example utterances | Agent pattern-matches against real-world phrasing |  
| Disambiguation rules | Agent resolves ambiguous commands correctly |

**\#\#\# Examples**

| Purpose | How the Agent Uses It |  
|---------|----------------------|  
| Pattern matching | Agent recognizes similar situations and applies the same approach |  
| Full trace | Agent sees the complete flow from input to output |  
| Edge cases | Agent handles unusual scenarios correctly |

\---

**\#\# 9\. How Agents Load Skills**

**\#\#\# The Loading Chain**

\`\`\`  
1\. Agent picks up a task from the task queue  
   └── Task has: wat\_references: \["knowledge/skills/members/members.skill.md"\]

2\. Agent reads the skill index (skills.md)  
   └── Finds the entry for members/members  
   └── Notes dependencies: donations, volunteers, events

3\. Agent loads the primary skill file  
   └── knowledge/skills/members/members.skill.md

4\. Agent optionally loads dependent skills (if the task crosses modules)  
   └── knowledge/skills/donations/donations.skill.md (if task involves donations)

5\. Agent now has full context:  
   └── Entity schemas (what tables exist, what fields they have)  
   └── Business rules (what constraints to follow)  
   └── Available actions (what operations are valid)  
   └── Cascade triggers (what side effects to expect)  
   └── Examples (patterns to follow)  
\`\`\`

**\#\#\# Referencing Skills in Task Definitions**

In your task tracking system, each task can reference skill files:

\`\`\`sql  
INSERT INTO project\_tasks (task\_code, title, wat\_references)  
VALUES (  
  'P5-03',  
  'Build contact merge workflow',  
  ARRAY\[  
    'knowledge/skills/members/members.skill.md',  
    'knowledge/skills/shared/audit.skill.md'  
  \]  
);  
\`\`\`

**\#\#\# CLAUDE.md Integration**

In your CLAUDE.md file, add this section:

\`\`\`markdown  
**\#\# Knowledge Base**  
Domain knowledge is in \`knowledge/\`. Load relevant files based on task:  
\- @knowledge/skills.md — Skill index (find the right domain skill to load)

**\#\#\# Loading by task type:**  
\- **\*\*Working on a specific module\*\***: Load \`knowledge/skills/\[module\]/\[module\].skill.md\`  
\- **\*\*Cross-cutting concerns\*\***: Load \`knowledge/skills/shared/\[topic\].skill.md\`  
\- **\*\*AI agent behavior\*\***: Load \`knowledge/skills/\[agent\]/\[agent\].skill.md\`  
\`\`\`

\---

**\#\# 10\. Sizing Guide**

**\#\#\# How Many Skills Do You Need?**

| Project Size | Shared Skills | Module Skills | AI Agent Skills | Total |  
|-------------|--------------|--------------|----------------|-------|  
| **\*\*Small\*\*** (1-5 modules) | 2-3 | 1-5 | 0 | 3-8 |  
| **\*\*Medium\*\*** (6-15 modules) | 4-6 | 6-15 | 0-2 | 10-23 |  
| **\*\*Large\*\*** (16-33+ modules) | 5-10 | 16-33 | 2-4 | 23-47 |

**\#\#\# How Long Should Each Skill Be?**

| Skill Archetype | Minimum Viable | Typical | Comprehensive |  
|----------------|---------------|---------|--------------|  
| **\*\*Shared Skill\*\*** | 80 lines | 200-400 lines | 500+ lines |  
| **\*\*Module Skill\*\*** | 60 lines | 150-250 lines | 400+ lines |  
| **\*\*AI Agent Skill\*\*** | 100 lines | 200-350 lines | 500+ lines |

**\#\#\# Minimum Viable Skill File (30 lines)**

If you're just starting out, every skill file needs at minimum:

\`\`\`markdown  
**\# {{Module Name}}**

**\#\# Metadata**  
\- **\*\*Module\*\***: {{Name}}  
\- **\*\*Route\*\***: \`/{{route}}\`

**\#\# Core Instructions**  
{{What this module does and why.}}

**\#\# Available Actions**  
| Action | Description | Permission |  
|--------|-------------|-----------|  
| {{action}} | {{desc}} | {{perm}} |

**\#\# Entity Schema**  
**\#\#\# {{table\_name}}**  
| Field | Type | Required | Description |  
|-------|------|----------|-------------|  
| id | uuid | auto | Primary key |  
| {{field}} | {{type}} | {{req}} | {{desc}} |

**\#\# Business Rules**  
1\. {{Rule 1}}  
2\. {{Rule 2}}  
\`\`\`

That's 30 lines and gives the agent enough to work with. Expand sections as your project matures.

\---

**\#\# 11\. Examples for Different Project Types**

**\#\#\# SaaS Platform (B2B)**

\`\`\`  
knowledge/skills/  
├── shared/  
│   ├── auth.skill.md              (RBAC, API keys, SSO)  
│   ├── billing.skill.md           (Subscriptions, usage metering)  
│   ├── multi-tenancy.skill.md     (Workspace isolation)  
│   └── audit.skill.md             (Activity log)  
├── dashboard/  
│   └── dashboard.skill.md  
├── projects/  
│   └── projects.skill.md          (Projects, tasks, boards)  
├── teams/  
│   └── teams.skill.md             (Team management)  
├── integrations/  
│   └── integrations.skill.md      (Third-party connectors)  
└── analytics/  
    └── analytics.skill.md         (Usage analytics, reports)  
\`\`\`

**\#\#\# E-Commerce Platform**

\`\`\`  
knowledge/skills/  
├── shared/  
│   ├── auth.skill.md              (Customer accounts, sessions)  
│   ├── payments.skill.md          (Stripe, PayPal, refunds)  
│   ├── inventory.skill.md         (Stock tracking, warehouses)  
│   └── notifications.skill.md     (Email, SMS, push)  
├── catalog/  
│   └── catalog.skill.md           (Products, variants, categories)  
├── cart/  
│   └── cart.skill.md              (Cart, checkout flow)  
├── orders/  
│   └── orders.skill.md            (Order lifecycle, fulfillment)  
├── customers/  
│   └── customers.skill.md         (Customer profiles, segments)  
└── promotions/  
    └── promotions.skill.md        (Coupons, sales, bundles)  
\`\`\`

**\#\#\# Mobile App (React Native)**

\`\`\`  
knowledge/skills/  
├── shared/  
│   ├── auth.skill.md              (OAuth, biometric, tokens)  
│   ├── offline.skill.md           (Offline-first, sync queue)  
│   ├── push-notifications.skill.md  
│   └── deep-linking.skill.md  
├── feed/  
│   └── feed.skill.md              (Content feed, infinite scroll)  
├── profile/  
│   └── profile.skill.md           (User profiles, settings)  
├── messaging/  
│   └── messaging.skill.md         (Chat, threads, media)  
└── discovery/  
    └── discovery.skill.md         (Search, recommendations)  
\`\`\`

**\#\#\# Internal Tools / Admin Panel**

\`\`\`  
knowledge/skills/  
├── shared/  
│   ├── auth.skill.md              (SSO, role-based access)  
│   ├── audit.skill.md             (Change log, compliance)  
│   └── data-export.skill.md       (CSV, PDF export patterns)  
├── users/  
│   └── users.skill.md             (User management, impersonation)  
├── content/  
│   └── content.skill.md           (CMS, pages, media library)  
├── reports/  
│   └── reports.skill.md           (Report builder, scheduling)  
└── config/  
    └── config.skill.md            (Feature flags, settings)  
\`\`\`

**\#\#\# AI-Powered Platform (with Agents)**

\`\`\`  
knowledge/skills/  
├── shared/  
│   ├── auth.skill.md  
│   ├── orchestration.skill.md     (Pipeline all agents follow)  
│   ├── cascade-engine.skill.md    (Cross-module automation)  
│   └── audit.skill.md  
├── assistant/                     (AI agent: user-facing)  
│   └── assistant.skill.md  
├── analyzer/                      (AI agent: analytics)  
│   └── analyzer.skill.md  
├── {{domain-modules}}/  
│   └── ...  
\`\`\`

\---

**\#\# 12\. Integration Checklist**

Use this checklist when adding the skill system to a project:

**\#\#\# Initial Setup**

\- \[ \] Create \`knowledge/\` directory at repo root  
\- \[ \] Create \`knowledge/skills.md\` (the index, from Section 4\)  
\- \[ \] Create \`knowledge/skills/shared/\` directory  
\- \[ \] Create \`knowledge/skills/\` subdirectory per module  
\- \[ \] Add knowledge base section to CLAUDE.md (see Section 9\)

**\#\#\# Per Shared Skill**

\- \[ \] Create \`knowledge/skills/shared/{{name}}.skill.md\` (from Section 5\)  
\- \[ \] Fill in Metadata table  
\- \[ \] Write Core Instructions with key concepts  
\- \[ \] Add Decision Trees (if classification logic exists)  
\- \[ \] Add Entity Schema (if the skill owns tables)  
\- \[ \] Write Business Rules (5-10 non-negotiable rules)  
\- \[ \] Add Usage Guidelines with code snippets  
\- \[ \] Write 2-3 Examples  
\- \[ \] List Related Skills  
\- \[ \] Add entry to \`skills.md\` index

**\#\#\# Per Module Skill**

\- \[ \] Create \`knowledge/skills/{{module}}/{{module}}.skill.md\` (from Section 6\)  
\- \[ \] Fill in Metadata block  
\- \[ \] Write Purpose section  
\- \[ \] Define Available Actions table  
\- \[ \] Document Entity Schemas with full field tables  
\- \[ \] Write Business Rules  
\- \[ \] Define Cascade Triggers  
\- \[ \] Add Industry Terminology Variations (if multi-industry)  
\- \[ \] Add NL Command Classification (if AI-enabled)  
\- \[ \] Write Usage Guidelines  
\- \[ \] Write 2-3 Examples  
\- \[ \] Add entry to \`skills.md\` index

**\#\#\# Per AI Agent Skill**

\- \[ \] Create \`knowledge/skills/{{agent}}/{{agent}}.skill.md\` (from Section 7\)  
\- \[ \] Fill in Metadata table  
\- \[ \] Write Purpose section  
\- \[ \] Define Interaction Modes (2-3 modes)  
\- \[ \] Write NL Command Classification with decision tree  
\- \[ \] Document Key Capabilities with input/output traces  
\- \[ \] Write Business Rules (safety guardrails)  
\- \[ \] Define Cascade Triggers  
\- \[ \] Add Industry Terminology Variations (if multi-industry)  
\- \[ \] Document Edge Functions with I/O schemas  
\- \[ \] Write 3 Examples (simple, multi-step, proactive)  
\- \[ \] List Related Skills  
\- \[ \] Add entry to \`skills.md\` index

**\#\#\# Validation**

\- \[ \] Every skill file referenced in \`skills.md\` exists on disk  
\- \[ \] Every \`wat\_references\` entry in task definitions points to a real file  
\- \[ \] Every skill's \`Depends On\` field references valid Skill IDs  
\- \[ \] No circular dependencies between skills  
\- \[ \] Every module in the project has a corresponding skill file  
\- \[ \] Skill file count matches the total in \`skills.md\`

\---

**\#\# Quick Reference Card**

\`\`\`  
SKILL FILE CHEAT SHEET  
\======================

Shared Skill  \= cross-cutting system (auth, audit, orchestration)  
Module Skill  \= domain feature (members, orders, tickets)  
Agent Skill   \= AI agent behavior (assistant, analyzer, researcher)

Every skill file has:  
  1\. Metadata          → Identity \+ dependencies  
  2\. Core Instructions → Full domain knowledge  
  3\. Business Rules    → Non-negotiable constraints  
  4\. Examples          → Pattern-matching traces

Module skills also have:  
  5\. Available Actions → The action vocabulary  
  6\. Entity Schemas    → Full field-level table definitions  
  7\. Cascade Triggers  → Cross-module side effects

Agent skills also have:  
  8\. Interaction Modes → How users interact with the agent  
  9\. NL Classification → Intent mapping decision tree  
  10\. Edge Functions   → API input/output schemas

File naming: {{name}}.skill.md  
Location:    knowledge/skills/{{category}}/{{name}}.skill.md  
Index:       knowledge/skills.md  
\`\`\`

