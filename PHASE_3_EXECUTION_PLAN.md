# Phase 3 Execution Plan: Pages & Content

> **Timeline:** 3-4 days (24-32 hours)  
> **Difficulty:** Intermediate  
> **Prerequisites:** Phase 2 completed, understanding of React Server Components

---

## 📋 Overview

**Phase Goal:** Wire up pages to content files, create dynamic project cards, and implement a contact form.

**What You'll Build:**

- ✅ Content loader system for markdown and JSON files
- ✅ Home page with hero section and CTA
- ✅ About page with bio and markdown content
- ✅ Projects page with project cards
- ✅ Project detail pages (dynamic routes)
- ✅ Contact page with form
- ✅ Markdown rendering with styling
- ✅ SEO metadata for all pages

---

## 🎯 Learning Objectives

By the end of Phase 3, you will understand:

- How to load content from markdown and JSON files
- Server Components vs Client Components (when to use each)
- File-based routing in Next.js App Router
- How to parse and render markdown content
- Form handling and validation
- Dynamic route generation
- SEO best practices with Next.js metadata

---

## 📅 Daily Timeline

### **Day 1: Content System & Home Page** (6-8 hours)

#### Morning (3-4 hours): Content Foundation

1. Install dependencies (`gray-matter`, `react-markdown`)
2. Create content folder structure
3. Build content loader utility
4. Write sample content files
5. Create TypeScript types

#### Afternoon (3-4 hours): Home Page

1. Design hero section
2. Create CTA (Call-to-Action) component
3. Add featured projects section
4. Connect to content loader
5. Test and verify

---

### **Day 2: About & Projects Pages** (8-10 hours)

#### Morning (4-5 hours): About Page

1. Create about page structure
2. Add markdown rendering
3. Style prose content (Tailwind Typography)
4. Add timeline component (optional)
5. Test responsive layout

#### Afternoon (4-5 hours): Projects Page

1. Create ProjectCard component
2. Build projects grid layout
3. Connect to projects.json data
4. Add filtering by tech stack
5. Add hover effects

---

### **Day 3: Contact & Dynamic Routes** (6-8 hours)

#### Morning (3-4 hours): Contact Page

1. Create contact form UI
2. Add form validation
3. Implement honeypot spam protection
4. Create API route for form submission
5. Add success/error states

#### Afternoon (3-4 hours): Dynamic Project Pages

1. Create dynamic route structure
2. Generate static params
3. Build project detail page
4. Add breadcrumb navigation
5. Test with multiple projects

---

### **Day 4: SEO, Polish & Testing** (4-6 hours)

#### Morning (2-3 hours): SEO & Metadata

1. Add metadata to all pages
2. Create Open Graph images
3. Generate sitemap
4. Add structured data (JSON-LD)
5. Test social sharing previews

#### Afternoon (2-3 hours): Testing & Refinement

1. Test all pages load correctly
2. Verify markdown rendering
3. Test contact form submission
4. Check responsive design
5. Validate HTML semantics

---

## 📝 Step-by-Step Implementation Guide

---

## **Step 1: Install Dependencies**

**Estimated Time:** 10 minutes

### Install Required Packages:

```bash
pnpm add gray-matter react-markdown remark-gfm rehype-highlight
pnpm add -D @tailwindcss/typography
```

### What Each Package Does:

| Package                   | Purpose                                                |
| ------------------------- | ------------------------------------------------------ |
| `gray-matter`             | Parses frontmatter (metadata) from markdown files      |
| `react-markdown`          | Renders markdown as React components                   |
| `remark-gfm`              | GitHub Flavored Markdown (tables, strikethrough, etc.) |
| `rehype-highlight`        | Syntax highlighting for code blocks                    |
| `@tailwindcss/typography` | Beautiful default styles for prose content             |

### Update Tailwind Config:

**File: `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ... existing config
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // Add this!
  ],
};

export default config;
```

---

## **Step 2: Create Content Folder Structure**

**Estimated Time:** 15 minutes

### Create Directories:

```bash
mkdir -p content/en
mkdir -p content/fr
mkdir -p content/ar
mkdir -p public/images/projects
```

### Folder Structure:

```
content/
├── en/
│   ├── home.md
│   ├── about.md
│   └── projects.json
├── fr/
│   ├── home.md
│   ├── about.md
│   └── projects.json
├── ar/
│   ├── home.md
│   ├── about.md
│   └── projects.json
public/
└── images/
    └── projects/
        ├── project1.jpg
        └── project2.jpg
```

