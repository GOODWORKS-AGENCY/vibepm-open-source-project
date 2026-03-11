import { useParams } from "react-router-dom";
import ProjectTracker from "./ProjectTracker";

export default function ProjectTrackerWrapper() {
  const { id } = useParams();
  return <ProjectTracker projectId={id} />;
}
