import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectTask {
  id: string;
  task_code: string;
  title: string;
  description: string | null;
  phase: string;
  category: string;
  assigned_to: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: number;
  progress_pct: number;
  xp_reward: number;
  dependencies: string[];
  wat_references: string[];
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  project_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectLevel {
  id: number;
  level: number;
  title: string;
  xp_required: number;
  badge_emoji: string | null;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  blocked: number;
  totalXp: number;
  earnedXp: number;
  progressPct: number;
}

export function useProjectTasks(projectId?: string) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [levels, setLevels] = useState<ProjectLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('project_tasks')
        .select('*')
        .order('priority', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      
      if (error) {
        // Gracefully handle — backend may not be configured
        console.warn('Could not fetch tasks (backend may not be connected):', error.message);
        setTasks([]);
      } else {
        setTasks((data || []) as unknown as ProjectTask[]);
      }
    } catch {
      // No backend configured — that's fine for BYOB
      setTasks([]);
    }
    setIsLoading(false);
  }, [projectId]);

  const fetchLevels = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('project_levels')
        .select('*')
        .order('level', { ascending: true });
      
      if (!error && data) {
        setLevels(data as unknown as ProjectLevel[]);
      }
    } catch {
      // No backend — use empty levels
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchLevels();
  }, [fetchTasks, fetchLevels]);

  // Realtime subscription (optional — fails silently if no backend)
  useEffect(() => {
    const channelName = projectId ? `project-tasks-${projectId}` : 'project-tasks-changes';
    const filter = projectId ? `project_id=eq.${projectId}` : undefined;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_tasks',
        ...(filter ? { filter } : {}),
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchTasks]);

  const stats: TaskStats = useMemo(() => {
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
  }, [tasks]);

  const currentLevel = useMemo(() => {
    const sorted = [...levels].sort((a, b) => b.xp_required - a.xp_required);
    return sorted.find(l => stats.earnedXp >= l.xp_required) || levels[0];
  }, [levels, stats.earnedXp]);

  const nextLevel = useMemo(() => {
    if (!currentLevel) return undefined;
    return levels.find(l => l.xp_required > stats.earnedXp);
  }, [levels, currentLevel, stats.earnedXp]);

  const updateTaskStatus = useCallback(async (taskCode: string, newStatus: ProjectTask['status']) => {
    const updates: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (newStatus === 'in_progress') updates.started_at = new Date().toISOString();
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
      updates.progress_pct = 100;
    }

    const { error } = await supabase
      .from('project_tasks')
      .update(updates)
      .eq('task_code', taskCode);

    if (error) {
      toast({ title: 'Error updating task', description: error.message, variant: 'destructive' });
    }
  }, [toast]);

  const seedTasks = useCallback(async (newTasks: Omit<ProjectTask, 'id' | 'created_at' | 'updated_at'>[]) => {
    const { error } = await supabase
      .from('project_tasks')
      .upsert(
        newTasks.map(t => ({
          task_code: t.task_code,
          title: t.title,
          description: t.description,
          phase: t.phase,
          category: t.category,
          assigned_to: t.assigned_to,
          status: t.status,
          priority: t.priority,
          progress_pct: t.progress_pct,
          xp_reward: t.xp_reward,
          dependencies: t.dependencies,
          wat_references: t.wat_references,
          notes: t.notes,
          
        })),
        { onConflict: 'task_code' }
      );

    if (error) {
      toast({ title: 'Error seeding tasks', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Tasks seeded successfully', description: `${newTasks.length} tasks added to the tracker.` });
      fetchTasks();
    }
  }, [toast, fetchTasks, projectId]);

  const phases = useMemo(() => [...new Set(tasks.map(t => t.phase))].sort(), [tasks]);

  return {
    tasks,
    levels,
    stats,
    currentLevel,
    nextLevel,
    phases,
    isLoading,
    updateTaskStatus,
    seedTasks,
    refresh: fetchTasks,
  };
}
