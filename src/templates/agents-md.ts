import { Project } from '@/types/project';

/**
 * Generates an AGENTS.md file for secondary AI agents (Codex, Cursor, Copilot).
 * Lives at repo root so any tool can find it.
 *
 * Key differences from CLAUDE.md:
 * | | CLAUDE.md | AGENTS.md |
 * |---|-----------|-----------|
 * | Location | .claude/CLAUDE.md | Repo root AGENTS.md |
 * | Read by | Claude Code | Codex, Cursor, Copilot, etc. |
 * | Scope | Full project context | Agent-specific context |
 * | Task filter | All tasks or assigned_to = 'agent-1' | assigned_to = 'agent-2' only |
 * | Detail level | High-level conventions + knowledge loading | Specific conventions for that agent's work |
 */
export function generateAgentsMd(
  project: Project,
  agentName: string = 'Codex',
  agentId: string = 'agent-2',
  specialization: string = 'Database migrations, RLS, audit triggers, boilerplate CRUD, placeholder pages'
): string {
  const moduleCount = project.knowledgeFiles.filter(f => f.type === 'skill').length || project.phases.length;

  return `# ${project.name} — ${agentName} Instructions

## What Is This Project?
${project.description}

## Your Role (${agentName})
You are one of 2 AI agents building this platform:
- **Agent-1 (Claude Code)**: Architecture, complex UI, hooks/API, AI agents, testing, workflows
- **${agentName} (${agentId})**: ${specialization}

You specialize in **${specialization}**.

## Task Tracking Protocol
**CRITICAL — Follow this before and after every task:**

1. **Before starting**: Query for your next task:
   \`\`\`sql
   SELECT task_code, title, priority, dependencies, wat_references
   FROM project_tasks
   WHERE status = 'pending' AND assigned_to = '${agentId}'
   ORDER BY priority DESC LIMIT 1;
   \`\`\`

2. **Mark in_progress**:
   \`\`\`sql
   UPDATE project_tasks SET status = 'in_progress', started_at = now()
   WHERE task_code = 'PXX-YY';
   \`\`\`

3. **Mark completed**:
   \`\`\`sql
   UPDATE project_tasks SET status = 'completed', progress_pct = 100,
     completed_at = now() WHERE task_code = 'PXX-YY';
   \`\`\`

4. **If blocked**:
   \`\`\`sql
   UPDATE project_tasks SET status = 'blocked', notes = 'Reason'
   WHERE task_code = 'PXX-YY';
   \`\`\`

## Database Connection
- **Push**: \`npx supabase db push\`
- **Gen types**: \`npx supabase gen types typescript --project-id <ref> > src/types/database.types.ts\`

## Knowledge Base
Before working on any task, **read the referenced knowledge files**:
- \`knowledge/skills/[module]/[module].skill.md\` — domain overview
- \`knowledge/tools/db/[entity]-crud.tool.md\` — schema specs
- \`knowledge/workflows/[module]/[workflow].workflow.md\` — process context
- \`.claude/rules/database.md\` — naming and RLS patterns

### Loading by task type:
- **Working on a specific module**: Load \`knowledge/skills/[module]/[module].skill.md\`
- **Implementing CRUD**: Load \`knowledge/tools/db/[entity]-crud.tool.md\`
- **Building an edge function**: Load \`knowledge/tools/api/[function-name].tool.md\`
- **Implementing a workflow**: Load \`knowledge/workflows/[module]/[workflow].workflow.md\`
- **Cross-cutting concerns**: Load \`knowledge/skills/shared/[topic].skill.md\`

## Database Conventions

### Common Columns (every org-scoped table)
\`\`\`sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
\`\`\`

### RLS Pattern
\`\`\`sql
ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;
CREATE POLICY "[table]_select" ON [table]
  FOR SELECT USING (organization_id IN (SELECT get_user_org_ids()));
-- INSERT, UPDATE, DELETE follow same pattern
\`\`\`

### Naming
- Tables: snake_case, plural (\`project_tasks\`)
- Columns: snake_case (\`task_code\`)
- Indexes: \`idx_{table}_{column}\`
- Policies: descriptive (\`"Users can read own data"\`)

### Migrations
- Forward-only, numbered sequentially
- NEVER modify existing migrations — create new ones
- Each migration is self-contained

## Task Completion Checklist
For each task:
1. Read referenced knowledge files
2. Do the work
3. Verify: \`npx tsc --noEmit && npm run build\`
4. Update task status
5. Move to next task
`;
}
