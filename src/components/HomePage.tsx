import { getContentBySlug } from "@/lib/content";
import Container from "./Container";
import { MarkdownContent } from "./ui/MarkdownContent";
import Link from "next/link";
import Button from "./ui/Button";
import ProjectCard from "./sections/ProjectCard";
import { ProjectService } from "@/services/projectService";
import { Metadata } from "next";
import { getLocalizedHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

interface HomePageProps {
  locale: string;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return {
    title: "Islamux = Software Developer",
    description: "Full-stack developer specializing in modern web applications",
  };
}

export default async function HomePage({ locale }: HomePageProps) {
  // use service layer for featured projects
  const featuredProjects = await ProjectService.getFeaturedProjects(locale, 3);

  // Get localized hrefs for links
  const projectsHref = getLocalizedHref(locale as Locale, 'projects');
  const contactHref = getLocalizedHref(locale as Locale, 'contact');

  const { frontmatter, content } = getContentBySlug("home", locale);

  // For static export, import messages directly instead of using getTranslations
  // to avoid headers() dependency
  let translations: any = {};
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    translations = messages?.home || {};
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}:`, error);
  }

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
              <Link href={projectsHref}>
                <Button variant="primary" size="lg">
                  {translations?.hero?.cta?.projects || "View Projects"}
                </Button>
              </Link>
              {/*Link 2 */}
              <Link href={contactHref}>
                <Button variant="secondary" size="lg">{translations?.hero?.cta?.contact || "Get in Touch"}</Button>
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
                {translations?.featured?.title || "Featured Projects"}
              </h2>
              {/*Link 3*/}
              <Link href={projectsHref} className="text-brand-500 hover:text-brand-600 font-medium">
                {translations?.featured?.viewAll || "View All"}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} translations={{
                  code: translations?.card?.code || "Code",
                  demo: translations?.card?.demo || "Complete Project (Open Source)"
                }} locale={locale} />
              ))}
            </div>
            {/*View All Link at the end*/}
            <div className="mt-12 text-center">
              <Link href={projectsHref} className="text-brand-500 hover:text-brand-600 font-medium">
                {translations?.featured?.viewAllEnd || "View All"}
              </Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
