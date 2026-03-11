import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL") || "https://api.openai.com/v1/chat/completions";
const MODEL = Deno.env.get("AI_MODEL") || "gpt-4o";

async function callAI(apiKey: string, systemPrompt: string, userPrompt: string) {
  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt + "\n\nIMPORTANT: Return your response as a valid JSON object. Do NOT wrap in markdown code blocks. Return ONLY the raw JSON." },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const body = await response.text();
    if (status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
    if (status === 401) throw new Error("Invalid AI API key. Check your AI_API_KEY secret.");
    throw new Error(`AI gateway error [${status}]: ${body}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    console.error("No content in AI response:", JSON.stringify(data).slice(0, 500));
    throw new Error("AI returned an empty response. Please try again.");
  }

  console.log("AI response length:", content.length);
  
  // Strip markdown code blocks if present
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
  
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== 'object' || parsed === null || Object.keys(parsed).length === 0) {
      throw new Error("AI returned an empty JSON object. Please try again.");
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse AI JSON:", jsonStr.slice(0, 200));
    throw new Error("AI returned invalid JSON. Please try again.");
  }
}

// ===== SYSTEM PROMPTS =====

const ANALYZE_SYSTEM = `You are VibePM, an AI that analyzes raw project ideas and extracts structured project definitions following the WAT (Workflows, Agents, Tools) framework.

Given a brain dump of project ideas, extract:
1. A clear project name and description
2. The tech stack (framework, language, build tool, backend, UI, state management, forms, validation)
3. All domain entities (database tables/models the project needs)
4. All modules (feature areas with routes, key entities, CRUD actions, and their WAT archetype: Standard Domain, Infrastructure, AI Agent, or Intelligence)
5. Development phases (Foundation, Core Features, Integration, Polish, etc.)
6. Shared/cross-cutting concerns (auth, audit, notifications, etc.)
7. AI Agents (if any, their roles and capabilities)
8. Key Workflow Families (end-to-end processes across multiple modules)

RULES:
- Extract REAL entities, modules, and workflows from the brain dump content
- Each module needs: name, description, route, entities[], actions[], relatedModules[], archetype (e.g., "Standard Domain")
- Each entity should be a database table name in snake_case
- Actions should be specific (e.g., "Create member", "Search members", "Update member status")
- Phases should be realistic development milestones
- Default tech stack: React + TypeScript + Vite + Supabase + shadcn/ui + TanStack Query + react-hook-form + zod

Return the result via the return_result function with this structure:
{
  "projectName": "string",
  "description": "string", 
  "stack": { "framework": "", "language": "", "buildTool": "", "backend": "", "ui": "", "stateManagement": "", "forms": "", "validation": "" },
  "entities": ["snake_case_entity_names"],
  "sharedConcerns": ["auth", "audit", etc],
  "agents": [{ "name": "", "role": "" }],
  "workflowFamilies": [{ "name": "", "flow": ["Module A", "Module B"] }],
  "modules": [{ "name": "", "description": "", "route": "", "archetype": "", "entities": [], "actions": [], "relatedModules": [] }],
  "phases": [{ "number": 1, "name": "", "description": "" }]
}`;

const GENERATE_TASKS_SYSTEM = `You are VibePM's task generator. Given a project analysis, generate a complete task list following the AI-Driven Development Framework (PRD.json format).

TASK FORMAT:
- task_code: P{phase_number}-{sequential_number} (e.g., P01-01, P01-02, P02-01) - always zero-padded
- title: Short imperative description
- description: Detailed spec of what to build
- phase: "phase{N}" 
- category: One of: feature, infra, ai, ui, orchestration
- assigned_to: "claude-code" (or another agent if specified)
- priority: 1-100 (higher = do first within phase)
- xp_reward: Based on complexity (15=simple, 25=medium, 35=complex, 50=epic)
- dependencies: Array of task_codes that must complete first
- wat_references: Array of knowledge file paths this task needs.
  CRITICAL: Must be exact paths like:
  - "knowledge/skills/{module}/{module}.skill.md" (Domain knowledge/WHAT)
  - "knowledge/tools/db/{entity}-crud.tool.md" (Implementation/HOW)
  - "knowledge/tools/api/{function}.tool.md" (API specs)
  - "knowledge/tools/ui/{component}.tool.md" (UI specs)
  - "knowledge/workflows/{module}/{workflow}.workflow.md" (Process/WHEN)

RULES:
- Phase 1 should always include: project setup, database schema, auth, core shared infrastructure
- Each module should have tasks for: schema/migration (needs DB Tool + Skill), CRUD hooks/API layer (needs DB Tool + UI Tool), UI pages (needs Skill + Workflow/UI Tool)
- Dependencies must form a valid DAG (no cycles)
- Generate 15-60 tasks depending on project complexity
- An empty wat_references array means no knowledge file is needed (e.g., UI tweaks).

Return via return_result: { "tasks": [...] }`;

// NOTE: generate-knowledge and generate-config steps removed.
// All knowledge files and config files are now generated deterministically
// by local templates in src/lib/generate-from-templates.ts.
// The edge function only handles: analyze (creative) and generate-tasks (creative).

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured. Set it via: supabase secrets set AI_API_KEY=your-key");
    }

    const { step, data } = await req.json();

    let result;

    switch (step) {
      case "analyze": {
        const { projectName, projectDesc, brainDump } = data;
        const userPrompt = `Project Name: ${projectName}\nDescription: ${projectDesc}\n\nBrain Dump:\n${brainDump}`;
        result = await callAI(AI_API_KEY, ANALYZE_SYSTEM, userPrompt);
        break;
      }

      case "generate-tasks": {
        const { analysis } = data;
        const userPrompt = `Generate tasks for this project:\n\n${JSON.stringify(analysis, null, 2)}`;
        result = await callAI(AI_API_KEY, GENERATE_TASKS_SYSTEM, userPrompt);
        break;
      }

      default:
        throw new Error(`Unknown step: ${step}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-project error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    const status = errorMessage.includes("Rate limit") ? 429 
      : errorMessage.includes("Invalid AI API key") ? 401 
      : 500;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
