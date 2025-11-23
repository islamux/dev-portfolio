# Personal Portfolio Site - Build Plan (Improved)

> **For Junior Developers:** This is a comprehensive, senior-mentored guide to building your first production-ready portfolio. Don't rush—mastering the fundamentals here will make you a better developer.

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

## 🎓 Junior Developer Learning Path

Before diving into phases, understand this roadmap as a junior:

### Week 1-2: Foundation (Before Phase 0)

**Learn these concepts first:**

1.  **Next.js App Router Basics**

    - 📺 [Official Next.js Tutorial](https://nextjs.org/learn)
    - 📖 Read: [App Router vs Pages Router](https://nextjs.org/docs/app)
    - ⏱️ Time: 3-4 hours
    - **Why:** You need to understand file-based routing before building

2.  **TypeScript Fundamentals**

    - 📺 [TypeScript for Beginners](https://www.totaltypescript.com/tutorials)
    - Practice: Type simple objects, arrays, functions
    - ⏱️ Time: 4-5 hours
    - **Why:** Prevents runtime bugs, gives autocomplete superpowers

3.  **Tailwind CSS Basics**
    - 📺 [Tailwind CSS Crash Course](https://tailwindcss.com/docs/utility-first)
    - Build: One landing page with utility classes
    - ⏱️ Time: 2-3 hours
    - **Why:** You'll write CSS 10x faster once you know the patterns

### Daily Learning Habits

- **Morning:** Read 1 Next.js doc page while having coffee
- **Coding:** Work 2-3 hours on your portfolio (focus > speed)
- **Evening:** Watch one 10-min tutorial or scroll through good portfolios for inspiration
- **Weekly:** Code review your own work from 7 days ago — you'll spot improvements!

### When You're Stuck (Expected!)

1.  **Read the error message** carefully (90% of errors tell you exactly what's wrong)
2.  **Google the exact error** with "Next.js" prefix
3.  **Check official docs** — they're actually very good
4.  **Ask in Discord/forums** with code snippet + error
5.  **Take a break** — fresh eyes solve problems faster

---

## 💎 Portfolio Best Practices (What Makes Yours Stand Out)

### Content Principles

1.  **Show, Don't Tell**

    - ❌ "I'm passionate about coding"
    - ✅ "Built 5 open-source projects with 200+ GitHub stars"

2.  **Quantify Your Impact**

    - ❌ "Improved website performance"
    - ✅ "Reduced load time from 4s → 1.2s (70% faster)"

3.  **Tell Stories**
    - Each project = Problem → Solution → Result
    - Example: "Users struggled with X, so I built Y, which helped 100+ people"

### Design Principles (Even for Developers)

1.  **Simplicity > Complexity**

    - White space is your friend
    - 2-3 colors max (primary + neutral + accent)
    - One font family (maybe two if you're confident)

2.  **Hierarchy**

    ```
    Hero (biggest) → Projects (medium) → Footer (small)
    Text sizes: 48px → 24px → 16px (scale of 1.5x-2x)
    ```

3.  **Consistency**
    - Same button style everywhere
    - Same card shadow pattern
    - Same spacing (use Tailwind's 4, 8, 12, 16 pattern)

### Portfolio-Specific Components You'll Need

1.  **Hero Section** - Who you are in 5 seconds
2.  **Tech Stack Visual** - Icons of technologies you use
3.  **Project Cards** - Image + title + tech + links
4.  **Timeline** - Your journey (optional but nice)
5.  **Contact CTA** - Make it easy to reach you

### Inspiration (Study These)

- [Lee Robinson](https://leerob.io) - Simple, fast, clean
- [Brittany Chiang](https://brittanychiang.com) - Great animations
- [Josh Comeau](https://joshwcomeau.com) - Playful interactions
- [awesome-portfolios](https://github.com/emmabostian/developer-portfolios) - 100+ examples

---

## Phase 0 — Discovery & Content (Est. 1-2 days)

**Goal:** Gather all content, define site structure, prepare translations.

### Tasks

1.  **Collect content:**

    - Communities: [linuxac.org](https://www.linuxac.org/), [aosus.org](https://aosus.org/)
    - Email: fathi733@gmail.com
    - Social: [@islamux](https://twitter.com/islamux), [GitHub](https://github.com/islamux), [GitLab](https://gitlab.com/islamux), [LinkedIn](https://www.linkedin.com/in/fathi-alqadasi-7893471b/)
    - Platforms: [Vercel](https://vercel.com/islamuxs-projects), [Netlify](https://app.netlify.com/teams/fathi733/projects)

2.  **Write microcopy** for pages (1-2 paragraphs each):

    - Home hero (who you are, what you do)
    - About (background + 3-5 bullet facts)
    - Projects (3-5 featured projects with descriptions)
    - Contact (preferred contact method)

3.  **Languages:** English (primary), Français, العربية (RTL)

    - Translate core pages to all 3 languages
    - Store in `content/{en,fr,ar}/` folders

4.  **Decide blog scope:** Now or later? (If later, add hooks for it)

### Acceptance Criteria

- [ ] Content files in `/content` folder (Markdown or JSON)
- [ ] Sitemap outline: Home, About, Projects, Blog (optional), Contact, Uses/OSS
- [ ] Translations ready for 3 languages

---

## Phase 1 — Repo + Baseline (Est. 2-3 days)

**Goal:** Clean, type-safe starter with dev tooling.

### Tasks

1.  **Initialize repo:**

    ```bash
    npx create-next-app@latest dev-portfolio --typescript --app --tailwind --pnpm
    cd dev-portfolio
    git init
    git remote add origin https://github.com/islamux/dev-portfolio.git
    git remote add gitlab https://gitlab.com/islamux/dev-portfolio.git
    ```

2.  **Configure TypeScript strict mode:**

    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        "strict": true
      }
    }
    ```

3.  **Setup Tailwind:**

    ```bash
    pnpm add -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

4.  **Add dev tools:**

    ```bash
    pnpm add -D eslint prettier eslint-config-prettier husky lint-staged
    npx husky init
    ```

5.  **EditorConfig:**

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

6.  **CI skeleton:**

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

7.  **Package scripts:**
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
- **Issue:** "Module not found" after installing package  
  **Fix:** Restart dev server (`Ctrl+C`, then `pnpm dev`)

### 🎓 Junior Learning Notes

**Key Concepts to Understand:**

- **Package manager:** Like an app store for code libraries
- **Lock files:** Keep everyone on same package versions
- **TypeScript strict mode:** Catches bugs before they happen (embrace the red squiggles!)

**First-Time Setup Checklist:**

```bash
# Verify installations
node --version    # Should be 18.17+
pnpm --version    # Should be 8.0+
git --version     # Any recent version

# If pnpm not installed:
npm install -g pnpm
```

---

## Phase 2 — Layout & Design System (Est. 3-4 days)

**Goal:** Global layout, header/footer, responsive nav, dark mode, typography.

### 🎓 Before You Start

**Understand These Concepts:**

- **Component:** Reusable UI piece (like LEGO blocks)
- **Props:** Data you pass to components (like function parameters)
- **Client vs Server Components:** Server = no interactivity (faster), Client = buttons/forms (use when needed)

### Tasks

1.  **Create base components** (`src/components/ui/`):

    - `Container.tsx` - max-width wrapper
    - `Button.tsx` - primary/secondary variants
    - `Icon.tsx` - SVG icon wrapper

2.  **Site header** (`src/components/sections/SiteHeader.tsx`):

    - Logo + nav links
    - Language switcher
    - Dark mode toggle
    - Mobile hamburger menu (<768px)

3.  **Site footer** (`src/components/sections/SiteFooter.tsx`):

    - Social links (Twitter, GitHub, GitLab, LinkedIn)
    - Copyright + year

4.  **Tailwind config** - design tokens:

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

5.  **Dark mode** with `next-themes`:

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

6.  **Accessibility:**
    - Skip-to-content link
    - Keyboard focus styles (`:focus-visible`)
    - ARIA labels for nav

### Acceptance Criteria

- [ ] Header/footer on all pages
- [ ] Responsive at breakpoints: 640px, 768px, 1024px, 1280px
- [ ] Dark mode toggles and persists (localStorage)
- [ ] Keyboard nav works (Tab, Enter, Escape)

### Checkpoints

1.  [ ] Header renders with logo + nav items
2.  [ ] Dark mode toggle works (no flash on reload)
3.  [ ] Mobile menu opens/closes on hamburger click
4.  [ ] Footer shows all social links with correct URLs

### Common Pitfalls

- **Issue:** Dark mode flash on page load  
  **Fix:** Use `next-themes` with `suppressHydrationWarning` on `<html>`
- **Issue:** Mobile menu doesn't close on route change  
  **Fix:** Listen to `usePathname()` and close menu in `useEffect`
- **Issue:** Tailwind classes not working  
  **Fix:** Check `tailwind.config.js` content paths include your component files
- **Issue:** "Hydration error" in console  
  **Fix:** Don't use `Date.now()` or random values in server components

#### 🚨 CRITICAL: Next.js 16.0.3 Turbopack Font Bug

**Issue:** `next/font/google` fails with Next.js 16.0.3 + Turbopack:

```
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

**Root Cause:** Turbopack's font loader is broken in 16.0.3 (affects ALL Google Fonts)

**✅ Workaround:** Use CSS `@font-face` instead of `next/font/google`

**Step 1: Remove `next/font/google` from `layout.tsx`**

```tsx
// ❌ DON'T USE (broken in 16.0.3)
import { Geist, Geist_Mono } from "next/font/google";

// ✅ DO THIS instead
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

**Step 2: Add fonts via `@font-face` in `globals.css`**

```css
/* Load fonts from Google CDN - bypasses Turbopack bug */
@font-face {
  font-family: "Geist";
  src: url("https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFWNOITd.woff2")
    format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Geist Mono";
  src: url("https://fonts.gstatic.com/s/geistmono/v4/or3nQ6H-1_WfwkMZI_qYFrcdmhHkjko.woff2")
    format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@import "tailwindcss";

:root {
  --font-geist-sans: "Geist", system-ui, sans-serif;
  --font-geist-mono: "Geist Mono", "Courier New", monospace;
}

body {
  font-family: var(--font-geist-sans);
}
```

**Alternative Fonts (if you prefer):**

- **Inter:** `https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap`
- **Poppins:** `https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap`

**When Fixed:**  
Once Next.js releases a fix (likely 16.1.0+), you can switch back to `next/font/google` for better optimization.

### 🎓 Junior Learning Notes

**Understanding Tailwind Spacing:**

```
px-4 = padding-left + padding-right: 1rem (16px)
py-2 = padding-top + padding-bottom: 0.5rem (8px)
m-4 = margin: 1rem (all sides)

Scale: 1=4px, 2=8px, 4=16px, 6=24px, 8=32px, 12=48px
```

**Responsive Design Pattern:**

```tsx
// Mobile-first approach (Tailwind default)
className = "text-base sm:text-lg md:text-xl lg:text-2xl";
// Reads: "base size by default, large on small screens and up"

// Breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
```

**Dark Mode Pattern:**

```tsx
className = "bg-white dark:bg-gray-900 text-gray-900 dark:text-white";
// Light mode: white bg, dark text
// Dark mode: dark bg, light text
```

---

## Phase 3 — Pages & Content (Est. 3-4 days)

**Goal:** Wire pages to content files, create project cards, contact form.

### Tasks

1.  **Content loader** (`src/lib/content.ts`):

    ```typescript
    import fs from "fs";
    import path from "path";
    import matter from "gray-matter";

    export function getContentBySlug(slug: string, locale: string) {
      const filePath = path.join(
        process.cwd(),
        "content",
        locale,
        `${slug}.md`
      );
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      return { frontmatter: data, content };
    }
    ```

    Install: `pnpm add gray-matter`

2.  **Implement pages:**

    - **Home** (`app/[locale]/page.tsx`): Hero + CTA
    - **About** (`app/[locale]/about/page.tsx`): Bio + timeline
    - **Projects** (`app/[locale]/projects/page.tsx`): Grid of project cards
    - **Contact** (`app/[locale]/contact/page.tsx`): Email + form

3.  **Project card** (`src/components/sections/ProjectCard.tsx`):

    - Project name, description, tech stack
    - Links: GitHub, GitLab, Live Demo
    - Hover effects

4.  **Projects data** (`content/projects.json`):

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

5.  **Contact form:**
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
- **Issue:** "Error: ENOENT: no such file or directory"  
  **Fix:** Check file path is correct, use `path.join(process.cwd(), ...)` for absolute paths
- **Issue:** Markdown not rendering as HTML  
  **Fix:** Install `react-markdown`: `pnpm add react-markdown`

### 🎓 Junior Learning Notes

**Understanding File System:**

```typescript
// ❌ Wrong - relative path breaks in production
const data = fs.readFileSync("./content/about.md");

// ✅ Correct - absolute from project root
const data = fs.readFileSync(path.join(process.cwd(), "content", "about.md"));
```

**TypeScript Type Safety:**

```typescript
// Define your data shape
interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  github?: string; // optional with ?
  demo?: string;
}

// TypeScript now helps you!
const projects: Project[] = [
  {
    id: "1",
    name: "My App",
    // TypeScript error if you forget required fields!
  },
];
```

**Rendering Markdown:**

```tsx
import ReactMarkdown from "react-markdown";

export default function AboutPage() {
  const { content } = getContentBySlug("about", "en");

  return (
    <article className="prose prose-lg dark:prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
```

---

## Phase 4 — i18n & RTL (Est. 2-3 days)

**Goal:** Full site in EN/FR/AR with RTL support for Arabic.

### Tasks

1.  **Install next-intl:**

    ```bash
    pnpm add next-intl
    ```

2.  **Setup middleware:**

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

3.  **Translation files** (`/messages/{en,fr,ar}.json`):

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

4.  **Language switcher:**

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

5.  **RTL support:**

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

6.  **Arabic web font:**
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
- **Issue:** Translation strings not loading  
  **Fix:** Restart dev server after adding new translation files
- **Issue:** Arabic text shows as boxes/question marks  
  **Fix:** Ensure Arabic font is loaded (Tajawal, Cairo, or Noto Sans Arabic)

### 🎓 Junior Learning Notes

**RTL (Right-to-Left) Explained:**
Arabic/Hebrew read right-to-left, which flips the entire layout:

```tsx
// Instead of direction-specific:
className = "ml-4"; // margin-left (breaks in RTL)

// Use logical properties:
className = "ms-4"; // margin-start (auto-flips in RTL)

// ms = margin-start (left in LTR, right in RTL)
// me = margin-end (right in LTR, left in RTL)
// ps = padding-start
// pe = padding-end
```

**Translation File Structure:**

```json
// messages/en.json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "home": {
    "hero": {
      "title": "Hi, I'm Fathi",
      "subtitle": "Full-stack developer"
    }
  }
}

// messages/ar.json
{
  "nav": {
    "home": "الرئيسية",
    "about": "عن"
  },
  "home": {
    "hero": {
      "title": "مرحباً، أنا فتحي",
      "subtitle": "مطور ويب متكامل"
    }
  }
}
```

**Using Translations:**

```tsx
'use client'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('home.hero')

  return (
    <h1>{t('title')}</h1>
    <p>{t('subtitle')}</p>
  )
}
```

---

## Phase 5 — Dynamic Features & API (Est. 2-3 days)

**Goal:** Projects importer, contact API, /uses page.

### Tasks

1.  **GitHub projects importer** (optional):

    ```typescript
    // scripts/import-projects.ts
    import { Octokit } from "@octokit/rest";

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    // Fetch pinned repos and save to projects.json
    ```

2.  **Contact form API route:**

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

3.  **Spam protection:**

    - Hidden honeypot field
    - Rate limiting with upstash/redis (optional)
    - reCAPTCHA v3 (optional)

4.  **/uses page:**

    - List tools, dotfiles, hardware
    - Link to GitHub dotfiles repo

5.  **Project detail pages** (optional):
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

1.  **PWA setup:**

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

2.  **Manifest:**

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

3.  **Image optimization:**

    - Use `next/image` everywhere
    - Add `blur-data-url` for placeholders
    - Optimize images with `sharp`: `pnpm add sharp`

4.  **Lighthouse audit:**

    - Run: `pnpm build && npx lighthouse http://localhost:3000`
    - Fix issues (accessibility, performance, SEO)

5.  **Sitemap & robots:**
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

1.  **Unit tests:**

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

2.  **E2E tests:**

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

3.  **CI pipeline:**

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

4.  **Vercel deployment:**

    - Connect GitHub repo on [vercel.com](https://vercel.com)
    - Set environment variables
    - Auto-deploy on push to `main`

5.  **Netlify (secondary):**

    - Deploy `dev` branch for previews
    - Or skip if not needed

6.  **Branch protection:**
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

1.  **Analytics (privacy-friendly):**

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

2.  **LICENSE:**

    ```bash
    # Add GNU GPL v3
    curl https://www.gnu.org/licenses/gpl-3.0.txt > LICENSE
    ```

3.  **CONTRIBUTING.md:**

    - How to run locally
    - How to submit PRs
    - Code style guide

4.  **README.md update:**

    - Project overview
    - Environment variables
    - Deployment steps
    - Scripts reference

5.  **Maintenance plan:**

    - Monthly: `pnpm update --interactive --latest`
    - Quarterly: Dependency audit (`pnpm audit`)
    - Yearly: Major framework upgrades

6.  **Backups:**
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

## 🐛 Debugging Guide for Juniors

### General Debugging Workflow

```
1. READ THE ERROR MESSAGE (it's usually clear!)
2. Check line number shown in error
3. Look for typos (90% of bugs)
4. Check if file is saved
5. Restart dev server (fixes 50% of weird issues)
6. Google error message + "Next.js"
7. Ask in Discord/forums with code snippet + error
8. Take a break — fresh eyes solve problems faster
```

### Common Error Messages Decoded

**"Module not found: Can't resolve 'X'"**

```bash
# Missing package
pnpm add X
# Then restart: Ctrl+C, pnpm dev
```

**"Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'"**

- **Cause:** Next.js 16.0.3 Turbopack bug with `next/font/google`
- **Fix:** Use CSS `@font-face` instead (see Phase 2 → CRITICAL bug section)
- **Affects:** ALL Google Fonts in 16.0.3
- **Status:** Known bug, fix expected in 16.1.0+

**"Hydration failed"**

- **Cause:** Server HTML ≠ Client HTML
- **Fix:** Don't use `Math.random()`, `Date.now()` in server components
- **Fix:** Wrap dynamic content in `<ClientOnly>` component

**"Cannot read property 'X' of undefined"**

```typescript
// ❌ Unsafe
user.profile.name;

// ✅ Safe - optional chaining
user?.profile?.name;

// ✅ Safe - with fallback
user?.profile?.name ?? "Guest";
```

**"Type 'X' is not assignable to type 'Y'"**

- Read error carefully - it tells you expected vs actual
- Hover over variable to see TypeScript's inferred type
- Add explicit type annotation to see where mismatch is

**"localhost:3000 not loading"**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or change port
pnpm dev -- -p 3001
```

### VS Code Debugging Tips

1.  **Hover** over variables to see types
2.  **Cmd/Ctrl + Click** on function to jump to definition
3.  **F12** to go to definition
4.  **Shift + F12** to see all usages
5.  Install "Error Lens" extension to see errors inline

### Browser DevTools

```
F12 or Right-click → Inspect

Tabs to use:
- Console: See errors and console.log()
- Network: Check if API calls work
- Elements: Inspect HTML/CSS
- React DevTools: See component props/state
```

### When to Ask for Help

**Ask after you've tried:**

1.  Reading error message
2.  Googling for 10 minutes
3.  Checking official docs
4.  Restarting dev server

**How to ask:**

```
Bad: "It doesn't work, help!"

Good:
"Getting error 'X' when trying to Y.
Here's my code: [paste]
Here's the error: [paste]
I tried: [what you tried]"
```

---

## 📚 TypeScript Patterns for Portfolios

### Component Props Pattern

```typescript
// Always define prop types
interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  github?: string; // optional
  demo?: string;
  image?: string;
}

export function ProjectCard({
  title,
  description,
  tags,
  github,
  demo,
  image,
}: ProjectCardProps) {
  return (
    <div>
      <h3>{title}</h3>
      {/* TypeScript autocomplete works! */}
    </div>
  );
}
```

### Data Fetching Pattern

```typescript
// Define API response shape
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null; // can be null from API
  stargazers_count: number;
  html_url: string;
}

// Type the async function
async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await fetch("https://api.github.com/users/islamux/repos");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json(); // TypeScript knows it's GitHubRepo[]
}
```

### Union Types for Variants

```typescript
type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant; // only these 3 strings allowed!
  size?: ButtonSize;
}

// TypeScript autocomplete suggests: 'primary' | 'secondary' | 'ghost'
<Button variant="primary" />;
```

### Array Operations with Types

```typescript
const projects: Project[] = [
  /* ... */
];

// Filter - TypeScript knows result is still Project[]
const featured = projects.filter((p) => p.featured);

// Map - define new type
const titles = projects.map((p) => p.title); // string[]

// Find - result might be undefined!
const project = projects.find((p) => p.id === "1"); // Project | undefined
if (project) {
  // TypeScript knows project is defined here
  console.log(project.name);
}
```

---

## 🎨 Tailwind Portfolio Component Library

### Hero Section

```tsx
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm <span className="text-blue-600">Fathi</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Full-stack developer building web experiences
          </p>
          <div className="flex gap-4">
            <Button>View Projects</Button>
            <Button variant="secondary">Contact Me</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

### Project Card with Hover Effect

```tsx
export function ProjectCard({
  title,
  description,
  tags,
  image,
}: ProjectCardProps) {
  return (
    <article
      className="
      group relative overflow-hidden rounded-lg
      bg-white dark:bg-gray-800
      shadow-md hover:shadow-xl
      transition-all duration-300
      hover:-translate-y-2
    "
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
```

### Section with Background Pattern

```tsx
export function ProjectsSection() {
  return (
    <section
      className="
      relative py-20
      bg-gradient-to-b from-white to-gray-50
      dark:from-gray-900 dark:to-gray-800
    "
    >
      {/* Optional: Dot pattern background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <Container className="relative">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project cards */}
        </div>
      </Container>
    </section>
  );
}
```

### Skill Pills/Tags

```tsx
export function SkillsSection() {
  const skills = ["Next.js", "TypeScript", "Tailwind", "React", "Node.js"];

  return (
    <section className="py-20">
      <Container>
        <h2 className="text-3xl font-bold mb-8">Tech Stack</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="
                px-4 py-2 rounded-lg
                bg-gradient-to-r from-blue-500 to-purple-600
                text-white font-medium
                shadow-md hover:shadow-lg
                transition-shadow
              "
            >
              {skill}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

### Contact Section with Form

```tsx
"use client";
import { useState } from "react";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    // Submit to API
    await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setStatus("success");
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Get In Touch</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                required
                className="
                  w-full px-4 py-2 rounded-lg
                  border border-gray-300 dark:border-gray-700
                  bg-white dark:bg-gray-800
                  focus:ring-2 focus:ring-blue-500
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </Button>

            {status === "success" && (
              <p className="text-green-600 text-center">Message sent!</p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
```

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

## 🎯 Portfolio Success Metrics

How to know your portfolio is working:

### Technical Metrics

- [ ] Lighthouse score >90 (all categories)
- [ ] First load <2 seconds on 3G
- [ ] No console errors
- [ ] Works on mobile (test on real phone!)
- [ ] All links work
- [ ] Contact form delivers emails

### Content Metrics

- [ ] Someone not in tech understands what you do
- [ ] Projects have actual screenshots/demos
- [ ] Bio is <3 sentences but tells your story
- [ ] At least 3-5 projects shown
- [ ] Contact info is obvious

### Design Metrics (Ask a Friend)

- [ ] "Looks professional"
- [ ] Can find projects in <5 seconds
- [ ] Text is readable (not too small/low contrast)
- [ ] Doesn't look like a template
- [ ] Dark mode works (if you added it)

---

## 💡 Senior Developer Tips

### Start Simple, Iterate

```
Version 1.0: Just home + projects + contact (1 weekend)
Version 1.1: Add dark mode (1 evening)
Version 1.2: Add i18n (1 week)
Version 2.0: Add blog (when you have content)

Don't wait for perfection. Ship version 1.0 ASAP.
```

### Good Enough is Better Than Perfect

- 3 polished projects > 10 half-done ones
- Working contact form > fancy animations
- Fast site > beautiful but slow site
- Shipped portfolio > perfect-but-never-launched

### Steal Like an Artist

1. Find 5 portfolios you like
2. Note what makes them good (layout? colors? animations?)
3. Recreate those patterns (not pixel-perfect copy)
4. Add your own twist

### Code Review Yourself

Every Friday:

1. Open your code from Monday
2. You'll spot improvements (that's growth!)
3. Refactor one thing
4. Commit: `refactor: improve X for readability`

### Learning Accelerators

- **Build in public:** Tweet your progress (accountability + networking)
- **Ship weekly:** Small deployments > big launches
- **Ask for feedback:** Post in Discord, Reddit, Twitter
- **Read code:** Open-source portfolios on GitHub

---

## 📖 Recommended Resources

### Official Docs (Read These First)

- [Next.js Docs](https://nextjs.org/docs) - Exceptionally well-written
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Best docs in CSS land

### Free Courses

- [Next.js Learn](https://nextjs.org/learn) - Official interactive tutorial
- [TypeScript for Beginners](https://www.totaltypescript.com/tutorials/beginners-typescript) - Matt Pocock
- [Scrimba Next.js Course](https://scrimba.com/learn/nextjs) - Interactive

### YouTube Channels

- **Web Dev Simplified** - Great for fundamentals
- **Theo - t3.gg** - Next.js/TypeScript deep dives
- **Lee Robinson** (Vercel) - Next.js official content
- **Josh Tried Coding** - Beginner-friendly Next.js

### Communities (Ask Questions Here)

- [Next.js Discord](https://discord.gg/nextjs)
- [Reactiflux Discord](https://www.reactiflux.com/)
- [r/nextjs](https://reddit.com/r/nextjs)
- [r/webdev](https://reddit.com/r/webdev)

### Design Resources

- **Colors:** [Coolors.co](https://coolors.co) - Palette generator
- **Icons:** [Heroicons](https://heroicons.com), [Lucide](https://lucide.dev)
- **Fonts:** [Google Fonts](https://fonts.google.com) - Inter, Poppins, Outfit
- **Inspiration:** [Awwwards](https://awwwards.com), [Dribbble](https://dribbble.com)
- **Illustrations:** [unDraw](https://undraw.co), [Storyset](https://storyset.com)

### Tools

- **Design:** [Figma](https://figma.com) (free) - Sketch your layout first
- **Mockups:** [Shots.so](https://shots.so) - Beautiful browser mockups
- **Screenshots:** [ScreenStudio](https://screenstudio.lemonsqueezy.com) - Animated demos
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics) - Built-in

---

## ✅ Pre-Launch Checklist

Before you announce your portfolio:

### Content

- [ ] Bio is clear and concise
- [ ] No "Lorem ipsum" placeholder text
- [ ] All projects have descriptions
- [ ] Links to GitHub/demos work
- [ ] Email address is correct
- [ ] Social links point to your profiles
- [ ] Copyright year is current

### Technical

- [ ] `pnpm build` succeeds with no errors
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (actual phone)
- [ ] Form submission works
- [ ] No 404 errors in console
- [ ] Images load properly
- [ ] Dark mode works (if applicable)

### SEO

- [ ] Every page has unique `<title>`
- [ ] Every page has meta description
- [ ] Open Graph image set (preview on Twitter/LinkedIn)
- [ ] Sitemap generated
- [ ] Google Search Console set up

### Accessibility

- [ ] Tab through site with keyboard only
- [ ] All images have alt text
- [ ] Color contrast passes WCAG AA
- [ ] Forms have labels
- [ ] Run Lighthouse accessibility audit

### Polish

- [ ] Favicon shows up in browser tab
- [ ] Loading states work (e.g., form submit button)
- [ ] No typos (use Grammarly)
- [ ] Ask 2-3 friends to test
- [ ] Fix all their feedback

---

## 🚀 Next Steps

1. **Review this plan** and adjust timeline based on your availability
2. **Block 2-hour daily coding sessions** - Consistency > marathon sessions
3. **Create GitHub repo** and initialize with Phase 1
4. **Set up project board** with issues for each phase
5. **Start with Phase 0** - content is foundation
6. **Deploy early** - even a minimal home page to Vercel
7. **Iterate** - don't aim for perfection in first pass

**Questions?** Start with Phase 0 and create content files. Once ready, ping for Phase 1 kickoff guidance!
