import { locales, parseLocale } from "@/i18n/config";
import { setRequestLocale } from 'next-intl/server';
import { getAllProjects, getProjectById } from "@/services/projectService";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllProjects(locale).map((project) => ({ locale, id: project.id }))
  );
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const locale = parseLocale((await params).locale);
  setRequestLocale(locale);

  const project = getProjectById(id, locale);

  if (!project) {
    return (
      <div className="container mx-auto py-20">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20">
      <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        {project.description}
      </p>
      <div className="prose dark:prose-invert max-w-none">
        <p>{project.longDescription}</p>
      </div>
    </div>
  );
}
