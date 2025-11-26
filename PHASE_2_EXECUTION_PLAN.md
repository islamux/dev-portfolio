# Phase 2 Execution Plan: Layout & Design System

> **Timeline:** 3-4 days (24-32 hours)  
> **Difficulty:** Intermediate  
> **Prerequisites:** Phase 1 completed, basic understanding of React components

---

## 📋 Overview

**Phase Goal:** Build a complete design system with responsive layout, dark mode, and reusable UI components.

**What You'll Build:**

- ✅ Base UI components (Container, Button, Icon)
  - ✅ **FIXED:** Icon multi-path rendering (sun, menu, close icons)
  - ✅ **FIXED:** Button component variant prop typo in SiteHeader
- ✅ Site Header with navigation, language switcher, and dark mode toggle
- ✅ Site Footer with social links
- ✅ Tailwind design tokens (colors, fonts, spacing)
- ✅ Dark mode functionality using `next-themes`
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility features (keyboard navigation, ARIA labels)

---

## 🎯 Learning Objectives

By the end of Phase 2, you will understand:

- How to create reusable React components with TypeScript
- The difference between Server and Client Components in Next.js
- How to implement dark mode that persists across page reloads
- Responsive design patterns using Tailwind CSS
- Accessibility best practices for web applications

---

## 📅 Daily Timeline

### **Day 1: Foundation & Base Components** (6-8 hours)

#### Morning (3-4 hours): Setup & Understanding

1. Review Phase 2 requirements
2. Study example components
3. Set up folder structure
4. Create base components

#### Afternoon (3-4 hours): Implementation

1. Build Container component
2. Build Button component
3. Build Icon component
4. Test components in isolation

---

### **Day 2: Header & Navigation** (8-10 hours)

#### Morning (4-5 hours): Desktop Header

1. Install dependencies (`next-themes`)
2. Create Providers wrapper
3. Build basic header structure
4. Add navigation links
5. Implement language switcher

#### Afternoon (4-5 hours): Mobile & Interactions

1. Create mobile hamburger menu
2. Add dark mode toggle
3. Implement menu open/close logic
4. Test responsiveness

---

### **Day 3: Footer & Tailwind Configuration** (4-6 hours)

#### Morning (2-3 hours): Footer

1. Create footer structure
2. Add social links
3. Add copyright section
4. Make responsive

#### Afternoon (2-3 hours): Design System

1. Configure Tailwind design tokens
2. Set up custom colors
3. Configure fonts (workaround for Next.js bug)
4. Add global styles

---

### **Day 4: Accessibility & Polish** (6-8 hours)

#### Morning (3-4 hours): Accessibility

1. Add skip-to-content link
2. Add keyboard focus styles
3. Add ARIA labels
4. Test keyboard navigation

#### Afternoon (3-4 hours): Testing & Refinement

1. Test all breakpoints
2. Verify dark mode persistence
3. Check accessibility with keyboard-only navigation
4. Fix bugs and polish

---

## 📝 Step-by-Step Implementation Guide

---

## **Step 1: Create Folder Structure**

**Estimated Time:** 15 minutes

### What to Do:

Create the following folders in your project:

```bash
mkdir -p src/components/ui
mkdir -p src/components/sections
mkdir -p src/hooks
```

### Explanation:

- `src/components/ui/` - For reusable, generic components (Button, Container, etc.)
- `src/components/sections/` - For page-specific sections (Header, Footer, Hero, etc.)
- `src/hooks/` - For custom React hooks (e.g., `useTheme`, `useMediaQuery`)

### Verify:

```bash
ls -la src/components/
# Should show: ui/ and sections/
```

---

## **Step 2: Create Container Component**

**Estimated Time:** 30 minutes

### What It Does:

A `Container` component wraps your content and provides consistent max-width and padding across all pages.

### File: `src/components/ui/Container.tsx`

