# Docs Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring all 30+ files under `docs/` (plus repo-level `AGENTS.md` and `build.log` hygiene) in line with the verified current state of the codebase, using "archive don't edit" for historical records and surgical fixes for living guides.

**Architecture:** Three-tier treatment decided by audit verdict: (1) living guides get surgical corrections; (2) historical records (executed plans, phase plans, old fix narratives) get status banners and stay otherwise untouched; (3) one dangerously wrong mega-guide (COMPREHENSIVE_STATIC_EXPORT_GUIDE) gets archived and replaced with a lean current guide at the same path so inbound links survive. A new `docs/archive/` directory absorbs misplaced/superseded content.

**Tech Stack:** Markdown docs only — no code changes, no new dependencies.

**Spec:** Four staleness audits completed 2026-08-25 (docs/project, docs/build, docs/deployment+architecture, docs/learning+plans+superpowers+todo+troubleshooting), plus two prior sessions that already fixed `README.md`, `docs/README.md`, `docs/SENIOR_INTERVIEW_QUESTIONS.md` (uncommitted on branch `docs/verify-interview-questions`).

## Verified Codebase Truth (compare every edit against this)

- **Versions:** next `16.3.2`, react/react-dom `19.2.8`, next-intl `^4.5.8`, react-markdown `^10.1.0` (`package.json:19-24`). Node engines `>=20.9.0`. License **GPL-3.0-only** (`package.json:4`).
- **Theming:** custom `ThemeContext` in `src/app/providers.tsx` (toggles `.light`/`.dark` classes on `<html>`, `localStorage`, `matchMedia`). `next-themes@^0.4.6` is in package.json but **never imported** — dead dependency.
- **Scripts (exhaustive):** `dev`, `build`, `start`, `build:static` (sets BOTH `NEXT_PUBLIC_DEPLOY_TARGET=static DEPLOY_TARGET=static`), `build:clean`, `build:static:full`, `serve:static`, `test:static`, `lint`. There is **no** `typecheck`, `format`, `format:check`, or `test` script. No lint-staged config, no husky — `lint-staged` is a devDependency only.
- **Content:** **14 projects** in `content/en/projects.json` (all `featured: true`); **5 locales** (en, fr, ar, es, tr) in `src/i18n/config.ts:3`.
- **Structure:** root layout `src/app/(index)/layout.tsx`; root redirect `src/app/(index)/page.tsx` (client). `src/i18n/` = `config.ts`, `navigation.ts`, `request.ts` — **no guards.ts**. Translations in `src/messages/*.json` (not root `messages/`). `src/types/` = `content.ts` only (no `index.ts`, no `project.ts`). `SocialLink` lives in `src/data/socialLinks.ts`. Icon registry = `src/components/ui/icons.ts` (`IconName = keyof typeof iconPaths`). Env template = `env.example` (no leading dot).
- **Middleware: none.** No `src/middleware.ts`, no `.disabled` variant — deleted entirely.
- **Contact:** `src/api/contact/route.ts` exists but is **unreachable** (outside `src/app/api/` → 404 in every mode). It DOES send email via Resend with `escapeHtml()` on all interpolated fields (`src/lib/escapeHtml.ts`) — so "logs only" claims are wrong; "non-functional (unreachable)" claims are right.
- **ProjectService:** plain functions `getAllProjects`/`getFeaturedProjects`/`getProjectById` (`src/services/projectService.ts:4,8,14`) — **no class**, sync (not awaited). Detail page uses `getProjectById` (layering violation FIXED).
- **metadata.ts:** exports `siteConfig` + `buildPageMetadata` — **no `defaultMetadata`**.
- **Tailwind:** v4 via `@tailwindcss/postcss`; `tailwind.config.js` (brand=sky palette, `darkMode: "class"`, typography plugin) IS loaded via v4's automatic legacy-config detection — verified in compiled CSS (`out/_next/static/chunks/*.css` contains brand hex + `.prose`).
- **Test script:** `scripts/test-routes.sh` = **40 checks** (not 41).
- **Sitemap:** 90 URLs (5 locales × 4 routes + 5 × 14 project pages).
- **RTL CSS:** `globals.css:85-215` ≈ 131 lines (not ~200).
- **No `not-found.tsx` anywhere; no `server.js`; no `vercel.json`; no `out/_redirects`/`netlify.toml`; `public/.htaccess` exists with DirectoryIndex + trailing-slash 301 + Gzip.**
- **Recent history:** tracker deleted (#14), clean-code refactors (#13/#16), terminal polyglot redesign w/ native theme provider (#8), badeel-atr2 added (#15), Next 16.3.2 upgrade (f4e916d). All superpowers plans/specs already shipped (millionaire #6/58b1aa9, alshaebsweets, clean-code-solid).

## Global Constraints

- **Historical records get banners, not rewrites.** Never edit the body of a file marked HISTORICAL — prepend a status banner only.
- **Archive don't delete:** moved files go to `docs/archive/` with a banner; nothing is `rm`'d from git history.
- **Inbound links must not break:** `COMPREHENSIVE_STATIC_EXPORT_GUIDE.md` is referenced by `README.md`, `docs/README.md`, `STATIC_VS_SSR_ANALYSIS.md`, `HOSTINGER_DEPLOYMENT_GUIDE.md` — the replacement keeps the exact filename/path.
- **No code changes:** this plan touches only `docs/**`, `AGENTS.md`, `.gitignore`, and removes `build.log`.
- **Every task ends with its own commit** (conventional commits, e.g. `docs: ...`).
- Work continues on branch `docs/verify-interview-questions` (already holds the README/interview-doc fixes as one cohesive docs-refresh PR).

---

### Task 1: Repo-level hygiene (AGENTS.md, build.log)

**Files:**
- Modify: `AGENTS.md` (header + command table)
- Delete from git: `build.log`
- Modify: `.gitignore`

**Steps:**

- [ ] **Step 1: Fix AGENTS.md staleness**
  - Header line "Next.js 16.2.6, React 19.2.6" → "Next.js 16.3.2, React 19.2.8".
  - "Test all routes locally (41 checks)" (commands table + "all 41 checks must pass" in the deploy checklist) → "40 checks".
- [ ] **Step 2: Remove committed build.log and ignore logs**
  ```bash
  git rm --cached build.log
  printf '\n# Build artifacts\nbuild.log\n*.log\n' >> .gitignore
  ```
- [ ] **Step 3: Verify** — `rg -n "16\.2\.6|41 checks|41-check" AGENTS.md` returns nothing; `git check-ignore build.log` prints the filename.
- [ ] **Step 4: Commit** — `git add AGENTS.md .gitignore build.log && git commit -m "chore: fix AGENTS.md versions/route-check count, untrack build.log"`

---

### Task 2: docs/project/ living docs (4 files, surgical)

**Files:**
- Modify: `docs/project/PROJECT_CONTEXT.md` (74 lines)
- Modify: `docs/project/PROJECT_ARCHITECTURE.md` (162 lines)
- Modify: `docs/project/AI_AGENT_RULES.md` (181 lines)
- Modify: `docs/project/PROJECT_WORKFLOW.md` (203 lines)

**Corrections (from audit, line → fix):**

- [ ] **Step 1: PROJECT_CONTEXT.md**
  - `:8` MIT → GPL-3.0-only; `:14` 16.0.10 → 16.3.2; `:16` 19.2.0 → 19.2.8; `:18` next-themes → custom ThemeContext (`src/app/providers.tsx`; next-themes installed but unused).
  - `:32` delete the `src/messages/images.json` dead-code row (file deleted; dir now holds only 5 locale JSONs).
  - `:34` qualify fallback: only `projects.json` falls back to EN (`content.ts:39-44`); markdown `getContentBySlug` throws on missing file.
  - `:43`/`:72` contact status → "handler implemented (Resend + escapeHtml) but unreachable — lives in `src/api/`, not `src/app/api/` → 404 in every mode".
  - `:56` "5+ projects" list → "14 projects (see `content/en/projects.json`)".
  - `:65` delete `RECAPTCHA_SECRET_KEY` row (absent from env.example).
  - `:73` middleware row → "No middleware file exists (removed entirely)".
  - `:74` "SiteFooter never rendered" → rendered (`[locale]/layout.tsx:42-47`).
  - Add `(index)` root layout/redirect, `metadata.ts`, `robots.ts`, `sitemap.ts` to the structure sketch.
- [ ] **Step 2: PROJECT_ARCHITECTURE.md**
  - `:12` `messages/` → `src/messages/`; `:18`/`:47`/`:98` next-themes → custom ThemeContext; `:27` "48 files ~2352 lines" → "41 files ~2037 lines"; `:42` ProjectCard path → `src/components/sections/ProjectCard.tsx`.
  - `:55` MarkdownContent row → "react-markdown works in RSC — server component is correct, no `'use client'` needed".
  - `:59` "ProjectService class" → plain-function module (`getAllProjects`, `getFeaturedProjects`, `getProjectById`).
  - `:67` layering Issue → mark **RESOLVED** (page calls `getProjectById`, `page.tsx:23`).
  - `:97` ~200 → ~131 lines (`globals.css:85-215`); `:105` delete `src/types/index.ts` row (already contradicts own REMOVED ledger at :143); `:108` delete `types/project.ts` row (file removed).
  - `:119-122` API row → "validates + sends via Resend with escaping, but unreachable (wrong directory)".
  - `:129-136` bug table: mark all 8 rows ✅ FIXED (generateMetadata exists at `page.tsx:21`; `openGraph.url` = `siteConfig.url` (`metadata.ts:41`); `md:py-12`; `"Content-Type"`; SVG `M19 9l-7 7-7-7`; home.md links locale-prefixed; projects page reads `messages.projects`).
  - `:144` `getAllContent()` row → REMOVED; `:146` middleware row → file deleted; `:152` NavLink dedup row → fixed (`types/content.ts:31`).
  - Add missing to inventory: `TerminalCard`, `SkipToContent` (note: anchor empty — a11y gap), `ui/icons.ts`, `src/data/socialLinks.ts`, `(index)` group.
- [ ] **Step 3: AI_AGENT_RULES.md**
  - `:27` contact clause → "handler unreachable in every mode (`src/api/` ≠ `src/app/api/`); email logic implemented but never invoked".
  - `:33` "~55% server / 45% client" → "10 of 41 files are `'use client'` (~24% client)".
  - `:38` delete "any violations in pages" claim (pages use typed translations interfaces).
  - `:84` remove `src/middleware.ts.disabled` from Ask-First list (deleted).
  - `:90` page-pattern sample: replace `getTranslations` import with the actual `loadMessages(locale)` + `messages.home as HomeTranslations` pattern (match `:131-137`).
  - `:142-144` sample → `import { getAllProjects, getFeaturedProjects, getProjectById } from "@/services/projectService"` — plain sync functions, no `new`, no `await`.
  - `:162` → "lint-staged + prettier are devDependencies; no pre-commit hook is configured (add husky/lint-staged config if enforcement is wanted)".
- [ ] **Step 4: PROJECT_WORKFLOW.md**
  - `:162-164` board rows "contact form functional" / "detail page ProjectService" / "logo locale prefix" → ✅ Done (logo fix at `SiteHeader.tsx:34` via `getLocalizedHref`).
  - `:203` remove `src/middleware.ts.disabled` from Do-Not-Edit list.
  - `:55-56` keep bug examples but prefix with "(historical, now fixed)".
- [ ] **Step 5: Verify** — `rg -n "next-themes|ProjectService\.|middleware\.ts\.disabled|5\+ projects|MIT|defaultMetadata" docs/project/ | rg -v "installed but unused|deleted|GPL"` returns only intentional lines.
- [ ] **Step 6: Commit** — `git commit -am "docs(project): align context/architecture/agent-rules/workflow with current codebase"`

---

### Task 3: docs/deployment/ living guides — surgical fixes (4 files)

**Files:**
- Modify: `docs/deployment/static-export/HOSTINGER_DEPLOYMENT_GUIDE.md`
- Modify: `docs/deployment/static-export/STATIC_VS_SSR_ANALYSIS.md`
- Modify: `docs/deployment/static-export/DUAL_STATIC_SSR_COMPATIBILITY_GUIDE.md`
- Modify: `docs/deployment/static-export/RUN_SUCCESSFULY_IN_LOCALE_BUT_NOT_IN_HOSTINGER.md`

**Corrections:**

- [ ] **Step 1: HOSTINGER_DEPLOYMENT_GUIDE.md**
  - `:75-79` Step 3 primary command → `pnpm build:static:full` (plain `pnpm run build` produces no `out/`); keep a note that SSR build is for Vercel.
  - `:45-69` replace `.htaccess` snippet with the current `public/.htaccess` content verbatim (DirectoryIndex, trailing-slash 301, Gzip, current Expires set) + "source of truth: `public/.htaccess`".
  - `:98` success note stands (March 7, 2026) — keep.
- [ ] **Step 2: STATIC_VS_SSR_ANALYSIS.md**
  - `:25-33` config snippet → copy current `next.config.ts:6-13` (includes `trailingSlash: isStatic ? true : undefined`).
  - `:58-65` section 2.4 → "Middleware: none. The file was first renamed `.disabled`, then deleted outright; locale switching is client-side (`LanguageSwitcher` + `buildLocalePath`)."
  - `:230` SSR-table Middleware row → "Possible (would need re-adding) / removed".
  - `:238-247` 7.1 scripts table → the 9 current scripts verbatim from package.json (note `build:static` sets both env vars).
  - `:250-266` 7.2 "(To Be Added)" → "(Added)" — all four scripts exist; strike the pending framing.
- [ ] **Step 3: DUAL_STATIC_SSR_COMPATIBILITY_GUIDE.md**
  - `:54` `src/app/page.tsx` → `src/app/(index)/page.tsx`.
  - `:63-65` fill the empty "5. Forms" section with 3 lines: contact handler lives in `src/api/contact/route.ts` (unreachable everywhere — needs relocation to `src/app/api/` for SSR use); static target needs a third-party backend (Formspree/Web3Forms); honeypot is client-side.
- [ ] **Step 4: RUN_SUCCESSFULY_IN_LOCALE_BUT_NOT_IN_HOSTINGER.md**
  - `:233`/`:275` "41 routes"/"41-route" → 40.
  - `:253-256` `out/public/.htaccess` etc. → those files live at `out/` root.
  - `:160`/`:300` delete `node server.js` commands (no such file); `:142`/`:294` `DEPLOY_TARGET=static pnpm run build` → `pnpm run build:static` (sets both vars).
  - `:335` locale list → include es/tr.
- [ ] **Step 5: Verify** — `rg -n "41|server\.js|out/public|\.env\.example|middleware\.ts\.disabled" docs/deployment/` returns nothing unintended; `pnpm build:static`-referencing lines all match package.json.
- [ ] **Step 6: Commit** — `git commit -am "docs(deployment): fix build commands, counts, phantom files in static-export guides"`

---

### Task 4: Archive + replace COMPREHENSIVE_STATIC_EXPORT_GUIDE.md

**Files:**
- Create: `docs/archive/` directory
- Move: old guide → `docs/archive/COMPREHENSIVE_STATIC_EXPORT_GUIDE_2025-12.md`
- Create: new lean guide at `docs/deployment/static-export/COMPREHENSIVE_STATIC_EXPORT_GUIDE.md` (~150-200 lines)

**Why replace, not patch:** the 1,723-line guide's core "Solution" teaches the superseded `.html`-file routing architecture (directly contradicting AGENTS.md's "NEVER use file-based routing"), references nonexistent `server.js`/`out/_redirects`/`out/vercel.json`, and claims 3 locales/4 projects. Its "Add `.html` extension" key takeaway is actively dangerous to anyone following it today.

