# shadcn/ui Tutorial - Part 1: Setup & Installation

## Introduction

Welcome to the shadcn/ui tutorial! This is **Part 1** which covers the setup and installation process. By the end of this part, you'll have a working shadcn/ui environment ready for building beautiful, accessible UI components.

## What is shadcn/ui?

shadcn/ui is a collection of **high-quality, accessible, and customizable** React components built with:
- **Radix UI** - For accessibility and component primitives
- **Tailwind CSS** - For styling
- **TypeScript** - For type safety
- **class-variance-authority** - For variant management

Key features:
- ✅ No external CSS files
- ✅ Full control over styles via Tailwind
- ✅ Accessible by default
- ✅ Type-safe with TypeScript
- ✅ Zero runtime dependencies

## Prerequisites

Before starting, ensure you have:
1. **Node.js** (v16 or higher)
2. **pnpm** (or npm/yarn) as package manager
3. **Next.js** project (or any React project)
4. **Tailwind CSS** already configured

## Step 1: Initialize shadcn/ui

Run the shadcn/ui CLI to initialize the setup:

```bash
npx shadcn-ui@latest init
```

This will prompt you with several questions:

```bash
? Which style would you like to use? ❯ Default
? Which color would you like to use as base? ❯ Slate
? Where is your global CSS file? ✓ src/app/globals.css
? Do you want to use CSS variables for colors? ✓ Yes
? Where is your tailwind.config.js located? ✓ tailwind.config.js
```

**Recommendations for this project:**
- Style: **Default** (clean, modern look)
- Color: **Slate** (neutral, professional)
- CSS variables: **Yes** (better theming support)

## Step 2: Install Required Dependencies

The CLI will automatically install the core dependencies:

```bash
pnpm add clsx tailwind-merge class-variance-authority
pnpm add @radix-ui/react-slot
```

These packages are essential:
- **clsx** - Utility for constructing className strings
- **tailwind-merge** - Smart merging of Tailwind classes
- **class-variance-authority** - Variant management system
- **@radix-ui/react-slot** - Component composition utility

## Step 3: Configure Tailwind CSS

The CLI will update your `tailwind.config.js`. Here's what it should look like:

```javascript
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

**Key changes:**
- `darkMode: ['class']` - Enables class-based dark mode
- CSS variables for colors - Makes theming easier
- Animation utilities - For smooth transitions

## Step 4: Configure Global CSS

Update your `globals.css` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**What this does:**
- Defines CSS variables for all color schemes
- Sets up light and dark mode variables
- Applies base styles to all elements
- Ensures proper background and text colors

## Step 5: Create Utility Functions

Create a `src/lib/utils.ts` file for the `cn` utility:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**What this does:**
- Combines multiple className strings intelligently
- Merges Tailwind classes properly (avoids conflicts)
- Used throughout all shadcn components

## Step 6: Add Component Index (Optional but Recommended)

Create `src/components/ui/index.ts` to export all components:

```typescript
// Component Index
// This file exports all shadcn/ui components for easy import

export * from "./button"
export * from "./input"
export * from "./label"
export * from "./textarea"
export * from "./card"
export * from "./badge"
export * from "./sheet"
export * from "./alert"
export * from "./separator"
export * from "./skeleton"
export * from "./tooltip"
```

**Benefits:**
- Single import point for all components
- Easier to manage imports
- Cleaner code in your components

## Step 7: Add Theme Provider (for Dark Mode)

Install next-themes:

```bash
pnpm add next-themes
```

Create or update `src/app/providers.tsx`:

```tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider>
}
```

Update `src/app/layout.tsx`:

```tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

## Step 8: Add Icons (Optional)

Install Lucide icons:

```bash
pnpm add lucide-react
```

Create `src/components/ui/Icon.tsx`:

```tsx
import { LucideProps, LucideIcon } from 'lucide-react'

const icons = {
  // Add your icons here
  menu: 'Menu',
  x: 'X',
  // ... other icons
}

type IconName = keyof typeof icons

interface IconProps extends LucideProps {
  name: IconName
}

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = icons[name] as LucideIcon
  return <LucideIcon {...props} />
}
```

## Step 9: Verify Installation

Run your development server:

```bash
pnpm dev
```

Check that:
- ✅ No errors in console
- ✅ Tailwind CSS is working
- ✅ Dark mode toggle works (if implemented)

## Troubleshooting Common Issues

### Issue 1: Components not showing styles

**Solution:**
1. Check that Tailwind CSS is properly configured
2. Ensure the component has `'use client'` directive
3. Verify className props are being applied

### Issue 2: TypeScript errors

**Solution:**
```bash
pnpm add clsx tailwind-merge class-variance-authority @radix-ui/react-slot
```

### Issue 3: Dark mode not working

**Solution:**
1. Ensure `next-themes` is installed
2. Check that ThemeProvider is wrapping the app
3. Verify CSS variables are defined in globals.css

## Next Steps

You're now ready to start adding components! In **Part 2**, we'll cover:

- Adding your first component (Button)
- Understanding component structure
- Customizing components with variants
- Using the cn utility effectively

Continue to [Part 2: Components](SHADCN_TUTORIAL_PART_2_COMPONENTS.md)

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [class-variance-authority](https://cva.style/docs)

---

**Tutorial Prepared By**: Mistral Vibe AI Assistant
**Date**: 2025-12-16
**Project**: dev_portfolio
