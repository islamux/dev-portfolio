# Next.js Static Export Guide: Common Issues and Solutions

> **Author's Note:** This guide documents real issues encountered when building a static export of a multilingual Next.js portfolio site. The core problem was a mismatch between how Next.js generates static files with i18n and how navigation links were constructed.

This document outlines the problems, issues, and solutions encountered when building a static export of a Next.js project with internationalization (i18n).

## Table of Contents

1. [Overview](#overview)
2. [The Problem](#the-problem)
3. [Issues Encountered](#issues-encountered)
4. [Root Cause Analysis](#root-cause-analysis)
5. [Solutions Implemented](#solutions-implemented)
6. [Best Practices for Future Projects](#best-practices-for-future-projects)
7. [Key Takeaways](#key-takeaways)

---

## Overview

**Project:** Multilingual portfolio website (English, French, Arabic)
**Framework:** Next.js 16 with App Router
**i18n Solution:** next-intl
**Deployment Target:** Static hosting (requires `output: 'export'`)

---

## The Problem

When running `npx http-server out -p 3000` to serve the statically exported site, navigation links resulted in 404 errors:

```
http://localhost:3000/about       → 404
http://localhost:3000/projects    → 404
http://localhost:3000/contact     → 404
```

However, the actual static files were generated at:

```
/out/en/about.html    ✅ Works
/out/en/projects.html ✅ Works
/out/en/contact.html  ✅ Works
```

**The mismatch:** Navigation links pointed to `/about.html` but the files were at `/en/about.html`.

### Deep Dive: Why This Happens

**Understanding Static Export Behavior:**

When you set `output: 'export'` in Next.js configuration, the build process fundamentally changes:

1. **Development Server (`pnpm dev`):**
   - Uses server-side routing
   - URLs like `/about` work because Next.js handles the routing on the server
   - Locale prefix is handled by middleware automatically
   - No `.html` extensions needed

2. **Static Export (`DEPLOY_TARGET=static pnpm build`):**
   - Generates pure HTML files at build time
   - **Each route becomes a physical HTML file**
   - Files are placed in folders matching the route structure
   - **Requires `.html` extensions for files to work**

**The Critical Difference:**

```
Development:  /en/about     → Server handles routing
Static:       /en/about.html → Must exist as actual file
```

**Why Locale Prefix is Required:**

With App Router and `[locale]` dynamic segments, Next.js generates:

```
out/
├── index.html          (default locale home)
├── en.html             (English home)
├── fr.html             (French home)
├── ar.html             (Arabic home)
├── en/
│   ├── about.html      ← This file exists
│   ├── projects.html
│   └── projects/
│       └── athkarix.html
├── fr/
│   ├── about.html
│   └── ...
└── ar/
    ├── about.html
    └── ...
```

If your link points to `/about.html`, the browser looks for:
```
out/about.html  ← DOESN'T EXIST! 404!
```

But it should point to `/en/about.html`:
```
out/en/about.html  ← EXISTS! Works!
```

**Why Development Worked:**

In development, Next.js middleware automatically handles the locale prefix. When you visit `/about`, middleware redirects to `/en/about` and the server renders the page. This middleware is **disabled** in static exports, so the prefix must be explicit in your links.

---

## Issues Encountered

### Issue 1: 404 Errors on Static Routes

**Symptom:**
- All internal navigation links returned 404 errors
- Direct access to locale-prefixed URLs worked fine
- Development server (`pnpm dev`) worked correctly

**Example:**
```html
<!-- Generated link (404) -->
<a href="/about.html">About</a>

<!-- Actual file location -->
/out/en/about.html
```

### Issue 2: Missing Locale Prefix in Links

**Affected Components:**
- `SiteHeader` - Main navigation
- `HomePage` - Hero CTAs and featured projects
- `SiteFooter` - Footer quick links
- `ProjectBreadcrumb` - Breadcrumb navigation
- `ProjectBackButton` - Back to projects button
- `ProjectCard` - Project detail links

**Original Code Pattern:**
```tsx
// ❌ Hardcoded paths without locale
<Link href="/about">About</Link>
<Link href="/projects">Projects</Link>
<Link href={`/projects/${project.id}`}>View Project</Link>
```

### Issue 3: Language Switcher Not Working

**Symptom:**
- Language switcher links (`/en.html`, `/fr.html`, `/ar.html`) worked
- But the pattern wasn't consistent across the application
- Internal links didn't respect the current locale

---

## Root Cause Analysis

### 1. Next.js App Router with Dynamic Locale Routes

The project uses `[locale]` dynamic routes:

```
src/app/
  ├── [locale]/
  │   ├── page.tsx       → /en, /fr, /ar
  │   ├── about/
  │   │   └── page.tsx   → /en/about, /fr/about, /ar/about
  │   └── projects/
  │       ├── page.tsx   → /en/projects, /fr/projects, /ar/projects
  │       └── [id]/
  │           └── page.tsx → /en/projects/athkarix, etc.
```

### 2. Static Export Behavior

When `output: 'export'` is set in `next.config.ts`:

```ts
const isStatic = process.env.DEPLOY_TARGET === "static";

const nextConfig: NextConfig = {
  output: isStatic ? 'export' : undefined,
  // ...
};
```

Next.js generates static HTML files with `.html` extensions:
- `/en/index.html` (home page for English)
- `/en/about.html` (about page for English)
- `/en/projects/athkarix.html` (project detail page)

### 3. The Original Navigation Setup

The original `src/i18n/navigation.ts` had:

```tsx
const isStatic = process.env.DEPLOY_TARGET === 'static';

export const navLinks = [
  { href: isStatic ? "/index.html" : "/", label: "home" },
  { href: isStatic ? "/about.html" : "/about", label: "about" },  // ❌ Missing locale prefix
  { href: isStatic ? "/projects.html" : "/projects", label: "projects" },  // ❌ Missing locale prefix
  { href: isStatic ? "/contact.html" : "/contact", label: "contact" },  // ❌ Missing locale prefix
];
```

**The Problem:** These links don't include the locale prefix (`/en/`, `/ar/`, `/fr/`), so they point to non-existent files in the static export.

---

## Solutions Implemented

### Solution 1: Create Locale-Aware Helper Functions

**File:** `src/i18n/navigation.ts`

```tsx
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale, type Locale } from './config';

// ============================================================================
// STATIC EXPORT DETECTION
// ============================================================================
// This environment variable allows us to build the same code for both:
// 1. Development server (pnpm dev) - No .html extension, server routing
// 2. Static export (DEPLOY_TARGET=static) - .html extension required
// ============================================================================
const isStatic = process.env.DEPLOY_TARGET === 'static';

// Base routes without locale prefix - centralized for easy maintenance
const baseRoutes = {
  home: "/",
  about: "/about",
  projects: "/projects",
  contact: "/contact",
} as const;

// ============================================================================
// LOCALE-AWARE HELPER FUNCTIONS
// ============================================================================
// These functions are the KEY to solving the static export problem.
// They ensure links ALWAYS include:
// 1. The locale prefix (/en/, /fr/, /ar/)
// 2. The .html extension (when in static mode)
//
// BEFORE: href="/about"        → 404 in static (file doesn't exist)
// AFTER:  href="/en/about.html" → Works! (file exists)
// ============================================================================

/**
 * Returns a localized href that works in both dev and static export
 *
 * @param locale - The current locale ('en' | 'fr' | 'ar')
 * @param route - The route key ('home' | 'about' | 'projects' | 'contact')
 * @returns Properly formatted href for current build mode
 *
 * Examples:
 *   Static EN:  getLocalizedHref('en', 'about')  → '/en/about.html'
 *   Static FR:  getLocalizedHref('fr', 'about')  → '/fr/about.html'
 *   Dev EN:     getLocalizedHref('en', 'about')  → '/en/about'
 *   Dev Home:   getLocalizedHref('en', 'home')   → '/'
 */
export function getLocalizedHref(locale: Locale, route: keyof typeof baseRoutes): string {
  const basePath = baseRoutes[route];

  if (isStatic) {
    // STATIC EXPORT MODE
    // Must include locale prefix AND .html extension
    if (route === 'home') {
      // Special case: home page
      // Default locale: /index.html (standard static site convention)
      // Other locales:  /en.html, /fr.html, /ar.html
      return locale === defaultLocale ? '/index.html' : `/${locale}.html`;
    }
    // All other pages: /en/about.html, /fr/projects.html, etc.
    return `/${locale}${basePath}.html`;
  }

  // DEVELOPMENT MODE
  // No .html extension needed, server handles routing
  return `/${locale}${basePath}`;
}

/**
 * Returns a localized href for project detail pages
 *
 * Project pages have a dynamic structure: /projects/{id}
 * This handles the locale prefix and .html extension for static export
 *
 * @param locale - The current locale
 * @param projectId - The project ID (slug)
 * @returns Properly formatted project detail href
 *
 * Examples:
 *   Static: getProjectHref('en', 'athkarix')  → '/en/projects/athkarix.html'
 *   Dev:    getProjectHref('en', 'athkarix')  → '/en/projects/athkarix'
 */
export function getProjectHref(locale: Locale, projectId: string): string {
  if (isStatic) {
    return `/${locale}/projects/${projectId}.html`;
  }
  return `/${locale}/projects/${projectId}`;
}
```

### Solution 2: Update Components to Use Locale-Aware Links

#### SiteHeader Component

**File:** `src/components/sections/SiteHeader.tsx`

```tsx
import { navLinkKeys, getLocalizedHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

// Update props to include locale
export function SiteHeader({ navDict, locale }: { navDict: Record<string, string>; locale: string }) {

  // Generate nav links with locale prefix
  const navLinks = navLinkKeys.map(link => ({
    ...link,
    href: getLocalizedHref(locale as Locale, link.key)
  }));

  // Language switcher also uses getLocalizedHref
  return (
    <div className="text-xs">
      <Link href={getLocalizedHref('en' as Locale, 'home')}>EN</Link>
      <Link href={getLocalizedHref('fr' as Locale, 'home')}>FR</Link>
      <Link href={getLocalizedHref('ar' as Locale, 'home')}>AR</Link>
    </div>
  );
}
```

#### HomePage Component

**File:** `src/components/HomePage.tsx`

```tsx
import { getLocalizedHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Get localized hrefs for links
  const projectsHref = getLocalizedHref(locale as Locale, 'projects');
  const contactHref = getLocalizedHref(locale as Locale, 'contact');

  return (
    <>
      <Link href={projectsHref}>
        <Button variant="primary">Projects</Button>
      </Link>
      <Link href={contactHref}>
        <Button variant="secondary">Contact</Button>
      </Link>
    </>
  );
}
```

#### ProjectCard Component

**File:** `src/components/sections/ProjectCard.tsx`

```tsx
import { getProjectHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

interface ProjectCardProps {
  project: Project;
  translations?: { code?: string; demo?: string; };
  locale: string;  // Add locale prop
}

export default function ProjectCard({ project, translations, locale }: ProjectCardProps) {
  const projectHref = getProjectHref(locale as Locale, project.id);

  return (
    <Link href={projectHref}>
      <Image src={project.image} alt={project.name} />
    </Link>
  );
}
```

### Solution 3: Pass Locale Through Component Tree

**Layout:** `src/app/[locale]/layout.tsx`

```tsx
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <div lang={locale} dir={direction}>
      <SiteHeader navDict={navDict} locale={locale} />
      <main>{children}</main>
    </div>
  );
}
```

---

## Best Practices for Future Projects

### 1. Use Locale-Aware Links from the Start

**❌ Don't:**
```tsx
<Link href="/about">About</Link>
```

**✅ Do:**
```tsx
import { getLocalizedHref } from "@/i18n/navigation";

<Link href={getLocalizedHref(locale, 'about')}>About</Link>
```

### 2. Create Helper Functions Early

Create `getLocalizedHref()` and similar helpers **before** building any navigation components. This ensures locale awareness from the beginning.

### 3. Type Safety with TypeScript

Use TypeScript to enforce locale passing:

```tsx
interface LocaleAwareProps {
  locale: Locale;  // Required prop
}
```

### 4. Test Static Export Early

Don't wait until deployment to test static export:

```bash
# Build and test early
DEPLOY_TARGET=static pnpm build

# Test locally
npx http-server out -p 3000

# Verify all links work
```

### 5. Use Environment Variables for Conditional Behavior

```tsx
const isStatic = process.env.DEPLOY_TARGET === 'static';

export function getLocalizedHref(locale: Locale, route: string): string {
  if (isStatic) {
    return `/${locale}${route}.html`;
  }
  return `/${locale}${route}`;
}
```

This allows the same code to work for both:
- Development server (no `.html` extension)
- Static export (with `.html` extension)

### 6. Centralize Route Definitions

Define all routes in one place:

```tsx
// src/i18n/navigation.ts
const baseRoutes = {
  home: "/",
  about: "/about",
  projects: "/projects",
  contact: "/contact",
} as const;

export type BaseRoute = keyof typeof baseRoutes;
```

### 7. Pass Locale Explicitly

Avoid relying on context or hooks for locale in server components. Pass it explicitly:

```tsx
// ✅ Explicit
<Page locale={locale} />

// ❌ Implicit (can cause issues)
<Page />  // Reads from context
```

---

## Key Takeaways

### For Static Exports with i18n:

1. **Always include locale prefix in URLs** - Static files are generated at `/en/about.html`, not `/about.html`

2. **Add `.html` extension for static exports** - Next.js requires this when `output: 'export'` is set

3. **Test early and often** - Run `http-server out` before deploying to catch routing issues

4. **Use helper functions** - Don't hardcode paths; use `getLocalizedHref()` consistently

5. **Environment-aware code** - Use `process.env.DEPLOY_TARGET` to switch between dev and static behavior

### Common Patterns to Remember:

```tsx
// Basic navigation
getLocalizedHref(locale, 'about')  // → /en/about.html (static) or /en/about (dev)

// Home page
getLocalizedHref(locale, 'home')   // → /index.html (static) or / (dev)

// Dynamic routes
getProjectHref(locale, projectId)  // → /en/projects/athkarix.html (static)
```

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `src/i18n/navigation.ts` | Added `getLocalizedHref()` and `getProjectHref()` helpers |
| `src/components/sections/SiteHeader.tsx` | Added locale prop, use `getLocalizedHref()` |
| `src/components/HomePage.tsx` | Use `getLocalizedHref()` for all links |
| `src/components/sections/SiteFooter.tsx` | Added locale prop, use `getLocalizedHref()` |
| `src/components/sections/ProjectBreadcrumb.tsx` | Use `getLocalizedHref()` |
| `src/components/sections/ProjectBackButton.tsx` | Use `getLocalizedHref()` |
| `src/components/sections/ProjectCard.tsx` | Added locale prop, use `getProjectHref()` |
| `src/components/sections/ProjectsList.tsx` | Added locale prop, pass to `ProjectCard` |
| `src/app/[locale]/layout.tsx` | Pass `locale` to `SiteHeader` |
| `src/app/[locale]/projects/page.tsx` | Pass `locale` to `ProjectsList` |

---

## Additional Resources

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## Quick Reference

### Build Commands

```bash
# Development server (no static export)
pnpm dev

# Build static export
DEPLOY_TARGET=static pnpm build

# Serve static export locally
npx http-server out -p 3000
```

### URL Patterns (Static Export)

| Type | English | French | Arabic |
|------|---------|--------|--------|
| Home | `/index.html` | `/fr.html` | `/ar.html` |
| About | `/en/about.html` | `/fr/about.html` | `/ar/about.html` |
| Projects | `/en/projects.html` | `/fr/projects.html` | `/ar/projects.html` |
| Project Detail | `/en/projects/{id}.html` | `/fr/projects/{id}.html` | `/ar/projects/{id}.html` |
| Contact | `/en/contact.html` | `/fr/contact.html` | `/ar/contact.html` |
