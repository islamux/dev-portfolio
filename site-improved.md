# Personal Portfolio Site - Build Plan (Improved)

**Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS  
**Package Manager:** pnpm  
**Target Deployment:** Vercel (primary), Netlify (secondary)

---

## Quick Reference

### Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://yoursite.com
CONTACT_EMAIL=fathi733@gmail.com
GITHUB_TOKEN=ghp_xxx  # for projects importer (optional)
RECAPTCHA_SECRET_KEY=xxx  # optional spam protection
```

### Git Strategy

- **Branches:** `main` (production), `dev` (staging), `feature/*`
- **Commits:** Conventional commits (`feat:`, `fix:`, `docs:`)
- **PRs:** Require CI passing + 1 approval
- **Protection:** Lock `main` branch

### Performance Budget

- Lighthouse Performance: >90
- First Contentful Paint: <1.5s
- Total Bundle: <200KB gzipped
- Per-route: <50KB

---

## Phase 0 — Discovery & Content (Est. 1-2 days)

**Goal:** Gather all content, define site structure, prepare translations.

### Tasks

1. **Collect content:**

   - Communities: [linuxac.org](https://www.linuxac.org/), [aosus.org](https://aosus.org/)
   - Email: fathi733@gmail.com
   - Social: [@islamux](https://twitter.com/islamux), [GitHub](https://github.com/islamux), [GitLab](https://gitlab.com/islamux), [LinkedIn](https://www.linkedin.com/in/fathi-alqadasi-7893471b/)
   - Platforms: [Vercel](https://vercel.com/islamuxs-projects), [Netlify](https://app.netlify.com/teams/fathi733/projects)

2. **Write microcopy** for pages (1-2 paragraphs each):

   - Home hero (who you are, what you do)
   - About (background + 3-5 bullet facts)
   - Projects (3-5 featured projects with descriptions)
   - Contact (preferred contact method)

3. **Languages:** English (primary), Français, العربية (RTL)

   - Translate core pages to all 3 languages
   - Store in `content/{en,fr,ar}/` folders

4. **Decide blog scope:** Now or later? (If later, add hooks for it)

### Acceptance Criteria

- [ ] Content files in `/content` folder (Markdown or JSON)
- [ ] Sitemap outline: Home, About, Projects, Blog (optional), Contact, Uses/OSS
- [ ] Translations ready for 3 languages

---

## Phase 1 — Repo + Baseline (Est. 2-3 days)

**Goal:** Clean, type-safe starter with dev tooling.

### Tasks

1. **Initialize repo:**

   ```bash
   npx create-next-app@latest dev-portfolio --typescript --app --tailwind --pnpm
   cd dev-portfolio
   git init
   git remote add origin https://github.com/islamux/dev-portfolio.git
   git remote add gitlab https://gitlab.com/islamux/dev-portfolio.git
   ```

2. **Configure TypeScript strict mode:**

   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

3. **Setup Tailwind:**

   ```bash
   pnpm add -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Add dev tools:**

   ```bash
   pnpm add -D eslint prettier eslint-config-prettier husky lint-staged
   npx husky init
   ```

5. **EditorConfig:**

   ```ini
   # .editorconfig
   root = true
   [*]
   indent_style = space
   indent_size = 2
   end_of_line = lf
   charset = utf-8
   trim_trailing_whitespace = true
   insert_final_newline = true
   ```

6. **CI skeleton:**

   ```yaml
   # .github/workflows/ci.yml
   name: CI
   on: [push, pull_request]
   jobs:
     lint:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - run: pnpm install
         - run: pnpm lint
         - run: pnpm typecheck
   ```

7. **Package scripts:**
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint",
       "typecheck": "tsc --noEmit",
       "format": "prettier --write ."
     }
   }
   ```

### File Structure

```
/app
  /layout.tsx
  /page.tsx              # home
  /[locale]              # i18n routing
    /layout.tsx
    /page.tsx
    /about/page.tsx
    /projects/page.tsx
    /contact/page.tsx
/src
  /components
    /ui                  # primitives (Button, Card)
    /sections            # page sections (Hero, ProjectList)
  /lib
    /content.ts          # content loaders
  /hooks
    /use-theme.ts
  /types
    /content.d.ts
/messages                # i18n
  en.json
  fr.json
  ar.json
/content
  /en
    home.md
    about.md
  /fr
    home.md
    about.md
  /ar
    home.md
    about.md
  projects.json
/public
  /images
tailwind.config.js
tsconfig.json
.eslintrc.js
prettier.config.js
.editorconfig
README.md
```

### Acceptance Criteria

- [ ] `pnpm dev` runs with no TypeScript errors
- [ ] Tailwind styles visible on homepage
- [ ] CI runs lint + typecheck
- [ ] README.md with project overview

### Common Pitfalls

- **Issue:** `pnpm` vs `npm` lock file conflicts  
  **Fix:** Delete `package-lock.json`, use only `pnpm-lock.yaml`
- **Issue:** ESLint conflicts with Prettier  
  **Fix:** Install `eslint-config-prettier` and add to `.eslintrc.js`

---

## Phase 2 — Layout & Design System (Est. 3-4 days)

**Goal:** Global layout, header/footer, responsive nav, dark mode, typography.

### Tasks

1. **Create base components** (`src/components/ui/`):

   - `Container.tsx` - max-width wrapper
   - `Button.tsx` - primary/secondary variants
   - `Icon.tsx` - SVG icon wrapper

2. **Site header** (`src/components/sections/SiteHeader.tsx`):

   - Logo + nav links
   - Language switcher
   - Dark mode toggle
   - Mobile hamburger menu (<768px)

3. **Site footer** (`src/components/sections/SiteFooter.tsx`):

   - Social links (Twitter, GitHub, GitLab, LinkedIn)
   - Copyright + year

4. **Tailwind config** - design tokens:

   ```js
   // tailwind.config.js
   module.exports = {
     darkMode: "class",
     theme: {
       extend: {
         colors: {
           brand: {
             50: "#f0f9ff",
             500: "#0ea5e9",
             900: "#0c4a6e",
           },
         },
         fontFamily: {
           sans: ["Inter", "system-ui", "sans-serif"],
         },
       },
     },
   };
   ```

5. **Dark mode** with `next-themes`:

   ```bash
   pnpm add next-themes
   ```

   ```tsx
   // app/providers.tsx
   "use client";
   import { ThemeProvider } from "next-themes";
   export function Providers({ children }) {
     return <ThemeProvider attribute="class">{children}</ThemeProvider>;
   }
   ```

6. **Accessibility:**
   - Skip-to-content link
   - Keyboard focus styles (`:focus-visible`)
   - ARIA labels for nav

### Acceptance Criteria

- [ ] Header/footer on all pages
- [ ] Responsive at breakpoints: 640px, 768px, 1024px, 1280px
- [ ] Dark mode toggles and persists (localStorage)
- [ ] Keyboard nav works (Tab, Enter, Escape)

### Checkpoints

1. [ ] Header renders with logo + nav items
2. [ ] Dark mode toggle works (no flash on reload)
3. [ ] Mobile menu opens/closes on hamburger click
4. [ ] Footer shows all social links with correct URLs

### Common Pitfalls

- **Issue:** Dark mode flash on page load  
  **Fix:** Use `next-themes` with `suppressHydrationWarning` on `<html>`
- **Issue:** Mobile menu doesn't close on route change  
  **Fix:** Listen to `usePathname()` and close menu in `useEffect`

---

## Phase 3 — Pages & Content (Est. 3-4 days)

**Goal:** Wire pages to content files, create project cards, contact form.

### Tasks

1. **Content loader** (`src/lib/content.ts`):

   ```typescript
   import fs from "fs";
   import path from "path";
   import matter from "gray-matter";

   export function getContentBySlug(slug: string, locale: string) {
     const filePath = path.join(process.cwd(), "content", locale, `${slug}.md`);
     const fileContents = fs.readFileSync(filePath, "utf8");
     const { data, content } = matter(fileContents);
     return { frontmatter: data, content };
   }
   ```

   Install: `pnpm add gray-matter`

2. **Implement pages:**

   - **Home** (`app/[locale]/page.tsx`): Hero + CTA
   - **About** (`app/[locale]/about/page.tsx`): Bio + timeline
   - **Projects** (`app/[locale]/projects/page.tsx`): Grid of project cards
   - **Contact** (`app/[locale]/contact/page.tsx`): Email + form

3. **Project card** (`src/components/sections/ProjectCard.tsx`):

   - Project name, description, tech stack
   - Links: GitHub, GitLab, Live Demo
   - Hover effects

4. **Projects data** (`content/projects.json`):

   ```json
   [
     {
       "id": "project-1",
       "name": "Athkarix",
       "description": "Islamic prayer reminders app",
       "tech": ["Flutter", "Dart"],
       "github": "https://github.com/islamux/athkarix",
       "demo": "https://athkarix.netlify.app"
     }
   ]
   ```

5. **Contact form:**
   - Simple `mailto:` fallback or API route
   - Fields: Name, Email, Message
   - Honeypot spam protection

### Acceptance Criteria

- [ ] All pages load content from `/content`
- [ ] Projects page lists projects with live links
- [ ] Contact form submits (mailto or API)
- [ ] Semantic HTML (`<header>`, `<main>`, `<footer>`)

### SEO & Metadata

```typescript
// app/[locale]/page.tsx
export const metadata = {
  title: "Fathi Al-Qadasi - Developer Portfolio",
  description:
    "Full-stack developer specializing in Next.js, TypeScript, and Flutter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yoursite.com",
    siteName: "Fathi Al-Qadasi Portfolio",
  },
};
```

### Common Pitfalls

- **Issue:** `fs` not available in client components  
  **Fix:** Use server components or move to API routes
- **Issue:** Gray-matter import errors  
  **Fix:** Ensure proper ESM/CommonJS config in `next.config.js`

---

## Phase 4 — i18n & RTL (Est. 2-3 days)

**Goal:** Full site in EN/FR/AR with RTL support for Arabic.

### Tasks

1. **Install next-intl:**

   ```bash
   pnpm add next-intl
   ```

2. **Setup middleware:**

   ```typescript
   // src/middleware.ts
   import createMiddleware from "next-intl/middleware";

   export default createMiddleware({
     locales: ["en", "fr", "ar"],
     defaultLocale: "en",
   });

   export const config = {
     matcher: ["/((?!api|_next|.*\\..*).*)"],
   };
   ```

3. **Translation files** (`/messages/{en,fr,ar}.json`):

   ```json
   {
     "nav": {
       "home": "Home",
       "about": "About",
       "projects": "Projects",
       "contact": "Contact"
     }
   }
   ```

4. **Language switcher:**

   ```tsx
   "use client";
   import { useLocale } from "next-intl";
   import { useRouter } from "next/navigation";

   export function LanguageSwitcher() {
     const locale = useLocale();
     const router = useRouter();
     // ... switcher logic
   }
   ```

5. **RTL support:**

   ```tsx
   // app/[locale]/layout.tsx
   export default function LocaleLayout({ children, params: { locale } }) {
     return (
       <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
         {children}
       </html>
     );
   }
   ```

6. **Arabic web font:**
   ```tsx
   // app/layout.tsx
   import { Tajawal } from "next/font/google";
   const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "700"] });
   ```

### Acceptance Criteria

- [ ] `/en`, `/fr`, `/ar` routes work
- [ ] Content changes based on locale
- [ ] RTL layout for Arabic (mirrored padding/margins)
- [ ] Arabic font displays correctly

### Common Pitfalls

- **Issue:** RTL breaks Tailwind flex layouts  
  **Fix:** Use `flex-row-reverse` or logical properties (`ps-4` instead of `pl-4`)
- **Issue:** Language switcher doesn't preserve path  
  **Fix:** Include current pathname in locale switch: `router.push(pathname, { locale: newLocale })`

---

## Phase 5 — Dynamic Features & API (Est. 2-3 days)

**Goal:** Projects importer, contact API, /uses page.

### Tasks

1. **GitHub projects importer** (optional):

   ```typescript
   // scripts/import-projects.ts
   import { Octokit } from "@octokit/rest";

   const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
   // Fetch pinned repos and save to projects.json
   ```

2. **Contact form API route:**

   ```typescript
   // app/api/contact/route.ts
   import { NextResponse } from "next/server";

   export async function POST(request: Request) {
     const { name, email, message } = await request.json();
     // Validate + honeypot check
     // Send email via SendGrid/Resend or save to DB
     return NextResponse.json({ success: true });
   }
   ```

3. **Spam protection:**

   - Hidden honeypot field
   - Rate limiting with upstash/redis (optional)
   - reCAPTCHA v3 (optional)

4. **/uses page:**

   - List tools, dotfiles, hardware
   - Link to GitHub dotfiles repo

