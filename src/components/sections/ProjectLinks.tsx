import { Project } from "@/types/content";
import Button from "../ui/Button";
import { Icon } from "../ui/Icon";
interface ProjectLinksProps {
  project: Project;
}

export function ProjectLinks({ project }: ProjectLinksProps) {
  const hasAnyLink = project.github || project.gitlab || project.demo;
  if (!hasAnyLink)
    return null;
  return (
    <div className="flex flex-wrap gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">

      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer">
          <Button variant="primary">
            <Icon name="github" size={20} className="mr-2" />
            View on GitHub
          </Button>
        </a>
      )}

      {/*Gitlab link*/}
      {project.gitlab && (
        <a href={project.gitlab} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary">
            <Icon name="gitlab" size={20} className="mr-2" />
            View on GitLab
          </Button>
        </a>
      )}

      {project.demo && (
        <a href={project.demo} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary">Live Demo →</Button>
        </a>
      )}

    </div>

  );
}
