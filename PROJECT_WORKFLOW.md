# Project Workflow - Dev Portfolio

## Feature Development Lifecycle

### 1. Start Feature
```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

### 2. Development
```bash
pnpm dev                    # Start dev server
# Edit files in src/ or content/
pnpm lint                   # Check code style (run frequently)
```

### 3. Verify Static Export Compatibility
Since this project supports both SSR and static export:
```bash
pnpm build:static:full     # Full static build test
pnpm serve:static          # Test the static output
```
**Check:** No `headers()` or `cookies()` usage in static mode. If adding API routes, they won't work in static export.

### 4. Add Content (if applicable)
- **New project:** Add entry to `content/{locale}/projects.json` for each locale
- **New page content:** Create `content/{locale}/page.md` with frontmatter
- **New UI strings:** Update `src/messages/{locale}.json`

### 5. Run Lint Before Commit
```bash
pnpm lint
```
**Must pass** before committing. ESLint config: `eslint-config-next` + TypeScript strict.

### 6. Commit
```bash
git add .
git commit -m "feat: your descriptive message"
git push origin feat/your-feature-name
```

## Bugfix Workflow

1. **Identify bug** — check `PROJECT_ARCHITECTURE.md` Technical Debt table
2. **Create fix branch:** `git checkout -b fix/bug-description`
3. **Fix the issue** — follow existing code conventions (see AGENTS.md)
4. **Verify:** `pnpm lint && pnpm build`
5. **Static check:** `pnpm build:static:full` (if bug affects static export)
6. **Commit with `fix:` prefix**

### Common Bug Patterns in This Repo
- **Typos in function names** (e.g., `generateMetaData` → `generateMetadata`)
- **CSS class typos** (e.g., `md:py24` → `md:py-24`)
- **Hardcoded English strings** — use `src/messages/{locale}.json` instead
- **Missing locale prefixes** in links — use `getLocalizedHref()` from `@/i18n/navigation`

## Debugging Workflow

### Build Failures
```bash
pnpm build 2>&1 | tee build.log
# Check build.log for errors
```

### Static Export Issues
```bash
DEPLOY_TARGET=static pnpm build 2>&1 | tee build.log
# Common issues:
# - next-intl headers() usage → remove NextIntlClientProvider in static mode
# - API routes → won't work in static, move to client-side or remove
```

### TypeScript Errors
```bash
pnpm build    # TypeScript errors appear during Next.js build
# Check tsconfig.json: strict: true is enabled
```

### Runtime Errors
```bash
pnpm dev
# Open browser at http://localhost:3000
# Check browser console + terminal output
```

### i18n Debugging
```bash
# Check locale files exist
ls -la src/messages/
ls -la content/
# Missing locale? Falls back to English (see src/lib/content.ts)
```

## Release Workflow (Hostinger Static Deployment)

### Pre-Release Checklist
- [ ] `pnpm lint` passes
- [ ] `pnpm build:static:full` succeeds
- [ ] All locales tested (`/en`, `/ar`, `/tr`, `/es`, `/fr`)
- [ ] Project images exist in `public/images/projects/`
- [ ] `content/{locale}/projects.json` updated for all locales
- [ ] No console errors in browser

### Static Build + Deploy
```bash
pnpm build:static:full
# Upload contents of /out directory to Hostinger
# Ensure .htaccess is in /out (copy from /public/.htaccess)
```

### SSR Deployment (Vercel)
```bash
pnpm build
pnpm start
# Or connect GitHub repo to Vercel for auto-deploy
```

## Code Review Checklist

### Architecture
- [ ] Server vs Client component decision correct? ("use client" only when needed)
- [ ] No `useState`/`useEffect` in server components
- [ ] New API routes marked as non-functional in static mode

### Internationalization
- [ ] No hardcoded English strings in new code
- [ ] Translations added to all 5 locale files (`src/messages/`)
- [ ] Content added to all 5 `content/{locale}/` directories
- [ ] RTL styles tested for Arabic locale
- [ ] Links use `getLocalizedHref()` or `getProjectHref()` from `@/i18n/navigation`

### Code Quality
- [ ] TypeScript types explicit (no `any`)
- [ ] Interfaces in `@/types/` use PascalCase
- [ ] Imports ordered: external → `@/` → relative
- [ ] No dead code introduced
- [ ] No duplicate logic with existing code

### Styling
- [ ] Uses `brand-*` colors from Tailwind config
- [ ] Dark mode supported with `dark:` prefix
- [ ] RTL tested (Arabic) — check `isRTL()` in `src/i18n/config.ts`
- [ ] Responsive (mobile menu, project cards)

### Static Export
- [ ] No `headers()`, `cookies()`, or `useSearchParams` (breaks static)
- [ ] No reliance on API routes (won't work in static)
- [ ] `DEPLOY_TARGET=static pnpm build` succeeds

## Refactor Targets (from todo.md)

| Target | Priority | File(s) |
|--------|----------|---------|
| Remove dead code (`generateStaticParams.ts`, `guards.ts`, `types/project.ts`) | High | Multiple |
| Fix `SiteFooter` — render in layout or delete | Medium | `layout.tsx`, `SiteFooter.tsx` |
| Unify translation loading pattern | Medium | `page.tsx`, `projects/page.tsx` |
| Replace hardcoded SVG icons with icon library | Low | `src/components/ui/Icon.tsx` |
| Add `clsx`/`cn()` utility for className merging | Low | Multiple UI components |
| Consolidate RTL CSS in `globals.css` | Medium | `src/app/globals.css` |
| Make contact form functional (email sending) | Low | `src/api/contact/route.ts` |

## Context Preservation Strategy

### For AI Agents
1. **Read AGENTS.md first** — contains project conventions
2. **Read PROJECT_ARCHITECTURE.md** — understand technical debt before editing
3. **Check todo.md** — author's known issues list
4. **Run `pnpm lint` after every edit session**
5. **Test static build** if editing i18n or layout files

### Multi-Agent Task Splitting
- **Agent 1 (Content):** `content/*`, `src/messages/*` — safe, data-only
- **Agent 2 (UI Components):** `src/components/ui/*` — low risk, no i18n
- **Agent 3 (Pages):** `src/app/[locale]/*` — high risk, server components
- **Agent 4 (i18n):** `src/i18n/*`, translation files — medium risk
- **Agent 5 (Refactor):** Dead code removal, type fixes — coordinate with others

**Rule:** Agents working on `src/app/[locale]/` must not conflict — use different page branches.

## Safe Editing Boundaries

### ✅ Safe to Edit Freely
- `content/*` (markdown, JSON data)
- `src/messages/*` (translation JSONs)
- `src/components/ui/*` (UI components, no i18n)
- `public/images/*` (static assets)

### ⚠️ Edit with Care (test afterward)
- `src/app/[locale]/*` (server components, affect routing)
- `src/i18n/*` (i18n config, affects all locales)
- `src/services/*`, `src/lib/*` (data layer)
- `tailwind.config.js` (affects all styles)
- `src/app/globals.css` (RTL overrides, global styles)

### 🛑 Do Not Edit Without Discussion
- `next.config.ts` (dual static/SSR mode config)
- `tsconfig.json` (TypeScript strict mode)
- `package.json` (dependency changes)
- `src/middleware.ts.disabled` (disabled for a reason)
