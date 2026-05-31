# AGENTS.md

## Project

Multilingual (EN, AR, TR, ES, FR) developer portfolio. Next.js 16.2.6, React 19.2.6, TypeScript, Tailwind CSS v4, next-intl, pnpm.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Production build (SSR) |
| `pnpm start` | Production server |
| `pnpm build:static` | Static export (`DEPLOY_TARGET=static`) |
| `pnpm build:clean` | Remove `.next` and `out` |
| `pnpm build:static:full` | Clean + static build |
| `pnpm serve:static` | Serve static `out/` dir |
| `pnpm test:static` | Clean → static → serve cycle |
| `pnpm lint` | ESLint (strict) |
| `pnpm cc:status` | Command center status |
| `pnpm cc:start` | Start a task |
| `pnpm cc:complete` | Complete a task |
| `pnpm ccui` | Launch command center TUI |

## Code Rules

**TypeScript:** Explicit types, interfaces over type aliases, `null` not `undefined`, strict mode on.

**Imports:** external → `@/` → relative. Group by type.

```typescript
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/content";
import { getProjectHref } from "@/i18n/navigation";
import { ProjectCard } from "./ProjectCard";
```

**Naming:** PascalCase for components/types, camelCase for vars/fns, SCREAMING_SNAKE_CASE for constants, kebab-case for files (utilities/hooks).

**Components:** Default export for pages, named export for UI. Interface = `ComponentNameProps`.

**Tailwind:** Use `brand-*` colors, `dark:` prefix. Class order: layout → spacing → typography → colors → effects. No custom CSS when utility suffices.

**Error handling:** try/catch + console.error, return null/[] on failure, no secrets in messages.

**i18n:** `useTranslations` hook, keys from `src/messages/*.json`, content in `content/{locale}/`.

**Next.js:** App Router. Server components by default. `fill` on Image with relative parent. `generateStaticParams` on dynamic routes.

## Implementation Workflow

Before any implementation:

1. **Create branch** first
2. **Update project-tracker.json** — set task `in_progress`
3. **Update Swim Lane percentages** immediately after change
4. **Update Task Board** immediately after change
5. Keep tracker in sync on every state transition (start/complete/block/unblock)

## Lint

`pnpm lint` skips `command-center/` (separate internal tool). Only `src/` is linted.

## Build Scripts

`.npmrc` approves `@swc/core`, `sharp`, `unrs-resolver` native builds. Don't remove.

## Static Export Rules

- `DEPLOY_TARGET=static` enables `output: 'export'` + `trailingSlash: true` + `images.unoptimized: true`
- Bypass `NextIntlClientProvider` in static mode (see layout.tsx)
- Pass locale/data as props, don't use `useLocale()`/`useTranslations()` in clients
- Use `next/navigation` not `next-intl/navigation` for static compatibility
- `setRequestLocale(locale)` in every page + layout
- No `headers()`/`cookies()` in static mode
