# Static vs SSR: Complete Analysis and Unified Workflow

## 1. The Core Problem

### What Keeps Breaking?

The user experiences a cycle where "fixing" the project for a Static Export breaks the Development (SSR) mode, or vice versa. This often happens because:

- **Configuration Conflicts**: `output: 'export'` disables features required for Dev/SSR (like API routes, headers, redirects).
- **Code Divergence**: Components (especially Layouts) need different structures for Static (no server-side `headers()`, no `cookies()`) vs SSR (dynamic req/res access).
- **Manual Toggling**: The user manually edits `next.config.ts` or `layout.tsx` before every build, which is error-prone and tedious.
- **Layout Structure**: Next.js requires proper `<html>` and `<body>` tags in the root layout. With i18n using `[locale]` route groups, the layout structure must be carefully designed.
- **Routing Conflicts**: Trailing slash configuration conflicts with `.html` extensions in static exports, especially on Hostinger deployments.

**For specific Hostinger routing solutions, see:** **[Hostinger Static Export Routing Fix Documentation](./RUN_SUCCESSFULY_IN_LOCALE_BUT_NOT_IN_HOSTINGER.md)**

---

## 2. Root Cause Analysis (Deep Dive)

### 2.1 Configuration Layer (`next.config.ts`)

**Current State**: ✅ **Correctly Implemented**

```typescript
const isStatic = process.env.DEPLOY_TARGET === "static";
const nextConfig: NextConfig = {
  output: isStatic ? "export" : undefined,
  images: {
    unoptimized: isStatic,
  },
};
```

**Why this works**: The config responds to an environment variable, meaning we can switch modes without code changes.

### 2.2 Layout Structure (`src/app/`)

**Current State**: ✅ **Fixed with Route Groups**

The project uses Route Groups to separate:

- `src/app/(index)/` - Redirect page with simple html/body wrapper
- `src/app/[locale]/` - Localized pages with proper html/body structure

**Why this is critical**: Next.js requires a root layout with `<html>` and `<body>` tags. With i18n, the locale-specific attributes (`lang`, `dir`) must be on the `<html>` tag.

### 2.3 Runtime Environment Detection

**Current State**: ✅ **Correctly Implemented in Layout**

```typescript
const isStatic = process.env.DEPLOY_TARGET === "static";
```

Components check this flag to conditionally use Next.js features that don't work in static export (like `headers()`, `cookies()`).

### 2.4 Middleware (`src/middleware.ts.disabled`)

**Current State**: ⚠️ **Disabled for Static Export**

- For SSR: Middleware handles i18n redirects
- For Static Export: Middleware must be disabled (causes build errors)

**Current Solution**: The file is renamed to `.disabled` - this is a manual workaround.

---

## 3. Why The Problem Repeats After Every Edit

### The Cycle of Pain

1. User edits component (e.g., adds a feature)
2. Runs `pnpm dev` - works fine
3. Tries `pnpm build:static` - **FAILS** with:
   - "Missing html/body tags" (if layout structure is wrong)
   - "Module not found" (if import paths are incorrect after file moves)
   - "Can't use headers() in static export" (if forgot to check `DEPLOY_TARGET`)
4. User manually fixes layout, imports, or adds checks
5. Runs `pnpm dev` again - **NOW SSR IS BROKEN** because changes optimized for static
6. Repeat cycle...

### The Real Issue

**Lack of Consistent Testing**: Changes are made in SSR mode (`pnpm dev`) without verifying they work in static mode until deployment time.

---

## 4. Prevention Strategy

### 4.1 Development Discipline

✅ **DO**:

- Always use `pnpm dev` for development (SSR mode)
- Test static export with `pnpm build:static` BEFORE pushing to production
- Use the environment variable `process.env.DEPLOY_TARGET` for conditional rendering
- Keep `html/body` tags in the correct layout files

❌ **DON'T**:

- Manually edit `next.config.ts` to toggle `output: 'export'`
- Use Next.js server features (`headers()`, `cookies()`, `redirect()`) without checking `DEPLOY_TARGET`
- Move layout files without updating import paths
- Remove `html/body` tags from layouts

### 4.2 Code Patterns

#### ✅ Correct Pattern for Server Features

```typescript
// In a Server Component
const isStatic = process.env.DEPLOY_TARGET === "static";

if (!isStatic) {
  const headersList = headers();
  // Use headers
}
```

#### ✅ Correct Pattern for Layouts

```typescript
// src/app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale} dir={dir}>
      <body className="...">
        {children}
      </body>
    </html>
  );
}
```

#### ❌ Incorrect Pattern

```typescript
// This will BREAK static export
const headersList = headers(); // No check for DEPLOY_TARGET
```

---

## 5. Step-by-Step: Creating a Static Version

### Prerequisites

- All code changes committed
- Development server (`pnpm dev`) working correctly

### Build Process

```bash
# Step 1: Clean previous builds
rm -rf .next out

# Step 2: Build static version
pnpm run build:static

# Step 3: Verify output
ls -la out/

# Step 4: Test locally (optional)
pnpm dlx serve out

# Step 5: Deploy to Hostinger
# Upload the contents of the `out/` folder to your hosting
```

### What Happens During Build

