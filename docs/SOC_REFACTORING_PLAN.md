# Separation of Concerns Refactoring Plan

## Overview
This document outlines the refactoring plan to fix Separation of Concerns (SoC) violations in the portfolio project.

## Issues Identified

### 1. CRITICAL: Project Detail Page (`src/app/[locale]/projects/[id]/page.tsx`)
**Problem**: 177 lines mixing business logic, presentation, styling, and data fetching.

**Current Issues**:
- Hardcoded locale "en" instead of using params.locale
- Mixed concerns: data fetching + presentation + styling
- No component decomposition
- Not testable

### 2. MEDIUM: ProjectCard Component Bugs (`src/components/sections/ProjectCard.tsx`)
**Problem**: Broken string interpolation on lines 63 and 73.

**Current Issues**:
- `{project.github}` renders as literal string instead of variable
- Should be `{project.github}` (backticks for template literals)

### 3. MINOR: Missing Service Layer
**Problem**: No abstraction for project operations.

---

## Phase 1: Create Service Layer

### 1.1 Create Project Service (`src/services/projectService.ts`)

```typescript
import { Project } from "@/types/content";
import { getProjectById, getProjectData } from "@/lib/content";

export class ProjectService {
  /**
   * Get a single project by ID with proper locale handling
   */
  static async getProjectById(id: string, locale: string): Promise<Project | null> {
    try {
      return getProjectById(id, locale);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  }

  /**
   * Get all projects for a specific locale
   */
  static async getAllProjects(locale: string): Promise<Project[]> {
    try {
      return getProjectData(locale);
    } catch (error) {
      console.error(`Error fetching projects for locale ${locale}:`, error);
      return [];
    }
  }

  /**
   * Generate static params for all projects
   */
  static async generateStaticParams(): Promise<Array<{ id: string }>> {
    try {
      const projects = getProjectData("en");
      return projects.map((project) => ({
        id: project.id,
      }));
    } catch (error) {
      console.error("Error generating static params:", error);
      return [];
    }
  }

  /**
   * Get featured projects
   */
  static async getFeaturedProjects(locale: string, limit: number = 3): Promise<Project[]> {
    try {
      const projects = getProjectData(locale);
      return projects
        .filter((project) => project.featured)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      return [];
    }
  }
}
```

### 1.2 Create Type Definitions (`src/types/project.ts`)

```typescript
export interface ProjectMetadata {
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    images: string[];
  };
}

export interface ProjectPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}
```

---

## Phase 2: Extract Components from Project Detail Page

### 2.1 Create Project Header Component (`src/components/sections/ProjectHeader.tsx`)

```typescript
import { Project } from "@/types/content";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
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
  );
}
```

### 2.2 Create Project Image Component (`src/components/sections/ProjectImage.tsx`)

```typescript
import Image from "next/image";
import { Project } from "@/types/content";

interface ProjectImageProps {
  project: Project;
}

export function ProjectImage({ project }: ProjectImageProps) {
  if (!project.image) {
    return null;
  }

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
      <Image
        src={project.image}
        alt={project.name}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
```

### 2.3 Create Project Description Component (`src/components/sections/ProjectDescription.tsx`)

```typescript
import { Project } from "@/types/content";

interface ProjectDescriptionProps {
  project: Project;
}

export function ProjectDescription({ project }: ProjectDescriptionProps) {
  if (!project.longDescription) {
    return null;
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
      <p>{project.longDescription}</p>
    </div>
  );
}
```

### 2.4 Create Project Links Component (`src/components/sections/ProjectLinks.tsx`)

```typescript
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Project } from "@/types/content";

interface ProjectLinksProps {
  project: Project;
}

export function ProjectLinks({ project }: ProjectLinksProps) {
  const hasAnyLink = project.github || project.gitlab || project.demo;

  if (!hasAnyLink) {
    return null;
  }

  return (
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
  );
}
```

### 2.5 Create Project Breadcrumb Component (`src/components/sections/ProjectBreadcrumb.tsx`)

```typescript
import Link from "next/link";
import { use } from "react";

interface ProjectBreadcrumbProps {
  params: Promise<{
    locale: string;
  }>;
  projectName: string;
}

export function ProjectBreadcrumb({ params, projectName }: ProjectBreadcrumbProps) {
  const { locale } = use(params);

  return (
    <nav className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link href={`/${locale}`} className="hover:text-brand-500">
            Home
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link href={`/${locale}/projects`} className="hover:text-brand-500">
            Projects
          </Link>
        </li>
        <li>/</li>
        <li className="text-gray-900 dark:text-white">{projectName}</li>
      </ol>
    </nav>
  );
}
```

### 2.6 Create Project Back Button Component (`src/components/sections/ProjectBackButton.tsx`)

```typescript
import Link from "next/link";
import { use } from "react";
import Button from "@/components/ui/Button";

interface ProjectBackButtonProps {
  params: Promise<{
    locale: string;
  }>;
}

export function ProjectBackButton({ params }: ProjectBackButtonProps) {
  const { locale } = use(params);

  return (
    <div className="mt-12">
      <Link href={`/${locale}/projects`}>
        <Button variant="ghost">← Back to Projects</Button>
      </Link>
    </div>
  );
}
```

### 2.7 Create Project Detail Container (`src/components/sections/ProjectDetailContainer.tsx`)

