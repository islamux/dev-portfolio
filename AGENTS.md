# AGENTS.md - Developer Portfolio Project Guidelines

This document provides guidelines for AI agents working on this Next.js developer portfolio project.

## Project Overview

A multilingual (EN, AR, TR, ES, FR) developer portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS, and next-intl for internationalization. Uses pnpm as the package manager.

## Build Commands (use pnpm)

```bash
# Development
pnpm dev                      # Start development server (http://localhost:3000)
pnpm build                    # Production build
pnpm start                    # Start production server
pnpm build:static             # Build static HTML export (DEPLOY_TARGET=static)
pnpm build:clean              # Clean .next and out directories
pnpm build:static:full        # Clean + static build
pnpm serve:static             # Serve static build (uses out directory)
pnpm test:static              # Full static build test cycle

# Linting
pnpm lint                     # Run ESLint on all files

# No test framework is currently configured
```

## Code Style Guidelines

### TypeScript

- Use explicit types for function parameters and return types
- Prefer interfaces over type aliases for object shapes
- Use `null` instead of `undefined` for intentional absence of value
- Enable `strict: true` in tsconfig.json (already configured)

### Imports

- Use absolute imports with `@/` alias (configured in tsconfig.json)
- Order imports: external modules → internal @/ imports → relative imports
- Group imports by type (React, Next.js, components, utilities, types)

```typescript
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/content";
import { getProjectHref } from "@/i18n/navigation";
import { ProjectCard } from "./ProjectCard";
```

### Naming Conventions

- **Components**: PascalCase for component files and function components
- **Variables/functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `ProjectMetadata`, `ProjectPageProps`)
- **Files**: Use kebab-case for utilities and hooks (e.g., `useProjectFilter.ts`)

### Components

- Use default exports for page components
- Use named exports for reusable UI components
- Prefix component props interfaces with component name (e.g., `ProjectCardProps`)
- Use functional components with TypeScript interfaces
- Include JSDoc comments for complex logic

### Tailwind CSS

- Use `brand-*` colors from tailwind.config.js (brand-500 is primary)
- Support dark mode with `dark:` prefix
- Use `className` order: layout → spacing → typography → colors → effects
- Avoid custom CSS; use Tailwind utility classes

```tsx
<div className="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
```

### Error Handling

- Use try/catch with console.error for async operations
- Return null or empty arrays on error (graceful degradation)
- Never expose sensitive information in error messages

### Internationalization (next-intl)

- Use the `useTranslations` hook in components
- Access translations via keys (e.g., `t('nav.home')`)
- Keep locale-specific content in `src/messages/*.json`
- Content data in `content/{locale}/projects.json`

### File Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components (ui/, sections/)
├── hooks/         # Custom React hooks (useMounted, useProjectFilter)
├── i18n/          # Internationalization config
├── lib/           # Utility functions
├── services/      # Business logic (ProjectService)
├── types/         # TypeScript interfaces
├── api/           # Next.js API routes
└── messages/      # Translation JSON files
```

### Next.js Specifics

- Use `page.tsx` for routes, `layout.tsx` for shared layouts
- Server components by default (use "use client" for interactivity)
- Use `fill` prop on Next.js Image with parent relative div
- Generate static params for static export compatibility

### Additional Guidelines (from CLAUDE.md)

- Always use pnpm, not npm or yarn
- When applying docs/UI_IMPROVEMENTS_PLAN.md, ask for details on section 4.1 before proceeding

## ESLint Configuration

Uses `eslint-config-next` with strict mode. Run `pnpm lint` to check.
