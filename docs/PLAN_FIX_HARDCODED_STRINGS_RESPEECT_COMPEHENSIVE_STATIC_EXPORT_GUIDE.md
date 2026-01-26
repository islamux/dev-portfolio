# Plan: Fix Hardcoded Strings in Projects Page

## Overview

This plan addresses the hardcoded strings in `/src/app/[locale]/projects/page.tsx` by implementing proper internationalization using the existing translation system.

## Current Issues

### Hardcoded Strings Identified

1. **Line 37**: `"Projects"` - Page title
2. **Line 40**: `"My portfolio projects"` - Page description
3. **Line 46**: `code: projects.card.code` - Incorrect syntax (should be string)
4. **Line 47**: `demo: "Complete Project(Open Source)"` - Hardcoded demo text
5. **Line 6**: `useTranslations` import - Incorrect approach for server components

### Translation Keys Available

From `/src/messages/en.json`:

```json
{
  "projects": {
    "title": "Projects",
    "description": "A collection of my work and contributions",
    "card": {
      "code": "Code",
      "demo": "Complete Project (Open Source)"
    }
  }
}
```

## Solution Architecture

### Approach

1. **Dynamic Message Import**: Load translation messages dynamically for static export compatibility
2. **Namespace Extraction**: Extract translations from the `projects` namespace
3. **Fallback Strategy**: Provide English fallback for missing translations
4. **Error Handling**: Graceful handling of missing translation files

### Implementation Pattern

Follows the established pattern used in:

- `/src/app/[locale]/page.tsx` (home page)
- `/src/app/[locale]/layout.tsx` (main layout)

## Detailed Implementation Steps

### Step 1: Remove Incorrect Import

```typescript
// REMOVE this line
import { useTranslations } from "next-intl";
```

### Step 2: Add Dynamic Message Import

```typescript
// Add after line 29 (after getting projects)
let messages: any = {};
try {
  messages = (await import(`@/messages/${locale}.json`)).default;
} catch (error) {
  console.warn(`Failed to load messages for locale ${locale}:`, error);
}
```

### Step 3: Extract Project Translations

```typescript
// Add after message import
const projectTranslations = messages?.projects || {};
```

### Step 4: Replace Hardcoded Header Strings

```typescript
// Replace lines 37-40
<h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
  {projectTranslations.title || "Projects"}
</h1>
<p className="text-xl text-gray-600 dark:text-gray-400">
  {projectTranslations.description || "My portfolio projects"}
</p>
```

### Step 5: Fix Translations Object

```typescript
// Replace lines 44-48
<ProjectsList
  initialProjects={projects}
  translations={{
    code: projectTranslations.card?.code || "Code",
    demo: projectTranslations.card?.demo || "Complete Project (Open Source)"
  }}
  locale={locale}
/>
```

## Complete Code Transformation

### Before

```typescript
import { useTranslations } from "next-intl";

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = await ProjectService.getAllProjects(locale);

  return (
    <div className="py-12 md:py-20">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            My portfolio projects
          </p>
        </header>
        <ProjectsList
          initialProjects={projects}
          translations={{
            code: projects.card.code,
            demo: "Complete Project(Open Source)"
          }}
          locale={locale}
        ></ProjectsList>
      </Container>
    </div>
  );
}
```

### After

