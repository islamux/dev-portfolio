# Custom Hooks Guide

Extract reusable logic into custom hooks for cleaner components.

---

## Recommended File Structure

```
src/hooks/
├── index.ts           # Re-exports all hooks
├── useContactForm.ts
├── useProjectFilter.ts
└── useMounted.ts
```

---

## 1. useMounted

**Purpose:** Prevents hydration mismatch for client-only rendering.

**File:** `src/hooks/useMounted.ts`

```typescript
import { useEffect, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
```

**Usage in SiteHeader.tsx:**

```tsx
import { useMounted } from "@/hooks";

export default function SiteHeader() {
  const mounted = useMounted();

  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {mounted && theme === "dark" ? <Icon name="sun" /> : <Icon name="moon" />}
    </Button>
  );
}
```

---

## 2. useContactForm

**Purpose:** Manages contact form state, validation, and submission.

**File:** `src/hooks/useContactForm.ts`

```typescript
import { useState, FormEvent } from "react";
import { ContactFormData } from "@/types/content";

type Status = "idle" | "loading" | "success" | "error";

export function useContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Spam check
    if (formData.honeypot) {
      setStatus("error");
      setErrorMessage("Spam detected");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setStatus("success");
      setFormData({ name: "", email: "", message: "", honeypot: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const reset = () => {
    setFormData({ name: "", email: "", message: "", honeypot: "" });
    setStatus("idle");
    setErrorMessage("");
  };

  return {
    formData,
    status,
    errorMessage,
    updateField,
    handleSubmit,
    reset,
  };
}
```

**Usage in ContactForm.tsx:**

```tsx
import { useContactForm } from "@/hooks";

export function ContactForm() {
  const { formData, status, errorMessage, updateField, handleSubmit } = useContactForm();

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => updateField("name", e.target.value)}
      />
      {/* ... rest of form */}
    </form>
  );
}
```

---

## 3. useProjectFilter

**Purpose:** Filters projects by technology stack.

**File:** `src/hooks/useProjectFilter.ts`

```typescript
import { useMemo, useState } from "react";
import { Project } from "@/types/content";

export function useProjectFilter(projects: Project[]) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Extract unique technologies
  const allTech = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.tech.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!selectedTech) return projects;
    return projects.filter((p) => p.tech.includes(selectedTech));
  }, [projects, selectedTech]);

  const clearFilter = () => setSelectedTech(null);

  return {
    selectedTech,
    setSelectedTech,
    allTech,
    filteredProjects,
    clearFilter,
  };
}
```

**Usage in ProjectsList.tsx:**

```tsx
import { useProjectFilter } from "@/hooks";

export default function ProjectsList({ initialProjects }: ProjectsListProps) {
  const { selectedTech, setSelectedTech, allTech, filteredProjects, clearFilter } =
    useProjectFilter(initialProjects);

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={clearFilter} active={selectedTech === null}>All</Button>
        {allTech.map((tech) => (
          <Button key={tech} onClick={() => setSelectedTech(tech)} active={selectedTech === tech}>
            {tech}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
```

---

## 4. Index File (Re-exports)

**File:** `src/hooks/index.ts`

```typescript
export { useMounted } from "./useMounted";
export { useContactForm } from "./useContactForm";
export { useProjectFilter } from "./useProjectFilter";
```

---

## Benefits

| Benefit | Description |
|---------|-------------|
| Reusability | Use the same logic across multiple components |
| Testability | Test hooks in isolation |
| Readability | Components focus on rendering, hooks handle logic |
| Maintainability | Single source of truth for shared logic |

---

## Implementation Checklist

- [ ] Create `src/hooks/` directory
- [ ] Create `useMounted.ts`
- [ ] Create `useContactForm.ts`
- [ ] Create `useProjectFilter.ts`
- [ ] Create `index.ts` with re-exports
- [ ] Refactor `SiteHeader.tsx` to use `useMounted`
- [ ] Refactor `ContactForm.tsx` to use `useContactForm`
- [ ] Refactor `ProjectsList.tsx` to use `useProjectFilter`