**Steps:**

- [ ] **Step 1: Move the old guide**
  ```bash
  mkdir -p docs/archive
  git mv docs/deployment/static-export/COMPREHENSIVE_STATIC_EXPORT_GUIDE.md docs/archive/COMPREHENSIVE_STATIC_EXPORT_GUIDE_2025-12.md
  ```
  Prepend banner: `> ⚠️ **Historical record (Dec 2025).** Documents the superseded file-based (\`.html\`) routing architecture. The current approach is directory-based routing with \`trailingSlash: true\` — see \`docs/deployment/static-export/COMPREHENSIVE_STATIC_EXPORT_GUIDE.md\` and \`AGENTS.md\`. Counts (3 locales, 4 projects, 49 pages) reflect that era.`
- [ ] **Step 2: Write the replacement guide** at the original path, structure:
  1. **Status header**: "Current as of Next.js 16.3.2, August 2026."
  2. **How the dual build works**: `DEPLOY_TARGET=static` → `output:'export'` + `trailingSlash:true` + `images.unoptimized` (`next.config.ts:6-13`); `NEXT_PUBLIC_DEPLOY_TARGET` for the client root redirect.
  3. **Directory-based routing (the Hostinger 403 fix)**: LiteSpeed redirects `/en` → `/en/` → needs `en/index.html`; summary + link to `RUN_SUCCESSFULY...md:216-233` and `ISSUES_AND_SOLUTIONS.md` Issue 8.5 for history.
  4. **Build & verify**: `pnpm build:static:full` → `pnpm serve:static` → `scripts/test-routes.sh` (40 checks).
  5. **Deploy to Hostinger**: wipe `public_html/` first (stale locale dirs cause 403), upload `out/` contents, `.htaccess` = copy of `public/.htaccess`.
  6. **Constraints**: no API routes / headers() / cookies() / middleware / image optimization; i18n via props-passing (link AGENTS.md rules).
  7. **Current numbers**: 5 locales, 14 projects, 90 sitemap URLs, 90 static pages.
