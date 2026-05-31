# Phase 7 Execution Plan: Testing, CI/CD & Deployment

> **Timeline:** 3-4 days (24-32 hours)  
> **Difficulty:** Intermediate to Advanced  
> **Prerequisites:** Phase 6 completed, basic Git/GitHub knowledge

---

## 📋 Overview

**Phase Goal:** Set up comprehensive testing, continuous integration, and automated deployment to production.

**What You'll Build:**

- ✅ Unit tests for components and utilities
- ✅ End-to-end (E2E) tests with Playwright
- ✅ GitHub Actions CI/CD pipeline
- ✅ Automated deployment to Vercel
- ✅ Branch protection rules
- ✅ Pre-commit hooks and quality gates

---

## 🎯 Learning Objectives

By the end of Phase 7, you will understand:

- Different types of testing (unit, integration, E2E)
- How to write effective tests
- CI/CD pipelines and automation
- Deployment strategies
- Git workflow best practices
- Production monitoring basics

---

## 📅 Daily Timeline

### **Day 1: Unit Testing** (8-10 hours)

#### Morning (4-5 hours): Setup & Component Tests

1. Install Vitest and React Testing Library
2. Configure test environment
3. Write tests for UI components
4. Test Button, Container, Icon components
5. Achieve >80% coverage on components

#### Afternoon (4-5 hours): Utility & API Tests

1. Test content loader functions
2. Test email utility
3. Test validation functions
4. Mock external dependencies
5. Run coverage report

---

### **Day 2: E2E Testing & CI Setup** (8-10 hours)

#### Morning (4-5 hours): Playwright E2E Tests

1. Install and configure Playwright
2. Write navigation tests
3. Test contact form flow
4. Test language switching
5. Test responsive layouts

#### Afternoon (4-5 hours): GitHub Actions CI

1. Create CI workflow
2. Add lint and typecheck jobs
3. Add test jobs
4. Add build job
5. Test PR workflow

---

### **Day 3: Deployment & Branch Protection** (6-8 hours)

#### Morning (3-4 hours): Vercel Deployment

1. Connect GitHub to Vercel
2. Configure environment variables
3. Set up preview deployments
4. Configure production domain
5. Test deployment

#### Afternoon (3-4 hours): Git Workflow

1. Set up branch protection
2. Configure PR requirements
3. Add pre-commit hooks
4. Test full workflow
5. Document process

---

### **Day 4: Monitoring & Documentation** (2-6 hours)

#### Morning (1-3 hours): Monitoring

1. Add error tracking (Sentry optional)
2. Configure analytics
3. Set up uptime monitoring
4. Create status page
5. Test alerts

#### Afternoon (1-3 hours): Documentation & Polish

1. Update README with badges
2. Write CONTRIBUTING.md
3. Document deployment process
4. Create troubleshooting guide
5. Final QA check

---

## Step-by-Step Implementation

**Step 0: Create Feature Branch** ⭐

Before starting Phase 7, create and switch to a feature branch:

```bash
# Create and switch to Phase 7 feature branch (or switch if it exists)
git checkout -b feature/phase-7-testing || git checkout feature/phase-7-testing
```

**Why?** Keeps `main` stable, isolates changes, enables easy rollback, professional workflow.

---

**Step 1: Set up Vitest**

---

## **Step 1: Install Testing Dependencies**

**Estimated Time:** 15 minutes

### Install Vitest & React Testing Library:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

### Install Playwright:

```bash
pnpm add -D @playwright/test
npx playwright install
```

---

## **Step 2: Configure Vitest**

**Estimated Time:** 20 minutes

### File: `vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "vitest.setup.ts",
        "**/*.config.ts",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### File: `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  usePathname() {
    return '/';
  },
}));
```

---

## **Step 3: Write Component Tests**

**Estimated Time:** 2-3 hours

### File: `src/components/ui/Button.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-500');
  });

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
  });
});
```

### File: `src/components/ui/Container.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders children', () => {
    render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    );
    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('renders as different element when "as" prop is provided', () => {
    render(
      <Container as="section" data-testid="container">
        <div>Content</div>
      </Container>
    );
    expect(screen.getByTestId('container').tagName).toBe('SECTION');
  });
});
```

---

## **Step 4: Write Utility Tests**

**Estimated Time:** 1-2 hours

### File: `src/lib/content.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { getContentBySlug, getProjectsData } from "./content";

