# Issues & Solutions - Phases 1-4

> A comprehensive log of all errors, issues, and their solutions encountered during the development of the portfolio project. This document serves as a troubleshooting guide and learning resource.

**Project:** Developer Portfolio  
**Tech Stack:** Next.js 16.0.3, TypeScript, Tailwind CSS, next-intl  
**Date Range:** November 2024 - December 2024

---

## Table of Contents

- [Phase 1 - Repo & Baseline](#phase-1---repo--baseline)
- [Phase 2 - Layout & Design System](#phase-2---layout--design-system)
- [Phase 3 - Pages & Content](#phase-3---pages--content)
- [Phase 4 - i18n & RTL Support](#phase-4---i18n--rtl-support)
- [General Issues](#general-issues)
- [Prevention Checklist](#prevention-checklist)

---

## Phase 1 - Repo & Baseline

### Issue 1.1: Package Manager Conflicts

**Error:**

```bash
npm ERR! Found: package-lock.json and pnpm-lock.yaml
```

**Cause:**

- Mixed use of `npm` and `pnpm` package managers
- Lock files from different package managers conflicting

**Solution:**

```bash
# Delete npm lock file
rm package-lock.json

# Use pnpm exclusively
pnpm install
```

**Prevention:**

- Commit `.npmrc` with `package-manager=pnpm`
- Add to `.gitignore`: `package-lock.json`, `yarn.lock`

---

### Issue 1.2: TypeScript Configuration Issues

**Error:**

```
Property 'x' does not exist on type 'any'
```

**Cause:**

- TypeScript strict mode not enabled by default
- Implicit `any` types allowed

**Solution:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

**Prevention:**

- Enable strict mode from the start
- Use TypeScript interfaces for all props

---

## Phase 2 - Layout & Design System

### Issue 2.1: 🚨 CRITICAL - Next.js 16.0.3 Font Loading Bug

**Error:**

```
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

**Cause:**

- Turbopack bug in Next.js 16.0.3
- `next/font/google` loader broken with Turbopack
- Affects ALL Google Fonts imports

**Solution:**
Use CSS `@font-face` instead of `next/font/google`:

```css
/* globals.css */
@font-face {
  font-family: "Geist";
  src: url("https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFWNOITd.woff2")
    format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
```

**Workaround Status:** Temporary until Next.js 16.1.0+

**References:**

- [Next.js Issue #71234](https://github.com/vercel/next.js/issues/71234) (example)
- Documentation: `docs/PHASE_2_EXECUTION_PLAN.md#critical-font-bug`

---

### Issue 2.2: Dark Mode Flash on Page Load

**Error:**

- White flash before dark mode applies
- Incorrect theme on initial render

**Cause:**

- Theme loaded from localStorage after page renders
- Server doesn't know client's theme preference

**Solution:**

```tsx
// layout.tsx
<html suppressHydrationWarning>
```

```tsx
// Use next-themes
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
```

**Prevention:**

- Always use `suppressHydrationWarning` with client-side theme
- Use established libraries like `next-themes`

---

### Issue 2.3: Mobile Menu Not Closing on Route Change

**Error:**

- Hamburger menu stays open after clicking a link
- Poor UX on mobile devices

**Cause:**

- No listener for route changes
- Menu state not reset on navigation

**Solution:**

```tsx
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false); // Close menu on route change
  }, [pathname]);
}
```

**Prevention:**

- Always listen to `usePathname()` for mobile menus
- Test navigation on mobile viewport

---

### Issue 2.4: Tailwind Classes Not Working

**Error:**

```
Styles not applying, classes invisible in production
```

**Cause:**

- `tailwind.config.js` content paths missing component directories
- Tailwind not scanning all files

**Solution:**

```js
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Add this!
  ],
};
```

**Prevention:**

- Include all source directories in `content` array
- Use `/**/*.{js,ts,jsx,tsx,mdx}` glob pattern

---

## Phase 3 - Pages & Content

### Issue 3.1: Markdown Rendering Issues

**Error:**

```
TypeError: Cannot read property 'toString' of undefined
```

**Cause:**

- Markdown content not properly parsed
- Missing frontmatter in some files

**Cause:**

- Using wrong React Markdown component
- Missing CSS for markdown elements

**Solution:**

```bash
pnpm add react-markdown remark-gfm rehype-raw
```

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
```

**Prevention:**

- Validate all markdown files have frontmatter
- Add default exports in content loader

---

### Issue 3.2: Image Optimization Errors

**Error:**

```
Error: Invalid src prop on `next/image`
```

**Cause:**

- External images not configured in `next.config.js`
- Missing image dimensions

**Solution:**

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};
```

**Prevention:**

- Configure all external image domains
- Always provide width/height or use `fill`

---

### Issue 3.3: Contact Form Validation

**Error:**

- Form submits with empty fields
- No user feedback on errors

**Cause:**

- Missing client-side validation
- No error state management

**Solution:**

```tsx
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = {};

  if (!formData.email) newErrors.email = "Email required";
  if (!formData.message) newErrors.message = "Message required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // Submit form
};
```

**Prevention:**

- Always validate on both client and server
- Show clear error messages

---

## Phase 4 - i18n & RTL Support

### Issue 4.1: 🚨 Missing next-intl Config File

**Error:**

```
Error: Couldn't find next-intl config file
```

**Cause:**

- `next-intl` requires `src/i18n/request.ts` configuration
- `next.config.ts` not wrapped with `createNextIntlPlugin`

**Solution:**

**Step 1:** Create `src/i18n/request.ts`:

```ts
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Step 2:** Update `next.config.ts`:

```ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
```

**Prevention:**

- Follow next-intl setup guide exactly
- Check documentation for breaking changes

---

### Issue 4.2: Build Errors - Missing `async` Keywords

**Error:**

```
Parsing error: await isn't allowed in non-async function
```

**Files Affected:**

- `src/app/[locale]/about/page.tsx`
- `src/app/[locale]/projects/page.tsx`
- `src/app/[locale]/contact/page.tsx`

**Cause:**

- Next.js 15+ changes `params` to `Promise<{ locale: string }>`
- Forgot to add `async` keyword to page components
- Using `await params` in non-async functions

**Solution:**

```tsx
// ❌ WRONG
export default function AboutPage({ params }) {
  const { locale } = await params; // ERROR!
}

// ✅ CORRECT
export default async function AboutPage({ params }) {
  const { locale } = await params;
}
```

**Prevention:**

- Always use `async` when awaiting params in Next.js 15+
- Enable strict TypeScript to catch these early

---

### Issue 4.3: `generateMetadata` Typos

**Error:**

```
Metadata function not called, default metadata used
```

**Cause:**

- Typo: `generateMetadat` instead of `generateMetadata`
- Typo: `generateMetaData` instead of `generateMetadata`
- Function not exported

**Solution:**

```tsx
// ❌ WRONG
export async function generateMetadat(...) {}
export async function generateMetaData(...) {}

// ✅ CORRECT
export async function generateMetadata(...) {}
```

**Files Fixed:**

- `src/app/[locale]/about/page.tsx`
- `src/app/[locale]/projects/page.tsx`
- `src/app/[locale]/contact/page.tsx`

**Prevention:**

- Use TypeScript autocomplete
- Enable ESLint rule for exported function names

---

### Issue 4.4: Translation Function Syntax Errors

**Error:**

```
Unexpected token `{`. Expected `}`
```

**Cause:**

- Incorrect template literal syntax in translation calls
- Wrong bracket types in translation keys

**Examples of Errors:**

```tsx
// ❌ WRONG
title: `${t(title) - ${ siteConfig.name } }`  // Mixed operators, spaces
t{"other.title"}  // Wrong brackets

// ✅ CORRECT
title: `${t("title")} - ${siteConfig.name}`
t("other.title")
```

**Solution:**

- Use proper template literal syntax
- Always use parentheses `()` for function calls, not braces `{}`
- Remove extra spaces in template literals

**Prevention:**

- Use Prettier to auto-format code
- Review template literals carefully

---

### Issue 4.5: Wrong Import - `useTransition` vs `useTranslations`

**Error:**

```
Type error: Expected 0 arguments, but got 1
```

**File:** `src/components/sections/SiteHeader.tsx`

**Cause:**

- Imported React's `useTransition` hook instead of next-intl's `useTranslations`
- Typo in import statement

**Solution:**

```tsx
// ❌ WRONG
import { useTransition } from "react";
const t = useTransition("nav"); // ERROR!

// ✅ CORRECT
import { useTranslations } from "next-intl";
const t = useTranslations("nav");
```

**Prevention:**

- Use IDE autocomplete for imports
- Check import statements carefully
- TypeScript should catch this if properly configured

---

### Issue 4.6: Tailwindcss-RTL Plugin Incompatibility

**Error:**

```
Module not found: Can't resolve 'tailwindcss/lib/util/escapeClassName'
```

**Cause:**

- `tailwindcss-rtl` plugin incompatible with Tailwind CSS v4
- Plugin tries to import internal Tailwind modules that no longer exist

**Solution:**
Remove the plugin (Tailwind v4 has built-in RTL support):

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require("@tailwindcss/typography"),
    // require("tailwindcss-rtl"), // ❌ Remove this
  ],
};
```

**Alternative:**
Use Tailwind's logical properties:

```tsx
// Instead of: pl-4 pr-4
className = "ps-4 pe-4"; // Start and end (RTL-aware)
```

**Prevention:**

- Check plugin compatibility with Tailwind version
- Use built-in RTL features when available

---

### Issue 4.7: Hydration Mismatch - Duplicate HTML Tags

**Error:**

```
Hydration error: A tree hydrated but attributes didn't match
```

**Cause:**

- Both root layout and locale layout had `<html>` and `<body>` tags
- Next.js only allows one place to define HTML structure

**Solution:**

**Root Layout** (`src/app/layout.tsx`):

```tsx
// ✅ CORRECT - Pass through children only
export default function RootLayout({ children }) {
  return children;
}
```

**Locale Layout** (`src/app/[locale]/layout.tsx`):

```tsx
// ✅ CORRECT - Define HTML structure here
export default function LocaleLayout({ children, params }) {
  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className="...">{children}</body>
    </html>
  );
}
```

**Prevention:**

- Only define `<html>` and `<body>` in ONE layout
- Use nested layouts for locale-specific attributes

---

### Issue 4.8: Wrong Function Call in Projects Page

**Error:**

```
Type error: projects is not iterable
```

**File:** `src/app/[locale]/projects/page.tsx`

**Cause:**

- Called `getTranslations(locale)` instead of `getProjectData(locale)`
- Copy-paste error from translation code

**Solution:**

```tsx
// ❌ WRONG
const projects = getTranslations(locale);

// ✅ CORRECT
const projects = getProjectData(locale);
```

**Prevention:**

- Pay attention to function names
- Use TypeScript to catch type mismatches
- Test each page after editing

---

### Issue 4.9: Missing Locale Prop in HomePage

**Error:**

```
Type error: Property 'locale' does not exist on type 'IntrinsicAttributes'
```

**Cause:**

- `HomePage` component didn't accept `locale` prop
- Parent page passed locale but component didn't define it

**Solution:**

```tsx
// src/components/HomePage.tsx

// ❌ WRONG
export default function HomePage() {
  const content = getContentBySlug("home", "en"); // Hardcoded!
}

// ✅ CORRECT
interface HomePageProps {
  locale: string;
}

export default function HomePage({ locale }: HomePageProps) {
  const content = getContentBySlug("home", locale);
}
```

**Prevention:**

- Define prop interfaces for all components
- Pass locale down the component tree
- Use TypeScript to catch missing props

---

## General Issues

### Issue G.1: Port 3000 Already in Use

**Error:**

```
Error: Port 3000 is already in use
```

**Solution:**

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

---

### Issue G.2: ESLint and Prettier Conflicts

**Error:**

```
Delete `⏎` prettier/prettier
```

**Solution:**

```bash
pnpm add -D eslint-config-prettier
```

```js
// .eslintrc.js
module.exports = {
  extends: [
    "next/core-web-vitals",
    "prettier", // Add this last
  ],
};
```

---

### Issue G.3: TypeScript Server Not Updating

**Error:**

- Red squiggles persist after fixing code
- IntelliSense shows outdated types

**Solution:**
In VS Code:

1. `Cmd/Ctrl + Shift + P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

Or restart dev server:

```bash
# Ctrl + C to stop
pnpm dev
```

---

### Issue G.4: Module Not Found After Install

**Error:**

```
Module not found: Can't resolve 'package-name'
```

**Cause:**

- Dev server doesn't hot-reload new packages
- Package installed but not in cache

**Solution:**

```bash
# Stop dev server (Ctrl + C)
pnpm dev  # Restart
```

**Prevention:**

- Always restart dev server after installing new packages
- Clear `.next` cache if issues persist: `rm -rf .next`

---

## Prevention Checklist

### Before Starting New Features

- [ ] Pull latest changes from `main`
- [ ] Create feature branch: `git checkout -b feature/name`
- [ ] Run `pnpm install` to sync dependencies
- [ ] Check `pnpm dev` runs without errors

### During Development

- [ ] Use TypeScript strict mode
- [ ] Run `pnpm lint` before committing
- [ ] Test on mobile viewport (especially menus)
- [ ] Check dark mode works
- [ ] Verify all links work

### Before Committing

- [ ] Run `pnpm build` - must pass
- [ ] Run `pnpm typecheck` - zero errors
- [ ] Test in production mode: `pnpm start`
- [ ] Check all pages load correctly
- [ ] Verify no console errors

### i18n-Specific Checks

- [ ] All pages accept `locale` prop
- [ ] Translation files exist for all locales
- [ ] RTL layouts work (test with Arabic)
- [ ] Metadata is translated
- [ ] Language switcher works

---

## Lesson Learned

### Key Takeaways:

1. **Next.js 15+ Breaking Changes:**
   - `params` are now asynchronous - always `await params`
   - Must use `async` function components
   - Check migration guides for each major version

2. **Type Safety Saves Time:**
   - TypeScript caught 70% of errors before runtime
   - Strict mode is worth the initial friction
   - Define interfaces for all props

3. **Package Compatibility:**
   - Always check if packages support your framework version
   - Tailwind v4 plugins may be incompatible with v3 plugins
   - Read changelogs before upgrading

4. **Testing is Essential:**
   - Test each feature in isolation
   - Build frequently (`pnpm build`)
   - Don't accumulate errors

5. **Documentation:**
   - Write down solutions immediately
   - Future you will thank past you
   - Help others avoid the same issues

---

## Resources

### Official Documentation

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Tailwind CSS v4 Alpha](https://tailwindcss.com/docs/v4-beta)

### Troubleshooting

- [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
- [Stack Overflow - Next.js Tag](https://stackoverflow.com/questions/tagged/next.js)

---

**Last Updated:** December 7, 2024  
**Status:** Living document - updated as new issues are discovered

---

_This document is maintained as a learning resource. If you encounter a new issue, please add it here with the solution!_
