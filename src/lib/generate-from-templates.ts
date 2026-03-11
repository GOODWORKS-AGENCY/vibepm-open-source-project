/**
 * Orchestrator that calls ALL template generators to produce the complete
 * AI-Driven Development Framework deterministically from the AI analysis + tasks.
 *
 * The AI handles creative work (analyzing brain dumps, generating tasks).
 * Templates handle ALL structured work — config files, knowledge files (skills,
 * tools, workflows, indexes), strategic docs, task tracker UI, and more.
 * Predictable, testable, consistent every time.
 */

import { Project, Module } from '@/types/project';
import { AnalysisResult, GeneratedTask } from './ai-generate';

// Config template imports
import { generateClaudeMd } from '@/templates/claude-md';
import { generateAgentsMd } from '@/templates/agents-md';
import { generateProdMd } from '@/templates/prod-md';
import { generatePrdJson } from '@/templates/prd-json';
import { generatePipelineReference } from '@/templates/pipeline';
import { generateCodeStyleRules, generateDatabaseRules, generateArchitectureRules, generateTaskProcessRules, generateTestingRules } from '@/templates/rules-files';
import { generateTaskSeedSql } from '@/templates/task-seed';
import { generateIntegrationChecklist } from '@/templates/integration-checklist';
import { generateAgentSpec } from '@/templates/agent-spec';
import { generateHumanInTheLoop, generateErrorRecovery, generateLearningOptimization } from '@/templates/wat-patterns';
import { generateVisionMd, generateProductMd, generateSpecMd } from '@/templates/strategic-docs';
import { generateDesignSystemSkill } from '@/templates/design-system';

// Knowledge file template imports (Skills, Tools, Workflows)
import { generateSkillFile, generateSharedSkillFile, generateAgentSkillFile, generateSkillIndex } from '@/templates/skill-file';
import { generateDbTool, generateApiTool, generateUiTool, generateAutomationTool, generateToolIndex } from '@/templates/tool-file';
import { generateWorkflowFile, generateSharedWorkflowFile, generateWorkflowIndex } from '@/templates/workflow-file';

// Task tracker UI template imports
import { generateUseProjectTasksHook, generateProgressRingComponent, generateTaskCardComponent, generateProjectTasksPage, generateRouteRegistration } from '@/templates/task-tracker-ui';

// Agent runtime
import { generateAgentCli } from '@/templates/agent-cli';

/**
 * Build a Project object from AI analysis + tasks for use by templates.
 */
