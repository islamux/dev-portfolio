# Phase 4 Execution Plan: Internationalization (i18n) & RTL

> **Timeline:** 2-3 days (16-24 hours)  
> **Difficulty:** Intermediate to Advanced  
> **Prerequisites:** Phase 3 completed, basic understanding of i18n concepts

---

## 📋 Overview

**Phase Goal:** Make your portfolio multilingual (English, French, Arabic) with full RTL (Right-to-Left) support for Arabic.

**What You'll Build:**

- ✅ Multi-language support (EN, FR, AR)
- ✅ Language switcher component
- ✅ RTL layout for Arabic
- ✅ Localized content routing (`/en`, `/fr`, `/ar`)
- ✅ Translation management system
- ✅ Arabic-friendly fonts
- ✅ RTL-aware Tailwind utilities

---

## 🎯 Learning Objectives

By the end of Phase 4, you will understand:

- How internationalization (i18n) works in Next.js
- The difference between LTR (Left-to-Right) and RTL (Right-to-Left) layouts
- Middleware in Next.js and how it handles routing
- Translation file structure and management
- Logical CSS properties for bidirectional layouts
- Font loading for non-Latin scripts

---

## 📅 Daily Timeline

### **Day 1: i18n Setup & Routing** (8-10 hours)

#### Morning (4-5 hours): Foundation

1. Install `next-intl` package
2. Configure middleware for locale routing
3. Restructure app directory for locales
4. Create translation files structure
5. Set up i18n configuration

#### Afternoon (4-5 hours): Implementation

1. Update all pages to use locale param
2. Create translation files (EN, FR, AR)
3. Update components to use translations
4. Test locale routing
5. Fix any routing issues

---

### **Day 2: RTL Support & Language Switcher** (6-8 hours)

#### Morning (3-4 hours): RTL Layout

1. Add RTL direction detection
2. Update Tailwind for logical properties
3. Fix layout issues in RTL mode
4. Add Arabic font loading
5. Test all pages in RTL

#### Afternoon (3-4 hours): Language Switcher

1. Create LanguageSwitcher component
2. Add to header
3. Implement locale switching logic
4. Preserve current path on switch
5. Style and polish switcher

---

### **Day 3: Content Localization & Testing** (2-6 hours)

#### Morning (1-3 hours): Content

1. Translate all markdown content
2. Localize project data
3. Add locale-specific images (optional)
4. Update metadata for each locale

#### Afternoon (1-3 hours): Testing & Polish

1. Test all pages in each language
2. Verify RTL layout works correctly
3. Check SEO metadata per locale
4. Fix translation issues
5. Optimize font loading

---

## 📝 Step-by-Step Implementation Guide

---

## **Step 0: Create Feature Branch** ⭐

Before starting Phase 4, create and switch to a feature branch:

```bash
# Create and switch to Phase 4 feature branch (or switch if it exists)
git checkout -b feature/phase-4-i18n || git checkout feature/phase-4-i18n
```

**Why?** Keeps `main` stable, isolates changes, enables easy rollback, professional workflow.

---

## **Step 1: Install next-intl**

**Estimated Time:** 5 minutes

### Install Package:

```bash
pnpm add next-intl
```

### What is `next-intl`?

A comprehensive i18n library for Next.js App Router that provides:

- Automatic locale routing
- Translation management
- Type-safe translations
- Server Component support
- Date/time/number formatting

---

## **Step 2: Create i18n Configuration**

**Estimated Time:** 20 minutes

### File: `src/i18n/config.ts`

```typescript
export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  fr: "🇫🇷",
  ar: "🇸🇦",
};

// RTL languages
export const rtlLocales: Locale[] = ["ar"];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
```

### 🎓 Understanding the Config:

- **`as const`** - Makes the array readonly and infers exact types
- **`type Locale`** - Creates union type: `'en' | 'fr' | 'ar'`
- **`Record<Locale, string>`** - Object with locale keys and string values
- **RTL detection** - Used to set `dir="rtl"` attribute

