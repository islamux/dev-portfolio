# Refactoring the HomePage Component

This guide outlines the process of refactoring the `HomePage.tsx` component to align with Next.js App Router best practices.

## Objective

The primary goal is to move page-specific rendering and logic out of the generic `src/components` directory and into the route-specific `src/app/[locale]/page.tsx` file. This co-locates the route definition with its implementation, making the project structure more intuitive and maintainable.

## Files Involved

- `src/app/[locale]/page.tsx` (Will be modified)
- `src/components/HomePage.tsx` (Will be deleted)
- `src/app/(index)/page.tsx` (No changes needed, for context only)

---

## Step-by-Step Guide

### Step 1: Understand the Current Structure

Currently, `src/app/[locale]/page.tsx` is a simple wrapper component that imports and renders `HomePage.tsx`.

**`src/app/[locale]/page.tsx` (Before Refactor):**
```tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import HomePage from "@/components/HomePage";
import { siteConfig } from '@/app/metadata';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetaData({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  // For static export, use static metadata to avoid headers() usage
  return {
    title: "Islamux - Software Developer",
    description: "Full-stack developer specializing in modern web applications",
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale === "fr" ? "fr_FR" : "en_US",
      url: siteConfig.name,
      images: [
        {
          url: "images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Islamux - Software Developer",
        }
      ]
    }
  }
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <HomePage locale={locale} />
  );
}
```

The logic for rendering the homepage resides entirely in `src/components/HomePage.tsx`. Our goal is to merge that logic into the file above.

*(Note: `src/app/(index)/page.tsx` simply redirects to `/en` and does not need to be changed.)*

### Step 2: Consolidate Logic into `[locale]/page.tsx`

Replace the entire content of `src/app/[locale]/page.tsx` with the following code. This new code merges the logic from `HomePage.tsx` directly into the `Page` component and corrects the import paths.

**`src/app/[locale]/page.tsx` (After Refactor):**
```tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from "next/link";
import { getContentBySlug } from "@/lib/content";
import { ProjectService } from "@/services/projectService";
import { getLocalizedHref } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import { siteConfig } from '@/app/metadata';

import Container from "@/components/Container";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/sections/ProjectCard";

interface PageProps {
  params: { locale: string };
}

export async function generateMetaData({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = params;
  setRequestLocale(locale);

  // For static export, use static metadata to avoid headers() usage
  return {
    title: "Islamux - Software Developer",
    description: "Full-stack developer specializing in modern web applications",
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale === "fr" ? "fr_FR" : "en_US",
      url: siteConfig.name,
      images: [
        {
          url: "images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Islamux - Software Developer",
        }
      ]
    }
  }
};

export default async function Page({ params: { locale } }: PageProps) {
  setRequestLocale(locale);

  // use service layer for featured projects
  const featuredProjects = await ProjectService.getFeaturedProjects(locale, 3);

  // Get localized hrefs for links
  const projectsHref = getLocalizedHref(locale as Locale, 'projects');
  const contactHref = getLocalizedHref(locale as Locale, 'contact');

  const { frontmatter, content } = getContentBySlug("home", locale);

  // For static export, import messages directly instead of using getTranslations
  // to avoid headers() dependency
  let translations: any = {};
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    translations = messages?.home || {};
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}:`, error);
  }

  return (
    <>
      {/*Hero section*/}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white  to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold from-gray-900 to-gray-900 dark:text-white mb-6">
              {frontmatter.title}
            </h1>
            <div className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              <MarkdownContent content={content} />
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={projectsHref}>
                <Button variant="primary" size="lg">
                  {translations?.hero?.cta?.projects || "View Projects"}
                </Button>
              </Link>
              {/*Link 2 */}
              <Link href={contactHref}>
                <Button variant="secondary" size="lg">{translations?.hero?.cta?.contact || "Get in Touch"}</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/*Feactured Projects Section*/}
      {featuredProjects.length > 0 && (
        <section className="py-16 md:py24">
          <Container>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {translations?.featured?.title || "Featured Projects"}
              </h2>
              {/*Link 3*/}
              <Link href={projectsHref} className="text-brand-500 hover:text-brand-600 font-medium">
                {translations?.featured?.viewAll || "View All"}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} translations={{
                  code: translations?.card?.code || "Code",
                  demo: translations?.card?.demo || "Complete Project (Open Source)"
                }} locale={locale} />
              ))}
            </div>
            {/*View All Link at the end*/}
            <div className="mt-12 text-center">
              <Link href={projectsHref} className="text-brand-500 hover:text-brand-600 font-medium">
                {translations?.featured?.viewAllEnd || "View All"}
              </Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
```

### Step 3: Clean Up

The `src/components/HomePage.tsx` file is now redundant and can be safely deleted.

### Step 4: Verification

Run the development server to ensure everything works as expected.

```bash
pnpm dev
```

Navigate to a few homepages (e.g., `http://localhost:3000/en`, `http://localhost:3000/fr`) to confirm they render correctly. The appearance and functionality should be identical to before the refactor.
