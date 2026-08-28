# Comprehensive Static Export Guide

> Current as of Next.js 16.3.2, August 2026.

This guide covers how this portfolio builds, verifies, and deploys as a multilingual static site to Hostinger (LiteSpeed). The previous 1,700-line version of this document described the superseded file-based (`.html`) routing architecture; it is preserved at `docs/archive/COMPREHENSIVE_STATIC_EXPORT_GUIDE_2025-12.md` as a historical record. Do not follow it.

Related docs:

- [Static vs SSR Analysis](./STATIC_VS_SSR_ANALYSIS.md) — why the dual-build toggle exists
- [Hostinger Static Export Routing Fix](./RUN_SUCCESSFULY_IN_LOCALE_BUT_NOT_IN_HOSTINGER.md) — the full 403 saga and the June 2026 fix
- [Hostinger Deployment Guide](./HOSTINGER_DEPLOYMENT_GUIDE.md) — hosting-side setup
- [AGENTS.md](../../../AGENTS.md) — static export rules that apply to every change

---

## 1. How the Dual Build Works

One codebase, two build modes, switched by environment variables — no code edits needed.

`next.config.ts` (lines 6-13):

```typescript
const isStatic = process.env.DEPLOY_TARGET === "static";

const nextConfig: NextConfig = {
  output: isStatic ? 'export' : undefined,
  trailingSlash: isStatic ? true : undefined,
  images: {
    unoptimized: isStatic,
  },
};
```

With `DEPLOY_TARGET=static`:

| Setting | Effect |
|---------|--------|
| `output: 'export'` | Emits plain HTML/JS/CSS to `out/` instead of a Node server |
| `trailingSlash: true` | Pages are emitted as directories (`en/index.html`), URLs end in `/` |
| `images.unoptimized` | `<Image>` renders plain `<img>` (no optimizer server available) |

Two env vars are required because config and client code read different variables:

- `DEPLOY_TARGET=static` — read by `next.config.ts` (server-side)
- `NEXT_PUBLIC_DEPLOY_TARGET=static` — read by client components, notably the root redirect in `src/app/(index)/page.tsx`, which sends `/` to `/en/` (static, trailing slash) vs `/en` (dev/SSR)

Without `DEPLOY_TARGET`, you get the normal SSR build (`pnpm dev` / `pnpm build` / `pnpm start`).

## 2. Directory-Based Routing (the Hostinger 403 Fix)

**Never use file-based routing (`.html` filenames).** Hostinger runs LiteSpeed, which auto-redirects `/en` to `/en/` (DirectorySlash) *before* any `.htaccess` rule can fire. If the export produced `en.html` instead of `en/index.html`, the redirected request hits a directory with no index file and LiteSpeed returns **403 Forbidden**.

`trailingSlash: true` makes the static export directory-based, so every URL LiteSpeed redirects to actually exists:

```
out/
├── index.html          # Root redirect → /en/
├── en/
│   ├── index.html
│   ├── about/index.html
│   ├── projects/
│   │   ├── index.html
│   │   └── athkarix/index.html
│   └── contact/index.html
├── fr/ ar/ es/ tr/     # Same structure per locale
├── 404/index.html
├── .htaccess           # Copied from public/.htaccess
├── robots.txt
└── sitemap.xml
```

`src/i18n/navigation.ts` returns plain paths (`/en/`, `/en/about/`) with no `.html` suffixes and no static-mode conditionals — same paths in dev and static modes.

History: see the "Actual Implementation (June 2026)" section of [RUN_SUCCESSFULY_IN_LOCALE_BUT_NOT_IN_HOSTINGER.md](./RUN_SUCCESSFULY_IN_LOCALE_BUT_NOT_IN_HOSTINGER.md) and [Issue 8.5 in ISSUES_AND_SOLUTIONS.md](../../troubleshooting/ISSUES_AND_SOLUTIONS.md) for the original diagnosis and fix.

## 3. Build and Verify

```bash
pnpm build:static:full   # rm -rf .next out, then build with both env vars
pnpm serve:static        # serves out/ locally (pnpm dlx serve out)
scripts/test-routes.sh   # run in another terminal against the served site
```

`scripts/test-routes.sh` performs 40 checks and all must pass before deploying:

- Locale homes, about, projects, contact pages × 5 locales (en, fr, ar, es, tr)
- 8 project detail pages per the current routes
- Root redirect and `/en` → `/en/` 301 behavior
- Static assets (`robots.txt`, `sitemap.xml`, styles, images)
- Custom 404 rendering

Equivalent one-shot cycle: `pnpm test:static`.

## 4. Deploy to Hostinger

1. **Wipe `public_html/` first.** Stale locale directories from previous deployments are the second 403 cause — LiteSpeed treats them as real paths and rejects new files alongside old ones. Delete all old files before uploading.
2. Run `pnpm build:static:full`, then `scripts/test-routes.sh` against `pnpm serve:static` — all 40 checks green.
3. Upload the **contents of `out/`** (not the `out/` folder itself) to `public_html/`.
4. `.htaccess` ships automatically: `public/.htaccess` is copied into `out/` at build time. It handles `DirectoryIndex index.html`, the trailing-slash 301 redirect, Gzip compression, browser caching, and the custom 404. Do not hand-edit it on the server.

## 5. Constraints in Static Mode

`output: 'export'` means there is no server at runtime. Specifically:

- **No API routes.** The contact form handler in `src/api/` is unreachable in the static build — do not add functionality that depends on it.
- **No `headers()` or `cookies()`** in any component.
- **No middleware.**
- **No image optimization** — `next/image` runs unoptimized; keep source images reasonably sized.
- **i18n via props-passing.** Client components bypass `NextIntlClientProvider` in static mode; pass locale and message data as props from server components, use `next/navigation` (never `next-intl/navigation`), and call `setRequestLocale(locale)` in every page and layout. Full rules: AGENTS.md, "Client Components in Static Mode".

Violating these fails the build or silently breaks routes. The troubleshooting table in AGENTS.md maps the common failure modes to their fixes.

## 6. Current Numbers

| Metric | Value |
|--------|-------|
| Locales | 5 (en, fr, ar, es, tr) |
| Projects | 14 (per `content/{locale}/projects.json`) |
| Sitemap URLs | 90 |
| Static pages emitted | 90 |

These drift as content changes — verify against a fresh build rather than copying them into new docs.

## 7. Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm build:static:full` | Clean + static build (both env vars set) |
| `pnpm serve:static` | Serve `out/` locally |
| `pnpm test:static` | Build → serve cycle |
| `scripts/test-routes.sh` | 40 route checks — must pass before deploy |

Rules of thumb: directory-based routing always, wipe `public_html/` before every upload, and treat any `.html`-suffix routing advice anywhere in these docs as obsolete.