describe("Content Utilities", () => {
  const testContentDir = path.join(process.cwd(), "test-content");

  beforeEach(() => {
    // Create test content directory
    if (!fs.existsSync(testContentDir)) {
      fs.mkdirSync(path.join(testContentDir, "en"), { recursive: true });
    }

    // Create test markdown file
    const testMd = `---
title: Test Page
description: Test description
---

# Test Content

This is a test.`;

    fs.writeFileSync(path.join(testContentDir, "en", "test.md"), testMd);

    // Create test projects.json
    const testProjects = [
      {
        id: "test-project",
        name: "Test Project",
        description: "Test description",
        tech: ["React", "TypeScript"],
        github: "https://github.com/test/project",
        featured: true,
        year: "2024",
      },
    ];

    fs.writeFileSync(
      path.join(testContentDir, "en", "projects.json"),
      JSON.stringify(testProjects)
    );

    // Mock process.cwd()
    vi.spyOn(process, "cwd").mockReturnValue(testContentDir);
  });

  afterEach(() => {
    // Cleanup
    if (fs.existsSync(testContentDir)) {
      fs.rmSync(testContentDir, { recursive: true });
    }
    vi.restoreAllMocks();
  });

  describe("getContentBySlug", () => {
    it("loads and parses markdown file", () => {
      const content = getContentBySlug("test", "en");

      expect(content.frontmatter.title).toBe("Test Page");
      expect(content.frontmatter.description).toBe("Test description");
      expect(content.content).toContain("# Test Content");
      expect(content.slug).toBe("test");
    });

    it("throws error for non-existent file", () => {
      expect(() => getContentBySlug("nonexistent", "en")).toThrow();
    });
  });

  describe("getProjectsData", () => {
    it("loads projects from JSON file", () => {
      const projects = getProjectsData("en");

      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe("test-project");
      expect(projects[0].name).toBe("Test Project");
      expect(projects[0].tech).toContain("React");
    });

    it("returns empty array for non-existent file", () => {
      const projects = getProjectsData("nonexistent");
      expect(projects).toEqual([]);
    });
  });
});
```

### File: `src/lib/email.test.ts`

```typescript
import { describe, it, expect, vi } from "vitest";
import { generateContactEmailHTML, escapeHtml } from "./email";

describe("Email Utilities", () => {
  describe("generateContactEmailHTML", () => {
    it("generates valid HTML email", () => {
      const html = generateContactEmailHTML({
        name: "John Doe",
        email: "john@example.com",
        message: "Test message",
      });

      expect(html).toContain("John Doe");
      expect(html).toContain("john@example.com");
      expect(html).toContain("Test message");
      expect(html).toContain("<!DOCTYPE html>");
    });

    it("escapes HTML in user input", () => {
      const html = generateContactEmailHTML({
        name: 'John <script>alert("xss")</script>',
        email: "test@example.com",
        message: "<img src=x onerror=alert(1)>",
      });

      expect(html).not.toContain("<script>");
      expect(html).not.toContain("onerror");
      expect(html).toContain("&lt;");
      expect(html).toContain("&gt;");
    });
  });
});
```

---

## **Step 5: Configure Playwright**

**Estimated Time:** 30 minutes

### File: `playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## **Step 6: Write E2E Tests**

**Estimated Time:** 2-3 hours

