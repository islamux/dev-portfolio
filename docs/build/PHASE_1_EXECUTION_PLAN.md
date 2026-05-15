# Phase 1 Execution Plan: Repo + Baseline

> **Timeline:** 2-3 days (16-24 hours)  
> **Difficulty:** Beginner-Intermediate  
> **Prerequisites:** Node.js 18.17+, pnpm installed, basic Git knowledge

---

## 📋 Overview

**Phase Goal:** Set up a clean, type-safe Next.js project with professional development tooling.

**What You'll Build:**

- ✅ Next.js 15+ project with TypeScript and Tailwind CSS
- ✅ TypeScript strict mode configuration
- ✅ ESLint + Prettier for code quality
- ✅ EditorConfig for consistent formatting
- ✅ Git repository with proper structure
- ✅ CI/CD pipeline skeleton (GitHub Actions)
- ✅ Package scripts for development workflow

---

## 🎯 Learning Objectives

By the end of Phase 1, you will understand:

- How to initialize a Next.js project with best practices
- TypeScript configuration for type safety
- Code quality tools (ESLint, Prettier)
- Git workflow and repository setup
- CI/CD basics with GitHub Actions
- Package manager differences (npm vs pnpm)

---

## 📅 Daily Timeline

### **Day 1: Project Initialization** (6-8 hours)

#### Morning (3-4 hours): Setup

1. Install prerequisites (Node.js, pnpm)
2. Initialize Next.js project
3. Configure Git repository
4. Set up remote repositories (GitHub + GitLab)

#### Afternoon (3-4 hours): TypeScript Configuration

1. Enable TypeScript strict mode
2. Configure path aliases
3. Create initial type definitions
4. Test type checking

---

### **Day 2: Development Tools** (6-8 hours)

#### Morning (3-4 hours): Code Quality Tools

1. Configure ESLint
2. Set up Prettier
3. Create EditorConfig
4. Install VS Code extensions

#### Afternoon (3-4 hours): Git Hooks (Optional)

1. Install Husky
2. Configure pre-commit hooks
3. Set up lint-staged
4. Test git workflow

---

### **Day 3: CI/CD + Documentation** (4-8 hours)

#### Morning (2-4 hours): CI Pipeline

1. Create GitHub Actions workflow
2. Configure lint + typecheck jobs
3. Test CI pipeline
4. Fix any issues

#### Afternoon (2-4 hours): Documentation

1. Write comprehensive README.md
2. Document package scripts
3. Add project structure overview
4. Create development guide

---

## 📝 Step-by-Step Implementation Guide

---

## **Step 0: Create Feature Branch** ⭐

**Estimated Time:** 2 minutes

Before starting Phase 1 work, create a dedicated feature branch:

```bash
# Create and switch to Phase 1 feature branch (or switch if it exists)
git checkout -b feature/phase-1-baseline || git checkout feature/phase-1-baseline
```

**Why use feature branches?**

- ✅ Keep `main` branch stable
- ✅ Isolate changes for easier review
- ✅ Enable parallel work on different features
- ✅ Easy to rollback if needed
- ✅ Professional Git workflow

**The `||` operator:** Creates branch if it doesn't exist, otherwise switches to existing branch.

---

## **Step 1: Verify Prerequisites**

**Estimated Time:** 15 minutes

### Check Installed Versions:

```bash
node --version    # Should be 18.17 or higher
npm --version     # Any recent version
git --version     # Any recent version
```

### Install pnpm (if not installed):

```bash
npm install -g pnpm
pnpm --version    # Should be 8.0+
```

### Why pnpm?

- **Faster:** Installs packages 2-3x faster than npm
- **Disk efficient:** Uses hard links to save space
- **Strict:** Better dependency management
- **Monorepo friendly:** Great for workspace projects

---

## **Step 2: Initialize Next.js Project**

**Estimated Time:** 10 minutes

### Create Project:

```bash
npx create-next-app@latest dev-portfolio --typescript --app --tailwind --pnpm
```

### Options Explained:

