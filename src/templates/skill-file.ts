import { Module } from '@/types/project';

/**
 * Generates a MODULE SKILL file that uses actual module data.
 * Skills answer WHAT — domain knowledge, entities, actions, rules.
 * For HOW (schemas, CRUD specs), skills point to tool files.
 */
export function generateSkillFile(module: Module): string {
  const moduleSlug = module.name.toLowerCase().replace(/\s+/g, '-');

  const actionRows = module.actions
    .map(a => `| \`${a.toLowerCase().replace(/\s+/g, '_')}\` | ${a} | \`${moduleSlug}:write\` |`)
    .join('\n');

  const entityList = module.entities.length > 0
    ? module.entities.map(e => {
        const eSlug = e.toLowerCase().replace(/[\s_]+/g, '-');
        return `#### ${e}

This module owns the **${e}** entity. For the full column-level schema and CRUD operations, see [\`tools/db/${eSlug}-crud.tool.md\`](../tools/db/${eSlug}-crud.tool.md).

**Key operations**: ${module.actions.filter(a => a.toLowerCase().includes(e.toLowerCase().split('_')[0]) || module.actions.length <= 5).slice(0, 4).join(', ') || module.actions.slice(0, 3).join(', ')}`;
      }).join('\n\n')
    : '_No database entities owned by this module._';

  const relatedRefs = module.relatedModules.length > 0
    ? module.relatedModules
        .map(m => `- [\`${m.toLowerCase().replace(/\s+/g, '-')}\`](../${m.toLowerCase().replace(/\s+/g, '-')}/${m.toLowerCase().replace(/\s+/g, '-')}.skill.md) — ${m}`)
        .join('\n')
    : '- None';

  return `# ${module.name} — Module Skill

> **${module.description}**

## Metadata

| Field | Value |
|-------|-------|
| Module | ${module.name} |
| Route | \`${module.route}\` |
| Entities | ${module.entities.join(', ') || 'None'} |
| Related Modules | ${module.relatedModules.join(', ') || 'None'} |

---

## Purpose

${module.description}

${module.relatedModules.length > 0 ? `This module integrates with **${module.relatedModules.join('**, **')}** through shared entities and navigation.` : 'This is a standalone module.'}

---

## Available Actions

| Action | Description | Permission |
|--------|-------------|------------|
${actionRows || '| — | No actions defined | — |'}

---

## Entities

${entityList}

---

## Business Rules

1. **Follow existing patterns.** New code in this module must follow the conventions established by existing files in the same directory.
2. **Validate at boundaries.** All user input must be validated before processing — use the project's validation library.
3. **Handle all states.** UI components must handle loading, error, empty, and data states.
4. **Respect dependencies.** Check task dependencies before starting work — blocked tasks cannot proceed.

---

## Related Skills

${relatedRefs}
`;
}

/**
 * Generates a SHARED SKILL file for cross-cutting concerns.
 */
export function generateSharedSkillFile(name: string, description: string): string {
  const nameSlug = name.toLowerCase().replace(/\s+/g, '-');

  return `# ${name} — Shared Skill

> **${description}**

## Metadata

| Field | Value |
|-------|-------|
| Skill ID | \`shared/${nameSlug}\` |
| Category | Shared (cross-cutting) |
| Applies To | All modules |

---

## Overview

${description}

This is a cross-cutting concern. Every agent working on any module should be aware of these patterns and apply them consistently.

---

## When to Load This Skill

- Any task whose title or description mentions "${name.toLowerCase()}"
- Any task that creates, modifies, or deletes data related to ${name.toLowerCase()}
- Infrastructure tasks that touch ${name.toLowerCase()} configuration

---

## Key Rules

1. **${name} is non-negotiable.** All relevant operations must comply with ${name.toLowerCase()} requirements.
2. **Consistency across modules.** ${name} patterns must be applied the same way in every module — no one-off implementations.
3. **Document exceptions.** Any bypass of ${name.toLowerCase()} rules must be documented with a reason and approved.

---

## Related Skills

- Other shared skills that interact with ${name.toLowerCase()}
`;
}

