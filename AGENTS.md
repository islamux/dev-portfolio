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
| `scripts/test-routes.sh` | Test all routes locally (41 checks) |

## ⚠️ CRITICAL: Static Export Rules (Read Before Any Static Build)

This project deploys to **Hostinger (LiteSpeed)** via static export. The following rules are **mandatory** — violations will cause 403 errors or build failures.

### Configuration
- `DEPLOY_TARGET=static` enables `output: 'export'` + `trailingSlash: true` + `images.unoptimized: true`
- Build: `NEXT_PUBLIC_DEPLOY_TARGET=static DEPLOY_TARGET=static next build`
  - `DEPLOY_TARGET` → `next.config.ts` (server-side config)
  - `NEXT_PUBLIC_DEPLOY_TARGET` → client components (root redirect URL)

### ⚡ Routing (Most Common Breakage Point)
- **Hostinger 403 root cause**: LiteSpeed auto-redirects `/en` → `/en/`, then 403s if no `en/index.html`. Solution: `trailingSlash: true` produces `en/index.html` files.
- **NEVER use file-based routing** (`.html` filenames). Always use **directory-based** (`en/index.html`, `en/about/index.html`).
- `src/i18n/navigation.ts` returns plain paths like `/en/`, `/en/about/` — no `.html` suffixes.

### Client Components in Static Mode
- Bypass `NextIntlClientProvider` (see `src/app/[locale]/layout.tsx`)
- Pass locale/data as props — **never** use `useLocale()` or `useTranslations()` in client components
- Use `next/navigation`, **never** `next-intl/navigation`
- Call `setRequestLocale(locale)` in every page and layout
- **No** `headers()` / `cookies()`

### Before Deploying to Hostinger
1. Delete all old files from `public_html/` (stale locale dirs cause 403)
2. Run `pnpm build:static:full`
3. Run `scripts/test-routes.sh` — all 41 checks must pass
4. Upload `out/` contents to `public_html/`

---

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

**Error handling:** Let errors propagate from service/data layer. Catch only at component level for meaningful UI fallback. No secrets in messages.

**i18n:** Pass locale/data as props from server components. Import messages JSON directly (`import messages from '@/messages/${locale}.json'`). Content in `content/{locale}/`. Avoid `next-intl` hooks in client components.

**Next.js:** App Router. Server components by default. `fill` on Image with relative parent. `generateStaticParams` on dynamic routes.

## Implementation Workflow

Before any implementation:

1. **Create branch** first
2. **Update project-tracker.json** — set task `in_progress`
3. Keep tracker in sync on every state transition (start/complete/block/unblock)

## Build Scripts

`.npmrc` approves `@swc/core`, `sharp`, `unrs-resolver` native builds. Don't remove.

## Troubleshooting

| Problem | Diagnosis | Fix |
|---------|-----------|-----|
| 403 on all locale pages except English | Stale locale dirs on server or missing `trailingSlash` | Delete `public_html/` contents, rebuild with `build:static:full`, re-upload |
| Build fails — "missing generateStaticParams" | Dynamic route without static params | Add `generateStaticParams()` reading from `content/{locale}/projects.json` |
| Context errors in static mode | Client component using `next-intl` hooks | Pass locale as prop, use `next/navigation` instead |
| Routes broken after edit | Forgot `setRequestLocale(locale)` | Add to every page and layout component |
