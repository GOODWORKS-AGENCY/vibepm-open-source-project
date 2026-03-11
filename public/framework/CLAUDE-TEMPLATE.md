**\# CLAUDE.md — Complete Framework Template**

\> Copy this entire file to \`.claude/CLAUDE.md\` in your project. Fill in every \`{{placeholder}}\` and delete sections you don't need. Every section is annotated with **\*\*WHY\*\*** it exists and **\*\*WHAT\*\*** the AI agent uses it for.

\---

**\#\# How To Use This Template**

1\. Copy the **\*\*Template\*\*** section below into \`.claude/CLAUDE.md\`  
2\. Replace every \`{{PLACEHOLDER}}\` with your project's values  
3\. Delete any \`\<\!-- OPTIONAL \--\>\` sections you don't need  
4\. Delete all \`\<\!-- ANNOTATION \--\>\` comments when you're done  
5\. Create the companion \`.claude/rules/\` files (templates included below)

**\#\#\# Anatomy of a CLAUDE.md**

\`\`\`  
┌─────────────────────────────────────────────────────────────────┐  
│  CLAUDE.md                                                       │  
│                                                                  │  
│  ┌─ Project Overview ──────────────────────────────────────────┐ │  
│  │  Stack, architecture, what the app is                       │ │  
│  │  → Agent picks correct language/framework patterns          │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ Key Commands ──────────────────────────────────────────────┐ │  
│  │  Dev, build, lint, type-check, deploy                       │ │  
│  │  → Agent can verify its own work after every change         │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ Task Tracking Protocol ────────────────────────────────────┐ │  
│  │  How to pick, claim, complete, and block tasks              │ │  
│  │  → Agent follows the workflow every session                 │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ Project Structure ─────────────────────────────────────────┐ │  
│  │  Directory tree with annotations                            │ │  
│  │  → Agent knows where to create/find files                   │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ Knowledge Base ────────────────────────────────────────────┐ │  
│  │  Where domain docs live, how to load them per task          │ │  
│  │  → Agent loads context before building                      │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ Conventions ───────────────────────────────────────────────┐ │  
│  │  Top-level rules \+ pointers to .claude/rules/\*.md           │ │  
│  │  → Agent follows your code style without being told twice   │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ Module Map ────────────────────────────────────────────────┐ │  
│  │  Every module, its route, and its purpose                   │ │  
│  │  → Agent understands the app's surface area                 │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ Environment & Services ────────────────────────────────────┐ │  
│  │  External services, API keys, deployment targets            │ │  
│  │  → Agent configures integrations correctly                  │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ AI Agents (if applicable) ─────────────────────────────────┐ │  
│  │  In-app AI agents, their roles, access levels               │ │  
│  │  → Agent understands AI boundaries and safety rules         │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
│  ┌─ Do / Don't Rules ─────────────────────────────────────────┐ │  
│  │  Explicit behaviors you always/never want                   │ │  
│  │  → Agent avoids your known pain points                      │ │  
│  └─────────────────────────────────────────────────────────────┘ │  
│                                                                  │  
└─────────────────────────────────────────────────────────────────┘  
\`\`\`

\---

**\#\# Template**

Copy everything below this line into \`.claude/CLAUDE.md\`:

\---

\`\`\`markdown  
**\# {{PROJECT\_NAME}} — Claude Code Instructions**

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 1: PROJECT OVERVIEW  
     WHY: The agent reads this FIRST every session. It sets the mental  
     model — what language, what framework, what patterns to use.  
     RULE: Be specific. "React" is not enough — "React 18 with strict  
     mode, no class components" is.  
     ═══════════════════════════════════════════════════════════════ \--\>

**\#\# Project Overview**  
\- **\*\*Stack\*\***: {{FRAMEWORK}} \+ {{LANGUAGE}} \+ {{BUILD\_TOOL}}  
\- **\*\*State\*\***: {{SERVER\_STATE\_MANAGER}} (server state), {{CLIENT\_STATE\_MANAGER}} (view state)  
\- **\*\*UI\*\***: {{UI\_LIBRARY}} \+ {{CSS\_FRAMEWORK}}  
\- **\*\*Backend\*\***: {{BACKEND\_PLATFORM}}  
\- **\*\*Forms\*\***: {{FORM\_LIBRARY}} \+ {{VALIDATION\_LIBRARY}}  
\- **\*\*Error Tracking\*\***: {{ERROR\_SERVICE}}  
\- **\*\*Architecture\*\***: {{ONE\_LINE\_ARCHITECTURE\_DESCRIPTION}}

\<\!-- EXAMPLES:  
  Small SaaS:  
    \- Stack: Next.js 14 \+ TypeScript  
    \- State: TanStack Query (server), Zustand (client)  
    \- UI: shadcn/ui \+ Tailwind CSS  
    \- Backend: Supabase  
    \- Forms: react-hook-form \+ zod  
    \- Architecture: Multi-tenant SaaS with role-based access

  Python API:  
    \- Stack: FastAPI \+ Python 3.12  
    \- State: SQLAlchemy \+ Alembic (ORM/migrations)  
    \- UI: N/A (API only)  
    \- Backend: PostgreSQL \+ Redis \+ Celery  
    \- Architecture: Microservice with async task processing

  Mobile app:  
    \- Stack: React Native \+ TypeScript \+ Expo  
    \- State: TanStack Query \+ MMKV (local storage)  
    \- UI: NativeWind \+ custom design system  
    \- Backend: Firebase  
    \- Architecture: Offline-first mobile app with sync  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 2: KEY COMMANDS  
     WHY: After every change, the agent runs these to verify its work.  
     Without them, the agent can't self-check and errors accumulate.  
     RULE: Include EVERY command the agent might need. Be exact —  
     include flags, env vars, paths.  
     ═══════════════════════════════════════════════════════════════ \--\>

**\#\# Key Commands**  
\- **\*\*Dev server\*\***: \`{{DEV\_COMMAND}}\`  
\- **\*\*Build\*\***: \`{{BUILD\_COMMAND}}\`  
\- **\*\*Lint\*\***: \`{{LINT\_COMMAND}}\`  
\- **\*\*Type check\*\***: \`{{TYPECHECK\_COMMAND}}\`  
\- **\*\*Test\*\***: \`{{TEST\_COMMAND}}\`  
\- **\*\*DB migrations\*\***: \`{{MIGRATION\_COMMAND}}\`  
\- **\*\*Generate types\*\***: \`{{CODEGEN\_COMMAND}}\`

\<\!-- OPTIONAL: Add more commands as needed \--\>  
\<\!-- \- \*\*Deploy staging\*\*: \`{{DEPLOY\_STAGING\_COMMAND}}\` \--\>  
\<\!-- \- \*\*Deploy production\*\*: \`{{DEPLOY\_PROD\_COMMAND}}\` \--\>  
\<\!-- \- \*\*Seed database\*\*: \`{{SEED\_COMMAND}}\` \--\>  
\<\!-- \- \*\*Reset database\*\*: \`{{RESET\_COMMAND}}\` \--\>  
\<\!-- \- \*\*Open Supabase dashboard\*\*: \`npx supabase studio\` \--\>

\<\!-- EXAMPLES:  
  Next.js:  
    \- Dev server: \`npm run dev\`  
    \- Build: \`npm run build\`  
    \- Lint: \`npm run lint\`  
    \- Type check: \`npx tsc \--noEmit\`  
    \- Test: \`npm run test\`

  Python:  
    \- Dev server: \`uvicorn app.main:app \--reload\`  
    \- Lint: \`ruff check .\`  
    \- Type check: \`mypy app/\`  
    \- Test: \`pytest \-v\`  
    \- Migrations: \`alembic upgrade head\`  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 3: TASK TRACKING PROTOCOL  
     WHY: This is the agent's "work loop." Without it, the agent just  
     responds to prompts. With it, the agent proactively picks up  
     work, tracks progress, and coordinates with other agents.  
     RULE: Include the exact SQL queries. Agents are literal.  
     NOTE: Remove this section if you're not using the task system.  
     ═══════════════════════════════════════════════════════════════ \--\>

**\#\# Task Tracking Protocol**  
\- **\*\*Before starting work\*\***: Query \`project\_tasks\` for the next highest-priority pending task. Mark it \`in\_progress\`.  
\- **\*\*After completing work\*\***: Update the task to \`completed\` with \`progress\_pct \= 100\` and \`completed\_at \= now()\`.  
\- **\*\*If blocked\*\***: Set status to \`blocked\` and add a note explaining the blocker.  
\- **\*\*Task tracker UI\*\***: Available at \`/project-tracker\` route.  
\- **\*\*Direct update\*\*** (for CLI sessions):  
  \`\`\`sql  
  UPDATE project\_tasks SET status \= 'completed', progress\_pct \= 100, completed\_at \= now() WHERE task\_code \= '{{EXAMPLE\_TASK\_CODE}}';  
  \`\`\`  
\- **\*\*Process template\*\***: See \`.claude/rules/task-process.md\` for the full guide on adding new phases, creating tasks, and seeding migrations.  
\- **\*\*Current phase\*\***: Check \`project\_tasks\` for the latest active phase. {{PHASE\_STATUS\_NOTE}}

\<\!-- EXAMPLES:  
  PHASE\_STATUS\_NOTE:  
    \- "All phases 1-5 are complete. Phase 6 is current."  
    \- "Phase 1 in progress (8/15 tasks done)."  
    \- "New project — Phase 1 starts now."  
\--\>

\<\!-- OPTIONAL: Remove task protocol entirely for simple projects.  
     Replace with:  
     \#\# Work Process  
     \- Ask me what to work on next  
     \- Verify changes with: \`npm run build && npm run test\`  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 4: PROJECT STRUCTURE  
     WHY: The agent uses this to know WHERE to create new files and  
     WHERE to find existing code. Without it, the agent guesses  
     (often wrong) or asks you every time.  
     RULE: Show your ACTUAL structure, not an ideal one. Include  
     annotations explaining what each directory is for.  
     ═══════════════════════════════════════════════════════════════ \--\>

**\#\# Project Structure**

\`\`\`  
{{PROJECT\_ROOT}}/  
├── {{DIR\_1}}/                    \# {{DIR\_1\_DESCRIPTION}}  
├── {{DIR\_2}}/  
│   ├── {{SUBDIR\_A}}/             \# {{SUBDIR\_A\_DESCRIPTION}}  
│   ├── {{SUBDIR\_B}}/             \# {{SUBDIR\_B\_DESCRIPTION}}  
│   └── {{SUBDIR\_C}}/             \# {{SUBDIR\_C\_DESCRIPTION}}  
├── {{DIR\_3}}/                    \# {{DIR\_3\_DESCRIPTION}}  
│   └── {{MODULE}}/  
│       ├── hooks/                \# Data fetching \+ mutations  
│       ├── api/                  \# API layer  
│       ├── components/           \# Module-specific UI  
│       └── types.ts              \# Module types  
├── {{DIR\_4}}/                    \# {{DIR\_4\_DESCRIPTION}}  
├── {{DIR\_5}}/                    \# {{DIR\_5\_DESCRIPTION}}  
└── {{DIR\_6}}/                    \# {{DIR\_6\_DESCRIPTION}}  
\`\`\`

\<\!-- EXAMPLES:

  React \+ Vite (feature-first):  
    src/  
    ├── app/                    \# App setup (App.tsx, routes.tsx, providers.tsx)  
    ├── components/  
    │   ├── ui/                 \# shadcn/ui components  
    │   ├── layout/             \# Shell, sidebar, topbar  
    │   └── common/             \# Shared cross-module components  
    ├── features/               \# Feature logic by domain  
    │   └── \[module\]/  
    │       ├── hooks/  
    │       ├── components/  
    │       └── types.ts  
    ├── hooks/                  \# Global shared hooks  
    ├── lib/                    \# Utilities (api client, query keys)  
    ├── pages/                  \# Route pages  
    ├── types/                  \# Global TypeScript types  
    └── styles/                 \# Global styles

  Next.js (app router):  
    app/  
    ├── (auth)/                 \# Auth route group  
    │   ├── login/page.tsx  
    │   └── signup/page.tsx  
    ├── (dashboard)/            \# Dashboard route group  
    │   ├── layout.tsx  
    │   └── \[module\]/page.tsx  
    ├── api/                    \# API routes  
    └── layout.tsx              \# Root layout  
    lib/  
    ├── db/                     \# Database queries  
    ├── auth/                   \# Auth utilities  
    └── utils/                  \# Shared utilities  
    components/  
    ├── ui/                     \# UI primitives  
    └── \[feature\]/              \# Feature components

  Python API:  
    app/  
    ├── api/  
    │   ├── v1/  
    │   │   ├── routes/         \# Route handlers  
    │   │   └── deps.py         \# Dependency injection  
    │   └── middleware/          \# Auth, CORS, logging  
    ├── models/                 \# SQLAlchemy models  
    ├── schemas/                \# Pydantic schemas  
    ├── services/               \# Business logic  
    ├── tasks/                  \# Celery async tasks  
    └── core/  
        ├── config.py           \# Settings  
        ├── db.py               \# Database session  
        └── security.py         \# Auth utilities  
    migrations/                 \# Alembic migrations  
    tests/                      \# pytest tests  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 5: KNOWLEDGE BASE  
     WHY: This tells the agent WHERE to find domain context and HOW  
     to load it based on the type of task. Without it, the agent  
     builds features without understanding the domain.  
     NOTE: Remove this section if you don't have a knowledge/ folder.  
     For simpler projects, point to your docs/ or README instead.  
     ═══════════════════════════════════════════════════════════════ \--\>

**\#\# Knowledge Base**  
Domain knowledge is in \`knowledge/\`. Load relevant files based on task:  
\- \`knowledge/prod.md\` — Full domain reference (all {{MODULE\_COUNT}} modules)  
\- \`knowledge/skills.md\` — Skill index (find the right domain skill)  
\- \`knowledge/tools.md\` — Tool index (find the right implementation spec)  
\- \`knowledge/workflows.md\` — Workflow index (find the right process)  
\- \`knowledge/PRD.json\` — Task dependency graph

**\#\#\# Loading by task type:**  
\- **\*\*Working on a specific module\*\***: Load \`knowledge/skills/\[module\]/\[module\].skill.md\`  
\- **\*\*Implementing CRUD\*\***: Load \`knowledge/tools/db/\[entity\]-crud.tool.md\`  
\- **\*\*Building an API endpoint\*\***: Load \`knowledge/tools/api/\[function-name\].tool.md\`  
\- **\*\*Implementing a workflow\*\***: Load \`knowledge/workflows/\[module\]/\[workflow-name\].workflow.md\`  
\- **\*\*Cross-cutting concerns\*\***: Load \`knowledge/skills/shared/\[topic\].skill.md\`

\<\!-- SIMPLER ALTERNATIVE (for projects without a full knowledge base):

\#\# Documentation  
\- \*\*API docs\*\*: See \`docs/api.md\`  
\- \*\*Database schema\*\*: See \`docs/schema.md\`  
\- \*\*Architecture decisions\*\*: See \`docs/adr/\`  
\- \*\*Component library\*\*: See Storybook at \`npm run storybook\`  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 6: CONVENTIONS  
     WHY: The agent's "coding standards." These are the rules the  
     agent follows on EVERY file it touches. Without them, the agent  
     defaults to generic patterns that may conflict with your codebase.  
     RULE: List your top 5-10 non-negotiable conventions here. Put  
     detailed rules in .claude/rules/\*.md files.  
     ═══════════════════════════════════════════════════════════════ \--\>

**\#\# Conventions**  
\- See \`.claude/rules/\` for detailed coding conventions  
\- {{CONVENTION\_1}}  
\- {{CONVENTION\_2}}  
\- {{CONVENTION\_3}}  
\- {{CONVENTION\_4}}  
\- {{CONVENTION\_5}}

\<\!-- EXAMPLES:

  React/Supabase project:  
    \- All database queries must use organization-scoped patterns with RLS  
    \- All new components follow existing patterns in the same module  
    \- All forms use react-hook-form \+ zod validation  
    \- All server state uses TanStack Query with the query key factory  
    \- Never use \`any\` type — use \`unknown\` and narrow

  Next.js project:  
    \- All data fetching happens in Server Components or server actions  
    \- Client Components must have 'use client' directive  
    \- All API routes validate input with zod  
    \- Use next/image for all images  
    \- Use next/link for all internal navigation

  Python API:  
    \- All endpoints require authentication unless explicitly public  
    \- All database queries go through the service layer, never in routes  
    \- All responses use standard envelope: { data, error, meta }  
    \- Use dependency injection for database sessions  
    \- Never commit .env files — use .env.example as template

  General (any project):  
    \- No console.log in production code (use proper logger)  
    \- No hardcoded secrets — use environment variables  
    \- No TODO comments without a linked issue number  
    \- Prefer composition over inheritance  
    \- Every public function needs a doc comment  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 7: MODULE MAP  
     WHY: For multi-module apps, this gives the agent a bird's-eye  
     view of what exists. It uses this to understand relationships  
     between modules and where new features belong.  
     NOTE: Remove for single-module apps or APIs.  
     ═══════════════════════════════════════════════════════════════ \--\>

**\#\# Module Map**  
| Module | Route | Purpose |  
|--------|-------|---------|  
| {{MODULE\_1}} | \`{{ROUTE\_1}}\` | {{PURPOSE\_1}} |  
| {{MODULE\_2}} | \`{{ROUTE\_2}}\` | {{PURPOSE\_2}} |  
| {{MODULE\_3}} | \`{{ROUTE\_3}}\` | {{PURPOSE\_3}} |

\<\!-- EXAMPLES:

  E-commerce:  
    | Module | Route | Purpose |  
    |--------|-------|---------|  
    | Dashboard | \`/\` | Overview, recent orders, stats |  
    | Products | \`/products\` | Product catalog, inventory |  
    | Orders | \`/orders\` | Order management, fulfillment |  
    | Customers | \`/customers\` | Customer profiles, segments |  
    | Analytics | \`/analytics\` | Sales reports, insights |  
    | Settings | \`/settings\` | Store config, shipping, tax |

  Project management:  
    | Module | Route | Purpose |  
    |--------|-------|---------|  
    | Dashboard | \`/dashboard\` | Overview, activity feed |  
    | Projects | \`/projects\` | Project CRUD, settings |  
    | Tasks | \`/tasks\` | Task board, list, calendar |  
    | Team | \`/team\` | Members, roles, permissions |  
    | Reports | \`/reports\` | Time tracking, burndown |

  API-only:  
    | Module | Base Path | Purpose |  
    |--------|-----------|---------|  
    | Auth | \`/api/v1/auth\` | Registration, login, tokens |  
    | Users | \`/api/v1/users\` | User CRUD, profiles |  
    | Products | \`/api/v1/products\` | Product management |  
    | Orders | \`/api/v1/orders\` | Order processing |  
    | Webhooks | \`/api/v1/webhooks\` | External integrations |  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 8: ENVIRONMENT & SERVICES  
     WHY: Tells the agent what external services exist and how they  
     connect. Prevents the agent from trying to build things that  
     should be delegated to a service.  
     ═══════════════════════════════════════════════════════════════ \--\>

\<\!-- OPTIONAL \--\>  
**\#\# Environment & Services**  
| Service | Purpose | Config |  
|---------|---------|--------|  
| {{SERVICE\_1}} | {{SERVICE\_1\_PURPOSE}} | \`.env\` → \`{{ENV\_VAR\_1}}\` |  
| {{SERVICE\_2}} | {{SERVICE\_2\_PURPOSE}} | \`.env\` → \`{{ENV\_VAR\_2}}\` |

\<\!-- EXAMPLES:  
  | Service | Purpose | Config |  
  |---------|---------|--------|  
  | Supabase | Database \+ Auth \+ Storage | \`.env\` → \`VITE\_SUPABASE\_URL\`, \`VITE\_SUPABASE\_ANON\_KEY\` |  
  | Stripe | Payments | \`.env\` → \`STRIPE\_SECRET\_KEY\`, \`STRIPE\_WEBHOOK\_SECRET\` |  
  | Resend | Transactional email | \`.env\` → \`RESEND\_API\_KEY\` |  
  | Sentry | Error tracking | \`.env\` → \`VITE\_SENTRY\_DSN\` |  
  | Vercel | Hosting | Auto-configured via \`vercel.json\` |  
  | Redis | Caching \+ job queue | \`.env\` → \`REDIS\_URL\` |  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 9: DATABASE PATTERNS  
     WHY: If your project has a database, these patterns prevent the  
     agent from writing schema that doesn't match your conventions.  
     NOTE: For detailed rules, use \`.claude/rules/database.md\`. This  
     section is just the quick-reference essentials.  
     ═══════════════════════════════════════════════════════════════ \--\>

\<\!-- OPTIONAL \--\>  
**\#\# Database Patterns**

**\#\#\# Common columns (every table)**  
\`\`\`sql  
{{COMMON\_COLUMNS\_SQL}}  
\`\`\`

**\#\#\# Naming**  
\- Tables: {{TABLE\_NAMING}} (e.g., \`snake\_case\`, plural)  
\- Columns: {{COLUMN\_NAMING}} (e.g., \`snake\_case\`)  
\- Indexes: \`idx\_{{table}}\_{{column}}\`  
\- Foreign keys: \`fk\_{{table}}\_{{referenced\_table}}\`

**\#\#\# Security**  
\- {{DB\_SECURITY\_RULE\_1}}  
\- {{DB\_SECURITY\_RULE\_2}}

\<\!-- EXAMPLES:

  Supabase with RLS:  
    \#\#\# Common columns  
    \`\`\`sql  
    id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    organization\_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  
    created\_at      TIMESTAMPTZ NOT NULL DEFAULT now(),  
    updated\_at      TIMESTAMPTZ NOT NULL DEFAULT now()  
    \`\`\`  
    \#\#\# Security  
    \- RLS enabled on every table  
    \- All queries scoped by organization\_id  
    \- Audit triggers on all mutable tables

  Prisma:  
    \#\#\# Common columns  
    \`\`\`prisma  
    id        String   @id @default(cuid())  
    createdAt DateTime @default(now())  
    updatedAt DateTime @updatedAt  
    \`\`\`  
    \#\#\# Security  
    \- All queries filter by teamId from session  
    \- Soft delete via deletedAt column

  Django:  
    \#\#\# Common columns  
    \`\`\`python  
    class BaseModel(models.Model):  
        id \= models.UUIDField(primary\_key=True, default=uuid4)  
        created\_at \= models.DateTimeField(auto\_now\_add=True)  
        updated\_at \= models.DateTimeField(auto\_now=True)  
        class Meta:  
            abstract \= True  
    \`\`\`  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 10: AI AGENTS (IN-APP)  
     WHY: If your app has AI-powered features, the agent needs to  
     understand boundaries — what each AI surface can/cannot do,  
     risk levels, approval flows.  
     NOTE: Remove entirely if your app has no AI features.  
     ═══════════════════════════════════════════════════════════════ \--\>

\<\!-- OPTIONAL \--\>  
**\#\# AI Agents**  
\- **\*\*{{AGENT\_1}}\*\***: {{AGENT\_1\_ROLE}} — {{AGENT\_1\_ACCESS\_RULE}}  
\- **\*\*{{AGENT\_2}}\*\***: {{AGENT\_2\_ROLE}} — {{AGENT\_2\_ACCESS\_RULE}}

\<\!-- EXAMPLES:  
  \- \*\*Assistant\*\*: Conversational AI — proposes actions, never mutates directly  
  \- \*\*Analyzer\*\*: Analytics engine — read-only, generates insight artifacts  
  \- \*\*Recommender\*\*: Suggestion engine — generates plans, executes after approval  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 11: DO / DON'T RULES  
     WHY: Explicit behavioral rules that override the agent's defaults.  
     These are the things you've been burned by before — put them here  
     so the agent never does them again.  
     RULE: Be specific and give a reason. "Don't use X" is okay.  
     "Don't use X because Y" is better.  
     ═══════════════════════════════════════════════════════════════ \--\>

\<\!-- OPTIONAL \--\>  
**\#\# Rules**

**\#\#\# Always**  
\- {{ALWAYS\_RULE\_1}}  
\- {{ALWAYS\_RULE\_2}}  
\- {{ALWAYS\_RULE\_3}}

**\#\#\# Never**  
\- {{NEVER\_RULE\_1}}  
\- {{NEVER\_RULE\_2}}  
\- {{NEVER\_RULE\_3}}

\<\!-- EXAMPLES:

  \#\#\# Always  
  \- Always run \`npm run build\` after making changes to verify  
  \- Always use the query key factory — never inline key arrays  
  \- Always add an index on foreign key columns  
  \- Always validate user input at the API boundary with zod  
  \- Always handle loading, error, and empty states in UI components

  \#\#\# Never  
  \- Never use \`any\` type — use \`unknown\` and narrow with type guards  
  \- Never store server state in React state — use TanStack Query  
  \- Never modify existing database migrations — create new ones  
  \- Never use \`alert()\` or \`window.confirm()\` — use dialog components  
  \- Never commit .env files or hardcode secrets  
  \- Never skip TypeScript strict mode checks  
  \- Never use \`SELECT \*\` in production queries — list columns explicitly  
  \- Never auto-commit without being asked  
\--\>

\<\!-- ═══════════════════════════════════════════════════════════════  
     SECTION 12: DEPLOYMENT  
     WHY: The agent needs to know how your app is deployed so it  
     doesn't break the deployment pipeline with its changes.  
     ═══════════════════════════════════════════════════════════════ \--\>

\<\!-- OPTIONAL \--\>  
**\#\# Deployment**  
\- **\*\*Platform\*\***: {{DEPLOY\_PLATFORM}}  
\- **\*\*Branch strategy\*\***: {{BRANCH\_STRATEGY}}  
\- **\*\*CI/CD\*\***: {{CI\_TOOL}} — runs {{CI\_STEPS}}  
\- **\*\*Environments\*\***: {{ENVIRONMENTS}}

\<\!-- EXAMPLES:  
  \- Platform: Vercel (auto-deploy from main)  
  \- Branch strategy: main \= production, feature branches for PRs  
  \- CI/CD: GitHub Actions — lint, type-check, test, build  
  \- Environments: preview (PR), staging (develop branch), production (main)  
\--\>  
\`\`\`

\---

\#\# Companion Files: \`.claude/rules/\`

Create these alongside your CLAUDE.md. Each one is a focused convention doc.

\#\#\# \`.claude/rules/code-style.md\`

\`\`\`markdown  
\# Code Style Conventions

\#\# {{LANGUAGE}}  
\- {{TYPE\_SYSTEM\_RULE}}  
\- {{NAMING\_COMPONENTS}}  
\- {{NAMING\_FUNCTIONS}}  
\- {{NAMING\_FILES}}  
\- {{NAMING\_CONSTANTS}}

\#\# Imports  
\- {{IMPORT\_ORDER\_RULE}}  
\- {{IMPORT\_ALIAS\_RULE}}

\#\# Components / Classes / Modules  
\- {{COMPONENT\_PATTERN}}  
\- {{STATE\_MANAGEMENT\_RULE}}  
\- {{ERROR\_HANDLING\_RULE}}

\#\# Formatting  
\- {{FORMATTER}} handles formatting — don't manually align code  
\- {{LINE\_LENGTH}} character line limit  
\`\`\`

**\#\#\# \`.claude/rules/architecture.md\`**

\`\`\`markdown  
**\# Architecture Rules**

**\#\# Organization**  
\- {{ORG\_PATTERN}} (feature-first / layer-first / domain-driven)  
\- Each feature has: {{FEATURE\_STRUCTURE}}  
\- Shared code lives in: {{SHARED\_LOCATIONS}}

**\#\# Data Flow**  
\- {{DATA\_FLOW\_DESCRIPTION}}  
\- {{CACHING\_STRATEGY}}  
\- {{MUTATION\_PATTERN}}

**\#\# Routing**  
\- {{ROUTING\_LIBRARY}} with {{ROUTING\_PATTERN}}  
\- {{AUTH\_GUARD\_PATTERN}}  
\- {{LAZY\_LOADING\_RULE}}  
\`\`\`

**\#\#\# \`.claude/rules/database.md\`**

\`\`\`markdown  
**\# Database Conventions**

**\#\# Tables**  
\- {{COMMON\_COLUMNS\_DESCRIPTION}}  
\- {{PK\_STRATEGY}} (UUID / auto-increment / CUID)  
\- {{TIMESTAMP\_STRATEGY}}

**\#\# Security**  
\- {{RLS\_OR\_MIDDLEWARE\_PATTERN}}  
\- {{AUDIT\_PATTERN}}

**\#\# Migrations**  
\- {{MIGRATION\_STRATEGY}} (forward-only / reversible)  
\- {{MIGRATION\_NAMING}} (sequential numbers / timestamps)  
\- {{MIGRATION\_RULE}} (never modify existing — create new)

**\#\# Query Patterns**  
\- {{QUERY\_SCOPING\_RULE}}  
\- {{PAGINATION\_PATTERN}}  
\- {{INDEX\_STRATEGY}}  
\`\`\`

**\#\#\# \`.claude/rules/testing.md\`**

\`\`\`markdown  
**\# Testing Conventions**

**\#\# What to Test**  
\- {{TEST\_FOCUS\_1}}  
\- {{TEST\_FOCUS\_2}}  
\- {{TEST\_FOCUS\_3}}

**\#\# What NOT to Test**  
\- {{SKIP\_1}}  
\- {{SKIP\_2}}

**\#\# Test Naming**  
\- Files: \`{{TEST\_FILE\_PATTERN}}\`  
\- Describe blocks: {{DESCRIBE\_PATTERN}}  
\- Test names: {{TEST\_NAME\_PATTERN}}

**\#\# Commands**  
\- Run all: \`{{TEST\_ALL\_COMMAND}}\`  
\- Run one file: \`{{TEST\_ONE\_COMMAND}}\`  
\- Watch mode: \`{{TEST\_WATCH\_COMMAND}}\`  
\`\`\`

**\#\#\# \`.claude/rules/task-process.md\`**

\`\`\`markdown  
**\# Task Management Process**

**\#\# Task Protocol (Every Session)**

**\#\#\# Before Starting Work**  
\`\`\`sql  
SELECT task\_code, title, priority, dependencies, wat\_references  
FROM project\_tasks  
WHERE status \= 'pending'  
ORDER BY priority DESC  
LIMIT 1;

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
SET status \= 'blocked', notes \= 'Reason'  
WHERE task\_code \= 'PXX-YY';  
\`\`\`

**\#\#\# Always Verify**  
\`\`\`bash  
{{VERIFY\_COMMAND\_1}}  
{{VERIFY\_COMMAND\_2}}  
\`\`\`

**\#\# Adding a New Phase**  
1\. Create plan file in \`plans/\` or \`docs/\`  
2\. Create seed migration with INSERT ... ON CONFLICT  
3\. Push migration  
4\. Register phase in tracker UI  
5\. Create knowledge files if needed  
6\. Work tasks in priority order  
7\. Create completion migration when done  
\`\`\`

\---

\#\# Size Guide

How much CLAUDE.md do you need?

| Project Type | Sections to Include | Typical Length |  
|-------------|-------------------|---------------|  
| \*\*Solo side project\*\* | Overview, Key Commands, Structure, Conventions | 30–50 lines |  
| \*\*Small team app\*\* | \+ Task Protocol, Module Map, Do/Don't Rules | 60–100 lines |  
| \*\*Production SaaS\*\* | \+ Knowledge Base, Database Patterns, Environment, Deployment | 100–150 lines |  
| \*\*Enterprise platform\*\* | Everything \+ AI Agents, detailed Module Map, full rules/ folder | 120–200 lines |

\#\#\# Minimum viable CLAUDE.md (30 lines)

\`\`\`markdown  
\# My App — Claude Code Instructions

\#\# Stack  
React \+ TypeScript \+ Vite \+ Supabase

\#\# Commands  
\- Dev: \`npm run dev\`  
\- Build: \`npm run build\`  
\- Type check: \`npx tsc \--noEmit\`

\#\# Structure  
src/features/\[module\]/hooks/ — data fetching  
src/features/\[module\]/components/ — UI  
src/pages/ — route pages  
src/lib/ — utilities

\#\# Rules  
\- Use TanStack Query for all server state  
\- Use react-hook-form \+ zod for all forms  
\- Never use \`any\` type  
\- Follow existing patterns in the same module  
\`\`\`

That's it. Even 30 lines dramatically improves agent performance.

\---

*\*Template version 1.0 — based on a production CLAUDE.md that powered 200+ tasks across 33 modules with 2 AI agents.\**

