import { Icon } from "./Icon";
import type { IconName } from "./icons";

interface ProjectLinkProps {
  href: string;
  icon: IconName;
  text: string;
  className?: string;
}

export function ProjectLink({ href, icon, text, className = "" }: ProjectLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors ${className}`}
    >
      <Icon name={icon} size={16} />
      {text}
    </a>
  );
}