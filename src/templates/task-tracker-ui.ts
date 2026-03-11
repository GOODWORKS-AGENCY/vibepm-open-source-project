/**
 * Task Tracker UI generators — produces the React code artifacts
 * that make the task system visual and interactive.
 *
 * Generates:
 * - useProjectTasks hook (data fetching + mutations + stats + gamification)
 * - Query key factory fragment
 * - ProgressRing component
 * - TaskCard component
 * - ProjectTasksPage (full page with filters + stats + task list)
 * - Route registration snippet
 */

/**
 * Generates the useProjectTasks React hook.
 * Handles: task CRUD, level fetching, stats computation, status mutations.
 */
export function generateUseProjectTasksHook(): string {
  return `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'  // ← Your Supabase client path

// ┌─────────────────────────────────────────────────────────────┐
// │ CUSTOMIZE: Replace with your generated Database type import  │
// │ If you don't have generated types, define interfaces below   │
// └─────────────────────────────────────────────────────────────┘
// import type { Database } from '@/types/database.types'
// type ProjectTask = Database['public']['Tables']['project_tasks']['Row']
// type ProjectLevel = Database['public']['Tables']['project_levels']['Row']

// Fallback interfaces (use if you don't have generated types yet)
interface ProjectTask {
  id: string
  task_code: string
  title: string
  description: string | null
  phase: string
  category: string
  assigned_to: string
  status: string
  priority: number
  progress_pct: number | null
  xp_reward: number | null
  dependencies: string[] | null
  wat_references: string[] | null
  started_at: string | null
  completed_at: string | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
}

interface ProjectLevel {
  id: number
  level: number
  title: string
  xp_required: number
  badge_emoji: string | null
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked'

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  pending: number
  blocked: number
  totalXp: number
  earnedXp: number
  overallProgress: number
  phaseStats: Record<string, { total: number; completed: number; progress: number }>
  agentStats: Record<string, { total: number; completed: number }>
}

// ┌─────────────────────────────────────────────────────────────┐
// │ CUSTOMIZE: Your query key factory. Merge into your existing  │
// │ key factory if you have one, or use this standalone.         │
// └─────────────────────────────────────────────────────────────┘
const QUERY_KEYS = {
  all: ['projectTasks'] as const,
  list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.all, 'list', filters] as const,
  levels: () => [...QUERY_KEYS.all, 'levels'] as const,
}

function computeStats(tasks: ProjectTask[]): TaskStats {
  const completed = tasks.filter(t => t.status === 'completed')
  const inProgress = tasks.filter(t => t.status === 'in_progress')
  const pending = tasks.filter(t => t.status === 'pending')
  const blocked = tasks.filter(t => t.status === 'blocked')

  const totalXp = tasks.reduce((sum, t) => sum + (t.xp_reward ?? 0), 0)
  const earnedXp = completed.reduce((sum, t) => sum + (t.xp_reward ?? 0), 0)

  // Phase breakdown
  const phases = [...new Set(tasks.map(t => t.phase))]
  const phaseStats: TaskStats['phaseStats'] = {}
  for (const phase of phases) {
    const phaseTasks = tasks.filter(t => t.phase === phase)
    const phaseCompleted = phaseTasks.filter(t => t.status === 'completed')
    phaseStats[phase] = {
      total: phaseTasks.length,
      completed: phaseCompleted.length,
      progress: phaseTasks.length > 0
        ? Math.round((phaseCompleted.length / phaseTasks.length) * 100)
        : 0,
    }
  }

  // Agent breakdown
  const agents = [...new Set(tasks.map(t => t.assigned_to))]
  const agentStats: TaskStats['agentStats'] = {}
  for (const agent of agents) {
    agentStats[agent] = {
      total: tasks.filter(t => t.assigned_to === agent).length,
      completed: completed.filter(t => t.assigned_to === agent).length,
    }
  }

  return {
    total: tasks.length,
    completed: completed.length,
    inProgress: inProgress.length,
    pending: pending.length,
    blocked: blocked.length,
    totalXp,
    earnedXp,
    overallProgress: tasks.length > 0
      ? Math.round((completed.length / tasks.length) * 100)
      : 0,
    phaseStats,
    agentStats,
  }
}

function getCurrentLevel(
  earnedXp: number,
  levels: ProjectLevel[]
): ProjectLevel | undefined {
  const sorted = [...levels].sort((a, b) => b.xp_required - a.xp_required)
  return sorted.find(l => earnedXp >= l.xp_required) ?? sorted[sorted.length - 1]
}

function getNextLevel(
  earnedXp: number,
  levels: ProjectLevel[]
): ProjectLevel | null {
  const sorted = [...levels].sort((a, b) => a.xp_required - b.xp_required)
  return sorted.find(l => l.xp_required > earnedXp) ?? null
}

export function useProjectTasks(filters?: {
  phase?: string
  status?: string
  assigned_to?: string
}) {
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: QUERY_KEYS.list(filters as Record<string, unknown>),
    queryFn: async (): Promise<ProjectTask[]> => {
      let query = supabase
        .from('project_tasks')
        .select('*')
        .order('priority', { ascending: false })

      if (filters?.phase) query = query.eq('phase', filters.phase)
      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to)

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })

  const { data: levels = [] } = useQuery({
    queryKey: QUERY_KEYS.levels(),
    queryFn: async (): Promise<ProjectLevel[]> => {
      const { data, error } = await supabase
        .from('project_levels')
        .select('*')
        .order('level', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })

  const stats = computeStats(tasks)
  const currentLevel = getCurrentLevel(stats.earnedXp, levels)
  const nextLevel = getNextLevel(stats.earnedXp, levels)

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskCode, status }: { taskCode: string; status: TaskStatus }) => {
      const updates: Record<string, unknown> = { status }
      if (status === 'completed') {
        updates.progress_pct = 100
        updates.completed_at = new Date().toISOString()
      } else if (status === 'in_progress') {
        updates.started_at = new Date().toISOString()
      }
      const { error } = await supabase
        .from('project_tasks')
        .update(updates)
        .eq('task_code', taskCode)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all })
    },
  })

  const updateTaskProgress = useMutation({
    mutationFn: async ({ taskCode, progress }: { taskCode: string; progress: number }) => {
      const { error } = await supabase
        .from('project_tasks')
        .update({ progress_pct: progress })
        .eq('task_code', taskCode)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all })
    },
  })

  return {
    tasks,
    levels,
    stats,
    currentLevel,
    nextLevel,
    isLoading: tasksLoading,
    updateTaskStatus,
    updateTaskProgress,
  }
}
`;
}