---

## **Step 3: Create TypeScript Types**

**Estimated Time:** 20 minutes

### File: `src/types/content.ts`

```typescript
/**
 * Frontmatter metadata extracted from markdown files
 */
export interface ContentFrontmatter {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  image?: string;
  [key: string]: any; // Allow additional custom fields
}

/**
 * Complete content object with parsed frontmatter and body
 */
export interface ContentData {
  frontmatter: ContentFrontmatter;
  content: string;
  slug: string;
}

/**
 * Project data structure from projects.json
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github?: string;
  gitlab?: string;
  demo?: string;
  image?: string;
  featured?: boolean;
  year?: string;
}

/**
 * Form data for contact submissions
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string; // Spam trap
}
```

### 🎓 Understanding the Types:

- **`ContentFrontmatter`** - Metadata at the top of markdown files (YAML format)
- **`ContentData`** - The complete parsed content (metadata + body)
- **`Project`** - Structure for project information
- **`[key: string]: any`** - Allows extra fields you might add later

---

## **Step 4: Build Content Loader Utility**

**Estimated Time:** 1 hour

### File: `src/lib/content.ts`

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ContentData, ContentFrontmatter, Project } from "@/types/content";

// ============================================
// Content Loaders
// ============================================

/**
 * Get markdown content by slug and locale
 *
 * @param slug - File name without extension (e.g., "about", "home")
 * @param locale - Language code (e.g., "en", "fr", "ar")
 * @returns Parsed frontmatter and markdown content
 * @throws Error if file doesn't exist or can't be read
 *
 * @example
 * const aboutPage = getContentBySlug("about", "en");
 * console.log(aboutPage.frontmatter.title); // "About Me"
 * console.log(aboutPage.content); // "# About Me\n\nI am..."
 */
export function getContentBySlug(
  slug: string,
  locale: string = "en"
): ContentData {
  try {
    const filePath = path.join(process.cwd(), "content", locale, `${slug}.md`);

    // Check if file exists before reading
    if (!fs.existsSync(filePath)) {
      throw new Error(`Content file not found: content/${locale}/${slug}.md`);
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      frontmatter: data as ContentFrontmatter,
      content,
      slug,
    };
  } catch (error) {
    console.error(`Error loading content for slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Get all markdown files from a specific directory
 * Useful for generating static paths or listing all posts
 *
 * @param directory - Subdirectory within content folder (e.g., "blog", "projects")
 * @param locale - Language code
 * @returns Array of content data with slugs
 *
 * @example
 * const allPosts = getAllContent("blog", "en");
 * allPosts.forEach(post => console.log(post.frontmatter.title));
 */
export function getAllContent(
  directory: string,
  locale: string = "en"
): ContentData[] {
  const contentDir = path.join(process.cwd(), "content", locale, directory);

  // Return empty array if directory doesn't exist
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory not found: ${contentDir}`);
    return [];
  }

  const files = fs.readdirSync(contentDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  return markdownFiles.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(contentDir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      frontmatter: data as ContentFrontmatter,
      content,
      slug,
    };
  });
}

/**
 * Get projects data from JSON file
 *
 * @param locale - Language code (projects.json might be localized)
 * @returns Array of project objects
 *
 * @example
 * const projects = getProjectsData();
 * const featuredProjects = projects.filter(p => p.featured);
 */
export function getProjectsData(locale: string = "en"): Project[] {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      locale,
      "projects.json"
    );

    if (!fs.existsSync(filePath)) {
      // Fallback to default locale if translation doesn't exist
      const fallbackPath = path.join(
        process.cwd(),
        "content",
        "en",
        "projects.json"
      );

      if (!fs.existsSync(fallbackPath)) {
        console.warn("No projects.json file found");
        return [];
      }

      const fallbackData = fs.readFileSync(fallbackPath, "utf8");
      return JSON.parse(fallbackData);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading projects data:", error);
    return [];
  }
}

/**
 * Get a single project by ID
 *
 * @param id - Unique project identifier
 * @param locale - Language code
 * @returns Project object or null if not found */