- [ ] **Step 3: Verify links** — `rg -ln "COMPREHENSIVE_STATIC_EXPORT_GUIDE" README.md docs/ | xargs -I{} ...` all inbound references resolve to the new file; `ls docs/deployment/static-export/COMPREHENSIVE_STATIC_EXPORT_GUIDE.md` exists.
- [ ] **Step 4: Commit** — `git commit -am "docs(deployment): archive superseded .html-routing guide, write current replacement"`

---

### Task 5: PORTFOLIO_BUILD_GUIDE.md — surgical update + version stamp

**Files:**
- Modify: `docs/build/PORTFOLIO_BUILD_GUIDE.md` (2,622 lines — targeted edits only, no rewrite)

**Corrections:**

- [ ] **Step 1: Stamp + fix dangerous bits**
  - Top: add `> ✅ **Accurate as of Next.js 16.3.2 / August 2026.** Sections describing middleware, next-themes, and the GitHub importer describe approaches later replaced — flagged inline.`
  - `:5` "Next.js 15+" → "Next.js 16.3.2"; `:649` Node 18.17+ → 20.9+ (engines `>=20.9.0`).
  - `:29` GITHUB_TOKEN importer → mark "(never implemented — no octokit dep, no script)".
  - `:548,:559-560,:621,:1755` `pnpm typecheck`/`format` → replace with `pnpm lint` (the only quality script) or delete the CI rows.
  - `:760-802` next-themes section → add note: "Superseded: theming now uses a custom ThemeContext (`src/app/providers.tsx`); next-themes is an unused dependency."
  - `:810-856,:1904-1907` font-bug section → note "Repo now on 16.3.2 with CDN `@font-face` still in place; retest `next/font` before migrating."
  - `:1416-1420` middleware setup → strike with "(middleware was later removed entirely for static export)".
  - `:424-430,:597-605,:1423` 3-locale lists → note "now 5 locales (TR, ES added)".
  - `:2427` "3-5 projects" → "14 projects".
  - `:91-100` phase-status table → reconcile (Phase 5/6 marked Pending; Phase 7 Completed — set 5/6 to their true state per docs/build phase plans: Phase 5 partially shipped, Phase 6 PWA not shipped, Phase 7 testing/CI not shipped).