/**
 * Generates an AI AGENT SKILL file for in-app AI agents.
 */
export function generateAgentSkillFile(
  agentName: string,
  agentRole: string,
  capabilities: string[],
  modulesAccessed: string[]
): string {
  const agentSlug = agentName.toLowerCase().replace(/\s+/g, '-');

  return `# ${agentName} — AI Agent Skill

> **${agentRole}**

## Metadata

| Field | Value |
|-------|-------|
| Agent | ${agentName} |
| Role | ${agentRole} |
| Capabilities | ${capabilities.join(', ')} |
| Modules Accessed | ${modulesAccessed.join(', ')} |

---

## Purpose

${agentRole}

This agent operates within the application, interacting with users through the UI. It has scoped access to specific modules and data.

---

## Capabilities

${capabilities.map((c, i) => `${i + 1}. **${c}**`).join('\n')}

---

## Modules Accessed

${modulesAccessed.map(m => `- **${m}** — Read access to ${m} domain knowledge`).join('\n')}

---

## Safety Rules

1. **Scoped access.** Agent can only access data the current user has permission to see.
2. **No destructive actions without confirmation.** Deletions, bulk updates, and permission changes require explicit user confirmation.
3. **Audit all actions.** Every AI agent action is logged.
4. **Escalate when uncertain.** Agent asks for clarification rather than guessing.

---

## Related Skills

${modulesAccessed.map(m => `- \`${m.toLowerCase().replace(/\s+/g, '-')}/${m.toLowerCase().replace(/\s+/g, '-')}\` — Domain knowledge`).join('\n')}
`;
}

/**
 * Generates the SKILL INDEX (skills.md).
 */
export function generateSkillIndex(
  modules: Module[],
  agentSkills: { name: string; role: string }[] = [],
  sharedConcerns: string[] = []
): string {
  const sharedRows = sharedConcerns.length > 0
    ? sharedConcerns.map(c => {
        const slug = c.toLowerCase().replace(/\s+/g, '-');
        return `| ${c} | skills/shared/${slug}.skill.md | Cross-cutting: ${c.toLowerCase()} | Working on ${c.toLowerCase()}-related features |`;
      }).join('\n')
    : `| Authentication | skills/shared/auth.skill.md | Permission model, route guards | Working on auth features |
| Audit Logging | skills/shared/audit.skill.md | Activity logging | Any create/update/delete |
| Multi-Tenancy | skills/shared/multi-tenancy.skill.md | Data isolation | Any data operation |`;

  const moduleRows = modules.map((m, i) => {
    const slug = m.name.toLowerCase().replace(/\s+/g, '-');
    return `| ${i + 1} | ${m.name} | skills/${slug}/${slug}.skill.md | ${m.entities.slice(0, 3).join(', ') || '—'} | ${m.actions.slice(0, 3).join(', ') || '—'} |`;
  }).join('\n');

  const agentRows = agentSkills.map(a => {
    const slug = a.name.toLowerCase().replace(/\s+/g, '-');
    return `| ${a.name} | skills/agents/${slug}.skill.md | ${a.role} | AI agent tasks |`;
  }).join('\n');

  const sharedCount = sharedConcerns.length || 3;
  const total = sharedCount + modules.length + agentSkills.length;

  return `# Skill Index

Auto-generated index of all skill files in the knowledge base.
Agents read this first, then load specific skill files via \`wat_references[]\`.

## Shared Skills (${sharedCount})

| Skill | File | Description | Triggers |
|-------|------|-------------|----------|
${sharedRows}

## Module Skills (${modules.length})

| # | Module | File | Key Entities | Available Actions |
|---|--------|------|-------------|-------------------|
${moduleRows || '| 1 | (none) | — | — | — |'}

## AI Agent Skills (${agentSkills.length})

| Agent | File | Role | Triggers |
|-------|------|------|----------|
${agentRows || '| (none) | — | — | — |'}

**Total: ${total} skill files** (${sharedCount} shared + ${modules.length} modules + ${agentSkills.length} agents)
`;
}
