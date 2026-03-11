/**
 * Agent Tasks Edge Function template.
 * Portable copy included in the export ZIP so users can deploy
 * their own agent-tasks endpoint via `supabase functions deploy`.
 */
export function generateAgentTasksFunction(): string {
  return `// Agent Tasks Edge Function
// Deploy with: supabase functions deploy agent-tasks
// See SETUP.md for full instructions.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { action, ...params } = await req.json();

    switch (action) {
      case "next": {
        const { data: tasks } = await supabase
          .from("project_tasks")
          .select("*")
          .order("priority", { ascending: false });

        const completed = new Set(
          (tasks || []).filter(t => t.status === "completed").map(t => t.task_code)
        );
        const eligible = (tasks || []).find(t => {
          if (t.status !== "pending") return false;
          return (t.dependencies || []).every(d => completed.has(d));
        });

        return new Response(JSON.stringify({ task: eligible || null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "claim": {
        const now = new Date().toISOString();
        const { data } = await supabase
          .from("project_tasks")
          .update({ status: "in_progress", started_at: now, updated_at: now })
          .eq("task_code", params.task_code)
          .eq("status", "pending")
          .select();

        return new Response(
          JSON.stringify({ claimed: data && data.length > 0, task_code: params.task_code }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "complete": {
        const now = new Date().toISOString();
        await supabase
          .from("project_tasks")
          .update({ status: "completed", progress_pct: 100, completed_at: now, updated_at: now, notes: params.notes || null })
          .eq("task_code", params.task_code);

        return new Response(
          JSON.stringify({ completed: true, task_code: params.task_code }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "block": {
        await supabase
          .from("project_tasks")
          .update({ status: "blocked", notes: params.notes, updated_at: new Date().toISOString() })
          .eq("task_code", params.task_code);

        return new Response(
          JSON.stringify({ blocked: true, task_code: params.task_code }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "status": {
        const { data: tasks } = await supabase.from("project_tasks").select("status, xp_reward");
        const all = tasks || [];
        return new Response(JSON.stringify({
          total: all.length,
          completed: all.filter(t => t.status === "completed").length,
          in_progress: all.filter(t => t.status === "in_progress").length,
          pending: all.filter(t => t.status === "pending").length,
          blocked: all.filter(t => t.status === "blocked").length,
          xp_earned: all.filter(t => t.status === "completed").reduce((s, t) => s + (t.xp_reward || 0), 0),
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "list": {
        let query = supabase.from("project_tasks").select("*").order("priority", { ascending: false });
        if (params.phase) query = query.eq("phase", params.phase);
        if (params.status) query = query.eq("status", params.status);
        const { data } = await query;
        return new Response(JSON.stringify({ tasks: data || [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action: " + action }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
`;
}
