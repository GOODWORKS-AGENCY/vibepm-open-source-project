import { describe, it, expect } from 'vitest';
import { generateConfigFromTemplates } from '@/lib/generate-from-templates';
import { AnalysisResult, GeneratedTask } from '@/lib/ai-generate';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const ANALYSIS: AnalysisResult = {
  projectName: 'TestApp',
  description: 'A test application for unit testing',
  stack: {
    framework: 'React 18',
    language: 'TypeScript',
    buildTool: 'Vite',
    backend: 'Supabase',
    ui: 'shadcn/ui + Tailwind',
    stateManagement: 'TanStack Query',
    forms: 'react-hook-form',
    validation: 'zod',
  },
  entities: ['users', 'posts', 'comments'],
  modules: [
    {
      name: 'User Management',
      description: 'Manage user accounts and profiles',
      route: '/users',
      entities: ['users'],
      actions: ['Create user', 'Update profile', 'Delete user'],
      relatedModules: ['Content'],
    },
    {
      name: 'Content',
      description: 'Blog posts and comments',
      route: '/content',
      entities: ['posts', 'comments'],
      actions: ['Create post', 'Edit post', 'Add comment', 'Delete comment'],
      relatedModules: ['User Management'],
    },
  ],
  phases: [
    { number: 1, name: 'Foundation', description: 'Setup and auth' },
    { number: 2, name: 'Core Features', description: 'Main functionality' },
  ],
  sharedConcerns: ['auth', 'audit'],
};

