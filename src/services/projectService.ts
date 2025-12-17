import { Project } from "@/types/content"
import { getProjectById, getProjectData } from "@/lib/content"
import { locales } from "@/i18n/config";

export class ProjectService {
  /**
   * Get a single project by ID with proper locale handling
   */
  static async getProjectById(id: string, locale: string): Promise<Project | null> {
    try {
      return getProjectById(id, locale);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  }

  /**
   * Get all projects for a specific locale
   */
  static async getAllProjects(locale: string): Promise<Project[]> {
    try {
      return getProjectData(locale);
    } catch (error) {
      console.error(`Error fetching projects for locale ${locale}:`, error);
      return [];
    }
  }

  /**
   * Generate static params for all projects
   */
  static async generateStaticParams(): Promise<Array<{ id: string; locale: string }>> {
    try {
      const paths: Array<{ id: string; locale: string }> = [];
      
      for (const locale of locales) {
        const projects = getProjectData(locale);
        projects.forEach((project) => {
          paths.push({
            id: project.id,
            locale,
          });
        });
      }
      
      return paths;
    } catch (error) {
      console.error("Error generating static params:", error);
      return [];
    }
  }

  /**
   * Get featured projects
   */
  static async getFeaturedProjects(locale: string, limit: number = 3): Promise<Project[]> {
    try {
      const projects = getProjectData(locale);
      return projects
        .filter((project) => project.featured)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      return [];
    }
  }
}

