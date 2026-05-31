# Project Command Center - Dev Portfolio

**Project:** Dev Portfolio  
**Current Branch:** `feat/setup-command-center`  
**Package Manager:** pnpm@10.28.0  
**Status:** Mid-stage, functional with known issues (see [AI_HANDOFF.md](./AI_HANDOFF.md))

---

## Quick Start
```bash
pnpm dev                      # Dev server (localhost:3000)
pnpm build                    # Prod build
pnpm build:static            # Static export (DEPLOY_TARGET=static)
pnpm lint                    # ESLint check
```

## Key Documents
| File | Purpose |
|------|---------|
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | Project purpose, tech stack, current state |
| [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) | Codebase structure, patterns, technical debt |
| [PROJECT_WORKFLOW.md](./PROJECT_WORKFLOW.md) | Dev workflows, checklists, release process |
| [project-tracker.json](../../project-tracker.json) | Milestones, tasks, agent logs |
| [AI_AGENT_RULES.md](./AI_AGENT_RULES.md) | Rules for AI-assisted development |
| [AI_HANDOFF.md](./AI_HANDOFF.md) | Context for agent switching |

## Known Critical Issues
1. `generateMetaData` typo in `src/app/[locale]/page.tsx` (metadata not applied)
2. `SiteFooter` component exists but never rendered
3. Dead code: `generateStaticParams.ts`, `i18n/guards.ts`, `types/project.ts`
4. Contact form API (`/api/contact`) only logs to console (non-functional)
5. `home.md` has non-localized `/about` link

## Repository Navigation
```
src/
├── app/[locale]/          # Locale-specific pages (home, about, projects, contact)
├── components/
│   ├── ui/                # Reusable UI (Button, Icon, ThemeToggle)
│   └── sections/          # Page sections (SiteHeader, ProjectCard, ContactForm)
├── i18n/                  # next-intl config (locales, navigation helpers)
├── services/              # ProjectService (data access layer)
├── types/                 # TypeScript interfaces (Project, ContentFrontmatter)
├── hooks/                 # Custom hooks (useProjectFilter, useMounted, useContactForm)
├── messages/              # Translation JSONs (en, ar, tr, es, fr)
└── api/contact/           # Contact form API route (POST)
```

## Scripts
- `scripts/build-static.sh`: Static export with cleanup + Hostinger deployment hints
- `pnpm test:static`: Full static build + serve test cycle

## Git Status
- **Main branch:** `main`
- **Active branches:** `feat/setup-command-center` (current), 15+ stale feature branches
- **Recent commits:** Turkish language support, New Muslims project, Hostinger deployment fixes
