# Developer Portfolio

> A modern, multilingual portfolio built with Next.js 16, TypeScript, and Tailwind CSS

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## 🚀 Features

- ✅ **Server Components** - Fast, SEO-friendly by default
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Centralized Metadata** - Single source of truth for SEO and site config
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Dark Mode** - Automatic theme switching with persistence
- ✅ **i18n Support** - Full internationalization with English, French, Arabic (RTL), Turkish, Spanish
- ✅ **Performance Optimized** - Server components, static generation, minimal client JS
- ✅ **Accessible** - Skip link, semantic HTML, keyboard-friendly navigation
- ✅ **Clean Codebase** - ESLint (flat config) + Prettier, zero warnings

## 📋 Prerequisites

- Node.js 20.9 or later (Next.js 16 requirement)
- pnpm 8.0 or later

```bash
node --version  # Should be 20.9+
pnpm --version  # Should be 8.0+
```

## 🛠️ Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your values
   ```

3. **Run development server:**

   ```bash
   pnpm dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
dev_portfolio/
├── src/
│   ├── app/                # Next.js app router
│   │   ├── [locale]/       # Locale-specific routes (en, fr, ar, es, tr)
│   │   │   ├── layout.tsx  # Locale layout with lang & dir
│   │   │   ├── page.tsx    # Home page
│   │   │   ├── about/      # About page
│   │   │   ├── projects/   # Projects page (+ [id]/ detail pages)
│   │   │   └── contact/    # Contact page
│   │   ├── (index)/        # Root route group
│   │   │   ├── layout.tsx  # Root layout
│   │   │   └── page.tsx    # Client redirect to /en
│   │   ├── metadata.ts     # ⭐ Centralized site config & SEO
│   │   ├── providers.tsx   # Custom theme provider (ThemeContext)
│   │   ├── robots.ts       # robots.txt
│   │   ├── sitemap.ts      # Sitemap generation
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI primitives
│   │   └── sections/      # Page sections (Header, Footer, etc.)
│   ├── data/              # Static data
│   │   └── socialLinks.ts # Social media links
│   ├── i18n/              # Internationalization
│   │   ├── config.ts      # Locale configuration
│   │   ├── navigation.ts  # Locale-prefixed path helpers
│   │   └── request.ts     # next-intl config
│   ├── lib/               # Utilities & helpers
│   ├── hooks/             # Custom React hooks
│   ├── messages/          # Translation JSON (en, fr, ar, es, tr)
│   ├── services/          # Data services (projectService)
│   └── types/             # TypeScript type definitions
├── content/               # Per-locale content (about.md, home.md, projects.json)
├── public/                # Static assets
│   ├── fonts/            # Font files
│   └── images/           # Images and media
├── docs/                  # 📚 Documentation
│   ├── README.md          # Documentation index
│   ├── project/           # Command center, AI rules, workflow
│   ├── build/             # Portfolio build guide and phase plans
│   ├── deployment/        # Static export and Hostinger guides
│   ├── architecture/      # Refactoring plans and summaries
│   ├── learning/          # Tutorials and references
│   ├── plans/             # Code-review and improvement plans
│   ├── superpowers/       # Design specs and implementation plans
│   └── troubleshooting/   # Issue logs and fixes
├── AGENTS.md              # AI agent guidelines
├── RULES.md               # Git & PR rules
└── CLAUDE.md              # Claude config
```

## 📜 Available Scripts

```bash
# Development
pnpm dev                 # Start dev server (SSR mode)

# Production Builds
pnpm build              # Build for production (Vercel/SSR)
pnpm build:static       # Build static version (Hostinger)
pnpm build:static:full  # Clean + build static (recommended)
pnpm start              # Start production server

# Testing & Serving
pnpm serve:static       # Test static build locally
pnpm test:static        # Build + serve static version

# Code Quality
pnpm lint               # Run ESLint
```

### Automated Build Script

For a fully automated static build with cleanup and deployment instructions:

```bash
./scripts/build-static.sh
```

This script will:

1. Clean previous builds (`rm -rf .next out`)
2. Build static version with `DEPLOY_TARGET=static`
3. Provide instructions for local testing and Hostinger deployment

**See [STATIC_VS_SSR_ANALYSIS.md](./docs/deployment/static-export/STATIC_VS_SSR_ANALYSIS.md) for complete workflow documentation.**

## 🔧 Tech Stack

| Technology                                                | Purpose                         |
| --------------------------------------------------------- | ------------------------------- |
| [Next.js 16](https://nextjs.org/)                         | React framework with App Router (16.3.2) |
| [TypeScript](https://www.typescriptlang.org/)             | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)                  | Utility-first CSS               |
| Custom ThemeContext (`src/app/providers.tsx`)              | Dark mode                       |
| [next-intl](https://next-intl-docs.vercel.app/)           | Internationalization            |
| [react-markdown](https://github.com/remarkjs/react-markdown) | Markdown content rendering    |

## 🏗️ Architecture Highlights

### Centralized Metadata (`src/app/metadata.ts`)

All site configuration and SEO metadata in one place:

```typescript
export const siteConfig = {
  name: "Islamux",
  title: "Islamux - Full-Stack Developer",
  description: "...",
  url: "https://islamux.me",
  email: "fathi733@gmail.com",
  twitterHandle: "@islamux",
  social: { github, twitter, linkedin },
};

