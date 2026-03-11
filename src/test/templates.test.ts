import { describe, it, expect } from 'vitest';
import { Module } from '@/types/project';
import { generateSkillFile, generateSharedSkillFile, generateAgentSkillFile, generateSkillIndex } from '@/templates/skill-file';
import { generateDbTool, generateToolIndex } from '@/templates/tool-file';
import { generateProdMd } from '@/templates/prod-md';
import { generateAgentCli } from '@/templates/agent-cli';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MODULE: Module = {
  name: 'Invoicing',
  description: 'Invoice creation, sending, and payment tracking',
  route: '/invoices',
  entities: ['invoices', 'line_items', 'payments'],
  actions: ['Create invoice', 'Send invoice', 'Record payment', 'Void invoice'],
  relatedModules: ['Clients', 'Reports'],
};

const PROJECT = {
  id: '',
  name: 'BillingApp',
  description: 'Billing and invoicing SaaS',
  stack: {
    framework: 'Next.js',
    language: 'TypeScript',
    buildTool: 'Turbopack',
    backend: 'Supabase',
    ui: 'shadcn/ui',
    stateManagement: 'TanStack Query',
    forms: 'react-hook-form',
    validation: 'zod',
  },
  phases: [],
  tasks: [],
  knowledgeFiles: [],
  generatedFiles: [],
  xp: { current: 0, level: 1 },
  createdAt: '',
  updatedAt: '',
};

// ─── Skill File Tests ────────────────────────────────────────────────────────

describe('generateSkillFile', () => {
  const output = generateSkillFile(MODULE);

  it('uses the actual route, not a slugified name', () => {
    expect(output).toContain('/invoices');
    expect(output).not.toContain('/invoicing'); // would be wrong slug
  });

  it('lists all entities', () => {
    expect(output).toContain('invoices');
    expect(output).toContain('line_items');
    expect(output).toContain('payments');
  });

  it('lists all actions with correct format', () => {
    expect(output).toContain('Create invoice');
    expect(output).toContain('Send invoice');
    expect(output).toContain('Record payment');
    expect(output).toContain('Void invoice');
  });

  it('references tool files for entity schemas', () => {
    expect(output).toContain('tools/db/');
    expect(output).toContain('-crud.tool.md');
  });

  it('lists related modules', () => {
    expect(output).toContain('Clients');
    expect(output).toContain('Reports');
  });

  it('does NOT contain generic boilerplate sections', () => {
    // These were in the old template and are now removed
    expect(output).not.toContain('Industry Labels');
    expect(output).not.toContain('monetary amounts');
    expect(output).not.toContain('organization_id'); // schema is in tool files now
  });
});

describe('generateSharedSkillFile', () => {
  const output = generateSharedSkillFile('Authentication', 'Permission model and route guards');

  it('contains the skill name and description', () => {
    expect(output).toContain('Authentication');
    expect(output).toContain('Permission model and route guards');
  });

  it('is marked as cross-cutting', () => {
    expect(output).toContain('cross-cutting');
  });
});

describe('generateAgentSkillFile', () => {
  const output = generateAgentSkillFile(
    'Invoice Assistant',
    'Helps users create and manage invoices',
    ['Draft invoices', 'Calculate totals', 'Send reminders'],
    ['Invoicing', 'Clients']
  );

  it('lists capabilities', () => {
    expect(output).toContain('Draft invoices');
    expect(output).toContain('Calculate totals');
  });

  it('lists accessed modules', () => {
    expect(output).toContain('Invoicing');
    expect(output).toContain('Clients');
  });

  it('includes safety rules', () => {
    expect(output).toContain('Scoped access');
    expect(output).toContain('confirmation');
  });
});

describe('generateSkillIndex', () => {
  const output = generateSkillIndex(
    [MODULE],
    [{ name: 'Invoice Bot', role: 'Drafts invoices' }],
    ['auth', 'audit']
  );

  it('lists the module', () => {
    expect(output).toContain('Invoicing');
  });

  it('lists the agent', () => {
    expect(output).toContain('Invoice Bot');
  });

  it('uses provided shared concerns instead of defaults', () => {
    expect(output).toContain('auth');
    expect(output).toContain('audit');
    // Should NOT fall back to "Authentication" / "Multi-Tenancy" defaults
    expect(output).not.toContain('Multi-Tenancy');
  });

  it('has correct total count', () => {
    // 2 shared + 1 module + 1 agent = 4
    expect(output).toContain('Total: 4');
  });
});

// ─── Tool File Tests ─────────────────────────────────────────────────────────

