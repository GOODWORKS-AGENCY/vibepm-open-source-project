import { Module } from '@/types/project';

/**
 * Tool file generators following the Tool Index Framework.
 * Four categories: Database (db/), API (api/), UI (ui/), Automation (automation/)
 * Universal action format: Input, Process, Output, Errors
 */

/**
 * Generates a DATABASE CRUD TOOL file.
 *
 * Accepts the owning Module so it can reference real actions and related entities
 * instead of producing identical generic schemas for every entity.
 */
export function generateDbTool(entity: string, moduleName: string, ownerModule?: Module): string {
  const entityLower = entity.toLowerCase().replace(/\s+/g, '_');
  const entityKebab = entity.toLowerCase().replace(/[\s_]+/g, '-');
  const moduleSlug = moduleName.toLowerCase().replace(/\s+/g, '-');

  // Filter module actions relevant to this entity
  const entityWord = entity.toLowerCase().split('_')[0];
  const relevantActions = ownerModule
    ? ownerModule.actions.filter(a =>
        a.toLowerCase().includes(entityWord) || ownerModule.actions.length <= 5
      ).slice(0, 6)
    : [];

  const actionList = relevantActions.length > 0
    ? relevantActions.join(', ')
    : `Create, Read, Update, Delete ${entity}`;

  // Related entities from the same module (for include[] / joins)
  const siblingEntities = ownerModule
    ? ownerModule.entities.filter(e => e !== entity)
    : [];

  const includeNote = siblingEntities.length > 0
    ? `Supports \`include[]\` for eager-loading related entities: ${siblingEntities.join(', ')}.`
    : '';

  // Determine if multi-tenant columns apply
  const hasOrgScope = true; // default true — templates produce org-scoped schemas

  return `# ${entity} CRUD Tool

## Metadata

- **Description**: CRUD operations for the \`${entityLower}\` table in the **${moduleName}** module.
- **Version**: 1.0.0
- **Category**: db
- **Module**: ${moduleName}
- **Triggers**: \`${entityLower}.created\`, \`${entityLower}.updated\`, \`${entityLower}.deleted\`
- **Related Skill**: [${moduleSlug}.skill.md](../skills/${moduleSlug}/${moduleSlug}.skill.md)

---

## Schema

> **Fill in entity-specific columns below.** The common columns (id, timestamps${hasOrgScope ? ', organization_id' : ''}) are always present. Add the columns that make this entity unique.

### ${entityLower}

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| \`id\` | \`uuid\` | NO | \`gen_random_uuid()\` | Primary key |
${hasOrgScope ? '| `organization_id` | `uuid` | NO | — | FK to organizations (tenant isolation) |\n' : ''}| \`created_at\` | \`timestamptz\` | NO | \`now()\` | Record creation timestamp |
| \`updated_at\` | \`timestamptz\` | NO | \`now()\` | Last update timestamp |

<!-- TODO: Add entity-specific columns from your actual schema.
     Example for a "tasks" entity:
     | \`title\` | \`text\` | NO | — | Task title |
     | \`status\` | \`text\` | NO | \`'pending'\` | pending, in_progress, completed, blocked |
     | \`phase\` | \`text\` | YES | — | Phase this task belongs to |
     | \`priority\` | \`integer\` | NO | \`50\` | 0-100 priority score |
-->

**Indexes**: \`idx_${entityLower}_id\`${hasOrgScope ? `, \`idx_${entityLower}_org_id\`` : ''}
${hasOrgScope ? `**RLS**: Enabled. Policy: \`organization_id = ANY(get_user_org_ids())\`` : ''}

---

## Core Actions

### create_${entityLower}