export function getProjectById(
  id: string,
  locale: string = "en"
): Project | null {
  const projects = getProjectsData(locale);
  return projects.find((p) => p.id === id) || null;
}
```

### 🎓 Understanding the Code:

**Key Concepts:**

1. **`process.cwd()`** - Gets the absolute path to your project root
2. **`path.join()`** - Safely combines path segments (works on Windows/Mac/Linux)
3. **`fs.readFileSync()`** - Reads file contents synchronously (only works in Server Components!)
4. **`matter(content)`** - Splits YAML frontmatter from markdown body
5. **Try-catch blocks** - Gracefully handle errors without crashing

**Common Mistakes to Avoid:**

```typescript
// ❌ DON'T: Relative paths (breaks in production)
const filePath = "./content/about.md";

// ✅ DO: Absolute paths from project root
const filePath = path.join(process.cwd(), "content", "about.md");

// ❌ DON'T: Use in client components
("use client");
import { getContentBySlug } from "@/lib/content"; // Error: fs not available!

// ✅ DO: Only use in server components or API routes
// Server components don't need "use client" directive
```

---

## **Step 5: Create Sample Content Files**

**Estimated Time:** 30 minutes

### File: `content/en/home.md`

```markdown
---
title: "Hi, I'm Islamux"
description: "Full-stack developer passionate about open source"
image: "/images/hero.jpg"
---

I build modern web applications using Next.js, TypeScript, and Tailwind CSS.
Currently contributing to open-source projects and exploring new technologies.

**Skills:** React, Next.js, TypeScript, Flutter, Node.js, PostgreSQL
```

### File: `content/en/about.md`

```markdown
---
title: "About Me"
description: "Learn more about my journey as a developer"
date: "2025-11-24"
---

# About Me

I'm a full-stack developer with a passion for creating elegant, performant web applications.

## Background

- 🎓 Self-taught developer since 2018
- 💼 Freelance web developer
- 🌍 Based in Yemen
- 🛠️ Active open-source contributor

## Communities

I'm active in several tech communities:

- [LinuxAC.org](https://www.linuxac.org/) - Linux & open-source advocacy
- [Aosus.org](https://aosus.org/) - Arabic open-source community

## Tech Stack

**Frontend:**

- React / Next.js
- TypeScript
- Tailwind CSS

**Backend:**

- Node.js
- PostgreSQL
- MongoDB

**Mobile:**

- Flutter
- Dart

## Contact

Feel free to reach out via [email](mailto:fathi733@gmail.com) or connect on [GitHub](https://github.com/islamux).
```

### File: `content/en/projects.json`

```json
[
  {
    "id": "athkarix",
    "name": "Athkarix",
    "description": "Islamic prayer reminders and Athkar app built with Flutter",
    "longDescription": "A comprehensive Islamic app featuring prayer time notifications, daily supplications (Athkar), and Quranic verses. Built with Flutter for cross-platform compatibility.",
    "tech": ["Flutter", "Dart", "SQLite"],
    "github": "https://github.com/islamux/athkarix",
    "demo": "https://athkarix.netlify.app",
    "image": "/images/projects/athkarix.jpg",
    "featured": true,
    "year": "2023"
  },
  {
    "id": "portfolio",
    "name": "Developer Portfolio",
    "description": "Modern portfolio site built with Next.js 15 and TypeScript",
    "longDescription": "A fully responsive, multilingual portfolio website featuring dark mode, SEO optimization, and PWA capabilities. Demonstrates best practices in modern web development.",
    "tech": ["Next.js", "TypeScript", "Tailwind CSS"],
    "github": "https://github.com/islamux/dev-portfolio",
    "demo": "https://islamux.vercel.app",
    "image": "/images/projects/portfolio.jpg",
    "featured": true,
    "year": "2024"
  },
  {
    "id": "open-source",
    "name": "Open Source Contributions",
    "description": "Contributing to various open-source projects",
    "tech": ["JavaScript", "TypeScript", "React"],
    "github": "https://github.com/islamux",
    "featured": false,
    "year": "2022-2024"
  }
]
```

---

## **Step 6: Create Markdown Renderer Component**

**Estimated Time:** 30 minutes

### File: `src/components/ui/MarkdownContent.tsx`

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content with GitHub Flavored Markdown support
 * and syntax highlighting for code blocks
 *
 * @example
 * <MarkdownContent content={markdownString} />
 */
export function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  return (
    <article
      className={`
        prose 
        prose-slate 
        dark:prose-invert 
        max-w-none
        prose-headings:font-bold
        prose-h1:text-4xl
        prose-h2:text-3xl
        prose-h3:text-2xl
        prose-a:text-brand-500
        prose-a:no-underline
        hover:prose-a:underline
        prose-code:text-brand-600
        dark:prose-code:text-brand-400
        prose-pre:bg-gray-100
        dark:prose-pre:bg-gray-900
        ${className}
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
```

### 🎓 Understanding Tailwind Typography:

The `prose` classes style markdown content beautifully:

- **`prose`** - Base typography styles
- **`prose-slate`** - Slate color scheme
- **`dark:prose-invert`** - Inverts colors for dark mode
- **`prose-headings:font-bold`** - Makes all headings bold
- **`prose-a:text-brand-500`** - Styles links with brand color

---

## **Step 7: Create Home Page**

**Estimated Time:** 2 hours

### File: `app/page.tsx`

```tsx
import Link from "next/link";
import { getContentBySlug, getProjectsData } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

export const metadata = {
  title: "Islamux - Full-Stack Developer",
  description:
    "Full-stack developer specializing in Next.js, TypeScript, and Flutter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yoursite.com",
    siteName: "Islamux Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Islamux Portfolio",
      },
    ],
  },
};

