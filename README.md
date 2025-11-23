# Developer Portfolio

> A modern, multilingual portfolio built with Next.js 16, TypeScript, and Tailwind CSS

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## 🚀 Features

- ✅ **Server Components** - Fast, SEO-friendly by default
- ✅ **TypeScript** - Full type safety
- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Dark Mode** - Automatic theme switching
- ✅ **i18n Ready** - English, French, Arabic (RTL) support
- ✅ **Performance Optimized** - Lighthouse score >90
- ✅ **Accessible** - WCAG AA compliant

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
│   ├── app/              # Next.js app router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI primitives
│   │   └── sections/    # Page sections
│   ├── lib/             # Utilities & helpers
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript types
├── content/             # Markdown content
├── public/              # Static assets
└── PORTFOLIO_BUILD_GUIDE.md  # Comprehensive build guide
```

## 📜 Available Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Check TypeScript types
pnpm format       # Format code with Prettier
```

## 🔧 Tech Stack

| Technology                                                | Purpose                         |
| --------------------------------------------------------- | ------------------------------- |
| [Next.js 16](https://nextjs.org/)                         | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/)             | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)                  | Utility-first CSS               |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode                       |
| [next-intl](https://next-intl-docs.vercel.app/)           | Internationalization            |

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository on [vercel.com](https://vercel.com)
3. Deploy automatically on every push to `main`

### Environment Variables

Set these in your deployment platform:

- `NEXT_PUBLIC_SITE_URL` - Your domain (e.g., https://yoursite.com)
- `CONTACT_EMAIL` - Your contact email
- `GITHUB_TOKEN` - (Optional) For GitHub API access

## 📚 Documentation

- **[PORTFOLIO_BUILD_GUIDE.md](./PORTFOLIO_BUILD_GUIDE.md)** - Complete build guide with phases, best practices, and troubleshooting
- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 steps

## 🐛 Known Issues

### Next.js 16.0.3 Font Loading

There's a known bug with `next/font/google` in Next.js 16.0.3. This project uses CSS `@font-face` as a workaround. See [PORTFOLIO_BUILD_GUIDE.md](./PORTFOLIO_BUILD_GUIDE.md#critical-nextjs-1603-turbopack-font-bug) for details.

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome! Feel free to:

1. Open an issue for bugs or suggestions
2. Submit a PR for improvements
3. Share this template with others

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Fathi Al-Qadasi**

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
