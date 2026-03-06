# Developer Portfolio

> A modern, multilingual portfolio built with Next.js 16, TypeScript, and Tailwind CSS

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## 🚀 Features

- ✅ **Server Components** - Fast, SEO-friendly by default
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Centralized Metadata** - Single source of truth for SEO and site config
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Dark Mode** - Automatic theme switching with persistence
- ✅ **i18n Support** - Full internationalization with English, French, Arabic (RTL)
- ✅ **Performance Optimized** - Lighthouse score >90
- ✅ **Accessible** - WCAG AA compliant
- ✅ **Clean Codebase** - ESLint + Prettier, zero warnings

## 📋 Prerequisites

- Node.js 18.17 or later
- pnpm 8.0 or later

```bash
node --version  # Should be 18.17+
pnpm --version  # Should be 8.0+
```

## 🛠️ Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
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
│   │   ├── [locale]/       # Locale-specific routes (en, fr, ar)
│   │   │   ├── layout.tsx  # Locale layout with lang & dir
│   │   │   ├── page.tsx    # Home page
│   │   │   ├── about/      # About page
│   │   │   ├── projects/   # Projects page
│   │   │   └── contact/    # Contact page
│   │   ├── metadata.ts     # ⭐ Centralized site config & SEO
│   │   ├── layout.tsx      # Root layout
│   │   ├── providers.tsx   # Theme provider
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI primitives
│   │   └── sections/      # Page sections (Header, Footer, etc.)
│   ├── data/              # Static data
│   │   └── socialLinks.ts # Social media links
│   ├── i18n/              # Internationalization
│   │   ├── config.ts      # Locale configuration
│   │   ├── guards.ts      # Type guards
│   │   └── request.ts     # next-intl config
│   ├── lib/               # Utilities & helpers
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
├── messages/              # Translation files (en, fr, ar)
├── content/               # Markdown content
├── public/                # Static assets
│   └── images/           # Images and media
├── docs/                  # 📚 Documentation
│   ├── PORTFOLIO_BUILD_GUIDE.md  # Complete build guide
│   ├── PHASE_1_EXECUTION_PLAN.md # Repo + baseline setup
│   ├── PHASE_2_EXECUTION_PLAN.md # Layout & design system
│   ├── PHASE_3_EXECUTION_PLAN.md # Pages & content
│   ├── PHASE_4_EXECUTION_PLAN.md # i18n & RTL support
│   ├── PHASE_5_EXECUTION_PLAN.md # API & features
│   ├── PHASE_6_EXECUTION_PLAN.md # PWA & performance
│   └── PHASE_7_EXECUTION_PLAN.md # Testing & deployment
└── .claude_init.md        # AI assistant context
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
pnpm typecheck          # Check TypeScript types (if configured)
pnpm format             # Format code with Prettier (if configured)
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

**See [docs/STATIC_VS_SSR_ANALYSIS.md](./docs/STATIC_VS_SSR_ANALYSIS.md) for complete workflow documentation.**

## 🔧 Tech Stack

| Technology                                                | Purpose                         |
| --------------------------------------------------------- | ------------------------------- |
| [Next.js 16](https://nextjs.org/)                         | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/)             | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)                  | Utility-first CSS               |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode                       |
| [next-intl](https://next-intl-docs.vercel.app/)           | Internationalization            |

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
  social: { github, twitter, linkedin },
};

export const defaultMetadata: Metadata = {
  // Comprehensive SEO configuration using siteConfig
};
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
- Redirects are handled client-side via `src/app/page.tsx`.

### Environment Variables

Set these in your deployment platform:

- `NEXT_PUBLIC_SITE_URL` - Your domain (e.g., https://islamux.me)
- `CONTACT_EMAIL` - Your contact email
- `GITHUB_TOKEN` - (Optional) For GitHub API access

## 📚 Documentation

Comprehensive documentation located in `/docs`:

- **[PORTFOLIO_BUILD_GUIDE.md](./docs/PORTFOLIO_BUILD_GUIDE.md)** - Complete build guide with best practices
- **[PHASE_1_EXECUTION_PLAN.md](./docs/PHASE_1_EXECUTION_PLAN.md)** - Repo + Baseline setup
- **[PHASE_2_EXECUTION_PLAN.md](./docs/PHASE_2_EXECUTION_PLAN.md)** - Layout & Design System
- **[PHASE_3_EXECUTION_PLAN.md](./docs/PHASE_3_EXECUTION_PLAN.md)** - Pages & Content
- **[PHASE_4-7_EXECUTION_PLANS.md](./docs/)** - i18n, API, PWA, Testing & Deploy

Each execution plan includes:

- Step-by-step implementation guides
- Code examples and best practices
- Common issues and solutions
- Junior developer learning notes

## 🐛 Known Issues

### Next.js 16.0.3 Font Loading

There's a known bug with `next/font/google` in Next.js 16.0.3. This project uses CSS `@font-face` as a workaround. See [docs/PHASE_2_EXECUTION_PLAN.md](./docs/PHASE_2_EXECUTION_PLAN.md#critical-nextjs-1603-turbopack-font-bug) for details.

## ✨ Recent Updates

### March 2026

- ✅ **Successful Hostinger Deployment** - Portfolio successfully uploaded to Hostinger using static export strategy (March 7, 2026)
- ✅ **Static Export Optimization** - Fine-tuned `trailingSlash` and `.htaccess` for perfect routing on LiteSpeed servers
- ✅ **Documentation Audit** - Updated all build guides and deployment documentation

### December 2024

- ✅ **Separation of Concerns Refactoring** - Complete codebase architecture improvement
  - Created ProjectService abstraction layer for centralized data management
  - Extracted 7 reusable components from monolithic pages
  - Improved code organization, testability, and maintainability
  - Fixed all TypeScript errors and build issues
  - Enhanced component reusability across the application

- ✅ **Added "Voices of Truth" Project** - Islamic scholars directory with multilingual support (EN/AR/FR)
  - Next.js 15 with Server Components
  - Arabic RTL and English LTR support
  - Advanced filtering and search functionality
  - Framer Motion animations
  - Featured project in portfolio
- ✅ **Phase 4 Complete** - Full i18n support with next-intl
- ✅ **Multi-language** - English, French, Arabic with RTL support
- ✅ **Locale routing** - `/en`, `/fr`, `/ar` routes with middleware
- ✅ **Type-safe i18n** - Locale validation guards for Next.js 15+
- ✅ **Centralized metadata system** - All site config in `src/app/metadata.ts`
- ✅ **ESLint clean** - Zero errors, zero warnings
- ✅ **Type safety improvements** - Changed `any` to `unknown` for better type checking
- ✅ **Documentation** - Complete Phase 1-7 execution plans

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome! Feel free to:

1. Open an issue for bugs or suggestions
2. Submit a PR for improvements
3. Share this template with others

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

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