export default function HomePage() {
  const { frontmatter, content } = getContentBySlug("home", "en");
  const projects = getProjectsData("en");
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {frontmatter.title}
            </h1>

            <div className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              <MarkdownContent content={content} />
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/projects">
                <Button variant="primary" size="lg">
                  View Projects
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 md:py-24">
          <Container>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Featured Projects
              </h2>
              <Link
                href="/projects"
                className="text-brand-500 hover:text-brand-600 font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
```

### 🎓 Understanding Server Components:

This page is a **Server Component** (no `"use client"`) which means:

- ✅ Can use `fs` module to read files
- ✅ Faster initial page load (no JavaScript sent to browser)
- ✅ Better SEO (fully rendered HTML)
- ❌ No interactivity (no `useState`, `onClick`, etc.)

For interactive parts (buttons, forms), you'll use Client Components.

---

## **Step 8: Create ProjectCard Component**

**Estimated Time:** 1 hour

### File: `src/components/sections/ProjectCard.tsx`

```tsx
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/content";
import { Icon } from "@/components/ui/Icon";

interface ProjectCardProps {
  project: Project;
}

/**
 * Project card component with tech stack and links
 *
 * @example
 * <ProjectCard project={projectData} />
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Project Image */}
      {project.image && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Year Badge */}
        {project.year && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded mb-3">
            {project.year}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium text-gray-500">
              +{project.tech.length - 3} more
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
            >
              <Icon name="github" size={16} />
              Code
            </a>
          )}

          {project.gitlab && (
            <a
              href={project.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
            >
              <Icon name="gitlab" size={16} />
              GitLab
            </a>
          )}

          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors ml-auto"
            >
              Live Demo →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
```

### 🎓 Understanding the Code:

**Key Features:**

1. **`next/image`** - Optimized images with lazy loading
2. **`group` className** - Allows hover effects on child elements
3. **`line-clamp-2`** - Limits text to 2 lines with ellipsis
4. **`slice(0, 3)`** - Shows only first 3 tech tags

**Hover Effects:**

- Image scales on hover (`group-hover:scale-105`)
- Shadow appears (`hover:shadow-xl`)
- Smooth transitions (`transition-all duration-300`)

---

## **Step 9: Create About Page**

**Estimated Time:** 45 minutes

### File: `app/about/page.tsx`

```tsx
import { getContentBySlug } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

export const metadata = {
  title: "About - Islamux",
  description: "Learn more about my journey as a full-stack developer",
};

export default function AboutPage() {
  const { frontmatter, content } = getContentBySlug("about", "en");

  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {frontmatter.description}
              </p>
            )}
          </header>

          {/* Content */}
          <MarkdownContent content={content} />
        </div>
      </Container>
    </div>
  );
}
```

-------- {/*HERE I"M STOPED  @Islamux"*/}
---

## **Step 10: Create Projects Page**

**Estimated Time:** 1.5 hours

### File: `app/projects/page.tsx`

```tsx
"use client";