5. **Project detail pages** (optional):
   ```typescript
   // app/[locale]/projects/[slug]/page.tsx
   export async function generateStaticParams() {
     // Generate paths from projects.json
   }
   ```

### Acceptance Criteria

- [ ] Projects list updates from `projects.json`
- [ ] Contact API accepts POST, validates input
- [ ] `/uses` page renders with links
- [ ] No exposed API keys (use env vars)

### Common Pitfalls

- **Issue:** GitHub API rate limiting  
  **Fix:** Use personal access token, cache responses
- **Issue:** Contact form spam  
  **Fix:** Add honeypot + time-based validation (min 2s form fill)

---

## Phase 6 — PWA, Performance & SEO (Est. 2-3 days)

**Goal:** Fast, offline-capable, discoverable site.

### Tasks

1. **PWA setup:**

   ```bash
   pnpm add next-pwa
   ```

   ```js
   // next.config.js
   const withPWA = require("next-pwa")({
     dest: "public",
     disable: process.env.NODE_ENV === "development",
   });
   module.exports = withPWA({});
   ```

2. **Manifest:**

   ```json
   // public/manifest.json
   {
     "name": "Fathi Al-Qadasi Portfolio",
     "short_name": "Portfolio",
     "theme_color": "#0ea5e9",
     "background_color": "#ffffff",
     "display": "standalone",
     "icons": [...]
   }
   ```

