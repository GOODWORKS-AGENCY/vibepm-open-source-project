import { useParams, Link, Outlet, useLocation } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { useProjectTasks } from "@/hooks/useProjectTasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GAMIFICATION_LEVELS } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, Kanban, BookOpen, Download, ArrowLeft,
  CheckCircle, Clock, AlertTriangle, Pause, Upload
} from "lucide-react";

const tabs = [
  { label: "Dashboard", path: "", icon: LayoutDashboard },
  { label: "Tasks", path: "/tasks", icon: Kanban },
  { label: "Tracker", path: "/tracker", icon: Kanban },
  { label: "Knowledge", path: "/knowledge", icon: BookOpen },
  { label: "Export", path: "/export", icon: Download },
];

export default function ProjectDashboard() {
  const { id } = useParams();
  const { project, isLoading } = useProject(id);
  const { seedTasks } = useProjectTasks();
  const { toast } = useToast();
  const location = useLocation();

  const handleSeedToTracker = async () => {
    if (!project || project.tasks.length === 0) return;
    const mapped = project.tasks.map(t => ({
      task_code: t.taskCode,
      title: t.title,
      description: t.description,
      phase: t.phase,
      category: t.category,
      assigned_to: t.assignedTo || 'claude-code',
      status: t.status as 'pending' | 'in_progress' | 'completed' | 'blocked',
      priority: t.priority,
      progress_pct: t.progressPct,
      xp_reward: t.xpReward,
      dependencies: t.dependencies,
      wat_references: t.watReferences,
      started_at: t.startedAt || null,
      completed_at: t.completedAt || null,
      notes: t.notes || null,
      
    }));
    await seedTasks(mapped);
    toast({ title: 'Tasks seeded!', description: `${mapped.length} tasks pushed to the live tracker.` });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-muted-foreground">Project not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const completed = project.tasks.filter(t => t.status === 'completed').length;
  const inProgress = project.tasks.filter(t => t.status === 'in_progress').length;
  const blocked = project.tasks.filter(t => t.status === 'blocked').length;
  const pending = project.tasks.filter(t => t.status === 'pending').length;
  const progress = project.tasks.length > 0 ? Math.round((completed / project.tasks.length) * 100) : 0;
  const level = [...GAMIFICATION_LEVELS].reverse().find(l => project.xp.current >= l.xpRequired) || GAMIFICATION_LEVELS[0];
  const nextLevel = GAMIFICATION_LEVELS.find(l => l.xpRequired > project.xp.current);
  const xpProgress = nextLevel ? Math.round(((project.xp.current - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100) : 100;

  const basePath = `/projects/${id}`;
  const subPath = location.pathname.replace(basePath, '') || '';

  const stats = [
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-vibe-cyan" },
    { label: "In Progress", value: inProgress, icon: Clock, color: "text-vibe-amber" },
    { label: "Pending", value: pending, icon: Pause, color: "text-muted-foreground" },
    { label: "Blocked", value: blocked, icon: AlertTriangle, color: "text-vibe-rose" },
  ];

  // If we're at the base project path (no sub-route), show the dashboard
  const showDashboard = subPath === '' || subPath === '/';

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="icon">
          <Link to="/projects"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        {project.tasks.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleSeedToTracker} className="gap-2">
            <Upload className="h-3.5 w-3.5" /> Seed to Tracker
          </Button>
        )}
        <Badge className="font-mono text-sm gap-1">
          {level.badge} {level.title} · {project.xp.current} XP
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map(tab => {
          const isActive = subPath === tab.path || (tab.path === '' && showDashboard);
          return (
            <Link
              key={tab.path}
              to={`${basePath}${tab.path}`}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {showDashboard ? (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map(s => (
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

          {/* XP and Progress */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display">{progress}%</div>
                <Progress value={progress} className="mt-2 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {completed} of {project.tasks.length} tasks completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{level.badge}</span>
                  <span className="text-xl font-bold font-display">{level.title}</span>
                  {nextLevel && (
                    <span className="text-sm text-muted-foreground">→ {nextLevel.title}</span>
                  )}
                </div>
                <Progress value={xpProgress} className="mt-2 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {project.xp.current} XP{nextLevel ? ` / ${nextLevel.xpRequired} XP to next level` : ' (max level)'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Phases */}
          {project.phases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Phases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.phases.map(phase => {
                  const phaseTasks = project.tasks.filter(t => t.phase === `phase${phase.number}`);
                  const phaseCompleted = phaseTasks.filter(t => t.status === 'completed').length;
                  const phaseProgress = phaseTasks.length > 0 ? Math.round((phaseCompleted / phaseTasks.length) * 100) : 0;
                  return (
                    <div key={phase.id} className="flex items-center gap-4">
                      <Badge variant={phase.status === 'completed' ? 'default' : 'secondary'} className="w-20 justify-center font-mono text-xs">
                        P{String(phase.number).padStart(2, '0')}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{phase.name}</span>
                          <span className="text-muted-foreground">{phaseCompleted}/{phaseTasks.length}</span>
                        </div>
                        <Progress value={phaseProgress} className="mt-1 h-1" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
