# Project Architecture - Dev Portfolio

## High-Level Architecture
```
Client Browser
      ↓
Next.js App Router (locale-aware routing)
      ↓
┌─────────────────────────────────────────┐
│  Server Components (pages, layout)      │
│  - Load content via project functions   │
│  - Fetch translations from src/messages/│
│  - Pass props to Client Components      │
└─────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────┐
│  Client Components (hooks, interactivity)│
│  - ThemeToggle (custom ThemeContext)    │
│  - ProjectsList (filtering)            │
│  - ContactForm (form state)            │
│  - SiteHeader (navigation state)       │
└─────────────────────────────────────────┘
      ↓
Data Layer: content/{locale}/*.md + *.json
```

## Component Map (41 TS/TSX files, ~2037 lines)

### Server Components (14)
| Component | Location | Purpose |
|-----------|----------|---------|
| LocaleLayout | `src/app/[locale]/layout.tsx` | Locale wrapper, RTL, providers |
| Page (home) | `src/app/[locale]/page.tsx` | Hero + featured projects |
| ProjectsPage | `src/app/[locale]/projects/page.tsx` | Project listing |
| ProjectDetailPage | `src/app/[locale]/projects/[id]/page.tsx` | Single project view |
| AboutPage | `src/app/[locale]/about/page.tsx` | About markdown content |
| ContactPage | `src/app/[locale]/contact/page.tsx` | Contact form + social links |
| Button | `src/components/ui/Button.tsx` | Reusable button (no hooks) |
| Container | `src/components/ui/Container.tsx` | Layout wrapper |
| Icon | `src/components/ui/Icon.tsx` | SVG icons (hardcoded paths) |
| ProjectLink | `src/components/ui/ProjectLink.tsx` | Project action links |
| ProjectCard | `src/components/sections/ProjectCard.tsx` | Project summary card |
| TerminalCard | `src/components/sections/TerminalCard.tsx` | Terminal-style hero card |
| SkipToContent | `src/components/ui/SkipToContent.tsx` | A11y skip link (anchor target empty — a11y gap) |
| Icons | `src/components/ui/icons.ts` | Shared SVG icon components |

### Client Components (9)
| Component | Location | Hooks Used |
|-----------|----------|------------|
| Providers | `src/app/providers.tsx` | custom ThemeContext |
| ThemeToggle | `src/components/ui/ThemeToggle.tsx` | useMounted, useContext (ThemeContext) |
| SiteHeader | `src/components/sections/SiteHeader.tsx` | useState, usePathname |
| DesktopNavigation | `src/components/sections/DesktopNavigation.tsx` | usePathname |
| MobileNavigation | `src/components/sections/MobileNavigation.tsx` | usePathname |
| LanguageSwitcher | `src/components/sections/LanguageSwitcher.tsx` | useState, useRouter |
| ProjectsList | `src/components/sections/ProjectsList.tsx` | useProjectFilter |
| ContactForm | `src/components/sections/ContactForm.tsx` | useContactForm |
| MarkdownContent | `src/components/ui/MarkdownContent.tsx` | react-markdown works in RSC — server component is correct, no `'use client'` needed |

## Service Layer
```
src/services/projectService.ts (plain exported functions: getAllProjects, getFeaturedProjects, getProjectById)
    ↓ uses
src/lib/content.ts (file system reads)
    ↓ reads
content/{locale}/projects.json
content/{locale}/*.md
```

**Issue:** ~~`projects/[id]/page.tsx` bypasses ProjectService~~ — **RESOLVED**: the page calls `getProjectById` (`projects/[id]/page.tsx:23`).

## Data Flow (Page Render)
```
1. Next.js triggers server component (e.g., [locale]/page.tsx)
2. Component calls `getFeaturedProjects(locale)` (service function)
3. Service function → content.ts → fs.readFileSync(projects.json)
4. content.ts applies English fallback if locale file missing
5. Component dynamically imports messages/{locale}.json
6. Component passes translations + project data as props to client children
```

## Internationalization Architecture
```
src/i18n/
├── config.ts         # locales[], defaultLocale, rtlLocales, isRTL(), parseLocale(), isLocale()
├── request.ts        # getRequestConfig for next-intl server
└── navigation.ts     # getLocalizedHref(), buildLocalePath(), getProjectHref() helpers
```

**Static vs SSR i18n:**
- SSR: `NextIntlClientProvider` wraps pages, `getTranslations()` available
- Static: Provider omitted (avoid `headers()`), pages import messages JSON directly

