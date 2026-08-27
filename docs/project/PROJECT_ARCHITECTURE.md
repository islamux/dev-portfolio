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
│  - Fetch translations from messages/    │
│  - Pass props to Client Components      │
└─────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────┐
│  Client Components (hooks, interactivity)│
│  - ThemeToggle (class strategy)          │
│  - ProjectsList (filtering)            │
│  - ContactForm (form state)            │
│  - SiteHeader (navigation state)       │
└─────────────────────────────────────────┘
      ↓
Data Layer: content/{locale}/*.md + *.json
```

## Component Map (48 TS/TSX files, ~2352 lines)

### Server Components (11)
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
| ProjectCard | `src/components/ui/ProjectCard.tsx` | Project summary card |

### Client Components (9)
| Component | Location | Hooks Used |
|-----------|----------|------------|
| Providers | `src/app/providers.tsx` | React context |
| ThemeToggle | `src/components/ui/ThemeToggle.tsx` | useMounted, useTheme |
| SiteHeader | `src/components/sections/SiteHeader.tsx` | useState, usePathname |
| DesktopNavigation | `src/components/sections/DesktopNavigation.tsx` | usePathname |
| MobileNavigation | `src/components/sections/MobileNavigation.tsx` | usePathname |
| LanguageSwitcher | `src/components/sections/LanguageSwitcher.tsx` | useState, useRouter |
| ProjectsList | `src/components/sections/ProjectsList.tsx` | useProjectFilter |
| ContactForm | `src/components/sections/ContactForm.tsx` | useContactForm |
| MarkdownContent | `src/components/ui/MarkdownContent.tsx` | react-markdown (should be "use client") |

## Service Layer
```
src/services/projectService.ts (plain exported functions: getAllProjects, getFeaturedProjects, getProjectById)
    ↓ uses
src/lib/content.ts (file system reads)
    ↓ reads
content/{locale}/projects.json
content/{locale}/*.md
```

**Static mode:** Pages call service functions directly; `[id]/page.tsx` now uses `getProjectById` (no fs duplication).

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
- **RTL support:** ~200 lines of manual CSS overrides in `globals.css` for Arabic
- **Dark mode:** `class` strategy, `dark:` Tailwind prefix
- **Fonts:** Geist Sans/Mono (CDN loaded — workaround for Turbopack bug)

## Type System
```
src/types/
└── content.ts    # ContentFrontmatter, ContentData, Project, ContactFormData, NavLink, ProjectFilterTranslations
```

**Issue:** `types/project.ts` exports are never imported anywhere. `NavLink` interface duplicated in DesktopNavigation and MobileNavigation instead of being in types.

## State Management
No global state library. Local state patterns:
- `useState` for UI state (menu open, selected tech filter, form fields)
- `useMounted` custom hook for hydration safety
- `useProjectFilter` for derived filtered project list
- `useContactForm` for form validation + submission

## API Layer
```
src/api/contact/route.ts  →  POST handler (validates + logs only)
```

**Issue:** Contact form is non-functional — no email sending implemented. API routes don't work in static export mode.

## Technical Debt Summary

### Bugs (All fixed — Aug 2026 refactor)
All originally identified bugs have been resolved: HTML injection (B1), `mb2` typo (B2), OG image path (B3), missing OG locales (B4), static failure message (B5), `as Locale` casts, `defaultMetadata` dead config, clipboard unhandled promise, CSS typos, `generateMetaData` typo, `messages?.home` wrong key.

### Dead Code (All removed)
| File | Status |
|------|--------|
| `src/app/[locale]/generateStaticParams.ts` | **REMOVED** |
| `src/i18n/guards.ts` | **REMOVED** |
| `src/types/project.ts` | **REMOVED** |
| `src/types/index.ts` | **REMOVED** (SocialLink moved to `src/data/socialLinks.ts`) |
| `src/messages/images.json` | **REMOVED** |
| `src/middleware.ts.disabled` | Disabled, not active |

### Remaining Duplications
| Duplication | Locations |
|-------------|-----------|
| `NavLink` interface | `DesktopNavigation.tsx` + `MobileNavigation.tsx` (not shared) |
| RTL font-family CSS | Repeated ~10 times in `globals.css` |
| Translation loading pattern | `page.tsx`, `projects/page.tsx`, `about/page.tsx` (use `import messages` directly) |
