# Type Guard Placement: Same File vs Separate File

## General Best Practice

**Put type guards in a separate utility file** when they are **reusable** or **generic**.

## Why Separate File is Better

### 1. **Reusability**
- Can be used across multiple components/pages
- Single source of truth for validation logic
- DRY principle - don't repeat validation code

### 2. **Separation of Concerns**
- Component files stay focused on UI logic
- Utility files contain pure functions
- Easier to understand code responsibilities

### 3. **Testability**
- Easier to test utility functions in isolation
- No need to import entire component to test validation

### 4. **Maintainability**
- Update validation in one place
- Less cognitive load in component files

## For Your Case: `isValidLocale`

### Recommended: Create `/src/i18n/guards.ts` (or `/src/utils/locale.ts`)

```typescript
// /src/i18n/guards.ts
import { Locale } from "next-intl";
import { locales } from "./config";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale);
}
```

Then import in layout:
```typescript
import { isValidLocale } from "@/i18n/guards";

export default async function LocaleLayout(...) {
  if (!isValidLocale(locale)) {
    notFound();
  }
  // locale is now typed as Locale
}
```

### When to Keep in Same File

Only if:
- ✅ Function is highly specific to that one component
- ✅ Will never be used elsewhere
- ✅ Has component-specific logic dependencies
- ✅ File is already very small (< 50 lines)

## Recommendation for Your Project

**Use separate file**: `/src/i18n/guards.ts`

**Reasons:**
- Locale validation is likely needed in multiple places
- i18n-related utilities belong together
- Keeps layout.tsx clean and focused
- Easy to add other validation guards later

## Alternative Organization

Put alongside config:
```typescript
// /src/i18n/config.ts
import { Locale } from "next-intl";

export type Locale = "en" | "fr" | "ar";
export const locales: Locale[] = ["en", "fr", "ar"];
export const defaultLocale: Locale = "en";

// Type guard at bottom of same file
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale);
}
```

**Pros:**
- Everything i18n in one place
- No additional file to manage
- Clear logical grouping

**Cons:**
- Config file gets larger
- Might bloat if many guards added

## Final Verdict

**For your project: Separate file** (`/src/i18n/guards.ts`) - Most flexible and follows best practices for utility functions.