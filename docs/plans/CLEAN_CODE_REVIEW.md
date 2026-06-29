# Clean Code Review — Developer Portfolio

> Saved from session review. Priority-ordered findings.

## Critical (Still Open)

- **Logo link has no locale prefix** — `src/components/sections/SiteHeader.tsx:43`
  `<Link href="/">` ignores current locale. Fix: `getLocalizedHref(locale as Locale, 'home')`

## Important — Dead Code ✅ RESOLVED

1. **`languageInfo` interface + `getLanguagesInfo()`** — **REMOVED** from `src/i18n/config.ts`. ✅
2. **`cn()` utility + `clsx` dependency** — **REMOVED** `src/lib/utils.ts` + `clsx` from package.json. ✅
3. **`generateLocaleParams()`** — **REMOVED** `src/app/[locale]/generateStaticParams.ts`. ✅
4. **`ProjectService.generateStaticParams()`** — **REMOVED** from `projectService.ts`. ✅
5. **`ContentData.slug`** — **REMOVED** from `types/content.ts`. ✅
6. **Empty `<div>`** — **REMOVED** from `SiteFooter.tsx`. ✅

## Important — Error Swallowing ✅ RESOLVED

- `ProjectService` methods now let errors propagate. `getProjectData()` simplified without catch-all `[]`.
- Catch only at component level for meaningful UI. ✅

## Important — Comment Pollution ✅ RESOLVED

Cleaned from: `SiteHeader.tsx`, `SiteFooter.tsx`, `HomePage.tsx` (page.tsx), `AboutPage.tsx` (about/page.tsx), `ContactPage.tsx` (contact/page.tsx), `LanguageSwitcher.tsx` (renamed from `LanguagesSwitcher.tsx`), `ProjectCard.tsx`. ✅

## Important — Inconsistencies

- **Import style**: mix of `@/` aliases and relative paths. Pick one (`@/` recommended). 🟡 Still open
- **Filename vs export**: `LanguageSwitcher.tsx` now matches export `LanguageSwitcher` (singular). ✅
- **Params pattern**: `ProjectBreadcrumb`/`ProjectBackButton` — these components were **REMOVED** (dead code). ✅
- **`dark:text-fuchsia-400`** — component was **REMOVED** (dead code). ✅

## Nit

- `eslint-disable-next-line react-hooks/set-state-in-effect` in `SiteHeader.tsx:33` — explain or refactor to reducer. 🟡 Still open
- `Button.tsx` `active` prop duplicates variant logic. 🟡 Still open

## What's Good (Still Holds)

- Static export dual-mode is correctly implemented
- `LanguageSwitcher` correctly avoids `next-intl` hooks
- Error states handled with fallback content
- Strong TypeScript prop typing
- Good component decomposition (SRP)

---

## Implementation Results

| # | Task | Status |
|---|------|--------|
| 1 | Fix Logo locale bug | 🔴 Still open |
| 2 | Strip comment pollution | ✅ Done |
| 3 | Remove dead code | ✅ Done (10 files deleted) |
| 4 | Fix error handling in service/content layer | ✅ Done |
| 5 | Reconcile import style | 🟡 Open (low priority) |
| 6 | Fix file/export name mismatch | ✅ Done |
| 7 | Choose one params pattern | ✅ Resolved (ProjectBreadcrumb/BackButton deleted) |