```typescript
// Import removed: useTranslations

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = await ProjectService.getAllProjects(locale);

  // Load translations dynamically
  let messages: any = {};
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}:`, error);
  }

  const projectTranslations = messages?.projects || {};

  return (
    <div className="py-12 md:py-20">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {projectTranslations.title || "Projects"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {projectTranslations.description || "My portfolio projects"}
          </p>
        </header>
        <ProjectsList
          initialProjects={projects}
          translations={{
            code: projectTranslations.card?.code || "Code",
            demo: projectTranslations.card?.demo || "Complete Project (Open Source)"
          }}
          locale={locale}
        ></ProjectsList>
      </Container>
    </div>
  );
}
```

## Translation File Status

### Complete Translation Files

- `en.json` - Complete with all keys

### Incomplete Translation Files

- `ar.json`, `tr.json`, `fr.json`, `es.json` - Only contain image alt text

### Missing Keys in Other Languages

The following keys need to be added to other language files with proper translations:

#### Arabic (ar.json)

```json
{
  "projects": {
    "title": "المشاريع",
    "description": "مجموعة من أعمالي ومساهماتي",
    "card": {
      "code": "الكود",
      "demo": "المشروع الكامل (مفتوح المصدر)"
    }
  }
}
```

#### Turkish (tr.json)

```json
{
  "projects": {
    "title": "Projeler",
    "description": "Çalışmalarım ve katkılarımın bir koleksiyonu",
    "card": {
      "code": "Kod",
      "demo": "Tam Proje (Açık Kaynak)"
    }
  }
}
```

#### French (fr.json)

```json
{
  "projects": {
    "title": "Projets",
    "description": "Une collection de mes travaux et contributions",
    "card": {
      "code": "Code",
      "demo": "Projet complet (Open Source)"
    }
  }
}
```

#### Spanish (es.json)

```json
{
  "projects": {
    "title": "Proyectos",
    "description": "Una colección de mi trabajo y contribuciones",
    "card": {
      "code": "Código",
      "demo": "Proyecto completo (Código abierto)"
    }
  }
}
```

### Implementation Strategy for Missing Translations

1. **Merge with existing content**: Add the new `projects` section to each language file
2. **Preserve existing structure**: Keep the existing `images` section intact
3. **Use proper JSON formatting**: Ensure valid JSON syntax
4. **Test each language**: Verify translations display correctly

### Complete Translation Files Structure

After adding the missing keys, each language file should have this structure:

```json
{
  "images": {
    "projects": {
      "new_muslims": {
        "alt": "New Muslim Stories project screenshot"
      },
      "athkari-cover-v2": {
        "alt": "Athkarix project screenshot"
      },
      "portfolio": {
        "alt": "Developer Portfolio project screenshot"
      },
      "voice-of-truth": {
        "alt": "Voices of Truth project screenshot"
      },
      "khwater": {
        "alt": "Khwater project screenshot"
      }
    }
  },
  "projects": {
    "title": "[Translated Title]",
    "description": "[Translated Description]",
    "card": {
      "code": "[Translated Code]",
      "demo": "[Translated Demo]"
    }
  }
}
```

### Translation Quality Guidelines

1. **Consistency**: Use consistent terminology across all translations
2. **Context**: Consider the technical context (developer portfolio)
3. **Length**: Keep translations concise but clear
4. **Cultural appropriateness**: Ensure translations are culturally appropriate
5. **Technical accuracy**: Maintain technical accuracy for terms like "Open Source"

### Translation Implementation Steps

1. **Backup existing files**: Create backups before making changes
2. **Add translations incrementally**: Add one language at a time
3. **Test after each addition**: Verify each language works before proceeding
4. **Use JSON validator**: Validate JSON syntax after each change
5. **Document changes**: Keep track of which languages have been updated

### Fallback Behavior

The implementation includes fallback behavior:

- If translation file is missing: Falls back to empty object
- If translation key is missing: Falls back to English default
- If entire projects section is missing: Falls back to English strings

This ensures the application remains functional even with incomplete translations.

## Testing Strategy

### Manual Testing

1. **English**: Verify all strings display correctly
2. **Other Languages**: Verify fallback to English works
3. **Static Export**: Test with `pnpm build:static`
4. **Development Mode**: Test with `pnpm dev`

### Automated Testing

1. **ESLint**: Run `pnpm lint` to ensure code quality
2. **TypeScript**: Verify no type errors
3. **Build**: Run `pnpm build` to check production build

## Risk Assessment

### Low Risk

- Follows established patterns from other pages
- Graceful fallback for missing translations
- No breaking changes to existing functionality

### Potential Issues

- Missing translation files (handled by try/catch)
- Missing translation keys (handled by fallback values)
- Static export compatibility (handled by dynamic import)

## Implementation Timeline

1. **Phase 1**: Code changes (5 minutes)
2. **Phase 2**: Testing (10 minutes)
3. **Phase 3**: Translation file updates (optional, 15 minutes per language)

## Files to Modify

### Primary

- `/src/app/[locale]/projects/page.tsx` - Main implementation

### Optional (Future Work)

- `/src/messages/ar.json` - Add Arabic translations
- `/src/messages/tr.json` - Add Turkish translations
- `/src/messages/fr.json` - Add French translations
- `/src/messages/es.json` - Add Spanish translations

## Verification Checklist

- [ ] All hardcoded strings replaced with translations
- [ ] Fallback values provided for all translations
- [ ] Error handling for missing translation files
- [ ] Follows established code patterns
- [ ] ESLint passes
- [ ] TypeScript compilation succeeds
- [ ] Development build works
- [ ] Production build works
- [ ] Static export works (if needed)

## Rollback Plan

If issues arise:

1. Revert to previous version using git
2. Check error logs for specific issues
3. Test with English locale first
4. Verify translation file structure

## Success Criteria

1. All strings in projects page are translated based on locale
2. Missing translations fall back gracefully to English
3. No console errors in development or production
4. Page loads correctly in all supported locales
5. Static export works without errors

## Additional Notes

- The solution maintains compatibility with both dynamic and static export modes
- Translation files for other languages can be completed as separate tasks
- The pattern is consistent with other pages in the application
- No external dependencies are added

## References

- AGENTS.md: Project guidelines and patterns
- `/src/app/[locale]/page.tsx`: Reference implementation
- `/src/app/[locale]/layout.tsx`: Message loading pattern
- `/src/messages/en.json`: Complete translation reference
