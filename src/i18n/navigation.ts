import { defaultLocale, type Locale } from './config';

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

export function buildLocalePath(pathname: string, currentLocale: Locale, nextLocale: Locale): string {
  if (pathname === "/" && nextLocale !== defaultLocale) {
    return `/${nextLocale}`;
  }
  const currentPrefix = `/${currentLocale}`;
  if (pathname.startsWith(currentPrefix)) {
    return pathname.replace(currentPrefix, `/${nextLocale}`);
  }
  return `/${nextLocale}${pathname}`;
}

export const navLinkKeys = [
  { key: "home" as const, label: "home" },
  { key: "about" as const, label: "about" },
  { key: "projects" as const, label: "projects" },
  { key: "contact" as const, label: "contact" },
] as const;


