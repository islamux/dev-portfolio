# Audit Report: `src/app/projects/page.tsx`

This document outlines the issues found in `src/app/projects/page.tsx` and provides a comprehensive plan to fix them.

## 🚨 Critical Issues

### 1. Server/Client Component Violation

- **Issue**: The file is marked with `'use client'`, making it a Client Component. However, it imports `getProjectData` from `@/lib/content`, which uses Node.js APIs (`fs`, `path`) to read files.
- **Impact**: This will cause the application to crash in the browser with errors like `Module not found: Can't resolve 'fs'`.
- **Fix**:
  - Remove `'use client'` from `page.tsx` to make it a Server Component.
  - Fetch data in `page.tsx`.
  - Create a separate Client Component (e.g., `ProjectsList.tsx`) to handle the interactive filtering state.
  - Pass the fetched data as props to the Client Component.

### 2. Syntax & Structure Errors

- **Broken HTML Structure**: The nesting of `div` and `Container` tags is incorrect.
  - There is a `<div>` at line 59 that breaks the layout and structure.
  - The closing tags at the end of the file do not match the opening tags correctly due to the confused structure.
- **Invalid Class Name**: Line 62 contains `className="grselectedTechs-1 ..."`. This is likely a typo for `grid grid-cols-1`.

### 3. Logic Errors

- **Broken Event Handler**: Line 54: `onClick={(selectedTech) => (tech)}`. This does not update the state.
  - **Fix**: Change to `onClick={() => setSelectedTech(tech)}`.

## ⚠️ Minor Issues & Typos

- **Typos**:
  - Line 36: "colection" should be "collection".
- **UX**:
  - The "No project found" message can be styled better.

---

## 🛠️ Proposed Fixes

### Step 1: Create `src/components/sections/ProjectsList.tsx` (New Client Component)

This component will handle the state and filtering.

```tsx
"use client";

import { useState, useMemo } from "react";
import ProjectCard from "@/components/sections/ProjectCard";
import Button from "@/components/ui/Button";
import { Project } from "@/types/content";

interface ProjectsListProps {
  initialProjects: Project[];
}

export default function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Get all unique tech stack items.
  const allTech = useMemo(() => {
    const techSet = new Set<string>();
    initialProjects.forEach((project) => {
      project.tech.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [initialProjects]);

  // Filter projects based on selected tech
  const filteredProjects = selectedTech
    ? initialProjects.filter((p) => p.tech.includes(selectedTech))
    : initialProjects;

  return (
    <>
      {/* Tech Filter */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center md:justify-start">
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
            No projects found with <strong>{selectedTech}</strong>
          </p>
        </div>
      )}
    </>
  );
}
```

### Step 2: Refactor `src/app/projects/page.tsx` (Server Component)

This file will now focus on fetching data and layout.

```tsx
import Container from "@/components/Container";
import { getProjectData } from "@/lib/content";
import ProjectsList from "@/components/sections/ProjectsList";

export const metadata = {
  title: "Projects | My Portfolio",
  description: "A collection of my work and contributions.",
};

export default function ProjectPage() {
  const projects = getProjectData("en");

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

        <ProjectsList initialProjects={projects} />
      </Container>
    </div>
  );
}
```
