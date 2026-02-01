# Hostinger Static Export Routing Fix Documentation

## Objective

Create a comprehensive markdown troubleshooting guide for Hostinger deployment issues with static export routing.

**Status**: ✅ Documentation Complete with Solution Option 1 Implementation Guide

## File to Create

- **Path**: `docs/static_issues_fixes/HOSTINGER_STATIC_EXPORT_ROUTING_FIX.md`
- **Purpose**: Document the routing conflict between `next.config.ts` and `src/i18n/navigation.ts` and provide solutions

## Problem Summary

- Local `pnpm dlx serve out` works correctly at `http://localhost:3000/en/projects`
- Routing breaks when uploading `out/` folder to Hostinger
- Root cause: `trailingSlash: true` in `next.config.ts` conflicts with `.html` extensions in `navigation.ts`

**Related Documentation:**

- **[Comprehensive Static Export Guide](./COMPREHENSIVE_STATIC_EXPORT_GUIDE.md)** - Complete guide to static exports with i18n
- **[Dual Static/SSR Compatibility Guide](./DUAL_STATIC_SSR_COMPATIBILITY_GUIDE.md)** - Best practices for maintaining both modes
- **[Hostinger Fix Steps](./HOSTINGER_FIX_STEPS.md)** - Quick step-by-step deployment guide
- **[Static vs SSR Analysis](./STATIC_VS_SSR_ANALYSIS.md)** - Deep dive into configuration conflicts

## Content Outline

### 1. Problem Description

- Explain the issue clearly
- Show where the conflict occurs

### 2. Solution Options (4 approaches)

#### Option 1: Directory-based routing (recommended)

This approach aligns the navigation system with Next.js's directory-based routing by using trailing slashes instead of `.html` extensions. This is the most compatible solution for Hostinger deployments.

**Implementation steps:**

1. **Update `src/i18n/navigation.ts`**: Modify the `getLocalizedHref` function to use trailing slashes instead of `.html` extensions:

```typescript
// Before (current implementation)
export function getLocalizedHref(
  locale: Locale,
  route: keyof typeof baseRoutes,
): string {
  const basePath = baseRoutes[route];
  if (isStatic) {
    if (route === "home") {
      return locale === defaultLocale ? "/index.html" : `/${locale}.html`;
    }
    return `/${locale}${basePath}.html`;
  }
  return `/${locale}${basePath}`;
}

// After (updated implementation)
export function getLocalizedHref(
  locale: Locale,
  route: keyof typeof baseRoutes,
): string {
  const basePath = baseRoutes[route];
  if (isStatic) {
    if (route === "home") {
      return locale === defaultLocale ? "/" : `/${locale}/`;
    }
    return `/${locale}${basePath}/`;
  }
  return `/${locale}${basePath}`;
}
```

2. **Update project hrefs**: Modify the `getProjectHref` function similarly:

```typescript
// Before
export function getProjectHref(locale: Locale, projectId: string): string {
  if (isStatic) {
    return `/${locale}/projects/${projectId}.html`;
  }
  return `/${locale}/projects/${projectId}`;
}

// After
export function getProjectHref(locale: Locale, projectId: string): string {
  if (isStatic) {
    return `/${locale}/projects/${projectId}/`;
  }
  return `/${locale}/projects/${projectId}`;
}
```

3. **Keep `trailingSlash: true`**: Maintain the current configuration in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: isStatic ? "export" : undefined,
  trailingSlash: isStatic ? true : undefined, // Keep this setting
  images: {
    unoptimized: isStatic,
  },
};
```

**Benefits:**

- ✅ Maintains compatibility with Next.js directory-based routing
- ✅ Works seamlessly with Hostinger's static file serving
- ✅ Preserves clean URL structure without file extensions
- ✅ No server-side configuration required
- ✅ Better SEO with consistent trailing slash URLs

**Considerations:**

- Requires updating all internal links and navigation
- May need to update any hardcoded URLs in the application
- Ensure all static assets reference the correct paths

- **Option 2**: File-based routing
  - Remove `trailingSlash` from config
  - Keep `.html` extensions in `navigation.ts`
- **Option 3**: Server-side `.htaccess` rewrite
  - Add `.htaccess` file with rewrite rules
- **Option 4**: Subdirectory deployment
  - Add `basePath` to `next.config.ts`

### 3. Deployment Steps

#### Build Commands After Fix

After implementing Solution Option 1 (Directory-based routing), use these commands to build and test your static export:

```bash
# Clean previous builds
pnpm run build:clean

# Build static version with the fix
DEPLOY_TARGET=static pnpm run build

# Or use the convenience script
pnpm run build:static