---

## **Step 3: Setup Middleware**

**Estimated Time:** 15 minutes

### File: `src/middleware.ts`

```typescript
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  // List of all supported locales
  locales,

  // Default locale when none is specified
  defaultLocale,

  // Don't use locale prefix for default locale
  // e.g., /about instead of /en/about
  localePrefix: "as-needed",

  // Detect locale from Accept-Language header
  localeDetection: true,
});

export const config = {
  // Match all paths except:
  // - API routes (/api/*)
  // - Next.js internal files (/_next/*)
  // - Static files with extensions (*.png, *.jpg, etc.)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

### 🎓 Understanding Middleware:

**What is Middleware?**

- Runs before every request
- Can modify request/response
- Used here to detect and set locale

**Matcher Pattern:**

- `/((?!api|_next|.*\\..*).*)`
- Matches all routes EXCEPT api, \_next, and files with extensions

**Locale Prefix Options:**

- `'always'` - Always show prefix: `/en/about`, `/fr/about`
- `'as-needed'` - Hide default locale: `/about` (en), `/fr/about`
- `'never'` - Never show prefix (not recommended)

---

## **Step 4: Restructure App Directory**

**Estimated Time:** 30 minutes

### Current Structure:

```
app/
  layout.tsx
  page.tsx
  about/page.tsx
  projects/page.tsx
  contact/page.tsx
```

### New Structure:

```
app/
  [locale]/
    layout.tsx
    page.tsx
    about/page.tsx
    projects/page.tsx
    projects/[id]/page.tsx
    contact/page.tsx
  layout.tsx (root layout)
  providers.tsx
```

### Migration Commands:

```bash
# Create locale directory
mkdir -p app/[locale]

# Move pages to locale directory
mv app/page.tsx app/[locale]/
mv app/about app/[locale]/
mv app/projects app/[locale]/
mv app/contact app/[locale]/

# Create new locale layout
touch app/[locale]/layout.tsx
```

---

## **Step 5: Update Root Layout**

**Estimated Time:** 20 minutes

### File: `app/layout.tsx`

```tsx
import "./globals.css";
import { ReactNode } from "react";

/**
 * Root layout - wraps entire app
 * Does NOT set lang or dir attributes (done in locale layout)
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
```

### 🎓 Why So Simple?

The root layout doesn't set `<html>` or `<body>` because:

- The locale layout will handle `lang` and `dir` attributes
- Prevents duplication of HTML structure
- Allows locale-specific configuration

---

## **Step 6: Create Locale Layout**

**Estimated Time:** 30 minutes

### File: `app/[locale]/layout.tsx`

```tsx
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "../providers";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { locales, isRTL, type Locale } from "@/i18n/config";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

/**
 * Locale-specific layout
 * Sets language, direction, and provides translations
 */
