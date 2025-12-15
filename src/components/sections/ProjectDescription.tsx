import { Project } from "@/types/content";

interface ProjectDescriptionProps {
  project: Project;
}


export function ProjectDescription({ project }: ProjectDescriptionProps) {
  if (!project.longDescription)
    return null;
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
      <p>{project.longDescription}</p>
    </div>
  );
}