describe('generateDbTool', () => {
  it('references the owning module when provided', () => {
    const output = generateDbTool('invoices', 'Invoicing', MODULE);
    expect(output).toContain('**Invoicing**');
    expect(output).toContain('invoicing.skill.md');
  });

  it('lists relevant actions from the module', () => {
    const output = generateDbTool('invoices', 'Invoicing', MODULE);
    expect(output).toContain('Create invoice');
  });

  it('lists sibling entities for include[]', () => {
    const output = generateDbTool('invoices', 'Invoicing', MODULE);
    expect(output).toContain('line_items');
    expect(output).toContain('payments');
  });

  it('works without owner module (fallback)', () => {
    const output = generateDbTool('orphan_table', 'Core');
    expect(output).toContain('orphan_table');
    expect(output).toContain('Core');
  });

  it('uses underscore for table name and kebab for file refs', () => {
    const output = generateDbTool('line_items', 'Invoicing', MODULE);
    expect(output).toContain('`line_items`');
  });
});

describe('generateToolIndex', () => {
  const output = generateToolIndex(
    ['invoices', 'line_items'],
    ['Invoicing API'],
    [{ name: 'Invoice View', module: 'Invoicing' }],
    [{ name: 'Payment Processor', description: 'Process payments' }]
  );

  it('lists DB tools', () => {
    expect(output).toContain('invoices CRUD');
    expect(output).toContain('line_items CRUD');
  });

  it('lists API tools', () => {
    expect(output).toContain('Invoicing API');
  });

  it('lists UI tools', () => {
    expect(output).toContain('Invoice View');
  });

  it('lists automation tools', () => {
    expect(output).toContain('Payment Processor');
  });

  it('has correct total', () => {
    // 2 DB + 1 API + 1 UI + 1 automation = 5
    expect(output).toContain('Total: 5');
  });
});

// ─── prod.md Tests ───────────────────────────────────────────────────────────

describe('generateProdMd', () => {
  const modules: Module[] = [
    MODULE,
    {
      name: 'Clients',
      description: 'Client management',
      route: '/clients',
      entities: ['clients'],
      actions: ['Create client', 'Update client'],
      relatedModules: ['Invoicing'],
    },
  ];
  const output = generateProdMd(PROJECT, modules);

  it('uses actual routes', () => {
    expect(output).toContain('/invoices');
    expect(output).toContain('/clients');
  });

  it('deduplicates entities', () => {
    // invoices appears in MODULE, should only be listed once in schema
    const schemaSection = output.split('### Core Tables')[1]?.split('###')[0] || '';
    const invoiceMatches = (schemaSection.match(/`invoices`/g) || []);
    expect(invoiceMatches.length).toBe(1);
  });

  it('includes multi-tenant section for Supabase backend', () => {
    expect(output).toContain('Multi-tenant');
    expect(output).toContain('organization_id');
  });

  it('has accurate knowledge file counts', () => {
    expect(output).toContain('| API Tools | 2 |');
    expect(output).toContain('| UI Tools | 2 |');
  });

  it('omits multi-tenant for non-Supabase backend', () => {
    const localProject = {
      ...PROJECT,
      stack: { ...PROJECT.stack, backend: 'localStorage' },
    };
    const localOutput = generateProdMd(localProject, modules);
    expect(localOutput).not.toContain('Multi-tenant');
    expect(localOutput).not.toContain('organization_id');
  });
});

// ─── Agent CLI Tests ─────────────────────────────────────────────────────────

describe('generateAgentCli', () => {
  const output = generateAgentCli('https://abc.supabase.co');

  it('is a bash script', () => {
    expect(output).toMatch(/^#!/);
    expect(output).toContain('bash');
  });

  it('contains all action handlers', () => {
    expect(output).toContain('next)');
    expect(output).toContain('claim)');
    expect(output).toContain('complete)');
    expect(output).toContain('block)');
    expect(output).toContain('status)');
    expect(output).toContain('loop)');
  });

  it('includes the Supabase URL', () => {
    expect(output).toContain('https://abc.supabase.co');
  });

  it('loop action includes build verification', () => {
    expect(output).toContain('tsc --noEmit');
    expect(output).toContain('npm run build');
  });

  it('loop action includes task claiming and completion', () => {
    // Bash script uses escaped quotes: \"action\":\"claim\"
    expect(output).toContain('action');
    expect(output).toContain('claim');
    expect(output).toContain('complete');
  });

  it('requires authentication', () => {
    expect(output).toContain('SUPABASE_ACCESS_TOKEN');
  });
});
