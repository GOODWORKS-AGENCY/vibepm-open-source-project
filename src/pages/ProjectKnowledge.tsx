import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FileCode, FolderOpen } from "lucide-react";

export default function ProjectKnowledge() {
  const { id } = useParams();
  const { project } = useProject(id);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (!project) return null;

  const files = project.knowledgeFiles;
  const selected = files.find(f => f.path === selectedFile);

  const grouped = {
    skill: files.filter(f => f.type === 'skill'),
    tool: files.filter(f => f.type === 'tool'),
    workflow: files.filter(f => f.type === 'workflow'),
    config: files.filter(f => f.type === 'config'),
    index: files.filter(f => f.type === 'index'),
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-muted-foreground">
          No knowledge files generated yet. Use the wizard to generate your project context.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[280px_1fr]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Knowledge Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {Object.entries(grouped).map(([type, groupFiles]) => {
              if (groupFiles.length === 0) return null;
              return (
                <div key={type} className="px-4 py-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">
                    {type}s ({groupFiles.length})
                  </div>
                  {groupFiles.map(f => (
                    <button
                      key={f.path}
                      onClick={() => setSelectedFile(f.path)}
                      className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-colors ${
                        selectedFile === f.path ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                      }`}
                    >
                      <FileCode className="h-3 w-3 shrink-0" />
                      <span className="truncate">{f.path.split('/').pop()}</span>
                    </button>
                  ))}
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {selected ? (
              <>
                <Badge variant="secondary" className="text-xs font-mono">{selected.type}</Badge>
                {selected.path}
              </>
            ) : (
              'Select a file to preview'
            )}
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
              Click a file on the left to view its content.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
