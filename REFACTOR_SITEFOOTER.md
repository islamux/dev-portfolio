# Guide to Refactoring `SiteFooter.tsx`

This document outlines the issues found in `src/components/sections/SiteFooter.tsx` and provides a step-by-step guide to fix them.

---

## 📋 Summary of Issues

1.  **Incorrect Imports**: The import statements for `Container` and `SocialLink` are incorrect.
2.  **Broken JSX Structure**: The HTML layout is malformed, causing the grid system to fail and content to be misplaced.
3.  **Incorrect Prop Case**: A prop being passed to the `<Icon>` component has the wrong capitalization (`link.Icon` instead of `link.icon`).
4.  **Inconsistent Export**: The component uses a `default` export, which is inconsistent with the project's established pattern of named exports.

---

## 🛠️ Step-by-Step Fixes

### 1. Fix Import Statements

**The Issue:**
- `Container` is a named export, but it's being imported as a default. The path is also missing the `/ui` directory.
- `SocialLink` should be imported as a named type from the project's alias (`@/types`), not with a relative path. Using `import type` is best practice for importing only type definitions.

**Solution:**
Replace the current import block with the corrected version.

**❌ Old Code:**
```tsx
import Link from "next/link";
import Container from "../Container";
import SocialLink from "../../types/index";
import Icon from "../ui/Icon";
```

**✅ New Code:**
```tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { SocialLink } from "@/types";
```

*Note: This assumes you have `SocialLink` defined and exported in `src/types/index.ts` and your `tsconfig.json` has the `@/*` path alias configured.*

### 2. Fix the Broken JSX Structure

**The Issue:**
The "About", "Quick Links", and "Social" sections were placed outside of the `div` that defines the 3-column grid, breaking the intended layout.

**Solution:**
Move the content sections to be direct children of the `div` with the class `grid`.

**❌ Old Structure:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
  {/*About*/}
</div>
<h3...</h3> // This is outside the grid
<p...></p>
<div>...</div> // This is also outside
```

**✅ New Structure:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* About section */}
  <div>
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">About</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Full-stack developer passionate about open source and building
      great user experiences.
    </p>
  </div>

  {/* Quick Links section */}
  <div>
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
    {/* ... ul ... */}
  </div>

  {/* Connect section */}
  <div>
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
    {/* ... social links div ... */}
  </div>
</div>
```

### 3. Correct the Icon Prop Name

**The Issue:**
The `SocialLink` interface defines the icon property as `icon` (lowercase). The code incorrectly tries to access `link.Icon` (uppercase).

**Solution:**
Change `link.Icon` to `link.icon`.

**❌ Old Code:**
```tsx
<Icon name={link.Icon} size={20} />
```

**✅ New Code:**
```tsx
<Icon name={link.icon} size={20} />
```

### 4. Use a Named Export

**The Issue:**
The component is exported using `export default function SiteFooter`, but the project convention (seen in `PHASE_2_EXECUTION_PLAN.md`) is to use named exports like `export function SiteFooter`.

**Solution:**
Remove the `default` keyword.

**❌ Old Code:**
```tsx
export default function SiteFooter({ socialLinks }: SiteFooterProps) {
```

**✅ New Code:**
```tsx
export function SiteFooter({ socialLinks }: SiteFooterProps) {
```
*Remember to update the import statement in `src/app/layout.tsx` from `import SiteFooter` to `import { SiteFooter }`.*

---

##  النهائية Full Corrected Code

Here is the complete `SiteFooter.tsx` file with all the fixes applied. You can use this to replace the entire contents of your existing file.

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { SocialLink } from "@/types";

interface SiteFooterProps {
  socialLinks: SocialLink[];
}

export function SiteFooter({ socialLinks }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

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
