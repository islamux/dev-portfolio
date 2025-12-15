# Refactoring Fixes Required

## 🔴 Issue 1: projectService.ts - Syntax Error & Typos
**File:** `src/services/projectService.ts`

### Problems:
- Line 59: **Missing closing brace `}`** causing build failure
- Line 5: **"slingle" typo** (should be "single")
- Line 27: **Missing "for" in comment**
- Line 54: **"fetcherd" typo** (should be "featured")
- Missing JSDoc comments
- Inconsistent formatting

### ✅ Fix:
```typescript
import { Project } from "@/types/content"
import { getProjectById, getProjectData } from "@/lib/content"

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

### Changes Made:
- ✅ **Added closing brace `}`** at the end
- ✅ **Fixed "slingle" → "single"**
- ✅ **Fixed "Generate static params all projects" → "Generate static params for all projects"**
- ✅ **Fixed "fetcherd" → "featured"**
- ✅ **Added proper JSDoc comments**
- ✅ **Cleaned up formatting**

---

## 🔴 Issue 2: project.ts - Typo in Type Definition
**File:** `src/types/project.ts`

### Problem:
- Line 3: **"descriptio" typo** (should be "description")

### ✅ Fix:
```typescript
export interface ProjectMetadata {
  title: string;
  description: string;  // ← Fixed: was "descriptio"
  openGraph?: {
    title: string,
    description: string,
    images: string[],
  };
}

export interface ProjectPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}
```

### Changes Made:
- ✅ **Fixed "descriptio" → "description"**

---

## 🔴 Issue 3: ProjectHeader.tsx - Broken className
**File:** `src/components/sections/ProjectHeader.tsx`

### Problem:
- Line 26: **Broken Tailwind classes:**
  ```
  py-3 bg-brand-100 dark:bg-blue-900/30 test-brand-600 bg-blue-900 dark:text-blue-400
  ```

### ✅ Fix:
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

      {/*Meta Info*/}
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
              className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full"  // ← Fixed: was broken className
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

### Changes Made:
- ✅ **Fixed broken className** → `px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full`

---

## 🔴 Issue 4: ProjectLink.tsx - Wrong Filename & Incorrect Import
**File:** `src/components/sections/ProjectLink.tsx` → **Rename to `ProjectLinks.tsx`**

### Problems:
- **Wrong filename** (singular instead of plural)
- Line 2: **Unnecessary import** `BUILD_ID_FILE`
- Line 22: **Inconsistent capitalization** "github" vs "GitHub"
- Line 39: **Extra space** in `rel="noopener noreferrer "`

### ✅ Fix (rename file to ProjectLinks.tsx):
```typescript
import { Project } from "@/types/content";  // ← Removed: BUILD_ID_FILE import
import Button from "../ui/Button";
import { Icon } from "../ui/Icon";

interface ProjectLinksProps {
  project: Project;
}

