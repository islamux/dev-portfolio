import { Project } from "@/types/content";
import Image from "next/image";
import { Icon } from "../ui/Icon";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Badge } from "../ui/badge";

interface ProjectCardProps {
  project: Project;
}


export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300">
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
      <CardContent className="p-6">
        {/*Year Badge*/}
        {project.year && (
          <Badge className="mb-3 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border-none hover:bg-brand-200 dark:hover:bg-brand-900/50">
            {project.year}
          </Badge>
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
            <Badge
              key={tech}
              variant="outline"
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {tech}
            </Badge>
          ))}
          {project.tech.length > 3 && (
            <Badge variant="outline" className="text-gray-500 border-gray-300 dark:border-gray-700">
              {project.tech.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      {/*Links */}
      <CardFooter className="p-6 pt-0 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 w-full">
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
      </CardFooter>
    </Card>
  );
}