/**
 * Generates the query key factory fragment for merging into existing key factories.
 */
export function generateQueryKeys(): string {
  return `// In your existing query-keys.ts
export const queryKeys = {
  // ... your existing keys ...

  projectTasks: {
    all: ['projectTasks'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.projectTasks.all, 'list', filters] as const,
    levels: () => [...queryKeys.projectTasks.all, 'levels'] as const,
    stats: () => [...queryKeys.projectTasks.all, 'stats'] as const,
  },
}
`;
}

/**
 * Generates the ProgressRing SVG component.
 */
export function generateProgressRingComponent(): string {
  return `interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={\`relative \${className ?? ''}\`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-2xl font-bold">{progress}%</span>
        <span className="text-xs text-muted-foreground">Complete</span>
      </div>
    </div>
  )
}

export default ProgressRing
`;
}

/**
 * Generates the TaskCard component with status toggle, badges, and XP display.
 */
export function generateTaskCardComponent(): string {
  return `// ┌─────────────────────────────────────────────────────────────┐
// │ CUSTOMIZE: Replace shadcn imports with your UI library,      │
// │ or use plain HTML elements with Tailwind classes.            │
// └─────────────────────────────────────────────────────────────┘
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Circle, Clock, AlertCircle, Play, RotateCcw } from 'lucide-react'

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked'

interface TaskCardProps {
  task: {
    task_code: string
    title: string
    description: string | null
    status: string
    assigned_to: string
    xp_reward: number | null
    dependencies: string[] | null
    wat_references: string[] | null
  }
  onStatusChange: (taskCode: string, status: TaskStatus) => void
  // ┌─────────────────────────────────────────────────────────────┐
  // │ CUSTOMIZE: Map of agent name → short label for the badge    │
  // └─────────────────────────────────────────────────────────────┘
  agentLabels?: Record<string, string>
}

const STATUS_CONFIG = {
  completed:   { icon: CheckCircle2, label: 'Done',    color: 'text-green-500', bg: 'bg-green-500/10' },
  in_progress: { icon: Clock,        label: 'Active',  color: 'text-blue-500',  bg: 'bg-blue-500/10' },
  pending:     { icon: Circle,       label: 'Todo',    color: 'text-muted-foreground', bg: '' },
  blocked:     { icon: AlertCircle,  label: 'Blocked', color: 'text-red-500',   bg: 'bg-red-500/10' },
} as const

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  pending:     'in_progress',
  in_progress: 'completed',
  completed:   'pending',
  blocked:     'in_progress',
}

const DEFAULT_AGENT_LABELS: Record<string, string> = {
  'agent-1': 'A1',
  'agent-2': 'A2',
}

const TaskCard = ({
  task,
  onStatusChange,
  agentLabels = DEFAULT_AGENT_LABELS,
}: TaskCardProps) => {
  const status = task.status as TaskStatus
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  const StatusIcon = config.icon

  return (
    <Card className={\`transition-colors \${config.bg}\`}>
      <CardContent className="flex items-start gap-3 py-3 px-4">
        {/* Status toggle */}
        <button
          onClick={() => onStatusChange(task.task_code, NEXT_STATUS[status])}
          className={\`mt-0.5 shrink-0 \${config.color} hover:opacity-70 transition-opacity\`}
        >
          <StatusIcon className="size-5" />
        </button>

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{task.task_code}</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {agentLabels[task.assigned_to] ?? task.assigned_to}
            </Badge>
            {task.xp_reward && task.xp_reward > 0 && (
              <span className="text-[10px] text-amber-500 font-medium">+{task.xp_reward} XP</span>
            )}
          </div>
          <p className={\`text-sm font-medium leading-tight \${
            status === 'completed' ? 'line-through text-muted-foreground' : ''
          }\`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {task.dependencies.map(dep => (
                <span key={dep} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
                  {dep}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard
`;
}

