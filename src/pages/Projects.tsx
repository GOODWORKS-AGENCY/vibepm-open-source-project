import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { GAMIFICATION_LEVELS } from "@/types/project";

export default function Projects() {
  const { projects, isLoading, deleteProject } = useProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <FolderOpen className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="mt-4 font-display text-xl font-semibold">No projects yet</h2>
        <p className="mt-2 text-muted-foreground">Create your first project to get started.</p>
        <Button asChild className="mt-6 gap-2">
          <Link to="/new"><Plus className="h-4 w-4" /> New Project</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Projects</h1>
        <Button asChild className="gap-2">
          <Link to="/new"><Plus className="h-4 w-4" /> New Project</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => {
          const completed = p.tasks.filter(t => t.status === 'completed').length;
          const progress = p.tasks.length > 0 ? Math.round((completed / p.tasks.length) * 100) : 0;
          const level = GAMIFICATION_LEVELS.find(l => p.xp.current >= l.xpRequired) || GAMIFICATION_LEVELS[0];

          return (
            <Card key={p.id} className="group transition-all hover:border-primary/30 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-display">{p.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{p.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {level.badge} Lv.{level.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{p.tasks.length} tasks</span>
                  <span>·</span>
                  <span>{p.phases.length} phases</span>
                  <span>·</span>
                  <span>{p.xp.current} XP</span>
                </div>
                <Progress value={progress} className="mt-3 h-1.5" />
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="default" size="sm" className="flex-1">
                    <Link to={`/projects/${p.id}`}>Open</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProject(p.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
