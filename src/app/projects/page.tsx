

import Container from "@/components/Container";
import ProjectsList from "@/components/sections/ProjectsList";
import { getProjectData } from "@/lib/content";

export default function ProjectPage() {

  const projects = getProjectData("en");

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/*Header*/}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A collection of my work and contributions
          </p>
        </header>
        <ProjectsList initialProjects={projects}></ProjectsList>
      </Container>
    </div>
  );
}
