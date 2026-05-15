# TypeScript Types Reference

A reference guide for all TypeScript types, interfaces, and type aliases in this project.

---

## Core Types (`src/types/`)

### SocialLink
**File:** `src/types/index.ts`

Represents a social media link displayed in the footer.

```typescript
interface SocialLink {
  name: string;    // Display name (e.g., "GitHub")
  href: string;    // URL to the social profile
  icon: string;    // Icon name for the Icon component
}
```

### ContentFrontmatter
**File:** `src/types/content.ts`

Metadata extracted from markdown file frontmatter.

```typescript
interface ContentFrontmatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  image?: string;
  [key: string]: unknown;  // Extensible for custom fields
}
```

### ContentData
**File:** `src/types/content.ts`

Complete parsed markdown content with metadata.

```typescript
interface ContentData {
  frontmatter: ContentFrontmatter;
  content: string;   // Raw markdown body
  slug: string;      // URL-friendly identifier
}
```

### Project
**File:** `src/types/content.ts`

Represents a portfolio project.

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  tech: string[];         // Technologies used
  github?: string;        // GitHub repo URL
  gitlab?: string;        // GitLab repo URL
  demo?: string;          // Live demo URL
  image?: string;         // Project thumbnail
  featured?: boolean;     // Show on homepage
  year?: string;
}
```

### ContactFormData
**File:** `src/types/content.ts`

Contact form submission payload.

```typescript
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot: string;  // Spam trap field (should be empty)
}
```

---

## i18n Types (`src/i18n/`)

### Locale
**File:** `src/i18n/config.ts`

Supported language codes.

```typescript
type Locale = "en" | "fr" | "ar";
```

### languageInfo
**File:** `src/i18n/config.ts`

Language display information for the language switcher.

```typescript
interface languageInfo {
  name: string;   // Display name (e.g., "English")
  flag: string;   // Emoji flag
  rtl: boolean;   // Right-to-left text direction
}
```

### navLink
**File:** `src/i18n/navigation.ts`

Centralized navigation links (const assertion).

```typescript
const navLink = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/contact", label: "contact" },
] as const;
```

---

## Page Props

### LocaleLayoutProps
**File:** `src/app/[locale]/layout.tsx`

```typescript
interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}
```

### PageProps
**File:** `src/app/[locale]/page.tsx`

Generic page props with locale parameter.

```typescript
interface PageProps {
  params: Promise<{ locale: string }>;
}
```

### ProjectDetailPageProps
**File:** `src/app/[locale]/projects/[id]/page.tsx`

```typescript
interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}
```

---

## Component Props

### ContainerProps
**File:** `src/components/Container.tsx`

Wrapper component for consistent layout spacing.

```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
}
```

### ButtonProps
**File:** `src/components/ui/Button.tsx`

Extends native button with styling variants.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}
```

### IconProps
**File:** `src/components/ui/Icon.tsx`

```typescript
interface IconProps {
  name: string;       // Icon identifier
  size?: number;      // Size in pixels
  className?: string;
}
```

### ReactMarkdownContentProps
**File:** `src/components/ui/MarkdownContent.tsx`

```typescript
interface ReactMarkdownContentProps {
  content: string;    // Markdown string to render
  className?: string;
}
```

### ProjectCardProps
**File:** `src/components/sections/ProjectCard.tsx`

```typescript
interface ProjectCardProps {
  project: Project;
}
```

### ProjectsListProps
**File:** `src/components/sections/ProjectsList.tsx`

```typescript
interface ProjectsListProps {
  initialProjects: Project[];
}
```

### SiteFooterProps
**File:** `src/components/sections/SiteFooter.tsx`

```typescript
interface SiteFooterProps {
  socialLinks: SocialLink[];
}
```

### HomePageProps
**File:** `src/components/HomePage.tsx`

```typescript
interface HomePageProps {
  locale: string;
}
```

---

## Summary

| Category | Count |
|----------|-------|
| Core data types | 5 |
| i18n types | 3 |
| Page props | 3 |
| Component props | 8 |
| **Total** | **19** |
