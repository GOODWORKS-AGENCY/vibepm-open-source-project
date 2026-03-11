\# Tool Index — Complete Framework Template

\> \*\*Tools are atomic operation specifications.\*\* They define the HOW — the exact input/output contracts, processing steps, error codes, and integration patterns for every discrete operation an AI agent or developer can invoke. Drop this template into any project to give coding agents precise instructions for implementing database queries, API endpoints, UI components, and automation engines.

\---

\#\# Table of Contents

1\. \[What Is a Tool Index?\](\#1-what-is-a-tool-index)  
2\. \[Anatomy of a Tool File\](\#2-anatomy-of-a-tool-file)  
3\. \[Four Tool Categories\](\#3-four-tool-categories)  
4\. \[Tool Index Template\](\#4-tool-index-template)  
5\. \[Database Tool Template (Full Annotated)\](\#5-database-tool-template-full-annotated)  
6\. \[API Tool Template (Full Annotated)\](\#6-api-tool-template-full-annotated)  
7\. \[UI Tool Template (Full Annotated)\](\#7-ui-tool-template-full-annotated)  
8\. \[Automation Tool Template (Full Annotated)\](\#8-automation-tool-template-full-annotated)  
9\. \[Specialized Variants\](\#9-specialized-variants)  
10\. \[Section-by-Section Annotation Guide\](\#10-section-by-section-annotation-guide)  
11\. \[How Agents Load Tools\](\#11-how-agents-load-tools)  
12\. \[Sizing Guide\](\#12-sizing-guide)  
13\. \[Examples for Different Project Types\](\#13-examples-for-different-project-types)  
14\. \[Integration Checklist\](\#14-integration-checklist)

\---

\#\# 1\. What Is a Tool Index?

A \*\*Tool Index\*\* (\`tools.md\`) is the master manifest of every atomic operation specification in the knowledge base. It's the "phone book" agents consult when they need to know \*\*HOW\*\* to execute a specific operation.

\#\#\# What It Does

\`\`\`  
Developer: "I need to create a new contact record"  
   │  
   ▼  
Agent reads tools.md  
   │ Finds: Contacts CRUD → tools/db/contacts-crud.tool.md  
   │  
   ▼  
Agent reads contacts-crud.tool.md  
   │ Learns: exact schema, create\_contact action, input fields,  
   │         validation rules, error codes, cascade triggers  
   │  
   ▼  
Agent writes correct INSERT statement, hook, and type definitions  
   on the first attempt  
\`\`\`

\#\#\# Tool vs. Skill vs. Workflow

| Layer | Answers | Example |  
|-------|---------|---------|  
| \*\*Skill\*\* | WHAT is the domain? | "Contacts have first\_name, last\_name, lifecycle stages..." |  
| \*\*Workflow\*\* | WHEN do things happen? | "When a donation arrives: validate → record → receipt → cascade..." |  
| \*\*Tool\*\* | HOW do I build it? | "INSERT into contacts with these fields, validate email uniqueness, return this shape, handle these errors" |

\*\*Key distinction:\*\* Skills describe entities and rules. Workflows describe processes. Tools describe \*\*individual operations\*\* — the atomic building blocks that workflows invoke.

\#\#\# Why Tools Matter

Without tool specs, agents:  
\- Guess at table schemas (wrong column names, missing fields)  
\- Miss validation rules (skip uniqueness checks, accept invalid states)  
\- Invent error codes (inconsistent error handling across the project)  
\- Forget cascade triggers (actions complete without firing downstream effects)  
\- Write incompatible API contracts (frontend and backend disagree on shapes)

With tool specs, agents:  
\- Write correct queries on the first attempt  
\- Implement complete validation with all edge cases  
\- Use consistent error codes project-wide  
\- Fire all required triggers and cascades  
\- Produce compatible contracts between frontend, backend, and integrations

\---

\#\# 2\. Anatomy of a Tool File

Every tool file follows a consistent structure regardless of category. The sections are:

\`\`\`  
TOOL FILE ANATOMY  
\=================

┌─────────────────────────────────────────────────────────┐  
│  \# Tool Title                                           │  
│                                                         │  
│  \#\# Metadata                                            │  
│  Description, version, category, dependencies,          │  
│  triggers, capabilities                                 │  
│                                                         │  
│  \#\# Schema / Endpoint (category-dependent)              │  
│  DB: table schema with column definitions               │  
│  API: HTTP method, path, rate limits                    │  
│  UI: N/A (actions describe the component interface)     │  
│  Automation: N/A (actions describe the engine interface)│  
│                                                         │  
│  \#\# Core Actions                                        │  
│  Each action has 4 aspects:                             │  
│    Input   → Parameters, types, required flags          │  
│    Process → Numbered algorithm steps                   │  
│    Output  → Return object structure                    │  
│    Errors  → UPPER\_SNAKE\_CASE error codes               │  
│                                                         │  
│  \#\# Processing Pipeline (API/Automation only)           │  
│  ASCII flowchart of multi-stage processing              │  
│                                                         │  
│  \#\# Rules (Automation only)                             │  
│  Hard constraints the engine enforces                   │  
│                                                         │  
│  \#\# Integration Guidelines                              │  
│  How consumers should interact with this tool           │  
│                                                         │  
│  \#\# Edge Cases                                          │  
│  Specific scenarios with handling instructions          │  
│                                                         │  
│  \#\# Implications                                        │  
│  Side effects, audit trail, cascade effects,            │  
│  performance considerations                             │  
└─────────────────────────────────────────────────────────┘  
\`\`\`

\#\#\# The Universal Action Format

Every action in every tool uses the same 4-aspect table:

\`\`\`markdown  
\#\#\# action\_name

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | Parameters with types, required flags, and validation notes |  
| \*\*Process\*\* | Numbered steps describing the exact algorithm |  
| \*\*Output\*\*  | Return object structure with field types |  
| \*\*Errors\*\*  | UPPER\_SNAKE\_CASE error codes with descriptions |  
\`\`\`

This is non-negotiable. Actions missing aspects produce incomplete implementations. The agent reads \*\*Input\*\* to know what parameters to accept, \*\*Process\*\* to know the algorithm, \*\*Output\*\* to know what to return, and \*\*Errors\*\* to know what can go wrong.

\---

\#\# 3\. Four Tool Categories

\#\#\# Quick Comparison

| Category | Purpose | Typical Actions | Has Schema? | Has Pipeline? | Has Rules? |  
|----------|---------|----------------|-------------|---------------|------------|  
| \*\*Database\*\* (\`db/\`) | CRUD on database tables | create, get, list, update, delete, search, merge | YES (table schema) | No | No |  
| \*\*API\*\* (\`api/\`) | Edge functions / API endpoints | 1-3 primary actions per endpoint | No (has Endpoint table) | YES | No |  
| \*\*UI\*\* (\`ui/\`) | Interactive component specifications | render, interact, approve, export | No | No | No |  
| \*\*Automation\*\* (\`automation/\`) | Background processing engines | evaluate, execute, queue, dispatch | No | Sometimes | YES |

\#\#\# Decision Tree: Which Category?

\`\`\`  
What am I building?

A database table with CRUD operations?  
  → Database tool (tools/db/{{entity}}-crud.tool.md)

An API endpoint / edge function / serverless function?  
  → API tool (tools/api/{{function}}.tool.md)

An interactive UI component shared across modules?  
  → UI tool (tools/ui/{{component}}.tool.md)

A background processing engine / queue / scheduler?  
  → Automation tool (tools/automation/{{engine}}.tool.md)  
\`\`\`

\#\#\# Category-Specific Sections

| Section | DB | API | UI | Automation |  
|---------|:--:|:---:|:--:|:----------:|  
| Metadata | ✅ | ✅ | ✅ | ✅ |  
| Schema (table definitions) | ✅ | — | — | — |  
| Endpoint (HTTP details) | — | ✅ | — | Sometimes |  
| Core Actions | ✅ | ✅ | ✅ | ✅ |  
| Processing Pipeline | — | ✅ | — | Sometimes |  
| Rules (hard constraints) | — | — | — | ✅ |  
| Integration Guidelines | ✅ | ✅ | ✅ | ✅ |  
| Edge Cases | ✅ | ✅ | ✅ | ✅ |  
| Implications | ✅ | ✅ | ✅ | ✅ |

\---

\#\# 4\. Tool Index Template

The tool index is the master manifest. One file, three or four tables.

\`\`\`\`markdown  
\# Tool Index

Auto-generated index of all tool files in the knowledge base.

\<\!-- ANNOTATION: Group tools by category. Each category gets its own table  
     with category-appropriate columns. The index is the lookup table agents  
     use to find the right tool spec for a given task. \--\>

\#\# Database Tools ({{N}})

\<\!-- ANNOTATION: DB tools are the most numerous. Columns: Tool name,  
     file path, key operations (verbs), primary entity (table name).  
     Agents use "Primary Entity" to match a table name to its spec. \--\>

| Tool | File | Key Operations | Primary Entity |  
|------|------|---------------|----------------|  
| {{Entity}} CRUD | tools/db/{{entity}}-crud.tool.md | Create, Read, Update, Delete, {{specialized}} | {{table\_name}} |  
| {{Read-Only Tool}} | tools/db/{{entity}}-query.tool.md | Read, Filter, Export | {{table\_name}} |

\#\# API Tools ({{N}})

\<\!-- ANNOTATION: API tools have different columns: function name,  
     auth type. Agents use "Edge Function" to identify which  
     Supabase/serverless function to implement or call. \--\>

| Tool | File | Edge Function | Auth Required |  
|------|------|--------------|--------------|  
| {{Name}} | tools/api/{{name}}.tool.md | {{function-name}} | Yes ({{auth type}}) |

\#\# UI Tools ({{N}})

\<\!-- ANNOTATION: UI tools describe interactive components.  
     Simple columns since UI tools are described by their actions. \--\>

| Tool | File | Description |  
|------|------|-------------|  
| {{Name}} | tools/ui/{{name}}.tool.md | {{One-line description}} |

\#\# Automation Tools ({{N}})

\<\!-- ANNOTATION: Automation tools describe background engines.  
     Same simple format as UI tools. \--\>

| Tool | File | Description |  
|------|------|-------------|  
| {{Name}} | tools/automation/{{name}}.tool.md | {{One-line description}} |

\*\*Total: {{N}} tool files\*\* ({{X}} DB \+ {{Y}} API \+ {{Z}} UI \+ {{W}} automation)  
\`\`\`\`

\#\#\# Index Sizing

| Project Size | DB Tools | API Tools | UI Tools | Automation Tools | Total |  
|-------------|----------|-----------|----------|-----------------|-------|  
| Small (1-5 modules) | 3-8 | 1-3 | 1-2 | 0-1 | 5-14 |  
| Medium (6-15 modules) | 8-20 | 3-8 | 2-4 | 1-2 | 14-34 |  
| Large (16-33+ modules) | 20-35 | 8-15 | 3-6 | 2-4 | 33-60 |

\---

\#\# 5\. Database Tool Template (Full Annotated)

Database tools are the backbone — one per primary entity. They define table schemas and CRUD operations.

\#\#\# Two DB Tool Archetypes

| Archetype | Description | Typical Actions | Example |  
|-----------|-------------|----------------|---------|  
| \*\*Standard CRUD\*\* | Full create/read/update/delete with domain-specific extras | create, get, list, update, delete \+ 1-3 specialized | contacts-crud, donations-crud, deals-crud |  
| \*\*Read-Only Query\*\* | Immutable data with query/export only | query, export | audit-log-query |

\#\#\# Standard CRUD Template

\`\`\`\`markdown  
\# {{Entity}} CRUD Tool

\<\!-- ANNOTATION: Title uses the entity name (singular, PascalCase for display)  
     followed by "CRUD Tool". The file name uses kebab-case: {{entity}}-crud.tool.md \--\>

\#\# Metadata

\<\!-- ANNOTATION: The metadata block is the "business card" for this tool.  
     Agents read this first to decide if this is the right tool to load. \--\>

\- \*\*Description\*\*: {{One to two sentences. What this tool does, what entity it manages, what lifecycle it covers. Be specific enough that an agent can decide whether to load this file.}}  
\- \*\*Version\*\*: {{semver, e.g., 1.0.0}}  
\- \*\*Category\*\*: db  
\- \*\*Dependencies\*\*: {{Comma-separated list of other tools this tool interacts with. Format: \`db/other-entity-crud\`, \`automation/engine-name\`, \`audit-logger\`. Include all tools that actions reference in their Process steps.}}  
\- \*\*Triggers\*\*: {{Comma-separated list of events this tool emits AFTER its actions complete. Format: \`entity.event\_type\`. These are consumed by cascade rules, automation engines, and downstream workflows. Example: \`contact.created\`, \`contact.updated\`, \`segment.refresh\`, \`audit.log.write\`}}  
\- \*\*Capabilities\*\*: {{Comma-separated verbs. Example: CRUD, full-text search, bulk operations, merge/dedup, tag management}}

\---

\#\# Schema

\<\!-- ANNOTATION: The schema section is the MOST IMPORTANT section for DB tools.  
     Agents use this to:  
     1\. Write correct INSERT/UPDATE SQL statements  
     2\. Generate TypeScript type definitions  
     3\. Build form validation schemas (zod)  
     4\. Write correct SELECT projections  
     Without the schema, agents guess at column names and types. \--\>

\<\!-- ANNOTATION: If the entity has multiple related tables (e.g., donations \+  
     donation\_receipts \+ payment\_methods), include ALL tables here. Each gets  
     its own sub-heading and column table. \--\>

\#\#\# {{table\_name}}

| Column | Type | Nullable | Default | Description |  
|--------|------|----------|---------|-------------|  
| \`id\` | \`uuid\` | NO | \`gen\_random\_uuid()\` | Primary key |  
| \`organization\_id\` | \`uuid\` | NO | — | FK to organizations (tenant isolation) |  
| \`{{field\_name}}\` | \`{{type}}\` | {{YES/NO}} | {{default or —}} | {{What this field stores, constraints, format notes}} |  
| \`{{fk\_field}}\_id\` | \`uuid\` | {{YES/NO}} | — | FK to {{related\_table}} |  
| \`status\` | \`text\` | NO | \`'{{default}}'\` | {{Allowed values: value1, value2, value3}} |  
| \`tags\` | \`text\[\]\` | NO | \`'{}'\` | Array of tag strings |  
| \`metadata\` | \`jsonb\` | YES | \`'{}'\` | Arbitrary key-value metadata |  
| \`created\_at\` | \`timestamptz\` | NO | \`now()\` | Record creation timestamp |  
| \`updated\_at\` | \`timestamptz\` | NO | \`now()\` | Last update timestamp |

\<\!-- ANNOTATION: Include indexes and RLS policy below the column table.  
     These are critical for agents writing queries that perform well  
     and respect tenant isolation. \--\>

\*\*Indexes\*\*: \`idx\_{{table}}\_org\_id\`, \`idx\_{{table}}\_status\`, \`idx\_{{table}}\_{{high\_cardinality\_field}}\`  
\*\*RLS\*\*: Enabled. Policy: \`organization\_id \= ANY(get\_user\_org\_ids())\`

\<\!-- ANNOTATION: If the entity has related child tables, include them here  
     with their own column tables. \--\>

\#\#\# {{child\_table\_name}} (optional)

| Column | Type | Nullable | Default | Description |  
|--------|------|----------|---------|-------------|  
| \`id\` | \`uuid\` | NO | \`gen\_random\_uuid()\` | Primary key |  
| \`{{parent}}\_id\` | \`uuid\` | NO | — | FK to {{parent\_table}} |  
| \`{{fields...}}\` | ... | ... | ... | ... |  
| \`created\_at\` | \`timestamptz\` | NO | \`now()\` | Record creation timestamp |

\---

\#\# Core Actions

\<\!-- ANNOTATION: Core Actions is where the real specification lives.  
     Every action follows the 4-aspect table format: Input, Process, Output, Errors.  
     The standard CRUD entity has 5 base actions \+ 0-4 specialized actions.

     NAMING CONVENTION:  
     \- Standard CRUD: create\_{{entity}}, get\_{{entity}}, list\_{{entities}}, update\_{{entity}}, delete\_{{entity}}  
     \- Specialized: {{verb}}\_{{entity}} (search\_contacts, merge\_contacts, generate\_receipt)  
     \- Domain-specific: {{domain\_verb}} (record\_donation, close\_won, update\_stage)

     An agent reading these actions gets:  
     \- Input: exactly what parameters to accept (required flags, types, constraints)  
     \- Process: the exact algorithm (numbered steps, in order, including cascades)  
     \- Output: the exact return shape (field names, types)  
     \- Errors: every possible error code with description (for error handling)  
\--\>

\#\#\# create\_{{entity}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | \`organization\_id\` (required), \`{{required\_field}}\` (required), \`{{optional\_field}}\` (optional), ... {{List every parameter the action accepts. Mark required vs optional. Include type hints where type is non-obvious (e.g., "E.164 format" for phone, "ISO 4217" for currency).}} |  
| \*\*Process\*\* | 1\. Validate required fields. {{Be specific: "Validate email uniqueness within org" not just "Validate".}} 2\. Normalize input. {{E.g., "Normalize phone to E.164 format".}} 3\. INSERT record with defaults. 4\. If {{condition}}, emit \`{{trigger}}\`. {{List every conditional trigger.}} 5\. Write audit log entry. {{Almost every action writes audit.}} |  
| \*\*Output\*\*  | Complete {{entity}} object with generated \`id\`, \`created\_at\`, \`updated\_at\`. |  
| \*\*Errors\*\*  | \`MISSING\_REQUIRED\` — {{field}} is blank or null. \`DUPLICATE\_{{FIELD}}\` — uniqueness constraint violated. \`INVALID\_{{FIELD}}\` — format/value unrecognized. \`{{FK}}\_NOT\_FOUND\` — foreign key reference does not exist. \`ORG\_NOT\_FOUND\` — invalid organization\_id. |

\#\#\# get\_{{entity}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | \`id\` (required), \`organization\_id\` (required), \`include\[\]\` (optional) — eager-load related entities: \`{{relation1}}\`, \`{{relation2}}\`. |  
| \*\*Process\*\* | 1\. SELECT record by id scoped to organization. 2\. Eager-load requested includes. 3\. Return composite object or null. |  
| \*\*Output\*\*  | {{Entity}} object with requested nested relations, or null if not found. |  
| \*\*Errors\*\*  | \`NOT\_FOUND\` — record does not exist or not in org. \`FORBIDDEN\` — caller lacks read permission. |

\#\#\# list\_{{entities}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | \`organization\_id\` (required), \`page\` (default 1), \`per\_page\` (default 25, max 100), \`sort\_by\` (default \`created\_at\`), \`sort\_dir\` (default \`desc\`), \`filter\` object: \`{{filterable\_field}}\`, \`{{date\_range}}\`, \`{{status}}\`, \`tags\[\]\`. |  
| \*\*Process\*\* | 1\. Apply organization scope. 2\. Apply filters conjunctively. 3\. Apply sort. 4\. Paginate with offset or cursor. 5\. Return results with pagination metadata. |  
| \*\*Output\*\*  | \`{ data: {{Entity}}\[\], total: number, page: number, per\_page: number, has\_more: boolean }\` |  
| \*\*Errors\*\*  | \`INVALID\_FILTER\` — unrecognized filter key. \`PAGINATION\_LIMIT\` — per\_page exceeds max. |

\#\#\# update\_{{entity}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | \`id\` (required), \`organization\_id\` (required), partial {{entity}} fields to update. |  
| \*\*Process\*\* | 1\. Fetch existing record (fail if not found). 2\. Validate changed fields. {{Specify field-level validations.}} 3\. Apply partial update, set \`updated\_at \= now()\`. 4\. If {{condition}}, emit \`{{trigger}}\`. 5\. Write audit log with diff. |  
| \*\*Output\*\*  | Updated {{entity}} object. |  
| \*\*Errors\*\*  | \`NOT\_FOUND\`. \`DUPLICATE\_{{FIELD}}\`. \`IMMUTABLE\_FIELD\` — attempted to change \`id\` or \`organization\_id\`. \`INVALID\_TRANSITION\` — status change not allowed. \`STALE\_UPDATE\` — optimistic lock conflict. |

\#\#\# delete\_{{entity}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | \`id\` (required), \`organization\_id\` (required), \`hard\_delete\` (boolean, default false). |  
| \*\*Process\*\* | 1\. Verify record exists. 2\. Check for blocking references (active child records). 3\. Soft-delete by default (set \`status \= 'archived'\` or \`deleted\_at \= now()\`). 4\. Hard delete removes record and cascades if explicitly requested. 5\. Write audit log. |  
| \*\*Output\*\*  | \`{ deleted: true, mode: 'soft' | 'hard' }\` |  
| \*\*Errors\*\*  | \`NOT\_FOUND\`. \`HAS\_DEPENDENTS\` — record has active child records that must be handled first. \`FORBIDDEN\` — hard delete requires elevated permission. |

\#\#\# {{specialized\_action}} (0-4 per entity)

\<\!-- ANNOTATION: Specialized actions are domain-specific operations that go  
     beyond standard CRUD. Examples from production:  
     \- search\_contacts: Full-text search with relevance scoring  
     \- merge\_contacts: Deduplicate two records into one  
     \- generate\_receipt: Create a donation receipt PDF  
     \- create\_recurring: Set up a recurring donation schedule  
     \- close\_won / close\_lost: Terminal deal stage transitions  
     \- update\_stage: Pipeline stage progression with validation  
     \- add\_activity: Log an interaction on a deal

     Include 0-4 specialized actions per tool. Only add actions that represent  
     operations distinct from standard CRUD (not just an update with specific fields). \--\>

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{Specialized parameters for this action}} |  
| \*\*Process\*\* | {{Domain-specific algorithm}} |  
| \*\*Output\*\*  | {{Action-specific return shape}} |  
| \*\*Errors\*\*  | {{Action-specific error codes}} |

\---

\#\# Integration Guidelines

\<\!-- ANNOTATION: 3-7 bullet points covering:  
     1\. Multi-tenancy: how org scoping is enforced  
     2\. Concurrency: optimistic locking, transaction boundaries  
     3\. Performance: batch sizes, indexing expectations  
     4\. Downstream effects: what happens after CRUD (cascade triggers, etc.)  
     5\. Data format notes: currency storage, phone formats, JSONB schemas  
     Write these as instructions an agent should follow when USING this tool. \--\>

\- All operations require \`organization\_id\` scoping to enforce multi-tenancy.  
\- {{Concurrency pattern: e.g., "Use optimistic locking via \`updated\_at\` comparison on updates."}}  
\- {{Batch guidance: e.g., "Bulk imports should use create in batches of 100 with transaction wrapping."}}  
\- {{Downstream effect: e.g., "Consumers should subscribe to \`segment.refresh\` events to keep dynamic segments current."}}  
\- {{Data format: e.g., "All monetary amounts are stored as DECIMAL(12,2) in the organization's base currency."}}

\---

\#\# Edge Cases

\<\!-- ANNOTATION: 3-7 specific scenarios with explicit handling instructions.  
     These prevent agents from making incorrect assumptions. Each edge case is:  
     \- \*\*Bold scenario description\*\*: Handling instruction in plain text.  
     Focus on scenarios that are LIKELY to occur and where the "obvious" handling  
     would be WRONG. \--\>

\- \*\*{{Scenario 1}}\*\*: {{How to handle it. Be specific about the correct behavior.}}  
\- \*\*{{Scenario 2}}\*\*: {{How to handle it.}}  
\- \*\*{{Scenario 3}}\*\*: {{How to handle it.}}

\---

\#\# Implications

\<\!-- ANNOTATION: 3-7 downstream effects that happen as a CONSEQUENCE of using this tool.  
     These are side effects the agent should be AWARE of but does not need to implement  
     (they're handled by triggers, cascade rules, or other systems).  
     Format: \*\*Bold category\*\*: Description of what happens and why it matters.

     Common implications:  
     \- Audit Trail: what gets logged  
     \- Cascade Effects: what downstream workflows fire  
     \- Analytics: what aggregates are updated  
     \- Compliance: regulatory requirements this tool satisfies  
     \- Performance: indexing, caching, or query considerations \--\>

\- \*\*Audit Trail\*\*: Every {{action}} writes to \`audit\_log\` with actor, action, entity, diff, and timestamp.  
\- \*\*{{Cascade Name}}\*\*: {{What downstream effect fires and why.}}  
\- \*\*{{Compliance/Regulatory}}\*\*: {{What legal/regulatory requirement this satisfies.}}  
\- \*\*{{Performance Note}}\*\*: {{Query patterns, indexing, or caching considerations.}}  
\`\`\`\`

\#\#\# Read-Only Query Tool Variant

For immutable data sources (audit logs, analytics tables, event streams):

\`\`\`\`markdown  
\# {{Entity}} Query Tool

\#\# Metadata  
\- \*\*Description\*\*: {{Emphasize: "Read-only query interface for..." and "No create, update, or delete operations are exposed."}}  
\- \*\*Version\*\*: 1.0.0  
\- \*\*Category\*\*: db  
\- \*\*Dependencies\*\*: None (read-only consumer)  
\- \*\*Triggers\*\*: None (this tool does not emit triggers; it only reads)  
\- \*\*Capabilities\*\*: Filtered queries, date range search, {{entity}}-specific filters, export

\---

\#\# Schema

\#\#\# {{table\_name}} (READ-ONLY)

\<\!-- ANNOTATION: Mark the table as READ-ONLY in the heading.  
     Note any immutability constraints (no updated\_at column,  
     no UPDATE/DELETE permissions). \--\>

| Column | Type | Nullable | Default | Description |  
|--------|------|----------|---------|-------------|  
| ... | ... | ... | ... | ... |

\*\*NOTE\*\*: This table has no \`updated\_at\` column. Entries are immutable after creation.

\---

\#\# Core Actions

\<\!-- ANNOTATION: Read-only tools have 2-3 actions: query, export, and  
     optionally a specialized filtered view. NO create/update/delete. \--\>

\#\#\# query\_{{entities}}  
| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | \`organization\_id\` (required), \`date\_from\`, \`date\_to\`, {{entity-specific filters}}, \`page\`, \`per\_page\`. |  
| \*\*Process\*\* | 1\. Apply organization scope. 2\. Apply filters. 3\. Order by \`created\_at DESC\`. 4\. Paginate. |  
| \*\*Output\*\*  | \`{ data: {{Entity}}\[\], total, page, per\_page, has\_more }\` |  
| \*\*Errors\*\*  | \`INVALID\_DATE\_RANGE\`. \`PAGINATION\_LIMIT\`. \`FORBIDDEN\`. |

\#\#\# export\_{{entities}}  
| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | \`organization\_id\` (required), \`date\_from\` (required), \`date\_to\` (required), {{filters}}, \`format\` (csv/json). |  
| \*\*Process\*\* | 1\. Validate date range. 2\. Apply filters. 3\. Stream to file. 4\. Return download URL. |  
| \*\*Output\*\*  | \`{ download\_url, record\_count, format, expires\_at }\` |  
| \*\*Errors\*\*  | \`DATE\_RANGE\_REQUIRED\`. \`RANGE\_TOO\_LARGE\`. \`EXPORT\_TOO\_LARGE\`. \`FORBIDDEN\`. |  
\`\`\`\`

\---

\#\# 6\. API Tool Template (Full Annotated)

API tools specify edge functions, serverless functions, or API endpoints.

\#\#\# Three API Tool Archetypes

| Archetype | Description | Typical Actions | Example |  
|-----------|-------------|----------------|---------|  
| \*\*AI Agent Endpoint\*\* | Complex NL processing with multi-stage pipeline | 1 primary action with 5-stage pipeline | grace-chat, noa-analyze, raven-research |  
| \*\*Service Endpoint\*\* | Standard request-response with business logic | 1-3 actions with processing pipeline | send-email, webhook-receiver |  
| \*\*Auth/Integration Endpoint\*\* | OAuth flows, webhook verification | 2-3 actions across an async flow | oauth-handlers |

\#\#\# Full API Tool Template

\`\`\`\`markdown  
\# {{Function Name}} API Tool

\<\!-- ANNOTATION: Title uses the display name followed by "API Tool".  
     File name matches the edge function: {{function-name}}.tool.md \--\>

\#\# Metadata

\<\!-- ANNOTATION: API tool metadata adds Edge Function, Auth, and rate limiting  
     details that DB tools don't need. \--\>

\- \*\*Description\*\*: {{What this endpoint does. Be specific about the processing it performs. For AI endpoints, mention NL processing, context assembly, classification. For service endpoints, mention the business logic. For auth endpoints, mention the OAuth flow.}}  
\- \*\*Version\*\*: {{semver}}  
\- \*\*Category\*\*: api  
\- \*\*Edge Function\*\*: \`{{function-name}}\`

\<\!-- ANNOTATION: Auth is critical for API tools. Specify:  
     \- User session (JWT): standard authenticated user  
     \- System-level / service-role: internal system calls  
     \- API key / signature: external integrations  
     \- OAuth flow: complex multi-step auth  
     \- Privileged: requires elevated permissions beyond standard auth \--\>

\- \*\*Auth\*\*: {{Auth type and scope. E.g., "User session (JWT). Actions scoped to the authenticated user's role and permissions." or "Signature-verified per provider (HMAC-SHA256)."}}  
\- \*\*Dependencies\*\*: {{Other tools invoked during processing}}  
\- \*\*Triggers\*\*: {{Events emitted after processing}}

\---

\#\# Endpoint

\<\!-- ANNOTATION: The Endpoint table replaces the Schema section from DB tools.  
     It defines the HTTP contract. Agents use this to set up route handlers,  
     configure CORS, and implement rate limiting. \--\>

| Field        | Value                                      |  
|--------------|--------------------------------------------|  
| Method       | {{POST / GET / POST+GET}}                  |  
| Path         | \`/functions/v1/{{function-name}}\`          |  
| Content-Type | application/json                           |  
| Rate Limit   | {{N}} requests/{{period}} per {{scope: user/org/IP}} |

\---

\#\# Core Actions

\<\!-- ANNOTATION: API tools typically have 1-3 actions.  
     AI agent endpoints usually have 1 primary action with complex input.  
     Service endpoints may have 2-3 related actions.  
     Auth endpoints have distinct initiate/callback actions.

     The Input for API actions is the request body.  
     The Output is the response body.  
     The Process describes the server-side algorithm. \--\>

\#\#\# {{primary\_action}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{Request body fields with types, required flags, nested objects. For AI endpoints, include context objects like user\_context, entity\_references, conversation\_id.}} |  
| \*\*Process\*\* | 1\. {{First processing step — usually auth validation or context loading.}} 2\. {{Core processing — classification, business logic, data transformation.}} 3\. {{Side effects — creating records, sending notifications, emitting events.}} 4\. Write audit log. |  
| \*\*Output\*\*  | \`{ {{response fields with types}} }\` |  
| \*\*Errors\*\*  | \`AUTH\_REQUIRED\` — no valid session. \`RATE\_LIMITED\` — exceeded rate limit. \`INVALID\_INPUT\` — malformed payload. {{Domain-specific errors.}} |

\#\#\# {{secondary\_action}} (optional)

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{...}} |  
| \*\*Process\*\* | {{...}} |  
| \*\*Output\*\*  | {{...}} |  
| \*\*Errors\*\*  | {{...}} |

\---

\#\# Processing Pipeline

\<\!-- ANNOTATION: This section is UNIQUE to API tools (and sometimes automation tools).  
     It visualizes the multi-stage processing as an ASCII flowchart.  
     The pipeline shows the data transformation from input to output.

     This section is CRITICAL for AI agent endpoints where the processing  
     involves 4-6 distinct stages (context assembly, intent classification,  
     entity extraction, risk scoring, plan generation).

     For simple CRUD-wrapper APIs, this section can be omitted.

     FORMAT: Use a vertical ASCII flow with stage headers in brackets.  
     Each stage lists 3-5 bullet points describing what happens.  
     Connect stages with pipe characters (|) and arrows (v). \--\>

\`\`\`  
{{Input Description}}  
  |  
  v  
\[Stage 1: {{Name}}\]  
  \- {{What happens in this stage}}  
  \- {{Key decisions or branches}}  
  \- {{Data transformation}}  
  |  
  v  
\[Stage 2: {{Name}}\]  
  \- {{Processing steps}}  
  \- {{External calls if any}}  
  |  
  v  
\[Stage 3: {{Name}}\]  
  \- {{Final processing}}  
  \- {{Side effect generation}}  
  |  
  v  
\[Stage 4: {{Name}}\] (optional)  
  \- {{Audit, notification, etc.}}  
\`\`\`

\---

\#\# Integration Guidelines

\<\!-- ANNOTATION: For API tools, integration guidelines cover:  
     1\. How to call this endpoint from frontend/backend  
     2\. Auth setup requirements (token passing, header format)  
     3\. Rate limiting strategy (client-side throttling)  
     4\. Conversation/session continuity (for AI endpoints)  
     5\. Error handling patterns (retry strategy)  
     6\. Latency targets (response time expectations)  
     7\. Relationship to other endpoints (delegation, chaining) \--\>

\- {{How to call: e.g., "This function is the primary entry point for all user-initiated AI interactions."}}  
\- {{Continuity: e.g., "Conversation continuity is maintained via \`conversation\_id\`."}}  
\- {{Safety: e.g., "The function does NOT execute mutations directly. All mutations are wrapped in a proposed workflow."}}  
\- {{Delegation: e.g., "Delegation to Noa (analytics) and Ark (recommendations) is transparent to the user."}}  
\- {{Latency: e.g., "Response latency target: under 2 seconds for QUERY, under 5 seconds for COMMAND."}}

\---

\#\# Edge Cases

\- \*\*{{Scenario 1}}\*\*: {{Handling instruction.}}  
\- \*\*{{Scenario 2}}\*\*: {{Handling instruction.}}  
\- \*\*{{Scenario 3}}\*\*: {{Handling instruction.}}

\---

\#\# Implications

\- \*\*Audit Trail\*\*: {{What gets logged — inputs, outputs, actor, timing.}}  
\- \*\*{{Side Effect 1}}\*\*: {{Downstream effect with explanation.}}  
\- \*\*{{Safety/Compliance}}\*\*: {{Regulatory or safety consideration.}}  
\- \*\*Rate Limiting\*\*: {{How rate limits protect the system and users.}}  
\`\`\`\`

\#\#\# Auth/Integration Endpoint Variant

For OAuth flows, webhook receivers, and multi-step auth:

\`\`\`  
Additional sections for auth endpoints:

\#\# Processing Pipeline  
  \- Must show the FULL flow including user redirects and callbacks  
  \- Include timing (TTLs, expiry windows)  
  \- Show security measures (state parameter, CSRF, signature verification)

\#\# Endpoint  
  \- May have multiple methods (GET for callback, POST for initiate)  
  \- May have URL parameters (\`:provider\`, \`:action\`)

\#\# Core Actions  
  \- Typically: initiate\_{{flow}} \+ handle\_callback  
  \- Or: receive\_{{event}} for webhook receivers  
  \- Auth actions often have side effects beyond the response  
    (token storage, webhook registration, initial data sync)  
\`\`\`

\---

\#\# 7\. UI Tool Template (Full Annotated)

UI tools specify interactive component behavior. They don't have Schema or Endpoint sections — instead, they have more actions covering user interactions.

\#\#\# Two UI Tool Archetypes

| Archetype | Description | Typical Actions | Example |  
|-----------|-------------|----------------|---------|  
| \*\*Workflow/Orchestration UI\*\* | Interactive approval, editing, and review components | 3-5 actions covering render \+ user decisions | workflow-proposal, step-approval, audit-trail-view |  
| \*\*Data Interaction UI\*\* | Reusable data display and manipulation components | 4-7 actions covering render \+ sort \+ filter \+ select \+ bulk | data-table, module-navigation |

\#\#\# Full UI Tool Template

\`\`\`\`markdown  
\# {{Component Name}} UI Tool

\<\!-- ANNOTATION: Title uses the component display name followed by "UI Tool".  
     File name uses kebab-case: {{component-name}}.tool.md \--\>

\#\# Metadata

\<\!-- ANNOTATION: UI tool metadata focuses on user-facing capabilities.  
     The "Triggers" field lists user-interaction events the component emits  
     (not database triggers). These are consumed by other UI components  
     or by workflow engines watching for user decisions. \--\>

\- \*\*Description\*\*: {{What this component does, where it's used, and what user interactions it supports. Be specific about the UX pattern (modal overlay, inline panel, full-page, sidebar section).}}  
\- \*\*Version\*\*: {{semver}}  
\- \*\*Category\*\*: ui  
\- \*\*Dependencies\*\*: {{Other tools/components this UI depends on. Include db tools for data fetching, other ui tools for composition, automation tools for event handling.}}  
\- \*\*Triggers\*\*: {{User-interaction events this component emits. Format: \`component.event\`. E.g., \`workflow.proposed\`, \`workflow.approved\`, \`table.selection.changed\`, \`table.bulk\_action.completed\`.}}  
\- \*\*Capabilities\*\*: {{Comma-separated interaction capabilities. E.g., "Proposal rendering, step editing, step reordering, interactive approval, risk visualization".}}

\---

\#\# Core Actions

\<\!-- ANNOTATION: UI tool actions describe COMPONENT BEHAVIORS, not database operations.  
     Each action represents a user interaction or component state change.

     NAMING CONVENTION:  
     \- Render actions: render\_{{view}} (render\_proposal, render\_table, render\_audit)  
     \- Interaction actions: {{verb}}\_{{target}} (edit\_step, sort\_column, select\_rows)  
     \- Decision actions: approve\_{{entity}}, reject\_{{entity}}, skip\_{{entity}}  
     \- Output actions: export\_{{format}} (export\_selection, export\_audit)

     The Input for UI actions is component props and user interaction data.  
     The Process describes the rendering/interaction algorithm.  
     The Output describes what the component produces (rendered UI, emitted events, state changes).  
     The Errors describe validation or state errors the component can surface.

     UI tools typically have MORE actions than other categories (4-7)  
     because they cover the full range of user interactions. \--\>

\#\#\# render\_{{view}}

\<\!-- ANNOTATION: The primary render action. This is the component's initial display.  
     Input \= props/data the component receives.  
     Process \= how the component transforms data into visual output.  
     Output \= what the user sees and can interact with. \--\>

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{Component props: data objects, config objects, state flags. Mark required vs optional. Describe nested object shapes where non-obvious.}} |  
| \*\*Process\*\* | 1\. {{Parse/validate input data.}} 2\. {{Transform data for display (grouping, sorting, formatting).}} 3\. {{Render visual elements (cards, tables, indicators, controls).}} 4\. {{Set up interaction handlers (click, drag, keyboard).}} |  
| \*\*Output\*\*  | {{What the rendered component looks like and what interaction affordances it provides.}} |  
| \*\*Errors\*\*  | \`INVALID\_{{DATA}}\` — input data is malformed. \`{{ENTITY}}\_NOT\_FOUND\` — referenced entity doesn't exist. \`WRONG\_STATUS\` — component cannot render in current state. |

\#\#\# {{interaction\_action\_1}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{User interaction data: clicked item ID, new values, selection set.}} |  
| \*\*Process\*\* | {{How the component responds to the interaction: state update, re-render, event emission, API call.}} |  
| \*\*Output\*\*  | {{Updated component state and/or emitted events.}} |  
| \*\*Errors\*\*  | {{Interaction-specific errors: permission denied, invalid state, locked, etc.}} |

\#\#\# {{interaction\_action\_2}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{...}} |  
| \*\*Process\*\* | {{...}} |  
| \*\*Output\*\*  | {{...}} |  
| \*\*Errors\*\*  | {{...}} |

\#\#\# {{decision\_action}} (for workflow/approval UIs)

\<\!-- ANNOTATION: Decision actions are unique to workflow UI tools.  
     They represent the user's approval, rejection, or modification  
     of a proposed action. The output of a decision action typically  
     triggers workflow execution or cancellation. \--\>

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{Decision data: entity IDs, confirmation token, reason text.}} |  
| \*\*Process\*\* | 1\. {{Verify entity is in correct state for this decision.}} 2\. {{For high-risk decisions, require typed confirmation.}} 3\. {{Update entity status based on decision.}} 4\. {{Emit trigger event.}} 5\. {{Write audit log.}} |  
| \*\*Output\*\*  | {{Updated entity status and downstream effects (execution starts, workflow cancels, etc.).}} |  
| \*\*Errors\*\*  | \`WRONG\_STATUS\` — entity not in a state that accepts this decision. \`CONFIRMATION\_REQUIRED\` — high-risk action missing confirmation. \`FORBIDDEN\` — caller lacks permission. |

\#\#\# {{export\_action}} (optional)

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | \`format\` (csv/json/pdf), \`selection\` or \`scope\`. |  
| \*\*Process\*\* | 1\. Resolve target data. 2\. Format. 3\. Trigger download. |  
| \*\*Output\*\*  | Downloaded file. |  
| \*\*Errors\*\*  | \`EXPORT\_TOO\_LARGE\`. \`FORBIDDEN\`. \`UNSUPPORTED\_FORMAT\`. |

\---

\#\# Integration Guidelines

\<\!-- ANNOTATION: For UI tools, integration guidelines cover:  
     1\. Where/how the component is rendered (modal, inline, page, overlay)  
     2\. State persistence (URL params, local storage, database)  
     3\. Real-time updates (subscriptions, polling)  
     4\. Permission gating (which interactions require which permissions)  
     5\. Accessibility (keyboard navigation, screen readers)  
     6\. Composition (how this UI works with other UI tools) \--\>

\- {{Rendering context: e.g., "Rendered as a modal overlay on top of the current module view."}}  
\- {{State persistence: e.g., "All edits are auto-saved to JSONB in real time so browser refresh preserves state."}}  
\- {{Permission gating: e.g., "Only users with \`workflow.approve\` permission can approve. Users with \`workflow.edit\` can modify but not approve."}}  
\- {{Keyboard navigation: e.g., "Supports keyboard navigation: Escape to close, arrow keys to navigate, Enter to select."}}  
\- {{Composition: e.g., "The proposal UI hands off approved workflows to the orchestration engine for execution."}}

\---

\#\# Edge Cases

\<\!-- ANNOTATION: UI edge cases focus on:  
     \- Empty/zero states (no data, single item, very large datasets)  
     \- Concurrent users (two people viewing/editing the same thing)  
     \- State transitions (entity changes status while user is viewing)  
     \- Browser behavior (refresh, back/forward, tab switch)  
     \- Responsiveness (very wide/narrow content, mobile screens) \--\>

\- \*\*{{Empty state}}\*\*: {{What to render when there's no data.}}  
\- \*\*{{Concurrent editing}}\*\*: {{How to handle two users modifying the same entity.}}  
\- \*\*{{State change during view}}\*\*: {{What happens when the entity changes while the user is looking at it.}}  
\- \*\*{{Browser refresh}}\*\*: {{How to preserve/restore state after refresh.}}  
\- \*\*{{Extreme data}}\*\*: {{How to handle very large datasets or very wide tables.}}

\---

\#\# Implications

\<\!-- ANNOTATION: UI tool implications focus on:  
     \- Status transitions triggered by user decisions  
     \- Audit entries created by user interactions  
     \- Permission enforcement at the UI layer vs API layer  
     \- Performance (caching, virtual scrolling, lazy loading)  
     \- Downstream effects of user actions (workflow execution, notifications) \--\>

\- \*\*{{Status Transitions}}\*\*: {{How user decisions in this UI change entity states.}}  
\- \*\*Audit Trail\*\*: {{What user interactions are logged.}}  
\- \*\*Permission Enforcement\*\*: {{How the UI enforces access control.}}  
\- \*\*{{Downstream Effects}}\*\*: {{What fires after the user makes a decision.}}  
\- \*\*{{Performance}}\*\*: {{Caching, rendering optimizations, lazy loading strategies.}}  
\`\`\`\`

\---

\#\# 8\. Automation Tool Template (Full Annotated)

Automation tools specify background processing engines. They have a unique \*\*Rules\*\* section defining hard constraints.

\#\#\# Two Automation Tool Archetypes

| Archetype | Description | Typical Actions | Example |  
|-----------|-------------|----------------|---------|  
| \*\*Rule Engine\*\* | Evaluates rules and dispatches actions | evaluate \+ 2-4 dispatch variants | cascade-executor |  
| \*\*Queue Processor\*\* | Processes queued jobs with retry/backoff | process\_batch \+ retry \+ cancel \+ event recording | scheduled-messages, journey-execution |

\#\#\# Full Automation Tool Template

\`\`\`\`markdown  
\# {{Engine Name}} Automation Tool

\<\!-- ANNOTATION: Title uses the engine display name followed by "Automation Tool".  
     File name uses kebab-case: {{engine-name}}.tool.md \--\>

\#\# Metadata

\<\!-- ANNOTATION: Automation tool metadata is the richest. It includes Edge Function  
     (if the engine runs as a serverless function on a schedule), plus comprehensive  
     trigger lists since automations typically emit many different events. \--\>

\- \*\*Description\*\*: {{What this engine automates. Mention: processing pattern (rule-based, queue-based, schedule-based), what it evaluates/processes, and key safety mechanisms.}}  
\- \*\*Version\*\*: {{semver}}  
\- \*\*Category\*\*: automation  
\- \*\*Edge Function\*\*: \`{{function-name}}\` {{Include if the engine runs as an edge function. Omit if it's purely internal.}}  
\- \*\*Dependencies\*\*: {{Other tools and services this engine invokes. Automation tools typically depend on MANY other tools because they orchestrate actions.}}  
\- \*\*Triggers\*\*: {{Events emitted during processing. Automation tools emit the MOST triggers of any category because they orchestrate multi-step processes.}}  
\- \*\*Capabilities\*\*: {{Core capabilities. E.g., "Rule matching, risk classification, sync execution, deferred queuing, depth limiting, cycle detection".}}

\---

\#\# Core Actions

\<\!-- ANNOTATION: Automation tool actions follow two patterns:

     RULE ENGINE PATTERN:  
     1\. evaluate — Match input against rules, classify output  
     2\. execute\_{{type\_1}} — Execute one dispatch variant  
     3\. execute\_{{type\_2}} — Execute another dispatch variant  
     4\. execute\_{{type\_3}} — Execute another dispatch variant  
     5\. execute\_{{type\_4}} — Execute another dispatch variant

     QUEUE PROCESSOR PATTERN:  
     1\. process\_batch — Dequeue and process a batch of jobs  
     2\. retry\_failed — Re-queue failed jobs  
     3\. cancel\_scheduled — Cancel pending jobs  
     4\. record\_{{event}} — Log external events back to jobs

     Both patterns share the 4-aspect table format. \--\>

\#\#\# {{evaluate\_or\_process\_action}}

\<\!-- ANNOTATION: The primary action — either evaluating rules or processing a batch.  
     This is the entry point that runs on each scheduled cycle or trigger event. \--\>

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{For rule engines: the triggering event/entity. For queue processors: batch configuration (size, filters, priority).}} |  
| \*\*Process\*\* | 1\. {{Load rules/queue jobs.}} 2\. {{Match/filter.}} 3\. {{Classify/dispatch.}} 4\. {{Handle each result.}} 5\. {{Record outcomes.}} |  
| \*\*Output\*\*  | \`{ {{summary counts: matched, executed, queued, skipped, failed}} }\` |  
| \*\*Errors\*\*  | \`{{NO\_INPUT}}\` — missing required event data. \`{{LOAD\_FAILED}}\` — rules/queue could not be loaded. \`{{CONDITION\_ERROR}}\` — rule/condition evaluation error. |

\#\#\# {{dispatch\_action\_1}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{Action to dispatch/execute, parent context.}} |  
| \*\*Process\*\* | {{Execution logic with safety checks (depth, risk, permissions).}} |  
| \*\*Output\*\*  | \`{ status: 'completed' | 'failed' | 'queued', {{details}} }\` |  
| \*\*Errors\*\*  | \`{{RISK\_TOO\_HIGH}}\`. \`{{DEPTH\_EXCEEDED}}\`. \`{{EXECUTION\_FAILED}}\`. |

\#\#\# {{dispatch\_action\_2}}

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{...}} |  
| \*\*Process\*\* | {{...}} |  
| \*\*Output\*\*  | {{...}} |  
| \*\*Errors\*\*  | {{...}} |

\#\#\# {{retry\_or\_cancel\_action}} (for queue processors)

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{Job IDs or selection criteria, reason.}} |  
| \*\*Process\*\* | {{Reset/cancel logic with validation.}} |  
| \*\*Output\*\*  | \`{ affected\_count, {{details}} }\` |  
| \*\*Errors\*\*  | \`{{NOT\_FOUND}}\`. \`{{WRONG\_STATUS}}\`. \`{{TOO\_OLD}}\`. |

\#\#\# {{event\_recording\_action}} (for queue processors)

\<\!-- ANNOTATION: Queue processors that dispatch to external providers  
     (email, SMS, payment) need an action to record delivery events  
     coming back via webhooks. This closes the feedback loop. \--\>

| Aspect      | Details |  
|-------------|---------|  
| \*\*Input\*\*   | {{External event identifier, event type, metadata.}} |  
| \*\*Process\*\* | {{Look up job/record, update status, update analytics, handle special events (bounces, unsubscribes).}} |  
| \*\*Output\*\*  | \`{ {{updated entity}}, event\_type, actions\_taken\[\] }\` |  
| \*\*Errors\*\*  | \`{{NOT\_FOUND}}\`. \`{{DUPLICATE\_EVENT}}\`. \`{{INVALID\_EVENT\_TYPE}}\`. |

\---

\#\# Rules

\<\!-- ANNOTATION: The Rules section is UNIQUE to automation tools.  
     It defines the HARD CONSTRAINTS the engine enforces — non-negotiable limits  
     that prevent runaway behavior. Every automation tool should have rules  
     covering safety, resource limits, and failure behavior.

     FORMAT: Each rule is a bold label followed by a description.  
     Include the specific limits (numbers, timeouts, max retries).

     Common rules:  
     \- Max depth / recursion limit  
     \- Cycle detection mechanism  
     \- Failure isolation (don't block parent)  
     \- Risk gating (risk level → dispatch type mapping)  
     \- Rate limiting (max actions per time period)  
     \- Timeout budgets (max execution time per action type)  
     \- Queue capacity limits \--\>

\- \*\*{{Rule 1: e.g., Max Depth}}\*\*: {{Specific limit and what happens when exceeded. E.g., "Cascades are limited to depth 3\. At depth 3, sync/deferred are downgraded to suggested."}}  
\- \*\*{{Rule 2: e.g., Cycle Detection}}\*\*: {{Detection mechanism and handling. E.g., "Each cascade carries the workflow\_run\_id ancestry chain. Cycles are skipped and logged."}}  
\- \*\*{{Rule 3: e.g., Failure Isolation}}\*\*: {{How failures are contained. E.g., "Failed automations generate alert tasks but never block the parent action."}}  
\- \*\*{{Rule 4: e.g., Risk Gating}}\*\*: {{Risk level to dispatch type mapping. E.g., "Only low risk can execute synchronously. Medium defaults to deferred. High defaults to suggested."}}  
\- \*\*{{Rule 5: e.g., Timeout Budget}}\*\*: {{Max execution time. E.g., "Sync: 5 seconds. Deferred: 30 seconds. Analytic: 30 seconds."}}

\---

\#\# Integration Guidelines

\<\!-- ANNOTATION: For automation tools, integration guidelines cover:  
     1\. How the engine is triggered (cron schedule, event, API call)  
     2\. How to register new rules/configure the engine  
     3\. How to invoke from workflows  
     4\. Priority ordering logic  
     5\. Monitoring and alerting  
     6\. Organization-level configuration (enable/disable, limits) \--\>

\- {{Triggering: e.g., "The engine runs on a cron schedule (every 2 minutes) and processes highest-priority jobs first."}}  
\- {{Configuration: e.g., "Rules are configured per organization in the \`{{config\_table}}\` table."}}  
\- {{Invocation: e.g., "The engine is invoked automatically by the orchestration engine after any primary action completes."}}  
\- {{Priority: e.g., "When multiple rules match, they are evaluated in priority order (lower number \= higher priority)."}}  
\- {{Org config: e.g., "Organizations can disable all automations via org\_settings for debugging."}}

\---

\#\# Edge Cases

\<\!-- ANNOTATION: Automation edge cases focus on:  
     \- No matching rules / empty queue  
     \- Concurrent processing (multiple instances)  
     \- External provider failures (retries, failover)  
     \- Configuration changes mid-execution  
     \- Resource exhaustion (queue full, rate limited)  
     \- Data integrity (deleted entities, expired tokens) \--\>

\- \*\*{{No matches}}\*\*: {{What happens when nothing matches. E.g., "Returns empty list. No error, no side effects."}}  
\- \*\*{{Concurrent processing}}\*\*: {{How to prevent double-processing. E.g., "Row-level locking via status='processing'."}}  
\- \*\*{{Provider failure}}\*\*: {{Retry strategy. E.g., "Retry with exponential backoff: 1s, 5s, 15s. Max 3 retries."}}  
\- \*\*{{Config change mid-execution}}\*\*: {{E.g., "Rule disabled between match and execution: cascade is skipped with a log entry."}}  
\- \*\*{{Resource exhaustion}}\*\*: {{E.g., "Queue at 80% capacity: warning notification. At 100%: new items downgraded to suggested."}}

\---

\#\# Implications

\<\!-- ANNOTATION: Automation implications focus on:  
     \- Records/entities created by the automation  
     \- Notification generation  
     \- Safety mechanisms and their downstream effects  
     \- Audit trail completeness  
     \- Performance budgets  
     \- Cost tracking (API calls, messages sent) \--\>

\- \*\*{{Entity Creation}}\*\*: {{What records the automation creates and where.}}  
\- \*\*{{Notification}}\*\*: {{What notifications fire and to whom.}}  
\- \*\*{{Safety Mechanism}}\*\*: {{How depth limits, risk gating, etc. protect the system.}}  
\- \*\*Audit Completeness\*\*: {{What gets logged — every evaluation, execution, skip, and failure.}}  
\- \*\*{{Performance Budget}}\*\*: {{Timeout limits per action type.}}  
\- \*\*{{Cost/Resource Tracking}}\*\*: {{How resource consumption is tracked against org limits.}}  
\`\`\`\`

\---

\#\# 9\. Specialized Variants

Beyond the four primary categories, tools may have specialized structures:

\#\#\# Multi-Table DB Tool

When an entity has 2-3 related tables (e.g., donations \+ receipts \+ payment methods):

\`\`\`  
\#\# Schema  
\#\#\# {{primary\_table}}  
| Column | Type | ... |

\#\#\# {{child\_table\_1}}  
| Column | Type | ... |

\#\#\# {{child\_table\_2}}  
| Column | Type | ... |  
\`\`\`

Actions may span multiple tables (e.g., \`generate\_receipt\` creates a row in the receipts child table).

\#\#\# Stateful Pipeline API Tool

For AI agent endpoints with complex multi-stage processing:

\`\`\`  
\#\# Processing Pipeline  
  \- 5-6 stages (Context → Classify → Extract → Score → Generate → Audit)  
  \- Stage descriptions include branching logic (QUERY → read path, COMMAND → write path)  
  \- Delegation points (when this agent hands off to another agent/service)  
\`\`\`

\#\#\# Composite UI Tool

For UI components that orchestrate multiple sub-components:

\`\`\`  
\#\# Core Actions  
  \- render\_{{parent\_view}} (primary render)  
  \- render\_{{detail\_view}} (drilldown into a single item)  
  \- render\_{{comparison}} (analytics/comparison overlay)  
  \- export\_{{format}} (data export)  
\`\`\`

\#\#\# Cron-Scheduled Automation Tool

For engines that run on a timer rather than being triggered by events:

\`\`\`  
\#\# Metadata  
  \- \*\*Edge Function\*\*: {{function-name}} (runs on cron schedule)

\#\# Integration Guidelines  
  \- "Runs on a cron schedule (default every N minutes)"  
  \- "Rate limiting: Maximum N items processed per cycle to prevent timeout"  
  \- "Each entity is processed independently; failure in one does not block others"  
\`\`\`

\---

\#\# 10\. Section-by-Section Annotation Guide

| Section | Present In | Purpose | What Agents Extract |  
|---------|-----------|---------|-------------------|  
| \*\*Metadata\*\* | All | Tool identity and relationships | Whether to load this file, what it connects to |  
| \*\*Schema\*\* | DB only | Table column definitions | INSERT/UPDATE SQL, TypeScript types, zod schemas |  
| \*\*Endpoint\*\* | API only | HTTP contract | Route handlers, CORS config, rate limiting |  
| \*\*Core Actions\*\* | All | Operation specifications | Function signatures, algorithms, error handling |  
| \*\*Processing Pipeline\*\* | API, sometimes Automation | Multi-stage data flow visualization | Understanding complex processing order |  
| \*\*Rules\*\* | Automation only | Hard constraints | Safety limits, recursion guards, timeout budgets |  
| \*\*Integration Guidelines\*\* | All | Usage instructions for consumers | How to call, auth setup, batching, caching |  
| \*\*Edge Cases\*\* | All | Boundary scenario handling | Defensive code, null checks, concurrency guards |  
| \*\*Implications\*\* | All | Side effects and downstream consequences | What fires after the action, what to watch for |

\#\#\# What Each Section Prevents

| Section | Without It, Agents... |  
|---------|----------------------|  
| Metadata | Load the wrong file or miss dependencies |  
| Schema | Write wrong column names, miss fields, skip constraints |  
| Endpoint | Misconfigure routes, miss rate limits, skip auth |  
| Core Actions | Guess at parameters, skip validation, miss error cases |  
| Processing Pipeline | Implement stages in wrong order, miss branching |  
| Rules | Allow infinite recursion, skip safety checks |  
| Integration Guidelines | Violate tenancy, skip batching, ignore cache invalidation |  
| Edge Cases | Crash on null data, skip duplicate checks, mishandle concurrency |  
| Implications | Miss audit logging, forget cascades, ignore compliance |

\---

\#\# 11\. How Agents Load Tools

\#\#\# Loading Flow

\`\`\`  
Agent receives task: "Implement the create contact endpoint"  
  │  
  ├─ Step 1: Read tools.md (index)  
  │  └─ Find: "Contacts CRUD → tools/db/contacts-crud.tool.md"  
  │  
  ├─ Step 2: Read contacts-crud.tool.md  
  │  ├─ Schema → Generate TypeScript interface and zod schema  
  │  ├─ create\_contact action → Implement the hook/handler  
  │  ├─ Integration Guidelines → Apply org scoping and batching  
  │  ├─ Edge Cases → Add defensive checks  
  │  └─ Implications → Wire up cascade triggers  
  │  
  └─ Step 3: Check Dependencies  
     └─ Dependencies list mentions "db/households-crud"  
        → Load that tool too if the implementation touches households  
\`\`\`

\#\#\# When to Load Tool Files

| Task Type | Load |  
|-----------|------|  
| Writing a database query | DB tool for the entity |  
| Building a React hook for CRUD | DB tool (schema \+ actions) |  
| Implementing an edge function | API tool for the function |  
| Building a UI component | UI tool for the component |  
| Setting up automation rules | Automation tool for the engine |  
| Debugging an error | Tool where the error originates (find by error code) |  
| Adding a new field to a table | DB tool (to see existing schema) |  
| Understanding cascade behavior | Automation/cascade-executor tool |

\#\#\# Cross-Referencing Between Tools

Tools don't directly reference other tools, but they connect through:

1\. \*\*Dependencies\*\* — Listed in metadata, tells you what other tools to load  
2\. \*\*Triggers\*\* — Events emitted by one tool, consumed by automation tools  
3\. \*\*Processing steps\*\* — API tool Process sections invoke DB tools by name  
4\. \*\*Integration Guidelines\*\* — Reference other tools for composition patterns

\---

\#\# 12\. Sizing Guide

\#\#\# How Many Tools Should Your Project Have?

| Project Size | DB Tools | API Tools | UI Tools | Automation | Total |  
|-------------|----------|-----------|----------|------------|-------|  
| \*\*Small\*\* (1-5 modules, ≤10 tables) | 3-8 | 1-3 | 1-2 | 0-1 | 5-14 |  
| \*\*Medium\*\* (6-15 modules, 11-30 tables) | 8-20 | 3-8 | 2-4 | 1-2 | 14-34 |  
| \*\*Large\*\* (16+ modules, 30+ tables) | 20-35 | 8-15 | 3-6 | 2-4 | 33-60 |

\#\#\# One Tool Per...

| Rule | Example |  
|------|---------|  
| One DB tool per primary entity/table | contacts-crud, donations-crud, deals-crud |  
| One API tool per edge function/endpoint | grace-chat, send-email, webhook-receiver |  
| One UI tool per shared interactive component | data-table, workflow-proposal |  
| One automation tool per background engine | cascade-executor, journey-execution |

\#\#\# File Length Guide

| Tool Category | Minimum Viable | Typical | Comprehensive |  
|--------------|----------------|---------|---------------|  
| DB (Standard CRUD) | 50 lines | 90-140 lines | 150+ lines |  
| DB (Read-Only) | 30 lines | 50-90 lines | 100+ lines |  
| DB (Multi-Table) | 70 lines | 110-160 lines | 180+ lines |  
| API (AI Agent) | 50 lines | 80-110 lines | 130+ lines |  
| API (Service) | 40 lines | 70-110 lines | 130+ lines |  
| API (Auth/Integration) | 50 lines | 80-130 lines | 150+ lines |  
| UI (Workflow) | 40 lines | 60-95 lines | 100+ lines |  
| UI (Data Interaction) | 50 lines | 70-110 lines | 120+ lines |  
| Automation (Rule Engine) | 50 lines | 70-100 lines | 110+ lines |  
| Automation (Queue Processor) | 50 lines | 70-90 lines | 100+ lines |

\#\#\# When NOT to Create a Tool File

\- Simple configuration objects (no CRUD, no API, no interaction)  
\- One-off scripts (migrations, seed data)  
\- Utility functions (formatters, validators already covered by a library)  
\- Tables that are only child/join tables with no independent actions

\---

\#\# 13\. Examples for Different Project Types

\#\#\# SaaS Platform (B2B)

\`\`\`  
tools/  
├── db/  
│   ├── users-crud.tool.md  
│   ├── teams-crud.tool.md  
│   ├── projects-crud.tool.md  
│   ├── subscriptions-crud.tool.md  
│   ├── invoices-crud.tool.md  
│   └── audit-log-query.tool.md  
├── api/  
│   ├── stripe-checkout.tool.md  
│   ├── webhook-receiver.tool.md  
│   └── send-notification.tool.md  
├── ui/  
│   ├── data-table.tool.md  
│   └── settings-panel.tool.md  
└── automation/  
    └── subscription-lifecycle.tool.md

Total: 12 tools (6 DB \+ 3 API \+ 2 UI \+ 1 Automation)  
\`\`\`

\#\#\# E-Commerce

\`\`\`  
tools/  
├── db/  
│   ├── products-crud.tool.md        (multi-table: products \+ variants \+ images)  
│   ├── orders-crud.tool.md          (multi-table: orders \+ order\_items)  
│   ├── customers-crud.tool.md  
│   ├── inventory-crud.tool.md  
│   ├── coupons-crud.tool.md  
│   └── reviews-crud.tool.md  
├── api/  
│   ├── stripe-payment.tool.md  
│   ├── shipping-rates.tool.md  
│   ├── email-send.tool.md  
│   └── webhook-receiver.tool.md  
├── ui/  
│   ├── product-configurator.tool.md  
│   ├── checkout-flow.tool.md  
│   └── order-management.tool.md  
└── automation/  
    ├── abandoned-cart.tool.md  
    └── inventory-reorder.tool.md

Total: 15 tools (6 DB \+ 4 API \+ 3 UI \+ 2 Automation)  
\`\`\`

\#\#\# Mobile App (Social/Content)

\`\`\`  
tools/  
├── db/  
│   ├── users-crud.tool.md  
│   ├── posts-crud.tool.md  
│   ├── comments-crud.tool.md  
│   ├── messages-crud.tool.md  
│   ├── follows-crud.tool.md  
│   └── reports-crud.tool.md  
├── api/  
│   ├── push-notification.tool.md  
│   ├── media-upload.tool.md  
│   └── content-moderation.tool.md  
├── ui/  
│   ├── feed-renderer.tool.md  
│   └── chat-interface.tool.md  
└── automation/  
    ├── feed-ranking.tool.md  
    └── notification-digest.tool.md

Total: 13 tools (6 DB \+ 3 API \+ 2 UI \+ 2 Automation)  
\`\`\`

\#\#\# AI-Powered Platform (Full WAT)

\`\`\`  
tools/  
├── db/  
│   ├── contacts-crud.tool.md         \# \+ 23 more entity CRUDs  
│   └── audit-log-query.tool.md       \# read-only variant  
├── api/  
│   ├── grace-chat.tool.md            \# AI agent endpoint  
│   ├── noa-analyze.tool.md           \# AI analytics endpoint  
│   ├── ark-generate.tool.md          \# AI recommendations  
│   ├── raven-research.tool.md        \# AI research  
│   ├── send-email.tool.md            \# service endpoint  
│   ├── webhook-receiver.tool.md      \# integration endpoint  
│   └── oauth-handlers.tool.md        \# auth endpoint  
│   \# \+ 5 more API tools  
├── ui/  
│   ├── workflow-proposal.tool.md     \# orchestration UI  
│   ├── step-approval.tool.md         \# workflow UI  
│   ├── audit-trail-view.tool.md      \# review UI  
│   ├── data-table.tool.md            \# data interaction UI  
│   └── module-navigation.tool.md     \# navigation UI  
└── automation/  
    ├── cascade-executor.tool.md      \# rule engine  
    ├── journey-execution.tool.md     \# queue processor  
    └── scheduled-messages.tool.md    \# queue processor

Total: 44 tools (24 DB \+ 12 API \+ 5 UI \+ 3 Automation)  
\`\`\`

\---

\#\# 14\. Integration Checklist

\#\#\# Initial Setup

\- \[ \] Create \`knowledge/tools/\` directory with subdirectories: \`db/\`, \`api/\`, \`ui/\`, \`automation/\`  
\- \[ \] Create \`knowledge/tools.md\` (tool index) with category tables  
\- \[ \] Create your first DB tool for the most important entity  
\- \[ \] Add the tool to the index  
\- \[ \] Reference the tool from CLAUDE.md Knowledge Base section

\#\#\# Per Database Entity

\- \[ \] Create \`tools/db/{{entity}}-crud.tool.md\`  
\- \[ \] Complete Schema section with all columns, types, defaults, descriptions  
\- \[ \] Complete create/get/list/update/delete actions with all 4 aspects  
\- \[ \] Add 0-4 specialized actions for domain-specific operations  
\- \[ \] Complete Integration Guidelines (org scoping, concurrency, batching)  
\- \[ \] Complete Edge Cases (3-7 realistic scenarios)  
\- \[ \] Complete Implications (audit trail, cascades, compliance)  
\- \[ \] Add entry to tool index DB table  
\- \[ \] Verify all error codes use UPPER\_SNAKE\_CASE  
\- \[ \] Verify all triggers match patterns consumed by automation tools

\#\#\# Per API Endpoint

\- \[ \] Create \`tools/api/{{function}}.tool.md\`  
\- \[ \] Complete Endpoint table (method, path, content-type, rate limit)  
\- \[ \] Complete Core Actions with all 4 aspects per action  
\- \[ \] Complete Processing Pipeline (ASCII flowchart for multi-stage processing)  
\- \[ \] Complete Integration Guidelines (auth, latency targets, delegation)  
\- \[ \] Complete Edge Cases (especially auth failures, rate limiting, partial success)  
\- \[ \] Complete Implications (audit, safety, compliance)  
\- \[ \] Add entry to tool index API table  
\- \[ \] Verify Auth field matches actual implementation

\#\#\# Per UI Component

\- \[ \] Create \`tools/ui/{{component}}.tool.md\`  
\- \[ \] Complete render action with full Input/Process/Output/Errors  
\- \[ \] Complete all interaction actions (typically 3-6)  
\- \[ \] Complete Integration Guidelines (rendering context, state, accessibility)  
\- \[ \] Complete Edge Cases (empty states, concurrent editing, browser refresh)  
\- \[ \] Complete Implications (status transitions, audit, permissions)  
\- \[ \] Add entry to tool index UI table

\#\#\# Per Automation Engine

\- \[ \] Create \`tools/automation/{{engine}}.tool.md\`  
\- \[ \] Complete the evaluate/process action (primary entry point)  
\- \[ \] Complete all dispatch/execute variant actions  
\- \[ \] Complete \*\*Rules\*\* section with hard constraints (depth, cycles, timeouts, rate limits)  
\- \[ \] Complete Integration Guidelines (trigger mechanism, configuration, monitoring)  
\- \[ \] Complete Edge Cases (concurrent processing, provider failures, queue exhaustion)  
\- \[ \] Complete Implications (entity creation, notifications, performance budgets)  
\- \[ \] Add entry to tool index Automation table

\#\#\# Validation

\- \[ \] Every tool file listed in tools.md exists on disk  
\- \[ \] Every \`wat\_references\` entry in task definitions pointing to a tool resolves  
\- \[ \] Every action has all 4 aspects (Input, Process, Output, Errors)  
\- \[ \] Every error code is UPPER\_SNAKE\_CASE and unique within the tool  
\- \[ \] DB tool schemas match actual database tables  
\- \[ \] API tool endpoints match actual edge functions  
\- \[ \] Trigger events emitted by tools are consumed by at least one automation rule  
\- \[ \] Dependencies listed in metadata point to real tool files  
\- \[ \] Tool counts in the index match actual file counts per category

\---

\#\# Quick Reference Card

\`\`\`  
TOOL INDEX CHEAT SHEET  
\======================

4 CATEGORIES:  
  db/           → Database CRUD specs (Schema \+ Actions)  
  api/          → API endpoint specs (Endpoint \+ Pipeline \+ Actions)  
  ui/           → UI component specs (Actions only, more interactions)  
  automation/   → Automation engine specs (Actions \+ Rules)

EVERY ACTION HAS 4 ASPECTS:  
  Input   → Parameters, types, required flags, validation notes  
  Process → Numbered algorithm steps (the exact implementation recipe)  
  Output  → Return object structure (field names and types)  
  Errors  → UPPER\_SNAKE\_CASE error codes with descriptions

CATEGORY-SPECIFIC SECTIONS:  
  DB only:         Schema (table columns)  
  API only:        Endpoint (HTTP details) \+ Processing Pipeline (ASCII flow)  
  Automation only: Rules (hard constraints — depth, cycles, timeouts)  
  All categories:  Metadata \+ Core Actions \+ Integration Guidelines \+  
                   Edge Cases \+ Implications

ONE TOOL PER:  
  DB entity table     → tools/db/{{entity}}-crud.tool.md  
  API edge function   → tools/api/{{function}}.tool.md  
  Shared UI component → tools/ui/{{component}}.tool.md  
  Background engine   → tools/automation/{{engine}}.tool.md

ARCHETYPES:  
  DB:         Standard CRUD (5+ actions) | Read-Only Query (2-3 actions)  
  API:        AI Agent (1 complex action) | Service (1-3 actions) | Auth (2-3 actions)  
  UI:         Workflow/Approval (3-5 actions) | Data Interaction (4-7 actions)  
  Automation: Rule Engine (evaluate \+ dispatch) | Queue Processor (batch \+ retry \+ cancel)  
\`\`\`

\---

\#\# Companion Templates

This document is part of the WAT Framework template library:

| Template | File | Contents |  
|----------|------|---------|  
| CLAUDE.md | \`docs/CLAUDE-MD-TEMPLATE.md\` | Agent instructions file template |  
| Skill Index | \`docs/SKILL-INDEX-TEMPLATE.md\` | Skill file templates (3 archetypes) |  
| Workflow Index | \`docs/WORKFLOW-INDEX-TEMPLATE.md\` | Workflow file templates (4 archetypes) |  
| \*\*Tool Index\*\* | \*\*\`docs/TOOL-INDEX-TEMPLATE.md\`\*\* | \*\*Tool file templates (4 categories) ← You are here\*\* |  
| WAT Framework | \`docs/WAT-FRAMEWORK-TEMPLATE.md\` | Master framework template (all layers) |  
| Task System | \`docs/TASK-SYSTEM-TEMPLATE.md\` | Task tracking database \+ UI template |  
| AI Dev Framework | \`docs/AI-DEV-FRAMEWORK-TEMPLATE.md\` | Full framework integration template |

\---

\*Template version 1.0 — Based on a production tool library with 44 tool files across 4 categories (24 DB \+ 12 API \+ 5 UI \+ 3 automation), powering 33 modules with 4 AI agents.\*

