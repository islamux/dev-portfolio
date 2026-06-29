import { Project } from "@/types/content"
import { getProjectById, getProjectData } from "@/lib/content"

export class ProjectService {
  static async getProjectById(id: string, locale: string): Promise<Project | null> {
    return getProjectById(id, locale);
  }

  static async getAllProjects(locale: string): Promise<Project[]> {
    return getProjectData(locale);
  }

  static async getFeaturedProjects(locale: string, limit: number = 3): Promise<Project[]> {
    const projects = getProjectData(locale);
    return projects.filter((project) => project.featured).slice(0, limit);
  }
}