- [ ] **Step 2: Verify** — `rg -n "18\.17|typecheck|next-themes|middleware" docs/build/PORTFOLIO_BUILD_GUIDE.md` shows only banner-flagged mentions.
- [ ] **Step 3: Commit** — `git commit -am "docs(build): stamp build guide, fix versions/scripts/locale counts"`

---

### Task 6: PHASE_1–7 execution plans — historical banners

**Files:** all 7 `docs/build/PHASE_N_EXECUTION_PLAN.md` (no body edits)

**Steps:**

- [ ] **Step 1: Prepend per-file banner** (customized status line each):
  - Phase 1: `> 📜 Historical execution record (Repo + Baseline). Completed Dec 2024. Node/scripts/versions herein reflect that era — current: Node ≥20.9, no typecheck/format scripts.`
  - Phase 2: `> 📌 Historical. As-built annotations inline. Note: next-themes was later replaced by a custom ThemeContext; the 16.0.3 font workaround (CDN @font-face) is still current on 16.3.2.`
  - Phase 3: `> 📜 Historical (Pages & Content). Completed. Lightest drift; metadata.ts references remain accurate.`
  - Phase 4: `> 📜 Historical (full i18n). Completed 2025-12-07. Middleware and src/i18n/guards.ts described here were later REMOVED — the repo has neither. Locales grew from 3 to 5.`
  - Phase 5: `> 📜 Historical. ⚠️ Large parts (GitHub importer, upstash rate-limiting, reachable contact API) were never implemented — only the resend dependency survives. The contact handler sits unreachable in src/api/. Env file is env.example (no dot).`
  - Phase 6: `> 📜 Historical. ⚠️ PWA phase (manifest, service worker) never shipped — no PWA artifacts exist in the repo.`
  - Phase 7: `> 📜 Historical. ⚠️ Testing/CI phase (Playwright, vitest, husky) never shipped — package.json has only eslint. Deployment target became Hostinger static, not Vercel.`
