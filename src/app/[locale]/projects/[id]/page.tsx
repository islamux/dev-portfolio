import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { getProjectById, getProjectData } from "@/lib/content";
import Button from "@/components/ui/Button";
import Container from "@/components/Container";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate static paths for all projects at build time
 * This enables static generation for dynamic routes
 */
export async function generateStaticParams() {
  const projects = getProjectData("en");

  return projects.map((project) => ({
    id: project.id,
  }));
}

/**
 * Generate metadata for each project page
 */
export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id, "en");

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
  const { id } = await params;
  const project = getProjectById(id, "en");

  // Show 404 if project not found
  if (!project) {
    notFound();
  }

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-brand-500">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/projects" className="hover:text-brand-500">
                Projects
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{project.name}</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {project.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {project.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {project.year && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {project.year}
                </span>
              )}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Project Image */}
          {project.image && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Long Description */}
          {project.longDescription && (
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p>{project.longDescription}</p>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary">
                  <Icon name="github" size={20} className="mr-2" />
                  View on GitHub
                </Button>
              </a>
            )}

            {project.gitlab && (
              <a
                href={project.gitlab}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">
                  <Icon name="gitlab" size={20} className="mr-2" />
                  View on GitLab
                </Button>
              </a>
            )}

            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">Live Demo →</Button>
              </a>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-12">
            <Link href="/projects">
              <Button variant="ghost">← Back to Projects</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