| Aspect | Details |
|--------|---------|
| **Input** | ${hasOrgScope ? '`organization_id` (required), ' : ''}Required fields per schema above. |
| **Process** | 1. Validate required fields. 2. Normalize input. 3. INSERT with defaults. 4. Emit \`${entityLower}.created\`. |
| **Output** | Complete ${entity} object with generated \`id\` and timestamps. |
| **Errors** | \`MISSING_REQUIRED\` — required field blank. \`DUPLICATE\` — uniqueness constraint violated. |

### get_${entityLower}

| Aspect | Details |
|--------|---------|
| **Input** | \`id\` (required)${hasOrgScope ? ', `organization_id` (required)' : ''}, \`include[]\` (optional). |
| **Process** | 1. SELECT by id${hasOrgScope ? ' scoped to org' : ''}. 2. Eager-load requested includes. 3. Return object or null. |
| **Output** | ${entity} object${siblingEntities.length > 0 ? ` with optional nested ${siblingEntities.slice(0, 2).join(', ')}` : ''}, or null if not found. |
| **Errors** | \`NOT_FOUND\`. \`FORBIDDEN\` — caller lacks read permission. |

### list_${entityLower}

| Aspect | Details |
|--------|---------|
| **Input** | ${hasOrgScope ? '`organization_id` (required), ' : ''}\`page\` (default 1), \`per_page\` (default 25, max 100), \`sort_by\`, \`sort_dir\`, \`filter\` object. |
| **Process** | 1. Apply${hasOrgScope ? ' org scope +' : ''} filters. 2. Sort + paginate. 3. Return with metadata. |
| **Output** | \`{ data: ${entity}[], total, page, per_page, has_more }\` |
| **Errors** | \`INVALID_FILTER\`. \`PAGINATION_LIMIT\`. |

### update_${entityLower}

| Aspect | Details |
|--------|---------|
| **Input** | \`id\` (required)${hasOrgScope ? ', `organization_id` (required)' : ''}, partial fields to update. |
| **Process** | 1. Fetch existing (fail if not found). 2. Validate changes. 3. Partial update, set \`updated_at\`. 4. Emit \`${entityLower}.updated\`. |
| **Output** | Updated ${entity} object. |
| **Errors** | \`NOT_FOUND\`. \`IMMUTABLE_FIELD\` — attempted to change \`id\`${hasOrgScope ? ' or `organization_id`' : ''}. |

### delete_${entityLower}

| Aspect | Details |
|--------|---------|
| **Input** | \`id\` (required)${hasOrgScope ? ', `organization_id` (required)' : ''}, \`hard_delete\` (boolean, default false). |
| **Process** | 1. Verify exists. 2. Check for dependents. 3. Soft-delete (archive) or hard-delete. |
| **Output** | \`{ deleted: true, mode: 'soft' | 'hard' }\` |
| **Errors** | \`NOT_FOUND\`. \`HAS_DEPENDENTS\`. |

---

## Module Context

- **Available actions in ${moduleName}**: ${actionList}
${includeNote ? `- ${includeNote}` : ''}
- **Skill file**: \`knowledge/skills/${moduleSlug}/${moduleSlug}.skill.md\`

---

## Edge Cases

- **Concurrent updates**: Use \`updated_at\` as optimistic lock. Return \`STALE_UPDATE\` if mismatch.
- **Orphaned records**: If parent is deleted, cascade status to 'archived' on children.
- **Empty required fields**: Return \`MISSING_REQUIRED\` — reject whitespace-only values.
`;
}

/**
 * Generates an API TOOL file.
 */
