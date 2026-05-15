# Internationalization (i18n) Troubleshooting and Fixes

This document outlines the series of issues encountered with the website's internationalization setup and the steps taken to resolve them, primarily focusing on adding Spanish language support and fixing the language switcher functionality.

## 1. Initial Problem: Spanish Language Option Not Appearing

### Issue
The first and most apparent issue was that there was no UI element (button or link) to switch the site's language to Spanish.

### Solution
- **Updated i18n Configuration**: The file `src/i18n/config.ts` was updated to officially include Spanish (`es`) as a supported locale. This involved adding it to the `Locale` type definition and the `locales` array, as well as providing its name ("Español") and flag icon ("ES").
- **Created Missing Content Files**: The application requires content and message files for each supported language. The following files were created with placeholder Spanish translations:
    - `src/messages/es.json` (for general UI text like navigation links and button labels)
    - `content/es/home.md` (for the homepage content)
    - `content/es/projects.json` (for the projects page content)

## 2. Deeper Issue: A Tale of Two Switchers

### Issue
After adding the Spanish configuration, it became clear that the main language switcher was not dynamic. The site header (`src/components/sections/SiteHeader.tsx`) contained a hardcoded list of links for EN, FR, and AR, and a more advanced, dynamic `<LanguageSwitcher />` component was commented out.

### Solution
The hardcoded links were removed and replaced with the dynamic `<LanguageSwitcher />` component. This ensures that any language added to the i18n configuration will automatically appear in the dropdown menu.

## 3. Runtime Error: "No intl context found"

### Issue
Activating the `<LanguageSwitcher />` component immediately caused a runtime error. This was because the component is a Client Component (`'use client'`) that uses hooks like `useLocale()`, but it was not wrapped in the required `next-intl` context provider.

### Solution
In the root layout file for localized pages (`src/app/[locale]/layout.tsx`), the `<NextIntlClientProvider>` component was uncommented. This provider wraps the application's pages and makes the internationalization context (like the current locale and messages) available to all client components in the tree.

## 4. Final Bug: Switching to English Failed

### Issue
With the switcher visible and the context error fixed, a final critical bug appeared: when on a non-default language page (e.g., `/fr`), attempting to switch to English would cause the page to reload but remain in French.

### Analysis
The root cause was a complex interaction between three factors:
1.  **Incorrect Navigation Method**: The `LanguageSwitcher` was using `window.location.assign()` to change pages.
2.  **Middleware `localeDetection`**: The i18n middleware (`src/middleware.ts`) was configured with `localeDetection: true`, which tells it to use the browser's `Accept-Language` header to determine the locale if one isn't specified in the URL.
3.  **Middleware Not Running**: The middleware file was incorrectly named `src/proxy.ts` instead of `src/middleware.ts`, so it wasn't being executed by Next.js.

When a user on `/fr` clicked "EN", the old code navigated to `/`. The inactive middleware did nothing. After renaming the file to activate the middleware, navigating to `/` caused the middleware to trigger. It saw no locale in the URL, checked the browser's `Accept-Language` header (which was likely `fr`), and redirected the user right back to `/fr`.

### Solution
- **Enabled Middleware**: Renamed `src/proxy.ts` to `src/middleware.ts` so that it would be correctly picked up by Next.js.
- **Refactored Language Switcher**: The `LanguageSwitcher` was completely refactored to use the modern, recommended hooks from `next-intl`:
    - It now imports `useRouter` and `usePathname` from `next-intl`'s navigation utilities.
    - The complex and buggy path manipulation logic was replaced with a single, clean call: `router.push(pathname, { locale: newLocale })`.

This new approach correctly handles the navigation and ensures that the user's explicit language choice is respected by setting a cookie that overrides the `Accept-Language` header detection. This finally resolved the issue and made the language switcher fully functional for all languages.