- [ ] **Step 2: Verify** — each file's first 3 lines contain "📜"/"⚠️" banner; body untouched (`git diff --stat` ≈ 7 files, +7 lines net).
- [ ] **Step 3: Commit** — `git commit -am "docs(build): mark PHASE_1-7 execution plans as historical records"`

---

### Task 7: docs/learning/ — reference corrections

**Files:**
- Modify: `docs/learning/TYPES_REFERENCE.md` (258 lines — heaviest)
- Modify: `docs/learning/HOOKS_GUIDE.md` (256 lines)
- Modify: `docs/learning/TAILWIND_TUTORIAL.md` (491 lines — two spots)
- Modify: `docs/learning/SENIOR_TO_JUNIOR_ADVICE.md` (`:308` only)

**Corrections:**

- [ ] **Step 1: TYPES_REFERENCE.md — regenerate wrong entries against `src/types/content.ts` (83 lines), `src/i18n/config.ts`, `src/data/socialLinks.ts`**
  - `:9-20` SocialLink → path `src/data/socialLinks.ts`.
  - `:47` delete `slug` field from `ContentData`.
  - `:57-69` Project → add `apk?: string`, `span?: number`; field list = `id, name, description, longDescription?, tech[], github?, gitlab?, demo?, apk?, image?, featured?, year?, span?`.
  - `:96` Locale → `"en" | "fr" | "ar" | "es" | "tr"`.
  - `:99-110` `languageInfo` → replace with actual `localeNames` / `localeFlag` Records (`config.ts:6,14`).
  - `:112-124` `navLink` const → actual `navLinkKeys` (`navigation.ts:30`) + `NavLink` interface (`content.ts:31-35`).
  - `:196` `IconProps.name: string` → `name: IconName` (`Icon.tsx:6`, registry in `ui/icons.ts`).
  - `:239-246` delete `HomePageProps` section (no such file).
  - Add the 7 undocumented interfaces: `NavLink`, `HomeTranslations`, `ProjectsTranslations`, `ContactFormTranslations`, `ContactPageTranslations`, `ProjectFilterTranslations`, `FooterMessages`.
  - Fix summary table (`:250-258`) counts.
