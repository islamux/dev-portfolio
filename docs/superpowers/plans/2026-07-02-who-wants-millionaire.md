# Who Wants to Be a Millionaire — Portfolio Addition

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the millionaire trivia game to the portfolio across all 5 locales.

**Architecture:** Data-driven — project content lives in `content/{locale}/projects.json`. No code changes.

**Tech Stack:** Next.js (App Router), TypeScript, next-intl, static export.

---

### Task 1: Create branch & update project tracker

**Files:**
- Create: branch `feature/add-who-wants-million`
- Modify: `project-tracker.json`

- [ ] **Create branch**

```bash
git checkout -b feature/add-who-wants-million
```

- [ ] **Add subtask to project-tracker.json in backlog m6**

In `project-tracker.json`, add a new subtask to `milestones.backlog[0].subtasks`:

```json
{
  "id": "m6_003",
  "label": "Add Who Wants to Be a Millionaire project",
  "status": "in_progress",
  "done": false,
  "assignee": "opencode",
  "blocked_by": null,
  "blocked_reason": null,
  "completed_at": null,
  "completed_by": null,
  "priority": "medium",
  "notes": "5 locale files + screenshot",
  "prompt": null,
  "context_files": ["content/en/projects.json", "content/ar/projects.json", "content/tr/projects.json", "content/es/projects.json", "content/fr/projects.json"],
  "reference_docs": [],
  "acceptance_criteria": ["Project appears on /projects page", "Project appears on homepage if featured"],
  "constraints": [],
  "agent_target": "opencode",
  "execution_mode": "agent",
  "depends_on": [],
  "last_run_id": null,
  "builder_prompt": null
}
```

---

### Task 2: Add project to all locale JSON files

**Files:**
- Modify: `content/en/projects.json`
- Modify: `content/ar/projects.json`
- Modify: `content/tr/projects.json`
- Modify: `content/es/projects.json`
- Modify: `content/fr/projects.json`

- [ ] **Add entry to `content/en/projects.json`**

Append to the end of the array:

```json
{
  "id": "who-wants-million",
  "name": "Who Wants to Be a Millionaire",
  "description": "An interactive trivia game built with React, TypeScript, and Vite",
  "longDescription": "An interactive trivia game built with React, TypeScript, and Vite featuring 15 questions across general knowledge topics, 3 lifelines (50:50, Audience Poll, Walk Away), a 30-second timer with SVG circular countdown, Tone.js audio effects, and PWA support for full offline play. Responsive RTL layout optimized for mobile.",
  "tech": ["React 19", "TypeScript 6", "Vite 8", "Tailwind CSS 4", "Tone.js", "PWA"],
  "github": "https://github.com/islamux/who-wants-million",
  "demo": "https://who-wants-million.vercel.app",
  "image": "/images/projects/millionaire-cover.png",
  "featured": true,
  "year": "2025"
}
```

- [ ] **Add entry to `content/ar/projects.json`**

```json
{
  "id": "who-wants-million",
  "name": "من سيربح المليون",
  "description": "لعبة تفاعلية لأسئلة المعلومات العامة مبنية باستخدام React وTypeScript وVite",
  "longDescription": "لعبة تفاعلية لأسئلة المعلومات العامة مبنية باستخدام React وTypeScript وVite، تحتوي على 15 سؤالاً في مواضيع متنوعة، مع 3 مساعدات (50:50، رأي الجمهور، الانسحاب)، مؤقت 30 ثانية مع عداد دائري SVG، تأثيرات صوتية باستخدام Tone.js، ودعم تطبيقات الويب التقدمية (PWA) للتشغيل الكامل دون اتصال بالإنترنت.",
  "tech": ["React 19", "TypeScript 6", "Vite 8", "Tailwind CSS 4", "Tone.js", "PWA"],
  "github": "https://github.com/islamux/who-wants-million",
  "demo": "https://who-wants-million.vercel.app",
  "image": "/images/projects/millionaire-cover.png",
  "featured": true,
  "year": "2025"
}
```

- [ ] **Add entry to `content/tr/projects.json`**

```json
{
  "id": "who-wants-million",
  "name": "Kim Milyoner Olmak İster",
  "description": "React, TypeScript ve Vite ile oluşturulmuş interaktif bir bilgi yarışması oyunu",
  "longDescription": "React, TypeScript ve Vite ile oluşturulmuş interaktif bir bilgi yarışması oyunu. Genel kültür konularında 15 soru, 3 cankurtaran hakkı (50:50, Seyirci Sorusu, Çekilme), 30 saniyelik SVG dairesel geri sayım süresi, Tone.js ses efektleri ve çevrimdışı oynama için PWA desteği içerir. Mobil için optimize edilmiş duyarlı RTL düzeni.",
  "tech": ["React 19", "TypeScript 6", "Vite 8", "Tailwind CSS 4", "Tone.js", "PWA"],
  "github": "https://github.com/islamux/who-wants-million",
  "demo": "https://who-wants-million.vercel.app",
  "image": "/images/projects/millionaire-cover.png",
  "featured": true,
  "year": "2025"
}
```

- [ ] **Add entry to `content/es/projects.json`**

```json
{
  "id": "who-wants-million",
  "name": "¿Quién Quiere Ser Millonario?",
  "description": "Un juego interactivo de trivia construido con React, TypeScript y Vite",
  "longDescription": "Un juego interactivo de trivia construido con React, TypeScript y Vite, con 15 preguntas de cultura general, 3 comodines (50:50, Voto del Público, Retirarse), un temporizador de 30 segundos con cuenta regresiva circular SVG, efectos de sonido con Tone.js y soporte PWA para jugar sin conexión. Diseño RTL responsivo optimizado para móviles.",
  "tech": ["React 19", "TypeScript 6", "Vite 8", "Tailwind CSS 4", "Tone.js", "PWA"],
  "github": "https://github.com/islamux/who-wants-million",
  "demo": "https://who-wants-million.vercel.app",
  "image": "/images/projects/millionaire-cover.png",
  "featured": true,
  "year": "2025"
}
```

- [ ] **Add entry to `content/fr/projects.json`**

```json
{
  "id": "who-wants-million",
  "name": "Qui Veut Gagner des Millions",
  "description": "Un jeu de quiz interactif construit avec React, TypeScript et Vite",
  "longDescription": "Un jeu de quiz interactif construit avec React, TypeScript et Vite, avec 15 questions de culture générale, 3 jokers (50:50, Vote du Public, Abandon), un minuteur de 30 secondes avec compte à rebours circulaire SVG, des effets sonores Tone.js et un support PWA pour jouer hors ligne. Disposition RTL responsive optimisée pour mobile.",
  "tech": ["React 19", "TypeScript 6", "Vite 8", "Tailwind CSS 4", "Tone.js", "PWA"],
  "github": "https://github.com/islamux/who-wants-million",
  "demo": "https://who-wants-million.vercel.app",
  "image": "/images/projects/millionaire-cover.png",
  "featured": true,
  "year": "2025"
}
```

---

### Task 3: Verify build

**Files:**
- Run: build command

- [ ] **Build to verify nothing breaks**

```bash
pnpm build:static:full
```

Expected: Build succeeds with no errors. Project pages for all 5 locales generated.

- [ ] **Update tracker to done**

In `project-tracker.json`, set `milestones.backlog[0].subtasks[?id=m6_003].status = "done"` and `done = true`.

---

### Done

After these tasks, the millionaire game will appear on the homepage (featured) and `/projects` listings across all 5 locales.
