# Design System Styles Guide

## 🎨 Organizing Component Styles with Design Tokens

A comprehensive guide to managing component styles in a scalable, maintainable way using design tokens and best practices.

---

## 📚 Table of Contents

1. [The Problem](#the-problem)
2. [Solution Overview](#solution-overview)
3. [Approach 1: Design Token System](#approach-1-design-token-system-recommended)
4. [Approach 2: CSS Variables Theme](#approach-2-css-variables-theme)
5. [Approach 3: Tailwind Plugin](#approach-3-tailwind-plugin-enterprise-level)
6. [File Structure](#file-structure)
7. [Recommendations](#recommendations)

---

## The Problem

### Inline Styles in Components (Anti-pattern ❌)

```tsx
// ❌ BAD - Don't do this
export function Button() {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-all duration-200 focus-visible:outline-none
        bg-brand-500 text-white hover:bg-brand-600
        disabled:opacity-50
      `}
    >
      Click Me
    </button>
  );
}
```

**Issues:**
- Hard to maintain consistency across components
- Duplicated code
- Difficult to update styles globally
- No single source of truth
- Can't reuse in other components
- Mixing concerns (logic + styles)

---

## Solution Overview

### Design Tokens to the Rescue ✅

**Design tokens** are named, reusable values (colors, spacing, typography) that serve as the single source of truth for your design system.

**Benefits:**
- ✅ Consistency across all components
- ✅ Easy to maintain and update
- ✅ Type-safe with TypeScript
- ✅ Scalable to multiple components
- ✅ Separation of concerns
- ✅ Can generate design documentation
- ✅ Easy theming support

---

## Approach 1: Design Token System (Recommended)

### File: `src/styles/theme/tokens.ts`

```ts
/**
 * Design Tokens - Single Source of Truth
 * These are the foundational values for your entire design system
 */

export const tokens = {
  // ===== COLORS =====
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
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
    success: {
      50: "#f0fdf4",
      500: "#22c55e",
      700: "#15803d",
    },
    error: {
      50: "#fef2f2",
      500: "#ef4444",
      700: "#b91c1c",
    },
  },

  // ===== SPACING =====
  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem",  // 8px
    3: "0.75rem", // 12px
    4: "1rem",    // 16px
    5: "1.25rem", // 20px
    6: "1.5rem",  // 24px
    8: "2rem",    // 32px
    10: "2.5rem", // 40px
    12: "3rem",   // 48px
    16: "4rem",   // 64px
    20: "5rem",   // 80px
    24: "6rem",   // 96px
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",   // 12px
      sm: "0.875rem",  // 14px
      base: "1rem",    // 16px
      lg: "1.125rem",  // 18px
      xl: "1.25rem",   // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
      "5xl": "3rem",     // 48px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // ===== BORDERS & RADII =====
  borderRadius: {
    none: "0",
    sm: "0.125rem",  // 2px
    md: "0.375rem",  // 6px
    lg: "0.5rem",    // 8px
    xl: "0.75rem",   // 12px
    "2xl": "1rem",   // 16px
    full: "9999px",
  },

  // ===== SHADOWS =====
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  // ===== ANIMATION =====
  animation: {
    duration: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
    },
    easing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },
} as const;

// ===== TYPE DEFINITIONS =====
export type TokenCategory = keyof typeof tokens;
export type ColorScale = keyof typeof tokens.colors.brand;
export type SpacingValue = keyof typeof tokens.spacing;
export type FontSize = keyof typeof tokens.typography.fontSize;
export type BorderRadius = keyof typeof tokens.borderRadius;

// ===== HELPER FUNCTIONS =====
export function getColor(color: string, scale?: number): string {
  // Example: getColor('brand', 500) => "#0ea5e9"
  if (scale && tokens.colors[color as keyof typeof tokens.colors]) {
    const colorScale = tokens.colors[color as keyof typeof tokens.colors] as any;
    return colorScale[scale] || colorScale[500];
  }
  return tokens.colors[color as any] || "";
}

export function getSpacing(size: SpacingValue): string {
  return tokens.spacing[size];
}

export function getFontSize(size: FontSize): string {
  return tokens.typography.fontSize[size];
}
```

### File: `src/components/ui/button.config.ts`

```ts
/**
 * Button Component Styles Configuration
 * Uses design tokens to define button appearance
 */

import { tokens } from "@/styles/theme/tokens";

// Base styles shared across all button variants
export const buttonBaseStyles = `
  inline-flex items-center justify-center
  font-medium transition-all duration-${tokens.animation.duration.normal}
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  rounded-${tokens.borderRadius.lg}
`;

// Button variants with their styles
export const buttonVariants = {
  primary: `
    bg-[color:var(--color-brand-500)] text-white
    hover:bg-[color:var(--color-brand-600)]
    focus-visible:ring-[color:var(--color-brand-500)]
    dark:bg-[color:var(--color-brand-600)]
    dark:hover:bg-[color:var(--color-brand-700)]
  `,

  secondary: `
    bg-gray-200 text-gray-900
    hover:bg-gray-300 focus-visible:ring-gray-500
    dark:bg-gray-700 dark:text-white
    dark:hover:bg-gray-600 dark:focus-visible:ring-gray-500
  `,

  ghost: `
    bg-transparent text-gray-700
    hover:bg-gray-100 focus-visible:ring-gray-500
    dark:text-gray-300 dark:hover:bg-gray-800
    dark:focus-visible:ring-gray-500
  `,

  destructive: `
    bg-[color:var(--color-error-500)] text-white
    hover:bg-[color:var(--color-error-700)]
    focus-visible:ring-[color:var(--color-error-500)]
  `,

  success: `
    bg-[color:var(--color-success-500)] text-white
    hover:bg-[color:var(--color-success-700)]
    focus-visible:ring-[color:var(--color-success-500)]
  `,
} as const;

// Button sizes with consistent spacing from tokens
export const buttonSizes = {
  xs: `
    px-3 py-1.5 text-${tokens.typography.fontSize.xs}
  `,
  sm: `
    px-3 py-2 text-${tokens.typography.fontSize.sm}
  `,
  md: `
    px-4 py-2 text-${tokens.typography.fontSize.base}
  `,
  lg: `
    px-6 py-3 text-${tokens.typography.fontSize.lg}
  `,
  xl: `
    px-8 py-4 text-${tokens.typography.fontSize.xl}
  `,
} as const;

// Export types for better IntelliSense
export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

// Default button configuration
export const buttonDefaultConfig = {
  variant: "primary" as ButtonVariant,
  size: "md" as ButtonSize,
};
```

### File: `src/components/ui/Button.tsx`

```tsx
"use client";

import React from "react";
import {
  buttonBaseStyles,
  buttonVariants,
  buttonSizes,
  type ButtonVariant,
  type ButtonSize,
  buttonDefaultConfig,
} from "./button.config";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: ButtonVariant;

  /** Size of the button */
  size?: ButtonSize;

  /** Button content */
  children: React.ReactNode;

  /** Additional CSS classes */
  className?: string;

  /** Whether button is in loading state */
  isLoading?: boolean;
}

/**
 * Button Component
 *
 * A reusable button component with multiple variants and sizes.
 * Uses design tokens for consistent styling across the application.
 *
 * @example
 * <Button variant="primary" size="md">
 *   Click Me
 * </Button>
 *
 * @example
 * <Button variant="ghost" size="sm" onClick={handleClick}>
 *   Cancel
 * </Button>
 */
export function Button({
  variant = buttonDefaultConfig.variant,
  size = buttonDefaultConfig.size,
  children,
  className = "",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${buttonBaseStyles}
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// ===== USAGE EXAMPLES =====

/**
 * Example: Basic Usage
 */
function ExampleBasic() {
  return (
    <div className="flex gap-4">
      <Button variant="primary" onClick={() => console.log("Clicked!")}>
        Primary
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}

/**
 * Example: Different Sizes
 */
function ExampleSizes() {
  return (
    <div className="flex items-end gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  );
}

/**
 * Example: With Icons
 */
function ExampleWithIcons() {
  return (
    <Button variant="primary">
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      Add Item
    </Button>
  );
}

/**
 * Example: Loading State
 */
function ExampleLoading() {
  return (
    <Button variant="primary" isLoading>
      Saving...
    </Button>
  );
}

/**
 * Example: Disabled State
 */
function ExampleDisabled() {
  return (
    <Button variant="primary" disabled>
      Disabled Button
    </Button>
  );
}
```

---

## Approach 2: CSS Variables Theme

### File: `src/styles/theme/css-variables.css`

```css
/**
 * CSS Custom Properties
 * Define all design tokens as CSS variables for runtime theming
 */

/* ===== LIGHT THEME (DEFAULT) ===== */
:root {
  /* Colors - Brand */
  --color-brand-50: #f0f9ff;
  --color-brand-100: #e0f2fe;
  --color-brand-200: #bae6fd;
  --color-brand-300: #7dd3fc;
  --color-brand-400: #38bdf8;
  --color-brand-500: #0ea5e9;
  --color-brand-600: #0284c7;
  --color-brand-700: #0369a1;
  --color-brand-800: #075985;
  --color-brand-900: #0c4a6e;
  --color-brand-950: #082f49;

  /* Colors - Gray */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  /* Colors - Semantic */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-700: #15803d;

  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-700: #b91c1c;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;

  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}

/* ===== DARK THEME ===== */
[data-theme="dark"] {
  /* Override colors for dark mode */
  --color-brand-500: #38bdf8;
  --color-brand-600: #0ea5e9;

  --color-gray-50: #0a0a0a;
  --color-gray-100: #171717;
  --color-gray-200: #262626;
  --color-gray-800: #1a1a1a;
  --color-gray-900: #0a0a0a;
}

/* ===== COMPONENT STYLES ===== */
/* Button Component */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all var(--duration-normal);
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  outline: none;
}

.button:focus-visible {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--primary {
  background-color: var(--color-brand-500);
  color: white;
}

.button--primary:hover {
  background-color: var(--color-brand-600);
}

.button--secondary {
  background-color: var(--color-gray-200);
  color: var(--color-gray-900);
}

.button--secondary:hover {
  background-color: var(--color-gray-300);
}

@media (prefers-color-scheme: dark) {
  .button--secondary {
    background-color: var(--color-gray-700);
    color: white;
  }

  .button--secondary:hover {
    background-color: var(--color-gray-600);
  }
}

.button--ghost {
  background-color: transparent;
  color: var(--color-gray-700);
}

.button--ghost:hover {
  background-color: var(--color-gray-100);
}

@media (prefers-color-scheme: dark) {
  .button--ghost {
    color: var(--color-gray-300);
  }

  .button--ghost:hover {
    background-color: var(--color-gray-800);
  }
}

.button--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.button--md {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-base);
}

.button--lg {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-lg);
}
```

### File: `src/components/ui/ButtonCSSVars.tsx`

```tsx
"use client";

import React from "react";
import "./button.css"; // Import the CSS file

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

/**
 * Button Component using CSS Variables
 * Theme-aware component that uses CSS custom properties
 */
export function ButtonCSSVars({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        button
        button--${variant}
        button--${size}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## Approach 3: Tailwind Plugin (Enterprise-level)

### File: `src/styles/theme/tailwind-plugin.ts`

```ts
/**
 * Custom Tailwind Plugin for Design System
 * This is an advanced approach for large-scale applications
 */

import type { Config } from "tailwindcss";
import { tokens } from "./tokens";

export function createDesignSystemPlugin() {
  return function({ addBase, addComponents, addUtilities, theme }: any) {
    // ===== ADD DESIGN TOKENS AS CSS CUSTOM PROPERTIES =====
    addBase({
      ":root": {
        // Brand colors
        ...Object.entries(tokens.colors.brand).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`--color-brand-${key}`]: value,
          }),
          {}
        ),
        // Gray colors
        ...Object.entries(tokens.colors.gray).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`--color-gray-${key}`]: value,
          }),
          {}
        ),
        // Spacing
        ...Object.entries(tokens.spacing).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`--spacing-${key}`]: value,
          }),
          {}
        ),
        // Typography
        ...Object.entries(tokens.typography.fontSize).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`--font-size-${key}`]: value,
          }),
          {}
        ),
      },
    });

    // ===== ADD COMPONENT CLASSES =====
    addComponents({
      // Button Component
      ".btn": {
        // Base styles
        "@apply inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg":
          {},

        // Variants
        "&--primary": {
          "@apply bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 dark:bg-brand-600 dark:hover:bg-brand-700":
            {},
        },

        "&--secondary": {
          "@apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600":
            {},
        },

        "&--ghost": {
          "@apply bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800":
            {},
        },

        // Sizes
        "&--xs": {
          "@apply px-3 py-1.5 text-xs": {},
        },

        "&--sm": {
          "@apply px-3 py-2 text-sm": {},
        },

        "&--md": {
          "@apply px-4 py-2 text-base": {},
        },

        "&--lg": {
          "@apply px-6 py-3 text-lg": {},
        },
      },

      // Container Component
      ".container-custom": {
        "@apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8": {},
      },

      // Card Component
      ".card": {
        "@apply rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900":
          {},
      },
    });

    // ===== ADD UTILITY CLASSES =====
    addUtilities({
      // Custom spacing utilities
      ".space-y-safe": {
        "> * + *": {
          marginTop: "var(--spacing-4)",
        },
      },

      // Custom text utilities
      ".text-balance": {
        "text-wrap": "balance",
      },

      // Custom animation utilities
      ".animate-fade-in": {
        animation: "fadeIn 0.2s ease-in-out",
      },

      "@keyframes fadeIn": {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    });
  };
}

// ===== USAGE IN TAILWIND CONFIG =====
const tailwindConfig: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Extend Tailwind theme with your tokens
      colors: {
        brand: tokens.colors.brand,
        gray: tokens.colors.gray,
      },
      fontSize: tokens.typography.fontSize,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
    },
  },
  plugins: [
    createDesignSystemPlugin(),
    // Add other plugins...
  ],
};
```

---

## File Structure

### Recommended Directory Structure

```
src/
├── styles/
│   ├── theme/
│   │   ├── tokens.ts                    # Design tokens (source of truth)
│   │   ├── css-variables.css            # CSS custom properties
│   │   ├── tailwind-plugin.ts           # Custom Tailwind plugin
│   │   └── index.ts                     # Barrel export
│   └── global.css                       # Global styles
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx                   # Button component
│   │   ├── button.config.ts             # Button configuration
│   │   ├── button.css                   # CSS styles (if using CSS vars)
│   │   ├── Container.tsx                # Container component
│   │   ├── Icon.tsx                     # Icon component
│   │   └── index.ts                     # Component exports
│   │
│   └── sections/
│       ├── SiteHeader.tsx               # Header section
│       └── SiteFooter.tsx               # Footer section
│
├── hooks/
│   ├── useTheme.ts                      # Theme hook
│   └── useMediaQuery.ts                 # Media query hook
│
└── types/
    └── design-system.ts                 # TypeScript type definitions
```

### Barrel Exports

**File: `src/styles/theme/index.ts`**
```ts
export { tokens, type TokenCategory, type ColorScale } from "./tokens";
export { getColor, getSpacing, getFontSize } from "./tokens";
export { buttonBaseStyles, buttonVariants, buttonSizes, type ButtonVariant, type ButtonSize } from "@/components/ui/button.config";
```

**File: `src/components/ui/index.ts`**
```ts
export { Button } from "./Button";
export { Container } from "./Container";
export { Icon } from "./Icon";
export { buttonVariants, buttonSizes, type ButtonVariant, type ButtonSize } from "./button.config";
```

---

## Recommendations

### For Different Project Sizes

#### 🚀 Small Projects (< 5 components)

**Use: Simple Config Files**

```
src/components/ui/
├── button.config.ts
├── Button.tsx
└── button.css (if needed)
```

**When to use:**
- Building a small portfolio or personal project
- Only a few components need theming
- Team of 1-2 developers
- Quick development is priority

---

#### 🏢 Medium Projects (5-20 components)

**Use: Design Token System (Approach 1)**

```
src/styles/theme/
├── tokens.ts
└── button.config.ts

src/components/ui/
└── Button.tsx
```

**When to use:**
- Building a professional portfolio
- Multiple developers working together
- Need consistency across components
- Plan to scale the project
- Want type safety

**Benefits:**
- ✅ Single source of truth
- ✅ Easy to maintain
- ✅ Type-safe
- ✅ Scales well

---

#### 🏛️ Large Projects (20+ components)

**Use: CSS Variables + Tailwind Plugin (Approach 2 + 3)**

```
src/styles/theme/
├── tokens.ts
├── css-variables.css
├── tailwind-plugin.ts
└── theme-provider.tsx

src/components/ui/
└── Button.tsx
```

**When to use:**
- Enterprise applications
- Multiple product lines
- Large team of developers
- Need runtime theming
- Need design documentation
- Strict design system requirements

**Benefits:**
- ✅ Runtime theme switching
- ✅ Easy to generate documentation
- ✅ Designer-friendly
- ✅ Maximum flexibility

---

### Decision Matrix

| Criteria | Simple Config | Design Tokens | CSS Variables | Tailwind Plugin |
|----------|---------------|---------------|---------------|-----------------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Scalability** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Type Safety** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Runtime Theming** | ❌ | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Learning Curve** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Maintenance** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Design Docs** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

### Best Practices Summary

#### ✅ DO:

1. **Extract styles into separate config files**
   - Separates concerns (logic vs. presentation)
   - Easier to maintain and test
   - Better organization

2. **Use TypeScript for all config files**
   - Better IntelliSense
   - Catch errors at compile time
   - Self-documenting code

3. **Name tokens clearly and consistently**
   - `brand-500` not `primary`
   - `spacing-4` not `md`
   - `font-size-base` not `text`

4. **Document your design tokens**
   ```ts
   /**
    * Brand color scale (0-950)
    * 50: Lightest tint
    * 500: Primary brand color
    * 950: Darkest shade
    */
   brand: { /* ... */ }
   ```

5. **Use semantic naming for variants**
   ```ts
   variants = {
     primary: "...",  // Main action
     secondary: "...", // Secondary action
     destructive: "...", // Destructive action
     success: "...",   // Success action
   }
   ```

6. **Export types from config files**
   ```ts
   export type ButtonVariant = keyof typeof buttonVariants;
   ```

#### ❌ DON'T:

1. **Don't mix styles with component logic**
   ```tsx
   // ❌ BAD
   const styles = {
     button: "px-4 py-2 bg-blue-500"
   };
   return <button className={styles.button}>;
   ```

2. **Don't hardcode values**
   ```tsx
   // ❌ BAD
   <div className="p-4 text-base">
   // ✅ GOOD
   <div className="p-[var(--spacing-4)] text-[var(--font-size-base)]">
   ```

3. **Don't duplicate styles**
   ```tsx
   // ❌ BAD - Same styles repeated
   <button className="px-4 py-2 bg-blue-500 rounded-lg">
   <button className="px-4 py-2 bg-blue-500 rounded-lg">

   // ✅ GOOD - Reuse config
   <button className={`${buttonBaseStyles} ${buttonVariants.primary}`}>
   ```

4. **Don't use inline styles for complex components**
   ```tsx
   // ❌ BAD
   <div style={{ padding: "1rem", backgroundColor: "white" }}>

   // ✅ GOOD
   <div className={styles.card}>
   ```

---

## Real-World Examples

### Example 1: Button with Icon

```tsx
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

function Example() {
  return (
    <Button variant="primary" size="md">
      <Icon name="plus" size={16} className="mr-2" />
      Create Project
    </Button>
  );
}
```

### Example 2: Button Group

```tsx
import { Button } from "@/components/ui/Button";

function ButtonGroup() {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
      <Button variant="secondary" size="sm" className="rounded-none border-0">
        Yesterday
      </Button>
      <Button variant="primary" size="sm" className="rounded-none border-l border-gray-200">
        Today
      </Button>
      <Button variant="secondary" size="sm" className="rounded-none border-l border-gray-200">
        Tomorrow
      </Button>
    </div>
  );
}
```

### Example 3: Form Actions

```tsx
import { Button } from "@/components/ui/Button";

function FormActions() {
  return (
    <div className="flex justify-end gap-4 pt-6">
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary" isLoading={isSaving}>
        Save Changes
      </Button>
    </div>
  );
}
```

---

## Performance Considerations

### 1. Tree Shaking

Make sure your styles are tree-shakeable:

```ts
// ✅ GOOD - Individual exports
export const buttonBaseStyles = "...";
export const buttonVariants = { ... };
export const buttonSizes = { ... };

// ❌ BAD - All in one object
export const buttonStyles = {
  base: "...",
  variants: { ... },
  sizes: { ... },
};
```

### 2. CSS Delivery

For CSS variables approach, use preload:

```html
<!-- In your layout head -->
<link
  rel="preload"
  href="/styles/theme/css-variables.css"
  as="style"
/>
<link rel="stylesheet" href="/styles/theme/css-variables.css" />
```

### 3. Critical CSS

Extract critical styles for above-the-fold content:

```css
/* styles/critical.css */
:root {
  --color-brand-500: #0ea5e9;
  --spacing-4: 1rem;
}
```

---

## Testing Your Design System

### Visual Regression Testing

```bash
# Install Chromatic or Storybook
npm install --save-dev @chromaui/cli

# Run visual tests
chromatic --project-token=YOUR_TOKEN
```

### Style Unit Testing

```tsx
// tests/components/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("applies primary variant styles", () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-brand-500");
  });

  it("applies correct size", () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });
});
```

---

## Documentation Generation

Generate design documentation automatically:

### Using Style Dictionary

```js
// style-dictionary.config.js
const StyleDictionary = require("style-dictionary");

StyleDictionary.extend({
  source: ["src/styles/theme/tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/css/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
        },
      ],
    },
    json: {
      transformGroup: "js",
      buildPath: "dist/json/",
      files: [
        {
          destination: "tokens.json",
          format: "json/flat",
        },
      ],
    },
  },
});
```

---

## Conclusion

### Quick Decision Guide

**Just getting started?**
→ Start with **Simple Config Files** (Approach 1 without tokens)

**Building a professional portfolio?**
→ Use **Design Token System** (Recommended)

**Need multiple themes or design system for products?**
→ Use **CSS Variables + Tailwind Plugin**

**Enterprise application with large team?**
→ Full **CSS Variables** with documentation generation

---

### Final Recommendations

1. **Start Simple** - Begin with config files, evolve as needed
2. **Be Consistent** - Use the same patterns across all components
3. **Document Everything** - Future you will thank you
4. **Type-Safe** - Always use TypeScript for config files
5. **Test Styles** - Don't forget to test your design system
6. **Iterate** - Design systems evolve, plan for change

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Design Tokens Community Group](https://design-tokens.github.io/community-group/)
- [Style Dictionary](https://github.com/amzn/style-dictionary)
- [Open Props](https://open-props.style/) - Great design token library
- [Tailwind UI Components](https://tailwindui.com/components)
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Chakra UI](https://chakra-ui.com/) - Component library example

---

**Happy coding! 🎨**