export function generateApiTool(functionName: string, description: string): string {
  const funcKebab = functionName.toLowerCase().replace(/\s+/g, '-');

  return `# ${functionName} API Tool

## Metadata

- **Description**: ${description}
- **Version**: 1.0.0
- **Category**: api
- **Edge Function**: \`${funcKebab}\`
- **Auth**: User session (JWT)
- **Triggers**: \`${funcKebab}.completed\`, \`${funcKebab}.failed\`

---

## Endpoint

| Field | Value |
|-------|-------|
| Method | \`POST\` |
| Path | \`/functions/v1/${funcKebab}\` |
| Content-Type | application/json |
| Rate Limit | 30 requests/minute per user |

---

## Core Actions

### ${funcKebab.replace(/-/g, '_')}

| Aspect | Details |
|--------|---------|
| **Input** | \`{ action: string, params: { ... } }\` |
| **Process** | 1. Validate auth + permissions. 2. Parse request body. 3. Execute logic. 4. Audit log. 5. Return response. |
| **Output** | \`{ success: true, data: { ... }, error: null }\` |
| **Errors** | \`AUTH_REQUIRED\`. \`RATE_LIMITED\`. \`INVALID_INPUT\`. \`FORBIDDEN\`. |

---

## Processing Pipeline

\`\`\`
Request → [Auth] → [Validate] → [Process] → [Audit] → Response
\`\`\`

---

## Integration Guidelines

- Pass JWT in Authorization header
- Retry with exponential backoff on 429/500
- Latency target: < 2s reads, < 5s writes
- Error envelope: \`{ success: false, data: null, error: { code, message } }\`
`;
}

/**
 * Generates a UI COMPONENT TOOL file.
 */
export function generateUiTool(componentName: string, moduleName: string): string {
  const componentKebab = componentName.toLowerCase().replace(/\s+/g, '-');
  const moduleSlug = moduleName.toLowerCase().replace(/\s+/g, '-');

  return `# ${componentName} UI Tool

## Metadata

- **Description**: UI component spec for ${componentName} in the ${moduleName} module.
- **Version**: 1.0.0
- **Category**: ui
- **Module**: ${moduleName}
- **Dependencies**: \`db/${moduleSlug}-crud\`, \`skills/${moduleSlug}/${moduleSlug}\`

---

## Layout

\`\`\`
┌─────────────────────────────────────┐
│  Header (title, actions, filters)   │
├─────────────────────────────────────┤
│  Content (table / cards / form)     │
│  - Loading skeleton when fetching   │
│  - Empty state when no data         │
│  - Error state with retry           │
├─────────────────────────────────────┤
│  Footer (pagination, summary)       │
└─────────────────────────────────────┘
\`\`\`

---

## States

| State | Visual | User Action |
|-------|--------|-------------|
| **Loading** | Skeleton shimmer | Wait |
| **Empty** | Illustration + Create button | Click create |
| **Error** | Error icon + Retry button | Click retry |
| **Data** | Table/cards with actions | Interact |

---

## Integration Guidelines

- Use TanStack Query with query key factory for data fetching
- Use \`react-hook-form\` + \`zod\` for form validation
- Follow component patterns in \`src/features/${moduleSlug}/components/\`
- Invalidate query keys on mutations
- All interactive elements need \`aria-label\` attributes
`;
}

/**
 * Generates an AUTOMATION TOOL file.
 */
export function generateAutomationTool(name: string, description: string): string {
  return `# ${name} Automation Tool

## Metadata

- **Description**: ${description}
- **Version**: 1.0.0
- **Category**: automation
- **Trigger**: Event-driven or scheduled
- **Max Depth**: 10 (prevents infinite recursion)
- **Timeout**: 30s per step, 5 minutes total

---

## Core Actions

### execute_pipeline

| Aspect | Details |
|--------|---------|
| **Input** | Trigger event payload, execution context. |
| **Process** | 1. Validate trigger. 2. Load config. 3. Execute steps. 4. Handle failures. 5. Log. 6. Emit completion. |
| **Output** | \`{ execution_id, status, steps_completed, duration_ms }\` |
| **Errors** | \`TRIGGER_INVALID\`. \`STEP_FAILED\`. \`TIMEOUT\`. \`DEPTH_EXCEEDED\`. |

---

## Safety & Limits

- **Recursion**: 10 levels max
- **Cycle detection**: Track visited entity IDs, abort if revisited
- **Idempotency**: Steps must be safe to retry
- **Audit**: Every execution logged with full context
`;
}

/**
 * Generates a MIGRATION TOOL file.
 */