/**
 * Generates the full ProjectTasksPage with filters, stats, and task list.
 */
export function generateProjectTasksPage(phases: string[]): string {
  const phaseOptions = phases.map(p =>
    `  { value: '${p}', label: '${p.replace(/^phase/, 'Phase ').replace(/(\d+)/, (_, n) => n + ':')}' },`
  ).join('\n');

  return `// ┌─────────────────────────────────────────────────────────────┐
// │ CUSTOMIZE: Adjust imports, phase list, and agent labels      │
// │ to match your project structure.                              │
// └─────────────────────────────────────────────────────────────┘
import { useState } from 'react'
import { useProjectTasks } from '../hooks/useProjectTasks'
import TaskCard from '../components/TaskCard'
import ProgressRing from '../components/ProgressRing'

const PHASES = [
  { value: '', label: 'All Phases' },
${phaseOptions}
]

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
]

export default function ProjectTasksPage() {
  const [phase, setPhase] = useState('')
  const [status, setStatus] = useState('')

  const {
    tasks,
    stats,
    currentLevel,
    nextLevel,
    isLoading,
    updateTaskStatus,
  } = useProjectTasks({
    phase: phase || undefined,
    status: status || undefined,
  })

  if (isLoading) return <div className="p-8 text-center">Loading tasks...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header: Progress + Level */}
      <div className="flex items-center gap-6">
        <ProgressRing progress={stats.overallProgress} />
        <div>
          <h1 className="text-2xl font-bold">Project Tracker</h1>
          <p className="text-muted-foreground">
            {stats.completed}/{stats.total} tasks completed
          </p>
          {currentLevel && (
            <p className="text-sm mt-1">
              {currentLevel.badge_emoji} Level {currentLevel.level}: {currentLevel.title}
              <span className="text-muted-foreground ml-2">
                ({stats.earnedXp} XP{nextLevel ? \` / \${nextLevel.xp_required} XP\` : ''})
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border p-3 text-center">
          <div className="text-2xl font-bold">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="rounded-lg border p-3 text-center bg-blue-500/5">
          <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        <div className="rounded-lg border p-3 text-center bg-green-500/5">
          <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="rounded-lg border p-3 text-center bg-red-500/5">
          <div className="text-2xl font-bold text-red-500">{stats.blocked}</div>
          <div className="text-xs text-muted-foreground">Blocked</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={phase}
          onChange={e => setPhase(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          {PHASES.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          {STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard
            key={task.task_code}
            task={task}
            onStatusChange={(taskCode, newStatus) =>
              updateTaskStatus.mutate({ taskCode, status: newStatus })
            }
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No tasks match the current filters.
          </p>
        )}
      </div>
    </div>
  )
}
`;
}

/**
 * Generates the route registration snippet for the project tracker page.
 */
export function generateRouteRegistration(): string {
  return `// Add to your routes configuration (e.g., src/app/routes.tsx)
import { lazy } from 'react'

const ProjectTasksPage = lazy(() =>
  import('@/features/project-tracker/pages/ProjectTasksPage')
)

// Add this route inside your router config:
// {
//   path: '/project-tracker',
//   element: <ProjectTasksPage />,
// }
`;
}
