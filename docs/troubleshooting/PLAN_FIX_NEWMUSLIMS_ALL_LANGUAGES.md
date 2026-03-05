# Plan: Fix "New Muslim Stories" Project Missing in Non-English Languages

## Problem Analysis

- **English**: 6 projects including "New Muslim Stories" ✅
- **Arabic/French/Spanish/Turkish**: Only 5 projects, missing "New Muslim Stories" ❌
- **Issue**: Project disappears when user changes language from English

## Solution Steps

### Step 1: Prepare Translations

Add "New Muslim Stories" to each language with proper translations:

**Arabic**: "قصص المسلمين الجدد" (RTL support)
**French**: "Histoires de Nouveaux Musulmans"  
**Spanish**: "Historias de Nuevos Musulmanes"
**Turkish**: "Yeni Müslüman Hikayeleri"

Keep technical details identical across all languages (tech stack, URLs, image, year).

### Step 2: Update Language Files

Modify these files to add the translated project:

1. `content/ar/projects.json` - Add Arabic version
2. `content/fr/projects.json` - Add French version
3. `content/es/projects.json` - Add Spanish version
4. `content/tr/projects.json` - Add Turkish version

Add this JSON structure to the end of each array:

```json
{
  "id": "new-muslims",
  "name": "[TRANSLATED NAME]",
  "description": "[TRANSLATED DESCRIPTION]",
  "longDescription": "[TRANSLATED LONG DESCRIPTION]",
  "tech": [
    "Next.js 16",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "next-intl",
    "i18n",
    "Markdown"
  ],
  "github": "https://github.com/islamux/new-muslim-stories",
  "demo": "https://new-muslim-stories.vercel.app/en",
  "image": "/images/projects/new_muslims.png",
  "featured": true,
  "year": "2025"
}
```

### Step 3: Validate JSON Files

Run these commands to verify:

```bash
node -e "require('./content/ar/projects.json')"
node -e "require('./content/fr/projects.json')"
node -e "require('./content/es/projects.json')"
node -e "require('./content/tr/projects.json')"
```

Each should now show 6 projects and include the "new-muslims" project.

### Step 4: Build & Test

```bash
# Build
DEPLOY_TARGET=static pnpm run build

# Test locally
pnpm dlx serve out -p 3000
```

### Step 5: Browser Verification

1. Visit `http://localhost:3000/en/projects/` - Should see "New Muslim Stories"
2. Visit `http://localhost:3000/ar/projects/` - Should see "قصص المسلمين الجدد"
3. Visit `http://localhost:3000/fr/projects/` - Should see "Histoires de Nouveaux Musulmans"
4. Visit `http://localhost:3000/es/projects/` - Should see "Historias de Nuevos Musulmanes"
5. Visit `http://localhost:3000/tr/projects/` - Should see "Yeni Müslüman Hikayeleri"
6. Test language switching - Project should remain visible

## Expected Result

After implementation: All 5 languages will consistently show 6 projects, with "New Muslim Stories" properly translated and visible across all language versions.

---

**Status**: ✅ Plan saved - Ready for execution
