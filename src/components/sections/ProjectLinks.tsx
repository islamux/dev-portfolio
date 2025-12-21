import { Project } from "@/types/content";
import Button from "../ui/Button";
import { Icon } from "../ui/Icon";
import { ProjectLink } from "../ui/ProjectLink";
interface ProjectLinksProps {
  project: Project;
  translations?: {
    demo?: string;
  };
}

export function ProjectLinks({ project, translations }: ProjectLinksProps) {
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
          <Button variant="secondary">
            <ProjectLink
              href={project.demo}
              icon="globe"
              text={translations?.demo || "Live Demo"}
              className="p-0 text-base"
            />
          </Button>
        </a>
      )}

    </div>

  );
}
