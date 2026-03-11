import { Project, Task, GAMIFICATION_LEVELS } from '@/types/project';

const STORAGE_KEY = 'vibepm_projects';

function readAll(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjects(): Project[] {
  return readAll();
}

export function getProject(id: string): Project | undefined {
  return readAll().find(p => p.id === id);
}

export function saveProject(project: Project): Project {
  const all = readAll();
  const idx = all.findIndex(p => p.id === project.id);
  project.updatedAt = new Date().toISOString();
  if (idx >= 0) {
    all[idx] = project;
  } else {
    all.push(project);
  }
  writeAll(all);
  return project;
}

export function createProject(
  name: string,
  description: string,
  stack: Project['stack']
): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: crypto.randomUUID(),
    name,
    description,
    stack,
    phases: [],
    tasks: [],
    knowledgeFiles: [],
    generatedFiles: [],
    xp: { current: 0, level: 1 },
    createdAt: now,
    updatedAt: now,
  };
  const all = readAll();
  all.unshift(project);
  writeAll(all);
  return project;
}

export function deleteProject(id: string): void {
  writeAll(readAll().filter(p => p.id !== id));
}

export function updateTaskStatus(
  projectId: string,
  taskCode: string,
  status: Task['status']
): Project | undefined {
  const project = getProject(projectId);
  if (!project) return undefined;

  const task = project.tasks.find(t => t.taskCode === taskCode);
  if (!task) return undefined;

  task.status = status;
  if (status === 'in_progress') task.startedAt = new Date().toISOString();
  if (status === 'completed') {
    task.completedAt = new Date().toISOString();
    task.progressPct = 100;
    project.xp.current += task.xpReward;
    const sorted = [...GAMIFICATION_LEVELS].sort((a, b) => b.xpRequired - a.xpRequired);
    const lvl = sorted.find(l => project.xp.current >= l.xpRequired);
    if (lvl) project.xp.level = lvl.level;
  }

  return saveProject(project);
}
