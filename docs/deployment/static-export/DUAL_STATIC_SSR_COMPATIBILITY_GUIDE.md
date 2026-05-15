# Dual-Compatibility Development Guide

> [!IMPORTANT]
> **Updated Workflow Available**  
> This guide is now supplemented with automated build scripts and comprehensive analysis:
>
> - **[Static vs SSR Analysis](./STATIC_VS_SSR_ANALYSIS.md)** - Problem analysis, prevention strategies, and step-by-step guides
> - **[Hostinger Static Export Routing Fix](./RUN_SUCCESSFULY_IN_LOCALE_BUT_NOT_IN_HOSTINGER.md)** - Solutions for Hostinger deployment routing conflicts
> - **Build Script**: `./scripts/build-static.sh` - Automated static build process
> - **Package Scripts**: `pnpm run build:static:full` - Clean build with cleanup

This guide outlines the best practices for maintaining your Next.js project so it continues to deploy successfully to both **Vercel** (Dynamic/Server) and **Hostinger** (Static Export).

## 🏆 The Golden Rule: "Static First"

**Assume every page must be static.**
The constraints for Hostinger (Static Export) are stricter than Vercel. If code works for Static Export, it will almost certainly work for Vercel. The reverse is not true.

---

## 🛠️ Development Workflow

1.  **Develop Normally**: Run `pnpm dev` for day-to-day work.
2.  **Check Static Build**: Before you push any code, **ALWAYS** runs:
    ```bash
    pnpm run build:static
    ```
    If this fails, you cannot deploy to Hostinger. Fix the error before committing.

---

## ✅ Best Practices

### 1. Dynamic Routes (`[id]`, `[slug]`)

**Requirement**: You must tell the builder _exactly_ which paths to generate.

- **Do**: Implement `generateStaticParams` in every `page.tsx` or `layout.tsx` that uses dynamic segments.
- **Don't**: Rely on on-demand server rendering for new paths (it won't work on Hostinger).

### 2. Data Fetching

**Requirement**: No server-side runtime fetch relative to the app itself.

- **Do**: Fetch data directly in Server Components (filesystem, database, CMS) during build time.
- **Do**: Use Client Components (`useEffect` / `SWR` / `React Query`) to fetch data from _external_ APIs (like a weather API).
- **Don't**: Create Next.js API Routes (`src/app/api/...`) and try to call them during the build. Static exports cannot run API routes.

### 3. Headers, Cookies, and Middleware

**Requirement**: The server is not there to read request headers at runtime.

- **Don't**: Use `cookies()`, `headers()`, or `middleware.ts` for logic involved in rendering page content.
- **Exceptions**: You _can_ use Middleware for Auth/Redirects on **Vercel**, but you must ensure your Static Build doesn't depend on it (e.g., use the client-side `src/app/page.tsx` redirect for Hostinger).

### 4. Images

**Requirement**: No on-the-fly image optimization server.

- **Do**: Continue using `<Image />`. Our config handles `unoptimized: true` automatically for static builds.
- **Note**: Images will be served as-is on Hostinger. Optimize the source files (compress them) before adding them to `public/`.

### 5. Forms (Contact, Newsletter)

**Requirement**: No backend to process `POST` requests.

### 6. Component-Level Divergence

**Requirement**: Some components need Context (Provider) in SSR but must survive without it in Static Export.

- **Do**: Pass necessary data (like `locale`) as **Props** from the Page/Layout level down to the component.
- **Do**: Avoid using `useLocale()` or `useTranslations()` in Client Components if they might be rendered outside the `NextIntlClientProvider` (used in Static Mode).
- **Example**:

  ```tsx
  // Layout passes locale to header
  <SiteHeader locale={locale} />

  // Header passes locale to switcher
  <LanguageSwitcher locale={locale} />

  // Switcher uses the prop instead of hook
  export function LanguageSwitcher({ locale }) { ... }
  ```

---

## 🔄 Handling Divergence

If you need a feature to exist _only_ on Vercel (e.g., a "Login" button using heavy server auth):

1.  **Environment Variables**:
    - Set `NEXT_PUBLIC_ENABLE_AUTH=true` on Vercel.
    - Set `NEXT_PUBLIC_ENABLE_AUTH=false` locally/Hostinger.
2.  **Conditional Rendering**:
    ```tsx
    if (process.env.NEXT_PUBLIC_ENABLE_AUTH === "true") {
      return <LoginButton />;
    }
    ```
