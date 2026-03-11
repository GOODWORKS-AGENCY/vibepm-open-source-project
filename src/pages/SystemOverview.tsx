import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const chain = [
  { label: "Raw Vision / Brain Dump", sub: "Your ideas, feature lists, entity descriptions" },
  { label: "prod.md + skill/tool/workflow files", sub: "WAT knowledge base (Phase A)" },
  { label: "wat_references arrays in task rows", sub: "The critical bridge — tasks link to knowledge" },
  { label: "project_tasks table", sub: "Source of truth for status, progress, XP, dependencies" },
  { label: "/project-tracker UI", sub: "Human dashboard — see everything in real time" },
  { label: "Agent session (CLAUDE.md + rules)", sub: "Agent loads instructions + claims a task" },
  { label: "Load wat_references → Build → Verify", sub: "tsc --noEmit && vite build" },
  { label: "Mark completed → Earn XP → Next task ↻", sub: "The loop repeats 100–500+ times" },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function SystemOverview() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 p-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          System Overview
        </h1>
        <p className="mt-2 text-muted-foreground">
          The single source of truth chain. Break any link and the agent becomes blind
          or the dashboard lies.
        </p>
      </div>

      {/* Truth Chain */}
      <div className="space-y-0">
        {chain.map((step, i) => (
          <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.06 }}>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-sm font-semibold">{step.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{step.sub}</p>
            </div>
            {i < chain.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Scaling */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="font-display text-lg font-bold">Scaling Reality</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          At 33 modules / 200+ tasks, the system stays performant because loading is surgical.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            ["~130", "Knowledge files"],
            ["200–300", "Tasks in DB"],
            ["50+", "Migrations"],
            ["1–4", "Files per task"],
            ["15", "XP levels"],
            ["<700", "Lines in prod.md"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-display text-2xl font-bold text-primary">{val}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
