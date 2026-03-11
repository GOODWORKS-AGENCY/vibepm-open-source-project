import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const docs = [
  { title: "AI-Driven Development Framework", file: "AI-DEV-FRAMEWORK-TEMPLATE.md", desc: "The umbrella document — high-level overview and integration checklist." },
  { title: "WAT Framework", file: "WAT-FRAMEWORK-TEMPLATE.md", desc: "Three-layer knowledge architecture: Skills (WHAT), Workflows (WHEN), Tools (HOW)." },
  { title: "Master Pipeline", file: "MASTER-PIPELINE-TEMPLATE.md", desc: "The 25-step chronological map from raw ideas to autonomous agents." },
  { title: "Master Knowledge Base (prod.md)", file: "MASTER-KNOWLEDGE-BASE-TEMPLATE.md", desc: "Single-document domain atlas — every module, entity, workflow family." },
  { title: "CLAUDE.md Template", file: "CLAUDE-TEMPLATE.md", desc: "Auto-loaded agent brain — project overview, commands, task protocol." },
  { title: "Skill Index Framework", file: "SKILL-INDEX-TEMPLATE.md", desc: "How to build skills.md + 3 skill archetypes (shared, module, agent)." },
  { title: "Tool Index Framework", file: "TOOL-INDEX-TEMPLATE.md", desc: "How to build tools.md + 4 tool categories (DB, API, UI, Automation)." },
  { title: "Task Management Process", file: "TASK-MANAGEMENT-TEMPLATE.md", desc: "Phase lifecycle, task protocol, seeding migrations, verification." },
  { title: "Task Tracking System", file: "TASK-TRACKING-SYSTEM-TEMPLATE.md", desc: "DB schema, React hook, UI components, gamification, multi-agent coordination." },
];

export default function FrameworkDocs() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Framework Documentation
        </h1>
        <p className="mt-2 text-muted-foreground">
          9 interlocking documents that form the complete AI development operating system.
          These are not templates — they are the architecture itself.
        </p>
      </div>

      <div className="grid gap-4">
        {docs.map((doc) => (
          <a
            key={doc.file}
            href={`/framework/${doc.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="transition-all hover:border-primary/30 hover:shadow-lg">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <CardTitle className="font-display text-base">{doc.title}</CardTitle>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pl-13">
                <p className="text-sm text-muted-foreground">{doc.desc}</p>
                <code className="mt-2 inline-block rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {doc.file}
                </code>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
