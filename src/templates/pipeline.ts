import { Project } from '@/types/project';

/**
 * Master Pipeline reference — the keystone document showing
 * how every system connects across the 25-step, 4-phase pipeline.
 */
export function generatePipelineReference(projectName: string): string {
  return `# ${projectName} — Master Pipeline Reference

> This is the keystone document. It shows how every system in the AI development
> framework connects — from raw vision documents through knowledge files, agent
> instructions, task database, and the agent session protocol.

## The Four Phases

| Phase | Name | When | Frequency | Output |
|-------|------|------|-----------|--------|
| **A** | Knowledge Creation | Project start | Once (then maintained) | Knowledge files, indexes, prod.md, PRD.json |
| **B** | Project Infrastructure | Project start | Once | CLAUDE.md, rules, task DB, tracker UI, app scaffold |
| **C** | Per-Phase Lifecycle | Each development phase | 7-18 times per project | Phase plan, task migration, knowledge updates |
| **D** | Agent Session Protocol | Every work session | 100-500+ times per project | Features built, tasks completed, code verified |

## The 25-Step Pipeline

\`\`\`
PHASE A: KNOWLEDGE CREATION (one-time, project start)
──────────────────────────────────────────────────────
Step 1   Raw Vision Documents → Brain dumps, feature lists, entity descriptions
Step 2   Consolidation → Architecture Spec + Domain Encyclopedia
Step 3   Knowledge File Generation (Skills → Tools → Workflows) ORDER MATTERS
Step 4   Index Generation → skills.md, tools.md, workflows.md
Step 5   Master Reference → prod.md (under 700 lines)
Step 6   Dependency Graph → PRD.json

PHASE B: PROJECT INFRASTRUCTURE (one-time)
──────────────────────────────────────────
Step 7   Agent Instructions → CLAUDE.md + AGENTS.md
Step 8   Convention Rules → .claude/rules/*.md
Step 9   Task Database Schema → project_tasks + project_levels
Step 10  Task Seeding → SQL migration with wat_references
Step 11  Project Tracker UI → /project-tracker dashboard
Step 12  Application Scaffolding → Project setup

PHASE C: PER-PHASE LIFECYCLE (repeated 7-18 times)
──────────────────────────────────────────────────
Step 13  Define Phase Tasks → .claude/plans/*.md
Step 14  Create Task Migration → SQL INSERT with wat_references
Step 15  Push Migration → npx supabase db push
Step 16  Update Tracker UI → Add phase to dropdown
Step 17  Create Knowledge Files (if needed)
Step 18  Work the Tasks → Agents pick up and build
Step 19  Completion Migration → Mark phase done

PHASE D: AGENT SESSION PROTOCOL (repeated 100-500+ times)
─────────────────────────────────────────────────────────
Step 20  Agent Starts → CLAUDE.md Auto-Loaded
Step 21  Query Next Task → SELECT by priority, mark in_progress
Step 22  Load Knowledge → Read wat_references files
Step 23  Build Feature → Follow conventions
Step 24  Verify → tsc --noEmit, build, tests
Step 25  Mark Complete → UPDATE status, earn XP, next task
\`\`\`

## The wat_references Bridge

The \`wat_references\` column in \`project_tasks\` is the critical bridge between
the task execution system and the knowledge base:

\`\`\`
task_code: 'P2-04'
wat_references: [
  'knowledge/skills/members/members.skill.md',
  'knowledge/workflows/members/new-member-welcome.workflow.md'
]

Agent picks up P2-04:
  1. Reads wat_references array
  2. Loads skill file → learns entity schemas, available actions
  3. Loads workflow file → learns the process steps
  4. Now has all domain context needed to build the feature
\`\`\`

## Context Priority (when information conflicts)

1. .claude/rules/*.md       ← HIGHEST (coding conventions override everything)
2. CLAUDE.md                ← Project structure and task protocol
3. Skill file               ← Domain knowledge
4. Tool file                ← Implementation spec
5. Workflow file             ← Process definition
6. prod.md                  ← Summary (cross-module context only)

## Key Principle
Each step's output is the next step's input. The wat_references array is the
bridge between the task database and the knowledge base.
`;
}
