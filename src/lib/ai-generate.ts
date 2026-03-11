import { supabase } from "@/integrations/supabase/client";

export interface AnalysisResult {
  projectName: string;
  description: string;
  stack: {
    framework: string;
    language: string;
    buildTool: string;
    backend: string;
    ui: string;
    stateManagement: string;
    forms: string;
    validation: string;
  };
  entities: string[];
  sharedConcerns: string[];
  modules: {
    name: string;
    description: string;
    route: string;
    entities: string[];
    actions: string[];
    relatedModules: string[];
  }[];
  phases: {
    number: number;
    name: string;
    description: string;
  }[];
}

export interface GeneratedTask {
  task_code: string;
  title: string;
  description: string;
  phase: string;
  category: string;
  assigned_to: string;
  priority: number;
  xp_reward: number;
  dependencies: string[];
  wat_references: string[];
}

// NOTE: Knowledge and config generation are now handled locally by
// src/lib/generate-from-templates.ts. The edge function only handles
// analyze (creative) and generate-tasks (creative).

async function callGenerateProject(step: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase.functions.invoke("generate-project", {
    body: { step, data },
  });

  if (error) {
    throw new Error(error.message || "Failed to call generate-project");
  }

  if (result?.error) {
    throw new Error(result.error);
  }

  return result;
}

export async function analyzeProject(
  projectName: string,
  projectDesc: string,
  brainDump: string
): Promise<AnalysisResult> {
  return callGenerateProject("analyze", { projectName, projectDesc, brainDump });
}

export async function generateTasks(
  analysis: AnalysisResult
): Promise<GeneratedTask[]> {
  const result = await callGenerateProject("generate-tasks", { analysis });
  const tasks = result?.tasks ?? result;
  if (!Array.isArray(tasks)) {
    throw new Error("AI returned an invalid response — no tasks were generated. Please try again.");
  }
  return tasks;
}


