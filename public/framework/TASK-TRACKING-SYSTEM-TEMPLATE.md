**\# AI-Driven Task Tracking System — Integration Template**

\> A plug-and-play task management system with gamification, AI agent coordination, and phase-based project tracking. Works with any Supabase \+ React project — greenfield or brownfield.

\---

**\#\# Table of Contents**

1\. \[Overview\](\#1-overview)  
2\. \[Prerequisites\](\#2-prerequisites)  
3\. \[Architecture\](\#3-architecture)  
4\. \[Installation\](\#4-installation)  
   \- 4a. \[Database Setup (Migration)\](\#4a-database-setup-migration)  
   \- 4b. \[React Hook\](\#4b-react-hook)  
   \- 4c. \[Query Keys\](\#4c-query-keys)  
   \- 4d. \[UI Components\](\#4d-ui-components)  
   \- 4e. \[Page & Route\](\#4e-page--route)  
5\. \[Configuration\](\#5-configuration)  
   \- 5a. \[Customize Gamification Levels\](\#5a-customize-gamification-levels)  
   \- 5b. \[Customize Agent Names\](\#5b-customize-agent-names)  
   \- 5c. \[Customize Categories\](\#5c-customize-categories)  
   \- 5d. \[Customize Statuses\](\#5d-customize-statuses)  
6\. \[Usage\](\#6-usage)  
   \- 6a. \[Creating Your First Phase\](\#6a-creating-your-first-phase)  
   \- 6b. \[The Task Protocol\](\#6b-the-task-protocol)  
   \- 6c. \[Dependency Management\](\#6c-dependency-management)  
   \- 6d. \[Knowledge File References\](\#6d-knowledge-file-references)  
   \- 6e. \[Completing a Phase\](\#6e-completing-a-phase)  
7\. \[AI Agent Integration\](\#7-ai-agent-integration)  
   \- 7a. \[Agent Instructions Template\](\#7a-agent-instructions-template)  
   \- 7b. \[Multi-Agent Coordination\](\#7b-multi-agent-coordination)  
8\. \[Greenfield vs Brownfield Guide\](\#8-greenfield-vs-brownfield-guide)  
9\. \[Database Reference\](\#9-database-reference)  
10\. \[React API Reference\](\#10-react-api-reference)  
11\. \[Migration Templates\](\#11-migration-templates)  
12\. \[SQL Cheat Sheet\](\#12-sql-cheat-sheet)

\---

**\#\# 1\. Overview**

This system gives you:

\- **\*\*A \`project\_tasks\` table\*\*** in PostgreSQL (via Supabase) as the single source of truth for all work  
\- **\*\*Phase-based organization\*\*** — group tasks into milestones with dependencies between them  
\- **\*\*Gamification\*\*** — XP rewards and leveling system to track project momentum  
\- **\*\*AI agent coordination\*\*** — multiple AI agents (Claude Code, Codex, Cursor, etc.) pick tasks from the same queue  
\- **\*\*A React dashboard\*\*** — visual tracker with filters, progress rings, and status management  
\- **\*\*Migration-driven task seeding\*\*** — tasks are version-controlled SQL, not ephemeral sticky notes

**\#\#\# When to use this**

\- You're building with AI agents and need them to know what to work on next  
\- You want structured, dependency-aware task tracking inside your database  
\- You want gamified progress tracking for long-running projects  
\- You're coordinating multiple AI agents or humans on the same codebase

\---

**\#\# 2\. Prerequisites**

| Requirement | Why |  
|-------------|-----|  
| **\*\*Supabase project\*\*** | PostgreSQL database \+ auth \+ RLS |  
| **\*\*React \+ TypeScript\*\*** | UI dashboard |  
| **\*\*TanStack Query\*\*** | Data fetching (can be swapped — see notes) |  
| **\*\*Tailwind CSS\*\*** | Styling (can be swapped) |  
| **\*\*shadcn/ui\*\*** | UI components (optional — plain HTML works too) |

**\#\#\# Brownfield note**

If you already have these dependencies, skip to \[Section 4: Installation\](\#4-installation). If you're using a different ORM, state manager, or CSS framework, each section has **\*\*"Swap Notes"\*\*** explaining what to change.

\---

**\#\# 3\. Architecture**

\`\`\`  
YOUR PROJECT  
\============

┌──────────────────────────────────────────────────────────────────┐  
│                                                                  │  
│  plans/\*.md                Phase plans (context for AI agents)   │  
│         ↓                                                        │  
│  migrations/               SQL that seeds tasks into DB          │  
│         ↓                                                        │  
│  project\_tasks table       Source of truth for status/progress   │  
│         ↓                                                        │  
│  /project-tracker UI       Dashboard for humans to see progress  │  
│                                                                  │  
│  Agent config files        Tell AI agents to follow the protocol │  
│  knowledge/ (optional)     Domain context loaded per task        │  
│                                                                  │  
└──────────────────────────────────────────────────────────────────┘  
\`\`\`

**\#\#\# Data flow**

1\. You **\*\*define tasks in a SQL migration\*\*** (version-controlled, reproducible)  
2\. Tasks live in the **\*\*\`project\_tasks\` table\*\*** (source of truth)  
3\. AI agents **\*\*query the table\*\*** to find their next task, mark it in-progress, then mark it done  
4\. Humans **\*\*view progress\*\*** in the \`/project-tracker\` dashboard  
5\. When a phase is done, a **\*\*completion migration\*\*** stamps everything as complete

\---

**\#\# 4\. Installation**

**\#\#\# 4a. Database Setup (Migration)**

Create a new migration file in your Supabase migrations folder. Adjust the filename numbering to fit your project.

**\*\*File: \`supabase/migrations/XXXXX\_project\_tasks.sql\`\*\***

\`\`\`sql  
\-- XXXXX\_project\_tasks.sql  
\-- Project task tracking with gamification  
\-- Integration template — customize CHECK constraints, levels, and seed data below

\-- \============================================================================  
\-- TABLES  
\-- \============================================================================

CREATE TABLE IF NOT EXISTS public.project\_tasks (  
  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  task\_code       TEXT NOT NULL UNIQUE,  
  title           TEXT NOT NULL,  
  description     TEXT,  
  phase           TEXT NOT NULL,  
  category        TEXT NOT NULL,  
  assigned\_to     TEXT NOT NULL DEFAULT 'agent-1'  
    CHECK (assigned\_to IN (  
      \-- ┌─────────────────────────────────────────────┐  
      \-- │ CUSTOMIZE: Add your agent names here         │  
      \-- └─────────────────────────────────────────────┘  
      'agent-1', 'agent-2'  
    )),  
  status          TEXT NOT NULL DEFAULT 'pending'  
    CHECK (status IN ('pending', 'in\_progress', 'completed', 'blocked')),  
  priority        INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 100),  
  progress\_pct    INTEGER DEFAULT 0 CHECK (progress\_pct BETWEEN 0 AND 100),  
  xp\_reward       INTEGER DEFAULT 10,  
  dependencies    TEXT\[\] DEFAULT '{}',  
  wat\_references  TEXT\[\] DEFAULT '{}',  
  started\_at      TIMESTAMPTZ,  
  completed\_at    TIMESTAMPTZ,  
  notes           TEXT,  
  created\_at      TIMESTAMPTZ DEFAULT now(),  
  updated\_at      TIMESTAMPTZ DEFAULT now()  
);

CREATE TABLE IF NOT EXISTS public.project\_levels (  
  id           SERIAL PRIMARY KEY,  
  level        INTEGER NOT NULL UNIQUE,  
  title        TEXT NOT NULL,  
  xp\_required  INTEGER NOT NULL,  
  badge\_emoji  TEXT  
);

\-- \============================================================================  
\-- INDEXES  
\-- \============================================================================

CREATE INDEX IF NOT EXISTS idx\_project\_tasks\_phase    ON public.project\_tasks(phase);  
CREATE INDEX IF NOT EXISTS idx\_project\_tasks\_status   ON public.project\_tasks(status);  
CREATE INDEX IF NOT EXISTS idx\_project\_tasks\_assigned ON public.project\_tasks(assigned\_to);  
CREATE INDEX IF NOT EXISTS idx\_project\_tasks\_priority ON public.project\_tasks(priority DESC);

\-- \============================================================================  
\-- TRIGGER: auto-update updated\_at  
\-- \============================================================================  
\-- NOTE: If you already have a handle\_updated\_at() function, skip this block.  
\-- Most Supabase projects create one in an early migration.

\-- CREATE OR REPLACE FUNCTION public.handle\_updated\_at()  
\-- RETURNS TRIGGER AS $$  
\-- BEGIN  
\--   NEW.updated\_at \= now();  
\--   RETURN NEW;  
\-- END;  
\-- $$ LANGUAGE plpgsql;

CREATE TRIGGER set\_project\_tasks\_updated\_at  
  BEFORE UPDATE ON public.project\_tasks  
  FOR EACH ROW EXECUTE FUNCTION public.handle\_updated\_at();

\-- \============================================================================  
\-- ROW LEVEL SECURITY  
\-- \============================================================================  
\-- Project tasks are global (not org-scoped). All authenticated users can  
\-- read and manage them. Adjust these policies if you need stricter access.

ALTER TABLE public.project\_tasks ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.project\_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project\_tasks\_select" ON public.project\_tasks  
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "project\_tasks\_insert" ON public.project\_tasks  
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "project\_tasks\_update" ON public.project\_tasks  
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "project\_levels\_select" ON public.project\_levels  
  FOR SELECT TO authenticated USING (true);

\-- \============================================================================  
\-- SEED: Gamification Levels  
\-- \============================================================================  
\-- Customize titles, XP thresholds, and emojis to fit your project's vibe.

INSERT INTO public.project\_levels (level, title, xp\_required, badge\_emoji) VALUES  
  (1,  'Apprentice',    0,     '🔰'),  
  (2,  'Builder',       100,   '🔨'),  
  (3,  'Craftsman',     250,   '⚒️'),  
  (4,  'Engineer',      500,   '⚙️'),  
  (5,  'Specialist',    800,   '🎯'),  
  (6,  'Expert',        1200,  '💎'),  
  (7,  'Master',        1700,  '🏆'),  
  (8,  'Visionary',     2300,  '🔮'),  
  (9,  'Architect',     3000,  '🏛️'),  
  (10, 'Legend',         4000,  '👑')  
ON CONFLICT (level) DO NOTHING;  
\`\`\`

**\*\*Push it:\*\***

\`\`\`bash  
npx supabase db push  
\`\`\`

\> **\*\*Brownfield note\*\***: If you use raw Prisma, Drizzle, or Knex migrations instead of Supabase CLI, translate the SQL into your migration format. The schema is standard PostgreSQL — nothing Supabase-specific except the RLS policies.

\---

**\#\#\# 4b. React Hook**

Create the data-fetching hook. Adjust the import paths to match your project structure.

**\*\*File: \`src/features/project-tracker/hooks/useProjectTasks.ts\`\*\***

\`\`\`ts  
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'  
import { supabase } from '@/lib/supabase'  // ← Your Supabase client path

// ┌─────────────────────────────────────────────────────────────┐  
// │ CUSTOMIZE: Replace with your generated Database type import  │  
// │ If you don't have generated types, define interfaces below   │  
// └─────────────────────────────────────────────────────────────┘  
// import type { Database } from '@/types/database.types'  
// type ProjectTask \= Database\['public'\]\['Tables'\]\['project\_tasks'\]\['Row'\]  
// type ProjectLevel \= Database\['public'\]\['Tables'\]\['project\_levels'\]\['Row'\]

// Fallback interfaces (use if you don't have generated types yet)  
interface ProjectTask {  
  id: string  
  task\_code: string  
  title: string  
  description: string | null  
  phase: string  
  category: string  
  assigned\_to: string  
  status: string  
  priority: number  
  progress\_pct: number | null  
  xp\_reward: number | null  
  dependencies: string\[\] | null  
  wat\_references: string\[\] | null  
  started\_at: string | null  
  completed\_at: string | null  
  notes: string | null  
  created\_at: string | null  
  updated\_at: string | null  
}

interface ProjectLevel {  
  id: number  
  level: number  
  title: string  
  xp\_required: number  
  badge\_emoji: string | null  
}

type TaskStatus \= 'pending' | 'in\_progress' | 'completed' | 'blocked'

export interface TaskStats {  
  total: number  
  completed: number  
  inProgress: number  
  pending: number  
  blocked: number  
  totalXp: number  
  earnedXp: number  
  overallProgress: number  
  phaseStats: Record\<string, { total: number; completed: number; progress: number }\>  
  agentStats: Record\<string, { total: number; completed: number }\>  
}

// ┌─────────────────────────────────────────────────────────────┐  
// │ CUSTOMIZE: Your query key factory. Merge into your existing  │  
// │ key factory if you have one, or use this standalone.         │  
// └─────────────────────────────────────────────────────────────┘  
const QUERY\_KEYS \= {  
  all: \['projectTasks'\] as const,  
  list: (filters?: Record\<string, unknown\>) \=\> \[...QUERY\_KEYS.all, 'list', filters\] as const,  
  levels: () \=\> \[...QUERY\_KEYS.all, 'levels'\] as const,  
}

function computeStats(tasks: ProjectTask\[\]): TaskStats {  
  const completed \= tasks.filter(t \=\> t.status \=== 'completed')  
  const inProgress \= tasks.filter(t \=\> t.status \=== 'in\_progress')  
  const pending \= tasks.filter(t \=\> t.status \=== 'pending')  
  const blocked \= tasks.filter(t \=\> t.status \=== 'blocked')

  const totalXp \= tasks.reduce((sum, t) \=\> sum \+ (t.xp\_reward ?? 0), 0)  
  const earnedXp \= completed.reduce((sum, t) \=\> sum \+ (t.xp\_reward ?? 0), 0)

  // Phase breakdown  
  const phases \= \[...new Set(tasks.map(t \=\> t.phase))\]  
  const phaseStats: TaskStats\['phaseStats'\] \= {}  
  for (const phase of phases) {  
    const phaseTasks \= tasks.filter(t \=\> t.phase \=== phase)  
    const phaseCompleted \= phaseTasks.filter(t \=\> t.status \=== 'completed')  
    phaseStats\[phase\] \= {  
      total: phaseTasks.length,  
      completed: phaseCompleted.length,  
      progress: phaseTasks.length \> 0  
        ? Math.round((phaseCompleted.length / phaseTasks.length) \* 100)  
        : 0,  
    }  
  }

  // Agent breakdown  
  const agents \= \[...new Set(tasks.map(t \=\> t.assigned\_to))\]  
  const agentStats: TaskStats\['agentStats'\] \= {}  
  for (const agent of agents) {  
    agentStats\[agent\] \= {  
      total: tasks.filter(t \=\> t.assigned\_to \=== agent).length,  
      completed: completed.filter(t \=\> t.assigned\_to \=== agent).length,  
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
    overallProgress: tasks.length \> 0  
      ? Math.round((completed.length / tasks.length) \* 100)  
      : 0,  
    phaseStats,  
    agentStats,  
  }  
}

function getCurrentLevel(  
  earnedXp: number,  
  levels: ProjectLevel\[\]  
): ProjectLevel | undefined {  
  const sorted \= \[...levels\].sort((a, b) \=\> b.xp\_required \- a.xp\_required)  
  return sorted.find(l \=\> earnedXp \>= l.xp\_required) ?? sorted\[sorted.length \- 1\]  
}

function getNextLevel(  
  earnedXp: number,  
  levels: ProjectLevel\[\]  
): ProjectLevel | null {  
  const sorted \= \[...levels\].sort((a, b) \=\> a.xp\_required \- b.xp\_required)  
  return sorted.find(l \=\> l.xp\_required \> earnedXp) ?? null  
}

export function useProjectTasks(filters?: {  
  phase?: string  
  status?: string  
  assigned\_to?: string  
}) {  
  const queryClient \= useQueryClient()

  const { data: tasks \= \[\], isLoading: tasksLoading } \= useQuery({  
    queryKey: QUERY\_KEYS.list(filters as Record\<string, unknown\>),  
    queryFn: async (): Promise\<ProjectTask\[\]\> \=\> {  
      let query \= supabase  
        .from('project\_tasks')  
        .select('\*')  
        .order('priority', { ascending: false })

      if (filters?.phase) query \= query.eq('phase', filters.phase)  
      if (filters?.status) query \= query.eq('status', filters.status)  
      if (filters?.assigned\_to) query \= query.eq('assigned\_to', filters.assigned\_to)

      const { data, error } \= await query  
      if (error) throw error  
      return data ?? \[\]  
    },  
  })

  const { data: levels \= \[\] } \= useQuery({  
    queryKey: QUERY\_KEYS.levels(),  
    queryFn: async (): Promise\<ProjectLevel\[\]\> \=\> {  
      const { data, error } \= await supabase  
        .from('project\_levels')  
        .select('\*')  
        .order('level', { ascending: true })  
      if (error) throw error  
      return data ?? \[\]  
    },  
  })

  const stats \= computeStats(tasks)  
  const currentLevel \= getCurrentLevel(stats.earnedXp, levels)  
  const nextLevel \= getNextLevel(stats.earnedXp, levels)

  const updateTaskStatus \= useMutation({  
    mutationFn: async ({ taskCode, status }: { taskCode: string; status: TaskStatus }) \=\> {  
      const updates: Record\<string, unknown\> \= { status }  
      if (status \=== 'completed') {  
        updates.progress\_pct \= 100  
        updates.completed\_at \= new Date().toISOString()  
      } else if (status \=== 'in\_progress') {  
        updates.started\_at \= new Date().toISOString()  
      }  
      const { error } \= await supabase  
        .from('project\_tasks')  
        .update(updates)  
        .eq('task\_code', taskCode)  
      if (error) throw error  
    },  
    onSuccess: () \=\> {  
      queryClient.invalidateQueries({ queryKey: QUERY\_KEYS.all })  
    },  
  })

  const updateTaskProgress \= useMutation({  
    mutationFn: async ({ taskCode, progress }: { taskCode: string; progress: number }) \=\> {  
      const { error } \= await supabase  
        .from('project\_tasks')  
        .update({ progress\_pct: progress })  
        .eq('task\_code', taskCode)  
      if (error) throw error  
    },  
    onSuccess: () \=\> {  
      queryClient.invalidateQueries({ queryKey: QUERY\_KEYS.all })  
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
\`\`\`

\> **\*\*Swap notes\*\***:  
\> \- **\*\*No TanStack Query?\*\*** Replace \`useQuery\`/\`useMutation\` with \`useEffect\` \+ \`useState\` or SWR equivalents.  
\> \- **\*\*No Supabase client?\*\*** Replace the \`supabase.from(...)\` calls with your ORM or fetch calls.  
\> \- **\*\*Generated types?\*\*** Replace the fallback interfaces with your \`Database\['public'\]\['Tables'\]\['project\_tasks'\]\['Row'\]\` type.

\---

**\#\#\# 4c. Query Keys**

If you already have a query key factory, merge this into it:

\`\`\`ts  
// In your existing query-keys.ts  
export const queryKeys \= {  
  // ... your existing keys ...

  projectTasks: {  
    all: \['projectTasks'\] as const,  
    list: (filters?: Record\<string, unknown\>) \=\>  
      \[...queryKeys.projectTasks.all, 'list', filters\] as const,  
    levels: () \=\> \[...queryKeys.projectTasks.all, 'levels'\] as const,  
    stats: () \=\> \[...queryKeys.projectTasks.all, 'stats'\] as const,  
  },  
}  
\`\`\`

If you don't have a factory yet, the hook above includes standalone keys — you're fine.

\---

**\#\#\# 4d. UI Components**

Three components \+ one page. All use Tailwind \+ shadcn/ui. Swap instructions provided.

**\#\#\#\# ProgressRing.tsx**

**\*\*File: \`src/features/project-tracker/components/ProgressRing.tsx\`\*\***

\`\`\`tsx  
interface ProgressRingProps {  
  progress: number  
  size?: number  
  strokeWidth?: number  
  className?: string  
}

const ProgressRing \= ({  
  progress,  
  size \= 120,  
  strokeWidth \= 8,  
  className,  
}: ProgressRingProps) \=\> {  
  const radius \= (size \- strokeWidth) / 2  
  const circumference \= radius \* 2 \* Math.PI  
  const offset \= circumference \- (progress / 100) \* circumference

  return (  
    \<div className\={\`relative ${className ?? ''}\`}\>  
      \<svg width\={size} height\={size} className\="-rotate-90"\>  
        {/\* Background circle \*/}  
        \<circle  
          cx\={size / 2}  
          cy\={size / 2}  
          r\={radius}  
          fill\="none"  
          stroke\="currentColor"  
          strokeWidth\={strokeWidth}  
          className\="text-muted"  
        /\>  
        {/\* Progress arc \*/}  
        \<circle  
          cx\={size / 2}  
          cy\={size / 2}  
          r\={radius}  
          fill\="none"  
          stroke\="currentColor"  
          strokeWidth\={strokeWidth}  
          strokeDasharray\={circumference}  
          strokeDashoffset\={offset}  
          strokeLinecap\="round"  
          className\="text-primary transition-all duration-500"  
        /\>  
      \</svg\>  
      \<div  
        className\="absolute inset-0 flex flex-col items-center justify-center"  
        style\={{ width: size, height: size }}  
      \>  
        \<span className\="text-2xl font-bold"\>{progress}%\</span\>  
        \<span className\="text-xs text-muted-foreground"\>Complete\</span\>  
      \</div\>  
    \</div\>  
  )  
}

export default ProgressRing  
\`\`\`

**\#\#\#\# TaskCard.tsx**

**\*\*File: \`src/features/project-tracker/components/TaskCard.tsx\`\*\***

\`\`\`tsx  
// ┌─────────────────────────────────────────────────────────────┐  
// │ CUSTOMIZE: Replace shadcn imports with your UI library,      │  
// │ or use plain HTML elements with Tailwind classes.            │  
// └─────────────────────────────────────────────────────────────┘  
import { Badge } from '@/components/ui/badge'  
import { Button } from '@/components/ui/button'  
import { Card, CardContent } from '@/components/ui/card'  
import { CheckCircle2, Circle, Clock, AlertCircle, Play, RotateCcw } from 'lucide-react'

type TaskStatus \= 'pending' | 'in\_progress' | 'completed' | 'blocked'

interface TaskCardProps {  
  task: {  
    task\_code: string  
    title: string  
    description: string | null  
    status: string  
    assigned\_to: string  
    xp\_reward: number | null  
    dependencies: string\[\] | null  
    wat\_references: string\[\] | null  
  }  
  onStatusChange: (taskCode: string, status: TaskStatus) \=\> void  
  // ┌─────────────────────────────────────────────────────────────┐  
  // │ CUSTOMIZE: Map of agent name → short label for the badge    │  
  // └─────────────────────────────────────────────────────────────┘  
  agentLabels?: Record\<string, string\>  
}

const STATUS\_CONFIG \= {  
  completed:   { icon: CheckCircle2, label: 'Done',    color: 'text-green-500', bg: 'bg-green-500/10' },  
  in\_progress: { icon: Clock,        label: 'Active',  color: 'text-blue-500',  bg: 'bg-blue-500/10' },  
  pending:     { icon: Circle,       label: 'Todo',    color: 'text-muted-foreground', bg: '' },  
  blocked:     { icon: AlertCircle,  label: 'Blocked', color: 'text-red-500',   bg: 'bg-red-500/10' },  
} as const

const NEXT\_STATUS: Record\<TaskStatus, TaskStatus\> \= {  
  pending:     'in\_progress',  
  in\_progress: 'completed',  
  completed:   'pending',  
  blocked:     'in\_progress',  
}

const DEFAULT\_AGENT\_LABELS: Record\<string, string\> \= {  
  'agent-1': 'A1',  
  'agent-2': 'A2',  
}

const TaskCard \= ({  
  task,  
  onStatusChange,  
  agentLabels \= DEFAULT\_AGENT\_LABELS,  
}: TaskCardProps) \=\> {  
  const status \= task.status as TaskStatus  
  const config \= STATUS\_CONFIG\[status\] ?? STATUS\_CONFIG.pending  
  const StatusIcon \= config.icon

  return (  
    \<Card className\={\`transition-colors ${config.bg}\`}\>  
      \<CardContent className\="flex items-start gap-3 py-3 px-4"\>  
        {/\* Status toggle \*/}  
        \<button  
          onClick\={() \=\> onStatusChange(task.task\_code, NEXT\_STATUS\[status\])}  
          className\={\`mt-0.5 shrink-0 ${config.color} hover:opacity-70 transition-opacity\`}  
        \>  
          \<StatusIcon className\="size-5" /\>  
        \</button\>

        {/\* Task info \*/}  
        \<div className\="flex-1 min-w-0"\>  
          \<div className\="flex items-center gap-2 mb-1"\>  
            \<span className\="text-xs font-mono text-muted-foreground"\>{task.task\_code}\</span\>  
            \<Badge variant\="secondary" className\="text-\[10px\] h-4 px-1.5"\>  
              {agentLabels\[task.assigned\_to\] ?? task.assigned\_to}  
            \</Badge\>  
            \<span className\="text-xs text-muted-foreground ml-auto"\>  
              \+{task.xp\_reward ?? 0} XP  
            \</span\>  
          \</div\>  
          \<p className\={\`text-sm font-medium ${status \=== 'completed' ? 'line-through text-muted-foreground' : ''}\`}\>  
            {task.title}  
          \</p\>  
          {task.description && (  
            \<p className\="text-xs text-muted-foreground mt-1 line-clamp-2"\>  
              {task.description}  
            \</p\>  
          )}  
          {task.dependencies && task.dependencies.length \> 0 && (  
            \<div className\="flex items-center gap-1 mt-1.5"\>  
              \<span className\="text-\[10px\] text-muted-foreground"\>Deps:\</span\>  
              {task.dependencies.map(dep \=\> (  
                \<span key\={dep} className\="text-\[10px\] font-mono text-muted-foreground"\>  
                  {dep}  
                \</span\>  
              ))}  
            \</div\>  
          )}  
        \</div\>

        {/\* Action buttons \*/}  
        \<div className\="flex flex-col gap-1 shrink-0"\>  
          {status \=== 'pending' && (  
            \<Button  
              variant\="ghost" size\="sm" className\="h-7 px-2 text-xs"  
              onClick\={() \=\> onStatusChange(task.task\_code, 'in\_progress')}  
            \>  
              \<Play className\="size-3 mr-1" /\> Start  
            \</Button\>  
          )}  
          {status \=== 'completed' && (  
            \<Button  
              variant\="ghost" size\="sm" className\="h-7 px-2 text-xs"  
              onClick\={() \=\> onStatusChange(task.task\_code, 'pending')}  
            \>  
              \<RotateCcw className\="size-3 mr-1" /\> Undo  
            \</Button\>  
          )}  
        \</div\>  
      \</CardContent\>  
    \</Card\>  
  )  
}

export default TaskCard  
\`\`\`

**\#\#\#\# ProgressDashboard.tsx**

**\*\*File: \`src/features/project-tracker/components/ProgressDashboard.tsx\`\*\***

\`\`\`tsx  
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'  
import { Badge } from '@/components/ui/badge'  
import ProgressRing from './ProgressRing'  
import type { TaskStats } from '../hooks/useProjectTasks'

interface ProgressDashboardProps {  
  stats: TaskStats  
  currentLevel?: { level: number; title: string; badge\_emoji: string | null; xp\_required: number }  
  nextLevel?: { title: string; xp\_required: number } | null  
  // ┌─────────────────────────────────────────────────────────────┐  
  // │ CUSTOMIZE: Map of phase value → human-readable label        │  
  // └─────────────────────────────────────────────────────────────┘  
  phaseLabels?: Record\<string, string\>  
}

const ProgressDashboard \= ({  
  stats,  
  currentLevel,  
  nextLevel,  
  phaseLabels \= {},  
}: ProgressDashboardProps) \=\> {  
  const xpToNext \= nextLevel ? nextLevel.xp\_required \- stats.earnedXp : 0  
  const xpProgressInLevel \=  
    nextLevel && currentLevel  
      ? ((stats.earnedXp \- currentLevel.xp\_required) /  
          (nextLevel.xp\_required \- currentLevel.xp\_required)) \*  
        100  
      : 100

  return (  
    \<div className\="grid gap-4 md:grid-cols-2 lg:grid-cols-4"\>  
      {/\* Overall Progress \*/}  
      \<Card\>  
        \<CardHeader className\="pb-2"\>  
          \<CardTitle className\="text-sm font-medium text-muted-foreground"\>  
            Overall Progress  
          \</CardTitle\>  
        \</CardHeader\>  
        \<CardContent className\="flex items-center justify-center"\>  
          \<ProgressRing progress\={stats.overallProgress} /\>  
        \</CardContent\>  
      \</Card\>

      {/\* Level & XP \*/}  
      \<Card\>  
        \<CardHeader className\="pb-2"\>  
          \<CardTitle className\="text-sm font-medium text-muted-foreground"\>  
            Level & XP  
          \</CardTitle\>  
        \</CardHeader\>  
        \<CardContent\>  
          \<div className\="flex items-center gap-3 mb-3"\>  
            \<span className\="text-3xl"\>{currentLevel?.badge\_emoji ?? '🔰'}\</span\>  
            \<div\>  
              \<p className\="font-semibold text-lg"\>  
                Lv.{currentLevel?.level ?? 1} {currentLevel?.title ?? 'Apprentice'}  
              \</p\>  
              \<p className\="text-sm text-muted-foreground"\>  
                {stats.earnedXp} / {stats.totalXp} XP  
              \</p\>  
            \</div\>  
          \</div\>  
          {nextLevel && (  
            \<div\>  
              \<div className\="flex justify-between text-xs text-muted-foreground mb-1"\>  
                \<span\>Next: {nextLevel.title}\</span\>  
                \<span\>{xpToNext} XP to go\</span\>  
              \</div\>  
              \<div className\="h-2 rounded-full bg-muted overflow-hidden"\>  
                \<div  
                  className\="h-full rounded-full bg-primary transition-all duration-500"  
                  style\={{ width: \`${Math.min(xpProgressInLevel, 100)}%\` }}  
                /\>  
              \</div\>  
            \</div\>  
          )}  
        \</CardContent\>  
      \</Card\>

      {/\* Task Counts \*/}  
      \<Card\>  
        \<CardHeader className\="pb-2"\>  
          \<CardTitle className\="text-sm font-medium text-muted-foreground"\>  
            Task Status  
          \</CardTitle\>  
        \</CardHeader\>  
        \<CardContent\>  
          \<div className\="space-y-2"\>  
            \<div className\="flex justify-between items-center"\>  
              \<span className\="text-sm"\>Completed\</span\>  
              \<Badge variant\="default"\>{stats.completed}\</Badge\>  
            \</div\>  
            \<div className\="flex justify-between items-center"\>  
              \<span className\="text-sm"\>In Progress\</span\>  
              \<Badge variant\="secondary"\>{stats.inProgress}\</Badge\>  
            \</div\>  
            \<div className\="flex justify-between items-center"\>  
              \<span className\="text-sm"\>Pending\</span\>  
              \<Badge variant\="outline"\>{stats.pending}\</Badge\>  
            \</div\>  
            \<div className\="flex justify-between items-center"\>  
              \<span className\="text-sm"\>Blocked\</span\>  
              \<Badge variant\="destructive"\>{stats.blocked}\</Badge\>  
            \</div\>  
          \</div\>  
        \</CardContent\>  
      \</Card\>

      {/\* Agent Delegation \*/}  
      \<Card\>  
        \<CardHeader className\="pb-2"\>  
          \<CardTitle className\="text-sm font-medium text-muted-foreground"\>  
            Agent Delegation  
          \</CardTitle\>  
        \</CardHeader\>  
        \<CardContent\>  
          \<div className\="space-y-3"\>  
            {Object.entries(stats.agentStats).map((\[agent, data\]) \=\> (  
              \<div key\={agent}\>  
                \<div className\="flex justify-between text-sm mb-1"\>  
                  \<span\>{agent}\</span\>  
                  \<span className\="text-muted-foreground"\>  
                    {data.completed}/{data.total}  
                  \</span\>  
                \</div\>  
                \<div className\="h-2 rounded-full bg-muted overflow-hidden"\>  
                  \<div  
                    className\="h-full rounded-full bg-primary transition-all duration-500"  
                    style\={{  
                      width: \`${data.total ? (data.completed / data.total) \* 100 : 0}%\`,  
                    }}  
                  /\>  
                \</div\>  
              \</div\>  
            ))}  
          \</div\>  
        \</CardContent\>  
      \</Card\>

      {/\* Phase Progress (full width) \*/}  
      \<Card className\="md:col-span-2 lg:col-span-4"\>  
        \<CardHeader className\="pb-2"\>  
          \<CardTitle className\="text-sm font-medium text-muted-foreground"\>  
            Phase Progress  
          \</CardTitle\>  
        \</CardHeader\>  
        \<CardContent\>  
          \<div className\="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"\>  
            {Object.entries(stats.phaseStats).map((\[phase, data\]) \=\> (  
              \<div key\={phase}\>  
                \<div className\="flex justify-between text-xs mb-1"\>  
                  \<span className\="font-medium truncate"\>  
                    {phaseLabels\[phase\] ?? phase}  
                  \</span\>  
                  \<span className\="text-muted-foreground ml-2"\>  
                    {data.completed}/{data.total}  
                  \</span\>  
                \</div\>  
                \<div className\="h-2 rounded-full bg-muted overflow-hidden"\>  
                  \<div  
                    className\="h-full rounded-full bg-primary transition-all duration-500"  
                    style\={{ width: \`${data.progress}%\` }}  
                  /\>  
                \</div\>  
              \</div\>  
            ))}  
          \</div\>  
        \</CardContent\>  
      \</Card\>  
    \</div\>  
  )  
}

export default ProgressDashboard  
\`\`\`

\---

**\#\#\# 4e. Page & Route**

**\*\*File: \`src/pages/project-tracker/ProjectTasksPage.tsx\`\*\***

\`\`\`tsx  
import { useState } from 'react'  
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'  
import { useProjectTasks } from '@/features/project-tracker/hooks/useProjectTasks'  
import ProgressDashboard from '@/features/project-tracker/components/ProgressDashboard'  
import TaskCard from '@/features/project-tracker/components/TaskCard'

type TaskStatus \= 'pending' | 'in\_progress' | 'completed' | 'blocked'

// ┌─────────────────────────────────────────────────────────────┐  
// │ CUSTOMIZE: Define YOUR phases here                           │  
// └─────────────────────────────────────────────────────────────┘  
const PHASES \= \[  
  { value: 'all', label: 'All Phases' },  
  { value: 'phase1', label: 'Phase 1: Setup' },  
  // Add your phases...  
\]

// ┌─────────────────────────────────────────────────────────────┐  
// │ CUSTOMIZE: Define YOUR agent names here                      │  
// └─────────────────────────────────────────────────────────────┘  
const AGENTS \= \[  
  { value: 'all', label: 'All Agents' },  
  { value: 'agent-1', label: 'Agent 1' },  
  { value: 'agent-2', label: 'Agent 2' },  
\]

// For the dashboard phase labels  
const PHASE\_LABELS: Record\<string, string\> \= Object.fromEntries(  
  PHASES.filter(p \=\> p.value \!== 'all').map(p \=\> \[p.value, p.label\])  
)

// For the task card agent badges  
const AGENT\_LABELS: Record\<string, string\> \= {  
  'agent-1': 'A1',  
  'agent-2': 'A2',  
}

const ProjectTasksPage \= () \=\> {  
  const \[selectedPhase, setSelectedPhase\] \= useState('all')  
  const \[statusFilter, setStatusFilter\] \= useState\<string\>('all')  
  const \[agentFilter, setAgentFilter\] \= useState\<string\>('all')

  const filters \= {  
    ...(selectedPhase \!== 'all' && { phase: selectedPhase }),  
    ...(statusFilter \!== 'all' && { status: statusFilter }),  
    ...(agentFilter \!== 'all' && { assigned\_to: agentFilter }),  
  }

  const { tasks: allTasks, stats, currentLevel, nextLevel, isLoading } \=  
    useProjectTasks()  
  const { tasks: filteredTasks, updateTaskStatus } \= useProjectTasks(  
    Object.keys(filters).length \> 0 ? filters : undefined  
  )

  const handleStatusChange \= (taskCode: string, status: TaskStatus) \=\> {  
    updateTaskStatus.mutate({ taskCode, status })  
  }

  if (isLoading) {  
    return (  
      \<div className\="flex h-full items-center justify-center"\>  
        \<div className\="text-sm text-muted-foreground"\>Loading tasks...\</div\>  
      \</div\>  
    )  
  }

  return (  
    \<div className\="space-y-6 p-6"\>  
      \<div\>  
        \<h1 className\="text-2xl font-bold tracking-tight"\>Project Tracker\</h1\>  
        \<p className\="text-sm text-muted-foreground"\>  
          {allTasks.length} tasks — from foundation to launch  
        \</p\>  
      \</div\>

      \<ProgressDashboard  
        stats\={stats}  
        currentLevel\={currentLevel}  
        nextLevel\={nextLevel}  
        phaseLabels\={PHASE\_LABELS}  
      /\>

      {/\* Filters \*/}  
      \<div className\="flex flex-wrap items-center gap-3"\>  
        \<select  
          value\={selectedPhase}  
          onChange\={e \=\> setSelectedPhase(e.target.value)}  
          className\="h-9 rounded-md border border-input bg-background px-3 text-sm"  
        \>  
          {PHASES.map(p \=\> (  
            \<option key\={p.value} value\={p.value}\>{p.label}\</option\>  
          ))}  
        \</select\>

        \<select  
          value\={statusFilter}  
          onChange\={e \=\> setStatusFilter(e.target.value)}  
          className\="h-9 rounded-md border border-input bg-background px-3 text-sm"  
        \>  
          \<option value\="all"\>All Statuses\</option\>  
          \<option value\="pending"\>Pending\</option\>  
          \<option value\="in\_progress"\>In Progress\</option\>  
          \<option value\="completed"\>Completed\</option\>  
          \<option value\="blocked"\>Blocked\</option\>  
        \</select\>

        \<select  
          value\={agentFilter}  
          onChange\={e \=\> setAgentFilter(e.target.value)}  
          className\="h-9 rounded-md border border-input bg-background px-3 text-sm"  
        \>  
          {AGENTS.map(a \=\> (  
            \<option key\={a.value} value\={a.value}\>{a.label}\</option\>  
          ))}  
        \</select\>  
      \</div\>

      {/\* Task views \*/}  
      \<Tabs defaultValue\="list" className\="w-full"\>  
        \<TabsList\>  
          \<TabsTrigger value\="list"\>Task List\</TabsTrigger\>  
          \<TabsTrigger value\="by-phase"\>By Phase\</TabsTrigger\>  
        \</TabsList\>

        \<TabsContent value\="list"\>  
          \<div className\="space-y-2 mt-4"\>  
            {filteredTasks.length \=== 0 ? (  
              \<div className\="py-12 text-center text-sm text-muted-foreground"\>  
                No tasks match your filters.  
              \</div\>  
            ) : (  
              filteredTasks.map(task \=\> (  
                \<TaskCard  
                  key\={task.id}  
                  task\={task}  
                  onStatusChange\={handleStatusChange}  
                  agentLabels\={AGENT\_LABELS}  
                /\>  
              ))  
            )}  
          \</div\>  
        \</TabsContent\>

        \<TabsContent value\="by-phase"\>  
          \<div className\="space-y-6 mt-4"\>  
            {PHASES.filter(p \=\> p.value \!== 'all').map(phase \=\> {  
              const phaseTasks \= filteredTasks.filter(t \=\> t.phase \=== phase.value)  
              if (phaseTasks.length \=== 0) return null  
              return (  
                \<div key\={phase.value}\>  
                  \<div className\="flex items-center gap-2 mb-3"\>  
                    \<h3 className\="font-semibold text-sm"\>{phase.label}\</h3\>  
                    \<span className\="text-xs text-muted-foreground"\>  
                      {phaseTasks.filter(t \=\> t.status \=== 'completed').length}/  
                      {phaseTasks.length}  
                    \</span\>  
                  \</div\>  
                  \<div className\="space-y-2"\>  
                    {phaseTasks.map(task \=\> (  
                      \<TaskCard  
                        key\={task.id}  
                        task\={task}  
                        onStatusChange\={handleStatusChange}  
                        agentLabels\={AGENT\_LABELS}  
                      /\>  
                    ))}  
                  \</div\>  
                \</div\>  
              )  
            })}  
          \</div\>  
        \</TabsContent\>  
      \</Tabs\>  
    \</div\>  
  )  
}

export default ProjectTasksPage  
\`\`\`

**\*\*Add the route\*\*** (example for React Router v6):

\`\`\`tsx  
// In your routes file  
import { lazy } from 'react'  
const ProjectTasksPage \= lazy(() \=\> import('@/pages/project-tracker/ProjectTasksPage'))

// Inside your router config:  
{ path: '/project-tracker', element: \<ProjectTasksPage /\> }  
\`\`\`

\---

**\#\# 5\. Configuration**

**\#\#\# 5a. Customize Gamification Levels**

Edit the \`INSERT INTO project\_levels\` block in your migration. You can have as many or few levels as you want.

**\*\*Small project (5 levels):\*\***

\`\`\`sql  
INSERT INTO public.project\_levels (level, title, xp\_required, badge\_emoji) VALUES  
  (1, 'Starter',    0,    '🌱'),  
  (2, 'Builder',    50,   '🔨'),  
  (3, 'Pro',        150,  '⚡'),  
  (4, 'Expert',     350,  '💎'),  
  (5, 'Master',     600,  '👑')  
ON CONFLICT (level) DO NOTHING;  
\`\`\`

**\*\*Large project (15 levels):\*\*** Use the full tier list from Section 4a.

**\*\*No gamification?\*\*** Skip the \`project\_levels\` table entirely and remove level-related code from the hook and dashboard.

**\#\#\# 5b. Customize Agent Names**

Three places to update:

1\. **\*\*Database CHECK constraint\*\*** — in the migration:  
   \`\`\`sql  
   CHECK (assigned\_to IN ('claude-code', 'cursor', 'copilot', 'human'))  
   \`\`\`

2\. **\*\*Page AGENTS array\*\*** — in \`ProjectTasksPage.tsx\`:  
   \`\`\`ts  
   const AGENTS \= \[  
     { value: 'all', label: 'All Agents' },  
     { value: 'claude-code', label: 'Claude Code' },  
     { value: 'cursor', label: 'Cursor' },  
     { value: 'human', label: 'Human' },  
   \]  
   \`\`\`

3\. **\*\*Card AGENT\_LABELS\*\*** — in \`ProjectTasksPage.tsx\`:  
   \`\`\`ts  
   const AGENT\_LABELS \= { 'claude-code': 'CC', cursor: 'CU', human: '👤' }  
   \`\`\`

**\#\#\# 5c. Customize Categories**

The \`category\` field is a free-text column — no CHECK constraint. Use whatever categories make sense for your project:

| Project Type | Example Categories |  
|-------------|-------------------|  
| SaaS startup | \`feature\`, \`bug\`, \`infra\`, \`design\`, \`docs\` |  
| AI/ML project | \`model\`, \`data\`, \`pipeline\`, \`eval\`, \`api\`, \`ui\` |  
| Game dev | \`gameplay\`, \`art\`, \`audio\`, \`networking\`, \`ui\`, \`optimization\` |  
| Agency work | \`client-a\`, \`client-b\`, \`internal\`, \`ops\` |

**\#\#\# 5d. Customize Statuses**

The default four statuses cover most workflows. To add more:

1\. Update the CHECK constraint in the migration:  
   \`\`\`sql  
   CHECK (status IN ('pending', 'in\_progress', 'review', 'completed', 'blocked', 'cancelled'))  
   \`\`\`

2\. Add entries to \`STATUS\_CONFIG\` in \`TaskCard.tsx\`

3\. Update \`NEXT\_STATUS\` transitions in \`TaskCard.tsx\`

4\. Update \`computeStats\` in the hook

\---

**\#\# 6\. Usage**

**\#\#\# 6a. Creating Your First Phase**

**\*\*1. Create a seed migration:\*\***

\`\`\`sql  
\-- supabase/migrations/XXXXX\_phase1\_setup.sql  
INSERT INTO public.project\_tasks (  
  task\_code, title, description, phase, category,  
  assigned\_to, priority, xp\_reward, status, progress\_pct,  
  dependencies, wat\_references  
) VALUES

('P1-01', 'Initialize project scaffolding',  
 'Set up Vite \+ React \+ TypeScript \+ Tailwind \+ Supabase client.',  
 'phase1', 'infra', 'agent-1', 100, 15, 'pending', 0,  
 '{}'::TEXT\[\], '{}'::TEXT\[\]),

('P1-02', 'Set up authentication',  
 'Implement sign up, sign in, sign out with Supabase Auth.',  
 'phase1', 'feature', 'agent-1', 95, 25, 'pending', 0,  
 ARRAY\['P1-01'\], '{}'::TEXT\[\]),

('P1-03', 'Create database schema',  
 'Core tables, RLS policies, audit triggers.',  
 'phase1', 'infra', 'agent-2', 90, 30, 'pending', 0,  
 ARRAY\['P1-01'\], '{}'::TEXT\[\])

ON CONFLICT (task\_code) DO UPDATE SET  
  title \= EXCLUDED.title,  
  description \= EXCLUDED.description;  
\`\`\`

**\*\*2. Push:\*\*** \`npx supabase db push\`

**\*\*3. Register in UI:\*\*** Add \`{ value: 'phase1', label: 'Phase 1: Setup' }\` to the PHASES array.

**\#\#\# 6b. The Task Protocol**

Every work session (human or AI) follows this loop:

\`\`\`  
┌─────────────────────────────────────┐  
│  1\. Query for next pending task     │  
│  2\. Check dependencies are met      │  
│  3\. Mark it in\_progress             │  
│  4\. Load knowledge references       │  
│  5\. Do the work                     │  
│  6\. Verify (type check, build, etc) │  
│  7\. Mark it completed               │  
│  8\. Repeat                          │  
└─────────────────────────────────────┘  
\`\`\`

**\*\*Find next task:\*\***  
\`\`\`sql  
SELECT task\_code, title, priority, dependencies  
FROM project\_tasks  
WHERE status \= 'pending' AND assigned\_to \= 'agent-1'  
ORDER BY priority DESC  
LIMIT 1;  
\`\`\`

**\*\*Claim it:\*\***  
\`\`\`sql  
UPDATE project\_tasks  
SET status \= 'in\_progress', started\_at \= now()  
WHERE task\_code \= 'P1-02';  
\`\`\`

**\*\*Complete it:\*\***  
\`\`\`sql  
UPDATE project\_tasks  
SET status \= 'completed', progress\_pct \= 100, completed\_at \= now()  
WHERE task\_code \= 'P1-02';  
\`\`\`

**\*\*Block it:\*\***  
\`\`\`sql  
UPDATE project\_tasks  
SET status \= 'blocked', notes \= 'Waiting on API keys from client'  
WHERE task\_code \= 'P1-02';  
\`\`\`

**\#\#\# 6c. Dependency Management**

Dependencies are an array of \`task\_code\` strings. A task should not start until all its dependencies are \`completed\`.

\`\`\`sql  
\-- Task P1-02 depends on P1-01  
('P1-02', 'Set up auth', ..., ARRAY\['P1-01'\], ...)

\-- Task P2-04 depends on P2-03 AND P1-20  
('P2-04', 'Members UI', ..., ARRAY\['P2-03', 'P1-20'\], ...)  
\`\`\`

**\*\*Cross-phase dependencies are allowed.\*\*** A Phase 3 task can depend on a Phase 1 task.

**\*\*Checking if a task is ready:\*\***  
\`\`\`sql  
SELECT task\_code FROM project\_tasks  
WHERE task\_code \= ANY(  
  (SELECT dependencies FROM project\_tasks WHERE task\_code \= 'P2-04')  
)  
AND status \!= 'completed';  
\-- 0 rows \= ready to start  
\`\`\`

**\#\#\# 6d. Knowledge File References**

The \`wat\_references\` field is an array of file paths that provide context for the task. This is especially useful for AI agents.

\`\`\`sql  
('P3-01', 'Build CRM module', ...,  
 ARRAY\['docs/crm-spec.md', 'docs/api-contracts.md'\], ...)  
\`\`\`

When an AI agent picks up this task, it loads those files first for domain context.

**\*\*When to use:\*\***  
\- Complex domain tasks that need background knowledge  
\- Tasks that follow a specific spec or design doc  
\- Integration tasks where the agent needs API documentation

**\*\*When to skip:\*\***  
\- Simple bug fixes  
\- CSS/style changes  
\- Configuration changes

**\#\#\# 6e. Completing a Phase**

When all tasks in a phase are done, create a completion migration:

\`\`\`sql  
\-- supabase/migrations/XXXXX\_mark\_phase1\_complete.sql  
UPDATE public.project\_tasks  
SET status \= 'completed', progress\_pct \= 100, completed\_at \= now()  
WHERE phase \= 'phase1' AND status \!= 'completed';  
\`\`\`

This is useful for:  
\- Brownfield integration where you need to mark pre-existing work as done  
\- Batch-closing tasks that were completed outside the system  
\- Keeping the migration history as a record of project milestones

\---

**\#\# 7\. AI Agent Integration**

**\#\#\# 7a. Agent Instructions Template**

Add this to your AI agent's instructions file (\`.claude/CLAUDE.md\`, \`AGENTS.md\`, Cursor rules, etc.):

\`\`\`markdown  
**\#\# Task Tracking Protocol**

Before starting work, query the task database for your next task:

1\. **\*\*Find next task:\*\***  
   \`\`\`sql  
   SELECT task\_code, title, priority, dependencies, wat\_references  
   FROM project\_tasks  
   WHERE status \= 'pending' AND assigned\_to \= '\<YOUR\_AGENT\_NAME\>'  
   ORDER BY priority DESC  
   LIMIT 1;  
   \`\`\`

2\. **\*\*Mark it in\_progress:\*\***  
   \`\`\`sql  
   UPDATE project\_tasks  
   SET status \= 'in\_progress', started\_at \= now()  
   WHERE task\_code \= '\<TASK\_CODE\>';  
   \`\`\`

3\. **\*\*Load knowledge files\*\*** listed in \`wat\_references\` before starting.

4\. **\*\*Do the work.\*\***

5\. **\*\*Verify:\*\***  
   \`\`\`bash  
   npx tsc \--noEmit     \# Type check  
   npm run build         \# Build check  
   \`\`\`

6\. **\*\*Mark complete:\*\***  
   \`\`\`sql  
   UPDATE project\_tasks  
   SET status \= 'completed', progress\_pct \= 100, completed\_at \= now()  
   WHERE task\_code \= '\<TASK\_CODE\>';  
   \`\`\`

7\. **\*\*If blocked:\*\***  
   \`\`\`sql  
   UPDATE project\_tasks  
   SET status \= 'blocked', notes \= '\<REASON\>'  
   WHERE task\_code \= '\<TASK\_CODE\>';  
   \`\`\`  
\`\`\`

\#\#\# 7b. Multi-Agent Coordination

Multiple AI agents can work the same queue safely because:

1\. \*\*Each agent filters by \`assigned\_to\`\*\* — no conflicts on task pickup  
2\. \*\*Unique \`task\_code\` constraint\*\* — impossible to create duplicates  
3\. \*\*Dependencies enforce ordering\*\* — agent B's task won't start until agent A's prerequisite is done  
4\. \*\*Status transitions are atomic\*\* — PostgreSQL handles concurrent updates

\*\*Recommended agent splits:\*\*

| Pattern | Agent 1 | Agent 2 |  
|---------|---------|---------|  
| \*\*Frontend / Backend\*\* | UI components, hooks, pages | DB migrations, API, RLS |  
| \*\*Feature / Infra\*\* | Business logic, user flows | DevOps, CI/CD, monitoring |  
| \*\*Human / AI\*\* | Review, design, architecture | Implementation, testing |

\---

\#\# 8\. Greenfield vs Brownfield Guide

\#\#\# Greenfield (New Project)

1\. Create the migration from Section 4a as one of your first migrations  
2\. Define Phase 1 tasks in the same migration (or a separate one)  
3\. Add the UI components and route  
4\. Start working the task protocol immediately

\*\*Tip:\*\* Your Phase 1 should include the project's foundation tasks (scaffolding, auth, core schema, routing, etc.)

\#\#\# Brownfield (Existing Project)

1\. Create the migration from Section 4a — use \`CREATE TABLE IF NOT EXISTS\` and \`CREATE INDEX IF NOT EXISTS\` to be safe  
2\. \*\*Audit what's already done\*\* — create a seed migration that marks past work as completed:  
   \`\`\`sql  
   INSERT INTO project\_tasks (task\_code, title, phase, category, assigned\_to,  
     priority, xp\_reward, status, progress\_pct, completed\_at)  
   VALUES  
     ('P0-01', 'Initial project setup', 'phase0', 'infra', 'human',  
      100, 15, 'completed', 100, now()),  
     ('P0-02', 'Authentication system', 'phase0', 'feature', 'human',  
      95, 25, 'completed', 100, now()),  
     ('P0-03', 'Core database schema', 'phase0', 'infra', 'human',  
      90, 30, 'completed', 100, now())  
   ON CONFLICT (task\_code) DO NOTHING;  
   \`\`\`  
3\. Define your **\*\*next\*\*** phase as pending tasks  
4\. Drop in the UI components (they're self-contained — no conflicts with existing code)  
5\. Start working the protocol from the current phase onward

**\*\*Brownfield checklist:\*\***

\- \[ \] \`handle\_updated\_at()\` function exists? (Most Supabase projects have it. If not, uncomment the block in the migration.)  
\- \[ \] TanStack Query is installed? (If not, install it or use the swap notes in Section 4b.)  
\- \[ \] Route system supports lazy loading? (If not, import the page directly.)  
\- \[ \] shadcn/ui is installed? (If not, swap Card/Badge/Button with your component library or plain HTML.)

\---

**\#\# 9\. Database Reference**

**\#\#\# project\_tasks — Column Reference**

| Column | Type | Default | Constraint | Description |  
|--------|------|---------|------------|-------------|  
| \`id\` | \`UUID\` | \`gen\_random\_uuid()\` | PK | Row ID |  
| \`task\_code\` | \`TEXT\` | — | \`UNIQUE NOT NULL\` | Human-readable ID: \`P{phase}-{number}\` |  
| \`title\` | \`TEXT\` | — | \`NOT NULL\` | Short imperative description |  
| \`description\` | \`TEXT\` | — | — | Detailed spec, acceptance criteria |  
| \`phase\` | \`TEXT\` | — | \`NOT NULL\` | Phase group: \`phase1\`, \`phase2\`, etc. |  
| \`category\` | \`TEXT\` | — | \`NOT NULL\` | Task type: \`feature\`, \`infra\`, \`ui\`, etc. |  
| \`assigned\_to\` | \`TEXT\` | \`'agent-1'\` | \`CHECK(...)\` | Which agent owns this task |  
| \`status\` | \`TEXT\` | \`'pending'\` | \`CHECK(...)\` | \`pending\`, \`in\_progress\`, \`completed\`, \`blocked\` |  
| \`priority\` | \`INTEGER\` | — | \`1–100\` | Higher \= do first. Ordered \`DESC\` |  
| \`progress\_pct\` | \`INTEGER\` | \`0\` | \`0–100\` | Granular progress (set to 100 on complete) |  
| \`xp\_reward\` | \`INTEGER\` | \`10\` | — | XP earned on completion |  
| \`dependencies\` | \`TEXT\[\]\` | \`'{}'\` | — | Task codes that must finish first |  
| \`wat\_references\` | \`TEXT\[\]\` | \`'{}'\` | — | Knowledge file paths to load |  
| \`notes\` | \`TEXT\` | — | — | Blocker reasons, context |  
| \`started\_at\` | \`TIMESTAMPTZ\` | — | — | Set when moved to \`in\_progress\` |  
| \`completed\_at\` | \`TIMESTAMPTZ\` | — | — | Set when moved to \`completed\` |  
| \`created\_at\` | \`TIMESTAMPTZ\` | \`now()\` | — | Row creation time |  
| \`updated\_at\` | \`TIMESTAMPTZ\` | \`now()\` | — | Auto-updated by trigger |

**\#\#\# project\_levels — Column Reference**

| Column | Type | Default | Constraint | Description |  
|--------|------|---------|------------|-------------|  
| \`id\` | \`SERIAL\` | auto | PK | Row ID |  
| \`level\` | \`INTEGER\` | — | \`UNIQUE NOT NULL\` | Level number (1, 2, 3...) |  
| \`title\` | \`TEXT\` | — | \`NOT NULL\` | Level title (Apprentice, Builder...) |  
| \`xp\_required\` | \`INTEGER\` | — | \`NOT NULL\` | XP threshold to reach this level |  
| \`badge\_emoji\` | \`TEXT\` | — | — | Display emoji |

**\#\#\# Task Lifecycle**

\`\`\`  
  ┌─────────┐     ┌─────────────┐     ┌───────────┐  
  │ pending  │────▶│ in\_progress │────▶│ completed │  
  └─────────┘     └─────────────┘     └───────────┘  
       │                │  
       │                ▼  
       │          ┌─────────┐  
       └─────────▶│ blocked │──────▶ in\_progress (when unblocked)  
                  └─────────┘  
\`\`\`

\---

**\#\# 10\. React API Reference**

**\#\#\# \`useProjectTasks(filters?)\`**

| Parameter | Type | Description |  
|-----------|------|-------------|  
| \`filters.phase\` | \`string\` | Filter by phase (e.g. \`'phase1'\`) |  
| \`filters.status\` | \`string\` | Filter by status (e.g. \`'pending'\`) |  
| \`filters.assigned\_to\` | \`string\` | Filter by agent (e.g. \`'agent-1'\`) |

| Return | Type | Description |  
|--------|------|-------------|  
| \`tasks\` | \`ProjectTask\[\]\` | Filtered list, ordered by priority DESC |  
| \`levels\` | \`ProjectLevel\[\]\` | All gamification levels |  
| \`stats\` | \`TaskStats\` | Computed statistics |  
| \`currentLevel\` | \`ProjectLevel\` | Current level based on earned XP |  
| \`nextLevel\` | \`ProjectLevel \\| null\` | Next level (null if max) |  
| \`isLoading\` | \`boolean\` | Loading state |  
| \`updateTaskStatus\` | \`Mutation\` | \`{ taskCode, status }\` |  
| \`updateTaskProgress\` | \`Mutation\` | \`{ taskCode, progress }\` |

**\#\#\# \`TaskStats\`**

\`\`\`ts  
interface TaskStats {  
  total: number  
  completed: number  
  inProgress: number  
  pending: number  
  blocked: number  
  totalXp: number  
  earnedXp: number  
  overallProgress: number  // 0–100  
  phaseStats: Record\<string, { total: number; completed: number; progress: number }\>  
  agentStats: Record\<string, { total: number; completed: number }\>  
}  
\`\`\`

\---

**\#\# 11\. Migration Templates**

**\#\#\# Seed a new phase**

\`\`\`sql  
\-- XXXXX\_phaseN\_description.sql  
\-- Phase N: \[Name\] — X tasks

INSERT INTO public.project\_tasks (  
  task\_code, title, description, phase, category,  
  assigned\_to, priority, xp\_reward, status, progress\_pct,  
  dependencies, wat\_references  
) VALUES

('PN-01', 'Task title',  
 'What to build. Files to touch. Acceptance criteria.',  
 'phaseN', 'category', 'agent-1', 100, 30, 'pending', 0,  
 '{}'::TEXT\[\], '{}'::TEXT\[\]),

('PN-02', 'Second task',  
 'Description.',  
 'phaseN', 'category', 'agent-2', 95, 25, 'pending', 0,  
 ARRAY\['PN-01'\], ARRAY\['docs/spec.md'\])

ON CONFLICT (task\_code) DO UPDATE SET  
  title       \= EXCLUDED.title,  
  description \= EXCLUDED.description,  
  phase       \= EXCLUDED.phase,  
  category    \= EXCLUDED.category,  
  priority    \= EXCLUDED.priority,  
  xp\_reward   \= EXCLUDED.xp\_reward,  
  dependencies \= EXCLUDED.dependencies;  
\`\`\`

**\#\#\# Mark a phase complete**

\`\`\`sql  
\-- XXXXX\_mark\_phaseN\_complete.sql  
UPDATE public.project\_tasks  
SET status \= 'completed', progress\_pct \= 100, completed\_at \= now()  
WHERE phase \= 'phaseN' AND status \!= 'completed';  
\`\`\`

**\#\#\# Reassign tasks between agents**

\`\`\`sql  
\-- XXXXX\_reassign\_phaseN.sql  
UPDATE public.project\_tasks  
SET assigned\_to \= 'agent-2'  
WHERE phase \= 'phaseN' AND status \= 'pending';  
\`\`\`

**\#\#\# Add more gamification levels**

\`\`\`sql  
\-- XXXXX\_extend\_levels.sql  
INSERT INTO public.project\_levels (level, title, xp\_required, badge\_emoji) VALUES  
  (11, 'Sovereign',    5000, '⚜️'),  
  (12, 'Transcendent', 6000, '✨')  
ON CONFLICT (level) DO NOTHING;  
\`\`\`

**\#\#\# Backfill completed work (brownfield)**

\`\`\`sql  
\-- XXXXX\_backfill\_completed\_work.sql  
INSERT INTO public.project\_tasks (  
  task\_code, title, phase, category,  
  assigned\_to, priority, xp\_reward,  
  status, progress\_pct, completed\_at  
) VALUES  
  ('P0-01', 'Project scaffolding',    'phase0', 'infra',   'human', 100, 15, 'completed', 100, now()),  
  ('P0-02', 'Auth system',            'phase0', 'feature', 'human', 95,  25, 'completed', 100, now()),  
  ('P0-03', 'Core schema',            'phase0', 'infra',   'human', 90,  30, 'completed', 100, now())  
ON CONFLICT (task\_code) DO NOTHING;  
\`\`\`

\---

**\#\# 12\. SQL Cheat Sheet**

\`\`\`sql  
\-- ═══════════════════════════════════════════  
\-- WORKING WITH TASKS  
\-- ═══════════════════════════════════════════

\-- Next pending task (for a specific agent)  
SELECT task\_code, title, priority, dependencies  
FROM project\_tasks  
WHERE status \= 'pending' AND assigned\_to \= 'agent-1'  
ORDER BY priority DESC LIMIT 1;

\-- Start a task  
UPDATE project\_tasks  
SET status \= 'in\_progress', started\_at \= now()  
WHERE task\_code \= 'P1-01';

\-- Complete a task  
UPDATE project\_tasks  
SET status \= 'completed', progress\_pct \= 100, completed\_at \= now()  
WHERE task\_code \= 'P1-01';

\-- Block a task  
UPDATE project\_tasks  
SET status \= 'blocked', notes \= 'Reason here'  
WHERE task\_code \= 'P1-01';

\-- Unblock and resume  
UPDATE project\_tasks  
SET status \= 'in\_progress', notes \= NULL  
WHERE task\_code \= 'P1-01';

\-- ═══════════════════════════════════════════  
\-- REPORTING  
\-- ═══════════════════════════════════════════

\-- Phase progress summary  
SELECT phase,  
  count(\*) as total,  
  count(\*) FILTER (WHERE status \= 'completed') as done,  
  round(100.0 \* count(\*) FILTER (WHERE status \= 'completed') / count(\*)) as pct  
FROM project\_tasks  
GROUP BY phase ORDER BY phase;

\-- Total XP earned  
SELECT sum(xp\_reward) as earned\_xp  
FROM project\_tasks WHERE status \= 'completed';

\-- Current level  
SELECT l.\* FROM project\_levels l  
WHERE l.xp\_required \<= (  
  SELECT COALESCE(sum(xp\_reward), 0) FROM project\_tasks WHERE status \= 'completed'  
)  
ORDER BY l.level DESC LIMIT 1;

\-- Agent workload  
SELECT assigned\_to,  
  count(\*) FILTER (WHERE status \= 'pending') as pending,  
  count(\*) FILTER (WHERE status \= 'in\_progress') as active,  
  count(\*) FILTER (WHERE status \= 'completed') as done  
FROM project\_tasks  
GROUP BY assigned\_to;

\-- Blocked tasks with reasons  
SELECT task\_code, title, notes  
FROM project\_tasks WHERE status \= 'blocked';

\-- Tasks ready to start (all deps met)  
SELECT t.task\_code, t.title, t.priority  
FROM project\_tasks t  
WHERE t.status \= 'pending'  
  AND NOT EXISTS (  
    SELECT 1 FROM unnest(t.dependencies) dep  
    WHERE dep NOT IN (  
      SELECT task\_code FROM project\_tasks WHERE status \= 'completed'  
    )  
  )  
ORDER BY t.priority DESC;

\-- ═══════════════════════════════════════════  
\-- BULK OPERATIONS  
\-- ═══════════════════════════════════════════

\-- Mark entire phase complete  
UPDATE project\_tasks  
SET status \= 'completed', progress\_pct \= 100, completed\_at \= now()  
WHERE phase \= 'phase1' AND status \!= 'completed';

\-- Reassign all pending tasks in a phase  
UPDATE project\_tasks  
SET assigned\_to \= 'agent-2'  
WHERE phase \= 'phase2' AND status \= 'pending';

\-- Reset a phase (re-open all tasks)  
UPDATE project\_tasks  
SET status \= 'pending', progress\_pct \= 0,  
    started\_at \= NULL, completed\_at \= NULL  
WHERE phase \= 'phase3';  
\`\`\`

\---

**\#\# File Checklist**

After integration, you should have these files:

\`\`\`  
your-project/  
├── supabase/migrations/  
│   └── XXXXX\_project\_tasks.sql           ← Schema \+ levels \+ seed  
├── src/  
│   ├── features/project-tracker/  
│   │   ├── hooks/  
│   │   │   └── useProjectTasks.ts        ← Data hook  
│   │   └── components/  
│   │       ├── ProgressRing.tsx           ← SVG ring  
│   │       ├── ProgressDashboard.tsx      ← Stats cards  
│   │       └── TaskCard.tsx               ← Task row  
│   └── pages/project-tracker/  
│       └── ProjectTasksPage.tsx           ← Main page  
└── (your agent config file)              ← Task protocol instructions  
\`\`\`

\---

*\*Template version 1.0 — works with Supabase, React, TanStack Query, Tailwind, shadcn/ui. Adaptable to any stack with the swap notes provided.\**