import { useState, useMemo } from "react";
import { getProjectsData } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Button } from "@/components/ui/Button";

// This would normally be a Server Component, but we're making it
// a Client Component for filtering functionality

export default function ProjectsPage() {
  const projects = getProjectsData("en");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Get all unique tech stack items
  const allTech = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.tech.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on selected tech
  const filteredProjects = selectedTech
    ? projects.filter((p) => p.tech.includes(selectedTech))
    : projects;

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A collection of my work and contributions
          </p>
        </header>

        {/* Tech Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedTech === null ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedTech(null)}
          >
            All
          </Button>
          {allTech.map((tech) => (
            <Button
              key={tech}
              variant={selectedTech === tech ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedTech(tech)}
            >
              {tech}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No projects found with {selectedTech}
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
```

### 🎓 Understanding Client vs Server Components:

We made this a **Client Component** because:

- Uses `useState` for filtering
- Has interactive buttons
- Needs to re-render when filter changes

**Alternative approach:** Keep it as Server Component and use URL params for filtering:

```tsx
// Server Component version
export default function ProjectsPage({
  searchParams,
}: {
  searchParams: { tech?: string };
}) {
  const projects = getProjectsData("en");
  const filteredProjects = searchParams.tech
    ? projects.filter((p) => p.tech.includes(searchParams.tech))
    : projects;

  // ... rest of code
}
```

---

## **Step 11: Create Contact Form**

**Estimated Time:** 2 hours

### File: `src/components/sections/ContactForm.tsx`

```tsx
"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ContactFormData } from "@/types/content";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    honeypot: "", // Spam trap
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Honeypot check (bots fill this field, humans don't see it)
    if (formData.honeypot) {
      console.log("Spam detected");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", honeypot: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field (hidden from humans) */}
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="Your name"
        />
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="your@email.com"
        />
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          placeholder="Your message..."
        />
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-400">
            ✓ Message sent successfully! I'll get back to you soon.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-400">✗ {errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
```

---

## **Step 12: Create Contact API Route**

**Estimated Time:** 1 hour

### File: `app/api/contact/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { ContactFormData } from "@/types/content";

/**
 * POST /api/contact
 * Handles contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validation
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Message length validation
    if (data.message.length < 10) {
      return NextResponse.json(
        { error: "Message too short (minimum 10 characters)" },
        { status: 400 }
      );
    }

    // TODO: Send email using service like SendGrid, Resend, or Nodemailer
    // For now, just log it
    console.log("Contact form submission:", {
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // Simple mailto fallback (opens user's email client)
    // You can replace this with actual email sending service

    return NextResponse.json(
      {
        success: true,
        message: "Message received successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 🎓 Understanding API Routes:

**What is an API Route?**

- Server-side endpoint that handles HTTP requests (GET, POST, etc.)
- Runs on the server, not in browser (can access databases, send emails, etc.)
- Located in `app/api/` folder

**Security Best Practices:**

1. ✅ Validate all input
2. ✅ Use environment variables for secrets
3. ✅ Add rate limiting (prevent spam)
4. ✅ Use HTTPS in production
5. ✅ Never expose sensitive data in responses

---

## **Step 13: Create Contact Page**

**Estimated Time:** 30 minutes

### File: `app/contact/page.tsx`

```tsx
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { socialLinks } from "@/data/socialLinks";

export const metadata = {
  title: "Contact - Islamux",
  description: "Get in touch with me",
};

export default function ContactPage() {
  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Have a project in mind? Let's talk about it.
            </p>
          </header>

          {/* Contact Info */}
          <div className="mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Other Ways to Reach Me
            </h2>
            <div className="space-y-3">
              <a
                href="mailto:fathi733@gmail.com"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
              >
                <Icon name="mail" size={20} />
                fathi733@gmail.com
              </a>

              {/* Social Links from Data Source */}
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
                >
                  <Icon name={link.icon} size={20} />
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
```

---

## **Step 14: Create Dynamic Project Detail Pages**

**Estimated Time:** 1.5 hours

### Create Dynamic Route Structure:

```bash
mkdir -p app/projects/[id]
```

### File: `app/projects/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectsData, getProjectById } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Generate static paths for all projects at build time
 * This enables static generation for dynamic routes
 */
export async function generateStaticParams() {
  const projects = getProjectsData("en");

  return projects.map((project) => ({
    id: project.id,
  }));
}

