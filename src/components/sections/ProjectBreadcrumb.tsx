import Link from "next/link";
import { use } from "react";
import { getLocalizedHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

interface ProjectBreadcrumbProps {
  params: Promise<{ locale: string }>;
  projectName: string;
}

export function ProjectBreadcrumb({ params, projectName }: ProjectBreadcrumbProps) {
  const { locale } = use(params);

  const homeHref = getLocalizedHref(locale as Locale, 'home');
  const projectsHref = getLocalizedHref(locale as Locale, 'projects');

  return (
    <nav className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-fuchsia-400">

        {/*Home */}
        <li>
          <Link href={homeHref} className="hover:text-brand-500" >
            Home
          </Link>
        </li>
        <li>/</li>

        {/*Projects*/}
        <li>
          <Link href={projectsHref} className="hover:text-brand-500">
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
