# Project Context - Dev Portfolio

## Overview
A multilingual (EN, AR, TR, ES, FR) developer portfolio built with **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + next-intl**.

**Author:** Fathi  
**Email:** fathi733@gmail.com  
**License:** MIT  
**Maturity:** Mid-stage — functional, deployed on Hostinger (static export), known bugs documented below.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.0.10 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | React 19.2.0, Tailwind CSS v4 |
| i18n | next-intl 4.5.8 (5 locales) |
| Theming | next-themes 0.4.6 |
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
- **Image alt texts:** `src/messages/images.json` (unused — dead code)

Fallback strategy: if a locale file is missing, falls back to English (`en`).

## Routing
```
/[locale]/                    → Home (hero + featured projects)
/[locale]/about/              → About page (markdown content)
/[locale]/projects/           → Projects listing (filterable by tech)
/[locale]/projects/[id]/      → Project detail page
/[locale]/contact/            → Contact page (form + social links)
/api/contact                  → POST handler (logs only, not functional)
```

## Locales
| Code | Language | RTL |
|------|----------|-----|
| en | English | No |
| ar | Arabic | Yes |
| tr | Turkish | No |
| es | Spanish | No |
| fr | French | No |

## Project Data (content/en/projects.json)
5+ projects tracked: Salam, Athkarix, Portfolio, Voices of Truth, New Muslims Stories, Huawei Router, Bassaer.

Each project has: `id`, `name`, `description`, `tech[]`, `image`, `featured`, `year`, optional `github`/`gitlab`/`demo`/`apk`/`longDescription`.

## Environment Variables
Template in `env.example`:
- `NEXT_PUBLIC_SITE_URL` — site URL for metadata
- `CONTACT_EMAIL` — contact email
- `GITHUB_TOKEN` — optional, for GitHub API importer (not implemented)
- `RECAPTCHA_SECRET_KEY` — optional, for contact form
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — optional analytics

## Assumptions Made by AI Analysis
- No test framework configured (no `pnpm test` script)
- No CI/CD pipeline configured (no `.github/workflows/`)
- No Docker files present
- Contact form is non-functional (API route only logs to console)
- Middleware is disabled (`.disabled` extension) — locale detection happens client-side only
- SiteFooter component exists but is never rendered in layout
