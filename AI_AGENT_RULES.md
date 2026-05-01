# AI Agent Rules - Dev Portfolio

## Foundational Rules

### 1. Read Before You Edit
- **ALWAYS** read `AGENTS.md` first — contains project conventions
- Read `PROJECT_ARCHITECTURE.md` to understand technical debt before touching code
- Read `todo.md` to see author's known issues
- Check `src/messages/{locale}.json` before adding hardcoded strings

### 2. Package Manager
- **NEVER** use `npm` or `yarn` — this project uses **pnpm**
- All commands: `pnpm dev`, `pnpm build`, `pnpm lint`, etc.

### 3. i18n Is Critical
- This project has 5 locales: `en`, `ar` (RTL), `tr`, `es`, `fr`
- **NEVER** add hardcoded English strings to UI components
- Use `src/messages/{locale}.json` for UI strings
- Use `content/{locale}/` for page content
- **ALWAYS** test Arabic (RTL) when editing layouts or styles
- Use `getLocalizedHref()` or `getProjectHref()` from `@/i18n/navigation` for links
- When editing pages, respect the dual static/SSR pattern (see next rule)

### 4. Static Export Compatibility
- `DEPLOY_TARGET=static` mode strips `NextIntlClientProvider` and disables API routes
- **NEVER** use `headers()`, `cookies()`, or `useSearchParams` in pages
- API routes (`src/api/`) won't work in static export — contact form is non-functional
- Check `next.config.ts` — `output: 'export'` when `DEPLOY_TARGET=static`
- Verify: `pnpm build:static:full` must succeed after your changes

### 5. Component Type Rules
- **Server components by default** — only add `"use client"` when using hooks or browser APIs
- Current server/client split: ~55% server / 45% client
- `src/components/ui/*` should generally be server-compatible (no hooks)
- `src/components/sections/*` — check existing pattern before adding `"use client"`

### 6. TypeScript Conventions
- **Strict mode enabled** — no `any` types (current codebase has some violations in pages)
- Interfaces: PascalCase with descriptive names (e.g., `ProjectMetadata`, `SiteConfig`)
- **Prefer interfaces over type aliases** for object shapes
- Use `null` not `undefined` for intentional absence
- Imports: external → `@/` → relative (see AGENTS.md)

### 7. Styling Rules
- Use `brand-*` colors from `tailwind.config.js` (`brand-500` is primary)
- Support dark mode with `dark:` prefix
- className order: layout → spacing → typography → colors → effects
- **NO custom CSS** — use Tailwind utility classes
- RTL support: check `isRTL()` in `src/i18n/config.ts` for Arabic

### 8. File Structure Conventions
```
src/
├── app/[locale]/          # Pages (server components by default)
├── components/ui/         # Reusable UI (Button, Icon, Container)
├── components/sections/   # Page sections (SiteHeader, ProjectCard)
├── i18n/                 # next-intl config only
├── services/              # Business logic (ProjectService)
├── types/                 # TypeScript interfaces
├── hooks/                 # Custom React hooks (must be "use client")
├── messages/              # Translation JSONs (en, ar, tr, es, fr)
└── api/                   # API routes (won't work in static mode)
```

## Safe Editing Boundaries

### ✅ Safe (edit freely)
- `content/*` — markdown and JSON data
- `src/messages/*` — translation files
- `src/components/ui/*` — UI components (no i18n, no hooks)
- `public/images/*` — static assets

### ⚠️ Careful (test after)
- `src/app/[locale]/*` — server pages, affect routing
- `src/i18n/*` — i18n config, affects all locales
- `src/services/*`, `src/lib/*` — data layer
- `tailwind.config.js` — affects all styles
- `src/app/globals.css` — RTL overrides, global styles

### 🛑 Ask First
- `next.config.ts` — dual static/SSR mode config
- `tsconfig.json` — strict mode enabled
- `package.json` — dependency changes
- `src/middleware.ts.disabled` — disabled for a reason

## Code Patterns to Follow

### Page Component (Server)
```typescript
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  // ...
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  // Server-side data fetching
  return (
    <Container>
      {/* Pass translations as props to client children */}
    </Container>
  );
}
```

### Client Component
```typescript
"use client";

import { useState } from "react";

interface ComponentProps {
  initialData: SomeType;
}

export default function Component({ initialData }: ComponentProps) {
  const [state, setState] = useState(initialData);
  return (/* JSX */);
}
```

### Translation Usage
```typescript
// Server components: import messages JSON directly (static-compatible)
import messages from "@/messages/en.json";
// Use: {messages.nav.home}

// Client components: receive as props from server parent
// Don't use useTranslations() hook (not used anywhere in current codebase)
```

### Project Data Access
```typescript
// Use ProjectService (not direct fs calls)
import { ProjectService } from "@/services/projectService";
const projects = await ProjectService.getAllProjects(locale);
const project = await ProjectService.getProjectById(id, locale);
```

## Common Mistakes to Avoid

| Mistake | Why It's Wrong | Correct Approach |
|---------|---------------|-----------------|
| Hardcoding English strings | Breaks i18n for 4 other locales | Use `src/messages/{locale}.json` |
| Using `any` type | Violates strict mode convention | Define proper TypeScript interface |
| Adding `"use client"` unnecessarily | Forces client bundle | Server components by default |
| Direct `fs.readFileSync` in pages | Bypasses ProjectService, no fallback | Use `ProjectService` methods |
| `generateMetaData` (typo) | Next.js won't call it | Must be `generateMetadata` |
| Missing locale prefix in links | Breaks non-English locales | Use `getLocalizedHref()` |
| Editing `md:py24` (no hyphen) | CSS class won't apply | Always `md:py-24` |

## Linting
- **ALWAYS** run `pnpm lint` after editing code
- ESLint config: `eslint-config-next` + TypeScript + Prettier
- Pre-commit: `lint-staged` configured (see package.json)

## Commit Messages
Follow conventional commits:
- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — code reorganization
- `docs:` — documentation
- `chore:` — maintenance tasks

Example: `feat(i18n): add Spanish translations for contact page`

## Verification Checklist (run before committing)
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds (SSR mode)
- [ ] `pnpm build:static` succeeds (static mode)
- [ ] No new `any` types introduced
- [ ] No hardcoded strings (check i18n)
- [ ] Arabic RTL tested (if layout/styles changed)
- [ ] No dead code added
