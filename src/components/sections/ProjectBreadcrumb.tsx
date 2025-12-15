import Link from "next/link";
import { use } from "react";

interface ProjectBreadcrumbProps {
  params: Promise<{ locale: string }>;
  projectName: string;
}

export function ProjectBreadcrumb({ params, projectName }: ProjectBreadcrumbProps) {
  const { locale } = use(params);
  return (
    <nav className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-fuchsia-400">

        {/*Home */}
        <li>
          <Link href={`/${locale}`} className="hover:text-brand-500" >
            Home
          </Link>
        </li>
        <li>/</li>

        {/*Projects*/}
        <li>
          <Link href={`${locale}/projects`} className="hover:text-brand-500">
            Projects
          </Link>
        </li>
        <li>/</li>
        <li className="text-gray-900 dark:text-white">
          {projectName}
        </li>
      </ol>
    </nav>
  );
}
