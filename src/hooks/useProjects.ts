import { useState, useCallback, useEffect } from 'react';
import { Project, Task } from '@/types/project';
import * as store from '@/lib/store';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const refresh = useCallback(() => {
    setProjects(store.getProjects());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const createProject = useCallback(
    (name: string, description: string, stack: Project['stack']) => {
      const p = store.createProject(name, description, stack);
      refresh();
      return p;
    },
    [refresh]
  );

  const deleteProject = useCallback(
    (id: string) => {
      store.deleteProject(id);
      refresh();
    },
    [refresh]
  );

  const updateProject = useCallback(
    (project: Project) => {
      const p = store.saveProject(project);
      refresh();
      return p;
    },
    [refresh]
  );

  const updateTaskStatus = useCallback(
    (projectId: string, taskCode: string, status: Task['status']) => {
      store.updateTaskStatus(projectId, taskCode, status);
      refresh();
    },
    [refresh]
  );

  return { projects, isLoading: false, refresh, createProject, deleteProject, updateProject, updateTaskStatus };
}

export function useProject(id: string | undefined) {
  const [project, setProject] = useState<Project | undefined>();

  const refresh = useCallback(() => {
    if (!id) {
      setProject(undefined);
      return;
    }
    setProject(store.getProject(id));
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const update = useCallback(
    (updated: Project) => {
      store.saveProject(updated);
      refresh();
    },
    [refresh]
  );

  return { project, isLoading: false, refresh, update };
}