```tsx
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
}

/**
 * Container component - wraps content with consistent max-width and padding
 *
 * @example
 * <Container>
 *   <h1>Hello World</h1>
 * </Container>
 *
 * @example With custom element
 * <Container as="section" className="bg-gray-100">
 *   <p>Section content</p>
 * </Container>
 */
export function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={`
        mx-auto 
        w-full 
        max-w-7xl 
        px-4 
        sm:px-6 
        lg:px-8 
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
```

### 🎓 Understanding the Code:

- **`interface ContainerProps`** - Defines what data this component accepts
  - `children`: The content inside the Container
  - `className?`: Optional additional CSS classes (the `?` means optional)
  - `as?`: Change the HTML element (default is `div`)

- **Template literal in className** - Combines multiple classes
  - `mx-auto`: Centers the container horizontally
  - `max-w-7xl`: Maximum width (1280px)
  - `px-4 sm:px-6 lg:px-8`: Responsive padding (mobile → tablet → desktop)

### Test It:

Create a test page `app/test/page.tsx`:

```tsx
import { Container } from "@/components/ui/Container";

export default function TestPage() {
  return (
    <Container className="bg-blue-100">
      <h1 className="text-2xl font-bold">Container Test</h1>
      <p>This content is centered with consistent padding.</p>
    </Container>
  );
}
```

Visit `http://localhost:3000/test` and resize your browser window to see responsive padding.

---

## **Step 3: Create Button Component**

**Estimated Time:** 45 minutes

### What It Does:

A flexible Button component with different variants (primary, secondary) and sizes.

### File: `src/components/ui/Button.tsx`

```tsx
"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

/**
 * Button component with variants and sizes
 *
 * @example
 * <Button variant="primary" onClick={() => console.log("Clicked!")}>
 *   Click Me
 * </Button>
 */
export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {

  // Base styles (applied to all buttons)
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant styles
  const variants = {
    primary:
      "bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 dark:bg-brand-600 dark:hover:bg-brand-700",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
  };

  // Size styles
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 🎓 Understanding the Code:

- **`"use client"`** - This is a Client Component (needs interactivity like `onClick`)
- **`extends React.ButtonHTMLAttributes`** - Inherits all standard button props
- **`...props`** - Spreads all other props (onClick, disabled, etc.)
- **Object-based styling** - Clean way to manage multiple variants
- **Focus-visible** - Shows focus ring only for keyboard navigation (not mouse clicks)

### Test It:

Update `app/test/page.tsx`:

```tsx
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function TestPage() {
  return (
    <Container className="py-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Button Test</h1>

      <div className="space-x-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <div className="space-x-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>

      <div>
        <Button disabled>Disabled Button</Button>
      </div>
    </Container>
  );
}
```

### ⚠️ Common Button Component Issues to Avoid:

If you're using an existing Button component that doesn't work, check for these issues:

1. **Typo in prop name:** It should be `variant` (not `varient`)
2. **Missing `"use client"` directive:** Required for interactivity
3. **Export style:** Should use named export `export function Button()` (not default export)

---

## **Step 4: Create Icon Component**

**Estimated Time:** 30 minutes

### What It Does:

A wrapper for SVG icons to make them easier to use consistently.

### File: `src/components/ui/Icon.tsx`

```tsx
import React from "react";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * Icon component - wrapper for SVG icons
 *
 * @example
 * <Icon name="github" size={24} />
 */
export function Icon({ name, size = 24, className = "" }: IconProps) {
  // Map icon names to SVG paths
  const icons: Record<string, string> = {
    github:
      "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
    twitter:
      "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    linkedin:
      "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
    gitlab:
      "M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0118.6 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51L23 13.45a.84.84 0 01-.35.94z",
    moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    sun: "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
    menu: "M3 12h18M3 6h18M3 18h18",
    close: "M18 6L6 18M6 6l12 12",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={icons[name] || ""} />
    </svg>
  );
}
```

### 🎓 Understanding the Code:

- **`Record<string, string>`** - TypeScript type for an object with string keys/values
- **`aria-hidden="true"`** - Icons are decorative, screen readers should ignore them
- **`currentColor`** - SVG inherits text color from parent element

---

## **Step 5: Install Dark Mode Dependencies**

**Estimated Time:** 10 minutes

### Install `next-themes`:

```bash
pnpm add next-themes
```

### What is `next-themes`?

A library that handles dark mode in Next.js with:

- No flash on page load (prevents white screen in dark mode)
- localStorage persistence (remembers user preference)
- System theme detection (respects OS dark mode setting)

---

## **Step 6: Create Providers Wrapper**

**Estimated Time:** 20 minutes

### What It Does:

Wraps your app with the ThemeProvider to enable dark mode everywhere.

### File: `app/providers.tsx`

```tsx
"use client";