export function generateMigrationTool(entityName: string): string {
  const entityLower = entityName.toLowerCase().replace(/\s+/g, '_');

  return `# ${entityName} Migration Tool

## Metadata
- **Category**: db/specialized
- **Type**: Migration
- **Description**: Schema migration spec for \`${entityLower}\`.

---

## Migration Template

\`\`\`sql
CREATE TABLE IF NOT EXISTS public.${entityLower} (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- entity-specific columns here
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_${entityLower}_org ON public.${entityLower}(organization_id);
ALTER TABLE public.${entityLower} ENABLE ROW LEVEL SECURITY;
\`\`\`

## Rules
- Migrations are forward-only and numbered sequentially
- Never modify existing migrations — create new ones
- Include RLS policies in the same migration as the table
- Add indexes on all FK columns
`;
}

/**
 * Generates a SEARCH/FILTER TOOL file.
 */
export function generateSearchFilterTool(entityName: string): string {
  const entityLower = entityName.toLowerCase().replace(/\s+/g, '_');

  return `# ${entityName} Search & Filter Tool

## Metadata
- **Category**: db/specialized
- **Type**: Search/Filter
- **Description**: Search and filtering spec for \`${entityLower}\`.

---

## Core Actions

### search_${entityLower}

| Aspect | Details |
|--------|---------|
| **Input** | \`query\` (text), \`filters\` (object), \`sort\`, \`pagination\` |
| **Process** | 1. Parse query. 2. Apply filters. 3. Score + rank. 4. Paginate. |
| **Output** | \`{ data: ${entityName}[], total, facets }\` |
| **Errors** | \`INVALID_QUERY\`. \`INVALID_FILTER\`. |

### Filter Operators
| Operator | SQL | Example |
|----------|-----|---------|
| \`eq\` | \`=\` | \`status eq 'active'\` |
| \`in\` | \`IN\` | \`status in ['active', 'pending']\` |
| \`contains\` | \`ILIKE\` | \`name contains 'search'\` |
| \`between\` | \`BETWEEN\` | \`created_at between ['2024-01-01', '2024-12-31']\` |
| \`overlaps\` | \`&&\` | \`tags overlaps ['urgent']\` |
`;
}

/**
 * Generates a FILE UPLOAD TOOL file.
 */
export function generateFileUploadTool(moduleName: string): string {
  const moduleSlug = moduleName.toLowerCase().replace(/\s+/g, '-');

  return `# ${moduleName} File Upload Tool

## Metadata
- **Category**: api/specialized
- **Type**: File Upload
- **Description**: File upload spec for the ${moduleName} module.

---

## Core Actions

### upload_file

| Aspect | Details |
|--------|---------|
| **Input** | \`file\` (binary), \`metadata\`, \`organization_id\` |
| **Process** | 1. Validate type. 2. Check size. 3. Generate path. 4. Upload to storage. 5. Create DB record. |
| **Output** | \`{ id, url, name, size, mime_type, created_at }\` |
| **Errors** | \`FILE_TOO_LARGE\`. \`INVALID_TYPE\`. \`STORAGE_ERROR\`. |

### Storage Path
\`\`\`
{org_id}/${moduleSlug}/{entity_id}/{timestamp}_{filename}
\`\`\`
`;
}

/**
 * Generates a REAL-TIME SUBSCRIPTION TOOL file.
 */
export function generateRealtimeTool(entityName: string): string {
  const entityLower = entityName.toLowerCase().replace(/\s+/g, '_');

  return `# ${entityName} Real-Time Subscription Tool

## Metadata
- **Category**: db/specialized
- **Type**: Real-Time Subscription
- **Description**: Real-time subscription spec for \`${entityLower}\`.

---

## Core Actions

### subscribe_${entityLower}

| Aspect | Details |
|--------|---------|
| **Input** | \`organization_id\`, \`filters\` (optional), \`event_types\` (INSERT, UPDATE, DELETE) |
| **Process** | 1. Establish Supabase Realtime channel. 2. Apply filters. 3. Listen for events. 4. Update TanStack Query cache. |
| **Output** | Event stream: \`{ eventType, new, old, timestamp }\` |
| **Errors** | \`CONNECTION_LOST\` — auto-reconnect. \`FILTER_INVALID\`. |

### Cleanup
- Unsubscribe on component unmount
- Single channel per table per component
- Invalidate query cache on events
`;
}

