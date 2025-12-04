#!/bin/bash
# Git commit script for feature/phase-3-pages-content branch
# Run this script to commit and push all changes

echo "Creating organized commits..."

# Commit 1: Claude init file
git add .claude_init.md
git commit -m "docs: add Claude AI assistant context file

- Create .claude_init.md with comprehensive project documentation
- Include architecture principles and centralized metadata pattern
- Document code standards and common tasks
- Add recent changes log (metadata integration, ESLint fixes)
- Provide AI assistant guidelines for maintaining consistency"

# Commit 2: Documentation reorganization
git add docs/
git commit -m "docs: reorganize documentation into docs/ folder

- Move all execution plans (Phase 1-7) to docs/ directory
- Move PORTFOLIO_BUILD_GUIDE.md to docs/
- Move supporting docs (SENIOR_TO_JUNIOR_ADVICE, TAILWIND_TUTORIAL) to docs/
- Create new PHASE_1_EXECUTION_PLAN.md with comprehensive setup guide
- Update Phase 2 & 3 plans with centralized metadata references
- Better project organization with dedicated docs folder"

# Commit 3: Centralized metadata implementation
git add src/app/metadata.ts src/app/layout.tsx src/app/page.tsx src/app/about/page.tsx src/app/contact/page.tsx src/app/projects/page.tsx
git commit -m "feat: implement centralized metadata system

- Create src/app/metadata.ts with siteConfig and defaultMetadata
- Update all pages to use centralized siteConfig for metadata
- Replace hardcoded values with siteConfig imports
- Update site URL from yoursite.com to islamux.me
- Ensure consistent SEO metadata across all pages

Pages updated:
- layout.tsx: use defaultMetadata
- page.tsx: use siteConfig for title, description, OpenGraph
- about/page.tsx: use siteConfig.name in title template
- contact/page.tsx: use siteConfig for email and metadata
- projects/page.tsx: add missing metadata export

Benefits:
- Single source of truth for site configuration
- Type-safe metadata management
- Easier maintenance (change once, applies everywhere)
- Consistent SEO implementation"

# Commit 4: Component updates
git add src/components/sections/SiteFooter.tsx src/components/sections/SiteHeader.tsx src/components/sections/ContactForm.tsx
git commit -m "fix: update components to use centralized config and fix linting

SiteFooter.tsx:
- Use siteConfig.description for footer text
- Use siteConfig.name for copyright
- Use siteConfig.email for contact link
- Remove hardcoded values

SiteHeader.tsx:
- Add ESLint disable comments for valid useEffect patterns
- Document hydration mismatch pattern (standard Next.js approach)
- Document route change state sync pattern

ContactForm.tsx:
- Remove unused imports (flightRouterStateSchema, Html, error)
- Fix illegal next/document import
- Escape apostrophe in success message (I'll → I&apos;ll)
- Clean up imports section

All components now follow centralized config pattern"

# Commit 5: Type safety improvements
git add src/types/content.ts tailwind.config.js
git commit -m "fix: improve type safety and resolve ESLint warnings

src/types/content.ts:
- Change 'any' to 'unknown' in ContentFrontmatter interface
- Better type safety requiring type guards for custom fields
- Prevents runtime errors from unchecked property access

tailwind.config.js:
- Add ESLint disable comment for require() import
- Document intentional CommonJS usage for Tailwind plugins
- Resolve @typescript-eslint/no-require-imports warning

Result: Zero ESLint errors, zero warnings"

# Commit 6: Package updates
git add package.json pnpm-lock.yaml
git commit -m "chore: update baseline-browser-mapping to latest

- Update baseline-browser-mapping from old version to 2.9.0
- Ensure accurate browser compatibility data
- Package updated as dev dependency"

# Commit 7: README update
git add README.md
git commit -m "docs: update README with latest project structure and features

- Add 'Centralized Metadata' feature
- Add 'Clean Codebase' feature (ESLint + Prettier, zero warnings)
- Update project structure to show docs/ folder
- Add Architecture Highlights section with metadata example
- Document Component Organization patterns
- Update all documentation links to point to docs/ folder
- Add 'Recent Updates' section (December 2024 changelog)
- Update site URL to islamux.me
- Add website link to author section
- Improve feature descriptions with more detail

README now accurately reflects current project state and architecture"

# Commit 8: Cleanup old files
git add -u .
git commit -m "chore: remove outdated documentation files

- Remove old execution plans from root (moved to docs/)
- Remove PROJECTS_PAGE_AUDIT.md
- Remove TAILWIND_PROSE.md  
- Remove todo.mdf (replaced with todo.md)
- Remove docs/INITIAL_DOCUMENT.md
- Clean up project root for better organization"

# Commit 9: Add remaining untracked files
git add todo.md
git commit -m "chore: add todo.md task tracking file" || echo "No todo.md to add"

echo ""
echo "All commits created successfully!"
echo ""
echo "Pushing to feature/phase-3-pages-content branch..."
git push origin feature/phase-3-pages-content

echo ""
echo "✅ Done! Branch pushed without merging or deleting."