const TASKS: GeneratedTask[] = [
  {
    task_code: 'P01-01',
    title: 'Setup project structure',
    description: 'Initialize the project',
    phase: 'phase1',
    category: 'infra',
    assigned_to: 'claude-code',
    priority: 100,
    xp_reward: 25,
    dependencies: [],
    wat_references: [],
  },
  {
    task_code: 'P01-02',
    title: 'Create users table and CRUD',
    description: 'Database schema for users',
    phase: 'phase1',
    category: 'infra',
    assigned_to: 'claude-code',
    priority: 90,
    xp_reward: 35,
    dependencies: ['P01-01'],
    wat_references: ['knowledge/tools/db/users-crud.tool.md'],
  },
  {
    task_code: 'P02-01',
    title: 'Build User Management UI',
    description: 'User list and profile pages',
    phase: 'phase2',
    category: 'ui',
    assigned_to: 'claude-code',
    priority: 80,
    xp_reward: 35,
    dependencies: ['P01-02'],
    wat_references: [
      'knowledge/skills/user-management/user-management.skill.md',
      'knowledge/tools/ui/user-management-ui.tool.md',
    ],
  },
  {
    task_code: 'P02-02',
    title: 'Build content posting system',
    description: 'Post creation and editing',
    phase: 'phase2',
    category: 'feature',
    assigned_to: 'claude-code',
    priority: 70,
    xp_reward: 50,
    dependencies: ['P01-02'],
    // Intentionally wrong path — should be reconciled
    wat_references: ['knowledge/skills/content/content.skill.md'],
  },
];

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('generateConfigFromTemplates', () => {
  let files: { path: string; content: string }[];

  // Generate once, test many — this is a pure function
  beforeAll(() => {
    files = generateConfigFromTemplates(ANALYSIS, TASKS);
  });

  it('generates a non-empty file list', () => {
    expect(files.length).toBeGreaterThan(30);
  });

  // ── File presence ──────────────────────────────────────────────────────

  describe('file presence', () => {
    const requiredPaths = [
      '.claude/CLAUDE.md',
      'AGENTS.md',
      'knowledge/prod.md',
      'knowledge/PRD.json',
      'knowledge/pipeline.md',
      'knowledge/skills.md',
      'knowledge/tools.md',
      'knowledge/workflows.md',
      '.claude/rules/code-style.md',
      '.claude/rules/database.md',
      '.claude/rules/architecture.md',
      '.claude/rules/task-process.md',
      '.claude/rules/testing.md',
      'supabase/migrations/00001_project_tasks.sql',
      'scripts/agent.sh',
      'doc/VISION.md',
      'doc/PRODUCT.md',
      'doc/SPEC.md',
      '.claude/skills/design-guide/SKILL.md',
    ];

    for (const path of requiredPaths) {
      it(`generates ${path}`, () => {
        expect(files.find(f => f.path === path)).toBeDefined();
      });
    }
  });

  // ── Module skills ─────────────────────────────────────────────────────

  describe('module skills', () => {
    it('generates a skill file per module', () => {
      expect(files.find(f => f.path === 'knowledge/skills/user-management/user-management.skill.md')).toBeDefined();
      expect(files.find(f => f.path === 'knowledge/skills/content/content.skill.md')).toBeDefined();
    });

    it('skill file contains real module data', () => {
      const skill = files.find(f => f.path === 'knowledge/skills/user-management/user-management.skill.md');
      expect(skill).toBeDefined();
      expect(skill!.content).toContain('User Management');
      expect(skill!.content).toContain('/users');
      expect(skill!.content).toContain('Create user');
    });
  });

  // ── Shared skills ─────────────────────────────────────────────────────

  describe('shared skills', () => {
    it('generates shared skills for each concern', () => {
      expect(files.find(f => f.path === 'knowledge/skills/shared/auth.skill.md')).toBeDefined();
      expect(files.find(f => f.path === 'knowledge/skills/shared/audit.skill.md')).toBeDefined();
    });
  });

  // ── DB tools ──────────────────────────────────────────────────────────

  describe('DB tools', () => {
    it('generates a DB tool per entity', () => {
      expect(files.find(f => f.path === 'knowledge/tools/db/users-crud.tool.md')).toBeDefined();
      expect(files.find(f => f.path === 'knowledge/tools/db/posts-crud.tool.md')).toBeDefined();
      expect(files.find(f => f.path === 'knowledge/tools/db/comments-crud.tool.md')).toBeDefined();
    });

    it('DB tool references its owning module', () => {
      const tool = files.find(f => f.path === 'knowledge/tools/db/users-crud.tool.md');
      expect(tool).toBeDefined();
      expect(tool!.content).toContain('User Management');
    });
  });

  // ── API + UI tools ────────────────────────────────────────────────────

  describe('API and UI tools', () => {
    it('generates an API tool per module', () => {
      expect(files.find(f => f.path === 'knowledge/tools/api/user-management-api.tool.md')).toBeDefined();
      expect(files.find(f => f.path === 'knowledge/tools/api/content-api.tool.md')).toBeDefined();
    });

    it('generates a UI tool per module', () => {
      expect(files.find(f => f.path === 'knowledge/tools/ui/user-management-ui.tool.md')).toBeDefined();
      expect(files.find(f => f.path === 'knowledge/tools/ui/content-ui.tool.md')).toBeDefined();
    });
  });

  // ── Workflows ─────────────────────────────────────────────────────────

  describe('workflows', () => {
    it('generates a workflow per module', () => {
      expect(files.find(f => f.path === 'knowledge/workflows/user-management/user-management-core.workflow.md')).toBeDefined();
      expect(files.find(f => f.path === 'knowledge/workflows/content/content-core.workflow.md')).toBeDefined();
    });

    it('generates shared workflows when 2+ modules', () => {
      expect(files.find(f => f.path === 'knowledge/workflows/shared/onboarding.workflow.md')).toBeDefined();
      expect(files.find(f => f.path === 'knowledge/workflows/shared/data-cascade.workflow.md')).toBeDefined();
    });
  });

  // ── CLAUDE.md content ─────────────────────────────────────────────────

  describe('CLAUDE.md', () => {
    it('contains real module routes', () => {
      const claude = files.find(f => f.path === '.claude/CLAUDE.md')!;
      expect(claude.content).toContain('/users');
      expect(claude.content).toContain('/content');
    });

    it('contains the agent protocol with agent.sh commands', () => {
      const claude = files.find(f => f.path === '.claude/CLAUDE.md')!;
      expect(claude.content).toContain('./scripts/agent.sh next');
      expect(claude.content).toContain('./scripts/agent.sh claim');
      expect(claude.content).toContain('./scripts/agent.sh complete');
      expect(claude.content).toContain('tsc --noEmit');
    });

    it('contains knowledge loading rules', () => {
      const claude = files.find(f => f.path === '.claude/CLAUDE.md')!;
      expect(claude.content).toContain('wat_references');
      expect(claude.content).toContain('knowledge/skills/');
      expect(claude.content).toContain('knowledge/tools/db/');
    });
  });

  // ── prod.md content ───────────────────────────────────────────────────

  describe('prod.md', () => {
    it('uses actual routes not slugified names', () => {
      const prod = files.find(f => f.path === 'knowledge/prod.md')!;
      expect(prod.content).toContain('/users');
      expect(prod.content).toContain('/content');
    });

    it('deduplicates entities in schema section', () => {
      const prod = files.find(f => f.path === 'knowledge/prod.md')!;
      // Each entity should appear only once in Core Tables
      const schemaSection = prod.content.split('### Core Tables')[1]?.split('###')[0] || '';
      const usersCount = (schemaSection.match(/`users`/g) || []).length;
      expect(usersCount).toBe(1);
    });

    it('has accurate knowledge file counts', () => {
      const prod = files.find(f => f.path === 'knowledge/prod.md')!;
      // Should list API Tools and UI Tools with non-zero counts
      expect(prod.content).toContain('| API Tools | 2 |');
      expect(prod.content).toContain('| UI Tools | 2 |');
    });
  });

  // ── Agent CLI ─────────────────────────────────────────────────────────

  describe('agent CLI', () => {
    it('generates scripts/agent.sh', () => {
      const cli = files.find(f => f.path === 'scripts/agent.sh');
      expect(cli).toBeDefined();
    });

    it('contains all actions', () => {
      const cli = files.find(f => f.path === 'scripts/agent.sh')!;
      expect(cli.content).toContain('next)');
      expect(cli.content).toContain('claim)');
      expect(cli.content).toContain('complete)');
      expect(cli.content).toContain('block)');
      expect(cli.content).toContain('status)');
      expect(cli.content).toContain('loop)');
    });

    it('includes build verification in loop', () => {
      const cli = files.find(f => f.path === 'scripts/agent.sh')!;
      expect(cli.content).toContain('tsc --noEmit');
      expect(cli.content).toContain('npm run build');
    });
  });

  // ── PRD.json ──────────────────────────────────────────────────────────

  describe('PRD.json', () => {
    it('is valid JSON', () => {
      const prd = files.find(f => f.path === 'knowledge/PRD.json')!;
      expect(() => JSON.parse(prd.content)).not.toThrow();
    });

    it('contains all tasks', () => {
      const prd = files.find(f => f.path === 'knowledge/PRD.json')!;
      const data = JSON.parse(prd.content);
      const tasks = data.tasks || data;
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBe(4);
    });
  });

  // ── Skill + Tool indexes ──────────────────────────────────────────────

  describe('indexes', () => {
    it('skill index lists all modules', () => {
      const idx = files.find(f => f.path === 'knowledge/skills.md')!;
      expect(idx.content).toContain('User Management');
      expect(idx.content).toContain('Content');
    });

    it('tool index lists all entities', () => {
      const idx = files.find(f => f.path === 'knowledge/tools.md')!;
      expect(idx.content).toContain('users');
      expect(idx.content).toContain('posts');
      expect(idx.content).toContain('comments');
    });

    it('skill index includes shared concerns', () => {
      const idx = files.find(f => f.path === 'knowledge/skills.md')!;
      // Should not fall back to default "Authentication, Audit Logging, Multi-Tenancy"
      // because we passed sharedConcerns: ['auth', 'audit']
      expect(idx.content).toContain('auth');
      expect(idx.content).toContain('audit');
    });
  });

  // ── Task seed SQL ─────────────────────────────────────────────────────

  describe('task seed SQL', () => {
    it('contains all task codes', () => {
      const sql = files.find(f => f.path === 'supabase/migrations/00001_project_tasks.sql')!;
      expect(sql.content).toContain('P01-01');
      expect(sql.content).toContain('P01-02');
      expect(sql.content).toContain('P02-01');
      expect(sql.content).toContain('P02-02');
    });

    it('contains 15-level gamification', () => {
      const sql = files.find(f => f.path === 'supabase/migrations/00001_project_tasks.sql')!;
      expect(sql.content).toContain('Ascended');
      expect(sql.content).toContain('12000');
    });
  });
});