/**
 * Generates a BATCH OPERATION TOOL file.
 */
export function generateBatchTool(entityName: string): string {
  const entityLower = entityName.toLowerCase().replace(/\s+/g, '_');

  return `# ${entityName} Batch Operation Tool

## Metadata
- **Category**: db/specialized
- **Type**: Batch Operation
- **Description**: Batch processing spec for \`${entityLower}\`.

---

## Core Actions

### batch_create_${entityLower}

| Aspect | Details |
|--------|---------|
| **Input** | \`records[]\` (max 1000), \`organization_id\` |
| **Process** | Validate → chunk 100 → insert in txn → collect results → audit. |
| **Output** | \`{ created, failed, errors[] }\` |
| **Errors** | \`BATCH_TOO_LARGE\`. \`PARTIAL_FAILURE\`. |

### Processing Rules
- Chunk size: 100 records per transaction
- Partial failures don't rollback the whole batch
- Use ON CONFLICT for idempotent imports
- Max 5 batch operations per minute per user
`;
}

/**
 * Generates the TOOL INDEX (tools.md).
 */
export function generateToolIndex(
  dbTools: string[],
  apiTools: string[],
  uiTools: { name: string; module: string }[] = [],
  automationTools: { name: string; description: string }[] = []
): string {
  const dbRows = dbTools.map(t => {
    const kebab = t.toLowerCase().replace(/[\s_]+/g, '-');
    const snake = t.toLowerCase().replace(/\s+/g, '_');
    return `| ${t} CRUD | tools/db/${kebab}-crud.tool.md | Create, Read, Update, Delete, Search | ${snake} |`;
  }).join('\n');

  const apiRows = apiTools.map(t => {
    const kebab = t.toLowerCase().replace(/\s+/g, '-');
    return `| ${t} | tools/api/${kebab}.tool.md | ${kebab} | Yes (JWT) |`;
  }).join('\n');

  const uiRows = uiTools.map(t => {
    const kebab = t.name.toLowerCase().replace(/\s+/g, '-');
    return `| ${t.name} | tools/ui/${kebab}.tool.md | ${t.module} | UI component spec |`;
  }).join('\n');

  const autoRows = automationTools.map(t => {
    const kebab = t.name.toLowerCase().replace(/\s+/g, '-');
    return `| ${t.name} | tools/automation/${kebab}.tool.md | Event/Schedule | ${t.description} |`;
  }).join('\n');

  const total = dbTools.length + apiTools.length + uiTools.length + automationTools.length;

  return `# Tool Index

Auto-generated index of all tool files in the knowledge base.

## Database Tools (${dbTools.length})

| Tool | File | Key Operations | Primary Entity |
|------|------|----------------|----------------|
${dbRows || '| (none) | — | — | — |'}

## API Tools (${apiTools.length})

| Tool | File | Edge Function | Auth Required |
|------|------|---------------|---------------|
${apiRows || '| (none) | — | — | — |'}

## UI Tools (${uiTools.length})

| Tool | File | Module | Description |
|------|------|--------|-------------|
${uiRows || '| (none) | — | — | — |'}

## Automation Tools (${automationTools.length})

| Tool | File | Trigger | Description |
|------|------|---------|-------------|
${autoRows || '| (none) | — | — | — |'}

**Total: ${total} tool files** (${dbTools.length} DB + ${apiTools.length} API + ${uiTools.length} UI + ${automationTools.length} automation)
`;
}