3. **Image optimization:**

   - Use `next/image` everywhere
   - Add `blur-data-url` for placeholders
   - Optimize images with `sharp`: `pnpm add sharp`

4. **Lighthouse audit:**

   - Run: `pnpm build && npx lighthouse http://localhost:3000`
   - Fix issues (accessibility, performance, SEO)

5. **Sitemap & robots:**
   ```typescript
   // app/sitemap.ts
   export default function sitemap() {
     return [
       { url: "https://yoursite.com", lastModified: new Date() },
       { url: "https://yoursite.com/about", lastModified: new Date() },
       // ...
     ];
   }
   ```

### Acceptance Criteria

- [ ] PWA install prompt works
- [ ] Lighthouse scores: Performance >90, Accessibility >95
- [ ] Sitemap.xml generated
- [ ] Images use `next/image` with proper sizing

### Performance Checklist

- [ ] Bundle analyzer: `pnpm add -D @next/bundle-analyzer`
- [ ] Tree-shake unused code
- [ ] Lazy load heavy components: `dynamic(() => import('...'))`
- [ ] Preload critical fonts

---

## Phase 7 — Tests, CI/CD, Deploy (Est. 3-4 days)

**Goal:** Automated testing + production deployment.

### Tasks

1. **Unit tests:**

   ```bash
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```

   ```typescript
   // src/components/ui/Button.test.tsx
   import { render, screen } from "@testing-library/react";
   import { Button } from "./Button";

   test("renders button with text", () => {
     render(<Button>Click me</Button>);
     expect(screen.getByText("Click me")).toBeInTheDocument();
   });
   ```