1. `DEPLOY_TARGET=static` is set
2. `next.config.ts` detects this and sets `output: 'export'`
3. Next.js builds a fully static site
4. Images are unoptimized (no Image Optimization API)
5. All pages are pre-rendered at build time
6. Output goes to `out/` directory

### Troubleshooting Static Build

| Error                      | Cause                      | Solution                                   |
| -------------------------- | -------------------------- | ------------------------------------------ |
| Missing html/body tags     | Layout structure incorrect | Ensure `[locale]/layout.tsx` has html/body |
| Module not found           | Import path incorrect      | Use `../globals.css` not `./globals.css`   |
| Can't use headers()        | Server feature in static   | Wrap with `if (!isStatic)` check           |
| generateStaticParams error | Missing export             | Add to all dynamic routes                  |

---

## 6. Step-by-Step: Creating an SSR Version

### Development Mode (SSR)

```bash
# Step 1: Run development server
pnpm dev

# Step 2: Access at http://localhost:3000
# Hot reload enabled, full Next.js features available
```

### Production SSR Build

```bash
# Step 1: Clean previous builds
rm -rf .next

# Step 2: Build for production
pnpm run build

# Step 3: Start production server
pnpm start

# Step 4: Deploy to Vercel/other Node.js host
# Deploy entire project, not just `out/`
```

### SSR vs Static: Key Differences

| Feature                  | SSR (Development/Vercel) | Static (Hostinger)      |
| ------------------------ | ------------------------ | ----------------------- |
| Dynamic rendering        | ✅ Yes                   | ❌ No (build-time only) |
| API Routes               | ✅ Supported             | ❌ Not supported        |
| Image Optimization       | ✅ Automatic             | ❌ Disabled             |
| Server Components        | ✅ Full support          | ⚠️ Pre-rendered only    |
| `headers()`, `cookies()` | ✅ Available             | ❌ Must avoid           |
| Middleware               | ✅ Required for i18n     | ❌ Must disable         |

---

## 7. Automation Script

### 7.1 Current Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "build:static": "DEPLOY_TARGET=static next build",
    "lint": "eslint"
  }
}
```

### 7.2 Enhanced Scripts (To Be Added)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "build:static": "DEPLOY_TARGET=static next build",
    "build:clean": "rm -rf .next out",
    "build:static:full": "pnpm build:clean && pnpm build:static",
    "serve:static": "pnpm dlx serve out",
    "test:static": "pnpm build:static:full && pnpm serve:static",
    "lint": "eslint"
  }
}
```

### 7.3 Build Script (scripts/build-static.sh)

This script automates the entire static build process:

```bash
#!/bin/bash
set -e

echo "🧹 Cleaning previous builds..."
rm -rf .next out

echo "🔨 Building static version..."
DEPLOY_TARGET=static pnpm run build

echo "✅ Static build complete!"
echo "📦 Output directory: ./out"
echo ""
echo "To test locally, run:"
echo "  pnpm dlx serve out"
echo ""
echo "To deploy to Hostinger:"
echo "  1. Compress: tar -czf site.tar.gz out/"
echo "  2. Upload to Hostinger"
echo "  3. Extract in public_html/"
```

Make it executable:

```bash
chmod +x scripts/build-static.sh
```

### 7.4 Usage

```bash
# Quick static build
pnpm run build:static

# Full clean + build + test
pnpm run test:static

# Using the shell script (after creating it)
./scripts/build-static.sh
```

---

## 8. Future-Proofing Checklist

Before deploying ANY change, verify:

- [ ] `pnpm dev` works (SSR mode)
- [ ] `pnpm build:static` completes without errors
- [ ] Static site works locally (`pnpm dlx serve out`)
- [ ] All pages accessible in both modes
- [ ] No console errors in browser
- [ ] Language switching works
- [ ] Images load correctly (unoptimized in static)

---

## 9. Quick Reference

### Common Commands

```bash
# Development
pnpm dev                    # Start dev server (SSR)

# Static Build
pnpm build:static          # Build static version
pnpm dlx serve out         # Test static build locally

# SSR Build
pnpm build                 # Build for production
pnpm start                 # Run production server

# Cleanup
rm -rf .next out           # Clean all builds
```

### File Structure

```
dev_portfolio/
├── src/app/
│   ├── (index)/           # Root redirect with html/body
│   │   ├── layout.tsx     # Simple wrapper layout
│   │   └── page.tsx       # Redirect to /en
│   └── [locale]/          # Localized pages with html/body
│       ├── layout.tsx     # Main layout with lang/dir
│       ├── page.tsx       # Home page
│       ├── about/         # About page
│       ├── contact/       # Contact page
│       └── projects/      # Projects pages
├── next.config.ts         # Responds to DEPLOY_TARGET
└── package.json           # Build scripts
```

---

## 10. Summary

**The Solution**: The project is now configured for dual-mode operation. Use environment variables (`DEPLOY_TARGET`) to switch between SSR and Static without code changes.

**The Key**: Always test BOTH modes before deploying. The scripts automate the process, but discipline in testing prevents the cycle from repeating.

**Remember**:

- SSR = Full Next.js features, dynamic rendering
- Static = Pre-rendered HTML, no server required, Hostinger-ready
