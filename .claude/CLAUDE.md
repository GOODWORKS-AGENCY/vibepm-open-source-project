# VibePM — Claude Code Instructions

## Project Overview
- **Stack**: React 18 + TypeScript + Vite (SWC)
- **State**: TanStack Query + localStorage
- **UI**: shadcn/ui + Tailwind CSS + Framer Motion
- **Backend**: Supabase (auth + edge functions)
- **Forms**: react-hook-form + zod
- **Architecture**: Feature-first modular architecture

## Key Commands
```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type check (MUST pass before completing any task)
npm run test         # Tests
npx supabase db push # Apply migrations
```

---

## Task Protocol (CRITICAL — Read This First)

This project uses an autonomous task system. You do not wait for instructions.
You query for your next task, claim it, do the work, verify, and mark complete.

### Before Every Session

Run the agent CLI to get your next task:

```bash
./scripts/agent.sh next
```

Or call the API directly:

```bash
curl -s -X POST "$SUPABASE_URL/functions/v1/agent-tasks" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"next","agent_id":"claude-code"}'
```

The response includes the task and its `wat_references` — load those files before starting work.

### Work Loop

```
1. GET NEXT TASK     →  ./scripts/agent.sh next
2. CLAIM IT          →  ./scripts/agent.sh claim P01-03
3. LOAD KNOWLEDGE    →  Read each file in task.wat_references[]
4. DO THE WORK       →  Implement the task
5. VERIFY            →  npx tsc --noEmit && npm run build
6. MARK COMPLETE     →  ./scripts/agent.sh complete P01-03
7. REPEAT            →  Go to step 1
```

### If Blocked

```bash
./scripts/agent.sh block P01-03 "Missing dependency: auth module not yet built"
```

### Check Overall Progress

```bash
./scripts/agent.sh status
```

### Rules
- **Never skip verification.** `tsc --noEmit && npm run build` must pass before marking complete.
- **Never work without claiming.** Always claim before starting.
- **Respect dependencies.** The API will reject claims on tasks with unmet deps.
- **Load wat_references.** These files contain the exact specs for what you're building.
- **One task at a time.** Complete or block the current task before picking up the next.

---

## Knowledge Base

Domain knowledge lives in `knowledge/`. Load files based on your current task's `wat_references`.

| Index | What It Contains |
|-------|-----------------|
| `knowledge/prod.md` | Full platform atlas (9 modules) |
| `knowledge/skills.md` | Skill index — find domain knowledge |
| `knowledge/tools.md` | Tool index — find implementation specs |
| `knowledge/workflows.md` | Workflow index — find process flows |
| `knowledge/PRD.json` | Task dependency graph |

### Loading Rules
| Task Type | Load This |
|-----------|-----------|
| Module work | `knowledge/skills/{module}/{module}.skill.md` |
| CRUD / schema | `knowledge/tools/db/{entity}-crud.tool.md` |
| API endpoint | `knowledge/tools/api/{name}.tool.md` |
| UI component | `knowledge/tools/ui/{name}.tool.md` |
| Workflow / process | `knowledge/workflows/{module}/{name}.workflow.md` |
| Auth / audit / shared | `knowledge/skills/shared/{topic}.skill.md` |

---

## Module Map

| Module | Route | Purpose |
|--------|-------|---------|
| Project Wizard | `/new` | 4-step wizard: brain dump → AI analysis → task/knowledge generation → review & save |
| Project Dashboard | `/projects/:id` | Project overview with nested routes for tasks, knowledge files, and export |
| Project Tasks | `/projects/:id/tasks` | Task management within a project — view, filter, update status, track progress |
| Knowledge Viewer | `/projects/:id/knowledge` | Browse and preview generated knowledge files (skills, tools, workflows) |
| Project Export | `/projects/:id/export` | File browser with preview and ZIP download of all generated framework files |
| Project List | `/projects` | Overview of all saved projects with XP/level badges and quick actions |
| Project Tracker | `/project-tracker` | Cross-project task tracker with phase filtering and progress visualization |
| Framework Docs | `/framework` | Public documentation pages explaining the WAT framework, pipeline, and templates |
| Template Engine | `/template-engine` | Deterministic file generators: skills, tools, workflows, CLAUDE.md, rules, task seed SQL, tracker UI, strategic docs |

## Project Structure

```
.claude/CLAUDE.md            ← You are here
.claude/rules/*.md           ← Coding conventions (auto-loaded)
knowledge/                   ← WAT knowledge base
  skills/                    ← WHAT to build (domain knowledge)
  tools/                     ← HOW to build (implementation specs)
  workflows/                 ← WHEN things happen (process flows)
scripts/agent.sh             ← Agent CLI (task loop interface)
src/
  features/[module]/         ← Feature code by domain
  hooks/                     ← Shared hooks
  pages/                     ← Route pages
  components/                ← Shared components
supabase/
  migrations/                ← Database migrations
  functions/                 ← Edge functions
```

## Conventions
- See `.claude/rules/` for detailed coding conventions
- All forms: react-hook-form + zod
- All server state: TanStack Query with query key factory
- All components: handle loading, error, empty, and data states
- Never use `any` — use `unknown` and narrow

## Agent Roles

| Agent | Role | Task Filter |
|-------|------|-------------|
| `claude-code` | Primary — architecture, complex features, AI, testing | `assigned_to = 'claude-code'` |
| `agent-2` | Secondary — migrations, CRUD, boilerplate | `assigned_to = 'agent-2'` |

Both agents share the same `project_tasks` table. Each filters by `assigned_to`.
Cross-agent dependencies are resolved via the `dependencies[]` array.

## Environment

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ACCESS_TOKEN` | User JWT for agent API calls |
| `AGENT_ID` | Agent name (default: claude-code) |

## Rules

### Always
- Run `npx tsc --noEmit && npm run build` before marking any task complete
- Load `wat_references` before starting work on a task
- Use the query key factory — never inline key arrays
- Add indexes on foreign key columns
- Validate user input at API boundaries with zod

### Never
- Never use `any` type
- Never store server state in React state
- Never modify existing migrations — create new ones
- Never commit .env files or hardcode secrets
- Never skip the task protocol — always claim → work → verify → complete
