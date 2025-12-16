# Phase 1: Preparation - Detailed Execution Plan

## Overview
This document provides a detailed breakdown of Phase 1 preparation tasks for deploying the Next.js portfolio to Hostinger static hosting.

## Current Project Structure Analysis

### Key Files and Directories
- `src/app/[locale]/` - Main application pages with i18n support
- `src/app/test/` - Test page
- `src/api/contact/route.ts` - Contact form API endpoint
- `out/` - Static export output directory
- `next.config.ts` - Next.js configuration
- `package.json` - Project dependencies

### Dynamic Routes Analysis
The project uses the following dynamic routes:
- `[locale]` - Internationalization routes (en, fr, ar)
- Project detail pages under `[locale]/projects/`

## Task 1: Verify Static Export Compatibility

### 1.1 Check generateStaticParams Implementation

#### Files to Review:
- `src/app/[locale]/generateStaticParams.ts`
- `src/app/[locale]/projects/generateStaticParams.ts`

#### Verification Steps:
1. **Locale Routes**:
   ```typescript
   // Should return all supported locales
   export function generateStaticParams() {
     return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'ar' }];
   }
   ```

2. **Project Routes**:
   ```typescript
   // Should return all project slugs for each locale
   export function generateStaticParams() {
     const projects = getProjects();
     return projects.map(project => ({ slug: project.slug }));
   }
   ```

### 1.2 Confirm No Server-Side Rendering

#### Files to Check:
- All page components should use `export const dynamic = 'force-static'`
- No `getServerSideProps` should be present
- No `cookies()` or `headers()` usage in server components

#### Expected Configuration:
```typescript
// In each page.tsx file
export const dynamic = 'force-static';
export const revalidate = false;
```

### 1.3 API Routes Analysis

#### Current API Route:
- `src/api/contact/route.ts` - Contact form handler

#### Issues Identified:
- This route uses server-side code that won't work in static hosting
- Need to replace with client-side form handling or external service

#### Solution Options:
1. **Formspree/Netlify Forms**: External form handling service
2. **Client-side fetch to external API**: Use a separate backend service
3. **Remove form temporarily**: For initial deployment

## Task 2: Build Optimization

### 2.1 Current Build Process
```bash
pnpm build
# This runs:
# - next build
# - Generates static files in out/ directory
```

### 2.2 Build Verification Checklist

#### Build Command:
```bash
pnpm install --frozen-lockfile
pnpm build
```

#### Post-Build Verification:
1. **Check out/ directory structure**:
   ```bash
   ls -la out/
   # Should contain:
   # - en/, fr/, ar/ directories
   # - Static assets (CSS, JS, images)
   # - HTML files for all routes
   ```

2. **Verify file counts**:
   ```bash
   find out/ -type f | wc -l
   # Expected: ~500-1000 files depending on content
   ```

3. **Check critical files**:
   ```bash
   # Main pages
   ls out/en/index.html
   ls out/fr/index.html
   ls out/ar/index.html
   
   # Project pages
   ls out/en/projects/index.html
   ls out/en/projects/athkarix/index.html
   
   # Assets
   ls out/_next/static/chunks/
   ls out/fonts/
   ls out/images/
   ```

### 2.3 Local Testing

#### Install serve globally:
```bash
npm install -g serve
```

#### Test locally:
```bash
serve out/ -p 3000
```

#### Testing Checklist:
1. **Homepage**: `http://localhost:3000/en/`
2. **All locales**: `/en/`, `/fr/`, `/ar/`
3. **Project pages**: `/en/projects/athkarix/`
4. **Navigation**: Test all links
5. **Language switching**: Verify i18n works
6. **Responsive design**: Test on different screen sizes
7. **Asset loading**: Check images, fonts, CSS

## Task 3: API Route Replacement

### 3.1 Contact Form Analysis

#### Current Implementation:
```typescript
// src/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Process form data
  return NextResponse.json({ success: true });
}
```

### 3.2 Solution: Client-Side Form Handling

#### Option 1: Formspree Integration

**Implementation Steps**:
1. Sign up at formspree.io
2. Create new form endpoint
3. Update ContactForm.tsx:

```typescript
// src/components/sections/ContactForm.tsx
const handleSubmit = async (formData: FormData) => {
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (response.ok) {
    // Show success message
  }
};
```

#### Option 2: External API Service

