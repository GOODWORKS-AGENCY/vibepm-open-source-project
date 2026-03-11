import { useState, useMemo, useCallback } from "react";
import { useProjectTasks, ProjectTask } from "@/hooks/useProjectTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  CheckCircle, Clock, AlertTriangle, Pause, Trophy,
  Zap, ArrowUpDown, Filter, RefreshCw, ChevronDown, ChevronRight,
  BookOpen, GitBranch, PlusCircle, FileText, StickyNote
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/hooks/useProjects";
import { GAMIFICATION_LEVELS } from "@/types/project";
import { Upload } from "lucide-react";

// Types
export interface ProjectLevel {
  id: number;
  level: number;
  title: string;
  xp_required: number;
  badge_emoji: string | null;
}

type Status = 'pending' | 'in_progress' | 'completed' | 'blocked';

// Status Config
const statusConfig = {
  pending: { label: "Pending", icon: Pause, color: "bg-muted text-muted-foreground", next: "in_progress" as const },
  in_progress: { label: "In Progress", icon: Clock, color: "bg-vibe-amber/15 text-vibe-amber border-vibe-amber/30", next: "completed" as const },
  completed: { label: "Completed", icon: CheckCircle, color: "bg-accent/15 text-accent border-accent/30", next: "pending" as const },
  blocked: { label: "Blocked", icon: AlertTriangle, color: "bg-vibe-rose/15 text-vibe-rose border-vibe-rose/30", next: "pending" as const },
};

// Category Colors
const categoryColors: Record<string, string> = {
  feature: "bg-primary/10 text-primary border-primary/20",
  infra: "bg-accent/10 text-accent border-accent/20",
  ai: "bg-vibe-glow/10 text-vibe-glow border-vibe-glow/20",
  ui: "bg-vibe-amber/10 text-vibe-amber border-vibe-amber/20",
  orchestration: "bg-vibe-rose/10 text-vibe-rose border-vibe-rose/20",
};

// Progress Ring Component
function ProgressRing({ value, size = 80, stroke = 6 }: { value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--accent))" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-lg font-bold">{value}%</span>
      </div>
    </div>
  );
}