### File: `tests/navigation.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to all main pages", async ({ page }) => {
    await page.goto("/");

    // Navigate to About
    await page.click('a[href*="/about"]');
    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator("h1")).toContainText("About");

    // Navigate to Projects
    await page.click('a[href*="/projects"]');
    await expect(page).toHaveURL(/.*projects/);
    await expect(page.locator("h1")).toContainText("Projects");

    // Navigate to Contact
    await page.click('a[href*="/contact"]');
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.locator("h1")).toContainText("Contact");

    // Navigate back Home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL(/^\/(en)?$/);
  });

  test("should work on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Open mobile menu
    await page.click('button[aria-label*="menu"]');

    // Click navigation link
    await page.click('a[href*="/about"]');
    await expect(page).toHaveURL(/.*about/);
  });
});
```

### File: `tests/contact-form.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test("should submit contact form successfully", async ({ page }) => {
    await page.goto("/contact");

    // Fill form
    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill(
      'textarea[name="message"]',
      "This is a test message that is long enough to pass validation."
    );

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success message
    await expect(page.locator("text=/success/i")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should show validation errors", async ({ page }) => {
    await page.goto("/contact");

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation (browser native or custom)
    const nameInput = page.locator('input[name="name"]');
    expect(
      await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid)
    ).toBe(false);
  });

  test("should validate email format", async ({ page }) => {
    await page.goto("/contact");

    await page.fill('input[name="name"]', "John Doe");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('textarea[name="message"]', "Test message");

    await page.click('button[type="submit"]');

    // Check email validation
    const emailInput = page.locator('input[name="email"]');
    expect(
      await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
    ).toBe(false);
  });
});
```

### File: `tests/language-switching.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Language Switching", () => {
  test("should switch between languages", async ({ page }) => {
    await page.goto("/en");

    // Open language switcher
    await page.click('button:has-text("English"), button:has-text("EN")');

    // Switch to French
    await page.click("text=/français/i");
    await expect(page).toHaveURL(/\/fr/);

    // Check content changed
    await expect(page.locator("nav")).toContainText(/projets|accueil/i);

    // Switch to Arabic
    await page.click('button:has-text("Français"), button:has-text("FR")');
    await page.click("text=/العربية/i");
    await expect(page).toHaveURL(/\/ar/);

    // Check RTL is active
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });
});
```

---

## **Step 7: Create GitHub Actions Workflow**

**Estimated Time:** 1 hour

### File: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run TypeScript type check
        run: pnpm typecheck

  test:
    name: Unit Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: pnpm test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build project
        run: pnpm build
        env:
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          NEXT_PUBLIC_SITE_URL: https://yoursite.com
```

---

## **Step 8: Deploy to Vercel**

**Estimated Time:** 30 minutes

### Setup Steps:

1. **Go to [vercel.com](https://vercel.com)**

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository**

4. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `.next`

5. **Add Environment Variables:**

   ```
   RESEND_API_KEY=re_...
   CONTACT_EMAIL_TO=fathi733@gmail.com
   CONTACT_EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://yoursite.vercel.app
   GITHUB_TOKEN=ghp_... (if using importer)
   ```

6. **Click "Deploy"**

### Configure Custom Domain (Optional):

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. Wait for DNS propagation (up to 48 hours)

---

## **Step 9: Setup Branch Protection**

**Estimated Time:** 15 minutes

### GitHub Repository Settings:

1. Go to **Settings** → **Branches**

2. Click **Add rule** for `main` branch

3. Configure protection rules:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Select required status checks:
     - lint
     - test
     - e2e
     - build
   - ✅ Do not allow bypassing the above settings

4. **Save changes**

---

## **Step 10: Add Pre-commit Hooks**

**Estimated Time:** 20 minutes

### Install Husky & lint-staged:

```bash
pnpm add -D husky lint-staged
npx husky init
```

### File: `.husky/pre-commit`

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
    "*.{json,md,mdx,css}": ["prettier --write"]
  },
  "scripts": {
    "prepare": "husky"
  }
}
```

---

## **Step 11: Add Test Scripts to package.json**

**Estimated Time:** 5 minutes

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
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "import:projects": "tsx scripts/import-projects.ts",
    "analyze": "ANALYZE=true pnpm build",
    "prepare": "husky"
  }
}
```

---

## **Step 12: Create CONTRIBUTING.md**

**Estimated Time:** 30 minutes

### File: `CONTRIBUTING.md`

````markdown
# Contributing to Portfolio

Thank you for your interest in contributing!

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/islamux/dev-portfolio.git
   cd dev-portfolio
   ```
````

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Copy environment variables:**

   ```bash
   cp .env.example .env.local
   # Fill in your values
   ```

4. **Run development server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/              # Next.js app router pages
├── src/
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   ├── hooks/        # Custom React hooks
│   └── types/        # TypeScript types
├── content/          # Markdown content
├── messages/         # i18n translations
├── public/           # Static assets
└── tests/            # E2E tests
```

## Development Workflow

1. **Create a branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Run tests:**

   ```bash
   pnpm test
   pnpm test:e2e
   ```

4. **Lint and format:**

   ```bash
   pnpm lint:fix
   pnpm format
   ```

