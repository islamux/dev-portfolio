import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale, type Locale } from './config';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales });

// Use .html extension for static export
const isStatic = process.env.DEPLOY_TARGET === 'static';

// Base routes without locale prefix
const baseRoutes = {
  home: "/",
  about: "/about",
  projects: "/projects",
  contact: "/contact",
} as const;

// Helper function to get localized href for static export
export function getLocalizedHref(locale: Locale, route: keyof typeof baseRoutes): string {
  const basePath = baseRoutes[route];
  if (isStatic) {
    // For static export, include locale prefix and .html extension
    if (route === 'home') {
      // Home page: /en.html or /index.html for default locale
      return locale === defaultLocale ? '/' : `/${locale}/`;
    }
    // Other pages: /en/about.html
    return `/${locale}${basePath}/`;
  }
  // For dev server: /en/about
  return `/${locale}${basePath}`;
}

// Helper function to get localized project detail href
export function getProjectHref(locale: Locale, projectId: string): string {
  if (isStatic) {
    return `/${locale}/projects/${projectId}/`;
  }
  return `/${locale}/projects/${projectId}`;
}

// navLinks for use in components - these will be processed at runtime
export const navLinkKeys = [
  { key: "home" as const, label: "home" },
  { key: "about" as const, label: "about" },
  { key: "projects" as const, label: "projects" },
  { key: "contact" as const, label: "contact" },
] as const;


