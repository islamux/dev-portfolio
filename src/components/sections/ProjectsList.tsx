'use client';

import { Project } from "@/types/content";
import Button from "../ui/Button";
import ProjectCard from "./ProjectCard";
import { useProjectFilter } from "@/hooks/useProjectFilter";

interface ProjectsListProps {
  initialProjects: Project[];
  translations?: {
    code?: string;
    demo?: string;
  };
}


export default function ProjectsList({ initialProjects, translations }: ProjectsListProps) {

  // GetProject Filter
  const { selectedTech, setSelectedTech, allTech, filteredProjects } = useProjectFilter(initialProjects);
  return (
    <>
      {/*Tech Filter*/}
      <div className="mb-8 flex flex-wrap gap-2 justify-center md:justify-center">
        <Button size="sm" onClick={() => setSelectedTech(null)} active={selectedTech === null}>
          All
        </Button>
        {allTech.map((tech) => (
          <Button key={tech} size="sm" onClick={() => setSelectedTech(tech)} active={selectedTech === tech}>
            {tech}
          </Button>
        ))}
      </div>

      {/*Projects Grid*/}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} translations={translations} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No Projects found with <strong>{selectedTech}</strong>
          </p>
        </div>
      )}
    </>


  );
}
