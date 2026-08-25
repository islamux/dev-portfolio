# Clean Code & SOLID Improvement — refactor-clean-code-solid

## Branch
`refactor-clean-code-solid` (off main)

## Audit Scope
Full production codebase: 10 source files across app, components, hooks, i18n, services, types, api, lib.

## Bugs Fixed (Critical)
| ID | Issue | File | Fix |
|----|-------|------|-----|
| B1 | HTML injection in email body | `src/api/contact/route.ts` | `escapeHtml()` on all user inputs before HTML interpolation |
| B2 | `mb2` missing Tailwind dash | `src/components/sections/ContactForm.tsx` | `mb2` → `mb-2` on both label elements |
| B3 | OG image leading slash | `src/app/metadata.ts` | `buildPageMetadata()` uses path without leading slash |
| B4 | og:locale missing es/tr | `src/app/metadata.ts` | `OPEN_GRAPH_LOCALES` map covers all 5 locales |
| B5 | Static failure message | `src/hooks/useContactForm.ts` | Catch shows user-friendly `"Something went wrong"` instead of raw error |

## SOLID / DRY Issues Resolved
| ID | Issue | Files Changed |
|----|-------|---------------|
| S1 | `as Locale` type coercion at every boundary | `i18n/config.ts` — added `parseLocale()`, `isLocale()`; all pages/layouts use guard |
| S2 | `ProjectService` class with no polymorphism | Flattened to plain functions in `services/projectService.ts` |
| S3 | `metadata.ts` dead 90% config | Deleted `defaultMetadata`; replaced with `buildPageMetadata()` builder |
| S4 | `SocialLink` type in wrong directory | Moved to `src/data/socialLinks.ts`; deleted `src/types/index.ts` |
| S5 | Icon registry hardcoded in component | Extracted to `src/components/ui/icons.ts` + `IconName` type |
| S6 | `buildLocalePath` duplicated in LanguageSwitcher | Extracted to `src/i18n/navigation.ts` |
| S7 | `next-intl` re-exports never imported | Removed `Link`, `redirect`, `usePathname`, `useRouter` from navigation.ts |
| S8 | `reset()` never called | Removed from `useContactForm.ts`; extracted `EMPTY_CONTACT_FORM` constant |
| S9 | Dead conditional in sitemap | `route === "" ? "monthly" : "monthly"` → `"monthly"` |
| S10 | Identical ternary branches in ProjectCard | Both branches same → single string; regex hoisted to module constant |

## Cleanup
- All scaffolding/paraphrase comments stripped; genuine why-comments preserved
- Honeypot comment typo fixed (`Honeypoot` → `Honeypot`), restated as why-comment
- ProjectLink marketing JSDoc deleted
- `next-themes` dependency removal deferred (inert, network-blocked during session)

## Verification Results
| Check | Result |
|-------|--------|
| `pnpm lint` | ✅ 0 errors, 0 warnings |
| `pnpm build` | ✅ Compiled successfully, 96/96 pages |
| `pnpm build:static:full` | ✅ Clean + static build, 96/96 pages |
| `scripts/test-routes.sh` | ✅ 40/40 routes pass |

## Commits (chronological)
```
86b7d48  refactor: add parseLocale/isLocale guards, eliminate all `as Locale` casts
4152d59  refactor: flatten ProjectService to plain functions, rewrite [id] page
c072832  refactor: add buildPageMetadata builder, fix OG locale map (B3/B4), delete dead defaultMetadata
d7a0a61  refactor: extract icon registry to icons.ts, add IconName type, relocate SocialLink
34c19fd  refactor: extract buildLocalePath from LanguageSwitcher to navigation.ts
b4dbfb0  refactor: remove dead code (next-intl re-exports, reset, no-op conditionals)
c82cc38  refactor: remove scaffolding/paraphrase comments, keep genuine why-comments
3fa58d9  fix: B1 HTML injection, B2 mb2 typo, B5 static failure message, clipboard error handling
```

## Remaining (non-blocking)
- `next-themes` dependency in package.json (inert, never imported) — remove when convenient
