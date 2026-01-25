# Plan to Add New Muslims Stories Project to Portfolio

## Step 1: Add Project Data to All Locales

1. Add project data to all locale files: `content/en/projects.json`, `content/ar/projects.json`, `content/tr/projects.json`, `content/es/projects.json`, `content/fr/projects.json`
2. Follow the existing Project interface with proper fields: id, name, description, tech stack, links (github, demo), image path, etc.
3. No new component files needed - existing `ProjectsList` and `ProjectCard` components in `src/components/sections/` handle display automatically

## Architecture Note

This portfolio uses a **data-driven architecture** where:

- Project data is stored in `content/{locale}/projects.json` files (5 languages: en, ar, tr, es, fr)
- UI components in `src/components/ui/` handle generic display logic (Button, Container, etc.)
- Section components in `src/components/sections/` handle page-specific features (ProjectCard, ProjectsList, etc.)
- No new components are typically needed for new projects - existing components handle all display
- Static generation automatically creates pages for all projects during build

## Step 2: Add Project Image

1. Add the project image to the `public/images/projects` directory
2. Name the image `newmuslims-stories.jpg` or `newmuslims-stories.png`

## Step 3: Add Translations

1. Update the `messages/en.json` file to include English translations for project-specific UI text
2. Update the `messages/ar.json` file to include Arabic translations for project-specific UI text
3. Ensure consistency across all language files (tr.json, es.json, fr.json)

## Step 4: Set Featured Status (Optional)

1. If you want the project featured on the homepage, set `featured: true` in the project data
2. Featured projects automatically appear in the homepage hero section
3. Update the featured projects order if needed in the project data

## Step 5: Verify Automatic Integration

1. The project will automatically appear in `/projects` listing via the `ProjectsList` component
2. Detail page will be automatically generated at `/projects/[id]` using existing section components (`ProjectHeader`, `ProjectDescription`, `ProjectLinks`, etc.)
3. Technology filtering will work automatically based on the `tech` array in the project data
4. Verify the project displays correctly in all supported languages

## Step 6: Test and Verify

1. Run `pnpm dev` to start the development server
2. Navigate to `/projects` to verify the new project appears in the listing
3. Click on the project to test the detail page functionality
4. Test language switching to ensure translations work correctly
5. Verify responsive design on different screen sizes

## Step 7: Build and Lint

1. Run `pnpm lint` to check for any ESLint issues
2. Run `pnpm build` to ensure production build works correctly
3. Fix any build errors or warnings that appear
4. Test the production build locally with `pnpm start` if needed

## Step 8: Commit Changes

1. Commit the changes to the repository with a descriptive commit message
