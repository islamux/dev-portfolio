import Image from "next/image";
import { Project } from "@/types/content";

interface ProjectImageProps {
  project: Project;
}

export function ProjectImage({ project }: ProjectImageProps) {
  if (!project.image) {
    return null;
  }
  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
      <Image
        src={project.image}
        alt={project.name}
        fill
        className="object-cover"
        priority
      />
    </div>

  );

}
