import { Task } from '@/types/project';

/**
 * PRD.json task schema — matches the complete framework reference.
 *
 * Field reference:
 * | Field         | Type       | Description                                          |
 * |---------------|------------|------------------------------------------------------|
 * | id            | string     | Unique task identifier (kebab-case)                  |
 * | description   | string     | What to build                                        |
 * | passes        | boolean    | Does the test_command pass? (updated as work progresses) |
 * | priority      | number     | 1–100, higher = do first                             |
 * | dependencies  | string[]   | Task IDs that must pass first                        |
 * | category      | string     | Phase/group (e.g., phase1-foundation)                |
 * | files         | string[]   | Files this task creates or modifies                  |
 * | test_command  | string     | How to verify the task is done                       |
 * | blockedBy     | string[]   | Tasks that currently block this one                  |
 * | model         | string     | Recommended AI model (opus, sonnet, haiku)           |
 * | assignee      | string     | Which agent owns this task                           |
 */
export interface PRDTask {
  id: string;
  description: string;
  passes: boolean;
  priority: number;
  dependencies: string[];
  category: string;
  files: string[];
  test_command: string;
  blockedBy: string[];
  model: string;
  assignee: string;
  wat_references: string[];
}

export function generatePrdJson(tasks: Task[]): string {
  const prdTasks: PRDTask[] = tasks.map(t => ({
    id: t.taskCode,
    description: t.description || t.title,
    passes: false,
    priority: t.priority,
    dependencies: t.dependencies,
    category: t.phase,
    files: [],
    test_command: 'npx tsc --noEmit && npm run build',
    blockedBy: t.dependencies,
    model: t.priority >= 90 ? 'opus' : t.priority >= 50 ? 'sonnet' : 'haiku',
    assignee: t.assignedTo || 'agent-1',
    wat_references: t.watReferences,
  }));

  return JSON.stringify(
    {
      version: '1.0.0',
      generated: new Date().toISOString(),
      total_tasks: prdTasks.length,
      phases: [...new Set(tasks.map(t => t.phase))],
      tasks: prdTasks,
    },
    null,
    2
  );
}