import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers wrapper for client-side providers
 * Used in root layout to wrap entire app
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
```

### 🎓 Understanding the Props:

- **`attribute="class"`** - Uses `class="dark"` on `<html>` element
- **`defaultTheme="system"`** - Uses OS theme preference initially
- **`enableSystem`** - Allows auto-detection of system theme
- **`disableTransitionOnChange`** - Prevents jarring color transitions

### Update Root Layout:

**File: `app/layout.tsx`**

```tsx
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Your Name - Portfolio",
  description: "Full-stack developer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 🎓 Key Points:

- **`suppressHydrationWarning`** - Prevents warning when theme changes `<html>` class
- **`antialiased`** - Makes fonts look smoother

---

## **Step 7: Configure Tailwind Design Tokens**

**Estimated Time:** 30 minutes

### What Are Design Tokens?

Design tokens are reusable values (colors, fonts, spacing) that ensure visual consistency.

### ⚠️ File Name Note:

Your project uses `tailwind.config.js` (not `.ts` as shown in examples).

### File: `tailwind.config.js`

```js
// tailwind.config.js
import { type } from 'tailwindcss';

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Primary brand color
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Courier New", "monospace"],
      },
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};
```

### ⚠️ Critical: Content Paths

The `content` array is **ESSENTIAL** - without it, Tailwind won't scan your files and classes won't work! Make sure it includes:
- `./app/**/*.{js,ts,jsx,tsx,mdx}` - For Next.js app router
- `./src/**/*.{js,ts,jsx,tsx,mdx}` - For your components

---

## **Step 8: Fix Font Loading (Critical!)**

**Estimated Time:** 20 minutes

### ⚠️ Important: Next.js 16.0.3 Font Bug

There's a known bug in Next.js 16.0.3 where `next/font/google` doesn't work with Turbopack.

### Workaround: Use CSS `@font-face`

**File: `app/globals.css`**

```css
/* Load fonts from Google CDN - bypasses Turbopack bug */
@font-face {
  font-family: "Geist";
  src: url("https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFWNOITd.woff2")
    format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Geist Mono";
  src: url("https://fonts.gstatic.com/s/geistmono/v4/or3nQ6H-1_WfwkMZI_qYFrcdmhHkjko.woff2")
    format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@import "tailwindcss";

:root {
  --font-geist-sans: "Geist", system-ui, sans-serif;
  --font-geist-mono: "Geist Mono", "Courier New", monospace;
}

body {
  font-family: var(--font-geist-sans);
}

/* Dark mode background colors */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

---

## **Step 9: Create Site Header**

**Estimated Time:** 2-3 hours

### What It Does:

The main navigation bar with logo, nav links, language switcher, and dark mode toggle.

### File: `src/components/sections/SiteHeader.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
        href="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Islamux
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-500 ${
                  pathname === link.href
                    ? "text-brand-500"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Theme toggle + Language */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  <Icon name="sun" size={20} />
                ) : (
                  <Icon name="moon" size={20} />
                )}
              </Button>
            )}

            {/* Language Switcher (placeholder) */}
            <select
              className="text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
              defaultValue="en"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name={isMenuOpen ? "close" : "menu"} size={24} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-brand-50 text-brand-500 dark:bg-brand-900/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
