Senior → Junior: Step-by-step plan to build your personal site

(Tech: Next.js (latest), TypeScript, Tailwind CSS — opinionated, pragmatic, minimal bloat)

Below is a phased, actionable plan with concrete tasks, acceptance criteria, repo patterns, and deployment guidance. I do not give time estimates — instead follow the phase order and aim to finish each phase's acceptance criteria before moving on.

Phase 0 — Discovery & Content (Start here)

Goal: know exactly what content, pages and user flows the site must have.

Tasks for you (junior):

Collect and prepare content (text, images, links). Use the items the mentor provided:

Communities: https://www.linuxac.org/, https://aosus.org/

Email: fathi733@gmail.com

Twitter: @islamux

GitHub: https://github.com/islamux

GitLab: https://gitlab.com/islamux

vercel https://vercel.com/islamuxs-projects 

netlify https://app.netlify.com/teams/fathi733/projects

linkind https://www.linkedin.com/in/fathi-alqadasi-7893471b/

Write short microcopy for pages: Home hero, About (1 paragraph + bullet facts), Projects (short descriptions), Contact (how people should reach you).

Decide languages to support: English, Français, العربية (Fusha) (RTL). Prepare translations for core pages.

Decide whether blog is required now or later. (If later, leave hooks for it.)

Acceptance criteria:

A /content folder (local) with plain MD or JSON for each page (home.md, about.md, projects.json).

A simple sitemap outline: Home, About, Projects, Blog (optional), Contact, Uses / OSS, Talks.

Phase 1 — Repo + Baseline Setup

Goal: create a clean, type-safe starter repo with dev tooling.

Tasks:

Initialize repo on GitHub and GitLab (push same repo to both or mirror).