/**
 * Generate metadata for each project page
 */
export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const project = getProjectById(params.id, "en");

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} - Islamux`,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = getProjectById(params.id, "en");

  // Show 404 if project not found
  if (!project) {
    notFound();
  }

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-brand-500">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/projects" className="hover:text-brand-500">
                Projects
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{project.name}</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {project.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {project.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {project.year && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {project.year}
                </span>
              )}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Project Image */}
          {project.image && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Long Description */}
          {project.longDescription && (
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p>{project.longDescription}</p>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary">
                  <Icon name="github" size={20} className="mr-2" />
                  View on GitHub
                </Button>
              </a>
            )}

            {project.gitlab && (
              <a
                href={project.gitlab}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">
                  <Icon name="gitlab" size={20} className="mr-2" />
                  View on GitLab
                </Button>
              </a>
            )}

            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">Live Demo →</Button>
              </a>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-12">
            <Link href="/projects">
              <Button variant="ghost">← Back to Projects</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
```

### 🎓 Understanding Dynamic Routes:

**Folder Structure:**

```
app/
  projects/
    page.tsx              # /projects (list all)
    [id]/
      page.tsx            # /projects/[id] (single project)
```

**Key Functions:**

1. **`generateStaticParams()`** - Tells Next.js which paths to pre-render at build time

   ```tsx
   // Generates: /projects/athkarix, /projects/portfolio, etc.
   ```

2. **`generateMetadata()`** - Dynamic SEO metadata per page

   ```tsx
   // Sets unique <title>, <meta description>, etc.
   ```

3. **`notFound()`** - Shows 404 page if project doesn't exist
   ```tsx
   if (!project) notFound();
   ```

---

## **Step 15: Add SEO Metadata**

**Estimated Time:** 30 minutes

### Create Shared Metadata:

**File: `app/metadata.ts`**

```typescript
import type { Metadata } from "next";

export const siteConfig = {
  name: "Islamux",
  title: "Islamux - Full-Stack Developer",
  description:
    "Full-stack developer specializing in Next.js, TypeScript, and Flutter. Building modern web applications.",
  url: "https://yoursite.com",
  email: "fathi733@gmail.com",
  social: {
    github: "https://github.com/islamux",
    twitter: "https://twitter.com/islamux",
    linkedin: "https://www.linkedin.com/in/fathi-alqadasi-7893471b/",
  },
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "full-stack developer",
    "web developer",
    "Next.js",
    "TypeScript",
    "React",
    "Flutter",
    "open source",
  ],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/images/og-image.jpg"],
    creator: "@islamux",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

### Update Root Layout:

**File: `app/layout.tsx`**

```tsx
import { defaultMetadata } from "./metadata";

export const metadata = defaultMetadata;

// ... rest of layout
```

---

## 🐛 Common Issues & Solutions

### Issue 1: `fs.readFileSync` Not Working in Client Components

**Symptoms:** Error "Module not found: Can't resolve 'fs'"

**Solution:**

```tsx
// ❌ DON'T: Use fs in Client Component
"use client";
import { getContentBySlug } from "@/lib/content"; // Error!

// ✅ DO: Use in Server Component
// Remove "use client" directive
import { getContentBySlug } from "@/lib/content"; // Works!
```

---

### Issue 2: Markdown Not Rendering

**Symptoms:** Markdown displays as plain text

**Solution:**

1. Verify `react-markdown` is installed:

   ```bash
   pnpm add react-markdown
   ```

2. Check component usage:

   ```tsx
   import ReactMarkdown from "react-markdown";

   <ReactMarkdown>{content}</ReactMarkdown>;
   ```

---

### Issue 3: Images Not Loading

**Symptoms:** 404 errors for project images

**Solution:**

1. Ensure images are in `public/` folder:

   ```
   public/images/projects/athkarix.jpg
   ```

2. Use correct path in JSON (starts with `/`):

   ```json
   {
     "image": "/images/projects/athkarix.jpg"
   }
   ```

3. Configure Next.js for external images (if using external URLs):
   ```js
   // next.config.js
   module.exports = {
     images: {
       domains: ["example.com"],
     },
   };
   ```

---

### Issue 4: Contact Form Not Submitting

**Symptoms:** Form doesn't send data

**Debugging Steps:**

1. **Check API route is created:**

   ```
   app/api/contact/route.ts
   ```

2. **Test API directly:**

   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
   ```

