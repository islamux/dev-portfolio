import { Project } from "@/types/content";
import Image from "next/image";
import { Icon } from "../ui/Icon";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}


export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/*Project Image*/}
      {project.image && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Link href={`/projects/${project.id}`}>
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
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
              <Icon name="github" size={16} />
              Code
            </a>
          )}
          {project.gitlab && (
            <a
              href={project.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
              <Icon name="gitlab" size={16} />
              GitLab
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors ml-auto"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

