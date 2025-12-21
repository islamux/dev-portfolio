import Container from "@/components/Container";
import ProjectsList from "@/components/sections/ProjectsList";
import { ProjectService } from "@/services/projectService";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: `${t("title")} - Islamux`,
    description: t("description"),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = await ProjectService.getAllProjects(locale);

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/*Header*/}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("description")}
          </p>
        </header>
        <ProjectsList 
          initialProjects={projects}
          translations={{
            code: t("card.code"),
            demo: t("card.demo")
          }}
        ></ProjectsList>
      </Container>
    </div>
  );

}
