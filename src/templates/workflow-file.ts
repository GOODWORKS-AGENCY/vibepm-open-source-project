/**
 * Workflow file generators following the complete WAT Framework.
 * Every workflow step MUST have 5 sub-sections: Action, Tool, Input, Output, Failure.
 * Four archetypes: Shared/Infrastructure, Domain/Module, High-Risk, AI Agent.
 */

export function generateWorkflowFile(
  name: string,
  moduleName: string,
  steps: string[]
): string {
  const moduleSlug = moduleName.toLowerCase().replace(/\s+/g, '-');
  const nameSlug = name.toLowerCase().replace(/\s+/g, '-');

  const stepsContent = steps.map((s, i) => `### Step ${i + 1}: ${s}
- **Action**: ${s} — execute the operation with proper validation
- **Tool**: \`db/${moduleSlug}-crud\` or relevant tool file
- **Input**: Data from ${i === 0 ? 'trigger event' : `Step ${i}`}, validated against schema
- **Output**: ${i + 1 < steps.length ? `Result passed to Step ${i + 2}` : 'Final result, workflow complete'}
- **Failure**: Log error with context. ${i === 0 ? 'Halt workflow, notify user.' : 'Attempt rollback of previous steps. Notify user with error details.'}`).join('\n\n');

  return `# ${name}

## Metadata
- **ID**: \`${nameSlug}\`
- **Trigger**: User action or system event in ${moduleName} module
- **Risk Level**: Medium
- **Modules Involved**: ${moduleName}
- **Skills Used**: \`${moduleSlug}/${moduleSlug}\`
- **Tools Used**: \`db/${moduleSlug}-crud\`

---

## Objective

Execute the ${name} process in the ${moduleName} module, ensuring all steps complete in order with proper validation, error handling, and audit logging.

## Preconditions

- User is authenticated with appropriate permissions
- Organization context is available
- Required entities exist in the database

---

## Steps

${stepsContent}

---

## Outputs

- All steps completed successfully
- Audit trail entries created for each step
- Dashboard statistics recalculated if applicable
- Downstream modules notified via cascade triggers

---

## Cascade Effects

- **Analytics update**: Recalculate relevant aggregates and dashboards
- **Notification**: Send notification to relevant stakeholders if configured
- **Audit**: Complete audit trail with all step details

---

## Edge Cases

- **Concurrent execution**: Use database transactions to prevent race conditions
- **Partial failure**: If step N fails after step N-1 succeeds, rollback where possible
- **Missing dependencies**: If a required entity doesn't exist, return clear error before starting

---

## Rollback

- **Database operations**: Wrapped in transaction — full rollback on failure
- **External API calls**: Non-reversible — log for manual resolution
- **Notifications**: Non-reversible — acceptable (user sees extra notification)
- **Audit entries**: Never rolled back — audit is append-only
`;
}

/**
 * Generates a SHARED WORKFLOW file for cross-cutting infrastructure processes.
 * Shared workflows are not tied to a single module — they orchestrate across modules.
 */
export function generateSharedWorkflowFile(
  name: string,
  description: string,
  steps: string[],
  modulesInvolved: string[]
): string {
  const nameSlug = name.toLowerCase().replace(/\s+/g, '-');

  const stepsContent = steps.map((s, i) => `### Step ${i + 1}: ${s}
- **Action**: ${s} — execute the cross-cutting operation
- **Tool**: Relevant tool file for this step
- **Input**: Data from ${i === 0 ? 'trigger event' : `Step ${i}`}
- **Output**: ${i + 1 < steps.length ? `Result passed to Step ${i + 2}` : 'Final result, workflow complete'}
- **Failure**: ${i === 0 ? 'Halt workflow, notify initiator.' : 'Log error, attempt rollback of previous steps, notify initiator.'}`).join('\n\n');

  return `# ${name}

> **${description}**

## Metadata
- **ID**: \`shared/${nameSlug}\`
- **Type**: Shared / Infrastructure
- **Trigger**: System event, schedule, or cross-module cascade
- **Risk Level**: High (affects multiple modules)
- **Modules Involved**: ${modulesInvolved.join(', ')}
- **Skills Used**: ${modulesInvolved.map(m => `\`${m.toLowerCase().replace(/\s+/g, '-')}/${m.toLowerCase().replace(/\s+/g, '-')}\``).join(', ')}

