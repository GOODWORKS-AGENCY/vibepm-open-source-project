import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Task, TaskStatus } from "@/types/project";
import * as store from "@/lib/store";

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "pending", label: "Pending", color: "bg-muted" },
  { status: "in_progress", label: "In Progress", color: "bg-vibe-amber/10" },
  { status: "completed", label: "Completed", color: "bg-vibe-cyan/10" },
  { status: "blocked", label: "Blocked", color: "bg-vibe-rose/10" },
];

const categoryColors: Record<string, string> = {
  feature: "bg-primary/10 text-primary",
  infra: "bg-vibe-cyan/10 text-vibe-cyan",
  ai: "bg-vibe-glow/10 text-vibe-glow",
  ui: "bg-vibe-amber/10 text-vibe-amber",
  orchestration: "bg-vibe-rose/10 text-vibe-rose",
};

export default function ProjectTasks() {
  const { id } = useParams();
  const { project, refresh } = useProject(id);
  const [phaseFilter, setPhaseFilter] = useState<string>("all");

  if (!project) return null;

  const filteredTasks = phaseFilter === "all"
    ? project.tasks
    : project.tasks.filter(t => t.phase === phaseFilter);

  const phases = [...new Set(project.tasks.map(t => t.phase))];

  const handleStatusChange = (taskCode: string, newStatus: TaskStatus) => {
    store.updateTaskStatus(project.id, taskCode, newStatus);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            {phases.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filteredTasks.length} tasks</span>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {columns.map(col => {
          const tasks = filteredTasks.filter(t => t.status === col.status);
          return (
            <div key={col.status} className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-2 w-2 rounded-full ${col.color.replace('/10', '')}`} />
                <span className="text-sm font-medium">{col.label}</span>
                <Badge variant="secondary" className="ml-auto text-xs">{tasks.length}</Badge>
              </div>
              <div className="space-y-2">
                {tasks.map(task => (
                  <TaskCard
                    key={task.taskCode}
                    task={task}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onStatusChange,
}: {
  task: Task;
  onStatusChange: (code: string, status: TaskStatus) => void;
}) {
  return (
    <Card className="transition-all hover:border-primary/20">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="font-mono text-xs shrink-0">
            {task.taskCode}
          </Badge>
          <Badge className={`text-xs ${categoryColors[task.category] || ''}`}>
            {task.category}
          </Badge>
        </div>
        <p className="text-sm font-medium leading-tight">{task.title}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>⚡ {task.xpReward} XP</span>
          <span>·</span>
          <span>P{task.priority}</span>
          {task.dependencies.length > 0 && (
            <>
              <span>·</span>
              <span>{task.dependencies.length} deps</span>
            </>
          )}
        </div>
        <Select
          value={task.status}
          onValueChange={(v) => onStatusChange(task.taskCode, v as TaskStatus)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