function buildProjectForTemplates(
  analysis: AnalysisResult,
  tasks: GeneratedTask[]
): Project {
  return {
    id: '',
    name: analysis.projectName,
    description: analysis.description,
    stack: {
      framework: analysis.stack?.framework || 'React',
      language: analysis.stack?.language || 'TypeScript',
      buildTool: analysis.stack?.buildTool || 'Vite',
      backend: analysis.stack?.backend || 'Supabase',
      ui: analysis.stack?.ui || 'shadcn/ui + Tailwind CSS',
      stateManagement: analysis.stack?.stateManagement || 'TanStack Query',
      forms: analysis.stack?.forms || 'react-hook-form',
      validation: analysis.stack?.validation || 'zod',
    },
    phases: (analysis.phases || []).map(p => ({
      id: crypto.randomUUID(),
      number: p.number,
      name: p.name,
      description: p.description,
      status: 'pending' as const,
    })),
    tasks: tasks.map(t => ({
      taskCode: t.task_code,
      title: t.title,
      description: t.description,
      phase: t.phase,
      category: (t.category || 'feature') as any,
      assignedTo: t.assigned_to || 'agent-1',
      priority: t.priority,
      xpReward: t.xp_reward,
      status: 'pending' as const,
      progressPct: 0,
      dependencies: t.dependencies || [],
      watReferences: t.wat_references || [],
    })),
    knowledgeFiles: [],
    generatedFiles: [],
    xp: { current: 0, level: 1 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Extract Module[] from analysis for templates that need it.
 */
function extractModules(analysis: AnalysisResult): Module[] {
  return (analysis.modules || []).map(m => ({
    name: m.name,
    description: m.description,
    route: m.route || `/${m.name.toLowerCase().replace(/\s+/g, '-')}`,
    entities: m.entities || [],
    actions: m.actions || [],
    relatedModules: m.relatedModules || [],
  }));
}

/**
 * Derive simple workflow steps from a module's actions.
 * Groups actions into logical process steps for workflow generation.
 */
function deriveWorkflowSteps(module: Module): string[] {
  if (module.actions.length === 0) return ['Validate input', 'Process request', 'Return result'];
  // Use the first 3-5 actions as workflow steps
  return module.actions.slice(0, 5);
}

/**
 * Precompute every knowledge file path that templates will generate.
 * Used to reconcile AI-generated wat_references against real paths.
 */
function computeKnowledgePaths(analysis: AnalysisResult, modules: Module[]): string[] {
  const paths: string[] = [];

  // Shared skills
  const sharedConcerns = analysis.sharedConcerns || ['auth', 'audit', 'multi-tenancy'];
  for (const concern of sharedConcerns) {
    const slug = concern.toLowerCase().replace(/\s+/g, '-');
    paths.push(`knowledge/skills/shared/${slug}.skill.md`);
  }

  // Module skills
  for (const m of modules) {
    const slug = m.name.toLowerCase().replace(/\s+/g, '-');
    paths.push(`knowledge/skills/${slug}/${slug}.skill.md`);
  }

  // Agent skills
  const agents = (analysis as any).agents || [];
  for (const agent of agents) {
    const slug = agent.name.toLowerCase().replace(/\s+/g, '-');
    paths.push(`knowledge/skills/agents/${slug}.skill.md`);
  }

  // Indexes + master references
  paths.push(
    'knowledge/skills.md',
    'knowledge/tools.md',
    'knowledge/workflows.md',
    'knowledge/prod.md',
    'knowledge/PRD.json',
    'knowledge/pipeline.md',
  );

  // DB tools — one per entity
  const entities = analysis.entities || [];
  for (const entity of entities) {
    const slug = entity.toLowerCase().replace(/[\s_]+/g, '-');
    paths.push(`knowledge/tools/db/${slug}-crud.tool.md`);
  }

  // API tools — one per module
  for (const m of modules) {
    const slug = m.name.toLowerCase().replace(/\s+/g, '-');
    paths.push(`knowledge/tools/api/${slug}-api.tool.md`);
  }

  // UI tools — one per module
  for (const m of modules) {
    const slug = m.name.toLowerCase().replace(/\s+/g, '-');
    paths.push(`knowledge/tools/ui/${slug}-ui.tool.md`);
  }

  // Automation tool (generated when > 3 modules)
  if (modules.length > 3) {
    paths.push('knowledge/tools/automation/cascade-engine.tool.md');
  }

  // Module workflows
  for (const m of modules) {
    const slug = m.name.toLowerCase().replace(/\s+/g, '-');
    paths.push(`knowledge/workflows/${slug}/${slug}-core.workflow.md`);
  }

  // Shared workflows (generated when >= 2 modules)
  if (modules.length >= 2) {
    paths.push('knowledge/workflows/shared/onboarding.workflow.md');
    paths.push('knowledge/workflows/shared/data-cascade.workflow.md');
  }

  return paths;
}

/**
 * Normalize a string into a comparable slug: lowercase, spaces/underscores → hyphens.
 */
const toSlug = (s: string) => s.toLowerCase().replace(/[\s_]+/g, '-');

/**
 * Reconcile AI-generated wat_references against actual generated paths.
 *
 * Three-pass strategy:
 *  1. Resolve each existing reference (exact match → normalized match → fuzzy match)
 *  2. If a task has zero resolved references, infer from title/description + module/entity names
 *  3. Deduplicate
 */
function reconcileWatReferences(
  tasks: GeneratedTask[],
  knowledgePaths: string[],
  modules: Module[],
  entities: string[],
): GeneratedTask[] {
  const pathSet = new Set(knowledgePaths);

  // Normalized path lookup: "knowledge/skills/members/members.skill.md" indexed multiple ways
  const normalizedLookup = new Map<string, string>();
  for (const p of knowledgePaths) {
    // Full normalized path
    normalizedLookup.set(p.split('/').map(toSlug).join('/'), p);
    // Just the filename
    const filename = p.split('/').pop()!;
    if (!normalizedLookup.has(filename)) normalizedLookup.set(filename, p);
    // Stem without .skill.md / .tool.md / .workflow.md suffixes
    const stem = filename
      .replace(/\.(skill|tool|workflow)\.md$/, '')
      .replace(/-crud$/, '')
      .replace(/-api$/, '')
      .replace(/-ui$/, '')
      .replace(/-core$/, '');
    if (!normalizedLookup.has(stem)) normalizedLookup.set(stem, p);
  }

  /** Try to resolve a single AI-generated reference to an actual path. */
  function resolveRef(ref: string): string | null {
    // Pass 1: exact match
    if (pathSet.has(ref)) return ref;

    // Pass 2: normalized path match
    const normalizedRef = ref.split('/').map(toSlug).join('/');
    const byNorm = normalizedLookup.get(normalizedRef);
    if (byNorm) return byNorm;

    // Pass 3: extract slug from the filename portion and search
    const refFilename = ref.split('/').pop() || '';
    const refStem = refFilename
      .replace(/\.(skill|tool|workflow)\.md$/, '')
      .replace(/-crud$/, '')
      .replace(/-api$/, '')
      .replace(/-ui$/, '')
      .replace(/-core$/, '');
    const normalizedStem = toSlug(refStem);

    // Try to match with the same knowledge type (skill/tool/workflow)
    const refType = ref.includes('/skills') ? '/skills'
      : ref.includes('/tools') ? '/tools'
      : ref.includes('/workflows') ? '/workflows'
      : null;

    for (const p of knowledgePaths) {
      const pStem = (p.split('/').pop() || '')
        .replace(/\.(skill|tool|workflow)\.md$/, '')
        .replace(/-crud$/, '')
        .replace(/-api$/, '')
        .replace(/-ui$/, '')
        .replace(/-core$/, '');

      if (toSlug(pStem) === normalizedStem) {
        if (!refType || p.includes(refType)) return p;
      }
    }

    return null;
  }

  // Keyword maps for shared concern inference
  const sharedConcernKeywords: Record<string, string[]> = {
    'auth': ['auth', 'login', 'permission', 'role', 'session', 'jwt', 'rls', 'sign-up', 'signup'],
    'audit': ['audit', 'activity log', 'trail', 'history'],
    'multi-tenancy': ['tenant', 'organization', 'org-scop', 'multi-tenant', 'isolation'],
    'notifications': ['notification', 'email', 'alert', 'notify', 'push'],
    'search': ['search', 'full-text', 'facet', 'filter'],
    'file-uploads': ['upload', 'file', 'storage', 'attachment'],
    'analytics': ['analytics', 'report', 'metric', 'dashboard', 'chart', 'insight'],
    'billing': ['billing', 'payment', 'subscription', 'invoice', 'stripe', 'checkout'],
  };

  /** Infer wat_references from a task's title, description, category, and the project's modules/entities. */
  function inferRefsForTask(task: GeneratedTask): string[] {
    const refs: string[] = [];
    const combined = `${(task.title || '').toLowerCase()} ${(task.description || '').toLowerCase()}`;

    // Match modules by name
    for (const m of modules) {
      const mSlug = toSlug(m.name);
      const mLower = m.name.toLowerCase();

      if (!combined.includes(mLower) && !combined.includes(mSlug)) continue;

      // Always add the module skill
      const skillPath = `knowledge/skills/${mSlug}/${mSlug}.skill.md`;
      if (pathSet.has(skillPath)) refs.push(skillPath);

      // DB tool for schema/migration/infra tasks
      if (task.category === 'infra' || /schema|table|migration|database|seed/i.test(combined)) {
        for (const entity of m.entities) {
          const eSlug = toSlug(entity);
          const toolPath = `knowledge/tools/db/${eSlug}-crud.tool.md`;
          if (pathSet.has(toolPath)) refs.push(toolPath);
        }
      }

      // API tool for feature/crud/hook tasks
      if (task.category === 'feature' || /crud|hook|api|endpoint|mutation|query/i.test(combined)) {
        const apiPath = `knowledge/tools/api/${mSlug}-api.tool.md`;
        if (pathSet.has(apiPath)) refs.push(apiPath);
      }

      // UI tool for ui/page/component tasks
      if (task.category === 'ui' || /page|component|view|layout|form|modal|dialog/i.test(combined)) {
        const uiPath = `knowledge/tools/ui/${mSlug}-ui.tool.md`;
        if (pathSet.has(uiPath)) refs.push(uiPath);
      }

      // Workflow for process/workflow tasks
      if (/workflow|process|pipeline|lifecycle/i.test(combined)) {
        const wfPath = `knowledge/workflows/${mSlug}/${mSlug}-core.workflow.md`;
        if (pathSet.has(wfPath)) refs.push(wfPath);
      }
    }

    // Match entities directly (catches entity names not covered by module match)
    for (const entity of entities) {
      const eSlug = toSlug(entity);
      if (combined.includes(entity.toLowerCase()) || combined.includes(eSlug)) {
        const toolPath = `knowledge/tools/db/${eSlug}-crud.tool.md`;
        if (pathSet.has(toolPath) && !refs.includes(toolPath)) refs.push(toolPath);
      }
    }

    // Match shared concerns
    for (const [concern, keywords] of Object.entries(sharedConcernKeywords)) {
      if (keywords.some(kw => combined.includes(kw))) {
        const skillPath = `knowledge/skills/shared/${concern}.skill.md`;
        if (pathSet.has(skillPath) && !refs.includes(skillPath)) refs.push(skillPath);
      }
    }

    return refs;
  }

  // === Main reconciliation loop ===
  return tasks.map(task => {
    const resolvedRefs: string[] = [];

    // 1. Resolve existing AI-generated references
    for (const ref of (task.wat_references || [])) {
      const resolved = resolveRef(ref);
      if (resolved) resolvedRefs.push(resolved);
    }

    // 2. If nothing resolved, infer from task content
    if (resolvedRefs.length === 0) {
      resolvedRefs.push(...inferRefsForTask(task));
    }

    // 3. Deduplicate
    return { ...task, wat_references: [...new Set(resolvedRefs)] };
  });
}

/**
 * Generate the COMPLETE framework — config files + knowledge files + UI code.
 *
 * Returns an array of { path, content } that gets saved as generatedFiles
 * and exported as a ZIP.
 */
export function generateConfigFromTemplates(
  analysis: AnalysisResult,
  tasks: GeneratedTask[]
): { path: string; content: string }[] {
  const modules = extractModules(analysis);

  // =========================================================================
  // RECONCILIATION: Ensure every task's wat_references point to real files
  // =========================================================================
  const knowledgePaths = computeKnowledgePaths(analysis, modules);
  const reconciledTasks = reconcileWatReferences(
    tasks, knowledgePaths, modules, analysis.entities || [],
  );

  const project = buildProjectForTemplates(analysis, reconciledTasks);
  const files: { path: string; content: string }[] = [];

  // =========================================================================
  // SECTION 1: AGENT INSTRUCTIONS & RULES (config files)
  // =========================================================================

  // 1. CLAUDE.md — Primary agent instructions (12 sections)
  files.push({
    path: '.claude/CLAUDE.md',
    content: generateClaudeMd(project, modules),
  });

  // 2. AGENTS.md — Secondary agent config (Codex/Cursor/Copilot)
  files.push({
    path: 'AGENTS.md',
    content: generateAgentsMd(project),
  });

  // 3. Rules files (5 files)
  files.push({
    path: '.claude/rules/code-style.md',
    content: generateCodeStyleRules(project.stack),
  });
  files.push({
    path: '.claude/rules/database.md',
    content: generateDatabaseRules(),
  });
  files.push({
    path: '.claude/rules/architecture.md',
    content: generateArchitectureRules(),
  });
  files.push({
    path: '.claude/rules/task-process.md',
    content: generateTaskProcessRules(),
  });
  files.push({
    path: '.claude/rules/testing.md',
    content: generateTestingRules(),
  });

  // =========================================================================
  // SECTION 2: KNOWLEDGE BASE — Master references
  // =========================================================================

  // 4. Master knowledge base (prod.md)
  files.push({
    path: 'knowledge/prod.md',
    content: generateProdMd(project, modules),
  });

  // 5. PRD.json — Task dependency graph
  files.push({
    path: 'knowledge/PRD.json',
    content: generatePrdJson(project.tasks),
  });

  // 6. Pipeline reference
  files.push({
    path: 'knowledge/pipeline.md',
    content: generatePipelineReference(project.name),
  });

  // =========================================================================
  // SECTION 3: KNOWLEDGE FILES — Skills (WHAT to build)
  // =========================================================================

  // Shared skills for cross-cutting concerns
  const sharedConcerns = analysis.sharedConcerns || ['auth', 'audit', 'multi-tenancy'];
  const sharedSkillDescriptions: Record<string, string> = {
    'auth': 'Authentication and authorization — permission model, route guards, RLS policies, session management',
    'audit': 'Audit logging — immutable activity logging for all create, update, and delete operations',
    'multi-tenancy': 'Multi-tenancy — organization scoping, data isolation, cross-tenant prevention',
    'notifications': 'Notification system — email, in-app, and push notification delivery and preferences',
    'search': 'Search infrastructure — full-text search, faceted filtering, indexing strategies',
    'file-uploads': 'File upload handling — storage, validation, virus scanning, URL generation',
    'analytics': 'Analytics and reporting — event tracking, metric aggregation, dashboard data',
    'billing': 'Billing and payments — subscription management, invoice generation, payment processing',
  };

  for (const concern of sharedConcerns) {
    const slug = concern.toLowerCase().replace(/\s+/g, '-');
    const desc = sharedSkillDescriptions[slug] || `${concern} — cross-cutting concern applied across all modules`;
    files.push({
      path: `knowledge/skills/shared/${slug}.skill.md`,
      content: generateSharedSkillFile(concern, desc),
    });
  }

  // Module skills — one per module
  for (const module of modules) {
    const slug = module.name.toLowerCase().replace(/\s+/g, '-');
    files.push({
      path: `knowledge/skills/${slug}/${slug}.skill.md`,
      content: generateSkillFile(module),
    });
  }

  // AI agent skills (if analysis found any)
  const agents = (analysis as any).agents || [];
  for (const agent of agents) {
    const slug = agent.name.toLowerCase().replace(/\s+/g, '-');
    files.push({
      path: `knowledge/skills/agents/${slug}.skill.md`,
      content: generateAgentSkillFile(
        agent.name,
        agent.role || `AI agent: ${agent.name}`,
        agent.capabilities || [`${agent.name} operations`],
        agent.modulesAccessed || modules.slice(0, 3).map(m => m.name)
      ),
    });
  }

  // Skill index
  files.push({
    path: 'knowledge/skills.md',
    content: generateSkillIndex(
      modules,
      agents.map((a: any) => ({ name: a.name, role: a.role || `AI agent: ${a.name}` })),
      sharedConcerns
    ),
  });

  // =========================================================================
  // SECTION 4: KNOWLEDGE FILES — Tools (HOW to build)
  // =========================================================================

  // Collect names for the tool index
  const dbToolNames: string[] = [];
  const apiToolNames: string[] = [];
  const uiToolEntries: { name: string; module: string }[] = [];

  // DB tools — one per entity
  const allEntities = analysis.entities || [];
  for (const entity of allEntities) {
    const entityKebab = toSlug(entity);
    // Find which module owns this entity
    const ownerModule = modules.find(m =>
      m.entities.some(e => e.toLowerCase().replace(/\s+/g, '_') === entity.toLowerCase().replace(/\s+/g, '_'))
    );
    const moduleName = ownerModule?.name || 'Core';
    files.push({
      path: `knowledge/tools/db/${entityKebab}-crud.tool.md`,
      content: generateDbTool(entity, moduleName, ownerModule),
    });
    dbToolNames.push(entity);
  }

  // API tools — one per module (edge function pattern)
  for (const module of modules) {
    const slug = module.name.toLowerCase().replace(/\s+/g, '-');
    files.push({
      path: `knowledge/tools/api/${slug}-api.tool.md`,
      content: generateApiTool(
        `${module.name} API`,
        `API endpoints for the ${module.name} module — handles ${module.actions.slice(0, 3).join(', ')}${module.actions.length > 3 ? ', and more' : ''}`
      ),
    });
    apiToolNames.push(`${module.name} API`);
  }

  // UI tools — one per module (component spec)
  for (const module of modules) {
    const slug = module.name.toLowerCase().replace(/\s+/g, '-');
    files.push({
      path: `knowledge/tools/ui/${slug}-ui.tool.md`,
      content: generateUiTool(`${module.name} View`, module.name),
    });
    uiToolEntries.push({ name: `${module.name} View`, module: module.name });
  }

  // Automation tool (if project has cascading workflows)
  const automationToolEntries: { name: string; description: string }[] = [];
  if (modules.length > 3) {
    files.push({
      path: 'knowledge/tools/automation/cascade-engine.tool.md',
      content: generateAutomationTool(
        'Cascade Engine',
        `Event-driven automation engine that processes cascade triggers across ${modules.length} modules — handles entity state changes, cross-module notifications, and aggregate recalculations`
      ),
    });
    automationToolEntries.push({
      name: 'Cascade Engine',
      description: 'Cross-module cascade trigger processing',
    });
  }

  // Tool index
  files.push({
    path: 'knowledge/tools.md',
    content: generateToolIndex(dbToolNames, apiToolNames, uiToolEntries, automationToolEntries),
  });

  // =========================================================================
  // SECTION 5: KNOWLEDGE FILES — Workflows (WHEN things happen)
  // =========================================================================

  const workflowEntries: { name: string; module: string; risk: string }[] = [];
  const sharedWorkflowEntries: { name: string; description: string; risk: string }[] = [];

  // Module workflows — one primary workflow per module
  for (const module of modules) {
    const slug = module.name.toLowerCase().replace(/\s+/g, '-');
    const workflowName = `${module.name} Core Workflow`;
    const steps = deriveWorkflowSteps(module);
    files.push({
      path: `knowledge/workflows/${slug}/${slug}-core.workflow.md`,
      content: generateWorkflowFile(workflowName, module.name, steps),
    });
    workflowEntries.push({
      name: workflowName,
      module: module.name,
      risk: 'Medium',
    });
  }

  // Shared workflows — cross-module processes
  if (modules.length >= 2) {
    const allModuleNames = modules.map(m => m.name);

    files.push({
      path: 'knowledge/workflows/shared/onboarding.workflow.md',
      content: generateSharedWorkflowFile(
        'User Onboarding',
        'End-to-end onboarding process — from account creation through initial setup to first value delivery',
        ['Create account', 'Initialize organization', 'Set up default data', 'Send welcome notification', 'Track onboarding completion'],
        allModuleNames.slice(0, 4)
      ),
    });
    sharedWorkflowEntries.push({
      name: 'User Onboarding',
      description: 'End-to-end onboarding from signup to first value',
      risk: 'Medium',
    });

    files.push({
      path: 'knowledge/workflows/shared/data-cascade.workflow.md',
      content: generateSharedWorkflowFile(
        'Data Cascade Evaluation',
        'Cross-module cascade processing — evaluates entity state changes and propagates effects to dependent modules',
        ['Detect state change', 'Evaluate cascade rules', 'Execute dependent updates', 'Recalculate aggregates', 'Log cascade results'],
        allModuleNames
      ),
    });
    sharedWorkflowEntries.push({
      name: 'Data Cascade Evaluation',
      description: 'Cross-module cascade trigger processing',
      risk: 'High',
    });
  }

  // Workflow index
  files.push({
    path: 'knowledge/workflows.md',
    content: generateWorkflowIndex(workflowEntries, sharedWorkflowEntries),
  });

  // =========================================================================
  // SECTION 6: DATABASE & TASK SYSTEM
  // =========================================================================

  // 7. Database migration (task tracking + gamification)
  files.push({
    path: 'supabase/migrations/00001_project_tasks.sql',
    content: generateTaskSeedSql(project.tasks),
  });

  // =========================================================================
  // SECTION 7: TASK TRACKER UI (generated React code)
  // =========================================================================

  // Hook for data fetching + mutations
  files.push({
    path: 'src/hooks/useProjectTasks.ts',
    content: generateUseProjectTasksHook(),
  });

  // ProgressRing component
  files.push({
    path: 'src/components/ProgressRing.tsx',
    content: generateProgressRingComponent(),
  });

  // TaskCard component
  files.push({
    path: 'src/components/TaskCard.tsx',
    content: generateTaskCardComponent(),
  });

  // Full project tracker page
  const phaseNames = project.phases.map(p => p.name.toLowerCase().replace(/\s+/g, ''));
  files.push({
    path: 'src/pages/ProjectTasksPage.tsx',
    content: generateProjectTasksPage(phaseNames),
  });

  // Route registration snippet
  files.push({
    path: 'src/routes/project-tracker-route.ts',
    content: generateRouteRegistration(),
  });

  // =========================================================================
  // SECTION 8: WAT PATTERNS & OPERATIONAL DOCS
  // =========================================================================

  // 8. Integration checklist (lives at knowledge root — Part G of the engine)
  files.push({
    path: 'knowledge/integration-checklist.md',
    content: generateIntegrationChecklist(project),
  });

  // 9. Agent specification (WAT §10)
  files.push({
    path: 'knowledge/agent-spec.md',
    content: generateAgentSpec(project),
  });

  // 10. Human-in-the-loop (WAT §11)
  files.push({
    path: 'knowledge/human-in-the-loop.md',
    content: generateHumanInTheLoop(project),
  });

  // 11. Error recovery (WAT §12)
  files.push({
    path: 'knowledge/error-recovery.md',
    content: generateErrorRecovery(project),
  });

  // 12. Learning/optimization (WAT §13)
  files.push({
    path: 'knowledge/learning-optimization.md',
    content: generateLearningOptimization(project),
  });

  // =========================================================================
  // SECTION 9: STRATEGIC DOCS
  // =========================================================================

  // 13. VISION.md
  files.push({
    path: 'doc/VISION.md',
    content: generateVisionMd(project),
  });

  // 14. PRODUCT.md
  files.push({
    path: 'doc/PRODUCT.md',
    content: generateProductMd(project),
  });

  // 15. SPEC.md — V1 implementation contract
  files.push({
    path: 'doc/SPEC.md',
    content: generateSpecMd(project),
  });

  // =========================================================================
  // SECTION 10: SKILLS (Claude Code / agent skills)
  // =========================================================================

  // 16. Design system skill
  files.push({
    path: '.claude/skills/design-guide/SKILL.md',
    content: generateDesignSystemSkill(project),
  });

  // =========================================================================
  // SECTION 11: AGENT RUNTIME
  // =========================================================================

  // 17. Agent CLI script — the runtime loop interface
  const supabaseUrl = project.stack.backend.toLowerCase().includes('supabase')
    ? '${SUPABASE_URL}'  // placeholder — user sets env var
    : '';
  files.push({
    path: 'scripts/agent.sh',
    content: generateAgentCli(supabaseUrl),
  });

  return files;
}