- `--typescript` - TypeScript support
- `--app` - Use App Router (not Pages Router)
- `--tailwind` - Include Tailwind CSS
- `--pnpm` - Use pnpm as package manager

### Interactive Prompts:

```
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Turbopack for `next dev`? … Yes
✔ Would you like to customize the import alias (@/*)? … No
```

### Navigate to Project:

```bash
cd dev-portfolio
```

---

## **Step 3: Configure Git Repository**

**Estimated Time:** 15 minutes

### Initialize Git:

```bash
git init
git add .
git commit -m "chore: initial Next.js setup"
```

### Create `.gitignore` (should already exist):

```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

### Add Remote Repositories:

```bash
# GitHub (primary)
git remote add origin https://github.com/islamux/dev-portfolio.git

# GitLab (backup/mirror)
git remote add gitlab https://gitlab.com/islamux/dev-portfolio.git

# Verify
git remote -v
```

### Push to Remote:

```bash
git branch -M main
git push -u origin main
```

---

## **Step 4: Configure TypeScript Strict Mode**

**Estimated Time:** 10 minutes

### File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true, // ✅ Enable strict mode
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"] // Path alias
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Test TypeScript:

```bash
pnpm tsc --noEmit
```

---

## **Step 5: Configure Tailwind CSS**

**Estimated Time:** 15 minutes

### Verify Installation:

Tailwind should already be installed. Verify:

```bash
ls tailwind.config.js
ls src/app/globals.css
```

### Update `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class", // Enable dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          500: "#0ea5e9", // Primary brand color
          900: "#0c4a6e",
        },
      },
    },
  },
  plugins: [],
};
```

### Test Tailwind:

Run dev server and check if styles work:

```bash
pnpm dev
```

Visit `http://localhost:3000` - you should see Next.js default page with Tailwind styles.

---

## **Step 6: Install Development Tools**

**Estimated Time:** 20 minutes

### Install ESLint & Prettier:

```bash
pnpm add -D eslint prettier eslint-config-prettier
```

### Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

### Create `.prettierignore`:

```
.next
node_modules
pnpm-lock.yaml
public
```

### Update `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier" // Disable conflicting ESLint rules
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

---

## **Step 7: Create EditorConfig**

**Estimated Time:** 5 minutes

### File: `.editorconfig`

```ini
# EditorConfig - consistent coding styles across editors
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

### Why EditorConfig?

- Consistent formatting across different editors
- Works with VS Code, WebStorm, Vim, etc.
- Team collaboration standard

---

## **Step 8: Configure Package Scripts**

**Estimated Time:** 10 minutes

### Update `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky install"
  }
}
```

### Test Scripts:

```bash
pnpm lint          # Run ESLint
pnpm typecheck     # Check TypeScript
pnpm format:check  # Check formatting
pnpm format        # Fix formatting
```

---

## **Step 9: Install Husky (Optional)**

**Estimated Time:** 15 minutes

> **Note:** You may skip this if you want faster iterations during development. You can always add it later.

### Install Husky:

```bash
pnpm add -D husky lint-staged
npx husky init
```

### Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

### Update `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml}": ["prettier --write"]
  }
}
```

### Test Husky:

```bash
git add .
git commit -m "test: husky pre-commit hook"
# Should run lint-staged automatically
```

---

## **Step 10: Create CI Pipeline**

**Estimated Time:** 20 minutes

### Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Run ESLint
        run: pnpm lint

      - name: Run TypeScript check
        run: pnpm typecheck

      - name: Check formatting
        run: pnpm format:check

  build:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm build
```

### Test CI Locally:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

All commands should pass before pushing.

---

## **Step 11: Create Project Structure**

**Estimated Time:** 15 minutes

### Create Folders:

```bash
mkdir -p src/components/ui
mkdir -p src/components/sections
mkdir -p src/data
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/types
mkdir -p public/images
```

### Create Type Definitions:

**File: `src/types/index.ts`**

```typescript
export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  image?: string;
}
```

---

## **Step 12: Write README.md**