export function buildPageMetadata({ title, description, locale }): Metadata {
  // Open Graph + Twitter card metadata, built from siteConfig
}
```

**Benefits:**

- ✅ Single source of truth for site information
- ✅ Consistent metadata across all pages
- ✅ Type-safe configuration
- ✅ Easy to update (change once, applies everywhere)

### Component Organization

- **Server Components** (default): For static content, optimal performance
- **Client Components** (`'use client'`): For interactivity only
- **Props-first pattern**: Pass data via props, not hardcoded values
- **Separation of concerns**: Data in `src/data/`, types in `src/types/`

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository on [vercel.com](https://vercel.com)
3. Deploy automatically on every push to `main`

### Hostinger (Static Export)

1. Run the static build locally:
   ```bash
   pnpm run build:static
   ```
2. This creates an `out` folder with your static site.
3. Upload the contents of `out` to your Hostinger `public_html` directory via File Manager or FTP.

**Note:** Static exports do not support ISR, Image Optimization, or Middleware.

- Images are unoptimized automatically.
- Redirects are handled client-side via `src/app/(index)/page.tsx`.

### Environment Variables

Set these in your deployment platform:

- `NEXT_PUBLIC_SITE_URL` - Your domain (e.g., https://islamux.me)
- `CONTACT_EMAIL` - Your contact email
- `RESEND_API_KEY` - (Optional) Contact form email delivery via Resend
- `GITHUB_TOKEN` - (Optional, not implemented) For GitHub API access

## 📚 Documentation

Comprehensive documentation located in `/docs`:

- **[Documentation index](./docs/README.md)** - Start here for the full docs map
- **[PORTFOLIO_BUILD_GUIDE.md](./docs/build/PORTFOLIO_BUILD_GUIDE.md)** - Complete build guide with best practices
- **[PHASE_1_EXECUTION_PLAN.md](./docs/build/PHASE_1_EXECUTION_PLAN.md)** - Repo + Baseline setup
- **[PHASE_2_EXECUTION_PLAN.md](./docs/build/PHASE_2_EXECUTION_PLAN.md)** - Layout & Design System
- **[PHASE_3_EXECUTION_PLAN.md](./docs/build/PHASE_3_EXECUTION_PLAN.md)** - Pages & Content
- **[Static export docs](./docs/deployment/static-export/COMPREHENSIVE_STATIC_EXPORT_GUIDE.md)** - Hostinger/static deployment
- **[Architecture docs](./docs/architecture/SOC_REFACTORING_PLAN.md)** - Refactoring plans and summaries

Each execution plan includes:

- Step-by-step implementation guides
- Code examples and best practices
- Common issues and solutions
- Junior developer learning notes

## 🐛 Known Issues

### Next.js 16.0.3 Font Loading

There's a known bug with `next/font/google` in Next.js 16.0.3 (Turbopack). This project uses CSS `@font-face` loaded from CDN as a workaround. See [PHASE_2_EXECUTION_PLAN.md](./docs/build/PHASE_2_EXECUTION_PLAN.md) ("Important: Next.js 16.0.3 Font Bug") for details.

## ✨ Recent Updates

### August 2026

- ✅ **Next.js 16.3.2 & React 19.2.8 Upgrade** - Latest framework versions
- ✅ **Native Theme Provider** - Custom ThemeContext replaces next-themes usage (terminal polyglot redesign, #8)
- ✅ **Clean Code & SOLID Refactors** - Email HTML escaping, service-layer data access, dead code removal (#13, #16)
- ✅ **project-tracker.json Removed** - Milestone tracking via git history + docs (#14)
- ✅ **New Projects** - badeel-atr2 added (#15); millionaire project spans 2 columns (#6)
- ✅ **Interview Questions Doc** - 105 senior-level Q&A verified against the codebase (#7)

### May 2026

- ✅ **Next.js 16.2.6 & React 19.2.6 Upgrade** - Latest framework versions with improved performance
- ✅ **Turkish & Spanish** - Two new locales added (5 languages total: EN, AR, TR, ES, FR)
- ✅ **Project Tracker** - Centralized milestone tracking with status reporting
- ✅ **Docs Reorganization** - Flattened and restructured documentation under `docs/`
- ✅ **Lint Migration** - ESLint flat config with strict rules

### March 2026

- ✅ **Successful Hostinger Deployment** - Portfolio uploaded using static export strategy (March 7, 2026)
- ✅ **Static Export Optimization** - Fine-tuned `trailingSlash` and `.htaccess` for LiteSpeed servers
- ✅ **Documentation Audit** - Updated build guides and deployment documentation

### December 2024

- ✅ **Separation of Concerns Refactoring** - Codebase architecture improvement with ProjectService abstraction
- ✅ **"Voices of Truth" Project** - Islamic scholars directory (EN/AR/FR) with filtering and search
- ✅ **Phase 4 Complete** - Full i18n with next-intl (EN, FR, AR)
- ✅ **Centralized metadata** - SEO config in `src/app/metadata.ts`

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome! Feel free to:

1. Open an issue for bugs or suggestions
2. Submit a PR for improvements
3. Share this template with others

## 📄 License

This project is open source and available under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).

## 👤 Author

**Fathi Al-Qadasi (Islamux)**

- Website: https://islamux.me
- Email: fathi733@gmail.com
- GitHub: [@islamux](https://github.com/islamux)
- GitLab: [@islamux](https://gitlab.com/islamux)
- Twitter: [@islamux](https://twitter.com/islamux)
- LinkedIn: [fathi-alqadasi](https://www.linkedin.com/in/fathi-alqadasi-7893471b/)

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Tailwind Labs](https://tailwindcss.com/) for Tailwind CSS
- [Vercel](https://vercel.com/) for Geist fonts and hosting

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