export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Load translation messages
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  // Determine text direction
  const direction = isRTL(locale as Locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipToContent />
          <Providers>
            <SiteHeader />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <SiteFooter />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

/**
 * Generate static params for all locales
 * Enables static generation at build time
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

### 🎓 Understanding the Code:

**Key Features:**

1. **Dynamic Import** - Loads translation file based on locale

   ```tsx
   messages = (await import(`@/messages/${locale}.json`)).default;
   ```

2. **RTL Detection** - Sets `dir="rtl"` for Arabic

   ```tsx
   const direction = isRTL(locale as Locale) ? "rtl" : "ltr";
   ```

3. **NextIntlClientProvider** - Provides translations to all child components
   ```tsx
   <NextIntlClientProvider locale={locale} messages={messages}>
   ```

---

## **Step 7: Create Translation Files**

**Estimated Time:** 1-2 hours

### File Structure:

```bash
mkdir -p messages
touch messages/en.json
touch messages/fr.json
touch messages/ar.json
```

### File: `messages/en.json`

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "projects": "Projects",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "title": "Hi, I'm Islamux",
      "subtitle": "Full-stack developer passionate about open source",
      "cta": {
        "projects": "View Projects",
        "contact": "Get in Touch"
      }
    },
    "featured": {
      "title": "Featured Projects",
      "viewAll": "View All"
    }
  },
  "about": {
    "title": "About Me",
    "description": "Learn more about my journey as a developer"
  },
  "projects": {
    "title": "Projects",
    "description": "A collection of my work and contributions",
    "filter": {
      "all": "All",
      "noResults": "No projects found with {tech}"
    },
    "card": {
      "code": "Code",
      "demo": "Live Demo"
    }
  },
  "contact": {
    "title": "Get in Touch",
    "description": "Have a project in mind? Let's talk about it.",
    "form": {
      "name": "Name",
      "email": "Email",
      "message": "Message",
      "submit": "Send Message",
      "sending": "Sending...",
      "success": "Message sent successfully! I'll get back to you soon.",
      "error": "Failed to send message. Please try again."
    },
    "other": {
      "title": "Other Ways to Reach Me"
    }
  },
  "footer": {
    "about": {
      "title": "About",
      "text": "Full-stack developer passionate about open source and building great user experiences."
    },
    "quickLinks": {
      "title": "Quick Links"
    },
    "connect": {
      "title": "Connect"
    },
    "copyright": "Built with Next.js and Tailwind CSS."
  }
}
```

### File: `messages/fr.json`

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos",
    "projects": "Projets",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "title": "Salut, je suis Islamux",
      "subtitle": "Développeur full-stack passionné par l'open source",
      "cta": {
        "projects": "Voir les projets",
        "contact": "Me contacter"
      }
    },
    "featured": {
      "title": "Projets en vedette",
      "viewAll": "Voir tout"
    }
  },
  "about": {
    "title": "À propos de moi",
    "description": "En savoir plus sur mon parcours de développeur"
  },
  "projects": {
    "title": "Projets",
    "description": "Une collection de mon travail et contributions",
    "filter": {
      "all": "Tout",
      "noResults": "Aucun projet trouvé avec {tech}"
    },
    "card": {
      "code": "Code",
      "demo": "Démo en direct"
    }
  },
  "contact": {
    "title": "Contactez-moi",
    "description": "Vous avez un projet en tête? Parlons-en.",
    "form": {
      "name": "Nom",
      "email": "E-mail",
      "message": "Message",
      "submit": "Envoyer le message",
      "sending": "Envoi en cours...",
      "success": "Message envoyé avec succès! Je vous répondrai bientôt.",
      "error": "Échec de l'envoi du message. Veuillez réessayer."
    },
    "other": {
      "title": "Autres moyens de me contacter"
    }
  },
  "footer": {
    "about": {
      "title": "À propos",
      "text": "Développeur full-stack passionné par l'open source et la création d'excellentes expériences utilisateur."
    },
    "quickLinks": {
      "title": "Liens rapides"
    },
    "connect": {
      "title": "Se connecter"
    },
    "copyright": "Construit avec Next.js et Tailwind CSS."
  }
}
```

### File: `messages/ar.json`

```json
{
  "nav": {
    "home": "الرئيسية",
    "about": "عني",
    "projects": "المشاريع",
    "contact": "اتصل"
  },
  "home": {
    "hero": {
      "title": "مرحباً، أنا إسلامكس",
      "subtitle": "مطور ويب متكامل شغوف بالبرمجيات مفتوحة المصدر",
      "cta": {
        "projects": "عرض المشاريع",
        "contact": "تواصل معي"
      }
    },
    "featured": {
      "title": "المشاريع المميزة",
      "viewAll": "عرض الكل"
    }
  },
  "about": {
    "title": "عني",
    "description": "تعرف على المزيد حول رحلتي كمطور"
  },
  "projects": {
    "title": "المشاريع",
    "description": "مجموعة من أعمالي ومساهماتي",
    "filter": {
      "all": "الكل",
      "noResults": "لم يتم العثور على مشاريع باستخدام {tech}"
    },
    "card": {
      "code": "الكود",
      "demo": "معاينة مباشرة"
    }
  },
  "contact": {
    "title": "تواصل معي",
    "description": "هل لديك مشروع في ذهنك؟ دعنا نتحدث عنه.",
    "form": {
      "name": "الاسم",
      "email": "البريد الإلكتروني",
      "message": "الرسالة",
      "submit": "إرسال الرسالة",
      "sending": "جاري الإرسال...",
      "success": "تم إرسال الرسالة بنجاح! سأتواصل معك قريباً.",
      "error": "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى."
    },
    "other": {
      "title": "طرق أخرى للتواصل معي"
    }
  },
  "footer": {
    "about": {
      "title": "عني",
      "text": "مطور ويب متكامل شغوف بالبرمجيات مفتوحة المصدر وبناء تجارب مستخدم رائعة."
    },
    "quickLinks": {
      "title": "روابط سريعة"
    },
    "connect": {
      "title": "تواصل"
    },
    "copyright": "بُني باستخدام Next.js و Tailwind CSS."
  }
}
```

### 🎓 Translation Best Practices:

1. **Use Nested Objects** - Organize by page/component
2. **Keep Keys Consistent** - Same structure across all languages
3. **Avoid Hardcoding Text** - Everything should be translatable
4. **Use Placeholders** - `{tech}` for dynamic values
5. **Test RTL Early** - Arabic reveals layout issues

---

## **Step 8: Update Components to Use Translations**

**Estimated Time:** 1-2 hours

### Update SiteHeader:

**File: `src/components/sections/SiteHeader.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const t = useTranslations("nav");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/contact", label: t("contact") },
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
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
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
          <div className="flex items-center gap-4">
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

            {/* Language Switcher */}
            <LanguageSwitcher />

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