- [ ] **Step 2: HOOKS_GUIDE.md — match actual hooks**
  - `:11`/`:224-232` delete `src/hooks/index.ts` barrel references (doesn't exist).
  - `:28-36` useMounted → actual `setTimeout(...,0)` + `clearTimeout` cleanup (`useMounted.ts:6-12`) with the hydration-batch rationale.
  - `:113-117`/`:125` delete `reset()`; document `EMPTY_CONTACT_FORM`, server-error body parsing (`useContactForm.ts:40-43`), honeypot → "Spam detected" error (`:24-28`).
  - `:158-190` useProjectFilter → document `EXCLUDED_FILTER_TECH` (`useProjectFilter.ts:4`); fix return signature to the actual 4 values (no `clearFilter`).
- [ ] **Step 3: TAILWIND_TUTORIAL.md**
  - `:378` → "brand palette lives in `tailwind.config.js`, auto-loaded by Tailwind v4's legacy-config detection (no `@config` directive needed at the root path); CSS-first `@theme` is the v4-native alternative".
  - `:437` Button quote → `${variants[variant]}` (fix `varients` typo).
- [ ] **Step 4: SENIOR_TO_JUNIOR_ADVICE.md** — `:308` example "Next.js 15" → "Next.js 16".
- [ ] **Step 5: Verify** — cross-check every code block in TYPES_REFERENCE/HOOKS_GUIDE against `src/types/content.ts` + `src/hooks/*.ts` line by line; `rg -n "index\.ts.*hooks|clearFilter|reset\(\)|varients" docs/learning/` returns nothing.
- [ ] **Step 6: Commit** — `git commit -am "docs(learning): sync types/hooks/tailwind references with actual source"`

---

### Task 8: Historical banners batch 2 (architecture/, superpowers/, plans/, troubleshooting/, AI_HANDOFF)

**Files:** 10 files, banners + tiny status fixes only

**Steps:**

- [ ] **Step 1: architecture/**
  - `I18N_FIX_PLAN.md`: banner `> 📜 Historical fix log (Dec 2025). "6 projects" and line-number pins reflect that era — now 14 projects.`
  - `I18N_FIX_SUMMARY.md`: banner `> 📜 Historical. ⚠️ The middleware this describes (src/proxy.ts → src/middleware.ts) was later REMOVED entirely; current locale switching is client-side (LanguageSwitcher + buildLocalePath) with the provider bypassed in static mode. Locales: 5, not 3.`
  - `SOC_REFACTORING_PLAN.md`: banner `> 📜 Historical (completed Dec 15, 2024). The seven extracted detail components and src/types/project.ts it lists were later re-consolidated/removed — none exist today. projectService.ts and lib/content.ts do.`
- [ ] **Step 2: superpowers/** (all three shipped — add status lines)
  - `plans/clean-code-solid-improvements.md`: `> ✅ Executed (commits 86b7d48…3fa58d9). One item remains open: remove the unused next-themes dependency — now tracked in docs/project/todo.md.`
  - `plans/2026-07-02-who-wants-millionaire.md`: `> ✅ Executed and shipped (project id "who-wants-million", all 5 locales; 2-column span treatment added later in 58b1aa9). Checkboxes left as-written for the record.`
  - `specs/2026-07-02-who-wants-millionaire-design.md`: `> ✅ Design shipped as content/en/projects.json entry "who-wants-million".`
  - `specs/2026-08-18-alshaebsweets-portfolio-entry-design.md`: `> ✅ Shipped — "alshaebsweets" is the last entry in all 5 locale projects.json files.`
- [ ] **Step 3: plans/CLEAN_CODE_REVIEW.md**
  - Critical row `:5-8`/`:54` "Logo link has no locale prefix 🔴 open" → ✅ RESOLVED (`SiteHeader.tsx:34` uses `getLocalizedHref(locale, 'home')`).
  - `:37` eslint-disable line ref → now `SiteHeader.tsx:26`.
  - `:30` import-style row → close as moot (sibling `../ui/*` imports are the sanctioned style per AGENTS.md).
  - `:38` Button `active`-prop row stays open (verified still present).
- [ ] **Step 4: troubleshooting/ISSUES_AND_SOLUTIONS.md**
  - Title `:1-2` "Phases 1-4" → "Phases 1-8"; `:13` "Next.js 16.0.3" → "16.0.3 at time of writing (now 16.3.2)"; `:14` date range → "November 2024 – December 2025"; `:1276-1277` "Living document" → "Issue log — last entry Dec 31, 2025; append new issues as discovered".
- [ ] **Step 5: project/AI_HANDOFF.md**
  - Banner: `> 📜 Snapshot dated 2026-06-29 — superseded. All 🔴 high-priority items have since been completed (detail-page service access, contact Resend impl, logo prefix, SVG typo). For current state see PROJECT_CONTEXT.md / PROJECT_ARCHITECTURE.md. Do not act on the priorities below.`
- [ ] **Step 6: Migrate the open next-themes note** — add line to `docs/project/todo.md`: `- remove unused next-themes dependency (only remaining item from clean-code-solid plan)`.
- [ ] **Step 7: Verify** — banners present on all 10 files; `git diff --stat` ≈ small per file.
- [ ] **Step 8: Commit** — `git commit -am "docs: mark historical records, resolve stale review items, update issue-log header"`

---

### Task 9: Archive docs/todo.md, prune project todo, refresh docs/README.md, final sweep

**Files:**
- Move: `docs/todo.md` → `docs/archive/todo-azkari-source.md`
- Modify: `docs/project/todo.md` (prune ~6 stale items)
- Modify: `docs/README.md` (add archive section)
- Modify: `docs/README.md` links check

**Steps:**

- [ ] **Step 1: Archive the Azkari file**
  ```bash
  git mv docs/todo.md docs/archive/todo-azkari-source.md
  ```
  Prepend: `> 📦 Source material for the shipped "athkari" project entry (condensed into content/{locale}/projects.json longDescription). Kept for reference; was misplaced at docs/todo.md.`
- [ ] **Step 2: Prune docs/project/todo.md** — remove items referencing deleted symbols: `:10` (defaultMetadata — never existed), `:21-22` (t() duplications — page now uses typed translations), `:33` (ProjectBreadcrumb — deleted), `:37` (ProjectService class — gone; home already calls getFeaturedProjects). Update `:7` next/font item: "Next is 16.3.2 — retest the Turbopack font bug before migrating."
- [ ] **Step 3: docs/README.md** — add after Troubleshooting section:
  ```markdown
  ### Archive

  Superseded and historical documents kept for the record.

  - [COMPREHENSIVE_STATIC_EXPORT_GUIDE_2025-12.md](./archive/COMPREHENSIVE_STATIC_EXPORT_GUIDE_2025-12.md) - superseded `.html`-routing era guide
  - [todo-azkari-source.md](./archive/todo-azkari-source.md) - source copy for the shipped athkari project entry
  ```
- [ ] **Step 4: Final drift sweep (must be clean)**
  ```bash
  rg -n "16\.2\.6|19\.2\.0|18\.17|41 (checks|routes|curl)|\.env\.example|guards\.ts|middleware\.ts\.disabled|defaultMetadata|ProjectService\.|src/app/page\.tsx|src/components/HomePage|logs only|5\+ projects|12 projects" README.md AGENTS.md docs/ -g '!docs/archive/**' -g '!docs/superpowers/plans/2026-08-25-docs-refresh.md'
  ```
  Expected: zero output (allowlisting historical-banner mentions if pattern-matched contextually).
- [ ] **Step 5: Link check** — every relative link in `docs/README.md` + `README.md` resolves (`ls` each target).
- [ ] **Step 6: Lint** — `pnpm lint` passes (docs don't affect it, but confirms no accidental src/ edits: `git status` shows only docs/AGENTS.md/.gitignore/build.log paths).
- [ ] **Step 7: Commit** — `git commit -am "docs: archive misplaced Azkari todo, prune stale items, index archive in docs README"`

---

## Self-Review

- **Coverage:** All 33 audited files map to tasks — Tier 1 living guides (Tasks 2-5, 7), Tier 2 historical (Tasks 6, 8), misplaced content (Task 9), repo hygiene (Task 1). The 3 files already fixed in prior sessions (README.md, docs/README.md, SENIOR_INTERVIEW_QUESTIONS.md) need only Task 9's incremental README touch.
- **Placeholders:** every step carries exact line-level corrections from the audits; the Task 4 replacement guide has a section outline with the facts to include.
- **Consistency:** "40 checks", "14 projects", "5 locales", "16.3.2/19.2.8" used uniformly; no task contradicts the Verified Truth block.