## Styling Architecture
- **Tailwind CSS v4** with `@tailwindcss/typography` plugin
- **Brand colors:** `brand-500` (primary) through `brand-950` in `tailwind.config.js`
- **RTL support:** ~127 lines of manual CSS overrides in `globals.css:86-212` for Arabic
- **Dark mode:** `class` strategy via custom ThemeContext (`src/app/providers.tsx`), `dark:` Tailwind prefix
- **Fonts:** Geist Sans/Mono (CDN loaded — workaround for Turbopack bug)

## Type System
```
src/types/
└── content.ts    # ContentFrontmatter, ContentData, Project, ContactFormData, NavLink, ProjectFilterTranslations
```

**Issue:** ~~`types/project.ts` exports are never imported anywhere. `NavLink` interface duplicated~~ — **RESOLVED**: `types/project.ts` removed; `NavLink` now lives in `types/content.ts:31` and is shared.

## State Management
No global state library. Local state patterns:
- `useState` for UI state (menu open, selected tech filter, form fields)
- `useMounted` custom hook for hydration safety
- `useProjectFilter` for derived filtered project list
- `useContactForm` for form validation + submission

## API Layer
```
src/api/contact/route.ts  →  POST handler (validates + sends via Resend with escaping)
```

**Issue:** handler is unreachable — it lives in `src/api/`, not `src/app/api/`, so it 404s in every mode (SSR and static).

## Technical Debt Summary

### Bugs (High Priority) — all fixed
| Bug | File | Status |
|-----|------|--------|
| `generateMetaData` typo (should be `generateMetadata`) | `src/app/[locale]/page.tsx` | ✅ FIXED — `generateMetadata` exists at `page.tsx:21` |
| `openGraph.url: siteConfig.name` (should be `.url`) | `src/app/[locale]/page.tsx` | ✅ FIXED — `openGraph.url` = `siteConfig.url` (`metadata.ts:41`) |
| CSS `md:py24` missing hyphen | `src/app/[locale]/page.tsx` | ✅ FIXED — now `md:py-12` |
| `"Contact-Type"` header typo (should be `Content-Type`) | `src/hooks/useContactForm.ts` | ✅ FIXED — `"Content-Type"` |
| Broken CSS class `text-gray-900dar` | `src/components/sections/ContactForm.tsx` | ✅ FIXED — class removed |
| SVG path `M19 91-7` typo | `src/components/sections/LanguageSwitcher.tsx` | ✅ FIXED — `M19 9l-7 7-7-7` |
| Home markdown `/about` link not locale-prefixed | `content/en/home.md` | ✅ FIXED — links are locale-prefixed |
| Projects page reads `messages?.home` instead of `messages?.projects` | `projects/page.tsx` | ✅ FIXED — reads `messages.projects` |

Also fixed in the Aug 2026 refactor: HTML injection (B1), `mb2` typo (B2), OG image path (B3), missing OG locales (B4), static failure message (B5), `as Locale` casts, `defaultMetadata` dead config, clipboard unhandled promise.

### Dead Code (All removed)
| File | Status |
|------|--------|
| `src/app/[locale]/generateStaticParams.ts` | **REMOVED** |
| `src/i18n/guards.ts` | **REMOVED** |
| `src/types/project.ts` | **REMOVED** |
| `src/lib/content.ts` → `getAllContent()` | **REMOVED** |
| `src/types/index.ts` | **REMOVED** (SocialLink moved to `src/data/socialLinks.ts`) |
| `src/messages/images.json` | **REMOVED** |
| `src/middleware.ts.disabled` | **REMOVED** (file deleted) |

### Remaining Duplications
| Duplication | Locations |
|-------------|-----------|
| `generateStaticParams` logic | `layout.tsx` (duplication resolved — extra file removed) |
| `NavLink` interface | `DesktopNavigation.tsx` + `MobileNavigation.tsx` — **fixed**: shared via `types/content.ts:31` |
| Social URLs | `metadata.ts` (`siteConfig.social`) + `socialLinks.ts` |
| RTL font-family CSS | Repeated ~10 times in `globals.css` |
| Translation loading pattern | `page.tsx`, `projects/page.tsx`, `about/page.tsx` |

### Code Style Issues
- Multiple typos in comments across files (`translaiton`, `Feactured`, `sepecifi`, `dosn't`)
- `any` type used in page.tsx for translations — RESOLVED (pages use typed translations interfaces)
- `languageInfo` interface uses lowercase `l` (violates PascalCase convention — REMOVED)
- `isValidateLocale` function name awkward (should be `isValidLocale` — REMOVED)
- `siteConfig.url` vs `siteConfig.name` confusion in metadata

### Not in Inventory Above
- `src/app/(index)/` — root group: `layout.tsx` + `page.tsx` (redirect to default locale)
- `src/app/metadata.ts` — `buildPageMetadata`, `siteConfig`
- `src/app/robots.ts`, `src/app/sitemap.ts` — SEO files
- `src/data/socialLinks.ts` — social link data
