import Link from "next/link";
import { use } from "react";
import Button from "../ui/Button";

interface ProjectBackButtonProps {
  params: Promise<{ locale: string }>;

}

export function ProjectBackButton({ params }: ProjectBackButtonProps) {
  const { locale } = use(params);

  return (
    <div className="mt-12">
      <Link href={`${locale}/projects`}>
        <Button variant="ghost">← Back to Projects </Button>
      </Link>

    </div>
  );
}
