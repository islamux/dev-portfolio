'use client';

import { Project } from "@/types/content";
import Button from "../ui/Button";
import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";

interface ProjectsListProps {
  initialProjects: Project[];
}



export default function ProjectsList({ initialProjects }: ProjectsListProps) {

  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Get all unique tech stack items
  const allTech = useMemo(() => {
    const techSet = new Set<string>();
    initialProjects.forEach((project) => {
      project.tech.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [initialProjects]);

  // Filter projects based on selected tech.
  const filterProjects = selectedTech
    ? initialProjects.filter((p) => p.tech.includes(selectedTech))
    : initialProjects;

  return (
    <>
      {/*Tech Filter*/}
      <div className="mb-8 flex flex-wrap gap-2 justify-center md:justify-center">
        <Button variant={selectedTech === null ? "primary" : "ghost"} size="sm" onClick={() => setSelectedTech(null)}>
          All
        </Button>
        {allTech.map((tech) => (
          <Button key={tech} variant={selectedTech === tech ? "primary" : "ghost"} size="sm" onClick={() => setSelectedTech(tech)}>
            {tech}
          </Button>
        ))}
      </div>

      {/*Projects Grid*/}
      {filterProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterProjects.map((project) => (
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
