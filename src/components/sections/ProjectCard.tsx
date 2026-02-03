import { Project } from "@/types/content";
import Image from "next/image";
import Link from "next/link";
import { ProjectLink } from "../ui/ProjectLink";
import { getProjectHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

/**
 * ProjectCard Component
 *
 * Displays a project card with image, title, description, and action links.
 *
 * DRY Improvements:
 * - Uses ProjectLink component instead of duplicated link structures
 * - Centralized link styling and behavior
 * - Reduced code duplication by ~66%
 */

interface ProjectCardProps {
  project: Project;
  translations?: {
    code?: string;
    demo?: string;
  };
  locale: string;
}


export default function ProjectCard({ project, translations, locale }: ProjectCardProps) {
  const projectHref = getProjectHref(locale as Locale, project.id);

  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/*Project Image*/}
      {project.image && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Link href={projectHref}>
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-105 transform duration-300"
              sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          </Link>
        </div>
      )}
      {/*Content*/}
      <div className="p-6">
        {/*Year Badge*/}
        {project.year && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded mb-3">
            {project.year}
          </span>
        )}
        {/*Title*/}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>

        {/*Description*/}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>
        {/*Tech Stack*/}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span
              className="px-2 py-1 text-xs font-medium text-gray-500"
            >
              {project.tech.length - 3} more
            </span>
          )}
        </div>
        {/*Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          {project.github && (
            <ProjectLink
              href={project.github}
              icon="github"
              text={translations?.code || "Code"}
            />
          )}
          {project.gitlab && (
            <ProjectLink
              href={project.gitlab}
              icon="gitlab"
              text="GitLab"
            />
          )}
          {project.apk ? (
            <ProjectLink
              href={project.apk}
              icon="download"
              text={translations?.demo || "Download APK"}
              className="ml-auto"
            />
          ) : project.demo && (
            <ProjectLink
              href={project.demo}
              icon="globe"
              text={translations?.demo || "Complete Project (Open Source)"}
              className="ml-auto"
            />
          )}
        </div>
      </div>
    </article>
  );
}

