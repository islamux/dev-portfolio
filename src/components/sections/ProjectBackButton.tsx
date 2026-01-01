import Link from "next/link";
import { use } from "react";
import Button from "../ui/Button";
import { getLocalizedHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

interface ProjectBackButtonProps {
  params: Promise<{ locale: string }>;

}

export function ProjectBackButton({ params }: ProjectBackButtonProps) {
  const { locale } = use(params);

  const projectsHref = getLocalizedHref(locale as Locale, 'projects');

  return (
    <div className="mt-12">
      <Link href={projectsHref}>
        <Button variant="ghost">← Back to Projects </Button>
      </Link>

    </div>
  );
}
