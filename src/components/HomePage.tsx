import { getContentBySlug, getProjectData } from "@/lib/content";
import { getTranslations } from "next-intl/server";
import Container from "./Container";
import { MarkdownContent } from "./ui/MarkdownContent";
import Link from "next/link";
import Button from "./ui/Button";
import ProjectCard from "./sections/ProjectCard";
import { ProjectService } from "@/services/projectService";
import { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  return {
    title: "Islamux = Software Developer",
    description: "Full-stack developer specializing in modern web applications",
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  // use service layer for featured projects
  const featuredProjects = await ProjectService.getFeaturedProjects(locale, 3);

  const { frontmatter, content } = getContentBySlug("home", locale);

  // Get translations
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      {/*Hero section*/}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white  to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold from-gray-900 to-gray-900 dark:text-white mb-6">
              {frontmatter.title}
            </h1>
            <div className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              <MarkdownContent content={content} />
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/projects">
                <Button variant="primary" size="lg">
                  {t("hero.cta.projects")}
                </Button>
              </Link>
              {/*Link 2 */}
              <Link href="/contact">
                <Button variant="secondary" size="lg">{t("hero.cta.contact")}</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/*Feactured Projects Section*/}
      {featuredProjects.length > 0 && (
        <section className="py-16 md:py24">
          <Container>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t("featured.title")}
              </h2>
              {/*Link 3*/}
              <Link href="/projects" className="text-brand-500 hover:text-brand-600 font-medium">
                {t("featured.viewAll")}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} translations={{
                  code: t("card.code"),
                  demo: t("card.demo")
                }} />
              ))}
            </div>
            {/*View All Link at the end*/}
            <div className="mt-12 text-center">
              <Link href="/projects" className="text-brand-500 hover:text-brand-600 font-medium">
                {t("featured.viewAllEnd")}
              </Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
