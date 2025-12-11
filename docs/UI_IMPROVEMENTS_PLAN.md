# UI & Code Improvement Guide

This guide details the steps to implement the recommended UI enhancements and critical code fixes. Follow these steps to elevate your portfolio's design and code quality.

## ✅ Step 1: Critical Fix (SEO)

**File:** `src/app/[locale]/page.tsx`

**Action:** Rename the metadata function to `generateMetadata` (capital 'M', lowercase 'd').

```typescript
// BEFORE
export async function generateMetaData({ params }: PageProps): Promise<Metadata> { ... }

// AFTER
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { ... }
```

---

## 🎨 Step 2: Install Dependencies

We'll use `framer-motion` for smooth entry animations.

```bash
pnpm add framer-motion
```

---

## ✨ Step 3: UI Enhancements

### 3.1 Create Motion Wrapper

Isolate client-side animation logic to keep server components fast.

**File:** `src/components/ui/Motion.tsx` (Create new file)

```tsx
"use client";

import { motion, MotionProps } from "framer-motion";

interface DivProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const MotionDiv = ({ children, className, ...props }: DivProps) => (
  <motion.div className={className} {...props}>
    {children}
  </motion.div>
);
```

### 3.2 Upgrade Global CSS

Switch to standard Tailwind usage and add premium mesh gradients.

**File:** `src/app/globals.css`

**Action:** Replace the top imports and `:root` variables with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ... keep your Google Fonts imports here ... */

:root {
  --background: #ffffff;
  --foreground: #171717;
  /* ... keep font variables ... */
}

/* Add this new Mesh Gradient class */
.bg-mesh {
  background-color: transparent;
  background-image:
    radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
}

.dark .bg-mesh {
  background-color: hsla(0, 0%, 0%, 1);
  background-image:
    radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
}
```

### 3.3 Animate Home Page

Add smooth entry animations to the hero section.

**File:** `src/components/HomePage.tsx`

```tsx
import { MotionDiv } from "./ui/Motion";

// Wrap your Hero content:
<section className="...">
  <Container>
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl"
    >
      <h1 className="...">...</h1>
      {/* ... rest of content */}
    </MotionDiv>
  </Container>
</section>;
```

### 3.4 Enhance Project Cards

Add a premium glass effect and hover lift.

**File:** `src/components/sections/ProjectCard.tsx`

**Action:** Update the `<article>` className:

```tsx
<article className="group relative bg-white dark:bg-white/5 dark:backdrop-blur-lg rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
```

---

## 🛠 Step 4: Code Quality Refactor

### 4.1 Centralize Navigation Data

Move menu items out of the component to make them reusable.

**File:** `src/i18n/navigation.ts` (Update file)

```typescript
export const navLinks = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/contact", label: "contact" },
] as const;
```

### 4.2 Clean Up SiteHeader

Use the centralized data.

**File:** `src/components/sections/SiteHeader.tsx`

```tsx
import { navLinks } from "@/i18n/navigation";

// Inside component:
// Remove the local `navLink` array definition
// Update the loop:
{
  navLinks.map((link) => (
    <Link key={link.href} href={link.href} className="...">
      {t(link.label)}
    </Link>
  ));
}
```

---

## ✅ Implementation Checklist

- [ ] Rename `generateMetaData` to `generateMetadata`
- [ ] Install `framer-motion`
- [ ] Create `Motion.tsx`
- [ ] Update `globals.css`
- [ ] Implement animations in `HomePage.tsx`
- [ ] Update `ProjectCard.tsx` styles
- [ ] Refactor navigation to `navigation.ts`