5. **Commit with conventional commits:**

   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   git commit -m "docs: update README"
   ```

6. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Testing

- **Unit tests:** `pnpm test`
- **E2E tests:** `pnpm test:e2e`
- **Coverage:** `pnpm test:coverage`

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write tests for new features

## Questions?

Feel free to open an issue or reach out at fathi733@gmail.com

````

---

## 🐛 Common Issues & Solutions

### Issue 1: Tests Failing in CI

**Symptoms:** Tests pass locally but fail in GitHub Actions

**Solutions:**

1. **Check Node version:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '20' # Match your local version
````

2. **Ensure frozen lockfile:**

   ```yaml
   - run: pnpm install --frozen-lockfile
   ```

3. **Add environment variables:**
   ```yaml
   env:
     RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
   ```

---

### Issue 2: Playwright Tests Timeout

**Symptoms:** E2E tests timeout waiting for page

**Solutions:**

1. **Increase timeout:**

   ```typescript
   test("test name", async ({ page }) => {
     await page.goto("/", { timeout: 30000 });
   });
   ```

2. **Wait for specific element:**

   ```typescript
   await page.waitForSelector("h1", { state: "visible" });
   ```

3. **Check webServer is running:**
   ```typescript
   // playwright.config.ts
   webServer: {
     command: 'pnpm dev',
     url: 'http://localhost:3000',
     reuseExistingServer: !process.env.CI,
   }
   ```

---

### Issue 3: Vercel Build Fails

**Symptoms:** Build succeeds locally but fails on Vercel

**Solutions:**

1. **Check environment variables are set in Vercel**

2. **Verify build command:**
   - Go to Project Settings → Build & Output Settings
   - Build Command: `pnpm build`

3. **Check logs in Vercel dashboard**

4. **Test production build locally:**
   ```bash
   pnpm build
   pnpm start
   ```

---

## 📋 Acceptance Criteria Checklist

### Testing

- [ ] Unit tests written for components
- [ ] Utility functions tested
- [ ] Test coverage >80%
- [ ] E2E tests cover main user flows
- [ ] All tests pass locally
- [ ] Tests pass in CI

### CI/CD

- [ ] GitHub Actions workflow created
- [ ] Lint job passes
- [ ] Type check job passes
- [ ] Test job passes
- [ ] Build job passes
- [ ] PR checks required before merge

### Deployment

- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Production deployment successful
- [ ] Custom domain configured (optional)
- [ ] Preview deployments work

### Git Workflow

- [ ] Branch protection enabled on `main`
- [ ] PR reviews required
- [ ] Status checks required
- [ ] Pre-commit hooks working
- [ ] Conventional commits enforced

### Documentation

- [ ] README updated with badges
- [ ] CONTRIBUTING.md created
- [ ] Deployment process documented
- [ ] Environment variables documented

---

## 🎓 Key Takeaways for Junior Developers

### What You Learned:

1. **Testing Pyramid:**
   - Unit tests (many, fast, isolated)
   - Integration tests (fewer, slower)
   - E2E tests (few, slowest, most realistic)

2. **CI/CD Benefits:**
   - Catch bugs before merge
   - Consistent code quality
   - Automated deployment
   - Faster development cycle

3. **Git Workflow:**
   - Feature branches
   - Pull requests
   - Code review
   - Protected branches

### Testing Best Practices:

- ✅ **Test behavior, not implementation**
- ✅ **Write tests before fixing bugs**
- ✅ **Keep tests simple and focused**
- ✅ **Use descriptive test names**
- ✅ **Don't test third-party code**

---

## 📚 Additional Resources

### Testing

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Docs](https://playwright.dev/)

### CI/CD

- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)

### Git

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## 🎯 Time Tracking Template

| Task              | Estimated   | Actual | Notes |
| ----------------- | ----------- | ------ | ----- |
| Testing setup     | 35min       |        |       |
| Component tests   | 2-3hr       |        |       |
| Utility tests     | 1-2hr       |        |       |
| Playwright setup  | 30min       |        |       |
| E2E tests         | 2-3hr       |        |       |
| GitHub Actions    | 1hr         |        |       |
| Vercel deployment | 30min       |        |       |
| Branch protection | 15min       |        |       |
| Pre-commit hooks  | 20min       |        |       |
| Documentation     | 1hr         |        |       |
| Final testing     | 2hr         |        |       |
| **Total**         | **24-32hr** |        |       |

---

## 🚀 Ready to Start?

**Before you begin:**

1. ✅ Have Phase 6 completed
2. 📝 Create branch: `git checkout -b feature/phase-7-testing`
3. ☕ Get ready for some test-driven development!

**Success Criteria:**

- All tests passing ✅
- CI pipeline green ✅
- Deployed to production ✅
- Branch protection active ✅
- Pre-commit hooks working ✅

Good luck shipping to production! 🚀🎉
