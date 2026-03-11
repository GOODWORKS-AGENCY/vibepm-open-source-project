import { Project, Module } from '@/types/project';

/**
 * Generates the Master Knowledge Base (prod.md).
 * Structure: Part 1 (Platform Overview) + Parts 2-N (Module Entries) +
 * Cross-Module Workflow Families + Database Schema Overview + Reference Tables.
 * Target: under 700 lines for LLM context window.
 */
export function generateProdMd(project: Project, modules: Module[]): string {
  // --- Module entries (compact, real data) ---
  const moduleEntries = modules.map((m, i) => {
    const slug = m.name.toLowerCase().replace(/\s+/g, '-');
    const knowledgeRefs = [
      `skills/${slug}/${slug}.skill.md`,
      ...m.entities.slice(0, 2).map(e => {
        const eSlug = e.toLowerCase().replace(/[\s_]+/g, '-');
        return `tools/db/${eSlug}-crud.tool.md`;
      }),
    ].join(', ');

    return `## Part ${i + 2}: ${m.name}
- **Purpose**: ${m.description}
- **Route**: ${m.route} | **Shell**: full | **Group**: Core
- **Key Entities**: ${m.entities.join(', ') || 'None'}
- **Actions**: ${m.actions.join(', ') || 'None'}
- **Cascade Triggers**: ${m.entities[0] || 'Entity'} created → update counters; ${m.entities[0] || 'Entity'} updated → recalculate aggregates
- **Related Modules**: ${m.relatedModules.join(', ') || 'None'}
- **Knowledge**: ${knowledgeRefs}`;
  }).join('\n\n');

  // --- Module map rows (use actual routes) ---
  const moduleMapRows = modules.map((m, i) =>
    `| ${i + 1} | ${m.name} | ${m.route} | full | Core | ${m.name} |`
  ).join('\n');

  // --- Architecture section from project stack ---
  const stack = project.stack;

  // Only mention multi-tenancy if backend is Supabase or similar server DB
  const hasServerDb = /supabase|postgres|firebase|prisma/i.test(stack.backend);

  // --- Deduplicate entities across modules ---
  const entitySet = new Map<string, string>();
  for (const m of modules) {
    for (const e of m.entities) {
      const key = e.toLowerCase().replace(/\s+/g, '_');
      if (!entitySet.has(key)) {
        entitySet.set(key, m.name);
      }
    }
  }
  const columnList = hasServerDb
    ? 'id, organization_id, name, status, created_at, updated_at'
    : 'id, name, status, created_at, updated_at';
  const schemaEntries = Array.from(entitySet.entries())
    .map(([entity, moduleName]) =>
      `- \`${entity}\` — ${moduleName} entity (${columnList})`
    ).join('\n');

  // --- Accurate knowledge file counts ---
  const uniqueEntityCount = entitySet.size;
  const apiToolCount = modules.length;
  const workflowCount = modules.length + (modules.length >= 2 ? 2 : 0);
  const sharedSkillCount = 3; // default shared concerns

  const archLines = [
    `- **Stack**: ${stack.framework} + ${stack.language} + ${stack.buildTool}, ${stack.stateManagement || 'TanStack Query'}, ${stack.ui}, ${stack.backend}`,
  ];
  if (hasServerDb) {
    archLines.push(`- **Multi-tenant**: organization_id on every row, RLS enforced at database level`);
  }

  archLines.push(
    `- **Data flow**: ${stack.stateManagement || 'TanStack Query'} for server state, query key factory pattern`,
    `- **Feature-first**: Code organized by domain (features/[module]/hooks/, features/[module]/api/)`,
  );

  return `# ${project.name} — Master Knowledge Base

## Part 1: Platform Overview

### Mission

${project.name} is a platform that ${project.description}. It provides a comprehensive solution for managing ${modules.map(m => m.name.toLowerCase()).join(', ')}.

### Architecture

${archLines.join('\n')}

### Module Map (${modules.length} Modules)

| # | Module | Route | Shell | Group | Default Label |
|---|--------|-------|-------|-------|---------------|
${moduleMapRows || '| 1 | (none) | — | — | — | — |'}

### Permission Model

1. **Route guards**: ProtectedRoute components wrap protected pages
2. **Auth**: ${hasServerDb ? 'Supabase Auth with JWT sessions' : 'Application-level auth'}
${hasServerDb ? '3. **RLS policies**: Database-level enforcement via organization_id' : '3. **Role checks**: Application-level role verification'}

${moduleEntries}

## Part ${modules.length + 2}: Cross-Module Workflow Families

### 1. CRUD Pipeline
All Modules
- Create → Validate → Store → Cascade → Notify → Audit

### 2. Status Lifecycle
All Modules
- Pending → Active → Completed (with blocked branch)

### 3. Data Export
All Modules → Analytics
- Query → Transform → Package → Download

## Part ${modules.length + 3}: Database Schema Overview

### Core Tables
${schemaEntries || '- (no entities defined yet)'}

### Common Column Pattern

\`\`\`sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
${hasServerDb ? 'organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,\n' : ''}created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
\`\`\`

## Part ${modules.length + 4}: Knowledge File Reference

| Category | Count | Location | Pattern |
|----------|-------|----------|---------|
| Shared Skills | ${sharedSkillCount} | knowledge/skills/shared/ | *.skill.md |
| Module Skills | ${modules.length} | knowledge/skills/[module]/ | *.skill.md |
| DB Tools | ${uniqueEntityCount} | knowledge/tools/db/ | *-crud.tool.md |
| API Tools | ${apiToolCount} | knowledge/tools/api/ | *.tool.md |
| UI Tools | ${modules.length} | knowledge/tools/ui/ | *.tool.md |
| Workflows | ${workflowCount} | knowledge/workflows/ | *.workflow.md |
| **Total** | **${sharedSkillCount + modules.length + uniqueEntityCount + apiToolCount + modules.length + workflowCount}** | | |
`;
}