```

### 🎓 Understanding the Code:

**useState Hooks:**

- `isMenuOpen` - Tracks if mobile menu is visible
- `mounted` - Ensures component is mounted before checking theme (prevents hydration error)

**useEffect Hooks:**

- First one sets `mounted` to true after component loads
- Second one closes mobile menu when user navigates to new page

**Sticky Header:**

- `sticky top-0` - Header stays at top when scrolling
- `backdrop-blur-sm` - Blurred background effect (macOS-style)
- `bg-white/80` - Semi-transparent background

---

## **Step 10: Create Site Footer**

**Estimated Time:** 1 hour

### File: `src/components/sections/SiteFooter.tsx`

```tsx
import Link from "next/link";
import { Container } from "../ui/Container";
import { Icon } from "../ui/Icon";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/islamux",
      icon: "github",
    },
    {
      name: "Twitter",
      href: "https://twitter.com/islamux",
      icon: "twitter",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/fathi-alqadasi-7893471b/",
      icon: "linkedin",
    },
    {
      name: "GitLab",
      href: "https://gitlab.com/islamux",
      icon: "gitlab",
    },
  ];

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <Container>
        <div className="py-12 md:py-16">
          {/* Top section: Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                About
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Full-stack developer passionate about open source and building
                great user experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            {/* Social */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Connect
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors"
                    aria-label={link.name}
                  >
                    <Icon name={link.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom section: Copyright */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              © {currentYear} Islamux. Built with Next.js and Tailwind CSS.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
```

---

## **Step 11: Add Accessibility Features**

**Estimated Time:** 1 hour

### Create Skip-to-Content Link

**File: `src/components/ui/SkipToContent.tsx`**

```tsx
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-lg"
    >
      Skip to content
    </a>
  );
}
```

### Add to Root Layout:

```tsx
import { SkipToContent } from "@/components/ui/SkipToContent";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <SkipToContent />
        <Providers>{/* ... */}</Providers>
      </body>
    </html>
  );
}
```

### Add Focus Styles to `globals.css`:

```css
/* Enhanced keyboard focus styles */
*:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## **Step 12: Update Root Layout with Header/Footer**

**Estimated Time:** 15 minutes

**File: `app/layout.tsx`**

```tsx
import "./globals.css";
import { Providers } from "./providers";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";

export const metadata = {
  title: "Islamux - Full-Stack Developer",
  description:
    "Portfolio of Islamux - Full-stack developer, open source contributor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <SkipToContent />
        <Providers>
          <SiteHeader />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
```

### 🎓 Understanding the Layout:

- **`flex flex-col min-h-screen`** - Makes footer stick to bottom
- **`flex-grow`** on `<main>` - Makes main content take up available space
- **`id="main-content"`** - Target for skip-to-content link

---

## **Step 13: Test Everything**

**Estimated Time:** 2 hours

### Testing Checklist:

#### ✅ Responsive Design

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test breakpoints:
   - Mobile: 375px (iPhone SE)
   - Tablet: 768px (iPad)
   - Desktop: 1280px (laptop)
   - Large: 1920px (desktop)

#### ✅ Dark Mode

1. Click theme toggle button
2. Reload page (dark mode should persist)
3. Check localStorage: `localStorage.getItem('theme')`
4. Test system theme preference:
   - Windows: Settings → Personalization → Colors → Dark
   - Mac: System Preferences → General → Appearance → Dark

#### ✅ Accessibility

1. **Keyboard Navigation:**
   - Press Tab repeatedly - focus should be visible
   - Press Enter on links - should navigate
   - Press Escape on mobile menu - should close

2. **Screen Reader:**
   - Install NVDA (Windows) or VoiceOver (Mac)
   - Navigate with screen reader enabled
   - Verify all links/buttons are announced

#### ✅ Mobile Menu

1. Resize to mobile (<768px)
2. Click hamburger icon - menu should open
3. Click nav link - menu should close
4. Navigate to different page - menu should close

---

## 🐛 Common Issues & Solutions

### Issue 1: Dark Mode Flash on Page Load

**Symptoms:** White flash when reloading in dark mode

**Solution:**

1. Verify `suppressHydrationWarning` on `<html>`
2. Check ThemeProvider has `disableTransitionOnChange`
3. Ensure no `Date.now()` or random values in server components

---

### Issue 2: Mobile Menu Doesn't Close on Route Change

**Symptoms:** Menu stays open after clicking a link

**Solution:**
Add `usePathname()` useEffect in `SiteHeader.tsx`:

```tsx
const pathname = usePathname();

useEffect(() => {
  setIsMenuOpen(false);
}, [pathname]);
```

---

### Issue 3: Tailwind Classes Not Working

**Symptoms:** Components render but no styles appear

**Solution:**

1. Check `tailwind.config.ts` content paths:
   ```ts
   content: [
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
     "./src/**/*.{js,ts,jsx,tsx,mdx}",
   ];
   ```
2. Restart dev server: `Ctrl+C`, then `pnpm dev`
3. Clear `.next` folder: `rm -rf .next`

---

### Issue 4: Hydration Error

**Symptoms:** Console error "Text content does not match server-rendered HTML"

**Common Causes:**

