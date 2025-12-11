import { useMemo, useState } from "react";
import { Project } from "@/types/content";
export function useProjectFilter(projects: Project[]) {

  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  // Extract unique technologies
  const allTech = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.tech.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects 
  const filteredProjects = useMemo(() => {
    if (!selectedTech) return projects;
    return projects.filter((p) => p.tech.includes(selectedTech));

  }, [projects, selectedTech]);

  // clear filter
  const clearFilter = () => setSelectedTech(null);

  return {
    selectedTech,
    setSelectedTech,
    allTech,
    filteredProjects,
    clearFilter,
  };
}
