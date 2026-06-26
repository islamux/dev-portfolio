import Container from "@/components/ui/Container";
import ProjectsList from "@/components/sections/ProjectsList";
import { ProjectService } from "@/services/projectService";
import { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { loadMessages } from '@/lib/content';
import { defaultMetadata } from '@/app/metadata';
import type { ProjectsTranslations, ProjectFilterTranslations } from '@/types/content';

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
    metadataBase: defaultMetadata.metadataBase,
    title: `Projects - Islamux`,
    description: "My portfolio projects",
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = await ProjectService.getAllProjects(locale);

  // For static export, import messages directly instead of using getTranslations
  // to avoid headers() dependency
  const messages = await loadMessages(locale);
  const translations = (messages.projects ?? {}) as ProjectsTranslations;
  const projectsMessages = messages.projects as Record<string, unknown> | undefined;
  const filterTranslations = projectsMessages?.filter as ProjectFilterTranslations | undefined;

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/*Header*/}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {translations.title || "Projects"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {translations.description || "My portfolio projects"}
          </p>
        </header>
        <ProjectsList
          initialProjects={projects}
          translations={{
            code: translations?.card?.code ,
            demo: translations?.card?.demo
          }}
          filterTranslations={filterTranslations}
          locale={locale}
        ></ProjectsList>
      </Container>
    </div>
  );

}
