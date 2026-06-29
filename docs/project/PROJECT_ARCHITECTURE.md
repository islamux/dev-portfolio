# Project Architecture - Dev Portfolio

## High-Level Architecture
```
Client Browser
      ↓
Next.js App Router (locale-aware routing)
      ↓
┌─────────────────────────────────────────┐
│  Server Components (pages, layout)      │
│  - Load content via ProjectService      │
│  - Fetch translations from messages/    │
│  - Pass props to Client Components      │
└─────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────┐
│  Client Components (hooks, interactivity)│
│  - ThemeToggle (next-themes)            │
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
| Providers | `src/app/providers.tsx` | next-themes |
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
src/services/projectService.ts (ProjectService class)
    ↓ uses
src/lib/content.ts (file system reads)
    ↓ reads
content/{locale}/projects.json
content/{locale}/*.md
```

**Issue:** `projects/[id]/page.tsx` bypasses ProjectService and reads JSON directly with `fs.readFileSync`.

## Data Flow (Page Render)
```
1. Next.js triggers server component (e.g., [locale]/page.tsx)
2. Component calls ProjectService.getFeaturedProjects(locale)
3. ProjectService → content.ts → fs.readFileSync(projects.json)
4. content.ts applies English fallback if locale file missing
5. Component dynamically imports messages/{locale}.json
6. Component passes translations + project data as props to client children
```

## Internationalization Architecture
```
src/i18n/
├── config.ts         # locales[], defaultLocale, rtlLocales, isRTL()
├── request.ts        # getRequestConfig for next-intl server
├── navigation.ts     # Link, useRouter, getLocalizedHref() helpers
└── guards.ts         # isValidateLocale() — REMOVED (was dead code)
```

**Static vs SSR i18n:**
- SSR: `NextIntlClientProvider` wraps pages, `getTranslations()` available
- Static: Provider omitted (avoid `headers()`), pages import messages JSON directly

**Gap:** `useTranslations` hook is never used — all translations accessed as plain objects.

## Styling Architecture
- **Tailwind CSS v4** with `@tailwindcss/typography` plugin
- **Brand colors:** `brand-500` (primary) through `brand-950` in `tailwind.config.js`
- **RTL support:** ~200 lines of manual CSS overrides in `globals.css` for Arabic
- **Dark mode:** `class` strategy via next-themes, `dark:` Tailwind prefix
- **Fonts:** Geist Sans/Mono (CDN loaded — workaround for Turbopack bug)

## Type System
```
src/types/
├── content.ts    # ContentFrontmatter, ContentData, Project, ContactFormData
└── index.ts      # Only exports SocialLink (barrel incomplete)
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

### Bugs (High Priority)
| Bug | File | Line |
|-----|------|------|
| `generateMetaData` typo (should be `generateMetadata`) | `src/app/[locale]/page.tsx` | — |
| `openGraph.url: siteConfig.name` (should be `.url`) | `src/app/[locale]/page.tsx` | 32 |
| CSS `md:py24` missing hyphen | `src/app/[locale]/page.tsx` | 97 |
| `"Contact-Type"` header typo (should be `Content-Type`) | `src/hooks/useContactForm.ts` | 39 |
| Broken CSS class `text-gray-900dar` | `src/components/sections/ContactForm.tsx` | 38 |
| SVG path `M19 91-7` typo | `src/components/sections/LanguageSwitcher.tsx` | 84 |
| Home markdown `/about` link not locale-prefixed | `content/en/home.md` | — |
| Projects page reads `messages?.home` instead of `messages?.projects` | `projects/page.tsx` | — |

### Dead Code (Some Now Removed)
| File | Status |
|------|--------|
| `src/app/[locale]/generateStaticParams.ts` | **REMOVED** |
| `src/i18n/guards.ts` | **REMOVED** |
| `src/types/project.ts` | **REMOVED** |
| `src/lib/content.ts` → `getAllContent()` | Still present, never called |
| `src/messages/images.json` | **REMOVED** |
| `src/middleware.ts.disabled` | Disabled, not active |

### Duplications
| Duplication | Locations |
|-------------|-----------|
| `generateStaticParams` logic | `layout.tsx` (duplication resolved — extra file removed) |
| `NavLink` interface | `DesktopNavigation.tsx` + `MobileNavigation.tsx` |
| Social URLs | `metadata.ts` (`siteConfig.social`) + `socialLinks.ts` |
| RTL font-family CSS | Repeated ~10 times in `globals.css` |
| Translation loading pattern | `page.tsx`, `projects/page.tsx`, `about/page.tsx` |

### Code Style Issues
- Multiple typos in comments across files (`translaiton`, `Feactured`, `sepecifi`, `dosn't`)
- `any` type used in page.tsx for translations
- `languageInfo` interface uses lowercase `l` (violates PascalCase convention — REMOVED)
- `isValidateLocale` function name awkward (should be `isValidLocale` — REMOVED)
- `siteConfig.url` vs `siteConfig.name` confusion in metadata