npx create-next-app@latest --typescript --app (use Next's app router).

Install Tailwind: follow official steps (tailwindcss init -p) and add @tailwind base; @tailwind components; @tailwind utilities;.

Set tsconfig to "strict": true.

Add dev tools:

ESLint (Next’s recommended), Prettier (or use prettier + eslint-config-prettier), and Husky with lint-staged.

EditorConfig file.

Add README.md with project purpose and contribution notes.

Add sample .github/workflows/ci.yml skeleton (lint + typecheck).

Create a deploy preview branch (e.g., main/production and dev).

Acceptance criteria:

npm run dev works locally, no TypeScript errors.

Tailwind styles are visible on the homepage.

Lint and typecheck run in CI skeleton.

Files / Layout suggestion (initial):

/app
  /layout.tsx
  /page.tsx        // home
  /about/page.tsx
  /projects/page.tsx
  /contact/page.tsx
/src
  /components
  /lib
  /hooks
  /types
/content
  home.md
  about.en.md
  about.fr.md
  about.ar.md
/public
  /images
tailwind.config.js
tsconfig.json
.eslintrc.js
prettier.config.js
README.md

Phase 2 — Core Layout & Design System

Goal: implement global layout, header, footer, responsive nav, theme, typography.

Tasks:

Create SiteHeader, SiteFooter, Container, Button, Icon components (atomic).

Use Tailwind with utility classes + small design tokens in src/styles or tailwind.config.js (extend fonts, colors).

Implement dark mode toggle (class strategy).

Add accessible skip-link and keyboard focus styles.

Implement responsive nav with hamburger for mobile.

Ensure layout uses Next.js app/layout.tsx and server components when no client state required; mark components use client only when needed.

Acceptance criteria:

Header + footer appear on all pages.

Site is fully responsive at common breakpoints.

Dark mode toggles and persists (localStorage).

Opinionated patterns:

Components: small, single-responsibility, prop-driven, typed props.

Naming: components/ui/* for primitives, components/sections/* for page sections.

Prefer composition over inheritance: Card with slots vs many variants.

Phase 3 — Pages & Content Integration

Goal: implement pages and bring content from /content.

Tasks:

Implement Home, About, Projects, Contact pages using the content files.

Implement lib/content loader utilities that parse MD/MDX or JSON. Keep it file-system based first (no external CMS).

Create ProjectCard component connected to projects.json.

Add social links (Twitter, GitHub, GitLab, LinkedIn) to footer with correct URLs.

Contact page: show email and a simple form (optional: use mailto: or a minimal serverless function to forward emails).

Acceptance criteria:

All page content renders from /content files.

Projects page lists projects with links to GitHub/GitLab and live demos (Vercel/Netlify).

Contact form falls back to mailto: if no serverless mailer provided.

Accessibility & SEO:

Use semantic HTML: <header>, <main>, <footer>.

Add meta tags, Open Graph, and JSON-LD basic schema for person/profile.

Use next/head or metadata in app router for per-page metadata.

Phase 4 — Internationalization (i18n) & RTL support

Goal: full site content in EN/FR/AR with correct direction for Arabic.

Tasks:

Use Next.js built-in i18n routing or a light i18n library that supports server components (e.g., next-intl or @formatjs/intl).

Store translations in content/ or locales/{en,fr,ar}.

Implement language switcher in header and language-detection via Accept-Language fallback.

Ensure Arabic uses dir="rtl" on <html> or root container; verify layout mirrors where needed (e.g., padding-left/right).

Test Arabic pages for line breaks, font choices; include a robust Arabic web font.

Acceptance criteria:

You can open /fr and /ar versions and content changes accordingly.

RTL layout looks natural (no broken spacing).

Phase 5 — Projects, Integrations & API

Goal: add dynamic features: project badges, feed, small API routes.

Tasks:

Add a Projects importer script (optional): fetch GitHub repos via GraphQL for starred or pinned projects and save to projects.json.

Add API route(s) for contact form (serverless) with spam protection (honeypot + recaptcha optional).

Add /uses page listing tools, dotfiles, which links to GitHub repos.

Add Projects detail pages (dynamic routes) if you want a per-project page.

Acceptance criteria:

Projects list updates from local projects.json or importer.

Contact API accepts a POST and returns success (do not send emails yet unless configured).

Security note:

Keep API keys out of repo; use environment variables on Vercel/Netlify.

Phase 6 — PWA, Performance & SEO polish

Goal: make the site fast, offline-friendly, and discoverable.

Tasks:

Set up manifest.json and service-worker (consider Next PWA plugin that works with app router).

Optimize images with next/image.

Add critical meta tags (theme-color, mobile-web-app-capable).

Lighthouse checklist: score accessibility & performance regressions fixed.

Add sitemap.xml and robots.txt generation (static).

Acceptance criteria:

PWA install prompt works on supported browsers.

Page performance and basic accessibility pass Lighthouse audits.

Phase 7 — Tests, CI/CD, Deployment

Goal: automated checks + deploy to Vercel and Netlify.

Tasks:

Add unit tests for components (Vitest / Jest + Testing Library).

Add basic e2e smoke test (Playwright or Cypress) for navigation and contact form.

CI pipeline (GitHub Actions) runs: install, lint, typecheck, test.

Configure Vercel for production deploy (connect GitHub). Keep Netlify as a secondary preview or for specific branches if desired.

Setup branch protection rules: require PRs, passing CI.

Acceptance criteria:

PRs show CI status; merges auto-deploy to Vercel.

Tests run successfully in CI.

Phase 8 — Launch, Observability & Maintenance

Goal: launch and keep the site maintainable.

Tasks:

Add privacy-friendly analytics (Plausible, Umami, or self-hosted) — or simple server logs.

Add a CONTRIBUTING.md and LICENSE (you’ve used GNU3 in previous notes — add LICENSE file if desired).

Document deployment steps and environment variables in README.md.

Set up backups for content if content is local (push to repo).

Plan periodic maintenance: update deps, audit, update translations.

Acceptance criteria:

Live on Vercel with proper domain (and Netlify links for secondary projects if kept).

Basic monitoring/analytics available.

Senior tips & best practices (opinionated)

App Router: Use Next.js app router for layouts and streaming. Use server components by default and mark use client only where needed.

Keep it small: Avoid heavy UI libraries; Tailwind primitives + a small component lib is enough.

Type everything: Prefer clear Types in src/types — it prevents junior mistakes.

Design tokens: keep colors, spacing, fonts in tailwind.config.js rather than inline magic values.

Accessibility: keyboard navigation and aria for nav, forms, and modals.

Commits/PRs: small atomic commits, clear messages, and PR template that asks for screenshots and testing steps.

Progressive enhancement: site should work without JS for core content (server components + static).

Privacy-first analytics: avoid heavy trackers.

Quick checklist you (junior) can follow per phase

 Phase 0: Content files committed in /content

 Phase 1: Repo + Next + Tailwind + lint + TS strict

 Phase 2: Header/Footer + responsive layout + dark mode

 Phase 3: Pages wired to content + Projects list + Contact mail

 Phase 4: i18n + RTL for Arabic

 Phase 5: Projects importer + API routes

 Phase 6: PWA + image + SEO polish

 Phase 7: Tests + CI + Vercel deploy

 Phase 8: Analytics + LICENSE + docs

Example package.json scripts (suggested)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "format": "prettier --write ."
  }
}

Final notes for you

Start small: deploy a minimal home + about + projects from static content to Vercel. Iterate.

Keep issues small and track tasks in GitHub Issues. Use labels like phase-1, good first issue.

I can next produce a minimal starter README.md and recommended Tailwind config and component scaffolding if you want — tell me which file you'd like first and I’ll generate it immediately.
