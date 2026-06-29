# AI Handoff Document - Dev Portfolio

## Current State (as of 2026-06-29)

**Status:** Cleaned codebase with resolved tech debt  
**Build:** ✅ SSR mode works, ✅ Static export works  
**Deployment:** Hostinger (static export) + Vercel (SSR available)

## What's Been Done Recently
- Full clean code review executed — 10+ findings addressed
- Dead code removed: `generateStaticParams.ts`, `i18n/guards.ts`, `types/project.ts`, `ProjectBreadcrumb`, `ProjectBackButton`, `ProjectDescription`, `ProjectDetailContainer`, `ProjectHeader`, `ProjectImage`, `ProjectLinks`
- `LanguagesSwitcher.tsx` → `LanguageSwitcher.tsx` (file matches export name)
- `clsx` dependency removed — `cn()` utility was dead code; used native `className` merging
- `tailwindcss-rtl` removed (incompatible with Tailwind v4)
- Comment pollution stripped (~30+ instances across 7 files)
- Error handling simplified: `ProjectService` now lets errors propagate instead of returning `null`/`[]`
- `languageInfo` interface + `getLanguagesInfo()` removed from config
- `ContentData.slug` removed (unused)
- Empty `<div>` removed from `SiteFooter.tsx`
- Service layer methods cleaned up — removed `generateStaticParams()` wrapper

## What's Left (Priority Order)

### 🔴 High Priority (Fix Soon)
1. **Project detail page** (`projects/[id]/page.tsx`) bypasses `ProjectService` — reads JSON directly
2. **Contact form non-functional** — API route only logs to console (no email sending)
3. **i18n gaps:** Many hardcoded English strings in contact page, form labels, filter buttons

### 🟡 Medium Priority
4. **Unify translation loading** pattern across pages (currently duplicated in 3 pages)
5. **Logo link has no locale prefix** — `SiteHeader.tsx:43` (`<Link href="/">`)
6. **Consolidate RTL CSS** in `globals.css` — ~200 lines with repeated font-family declarations

### 🟢 Low Priority
7. **Replace hardcoded SVG icons** in `Icon.tsx` with icon library (lucide-react?)
8. **Add analytics** (Plausible or Vercel Analytics)
9. **Shadcn/ui integration** (already in todo.md)
10. **LanguageSwitcher SVG path typo:** `M19 91-7` → `M19 9l-7` (low visual impact)

## Known Workarounds in Place
| Workaround | Location | Why |
|------------|----------|-----|
| Fonts loaded via CDN in globals.css | `src/app/globals.css` | Turbopack bug with next/font/google |
| `DEPLOY_TARGET=static` checks throughout | Multiple files | Dual SSR/static mode support |
| `NextIntlClientProvider` conditional | `src/app/[locale]/layout.tsx` | Static export can't use `headers()` |
| Messages imported directly in pages | `page.tsx`, `projects/page.tsx` | Avoid `getTranslations()` in static mode |

## Key Files to Touch Carefully
- **`next.config.ts`** — dual mode config, don't break static export
- **`src/i18n/config.ts`** — locale definitions, affects all 5 languages
- **`src/app/[locale]/layout.tsx`** — root layout, wraps everything
- **`tailwind.config.js`** — brand colors used everywhere
- **`src/middleware.ts.disabled`** — intentionally disabled, don't re-enable without testing

## Quick Start for Next Agent
```bash
cd /media/islamux/Variety/JavaScriptProjects/dev_portfolio
git checkout main
git pull origin main
# create new branch as needed
pnpm install
pnpm dev  # Starts at localhost:3000
```

## Important Conventions (from AGENTS.md)
- **Package manager:** pnpm ONLY (not npm/yarn)
- **Components:** Server by default, `"use client"` only with hooks
- **Imports:** Absolute with `@/` alias
- **Colors:** Use `brand-*` from tailwind config
- **i18n:** 5 locales (en, ar, tr, es, fr), Arabic is RTL
- **Lint:** Run `pnpm lint` before committing

## Assumptions to Verify
1. **No test framework** — confirmed, no `pnpm test` script exists
2. **No CI/CD** — confirmed, no `.github/workflows/` directory
3. **No Docker** — confirmed, no Dockerfile present
4. **Static export is primary deployment** — Hostinger uses static, Vercel available for SSR
5. **Author prefers incremental fixes** — todo.md shows awareness of issues but prioritizes shipping

## Repository Stats
- **~40 TypeScript/TSX files** (~2000 lines, cleaned)
- **5 locales** with translation files
- **6+ projects** in portfolio
- **15+ stale branches** on remote (cleanup candidate)
- **~3 known bugs** documented in this handoff
- **~1 dead code item** remaining (`getAllContent()` in content.ts)

## Git Branch Strategy
- **Main branch:** `main` (stable, deployed)
- **Feature branches:** `feat/*`, `fix/*`, `refactor/*`
- **Stale branches to clean:** `feature/shadcn-integration`, `feature/layout-design-system`, etc.

## Documentation Map
```
docs/
├── README.md                        # Documentation index
├── project/                         # AI rules, workflow
├── build/                           # Portfolio guide + Phase 1-7 execution plans
├── deployment/static-export/        # Static export guides for Hostinger
├── architecture/                    # I18N_FIX_PLAN, SOC_REFACTORING_PLAN
├── learning/                        # HOOKS_GUIDE, TAILWIND_TUTORIAL, etc.
└── troubleshooting/                 # ISSUES_AND_SOLUTIONS, etc.
```

## Message to Next Agent

This is a cleaned-up portfolio. The high-impact dead code and bug fixes have been addressed. Focus remaining effort on:

1. **Fix project detail page** to use `ProjectService` instead of direct `fs.readFileSync`
2. **Make contact form functional** — implement email sending or remove
3. **Improve i18n coverage** — translate remaining hardcoded strings
4. **Fix logo locale bug** — `SiteHeader.tsx` logo link needs locale prefix
5. **Don't over-engineer** — author prefers practical improvements over architectural overhauls



---
*Generated by OpenCode on 2026-05-01*