### 🎓 Key Changes:

1. **`useTranslations('nav')`** - Get translations for nav section
2. **`t('home')`** - Get translated string for 'home' key
3. **`rtl:space-x-reverse`** - Reverse spacing in RTL mode

---

## **Step 9: Create Language Switcher**

**Estimated Time:** 45 minutes

### File: `src/components/sections/LanguageSwitcher.tsx`

```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false);

    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");

    // Navigate to new locale with same path
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Locale Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Change language"
      >
        <span className="text-lg">{localeFlags[locale as Locale]}</span>
        <span className="hidden sm:inline">
          {localeNames[locale as Locale]}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute end-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                locale === loc
                  ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-lg">{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
              {locale === loc && (
                <svg
                  className="w-4 h-4 ms-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 🎓 Understanding the Code:

**Key Features:**

1. **`useLocale()`** - Get current locale from context
2. **Path Preservation** - Maintains current page when switching
3. **Logical Properties** - `end-0` (right in LTR, left in RTL)
4. **`ms-auto`** - `margin-start: auto` (RTL-aware)
5. **Click Outside** - Closes dropdown when clicking elsewhere

---

## **Step 10: Add RTL-Aware Tailwind Utilities**

**Estimated Time:** 30 minutes

### Update Tailwind Config:

**File: `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ... existing config
    },
  },
  plugins: [
    require("@tailwindcss/typography"),

    // Add RTL plugin
    require("tailwindcss-rtl"),
  ],
};

export default config;
```

### Install RTL Plugin:

```bash
pnpm add -D tailwindcss-rtl
```

### Update Global CSS:

**File: `app/globals.css`**

```css
/* ... existing fonts ... */

@import "tailwindcss";

/* ... existing CSS ... */

/* RTL-specific styles */
[dir="rtl"] {
  /* Font for Arabic */
  --font-geist-sans: "Tajawal", "Noto Sans Arabic", system-ui, sans-serif;
}

