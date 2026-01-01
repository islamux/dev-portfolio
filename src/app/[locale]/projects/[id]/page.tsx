import fs from "fs";
import path from "path";
import { locales } from "@/i18n/config";
import { setRequestLocale } from 'next-intl/server';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  [key: string]: any;
}

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];

  for (const locale of locales) {
    try {
      const filePath = path.join(process.cwd(), "content", locale, "projects.json");
      if (fs.existsSync(filePath)) {
         const projectsData = fs.readFileSync(filePath, "utf-8");
         const projects = JSON.parse(projectsData);
         projects.forEach((p: ProjectData) => {
           if (p.id) {
             params.push({ locale, id: p.id });
           }
         });
      }
    } catch {
      console.warn(`Could not load projects for locale ${locale} during static params generation.`);
    }
  }

  return params;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id, locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  // Load project data directly
  let project: ProjectData | null = null;
  try {
    const filePath = path.join(process.cwd(), "content", locale, "projects.json");
    const projectsData = fs.readFileSync(filePath, "utf-8");
    const projects = JSON.parse(projectsData);
    project = projects.find((p: ProjectData) => p.id === id);
  } catch (error) {
    console.error(`Error loading project ${id} for locale ${locale}:`, error);
    return (
      <div className="container mx-auto py-20">
        <h1 className="text-4xl font-bold mb-4">Error Loading Project</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Failed to load project data. Please try again later.
        </p>
      </div>
    );
  }

  // Show message if project not found
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