export function ProjectLinks({ project }: ProjectLinksProps) {
  const hasAnyLink = project.github || project.gitlab || project.demo;
  if (!hasAnyLink) return null;

  return (
    <div className="flex flex-wrap gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer">  // ← Fixed: removed extra space
          <Button variant="primary">
            <Icon name="github" size={20} className="mr-2" />
            View on GitHub  // ← Fixed: "GitHub" capitalization
          </Button>
        </a>
      )}

      {project.gitlab && (
        <a href={project.gitlab} target="_blank" rel="noopener noreferrer">
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

### Changes Made:
- ✅ **Renamed file** `ProjectLink.tsx` → `ProjectLinks.tsx`
- ✅ **Removed** `BUILD_ID_FILE` import
- ✅ **Fixed** `"github"` → `"GitHub"`
- ✅ **Fixed** `rel="noopener noreferrer "` → `rel="noopener noreferrer"` (removed space)
- ✅ **Cleaned up** formatting

---

## 🔴 Issue 5: ProjectCard.tsx - Original Bugs Not Fixed
**File:** `src/components/sections/ProjectCard.tsx`

### Problems:
- Line 21: **"max-width:768xp" typo** (should be "px")
- Line 29: **"mb3" typo** (should be "mb-3")
- Line 27: **"Badg" typo** (should be "Badge")
- Line 42: **"Teck" typo** (should be "Tech")
- Line 16: **Missing Link wrapper** around image

### ✅ Fix:
```typescript
import { Project } from "@/types/content";
import Image from "next/image";
import { Icon } from "../ui/Icon";
import Link from "next/link";  // ← Added: Link import

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/*Project Image*/}
      {project.image && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Link href={`/projects/${project.id}`}>  // ← Added: Link wrapper
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-105 transform duration-300"  // ← Fixed: removed trailing space
              sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"  // ← Fixed: "768xp" → "768px"
            />
          </Link>  // ← Added: closing Link tag
        </div>
      )}
      {/*Content*/}
      <div className="p-6">
        {/*Year Badge*/}  // ← Fixed: "Badg" → "Badge"
        {project.year && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded mb-3">  // ← Fixed: "mb3" → "mb-3"
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
        {/*Tech Stack*/}  // ← Fixed: "Teck" → "Tech"
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

### Changes Made:
- ✅ **Added** `import Link from "next/link"`
- ✅ **Added** Link wrapper around Image
- ✅ **Fixed** `"768xp"` → `"768px"`
- ✅ **Fixed** `"mb3"` → `"mb-3"`
- ✅ **Fixed** `"Badg"` → `"Badge"`
- ✅ **Fixed** `"Teck"` → `"Tech"`

---

## 🔴 Issue 6: ProjectDetailPage - Empty File
**File:** `src/app/[locale]/projects/[id]/page.tsx`

### Problem:
- **File is completely empty** (lines 1-2 only)

### ✅ Fix:
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

### Changes Made:
- ✅ **Completely implemented** refactored ProjectDetailPage
- ✅ **Added** all imports for components
- ✅ **Added** `generateStaticParams` function
- ✅ **Added** `generateMetadata` function
- ✅ **Added** main page component with all extracted components

---

## 🔴 Issue 7: projects/page.tsx - Template Literal & Destructuring Errors
**File:** `src/app/[locale]/projects/page.tsx`

### Problems:
- Line 19: **Template literal broken** `$t("description")` should be `${t("description")}`
- Line 24: **Incorrect destructuring** `const locale = await params;` should be `const { locale } = await params;`
- Line 25: **Incorrect destructuring** `const { t } = await getTranslations(...)` should be `const t = await getTranslations(...)`

### ✅ Fix:
```typescript
import Container from "@/components/Container";
import ProjectsList from "@/components/sections/ProjectsList";
import { ProjectService } from "@/services/projectService";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;  // ← Fixed: destructured locale
  const t = await getTranslations({ locale, namespace: "projects" });  // ← Fixed: removed extra destructuring
  return {
    title: `${t("title")} - Islamux`,  // ← Fixed: template literal syntax
    description: t("description"),  // ← Fixed: was `$t("description")`
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;  // ← Fixed: destructured locale
  const t = await getTranslations({ locale, namespace: "projects" });  // ← Fixed: removed extra destructuring
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

### Changes Made:
- ✅ **Fixed** `$t("description")` → `t("description")` and added proper template literal `${t("title")}`
- ✅ **Fixed** `const locale = await params;` → `const { locale } = await params;`
- ✅ **Fixed** `const { t } = await getTranslations(...)` → `const t = await getTranslations(...)`

---

## 📋 Summary of Changes Required:

| File | Issues Fixed |
|------|-------------|
| **projectService.ts** | ✅ Syntax error (missing `}`), typos, formatting |
| **project.ts** | ✅ Typo "descriptio" → "description" |
| **ProjectHeader.tsx** | ✅ Broken className fixed |
| **ProjectLink.tsx → ProjectLinks.tsx** | ✅ Renamed, removed BUILD_ID_FILE import, fixed capitalization |
| **ProjectCard.tsx** | ✅ Original bugs fixed (mb3, typos, Link wrapper) |
| **ProjectDetailPage** | ✅ Completely implemented refactored page |
| **projects/page.tsx** | ✅ Template literal and destructuring errors fixed |

---

## 🚀 Order of Fixes:

1. ✅ **Fix projectService.ts** (blocks build - missing `}`)
2. ✅ **Fix projects/page.tsx** (blocks build - syntax errors)
3. ✅ **Rename ProjectLink.tsx to ProjectLinks.tsx**
4. ✅ **Fix all other files**
5. ✅ **Run `npm run build`** to verify

---

## ⚡ Quick Fix Commands:

```bash
# Check for TypeScript errors
npm run build

# If successful, run dev server
npm run dev
```

---

## 🎯 Key Takeaways:

- **Always use TypeScript strict mode** to catch these errors early
- **Use a linter** (ESLint) to catch typos and formatting issues
- **Test build frequently** to catch syntax errors immediately
- **Use proper naming conventions** (ProjectLinks vs ProjectLink)
- **Template literals need `${}` syntax**, not `$()`
- **Destructuring async params**: `const { locale } = await params`
