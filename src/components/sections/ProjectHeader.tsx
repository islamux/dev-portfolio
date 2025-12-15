import { Project } from "@/types/content";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {project.name}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
        {project.description}
      </p>

      {/*Meta Info*/}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        {project.year && (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            {project.year}
          </span>
        )}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