# For a complete clean build cycle
pnpm run build:static:full
```

#### Local Testing

Test your static export locally before deploying to Hostinger:

```bash
# Serve the static export locally
pnpm dlx serve out

# Or use the custom server for clean URLs
cd out && node server.js

# Access your site at http://localhost:3000
```

#### Upload Process

1. **Compress the output directory** (optional):

   ```bash
   tar -czf static-site.tar.gz out/
   ```

2. **Upload to Hostinger**:
   - Use FTP/SFTP to upload the contents of `out/` to your Hostinger `public_html` directory
   - Or upload the compressed file and extract it on the server

3. **Verify file structure**:
   - Ensure directories like `en/`, `ar/`, `fr/` exist with `index.html` files
   - Check that all pages have trailing slashes in their URLs

#### Verification Steps

1. **Test basic navigation**:
   - Visit `https://yourdomain.com/en/` (should load English home)
   - Visit `https://yourdomain.com/en/about/` (should load About page)
   - Visit `https://yourdomain.com/ar/` (should load Arabic home with RTL)

2. **Test project pages**:
   - Visit `https://yourdomain.com/en/projects/` (should show projects list)
   - Click on a project card (should navigate to project detail with trailing slash)

3. **Test language switching**:
   - Use the language switcher to navigate between locales
   - Verify URLs maintain trailing slash structure

4. **Check 404 handling**:
   - Visit a non-existent URL to test custom 404 page

5. **Verify assets**:
   - Check that CSS, JavaScript, and images load correctly
   - Test responsive design on different screen sizes

### 4. Troubleshooting Checklist

- Configuration verification items
- Testing procedures

### 5. Common Issues

- 404 errors on nested routes
- Redirect loops
- Missing assets

**For troubleshooting these issues, see:** **[Comprehensive Static Export Guide - Common Issues Section](./COMPREHENSIVE_STATIC_EXPORT_GUIDE.md#issues-encountered)**

## Execution Steps

1. Create `docs/static_issues_fixes/HOSTINGER_STATIC_EXPORT_ROUTING_FIX.md` with the outlined content
2. Include code examples for each solution option
3. Add clear step-by-step instructions for deployment
4. Include troubleshooting checklist

## Dependencies

- None (standalone documentation file)

## Related Files

- `src/i18n/navigation.ts` - Contains the navigation helper functions that need updating
- `next.config.ts` - Contains the trailing slash configuration
- `src/app/[locale]/layout.tsx` - Main layout file that uses the navigation helpers

## See Also

- **[Comprehensive Static Export Guide](./COMPREHENSIVE_STATIC_EXPORT_GUIDE.md)** - Complete guide to static exports with i18n
- **[Dual Static/SSR Compatibility Guide](./DUAL_STATIC_SSR_COMPATIBILITY_GUIDE.md)** - Best practices for maintaining both modes
- **[Hostinger Fix Steps](./HOSTINGER_FIX_STEPS.md)** - Quick step-by-step deployment guide
- **[Static vs SSR Analysis](./STATIC_VS_SSR_ANALYSIS.md)** - Deep dive into configuration conflicts

## Quick Reference: Build Commands After Fix

### Essential Commands

```bash
# 1. Clean build (recommended)
pnpm run build:static:full

# 2. Build only (if already clean)
DEPLOY_TARGET=static pnpm run build

# 3. Test locally
pnpm dlx serve out

# 4. Test with custom server (clean URLs)
cd out && node server.js

# 5. Clean up
pnpm run build:clean
```

### Expected File Structure After Fix

```
out/
├── index.html              # Default locale home (English)
├── ar/                     # Arabic locale
│   ├── index.html          # Arabic home with RTL
│   ├── about/              # Arabic about page
│   │   └── index.html      # Trailing slash structure
│   └── projects/           # Arabic projects
│       └── index.html
├── en/                     # English locale
│   ├── index.html          # English home
│   ├── about/              # English about page
│   │   └── index.html      # Trailing slash structure
│   └── projects/           # English projects
│       ├── index.html      # Projects list
│       └── athkarix/       # Project detail
│           └── index.html  # Individual project
└── fr/                     # French locale
    ├── index.html          # French home
    └── ...                 # Other French pages
```

### Verification Checklist

- [ ] `pnpm run build:static` completes without errors
- [ ] `out/` directory contains proper trailing slash structure
- [ ] Local testing with `pnpm dlx serve out` works
- [ ] All locale pages (en/, ar/, fr/) are accessible
- [ ] Project detail pages use trailing slash URLs
- [ ] Language switching maintains URL structure
- [ ] 404 page works for non-existent routes