3. **Check browser console for errors:**
   - Open DevTools (F12)
   - Go to Network tab
   - Submit form
   - Look for red/failed requests

---

### Issue 5: TypeScript Errors with `params`

**Symptoms:** "Property 'params' does not exist on type..."

**Solution:**

```tsx
// ❌ Wrong
export default function Page({ params }) {
  // TypeScript error!
}

// ✅ Correct
interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  // Types work!
}
```

---

## 📋 Acceptance Criteria Checklist

Before marking Phase 3 complete, verify:

### Content System

- [ ] Content loader utility created (`src/lib/content.ts`)
- [ ] TypeScript types defined (`src/types/content.ts`)
- [ ] Sample content files created for all pages
- [ ] Markdown rendering works with styling

### Pages

- [ ] Home page displays hero and featured projects
- [ ] About page renders markdown content
- [ ] Projects page shows all projects with filtering
- [ ] Contact page has functional form
- [ ] Project detail pages work for each project

### Components

- [ ] ProjectCard component displays all info
- [ ] ContactForm has validation
- [ ] MarkdownContent renders prose correctly
- [ ] All components have TypeScript types

### Functionality

- [ ] Content loads from files (not hardcoded)
- [ ] Contact form submits to API route
- [ ] Form validation works (required fields, email format)
- [ ] Honeypot spam protection active
- [ ] Tech stack filtering works on projects page

### SEO & Performance

- [ ] Metadata configured for all pages
- [ ] Open Graph images set
- [ ] `next/image` used for all images
- [ ] Semantic HTML (`<main>`, `<article>`, `<header>`)
- [ ] Alt text on all images

### Testing

- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] All pages load without errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Forms work in all browsers

---

## 🎓 Key Takeaways for Junior Developers

### What You Learned:

1. **File System Operations:** Reading files with Node.js `fs` module
2. **Content Management:** Separating content from code (markdown files)
3. **Server vs Client:** When to use each component type
4. **Dynamic Routes:** Creating pages from data
5. **Form Handling:** Validation, submission, error states
6. **SEO Optimization:** Metadata, Open Graph, semantic HTML

### Best Practices Applied:

- ✅ Type-safe code with TypeScript
- ✅ Reusable components
- ✅ Separation of concerns (content/logic/UI)
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ Accessibility (semantic HTML, labels)

---

## 📚 Additional Resources

### Content Management

- [gray-matter Docs](https://github.com/jonschlinkert/gray-matter)
- [React Markdown Guide](https://github.com/remarkjs/react-markdown)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)

### Next.js

- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

### Forms

- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Form Validation](https://react-hook-form.com/) (Alternative approach)

---

## 🎯 Time Tracking Template

| Task                  | Estimated   | Actual | Notes |
| --------------------- | ----------- | ------ | ----- |
| Install dependencies  | 10min       |        |       |
| Content structure     | 15min       |        |       |
| TypeScript types      | 20min       |        |       |
| Content loader        | 1hr         |        |       |
| Sample content        | 30min       |        |       |
| Markdown renderer     | 30min       |        |       |
| Home page             | 2hr         |        |       |
| ProjectCard component | 1hr         |        |       |
| About page            | 45min       |        |       |
| Projects page         | 1.5hr       |        |       |
| Contact form          | 2hr         |        |       |
| Contact API           | 1hr         |        |       |
| Contact page          | 30min       |        |       |
| Dynamic routes        | 1.5hr       |        |       |
| SEO metadata          | 30min       |        |       |
| Testing               | 2hr         |        |       |
| **Total**             | **24-32hr** |        |       |

---

## 🚀 Ready to Start?

**Before you begin:**

1. ✅ Ensure Phase 2 is complete
2. ☕ Get coffee/tea
3. 📝 Create branch: `git checkout -b feature/phase-3-content`
4. 🎯 Set realistic goals (don't rush!)

**Remember:**

- Test each component as you build it
- Use `pnpm dev` to see changes live
- Check TypeScript errors frequently
- Ask for help if stuck >30 minutes

**Next Phase Preview:**
Once Phase 3 is complete, Phase 4 will add:

- 🌍 Internationalization (i18n) - Multi-language support
- 🔄 RTL layout for Arabic
- 🌐 Language switcher component

Good luck! 🎉