**Implementation Steps**:
1. Set up separate backend (Node.js, Python, etc.)
2. Deploy to Vercel/Netlify/Railway
3. Update form to POST to external API

### 3.3 Remove API Route

#### Steps:
1. Delete `src/api/contact/route.ts`
2. Update any imports/references
3. Remove from project structure

## Task 4: Configuration Updates

### 4.1 next.config.ts Review

#### Current Configuration:
```javascript
// next.config.ts
const nextConfig = {
  output: 'export', // Static export
  // Other configurations
};
```

#### Required Updates:
```javascript
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for static hosting
  basePath: '', // Update if needed
};
```

### 4.2 Environment Variables

#### Current Usage:
- Check for any `process.env` references
- Ensure all are build-time variables

#### Static Export Requirements:
- All environment variables must be prefixed with `NEXT_PUBLIC_`
- No server-side environment variables

## Task 5: Content Verification

### 5.1 Static Content Check

#### Files to Review:
- `content/en/projects.json`
- `content/fr/projects.json`
- `content/ar/projects.json`
- All markdown files

#### Verification:
1. All content should be in JSON/MD files
2. No dynamic content generation
3. All images referenced should exist in public/images/

### 5.2 Image Optimization

#### Current Setup:
- Images in `public/images/projects/`
- Used in project pages

#### Optimization Steps:
1. **Compress images**:
   ```bash
   # Install image optimization tools
   npm install -g imagemin
   imagemin public/images/**/*.{png,jpg} --out-dir=public/images/optimized/
   ```

2. **Update references**:
   - Replace image paths in content files
   - Update component image references

## Task 6: Build Script Updates

### 6.1 package.json Scripts

#### Current Scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

#### Updated Scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next export",
    "build:static": "pnpm build && pnpm export",
    "serve": "serve out/",
    "start": "next start",
    "lint": "next lint",
    "prepare": "pnpm install --frozen-lockfile",
    "deploy:test": "pnpm build:static && pnpm serve"
  }
}
```

## Task 7: Documentation Updates

### 7.1 Update README.md

Add static deployment instructions:
```markdown
## Static Deployment

This project is configured for static hosting:

```bash
# Build for production
pnpm build:static

# Test locally
pnpm serve

# Deploy to static hosting
# Upload contents of out/ directory
```

### 7.2 Create Deployment Checklist

Create `DEPLOYMENT_CHECKLIST.md`:
```markdown
# Deployment Checklist

- [ ] All dynamic routes use generateStaticParams
- [ ] No server-side rendering functions
- [ ] API routes replaced with client-side solutions
- [ ] Build completes without errors
- [ ] All locales generate correctly
- [ ] All project pages generate
- [ ] Images are optimized
- [ ] Local testing passes
- [ ] Contact form works with external service
```

## Task 8: Final Verification

### 8.1 Automated Testing

Create simple test script:
```bash
#!/bin/bash
# test-deployment.sh

echo "Building project..."
pnpm build:static

if [ $? -ne 0 ]; then
  echo "Build failed"
  exit 1
fi

echo "Checking output directory..."
if [ ! -d "out/en" ] || [ ! -d "out/fr" ] || [ ! -d "out/ar" ]; then
  echo "Missing locale directories"
  exit 1
fi

echo "Checking critical files..."
for file in "out/en/index.html" "out/fr/index.html" "out/ar/index.html"; do
  if [ ! -f "$file" ]; then
    echo "Missing file: $file"
    exit 1
  fi
done

echo "All checks passed!"
```

### 8.2 Manual Testing Checklist

1. **Visual Testing**:
   - All pages render correctly
   - No broken layouts
   - Proper styling

2. **Functional Testing**:
   - Navigation works
   - Language switching works
   - All links functional
   - Images load properly

3. **Performance Testing**:
   - Page load times acceptable
   - No large unoptimized assets
   - Proper caching headers

## Next Steps

After completing Phase 1:
1. Commit all changes to `feature/hostinger-deployment` branch
2. Create pull request for review
3. Proceed to Phase 2: Hostinger Setup

## Success Criteria

Phase 1 is complete when:
- ✅ All dynamic routes use generateStaticParams
- ✅ No server-side rendering functions remain
- ✅ API routes replaced with client-side solutions
- ✅ Build completes successfully
- ✅ All locales generate correctly
- ✅ Local testing passes
- ✅ Documentation updated
- ✅ Deployment checklist created