```typescript
import Container from "@/components/Container";
import { Project } from "@/types/content";

interface ProjectDetailContainerProps {
  children: React.ReactNode;
}

export function ProjectDetailContainer({ children }: ProjectDetailContainerProps) {
  return (
    <div className="py-12 md:py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </Container>
    </div>
  );
}
```

---

## Phase 3: Refactor Project Detail Page

### 3.1 Update `src/app/[locale]/projects/[id]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import { ProjectService } from "@/services/projectService";
import { ProjectDetailContainer } from "@/components/sections/ProjectDetailContainer";
import { ProjectBreadcrumb } from "@/components/sections/ProjectBreadcrumb";
import { ProjectHeader } from "@/components/sections/ProjectHeader";
import { ProjectImage } from "@/components/sections/ProjectImage";
import { ProjectDescription } from "@/components/sections/ProjectDescription";
import { ProjectLinks } from "@/components/sections/ProjectLinks";
import { ProjectBackButton } from "@/components/sections/ProjectBackButton";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

/**
 * Generate static paths for all projects at build time
 */
export async function generateStaticParams() {
  return ProjectService.generateStaticParams();
}

/**
 * Generate metadata for each project page
 */
export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { id, locale } = await params;
  const project = await ProjectService.getProjectById(id, locale);

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

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id, locale } = await params;
  const project = await ProjectService.getProjectById(id, locale);

  // Show 404 if project not found
  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailContainer>
      <ProjectBreadcrumb params={params} projectName={project.name} />
      <ProjectHeader project={project} />
      <ProjectImage project={project} />
      <ProjectDescription project={project} />
      <ProjectLinks project={project} />
      <ProjectBackButton params={params} />
    </ProjectDetailContainer>
  );
}
```

---

## Phase 4: Fix ProjectCard Bugs

### 4.1 Update `src/components/sections/ProjectCard.tsx`

```typescript
import { Project } from "@/types/content";
import Image from "next/image";
import { Icon } from "../ui/Icon";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/*Project Image*/}
      {project.image && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Link href={`/projects/${project.id}`}>
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-105 transform duration-300 "
              sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          </Link>
        </div>
      )}
      {/*Content*/}
      <div className="p-6">
        {/*Year Badge*/}
        {project.year && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded mb-3">
            {project.year}
          </span>
        )}
        {/*Title*/}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>

        {/*Description*/}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>
        {/*Tech Stack*/}
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
              {project.tech.length - 3} more
            </span>
          )}
        </div>
        {/*Links */}
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
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
```

**Changes Made**:
- Fixed line 63: `{project.github}` → `{project.github}`
- Fixed line 73: `{project.gitlab}` → `{project.gitlab}`
- Added Link wrapper around image (optional enhancement)
- Fixed typo: "mb3" → "mb-3" for proper Tailwind spacing

---

## Phase 5: Update Projects List Page

### 5.1 Update `src/app/[locale]/projects/page.tsx`

```typescript
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { use } from 'react';
import Container from "@/components/Container";
import ProjectsList from "@/components/sections/ProjectsList";
import { ProjectService } from "@/services/projectService";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: `${t("title")} - Islamux`,
    description: t("description"),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  const projects = await ProjectService.getAllProjects(locale);

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/*Header*/}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("description")}
          </p>
        </header>
        <ProjectsList initialProjects={projects} />
      </Container>
    </div>
  );
}
```

---

## Phase 6: Update Home Page (Optional)

### 6.1 Update `src/components/HomePage.tsx`

```typescript
// Use ProjectService.getFeaturedProjects(locale) for featured projects
// instead of direct file system access
```

---

## Implementation Checklist

- [ ] Create `src/services/projectService.ts`
- [ ] Create `src/types/project.ts`
- [ ] Create `src/components/sections/ProjectHeader.tsx`
- [ ] Create `src/components/sections/ProjectImage.tsx`
- [ ] Create `src/components/sections/ProjectDescription.tsx`
- [ ] Create `src/components/sections/ProjectLinks.tsx`
- [ ] Create `src/components/sections/ProjectBreadcrumb.tsx`
- [ ] Create `src/components/sections/ProjectBackButton.tsx`
- [ ] Create `src/components/sections/ProjectDetailContainer.tsx`
- [ ] Refactor `src/app/[locale]/projects/[id]/page.tsx`
- [ ] Fix bugs in `src/components/sections/ProjectCard.tsx`
- [ ] Update `src/app/[locale]/projects/page.tsx`
- [ ] Run tests to verify functionality
- [ ] Check for TypeScript errors
- [ ] Verify all routes work correctly

---

## Benefits After Refactoring

1. **Single Responsibility**: Each component/file has one clear purpose
2. **Testability**: Business logic can be unit tested independently
3. **Maintainability**: Changes to UI don't affect data fetching
4. **Reusability**: Components can be reused in other contexts
5. **Scalability**: Easy to add new features or modify existing ones
6. **Better Code Organization**: Clear folder structure with logical separation

---

## Testing Strategy

1. **Unit Tests**: Test `ProjectService` methods independently
2. **Component Tests**: Test each extracted component with props
3. **Integration Tests**: Verify page rendering with mock data
4. **E2E Tests**: Test actual routes and user interactions

---

## Notes

- All components should be pure functions (no side effects)
- Use TypeScript strictly for type safety
- Follow existing code style and conventions
- Document complex logic with JSDoc comments
- Keep components small and focused (under 50 lines if possible)
