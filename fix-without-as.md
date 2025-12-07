# Fix TypeScript Error Without Using `as`

## Problem
Line 35 in `/src/app/[locale]/layout.tsx` has a type error because `locale` is `string` but needs to be `Locale` type.

## Solution 1: Type Guard (Recommended)

Create a type guard function:

```typescript
import { Locale } from "next-intl";
import { locales } from "@/i18n/config";

// Type guard function
function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale);
}

export default async function LocaleLayout(
  { children, params: { locale } }: LocaleLayoutProps
): LocaleLayoutProps {

  // Validate locale with type guard
  if (!isValidLocale(locale)) {
    notFound();
  }

  // After validation, TypeScript knows locale is Locale (type narrowing)
  const direction = isRTL(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
```

## Solution 2: Update Interface to use Locale type

```typescript
import { Locale } from "next-intl";
import { locales } from "@/i18n/config";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;  // Change from string to Locale
  };
}

// Now locale is already typed as Locale from params
export default async function LocaleLayout(
  { children, params: { locale } }: LocaleLayoutProps
): LocaleLayoutProps {

  if (!locales.includes(locale)) {
    notFound();
  }

  const direction = isRTL(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
```

## Why This Works

**Type Guard (Solution 1):**
- Uses `locale is Locale` return type
- TypeScript narrows the type after the guard
- No `as` assertion needed
- Runtime + compile-time validation

**Interface Update (Solution 2):**
- Params already typed as `Locale`
- No narrowing needed
- Simpler but assumes Next.js provides correct type

## Recommendation

Use **Solution 1** (Type Guard) - it's more explicit and works even if params type changes.