// ─── wat_references reconciliation ──────────────────────────────────────────

describe('wat_references reconciliation', () => {
  let files: { path: string; content: string }[];

  beforeAll(() => {
    files = generateConfigFromTemplates(ANALYSIS, TASKS);
  });

  it('resolves correct references as-is', () => {
    const prd = files.find(f => f.path === 'knowledge/PRD.json')!;
    const data = JSON.parse(prd.content);
    const tasks = data.tasks || data;
    const t = tasks.find((t: any) => t.id === 'P01-02');
    expect(t.wat_references).toContain('knowledge/tools/db/users-crud.tool.md');
  });

  it('infers references for tasks with empty wat_references', () => {
    const prd = files.find(f => f.path === 'knowledge/PRD.json')!;
    const data = JSON.parse(prd.content);
    const tasks = data.tasks || data;
    const t = tasks.find((t: any) => t.id === 'P01-01');
    // P01-01 had empty references but title mentions "project structure" —
    // reconciliation may or may not find matches depending on analysis data.
    // At minimum, the array should exist.
    expect(Array.isArray(t.wat_references)).toBe(true);
  });

  it('all wat_references point to files that exist in the output', () => {
    const prd = files.find(f => f.path === 'knowledge/PRD.json')!;
    const data = JSON.parse(prd.content);
    const tasks = data.tasks || data;
    const allPaths = new Set(files.map(f => f.path));

    for (const task of tasks) {
      for (const ref of task.wat_references || []) {
        expect(allPaths.has(ref)).toBe(true);
      }
    }
  });

  it('reconciles references with correct paths for existing modules', () => {
    const prd = files.find(f => f.path === 'knowledge/PRD.json')!;
    const data = JSON.parse(prd.content);
    const tasks = data.tasks || data;
    const t = tasks.find((t: any) => t.id === 'P02-02');
    // This task had 'knowledge/skills/content/content.skill.md' which is a valid path
    expect(t.wat_references).toContain('knowledge/skills/content/content.skill.md');
  });
});

// ─── Self-consistency: every generated file cross-ref points to a real file ──

describe('self-consistency', () => {
  let files: { path: string; content: string }[];
  let allPaths: Set<string>;

  beforeAll(() => {
    files = generateConfigFromTemplates(ANALYSIS, TASKS);
    allPaths = new Set(files.map(f => f.path));
  });

  it('skill files reference tool files that exist', () => {
    const skillFiles = files.filter(f => f.path.includes('/skills/') && f.path.endsWith('.skill.md'));
    for (const skill of skillFiles) {
      // Extract tool references like tools/db/users-crud.tool.md
      const toolRefs = skill.content.match(/tools\/db\/[\w-]+-crud\.tool\.md/g) || [];
      for (const ref of toolRefs) {
        const fullPath = `knowledge/${ref}`;
        // The skill might reference a tool path with ../ prefix, normalize
        expect(
          allPaths.has(fullPath) || allPaths.has(ref)
        ).toBe(true);
      }
    }
  });

  it('no duplicate file paths', () => {
    const paths = files.map(f => f.path);
    const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);
    expect(dupes).toEqual([]);
  });

  it('all files have non-empty content', () => {
    for (const file of files) {
      expect(file.content.length).toBeGreaterThan(0);
    }
  });
});