- Using `Date.now()` in Server Component
- Using `Math.random()` in Server Component
- Conditionally rendering based on `window` object

**Solution:**
Move dynamic content to Client Component with `"use client"` directive.

---

### Issue 5: Icons Not Showing

**Symptoms:** Icon component renders but no SVG visible

**Solution:**

1. Check icon name matches key in `icons` object
2. Verify `currentColor` is inheriting text color
3. Add className with text color: `className="text-gray-900 dark:text-white"`

---

### Issue 6: Multi-Path Icons Not Rendering (sun, menu, close)

**Symptoms:** Icons like sun, menu, and close don't display properly or show incomplete graphics

**Root Cause:** Multi-path icons require separate `<path>` elements for each command, not a single string with multiple commands.

**Solution:** Update `Icon.tsx` to support both single and multi-path icons:

```tsx
// Define multi-path icons as arrays:
sun: [
  "M12 1v2",
  "M12 21v2",
  "M4.22 4.22l1.42 1.42",
  // ... etc
]

// Render logic:
const pathArray = Array.isArray(paths) ? paths : [paths];
return (
  <svg>
    {pathArray.map((path, index) => (
      <path key={index} d={path} />
    ))}
  </svg>
);
```

---

## 📋 Acceptance Criteria Checklist

Before marking Phase 2 complete, verify:

- [ ] Header appears on all pages
- [ ] Footer appears on all pages
- [ ] Navigation links work correctly
- [ ] Active page is highlighted in nav
- [ ] Dark mode toggle works
- [ ] Dark mode persists after reload
- [ ] Mobile menu opens/closes
- [ ] Mobile menu closes on route change
- [ ] Responsive at all breakpoints (640, 768, 1024, 1280)
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Focus visible on all interactive elements
- [ ] Skip-to-content link appears on Tab press
- [ ] All social links in footer work
- [ ] No console errors
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No ESLint errors (`pnpm lint`)

---

## 🎓 Key Takeaways for Junior Developers

### What You Learned:

1. **Component Architecture:** Breaking UI into reusable pieces
2. **Props & TypeScript:** Strongly typing component interfaces
3. **Client vs Server Components:** When to use interactivity
4. **Responsive Design:** Mobile-first Tailwind approach
5. **Dark Mode:** Persistent theme switching
6. **Accessibility:** Keyboard nav, ARIA labels, focus management

### Next Steps:

Once Phase 2 is complete:

- **Phase 3:** Build pages and wire up content
- **Phase 4:** Add animations and polish
- **Phase 5:** Performance optimization
- **Phase 6:** Deployment to Vercel

---

## 📚 Additional Resources

### Tailwind CSS

- [Official Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)
- [Color Palette Generator](https://uicolors.app/)

### Next.js

- [App Router Docs](https://nextjs.org/docs/app)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

### Accessibility

- [WebAIM Keyboard Testing](https://webaim.org/articles/keyboard/)
- [ARIA Labels Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)

### Dark Mode

- [next-themes Docs](https://github.com/pacocoursey/next-themes)

---

## 🎯 Time Tracking Template

Use this to track your actual time spent:

| Task                | Estimated   | Actual | Notes |
| ------------------- | ----------- | ------ | ----- |
| Folder setup        | 15min       |        |       |
| Container component | 30min       |        |       |
| Button component    | 45min       |        |       |
| Icon component      | 30min       |        |       |
| Dark mode setup     | 30min       |        |       |
| Tailwind config     | 30min       |        |       |
| Header component    | 2-3hr       |        |       |
| Footer component    | 1hr         |        |       |
| Accessibility       | 1hr         |        |       |
| Testing             | 2hr         |        |       |
| **Total**           | **24-32hr** |        |       |

---

## 🚀 Ready to Start?

**Before you begin:**

1. ☕ Make coffee/tea
2. 📝 Create a branch: `git checkout -b feature/phase-2-layout`
3. ⏱️ Set a timer for focused 25-min work sessions (Pomodoro technique)
4. 💬 Join Next.js Discord if you get stuck: [discord.gg/nextjs](https://discord.gg/nextjs)

**Remember:**

- Don't rush - understanding is more valuable than speed
- Take breaks every hour
- Test as you build, don't wait until the end
- Ask for help when stuck for >30 minutes

Good luck! 🎉