// Seed Phase Dialog Component
function SeedPhaseDialog({ onSeed }: { onSeed: (tasks: Omit<ProjectTask, "id" | "created_at" | "updated_at">[]) => void }) {
  const [phase, setPhase] = useState("");
  const [tasksText, setTasksText] = useState("");
  const [open, setOpen] = useState(false);

  const handleSeed = () => {
    if (!phase || !tasksText.trim()) return;
    const lines = tasksText.trim().split("\n").filter(Boolean);
    const tasks = lines.map((line, i) => {
      const num = String(i + 1).padStart(2, "0");
      const phaseNum = phase.replace(/[^0-9]/g, "") || "1";
      return {
        task_code: `P${phaseNum}-${num}`,
        title: line.trim(),
        description: null,
        phase,
        category: "feature",
        assigned_to: "claude-code",
        status: "pending" as const,
        priority: lines.length - i,
        progress_pct: 0,
        xp_reward: 10,
        dependencies: [] as string[],
        wat_references: [] as string[],
        started_at: null,
        completed_at: null,
        notes: null,
      };
    });
    onSeed(tasks);
    setOpen(false);
    setPhase("");
    setTasksText("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PlusCircle className="h-3.5 w-3.5" /> Seed Phase
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Seed New Phase</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Phase name</Label>
            <Input placeholder="e.g. phase2-features" value={phase} onChange={(e) => setPhase(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Tasks (one per line)</Label>
            <Textarea
              rows={8}
              placeholder={"Implement user dashboard\nAdd search functionality\nCreate settings page"}
              value={tasksText}
              onChange={(e) => setTasksText(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSeed} disabled={!phase || !tasksText.trim()}>
            Seed {tasksText.trim().split("\n").filter(Boolean).length || 0} Tasks
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type StatusFilter = "all" | ProjectTask["status"];
type SortBy = "priority" | "phase" | "xp_reward";

// Helper: map localStorage Task to ProjectTask format
function mapLocalTaskToProjectTask(t: import("@/types/project").Task, projectId?: string): ProjectTask {
  return {
    id: t.taskCode, // use taskCode as pseudo-id for local tasks
    task_code: t.taskCode,
    title: t.title,
    description: t.description || null,
    phase: t.phase,
    category: t.category,
    assigned_to: t.assignedTo || "claude-code",
    status: t.status,
    priority: t.priority,
    progress_pct: t.progressPct,
    xp_reward: t.xpReward,
    dependencies: t.dependencies || [],
    wat_references: t.watReferences || [],
    started_at: t.startedAt || null,
    completed_at: t.completedAt || null,
    notes: t.notes || null,
    project_id: projectId || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export default function ProjectTracker({ projectId }: { projectId?: string } = {}) {
  const {
    tasks: dbTasks, stats: dbStats, currentLevel, nextLevel, phases: dbPhases, isLoading, updateTaskStatus: dbUpdateStatus, seedTasks, refresh,
  } = useProjectTasks(projectId);

  const { project, update: updateLocalProject } = useProject(projectId);
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [pulling, setPulling] = useState(false);

  // Determine data source: DB tasks if available, otherwise localStorage
  const useLocalFallback = dbTasks.length === 0 && project && project.tasks.length > 0;
  const localTasks = useMemo(
    () => (project?.tasks || []).map(t => mapLocalTaskToProjectTask(t, projectId)),
    [project?.tasks, projectId]
  );
  const tasks = useLocalFallback ? localTasks : dbTasks;

  // Recompute stats for local tasks
  const stats = useMemo(() => {
    if (!useLocalFallback) return dbStats;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const totalXp = tasks.reduce((acc, t) => acc + (t.xp_reward || 0), 0);
    const earnedXp = tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + (t.xp_reward || 0), 0);
    return {
      total: tasks.length,
      completed,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
      totalXp,
      earnedXp,
      progressPct: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
    };
  }, [useLocalFallback, dbStats, tasks]);

  const phases = useLocalFallback ? [...new Set(tasks.map(t => t.phase))].sort() : dbPhases;

  // Status update that works for both sources
  const updateTaskStatus = useCallback((taskCode: string, newStatus: ProjectTask["status"]) => {
    if (useLocalFallback && project && updateLocalProject) {
      // Update in localStorage
      const updatedTasks = project.tasks.map(t => {
        if (t.taskCode !== taskCode) return t;
        const updated = { ...t, status: newStatus };
        if (newStatus === 'in_progress') updated.startedAt = new Date().toISOString();
        if (newStatus === 'completed') {
          updated.completedAt = new Date().toISOString();
          updated.progressPct = 100;
        }
        return updated;
      });
      updateLocalProject({ ...project, tasks: updatedTasks });
    } else {
      dbUpdateStatus(taskCode, newStatus);
    }
  }, [useLocalFallback, project, updateLocalProject, dbUpdateStatus]);

  // Pull from backend: fetch DB task statuses back into localStorage
  const handlePullFromBackend = async () => {
    if (!project || !projectId) return;
    setPulling(true);
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      if (!data || data.length === 0) {
        toast({ title: "No backend tasks found", description: "Sync tasks to backend first.", variant: "destructive" });
        setPulling(false);
        return;
      }
      // Merge DB statuses into localStorage
      const dbMap = new Map(data.map(d => [d.task_code, d]));
      const updatedTasks = project.tasks.map(t => {
        const db = dbMap.get(t.taskCode);
        if (!db) return t;
        return {
          ...t,
          status: (db.status as typeof t.status) || t.status,
          progressPct: db.progress_pct ?? t.progressPct,
          notes: db.notes || t.notes,
          startedAt: db.started_at || t.startedAt,
          completedAt: db.completed_at || t.completedAt,
        };
      });
      updateLocalProject({ ...project, tasks: updatedTasks });
      toast({ title: "Pulled from backend", description: `${data.length} task statuses synced to local.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to pull";
      toast({ title: "Pull failed", description: msg, variant: "destructive" });
    }
    setPulling(false);
  };

  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSyncToBackend = async () => {
    if (!project || project.tasks.length === 0) {
      toast({ title: "No tasks to sync", description: "Generate tasks first via the project wizard.", variant: "destructive" });
      return;
    }

    setSyncing(true);
    try {
      // Seed gamification levels
      const levelRows = GAMIFICATION_LEVELS.map(l => ({
        level: l.level,
        title: l.title,
        xp_required: l.xpRequired,
        badge_emoji: l.badge,
      }));
      await supabase.from("project_levels").upsert(levelRows, { onConflict: "level" });

      // Upsert tasks from localStorage to Supabase
      const taskRows = project.tasks.map(t => ({
        task_code: t.taskCode,
        title: t.title,
        description: t.description || null,
        phase: t.phase,
        category: t.category,
        assigned_to: t.assignedTo || "claude-code",
        status: t.status,
        priority: t.priority,
        progress_pct: t.progressPct,
        xp_reward: t.xpReward,
        dependencies: t.dependencies,
        wat_references: t.watReferences,
        notes: t.notes || null,
        started_at: t.startedAt || null,
        completed_at: t.completedAt || null,
        project_id: projectId || null,
      }));

      const { error } = await supabase
        .from("project_tasks")
        .upsert(taskRows, { onConflict: "task_code" });

      if (error) throw error;

      toast({
        title: "Synced to backend!",
        description: `${taskRows.length} tasks pushed to your database. Agents can now access them.`,
      });
      refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not connect to backend";
      toast({
        title: "Sync failed",
        description: message,
        variant: "destructive",
      });
    }
    setSyncing(false);
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (phaseFilter !== "all") result = result.filter((t) => t.phase === phaseFilter);
    if (statusFilter !== "all") result = result.filter((t) => t.status === statusFilter);
    return [...result].sort((a, b) => {
      if (sortBy === "priority") return b.priority - a.priority;
      if (sortBy === "phase") return a.phase.localeCompare(b.phase);
      if (sortBy === "xp_reward") return b.xp_reward - a.xp_reward;
      return 0;
    });
  }, [tasks, phaseFilter, statusFilter, sortBy]);

  const xpProgress = useMemo(() => {
    if (!currentLevel || !nextLevel) return 100;
    const range = nextLevel.xp_required - currentLevel.xp_required;
    const earned = stats.earnedXp - currentLevel.xp_required;
    return range > 0 ? Math.round((earned / range) * 100) : 100;
  }, [currentLevel, nextLevel, stats.earnedXp]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Project Tracker</h1>
          <p className="text-sm text-muted-foreground">
            {stats.total} tasks · {stats.earnedXp} XP earned · {stats.completed} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {projectId && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePullFromBackend}
                disabled={pulling}
                className="gap-2"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${pulling ? "animate-spin" : ""}`} />
                {pulling ? "Pulling…" : "Pull from Backend"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncToBackend}
                disabled={syncing}
                className="gap-2"
              >
                <Upload className="h-3.5 w-3.5" />
                {syncing ? "Syncing…" : "Sync to Backend"}
              </Button>
            </>
          )}
          <SeedPhaseDialog onSeed={seedTasks} />
          <Button variant="outline" size="sm" onClick={refresh} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <ProgressRing value={stats.progressPct} />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Overall</div>
              <div className="font-display text-lg font-bold">{stats.completed}/{stats.total}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentLevel?.badge_emoji || "🔰"}</span>
              <div>
                <div className="font-display font-bold">Lv.{currentLevel?.level || 1}</div>
                <div className="text-xs text-muted-foreground">{currentLevel?.title || "Apprentice"}</div>
              </div>
            </div>
            <Progress value={xpProgress} className="mt-2 h-1.5" />
            <div className="mt-1 text-xs text-muted-foreground">
              {stats.earnedXp} / {nextLevel?.xp_required || "∞"} XP
            </div>
          </CardContent>
        </Card>

        {[
          { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-vibe-amber" },
          { label: "Pending", value: stats.pending, icon: Pause, color: "text-muted-foreground" },
          { label: "Blocked", value: stats.blocked, icon: AlertTriangle, color: "text-vibe-rose" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <div className="text-2xl font-bold font-display">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Local-only banner */}
      {useLocalFallback && (
        <div className="flex items-center gap-3 rounded-lg border border-vibe-amber/30 bg-vibe-amber/5 p-3">
          <AlertTriangle className="h-4 w-4 text-vibe-amber shrink-0" />
          <p className="text-sm text-muted-foreground">
            Showing tasks from <span className="font-medium text-foreground">local storage</span>. 
            Click <span className="font-medium text-foreground">Sync to Backend</span> to push them to the database for agent access.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Phase" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              {phases.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="phase">Phase</SelectItem>
              <SelectItem value="xp_reward">XP Reward</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{filteredTasks.length} tasks</span>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              {tasks.length === 0
                ? "No tasks yet. Create a project and seed tasks, or use 'Seed Phase' above."
                : "No tasks match the current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-420px)]">
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                isExpanded={expandedId === task.id}
                onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
                onStatusChange={updateTaskStatus}
                allTasks={tasks}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function TaskRow({
  task,
  isExpanded,
  onToggle,
  onStatusChange,
  allTasks,
}: {
  task: ProjectTask;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (code: string, status: ProjectTask["status"]) => void;
  allTasks: ProjectTask[];
}) {
  const sc = statusConfig[task.status];
  const StatusIcon = sc.icon;
  const { toast } = useToast();
  const [notes, setNotes] = useState(task.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const handleStatusClick = () => {
    onStatusChange(task.task_code, sc.next);
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    const { error } = await supabase
      .from("project_tasks")
      .update({ notes, updated_at: new Date().toISOString() })
      .eq("id", task.id);
    if (error) {
      toast({ title: "Error saving notes", description: error.message, variant: "destructive" });
    }
    setSavingNotes(false);
  };

  const deps = task.dependencies
    .map((code) => allTasks.find((t) => t.task_code === code))
    .filter(Boolean);

  return (
    <Card className="transition-all hover:border-primary/20">
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={onToggle}>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}

          <button
            onClick={(e) => { e.stopPropagation(); handleStatusClick(); }}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${sc.color}`}
            title={`Click to set ${sc.next}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
          </button>

          <Badge variant="outline" className="font-mono text-xs shrink-0 w-16 justify-center">
            {task.task_code}
          </Badge>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{task.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColors[task.category] || ""}`}>
                {task.category}
              </Badge>
              <span className="text-[10px] text-muted-foreground">{task.phase}</span>
            </div>
          </div>

          {task.dependencies.length > 0 && (
            <Badge variant="secondary" className="text-[10px] gap-1 shrink-0">
              <GitBranch className="h-2.5 w-2.5" />
              {task.dependencies.length}
            </Badge>
          )}
          {task.wat_references.length > 0 && (
            <Badge variant="secondary" className="text-[10px] gap-1 shrink-0">
              <BookOpen className="h-2.5 w-2.5" />
              {task.wat_references.length}
            </Badge>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Zap className="h-3 w-3" />
            <span>{task.xp_reward}</span>
          </div>

          <Badge variant="secondary" className="font-mono text-xs shrink-0">
            P{task.priority}
          </Badge>
        </div>

        {isExpanded && (
          <div className="border-t border-border px-4 py-4 space-y-4">
            {task.description && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                  <FileText className="h-3 w-3" /> Description
                </div>
                <p className="text-sm text-foreground">{task.description}</p>
              </div>
            )}

            {deps.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                  <GitBranch className="h-3 w-3" /> Dependencies ({deps.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {deps.map((dep) => {
                    if (!dep) return null;
                    const depSc = statusConfig[dep.status];
                    return (
                      <Badge
                        key={dep.task_code}
                        variant="outline"
                        className={`text-xs gap-1 ${depSc.color}`}
                      >
                        <depSc.icon className="h-2.5 w-2.5" />
                        {dep.task_code}: {dep.title}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {task.wat_references.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                  <BookOpen className="h-3 w-3" /> WAT References
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {task.wat_references.map((ref) => (
                    <Badge key={ref} variant="secondary" className="text-[10px] font-mono">
                      {ref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <StickyNote className="h-3 w-3" /> Notes
              </div>
              <div className="flex gap-2">
                <Textarea
                  className="text-xs min-h-[60px]"
                  placeholder="Add notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="shrink-0"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