---

## Objective

${description}

This workflow spans multiple modules and requires coordination across domain boundaries. It is triggered by system-level events rather than single-module user actions.

## Preconditions

- System is in a healthy state (no ongoing migrations or maintenance)
- All involved modules are accessible
- Required permissions are available for cross-module operations
- Audit logging is operational

---

## Steps

${stepsContent}

---

## Outputs

- All steps completed successfully across all involved modules
- Cross-module consistency verified
- Audit trail entries created for each step
- Downstream notifications sent

---

## Cascade Effects

${modulesInvolved.map(m => `- **${m}**: State updated, aggregates recalculated`).join('\n')}
- **Audit**: Complete cross-module audit trail
- **Notifications**: Stakeholders notified of completion or failure

---

## Edge Cases

- **Partial module failure**: If one module fails mid-workflow, rollback completed steps where possible, mark workflow as \`partial_failure\`
- **Concurrent execution**: Prevent duplicate runs with execution locking (idempotency key)
- **Module unavailability**: If a module is down, queue the step for retry with exponential backoff
- **Data inconsistency**: Run consistency check after completion, flag discrepancies for manual review

---

## Rollback

- **Database operations**: Each step wrapped in module-scoped transaction
- **Cross-module state**: Compensating transactions for completed steps
- **External effects**: Non-reversible (notifications, webhooks) — log for manual resolution
- **Audit entries**: Never rolled back — audit is append-only
`;
}

/**
 * Generates the WORKFLOW INDEX (workflows.md) following the complete framework.
 */
export function generateWorkflowIndex(
  workflows: { name: string; module: string; risk: string }[],
  sharedWorkflows: { name: string; description: string; risk: string }[] = []
): string {
  // Group by module
  const byModule: Record<string, typeof workflows> = {};
  workflows.forEach(w => {
    if (!byModule[w.module]) byModule[w.module] = [];
    byModule[w.module].push(w);
  });

  const sharedRows = sharedWorkflows.map(w => {
    const nameSlug = w.name.toLowerCase().replace(/\s+/g, '-');
    return `| ${w.name} | workflows/shared/${nameSlug}.workflow.md | ${w.risk} | ${w.description} |`;
  }).join('\n');

  const sections = Object.entries(byModule).map(([module, wfs]) => {
    const moduleSlug = module.toLowerCase().replace(/\s+/g, '-');
    const rows = wfs.map(w => {
      const nameSlug = w.name.toLowerCase().replace(/\s+/g, '-');
      return `| ${w.name} | workflows/${moduleSlug}/${nameSlug}.workflow.md | ${w.risk} | \`${moduleSlug}/${moduleSlug}\` | \`db/${moduleSlug}-crud\` |`;
    }).join('\n');

    return `## ${module} Workflows (${wfs.length})

| Workflow | File | Risk Level | Key Skills | Key Tools |
|----------|------|------------|------------|-----------|
${rows}`;
  }).join('\n\n');

  const total = workflows.length + sharedWorkflows.length;

  return `# Workflow Index

Auto-generated index of all workflow files in the knowledge base.

## Shared Workflows (${sharedWorkflows.length})

<!-- ANNOTATION: Cross-cutting workflows that span multiple modules.
     These handle infrastructure-level processes like cascade evaluation,
     data synchronization, and system-wide operations. -->

| Workflow | File | Risk Level | Description |
|----------|------|------------|-------------|
${sharedRows || '| (none yet) | — | — | — |'}

${sections || '## Module Workflows (0)\n\n| Workflow | File | Risk Level | Key Skills | Key Tools |\n|----------|------|------------|------------|-----------|'}

**Total: ${total} workflow files** (${sharedWorkflows.length} shared + ${workflows.length} module)
`;
}
