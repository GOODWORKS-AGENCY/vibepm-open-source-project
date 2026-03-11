/**
 * Dogfood script: Run VibePM's engine on its own codebase.
 *
 * Usage: npx vite-node scripts/generate-self.ts
 *
 * Generates the full AI-Driven Development Framework for VibePM itself,
 * writing all output files into .claude/, knowledge/, and other engine paths.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { generateConfigFromTemplates } from '@/lib/generate-from-templates';
import type { AnalysisResult, GeneratedTask } from '@/lib/ai-generate';

// =============================================================================
// VibePM ANALYSIS — hand-crafted from reading the actual codebase
// =============================================================================

const analysis: AnalysisResult = {
  projectName: 'VibePM',
  description:
    'AI-powered project scaffolding tool that takes a brain dump of project ideas, analyzes them via AI, and generates a complete AI-Driven Development Framework: tasks, knowledge files (WAT: Workflows, Agents, Tools), config files, CLAUDE.md templates, and database migrations. Output is exported as a ZIP. Projects are stored in localStorage with gamification (XP/levels).',
  stack: {
    framework: 'React 18',
    language: 'TypeScript',
    buildTool: 'Vite (SWC)',
    backend: 'Supabase (auth + edge functions)',
    ui: 'shadcn/ui + Tailwind CSS + Framer Motion',
    stateManagement: 'TanStack Query + localStorage',
    forms: 'react-hook-form',
    validation: 'zod',
  },
  entities: [
    'projects',
    'tasks',
    'phases',
    'knowledge_files',
    'generated_files',
    'brain_dump_entries',
    'modules',
    'project_levels',
  ],
  sharedConcerns: ['auth', 'local-storage', 'ai-generation', 'file-export', 'gamification'],
  modules: [
    {
      name: 'Project Wizard',
      description: '4-step wizard: brain dump → AI analysis → task/knowledge generation → review & save',
      route: '/new',
      entities: ['projects', 'brain_dump_entries', 'tasks', 'knowledge_files', 'generated_files'],
      actions: [
        'Create brain dump sections',
        'Upload reference files',
        'Analyze project via AI',
        'Generate tasks via AI',
        'Generate framework via templates',
        'Review and save project',
      ],
      relatedModules: ['Project Dashboard', 'Project Export'],
    },
    {
      name: 'Project Dashboard',
      description: 'Project overview with nested routes for tasks, knowledge files, and export',
      route: '/projects/:id',
      entities: ['projects', 'tasks', 'phases'],
      actions: [
        'View project overview',
        'Navigate to tasks tab',
        'Navigate to knowledge tab',
        'Navigate to export tab',
        'View XP and level progress',
      ],
      relatedModules: ['Project Wizard', 'Project Tasks', 'Knowledge Viewer', 'Project Export'],
    },
    {
      name: 'Project Tasks',
      description: 'Task management within a project — view, filter, update status, track progress',
      route: '/projects/:id/tasks',
      entities: ['tasks', 'phases'],
      actions: [
        'List tasks by phase',
        'Filter tasks by status',
        'Update task status',
        'View task dependencies',
        'View wat_references',
      ],
      relatedModules: ['Project Dashboard', 'Knowledge Viewer'],
    },
    {
      name: 'Knowledge Viewer',
      description: 'Browse and preview generated knowledge files (skills, tools, workflows)',
      route: '/projects/:id/knowledge',
      entities: ['knowledge_files'],
      actions: [
        'Browse knowledge file tree',
        'Preview file content',
        'Filter by type (skill/tool/workflow)',
      ],
      relatedModules: ['Project Dashboard', 'Project Tasks'],
    },
    {
      name: 'Project Export',
      description: 'File browser with preview and ZIP download of all generated framework files',
      route: '/projects/:id/export',
      entities: ['generated_files'],
      actions: [
        'Browse generated files',
        'Preview file content',
        'Download ZIP archive',
      ],
      relatedModules: ['Project Dashboard'],
    },
    {
      name: 'Project List',
      description: 'Overview of all saved projects with XP/level badges and quick actions',
      route: '/projects',
      entities: ['projects'],
      actions: [
        'List all projects',
        'Delete project',
        'Navigate to project dashboard',
        'View project stats',
      ],
      relatedModules: ['Project Dashboard', 'Project Wizard'],
    },
    {
      name: 'Project Tracker',
      description: 'Cross-project task tracker with phase filtering and progress visualization',
      route: '/project-tracker',
      entities: ['tasks', 'phases', 'project_levels'],
      actions: [
        'View all tasks across projects',
        'Filter by phase',
        'Filter by status',
        'Track XP progress',
      ],
      relatedModules: ['Project Tasks'],
    },
    {
      name: 'Framework Docs',
      description: 'Public documentation pages explaining the WAT framework, pipeline, and templates',
      route: '/framework',
      entities: [],
      actions: [
        'View framework overview',
        'Browse template documentation',
        'View pipeline reference',
      ],
      relatedModules: [],
    },
    {
      name: 'Template Engine',
      description: 'Deterministic file generators: skills, tools, workflows, CLAUDE.md, rules, task seed SQL, tracker UI, strategic docs',
      route: '',
      entities: ['modules', 'tasks', 'knowledge_files', 'generated_files'],
      actions: [
        'Generate CLAUDE.md',
        'Generate rules files',
        'Generate skill files',
        'Generate tool files',
        'Generate workflow files',
        'Generate task seed SQL',
        'Generate tracker UI code',
        'Generate strategic docs',
        'Reconcile wat_references',
      ],
      relatedModules: ['Project Wizard', 'Project Export'],
    },
  ],
  phases: [
    { number: 1, name: 'Foundation', description: 'Project setup, auth, routing, localStorage store, Supabase client, base UI components' },
    { number: 2, name: 'Core Wizard', description: 'Brain dump UI, AI analysis integration, task generation, knowledge generation, review step' },
    { number: 3, name: 'Template Engine', description: 'All template generators: skills, tools, workflows, CLAUDE.md, rules, task seed, indexes, strategic docs' },
    { number: 4, name: 'Dashboard & Export', description: 'Project dashboard, task viewer, knowledge viewer, file browser, ZIP export' },
    { number: 5, name: 'Engine Self-Consistency', description: 'wat_references reconciliation, gamification alignment, operational docs placement, dogfooding' },
    { number: 6, name: 'Polish & Scale', description: 'Performance optimization, error handling, multi-project support, framework docs site' },
  ],
};

// =============================================================================
// VibePM TASKS — representing the actual development work
// =============================================================================

const tasks: GeneratedTask[] = [
  // Phase 1: Foundation
  {
    task_code: 'P01-01', title: 'Initialize Vite + React + TypeScript project',
    description: 'Set up project scaffolding with Vite, React 18, TypeScript, SWC plugin, path aliases (@/ → src/)',
    phase: 'phase1', category: 'infra', assigned_to: 'claude-code', priority: 100, xp_reward: 25,
    dependencies: [], wat_references: [],
  },
  {
    task_code: 'P01-02', title: 'Configure shadcn/ui and Tailwind CSS',
    description: 'Install shadcn/ui, Tailwind CSS, custom theme tokens (vibe-glow, vibe-cyan, vibe-amber, vibe-rose), custom fonts (Space Grotesk, JetBrains Mono)',
    phase: 'phase1', category: 'ui', assigned_to: 'claude-code', priority: 95, xp_reward: 20,
    dependencies: ['P01-01'], wat_references: [],
  },
  {
    task_code: 'P01-03', title: 'Set up Supabase client and auth',
    description: 'Configure Supabase client with env vars (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY), create AuthProvider context, ProtectedRoute component',
    phase: 'phase1', category: 'infra', assigned_to: 'claude-code', priority: 90, xp_reward: 30,
    dependencies: ['P01-01'], wat_references: [],
  },
  {
    task_code: 'P01-04', title: 'Implement localStorage project store',
    description: 'Create src/lib/store.ts with CRUD operations for projects under vibepm_projects key. Include useProjects hook wrapper.',
    phase: 'phase1', category: 'feature', assigned_to: 'claude-code', priority: 85, xp_reward: 25,
    dependencies: ['P01-01'], wat_references: [],
  },
  {
    task_code: 'P01-05', title: 'Set up routing with react-router-dom v6',
    description: 'Configure all routes: / (landing), /auth, /new, /projects, /projects/:id (with nested tasks/knowledge/export), /project-tracker, /framework, /system. Protected routes with auth guard.',
    phase: 'phase1', category: 'infra', assigned_to: 'claude-code', priority: 80, xp_reward: 25,
    dependencies: ['P01-03'], wat_references: [],
  },

  // Phase 2: Core Wizard
  {
    task_code: 'P02-01', title: 'Build brain dump UI with sections and file upload',
    description: 'Create NewProject page step 1: project name, description, expandable brain dump sections with rich text, file upload support for reference docs',
    phase: 'phase2', category: 'ui', assigned_to: 'claude-code', priority: 100, xp_reward: 35,
    dependencies: ['P01-05'], wat_references: [],
  },
  {
    task_code: 'P02-02', title: 'Integrate AI analysis edge function',
    description: 'Wire brain dump to generate-project edge function (step: analyze). Parse response into AnalysisResult with modules, entities, phases, shared concerns.',
    phase: 'phase2', category: 'feature', assigned_to: 'claude-code', priority: 95, xp_reward: 35,
    dependencies: ['P02-01'], wat_references: [],
  },
  {
    task_code: 'P02-03', title: 'Integrate AI task generation',
    description: 'Wire analysis to generate-project edge function (step: generate-tasks). Parse response into GeneratedTask[] with task_code, wat_references, dependencies.',
    phase: 'phase2', category: 'feature', assigned_to: 'claude-code', priority: 90, xp_reward: 30,
    dependencies: ['P02-02'], wat_references: [],
  },
  {
    task_code: 'P02-04', title: 'Build review and save step',
    description: 'Create wizard step 4: display generated tasks, knowledge files, config files with counts. Save button persists to localStorage.',
    phase: 'phase2', category: 'ui', assigned_to: 'claude-code', priority: 85, xp_reward: 25,
    dependencies: ['P02-03'], wat_references: [],
  },

  // Phase 3: Template Engine
  {
    task_code: 'P03-01', title: 'Create CLAUDE.md template generator',
    description: 'Implement generateClaudeMd(project) following the 12-section template: overview, commands, task protocol, structure, knowledge base, conventions, module map, environment, database, AI agents, rules, deployment',
    phase: 'phase3', category: 'feature', assigned_to: 'claude-code', priority: 100, xp_reward: 35,
    dependencies: ['P02-03'], wat_references: [],
  },
  {
    task_code: 'P03-02', title: 'Create rules file generators',
    description: 'Implement 5 rules generators: code-style, database, architecture, task-process, testing — each produces a .claude/rules/*.md file',
    phase: 'phase3', category: 'feature', assigned_to: 'claude-code', priority: 95, xp_reward: 30,
    dependencies: ['P03-01'], wat_references: [],
  },
  {
    task_code: 'P03-03', title: 'Create skill file generators',
    description: 'Implement generateSkillFile (module), generateSharedSkillFile (cross-cutting), generateAgentSkillFile (AI agent), generateSkillIndex — following WAT Skill Index Template',
    phase: 'phase3', category: 'feature', assigned_to: 'claude-code', priority: 90, xp_reward: 35,
    dependencies: ['P03-01'], wat_references: [],
  },
  {
    task_code: 'P03-04', title: 'Create tool file generators',
    description: 'Implement generateDbTool (entity CRUD), generateApiTool (edge functions), generateUiTool (component specs), generateAutomationTool, generateToolIndex — following Tool Index Template',
    phase: 'phase3', category: 'feature', assigned_to: 'claude-code', priority: 85, xp_reward: 35,
    dependencies: ['P03-01'], wat_references: [],
  },
  {
    task_code: 'P03-05', title: 'Create workflow file generators',
    description: 'Implement generateWorkflowFile (module), generateSharedWorkflowFile (cross-module), generateWorkflowIndex — following WAT Framework Template',
    phase: 'phase3', category: 'feature', assigned_to: 'claude-code', priority: 80, xp_reward: 30,
    dependencies: ['P03-01'], wat_references: [],
  },
  {
    task_code: 'P03-06', title: 'Create task seed SQL generator',
    description: 'Implement generateTaskSeedSql: project_tasks table, project_levels table (15 levels, 0-12000 XP), indexes, RLS, UPDATE trigger, seed INSERT with ON CONFLICT',
    phase: 'phase3', category: 'feature', assigned_to: 'claude-code', priority: 75, xp_reward: 30,
    dependencies: ['P03-01'], wat_references: [],
  },
  {
    task_code: 'P03-07', title: 'Create orchestrator (generate-from-templates.ts)',
    description: 'Central function generateConfigFromTemplates(analysis, tasks) that calls ALL generators in the right order and returns { path, content }[] for the complete framework',
    phase: 'phase3', category: 'orchestration', assigned_to: 'claude-code', priority: 70, xp_reward: 50,
    dependencies: ['P03-02', 'P03-03', 'P03-04', 'P03-05', 'P03-06'], wat_references: [],
  },

  // Phase 4: Dashboard & Export
  {
    task_code: 'P04-01', title: 'Build project dashboard page',
    description: 'Create ProjectDashboard with overview stats, phase progress, XP/level display, nested route outlet for tasks/knowledge/export tabs',
    phase: 'phase4', category: 'ui', assigned_to: 'claude-code', priority: 100, xp_reward: 35,
    dependencies: ['P03-07'], wat_references: [],
  },
  {
    task_code: 'P04-02', title: 'Build task viewer tab',
    description: 'Create ProjectTasks tab: task list grouped by phase, status badges, dependency graph visualization, progress bars',
    phase: 'phase4', category: 'ui', assigned_to: 'claude-code', priority: 95, xp_reward: 30,
    dependencies: ['P04-01'], wat_references: [],
  },
  {
    task_code: 'P04-03', title: 'Build knowledge viewer tab',
    description: 'Create Knowledge tab: file tree organized by type (skills/tools/workflows), content preview pane, type badges',
    phase: 'phase4', category: 'ui', assigned_to: 'claude-code', priority: 90, xp_reward: 25,
    dependencies: ['P04-01'], wat_references: [],
  },
  {
    task_code: 'P04-04', title: 'Build export page with ZIP download',
    description: 'Create ProjectExport: file browser, content preview, JSZip packaging, download as {project-name}-context.zip',
    phase: 'phase4', category: 'feature', assigned_to: 'claude-code', priority: 85, xp_reward: 30,
    dependencies: ['P04-01'], wat_references: [],
  },

  // Phase 5: Engine Self-Consistency
  {
    task_code: 'P05-01', title: 'Implement wat_references reconciliation',
    description: 'Add computeKnowledgePaths() and reconcileWatReferences() to orchestrator. Three-pass strategy: resolve existing refs (exact → normalized → fuzzy), infer from task content, deduplicate.',
    phase: 'phase5', category: 'feature', assigned_to: 'claude-code', priority: 100, xp_reward: 50,
    dependencies: ['P03-07'], wat_references: [],
  },
  {
    task_code: 'P05-02', title: 'Align gamification levels to 15-level spec',
    description: 'Update GAMIFICATION_LEVELS in types/project.ts to 15 levels (0-12000 XP) matching task seed SQL: Apprentice → Ascended',
    phase: 'phase5', category: 'infra', assigned_to: 'claude-code', priority: 95, xp_reward: 15,
    dependencies: [], wat_references: [],
  },
  {
    task_code: 'P05-03', title: 'Move operational docs into knowledge/',
    description: 'Relocate agent-spec.md, human-in-the-loop.md, error-recovery.md, learning-optimization.md, integration-checklist.md from repo root into knowledge/',
    phase: 'phase5', category: 'infra', assigned_to: 'claude-code', priority: 90, xp_reward: 15,
    dependencies: [], wat_references: [],
  },
  {
    task_code: 'P05-04', title: 'Dogfood: generate engine for VibePM itself',
    description: 'Create scripts/generate-self.ts that runs generateConfigFromTemplates with hand-crafted VibePM analysis. Write output to repo.',
    phase: 'phase5', category: 'orchestration', assigned_to: 'claude-code', priority: 85, xp_reward: 35,
    dependencies: ['P05-01', 'P05-02', 'P05-03'], wat_references: [],
  },

  // Phase 6: Polish & Scale
  {
    task_code: 'P06-01', title: 'Add error handling to AI generation pipeline',
    description: 'Add retry logic, user-facing error messages, rate limit handling, partial failure recovery to the wizard generation steps',
    phase: 'phase6', category: 'feature', assigned_to: 'claude-code', priority: 100, xp_reward: 30,
    dependencies: ['P05-04'], wat_references: [],
  },
  {
    task_code: 'P06-02', title: 'Build framework documentation site',
    description: 'Create /framework route with template documentation rendered from public/framework/*.md files',
    phase: 'phase6', category: 'ui', assigned_to: 'claude-code', priority: 90, xp_reward: 25,
    dependencies: ['P05-04'], wat_references: [],
  },
  {
    task_code: 'P06-03', title: 'Performance optimization',
    description: 'Code-split routes with lazy loading, optimize bundle size, add loading states for AI calls',
    phase: 'phase6', category: 'infra', assigned_to: 'claude-code', priority: 80, xp_reward: 25,
    dependencies: ['P05-04'], wat_references: [],
  },
];

// =============================================================================
// GENERATE & WRITE
// =============================================================================

const ROOT = process.cwd();

const files = generateConfigFromTemplates(analysis, tasks);

let written = 0;
let skipped = 0;

for (const file of files) {
  // Skip files that would overwrite existing source code
  // (we only want engine/knowledge files, not generated React code for the tracker)
  if (
    file.path.startsWith('src/hooks/useProjectTasks') ||
    file.path.startsWith('src/components/ProgressRing') ||
    file.path.startsWith('src/components/TaskCard') ||
    file.path.startsWith('src/pages/ProjectTasksPage') ||
    file.path.startsWith('src/routes/')
  ) {
    skipped++;
    continue;
  }

  const fullPath = join(ROOT, file.path);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, file.content, 'utf-8');
  written++;
}

console.log(`\n✅ VibePM engine generated for itself!`);
console.log(`   ${written} files written`);
console.log(`   ${skipped} files skipped (would overwrite existing source)`);
console.log(`\nKey outputs:`);
console.log(`   .claude/CLAUDE.md          — Agent instructions (12 sections)`);
console.log(`   .claude/rules/*.md         — Coding conventions (5 files)`);
console.log(`   knowledge/skills.md        — Skill index`);
console.log(`   knowledge/tools.md         — Tool index`);
console.log(`   knowledge/workflows.md     — Workflow index`);
console.log(`   knowledge/prod.md          — Master knowledge base`);
console.log(`   knowledge/PRD.json         — Task dependency graph`);
console.log(`   knowledge/pipeline.md      — Pipeline reference`);
console.log(`   knowledge/skills/**        — Skill files per module`);
console.log(`   knowledge/tools/**         — Tool files per entity/module`);
console.log(`   knowledge/workflows/**     — Workflow files per module`);
console.log(`   supabase/migrations/       — Task seed SQL`);
console.log(`   doc/VISION.md              — Vision document`);
console.log(`   doc/PRODUCT.md             — Product document`);
console.log(`   doc/SPEC.md                — V1 spec`);
