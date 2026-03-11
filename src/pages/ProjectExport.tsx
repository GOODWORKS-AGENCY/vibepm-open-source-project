import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileCode, FolderOpen } from "lucide-react";
import { useState, useMemo } from "react";
import JSZip from "jszip";
import { generateSetupGuide } from "@/templates/setup-guide";
import { generateAgentTasksFunction } from "@/templates/agent-tasks-function";

export default function ProjectExport() {
  const { id } = useParams();
  const { project } = useProject(id);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Build file list: orchestrator output + export-only supplementary files
  const allFiles = useMemo(() => {
    if (!project) return [];

    // Start with everything the orchestrator already generated
    const files = [...project.generatedFiles];

    // Add export-only files the orchestrator doesn't produce
    files.push({
      path: "SETUP.md",
      content: generateSetupGuide(project),
    });

    if (project.tasks.length > 0) {
      files.push({
        path: "tasks/tasks.json",
        content: JSON.stringify(project.tasks, null, 2),
      });
    }

    files.push({
      path: "supabase/functions/agent-tasks/index.ts",
      content: generateAgentTasksFunction(),
    });

    return files;
  }, [project]);

  const selected = allFiles.find(f => f.path === selectedFile);

  if (!project) return null;

  const handleDownload = async () => {
    const zip = new JSZip();
    for (const file of allFiles) {
      zip.file(file.path, file.content);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-context.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (allFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-muted-foreground">
          No files generated yet. Use the wizard to generate your project context.
        </p>
      </div>
    );
  }

  // Group files by directory for display
  const groupedFiles = allFiles.reduce<Record<string, typeof allFiles>>((acc, f) => {
    const dir = f.path.includes('/') ? f.path.split('/').slice(0, -1).join('/') : 'root';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold">Export Package</h3>
          <p className="text-sm text-muted-foreground">
            {allFiles.length} files — context, infrastructure, and tracker UI
          </p>
        </div>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download ZIP
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-2 space-y-2">
                {Object.entries(groupedFiles).map(([dir, files]) => (
                  <div key={dir}>
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {dir === 'root' ? '/' : dir}
                    </div>
                    {files.map(f => (
                      <button
                        key={f.path}
                        onClick={() => setSelectedFile(f.path)}
                        className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-colors ${
                          selectedFile === f.path ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                        }`}
                      >
                        <FileCode className="h-3 w-3 shrink-0" />
                        <span className="truncate font-mono">
                          {f.path.split('/').pop()}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono">
              {selected?.path || 'Select a file'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <ScrollArea className="h-[500px]">
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-foreground/80">
                  {selected.content}
                </pre>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-muted-foreground text-sm">
                Click a file to preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
