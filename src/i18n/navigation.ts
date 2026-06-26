import { createNavigation } from 'next-intl/navigation';
import { locales, type Locale } from './config';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales });

// Base routes without locale prefix
const baseRoutes = {
  home: "/",
  about: "/about",
  projects: "/projects",
  contact: "/contact",
} as const;

export function getLocalizedHref(locale: Locale, route: keyof typeof baseRoutes): string {
  const basePath = baseRoutes[route];
  return `/${locale}${basePath}`;
}

export function getProjectHref(locale: Locale, projectId: string): string {
  return `/${locale}/projects/${projectId}`;
}

// navLinks for use in components - these will be processed at runtime
export const navLinkKeys = [
  { key: "home" as const, label: "home" },
  { key: "about" as const, label: "about" },
  { key: "projects" as const, label: "projects" },
  { key: "contact" as const, label: "contact" },
] as const;


