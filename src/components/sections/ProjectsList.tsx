'use client';

import { Project } from "@/types/content";
import { Button } from "../ui/button";
import ProjectCard from "./ProjectCard";
import { useProjectFilter } from "@/hooks/useProjectFilter";

interface ProjectsListProps {
  initialProjects: Project[];
}


export default function ProjectsList({ initialProjects }: ProjectsListProps) {

  // GetProject Filter
  const { selectedTech, setSelectedTech, allTech, filteredProjects } = useProjectFilter(initialProjects);
  return (
    <>
      {/*Tech Filter*/}
      <div className="mb-8 flex flex-wrap gap-2 justify-center md:justify-center">
        <Button 
          className={`h-8 px-3 text-xs rounded-md ${selectedTech === null ? 'bg-brand-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
          onClick={() => setSelectedTech(null)}
        >
          All
        </Button>
        {allTech.map((tech) => (
          <Button 
            key={tech}
            className={`h-8 px-3 text-xs rounded-md ${selectedTech === tech ? 'bg-brand-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
            onClick={() => setSelectedTech(tech)}
          >
            {tech}
          </Button>
        ))}
      </div>

      {/*Projects Grid*/}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
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
