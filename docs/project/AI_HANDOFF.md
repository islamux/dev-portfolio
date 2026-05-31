# AI Handoff Document - Dev Portfolio

## Current State (as of 2026-05-01)

**Branch:** `feat/setup-command-center`  
**Status:** Mid-stage functional portfolio with known bugs  
**Build:** ✅ SSR mode works, ✅ Static export works  
**Deployment:** Hostinger (static export) + Vercel (SSR available)

## What's Been Done Recently
- Turkish language support added (`feat/add-turkish-language`)
- New Muslims Stories project added (content + images)
- Hostinger deployment fixes (`.htaccess` routing)
- Comprehensive docs added (`docs/` subdirectory)
- Phase-based build guide created (`docs/build/`)
- **This session:** Full codebase audit, command center files generated

## What's Left (Priority Order)

### 🔴 High Priority (Fix Soon)
1. **`generateMetaData` typo** in `src/app/[locale]/page.tsx` — metadata not being applied
2. **`openGraph.url: siteConfig.name`** — should be `siteConfig.url`
3. **Dead code removal:** `generateStaticParams.ts`, `i18n/guards.ts`, `types/project.ts`
4. **SiteFooter not rendered** — either render it in `layout.tsx` or delete the component
5. **CSS typos:** `md:py24` → `md:py-24` in page.tsx, `text-gray-900dar` in ContactForm.tsx

### 🟡 Medium Priority
6. **i18n gaps:** Many hardcoded English strings in contact page, form labels, filter buttons
7. **Project detail page** (`projects/[id]/page.tsx`) bypasses `ProjectService` — reads JSON directly
8. **Consolidate RTL CSS** in `globals.css` — ~200 lines with repeated font-family declarations
9. **Unify translation loading** pattern across pages (currently duplicated in 3 pages)
10. **LanguageSwitcher SVG path typo:** `M19 91-7` → `M19 9l-7`

### 🟢 Low Priority
11. **Contact form non-functional** — API route only logs to console (no email sending)
12. **Replace hardcoded SVG icons** in `Icon.tsx` with icon library (lucide-react?)
13. **Add `clsx`/`cn()` utility** for className merging in components
14. **Add analytics** (Plausible or Vercel Analytics)
15. **Shadcn/ui integration** (already in todo.md)

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
git checkout feat/setup-command-center  # or create new branch
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
- **48 TypeScript/TSX files** (~2352 lines)
- **5 locales** with translation files
- **5+ projects** in portfolio
- **15+ stale branches** on remote (cleanup candidate)
- **~8 known bugs** documented in this handoff
- **~6 dead code items** ready for removal

## Git Branch Strategy
- **Main branch:** `main` (stable, deployed)
- **Feature branches:** `feat/*`, `fix/*`, `refactor/*`
- **Current work:** `feat/setup-command-center` (this session's work)
- **Stale branches to clean:** `feature/shadcn-integration`, `feature/layout-design-system`, etc.

## Documentation Map
```
docs/
├── README.md                        # Documentation index
├── project/                         # Command center, AI rules, workflow
├── getting-started/                 # Command center setup
├── build/                           # Portfolio guide + Phase 1-7 execution plans
├── deployment/static-export/        # Static export guides for Hostinger
├── architecture/                    # I18N_FIX_PLAN, SOC_REFACTORING_PLAN
├── learning/                        # HOOKS_GUIDE, TAILWIND_TUTORIAL, etc.
└── troubleshooting/                 # ISSUES_AND_SOLUTIONS, etc.
```

## Message to Next Agent

This is a functional but imperfect portfolio. The author (Fathi) is aware of most issues (see `todo.md`). Focus on:

1. **Fixing the `generateMetaData` bug** — highest impact, easy win
2. **Removing dead code** — low risk, cleans up repo
3. **Improving i18n coverage** — many hardcoded strings need translation
4. **Don't over-engineer** — author prefers practical improvements over architectural overhauls

The command center files (`PROJECT_*.md`, `AI_*.md`, `PROJECT_TRACKER.json`) are now in place for easier AI collaboration. Use them.

---
*Generated by OpenCode on 2026-05-01*
