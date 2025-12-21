/**
 * Reusable ProjectLink Component
 * 
 * This component implements the DRY principle by centralizing the repeated
 * link structure that was previously duplicated in ProjectCard and ProjectLinks.
 * 
 * Benefits:
 * - Single source of truth for project link styling
 * - Consistent behavior across all project links
 * - Easier maintenance and updates
 * - Reduced code duplication
 * 
 * @param href - The URL to link to
 * @param icon - The icon name to display (github, gitlab, globe, etc.)
 * @param text - The link text to display
 * @param className - Additional CSS classes for customization
 */
import { Icon } from "./Icon";

interface ProjectLinkProps {
  href: string;
  icon: string;
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