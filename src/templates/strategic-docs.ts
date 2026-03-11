import { Project } from '@/types/project';

/**
 * Tiered strategic documentation — inspired by Paperclip's doc hierarchy.
 *
 * Three levels of strategic docs that give AI agents the "why" context:
 * - VISION.md — Why this project exists (mission, problem, north star)
 * - PRODUCT.md — What the product does (concepts, principles, user flow)
 * - SPEC.md — Concrete V1 build contract (scope, data model, acceptance criteria)
 *
 * These complement the existing technical docs (CLAUDE.md, prod.md, rules/)
 * by providing strategic context that prevents agents from making decisions
 * that are technically correct but strategically wrong.
 */

export function generateVisionMd(project: Project): string {
  const moduleCount = project.phases.length;
  const entityCount = project.knowledgeFiles.filter(f => f.type === 'tool').length || project.tasks.length;

  return `# ${project.name}

**${project.description}**

## The Vision

${project.description}

This platform will serve as the central system for managing all aspects of the domain — from data entry to reporting, from user onboarding to advanced automation. Every decision we make should serve that: make the platform more capable, more reliable, more scalable, and more valuable.

## The Problem

Without this platform, users rely on fragmented tools, manual processes, and disconnected workflows. Data lives in spreadsheets, communication happens over email, and critical business logic exists only in people's heads. This creates:

- **Information silos** — Teams can't see what other teams are doing
- **Manual overhead** — Repetitive tasks that should be automated
- **Data inconsistency** — Same data entered differently in multiple places
- **No single source of truth** — Conflicting reports from different systems

## What This Is

${project.name} is the **single platform** where you:

- **Manage all core entities** — CRUD operations with full audit trails
- **Automate workflows** — Business processes that trigger automatically
- **Control access** — Role-based permissions with organization-level scoping
- **Track everything** — Real-time dashboards, reporting, and analytics
- **Scale with confidence** — Multi-tenant architecture that grows with you

## Architecture

Two layers:

### 1. Application Layer (this software)

The user-facing system. Manages:

${project.phases.map(p => `- ${p.name} — ${p.description}`).join('\n')}

### 2. Data Layer (Supabase)

PostgreSQL with Row Level Security, Edge Functions for server-side logic, and real-time subscriptions for live updates.

## Core Principle

You should be able to look at ${project.name} and understand the entire operation at a glance — what's happening, what needs attention, and whether things are working.

## Success Metrics

| Metric | Target |
|--------|--------|
| Modules shipped | ${moduleCount} |
| Core entities covered | ${entityCount}+ |
| Uptime | 99.9% |
| Page load time | < 2s |
| User adoption | 80%+ of target users within 90 days |
`;
}

export function generateProductMd(project: Project): string {
  return `# ${project.name} — Product Definition

## What It Is

${project.description}

## Core Concepts

${project.phases.map(phase => `### ${phase.name}

${phase.description}

This phase establishes the ${phase.name.toLowerCase()} capabilities of the platform.`).join('\n\n')}

## Principles

1. **Data integrity first.** Every operation maintains referential integrity. Cascading deletes are explicit. Audit trails are immutable.

2. **Organization-scoped by default.** Every entity belongs to an organization. Row Level Security enforces data isolation at the database level.

3. **Convention over configuration.** Consistent patterns for CRUD, search, filtering, and pagination across all modules. If you've used one module, you can use them all.

4. **Progressive disclosure.** Show the most important information first. Advanced features are accessible but not overwhelming. Power users get keyboard shortcuts and bulk operations.

5. **Offline-resilient.** Optimistic updates for common actions. Clear error states when connectivity is lost. No silent data loss.

## User Flow (Dream Scenario)

1. User signs up or logs in → lands on dashboard
2. Dashboard shows: key metrics, recent activity, pending items
3. Navigate to any module → see list view with filters and search
4. Click any record → detail view with full context
5. Related data is always one click away (breadcrumbs, links, tabs)
6. Actions are contextual — the right action is always visible
7. Bulk operations for power users (select multiple, batch update)

## Module Map

| # | Module | Description |
|---|--------|-------------|
${project.phases.map((p, i) => `| ${i + 1} | ${p.name} | ${p.description} |`).join('\n')}

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Performance** | < 200ms API response for standard CRUD |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Browser support** | Latest 2 versions of Chrome, Firefox, Safari, Edge |
| **Mobile** | Responsive design, touch-friendly interactions |
| **Data export** | CSV/JSON export for all list views |
| **Search** | Full-text search across all searchable fields |

## Further Detail

See \`knowledge/prod.md\` for the complete domain reference and \`knowledge/PRD.json\` for the task dependency graph.
`;
}

