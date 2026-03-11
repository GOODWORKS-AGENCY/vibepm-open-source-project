import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectTasks from "./pages/ProjectTasks";
import ProjectKnowledge from "./pages/ProjectKnowledge";
import ProjectExport from "./pages/ProjectExport";
import ProjectTrackerWrapper from "./pages/ProjectTrackerWrapper";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Projects /></AppLayout>} />
          <Route path="/new" element={<AppLayout><NewProject /></AppLayout>} />
          <Route path="/projects" element={<AppLayout><Projects /></AppLayout>} />
          <Route path="/projects/:id" element={<AppLayout><ProjectDashboard /></AppLayout>}>
            <Route path="tasks" element={<ProjectTasks />} />
            <Route path="tracker" element={<ProjectTrackerWrapper />} />
            <Route path="knowledge" element={<ProjectKnowledge />} />
            <Route path="export" element={<ProjectExport />} />
          </Route>
          <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
