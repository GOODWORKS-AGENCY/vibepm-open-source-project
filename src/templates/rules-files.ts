import { Project } from '@/types/project';

/**
 * Generates the complete rules files (.claude/rules/*.md) following the framework.
 * Files: code-style.md, database.md, architecture.md, task-process.md, testing.md
 */

export function generateCodeStyleRules(stack: { framework: string; language: string }): string {
  return `# Code Style Conventions

## ${stack.language}
- Strict mode, no \`any\` types — use \`unknown\` and narrow with type guards
- \`interface\` for object shapes, \`type\` for unions/intersections
- Prefer \`const\` over \`let\`, never use \`var\`
- Use early returns to reduce nesting
- Maximum function length: 50 lines (extract helpers)

## Naming
- **Components**: PascalCase, one per file (\`UserProfile.tsx\`)
- **Hooks**: camelCase with \`use\` prefix (\`useProjectTasks.ts\`)
- **Utilities**: camelCase (\`formatDate.ts\`)
- **Types/Interfaces**: PascalCase (\`ProjectTask\`)
- **Constants**: UPPER_SNAKE_CASE (\`MAX_RETRIES\`)
- **Database columns**: snake_case (\`created_at\`)

## Imports
- Use \`@/\` path alias for absolute imports
- Group: external libs → internal modules → components → types
- No circular dependencies

## Components
- One component per file
- Co-locate tests with source files
- Group by feature/module, not by type
- Index files only for public API re-exports

## Formatting
- Prettier handles formatting — don't manually align code
- 100 character line limit
`;
}

export function generateDatabaseRules(): string {
  return `# Database Conventions

## Common Columns (every org-scoped table)
\`\`\`sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
\`\`\`

## Naming
- Tables: plural snake_case (\`project_tasks\`)
- Columns: snake_case (\`task_code\`)
- Indexes: \`idx_{table}_{column}\`
- Policies: descriptive (\`"Users can read own data"\`)
- Foreign keys: \`fk_{table}_{referenced_table}\`

## Security
- RLS enabled on every table — no exceptions
- Default deny — explicitly grant access
- All queries scoped by \`organization_id\`
- Use \`auth.uid()\` for user-scoped queries
- Use security definer functions for role checks
- Audit triggers on all mutable tables

## Migrations
- Forward-only, numbered sequentially
- NEVER modify existing migrations — create new ones
- Each migration is self-contained
- Include rollback comments
- Seed data in separate migrations
- Use ON CONFLICT DO UPDATE for idempotent seeding

## Query Patterns
- Always scope by organization_id
- Default pagination: page 1, 25 per page
- Always specify column list (never SELECT *)
- Add indexes on foreign key columns and frequently filtered fields
`;
}

export function generateArchitectureRules(): string {
  return `# Architecture Rules

## Feature-First Organization
\`\`\`
src/features/[module]/
├── hooks/          # Data fetching + mutations
├── api/            # API layer
├── components/     # Module-specific UI
└── types.ts        # Module types
\`\`\`

## Data Flow
1. UI Component → Hook → API → Database
2. Never call Supabase directly from components
3. All server state through TanStack Query with query key factory
4. Mutations invalidate related queries
5. Optimistic updates only for low-risk, high-frequency actions

## Component Patterns
- Container components fetch data via hooks
- Presentational components receive props
- Use composition over inheritance
- Keep components under 200 lines

## Routing
- Lazy-loaded via React.lazy() + Suspense
- Route guards for auth, roles, permissions
- Consistent URL patterns: /module, /module/:id, /module/:id/edit

## Error Handling
- Try/catch at API boundaries
- Toast notifications for user-facing errors
- Structured error logging
- Graceful fallbacks in UI (loading, error, empty states)
`;
}

export function generateTaskProcessRules(): string {
  return `# Task Management Process

## Task Protocol (Every Work Session)

### Before Starting Work
\`\`\`sql
-- Find next task
SELECT task_code, title, priority, dependencies, wat_references
FROM project_tasks
WHERE status = 'pending'
ORDER BY priority DESC
LIMIT 1;

-- Mark it in_progress
UPDATE project_tasks
SET status = 'in_progress', started_at = now()
WHERE task_code = 'PXX-YY';
\`\`\`

### After Completing Work
\`\`\`sql
UPDATE project_tasks
SET status = 'completed', progress_pct = 100, completed_at = now()
WHERE task_code = 'PXX-YY';
\`\`\`

### If Blocked
\`\`\`sql
UPDATE project_tasks
SET status = 'blocked', notes = 'Reason for blocker'
WHERE task_code = 'PXX-YY';
\`\`\`

### Always Verify After Changes
\`\`\`bash
npx tsc --noEmit     # Zero type errors
npx vite build       # Clean build
\`\`\`

## Adding a New Phase (7 Steps)
1. Create plan file in \`.claude/plans/\` with task table
2. Create seed migration: \`supabase/migrations/000XX_phaseN.sql\`
3. Push migration: \`npx supabase db push\`
4. Update tracker UI: add phase to PHASES array
5. Create knowledge files if tasks need new domain docs
6. Work tasks in priority order, respecting dependencies
7. Create completion migration when all tasks done

## Knowledge File Rules
| Task Type | Knowledge Files Needed |
|-----------|----------------------|
| New module | Skill file + DB tool files + workflow files |
| New entity | DB tool file |
| New edge function | API tool file |
| New business process | Workflow file |
| UI-only / refactoring / bugs | None |

**Rule**: If a task's \`wat_references\` array is empty, no knowledge file is needed.
`;
}

export function generateTestingRules(): string {
  return `# Testing Conventions

## What to Test
- Business rule enforcement
- Permission boundary checks
- Data transformation accuracy
- Edge cases from tool specs
- RLS policy enforcement

## What NOT to Test
- UI library rendering (shadcn/ui, Radix)
- Client initialization
- Static config objects
- Generated types

## Test Naming
- Files: \`*.test.ts\` or \`*.test.tsx\` co-located with source
- Describe blocks: Module or function name
- Test names: "should [expected behavior] when [condition]"

## Commands
- Run all: \`npm run test\`
- Run one file: \`npx vitest run path/to/file.test.ts\`
- Watch mode: \`npx vitest\`
`;
}
