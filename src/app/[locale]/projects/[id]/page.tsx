import { notFound } from "next/navigation";
import { ProjectService } from "@/services/projectService";
import { ProjectDetailContainer } from "@/components/sections/ProjectDetailContainer";
import { ProjectBreadcrumb } from "@/components/sections/ProjectBreadcrumb";
import { ProjectHeader } from "@/components/sections/ProjectHeader";
import { ProjectImage } from "@/components/sections/ProjectImage";
import { ProjectDescription } from "@/components/sections/ProjectDescription";
import { ProjectLinks } from "@/components/sections/ProjectLinks";
import { ProjectBackButton } from "@/components/sections/ProjectBackButton";
import { getTranslations } from "next-intl/server";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

/**
 * Generate static paths for all projects at build time
 */
export async function generateStaticParams() {
  return ProjectService.generateStaticParams();
}

// Duplicate removed

/**
 * Generate metadata for each project page
 */
export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { id, locale } = await params;
  const project = await ProjectService.getProjectById(id, locale);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} - Islamux`,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id, locale } = await params;
  const project = await ProjectService.getProjectById(id, locale);
  const t = await getTranslations({ locale, namespace: "projects" });

  // Show 404 if project not found
  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailContainer>
      <ProjectBreadcrumb params={params} projectName={project.name} />
      <ProjectHeader project={project} />
      <ProjectImage project={project} />
      <ProjectDescription project={project} />
      <ProjectLinks project={project} translations={{ demo: t("card.demo") }} />
      <ProjectBackButton params={params} />
    </ProjectDetailContainer>
  );
}
