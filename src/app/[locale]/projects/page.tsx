import Container from "@/components/ui/Container";
import ProjectsList from "@/components/sections/ProjectsList";
import { ProjectService } from "@/services/projectService";
import { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps
): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  // For static export, use static metadata
  return {
    title: `Projects - Islamux`,
    description: "My portfolio projects",
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = await ProjectService.getAllProjects(locale);

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/*Header*/}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            My portfolio projects
          </p>
        </header>
        <ProjectsList
          initialProjects={projects}
          translations={{
            code: "Code",
            demo: "Demo"
          }}
          locale={locale}
        ></ProjectsList>
      </Container>
    </div>
  );

}
