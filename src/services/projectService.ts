import { getProjectById as findProjectById, getProjectData } from "@/lib/content";
import type { Project } from "@/types/content";

export function getAllProjects(locale: string): Project[] {
  return getProjectData(locale);
}

export function getFeaturedProjects(locale: string, limit: number = 3): Project[] {
  return getProjectData(locale)
    .filter((project) => project.featured)
    .slice(0, limit);
}

export function getProjectById(id: string, locale: string): Project | null {
  return findProjectById(id, locale);
}