2. **E2E tests:**

   ```bash
   pnpm add -D @playwright/test
   npx playwright install
   ```

   ```typescript
   // tests/navigation.spec.ts
   import { test, expect } from "@playwright/test";

   test("can navigate to all pages", async ({ page }) => {
     await page.goto("/");
     await page.click('a[href="/about"]');
     await expect(page).toHaveURL(/.*about/);
   });
   ```

3. **CI pipeline:**

   ```yaml
   # .github/workflows/ci.yml
   name: CI
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - run: pnpm install
         - run: pnpm lint
         - run: pnpm typecheck
         - run: pnpm test
         - run: pnpm build
   ```

4. **Vercel deployment:**

   - Connect GitHub repo on [vercel.com](https://vercel.com)
   - Set environment variables
   - Auto-deploy on push to `main`

5. **Netlify (secondary):**

   - Deploy `dev` branch for previews
   - Or skip if not needed

6. **Branch protection:**
   - Require PR reviews
   - Require CI to pass
   - No direct commits to `main`

### Acceptance Criteria

- [ ] Unit tests pass: `pnpm test`
- [ ] E2E tests pass: `pnpm playwright test`
- [ ] CI green on all PRs
- [ ] Vercel auto-deploys on merge to `main`

### Test Examples

```bash
# Record E2E test
npx playwright codegen http://localhost:3000

# Run tests in UI mode
pnpm playwright test --ui

# Generate test report
pnpm playwright show-report
```

---

## Phase 8 — Launch & Maintenance (Est. 1-2 days)

**Goal:** Public launch with monitoring and docs.

### Tasks

1. **Analytics (privacy-friendly):**

   ```bash
   pnpm add @vercel/analytics
   ```

   ```tsx
   // app/layout.tsx
   import { Analytics } from "@vercel/analytics/react";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

   **Alternative:** Plausible, Umami (self-hosted)

2. **LICENSE:**

   ```bash
   # Add GNU GPL v3
   curl https://www.gnu.org/licenses/gpl-3.0.txt > LICENSE
   ```

3. **CONTRIBUTING.md:**

   - How to run locally
   - How to submit PRs
   - Code style guide

4. **README.md update:**

   - Project overview
   - Environment variables
   - Deployment steps
   - Scripts reference

5. **Maintenance plan:**

   - Monthly: `pnpm update --interactive --latest`
   - Quarterly: Dependency audit (`pnpm audit`)
   - Yearly: Major framework upgrades

6. **Backups:**
   - Content in git (already backed up)
   - Database backups if using DB (N/A for static)

### Acceptance Criteria

- [ ] Live on custom domain via Vercel
- [ ] Analytics tracking pageviews
- [ ] README complete with setup instructions
- [ ] LICENSE file added

### Launch Checklist

- [ ] Domain configured and DNS propagated
- [ ] SSL certificate active (auto via Vercel)
- [ ] All social links tested
- [ ] Contact form tested end-to-end
- [ ] SEO meta tags verified (Twitter card, OG image)
- [ ] Announce on Twitter/LinkedIn

---

## Best Practices Summary

### Architecture

- **App Router:** Use server components by default, `'use client'` only when needed
- **Composition:** Small, single-responsibility components with typed props
- **Types:** Everything in `src/types`, no `any` types
- **Design tokens:** Colors/spacing in `tailwind.config.js`

### Code Quality

- **ESLint + Prettier:** Enforce on pre-commit with Husky
- **Conventional commits:** `feat:`, `fix:`, `docs:`, `refactor:`
- **Component naming:** `ui/*` for primitives, `sections/*` for page sections
- **Import order:** External → Internal → Relative

### Performance

- **Server components:** Fetch data on server when possible
- **Image optimization:** Always use `next/image`
- **Code splitting:** Dynamic imports for heavy components
- **Bundle analysis:** Regular checks with `@next/bundle-analyzer`

### Accessibility

- **Semantic HTML:** `<header>`, `<nav>`, `<main>`, `<footer>`
- **Keyboard nav:** Tab, Enter, Escape support
- **ARIA labels:** For icons and interactive elements
- **Focus styles:** Clear `:focus-visible` indicators

### Security

- **Env vars:** Never commit secrets, use `.env.local`
- **API routes:** Validate all inputs, rate limit
- **Dependencies:** Regular audits, use Renovate/Dependabot

---

## Quick Phase Checklist

- [ ] **Phase 0:** Content files in `/content`, 3 languages ready
- [ ] **Phase 1:** Next.js + TypeScript + Tailwind + ESLint
- [ ] **Phase 2:** Header/Footer + dark mode + responsive
- [ ] **Phase 3:** Pages + projects list + contact form
- [ ] **Phase 4:** i18n (EN/FR/AR) + RTL
- [ ] **Phase 5:** Projects API + contact API + /uses
- [ ] **Phase 6:** PWA + SEO + Lighthouse >90
- [ ] **Phase 7:** Tests + CI + Vercel deploy
- [ ] **Phase 8:** Analytics + docs + launch

---

## Recommended Tools

### Development

- **VS Code Extensions:** ESLint, Prettier, Tailwind IntelliSense, i18n Ally
- **Browser DevTools:** React DevTools, Lighthouse
- **Testing:** Playwright Test for VS Code

### Deployment

- **Vercel:** Primary hosting (optimal Next.js support)
- **Netlify:** Secondary/preview deployments
- **Cloudflare Pages:** Alternative (if needed)

### Monitoring

- **Vercel Analytics:** Built-in, privacy-friendly
- **Plausible:** Self-hosted alternative
- **Sentry:** Error tracking (optional)

---

## Next Steps

1. **Review this plan** and adjust timeline based on your availability
2. **Create GitHub repo** and initialize with Phase 1
3. **Set up project board** with issues for each phase
4. **Start with Phase 0** - content is foundation
5. **Deploy early** - even a minimal home page to Vercel
6. **Iterate** - don't aim for perfection in first pass

**Questions?** Start with Phase 0 and create content files. Once ready, ping for Phase 1 kickoff guidance!
