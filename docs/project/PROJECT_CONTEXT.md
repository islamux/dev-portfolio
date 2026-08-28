# Project Context - Dev Portfolio

## Overview
A multilingual (EN, AR, TR, ES, FR) developer portfolio built with **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + next-intl**.

**Author:** Fathi  
**Email:** fathi733@gmail.com  
**License:** GPL-3.0-only  
**Maturity:** Mid-stage — functional, deployed on Hostinger (static export), known bugs documented below.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.3.2 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | React 19.2.8, Tailwind CSS v4 |
| i18n | next-intl 4.5.8 (5 locales) |
| Theming | custom ThemeContext (`src/app/providers.tsx`; next-themes installed but unused) |
| Content | gray-matter (markdown), JSON (projects) |
| Linting | ESLint 9 + eslint-config-next 16 + Prettier |
| Package Manager | pnpm 10.28.0 |
| Deployment | Static export → Hostinger (with `.htaccess` routing) |

## Deployment Modes
- **SSR mode (default):** `pnpm dev` / `pnpm start` — uses NextIntlClientProvider, supports API routes
- **Static mode:** `DEPLOY_TARGET=static pnpm build` — strips NextIntlClientProvider, no API routes, all client-side locale handling

## Content Management
- **Pages (home, about):** `content/{locale}/*.md` with gray-matter frontmatter
- **Projects:** `content/{locale}/projects.json` (structured JSON array)
- **UI strings:** `src/messages/{locale}.json`

Fallback strategy: only `projects.json` falls back to English (`src/lib/content.ts:39-44`); markdown `getContentBySlug` throws on missing file.

## Routing
```
/                             → Root redirect to default locale (src/app/(index)/)
/[locale]/                    → Home (hero + featured projects)
/[locale]/about/              → About page (markdown content)
/[locale]/projects/           → Projects listing (filterable by tech)
/[locale]/projects/[id]/      → Project detail page
/[locale]/contact/            → Contact page (form + social links)
/api/contact                  → Unreachable (lives in src/api/, not src/app/api/ → 404)
```

Root-level metadata lives in `src/app/metadata.ts`; `robots.ts` and `sitemap.ts` sit next to it.

## Locales
| Code | Language | RTL |
|------|----------|-----|
| en | English | No |
| ar | Arabic | Yes |
| tr | Turkish | No |
| es | Spanish | No |
| fr | French | No |

## Project Data (content/en/projects.json)
14 projects tracked (see `content/en/projects.json`).

Each project has: `id`, `name`, `description`, `tech[]`, `image`, `featured`, `year`, optional `github`/`gitlab`/`demo`/`apk`/`longDescription`.

## Environment Variables
Template in `env.example`:
- `NEXT_PUBLIC_SITE_URL` — site URL for metadata
- `CONTACT_EMAIL` — contact email
- `GITHUB_TOKEN` — optional, for GitHub API importer (not implemented)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — optional analytics

## Assumptions Made by AI Analysis
- No test framework configured (no `pnpm test` script)
- No CI/CD pipeline configured (no `.github/workflows/`)
- No Docker files present
- Contact handler implemented (Resend + escapeHtml) but unreachable — lives in `src/api/`, not `src/app/api/` → 404 in every mode
- No middleware file exists (removed entirely) — locale detection happens client-side only
- SiteFooter is rendered in `[locale]/layout.tsx:42-47`