/* Fix common RTL layout issues */
[dir="rtl"] .prose {
  text-align: right;
}

[dir="rtl"] .prose ul,
[dir="rtl"] .prose ol {
  padding-inline-start: 1.5em;
  padding-inline-end: 0;
}
```

---

## **Step 11: Load Arabic Font**

**Estimated Time:** 20 minutes

### Option 1: Google Fonts CDN (Workaround for Turbopack bug)

**File: `app/globals.css`**

```css
/* Add Arabic font */
@import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap");

/* ... existing fonts ... */

:root {
  --font-geist-sans: "Geist", system-ui, sans-serif;
  --font-geist-mono: "Geist Mono", "Courier New", monospace;
  --font-arabic: "Tajawal", "Noto Sans Arabic", sans-serif;
}

/* Apply Arabic font in RTL mode */
[dir="rtl"] body {
  font-family: var(--font-arabic);
}
```

### Option 2: next/font (When Turbopack is fixed)

```tsx
// app/[locale]/layout.tsx
import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

// Then apply in RTL mode:
<body className={direction === 'rtl' ? tajawal.className : ''}>
```

---

## **Step 12: Update Pages with Translations**

**Estimated Time:** 1-2 hours

### Example: Home Page

**File: `app/[locale]/page.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getContentBySlug, getProjectsData } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/sections/ProjectCard";

interface HomePageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: HomePageProps) {
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  const { frontmatter, content } = getContentBySlug("home", locale);
  const projects = getProjectsData(locale);
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <>
      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <FeaturedProjectsSection projects={featuredProjects} locale={locale} />
      )}
    </>
  );
}

// Separate components to use client-side translations
function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations("home.hero");

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t("title")}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/projects`}>
              <Button variant="primary" size="lg">
                {t("cta.projects")}
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button variant="secondary" size="lg">
                {t("cta.contact")}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

### 🎓 Understanding Translation Hooks:

**Server Components:**

```tsx
import { getTranslations } from "next-intl/server";

const t = await getTranslations({ locale, namespace: "home" });
```

**Client Components:**

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("home");
```

---

## **Step 13: Fix Common RTL Layout Issues**

**Estimated Time:** 1-2 hours

### Replace Direction-Specific Classes:

**❌ Don't Use:**

```tsx
className = "ml-4"; // margin-left
className = "pr-2"; // padding-right
className = "text-left"; // text alignment
className = "float-left";
```

**✅ Use Instead:**

```tsx
className = "ms-4"; // margin-start (auto-flips in RTL)
className = "pe-2"; // padding-end
className = "text-start";
className = "float-start";
```

### Tailwind Logical Properties Cheat Sheet:

| Old (Direction-Specific) | New (Logical) | Behavior                                 |
| ------------------------ | ------------- | ---------------------------------------- |
| `ml-4`                   | `ms-4`        | margin-start (left in LTR, right in RTL) |
| `mr-4`                   | `me-4`        | margin-end (right in LTR, left in RTL)   |
| `pl-4`                   | `ps-4`        | padding-start                            |
| `pr-4`                   | `pe-4`        | padding-end                              |
| `left-0`                 | `start-0`     | Position from start edge                 |
| `right-0`                | `end-0`       | Position from end edge                   |
| `text-left`              | `text-start`  | Text alignment                           |
| `rounded-l`              | `rounded-s`   | Border radius start                      |

### Manual Reversals:

For things that need explicit reversal:

```tsx
// Flex direction
className = "flex-row rtl:flex-row-reverse";

// Space between items
className = "space-x-4 rtl:space-x-reverse";

// Custom positioning
className = "left-4 rtl:left-auto rtl:right-4";
```

---

## **Step 14: Test All Pages in Each Locale**

**Estimated Time:** 1 hour

### Testing Checklist:

#### English (`/en`)