**Estimated Time:** 30 minutes

### File: `README.md`

```markdown
# Developer Portfolio

Modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- pnpm 8.0 or higher

### Installation

\`\`\`bash

# Install dependencies

pnpm install

# Run development server

pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Check TypeScript types
- `pnpm format` - Format code with Prettier

## Project Structure

\`\`\`
src/
├── app/ # Next.js App Router pages
├── components/ # React components
│ ├── ui/ # Reusable UI components
│ └── sections/ # Page sections
├── data/ # Static data
├── lib/ # Utility functions
├── hooks/ # Custom React hooks
└── types/ # TypeScript type definitions
\`\`\`

## Development Guidelines

- Follow TypeScript strict mode
- Use ESLint for code quality
- Format code with Prettier
- Write meaningful commit messages

## License

GNU GPL v3

## Author

[Islamux](https://github.com/islamux)
```

---

## 🐛 Common Issues & Solutions

### Issue 1: pnpm Not Found

**Symptoms:** `pnpm: command not found`

**Solution:**

```bash
npm install -g pnpm
# or
corepack enable
corepack prepare pnpm@latest --activate
```

---

### Issue 2: Port 3000 Already in Use

**Symptoms:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

---

### Issue 3: TypeScript Errors in node_modules

**Symptoms:** TypeScript errors from dependencies

**Solution:**

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "skipLibCheck": true // Skip type checking for dependencies
  }
}
```

---

### Issue 4: ESLint and Prettier Conflicts

**Symptoms:** ESLint and Prettier give contradictory warnings

**Solution:**

```bash
pnpm add -D eslint-config-prettier
```

Update `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

---

### Issue 5: Husky Not Running

**Symptoms:** Pre-commit hooks don't execute

**Solution:**

```bash
# Reinstall Husky
rm -rf .husky
npx husky init
chmod +x .husky/pre-commit
```

---

## 📋 Acceptance Criteria Checklist

Before marking Phase 1 complete, verify:

### Project Setup

- [x] Next.js project created with TypeScript and Tailwind
- [x] Git repository initialized
- [x] Remote repositories added (GitHub + GitLab)
- [x] Initial commit pushed

### Configuration

- [x] TypeScript strict mode enabled
- [x] Tailwind CSS configured with custom colors
- [x] ESLint configured
- [x] Prettier configured
- [x] EditorConfig created

### Development Tools

- [x] Package scripts defined
- [x] Husky installed (optional)
- [x] CI pipeline created
- [x] VS Code extensions documented

### Running Commands

- [x] `pnpm dev` runs with no errors
- [x] `pnpm build` completes successfully
- [x] `pnpm lint` passes
- [x] `pnpm typecheck` passes
- [x] `pnpm format:check` passes

### Documentation

- [x] README.md with project overview
- [x] Package scripts documented
- [x] Development guidelines included
- [x] Project structure documented

---

## 🎓 Junior Developer Learning Notes

### Understanding Package Managers

**npm vs pnpm:**

```
npm (Node Package Manager)
- Default package manager
- Slower installations
- Flat node_modules

pnpm (Performant npm)
- 2-3x faster
- Uses hard links (saves disk space)
- Strict dependency resolution
- Better for monorepos
```

### Understanding TypeScript Strict Mode

```typescript
// With strict: false (risky)
let name = null;
name.toUpperCase(); // Runtime error!

// With strict: true (safe)
let name: string | null = null;
name.toUpperCase(); // TypeScript error - caught at build time!
```

### Git Workflow Best Practices

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### VS Code Recommended Extensions

1. **ESLint** - Error detection
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Class autocomplete
4. **TypeScript Vue Plugin** - Enhanced TypeScript support
5. **Error Lens** - Inline error display
6. **GitLens** - Git integration

---

## 🚀 Next Steps

After completing Phase 1, you're ready for:

- **Phase 2:** Layout & Design System
- Create reusable components
- Implement dark mode
- Build header and footer

---

_Phase 1 completed: December 2024_  
_Maintainer: Islamux_