export function generateSpecMd(project: Project): string {
  const tasksByPhase = project.phases.map(phase => {
    const phaseTasks = project.tasks.filter(t => t.phase === `phase${phase.number}` || t.phase === phase.name.toLowerCase().replace(/\s+/g, '-'));
    return { phase, tasks: phaseTasks };
  });

  return `# ${project.name} — V1 Implementation Spec

Status: Implementation contract for first release (V1)
Date: ${new Date().toISOString().split('T')[0]}
Audience: AI agents, human developers, project stakeholders
Source inputs: \`VISION.md\`, \`PRODUCT.md\`, \`knowledge/prod.md\`, task database

## 1. Document Role

\`VISION.md\` is the strategic north star.
\`PRODUCT.md\` is the product definition.
This document is the **concrete, build-ready V1 contract**.
When there is a conflict, \`SPEC.md\` controls V1 behavior.

## 2. V1 Outcomes

${project.name} V1 must provide:

1. User authentication and organization-scoped access control.
2. Core CRUD operations for all primary entities.
3. Real-time dashboard with key metrics.
4. Full audit trail for all mutations.
5. Role-based access with Row Level Security.
6. Responsive UI that works on desktop and mobile.

Success means a user can perform all core workflows end-to-end with clear visibility and control.

## 3. Explicit V1 Decisions

| Topic | V1 Decision |
|---|---|
| Tenancy | Multi-tenant, organization-scoped |
| Auth | Supabase Auth (email + social) |
| Database | PostgreSQL via Supabase |
| Frontend | React + TypeScript + Vite |
| State | TanStack Query (server state) |
| UI Library | shadcn/ui + Tailwind CSS |
| Deployment | Supabase hosted + static frontend |
| API | Supabase client SDK (no custom REST layer for V1) |

## 4. V1 Scope

### In Scope

${project.phases.map(p => `- ${p.name}: ${p.description}`).join('\n')}
- Authentication and authorization
- Organization management
- Audit logging for all mutations
- Responsive dashboard
- Data export (CSV)

### Out of Scope (V1)

- Native mobile app
- Offline mode
- Real-time collaboration (multi-user editing)
- Advanced analytics/BI
- Third-party integrations/webhooks
- Public API

## 5. Architecture

### Runtime Components

- \`src/\`: React application (pages, components, hooks, lib)
- \`supabase/functions/\`: Edge Functions (server-side logic)
- \`supabase/migrations/\`: Database schema and seeds

### Data Store

- Primary: PostgreSQL (Supabase hosted)
- Auth: Supabase Auth
- Storage: Supabase Storage (for file uploads)
- Cache: TanStack Query (client-side)

## 6. Data Model (V1)

All core tables include \`id\`, \`organization_id\`, \`created_at\`, \`updated_at\` unless noted.

### Common Column Pattern

\`\`\`sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
\`\`\`

### Row Level Security

Every table uses:
\`\`\`sql
ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;
CREATE POLICY "[table]_org_isolation" ON [table]
  FOR ALL USING (organization_id IN (SELECT get_user_org_ids()));
\`\`\`

## 7. State Machines

### Task Status

\`\`\`
pending → in_progress → completed
pending → blocked → pending (when unblocked)
in_progress → blocked → in_progress (when unblocked)
\`\`\`

Side effects:
- Entering \`in_progress\` sets \`started_at\` if null
- Entering \`completed\` sets \`completed_at\` and awards XP
- Entering \`blocked\` requires \`notes\` explaining the blocker

## 8. Delivery Plan

${tasksByPhase.map(({ phase, tasks }) => `### Phase ${phase.number}: ${phase.name}

${phase.description}

${tasks.length > 0 ? `Tasks: ${tasks.length} (${tasks.filter(t => t.status === 'completed').length} completed)` : 'Tasks defined in project_tasks table.'}`).join('\n\n')}

## 9. Acceptance Criteria (Release Gate)

V1 is complete only when all criteria are true:

1. All Phase 1 tasks are completed and verified.
2. Authentication flow works end-to-end (signup, login, logout, password reset).
3. All core CRUD operations function correctly with RLS enforcement.
4. Dashboard displays accurate metrics from live database.
5. Application builds without errors (\`tsc --noEmit && npm run build\`).
6. All routes are protected and redirect unauthenticated users.
7. Responsive design works on mobile viewports (375px+).

## 10. Post-V1 Backlog (Explicitly Deferred)

- Advanced search and filtering
- Bulk operations
- Real-time subscriptions for live updates
- Third-party integrations
- Advanced reporting/analytics
- Native mobile application
- Public API with API keys
`;
}