- [ ] Home page renders correctly
- [ ] All navigation links work
- [ ] Projects load
- [ ] Contact form works
- [ ] Content is in English

#### French (`/fr`)

- [ ] French translations display
- [ ] Navigation in French
- [ ] Projects load (French descriptions if localized)
- [ ] Contact form has French labels
- [ ] No missing translation keys

#### Arabic (`/ar`)

- [ ] RTL layout active (`dir="rtl"`)
- [ ] Arabic font loaded
- [ ] Text aligned to right
- [ ] Navigation flows right-to-left
- [ ] Buttons/spacing reversed correctly
- [ ] No layout breaking issues

### Quick Test Script:

```bash
# Start dev server
pnpm dev

# Test URLs:
# http://localhost:3000/en
# http://localhost:3000/fr
# http://localhost:3000/ar

# Check browser DevTools:
# - Look at <html dir="rtl"> for Arabic
# - Check computed styles for RTL properties
# - Verify fonts loaded in Network tab
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Translations Not Loading

**Symptoms:** Shows translation keys instead of text (e.g., "home.hero.title")

**Solution:**

1. Check translation file exists:

   ```bash
   ls messages/en.json
   ```

2. Verify JSON is valid:

   ```bash
   cat messages/en.json | python -m json.tool
   ```

3. Restart dev server:
   ```bash
   # Ctrl+C then
   pnpm dev
   ```

---

### Issue 2: RTL Layout Breaks Flexbox

**Symptoms:** Items appear in wrong order in Arabic

**Solution:**

```tsx
// ❌ Wrong
className = "flex space-x-4";

// ✅ Correct
className = "flex space-x-4 rtl:space-x-reverse";

// Or use gap instead
className = "flex gap-4"; // gap works correctly in RTL
```

---

### Issue 3: Language Switcher Loses Current Page

**Symptoms:** Clicking language always goes to homepage

**Solution:**

```tsx
// In LanguageSwitcher.tsx
const pathname = usePathname();

const handleLocaleChange = (newLocale: Locale) => {
  // Remove current locale from path
  const pathWithoutLocale = pathname.replace(`/${locale}`, "");

  // Navigate to same path in new locale
  router.push(`/${newLocale}${pathWithoutLocale}`);
};
```

---

### Issue 4: Arabic Text Shows as Boxes/Question Marks

**Symptoms:** Arabic characters don't render

**Solution:**

1. **Verify font is loaded:**
   - Open DevTools → Network tab
   - Filter by "Font"
   - Look for Tajawal.woff2 or similar

2. **Check font-family is applied:**

   ```css
   [dir="rtl"] body {
     font-family: "Tajawal", "Noto Sans Arabic", sans-serif;
   }
   ```

3. **Use fallback fonts:**
   ```css
   /* System always has a fallback Arabic font */
   font-family: Tajawal, "Noto Sans Arabic", Arial, sans-serif;
   ```

---

### Issue 5: Locale Detection Not Working

**Symptoms:** Always shows default language

**Solution:**

1. **Check middleware is running:**

   ```typescript
   // src/middleware.ts
   export const config = {
     matcher: ["/((?!api|_next|.*\\..*).*)"],
   };
   ```

2. **Verify browser language:**
   - Chrome: Settings → Languages
   - Set French/Arabic as preferred
   - Reload page

3. **Force locale in URL:**
   ```
   http://localhost:3000/ar/about
   ```

---

## 📋 Acceptance Criteria Checklist

### Routing & i18n

- [ ] `/en`, `/fr`, `/ar` routes work
- [ ] Middleware detects and redirects to correct locale
- [ ] All pages accessible in all locales
- [ ] URL structure: `/:locale/:page`

### Translations

- [ ] All UI text translated (no hardcoded English)
- [ ] Translation files complete for EN, FR, AR
- [ ] No missing translation keys
- [ ] Dynamic content (projects, about) localized

### RTL Support

- [ ] Arabic pages have `dir="rtl"` attribute
- [ ] Layout mirrors correctly (reversed flex, margins, etc.)
- [ ] Arabic font loads and displays correctly
- [ ] Text alignment correct (right-aligned in Arabic)
- [ ] Icons/images positioned correctly

### Language Switcher

- [ ] Switcher appears in header
- [ ] Shows current language
- [ ] Preserves current page when switching
- [ ] Dropdown closes after selection
- [ ] Works on mobile

### Content

- [ ] Markdown content localized (home.md, about.md for each locale)
- [ ] Projects have localized descriptions
- [ ] Metadata (title, description) translated per locale

### Testing

- [ ] No TypeScript errors
- [ ] No console errors in any locale
- [ ] SEO metadata correct for each language
- [ ] Open Graph uses correct locale
- [ ] No layout shifts when switching languages

---

## 🎓 Key Takeaways for Junior Developers

### What You Learned:

1. **Internationalization (i18n):** Making apps work in multiple languages
2. **Localization (l10n):** Adapting for specific regions/cultures
3. **RTL Layouts:** Understanding bidirectional text flow
4. **Middleware:** Intercepting requests to handle routing logic
5. **Logical Properties:** CSS that works in both LTR and RTL
6. **Font Loading:** Handling non-Latin scripts

### Critical Concepts:

**LTR vs RTL:**

- **LTR** (Left-to-Right): English, French, Spanish
- **RTL** (Right-to-Left): Arabic, Hebrew, Persian

**Logical vs Physical Properties:**

```css
/* Physical (don't use for RTL) */
margin-left: 1rem;
padding-right: 2rem;

/* Logical (use these!) */
margin-inline-start: 1rem; /* Tailwind: ms-4 */
padding-inline-end: 2rem; /* Tailwind: pe-8 */
```

---

## 📚 Additional Resources

### Internationalization

- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Next.js i18n Guide](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [W3C i18n Best Practices](https://www.w3.org/International/quicktips/)

### RTL Design

- [RTL Styling Guide](https://rtlstyling.com/)
- [Material Design RTL](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)

### Arabic Typography

- [Google Fonts Arabic](https://fonts.google.com/?subset=arabic)
- [Choosing Arabic Fonts](https://www.smashingmagazine.com/2010/04/arabic-typography-fonts/)

---

## 🎯 Time Tracking Template

| Task                     | Estimated   | Actual | Notes |
| ------------------------ | ----------- | ------ | ----- |
| Install next-intl        | 5min        |        |       |
| i18n config              | 20min       |        |       |
| Middleware setup         | 15min       |        |       |
| Restructure app dir      | 30min       |        |       |
| Update layouts           | 50min       |        |       |
| Create translation files | 1-2hr       |        |       |
| Update components        | 1-2hr       |        |       |
| Language switcher        | 45min       |        |       |
| RTL Tailwind config      | 30min       |        |       |
| Load Arabic font         | 20min       |        |       |
| Update pages             | 1-2hr       |        |       |
| Fix RTL issues           | 1-2hr       |        |       |
| Testing                  | 1hr         |        |       |
| **Total**                | **16-24hr** |        |       |

---

## 🚀 Ready to Start?

**Before you begin:**

1. ✅ Ensure Phase 3 is complete
2. 📚 Read about RTL layouts (10 mins)
3. 📝 Create branch: `git checkout -b feature/phase-4-i18n`
4. ☕ Get tea/coffee

**Pro Tips:**

- Test in Arabic EARLY - catches layout issues
- Use browser DevTools to inspect RTL styles
- Google Translate is OK for testing, but get native speakers to review
- Keep translation keys organized and consistent

**Next Phase Preview:**
Phase 5 will add:

- 📧 Email sending via API
- 🔗 GitHub projects importer
- 🛠️ /uses page for tools and setup

Good luck building a multilingual masterpiece! 🌍✨
