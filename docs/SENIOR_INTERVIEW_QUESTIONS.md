# Senior Engineering Interview: Dev Portfolio

> **Format:** 4 rounds × 25 questions = 100 + 5 bonus = 105 total
> **Target:** Mid→Senior candidate
> **Style:** FAANG/Big Tech — behavioral, architectural depth, system design, debugging, and coding
> **Project:** Multilingual (EN/AR-RTL/FR/ES/TR) personal developer portfolio — Next.js 16.3.2 / React 19.2.8, next-intl + custom ThemeProvider (next-themes installed but unused) + gray-matter/react-markdown + resend, **dual SSR/static-export build** (Vercel + Hostinger LiteSpeed)

---

## Round 1: Architecture & System Design (25 questions)

### Q1. The portfolio deploys to both Vercel (SSR) and Hostinger (static). How is the dual build toggled?

**A:** A single env var read in `next.config.ts:6`: `const isStatic = process.env.DEPLOY_TARGET === 'static'`. It conditionally sets `output: isStatic ? 'export' : undefined` (`:9`), `trailingSlash: isStatic ? true : undefined` (`:10`), `images: { unoptimized: isStatic }` (`:12`). Two env vars serve two audiences: `DEPLOY_TARGET` (server-side, read in next.config + layout) and `NEXT_PUBLIC_DEPLOY_TARGET` (client-side, read in `(index)/page.tsx:8` for the root redirect). `build:static` sets both. The single-codebase-dual-deploy is the cleanest design (no `process.env` branches scattered in `src/` beyond the documented layout-fork).

### Q2. Static export (`output: 'export'`) disallows server code. What constraints does that impose?

**A:** No API routes (no server to run them), no `headers()`/`cookies()`/middleware, no dynamic routes without `generateStaticParams`, no image optimization (hence `unoptimized`). The app satisfies these: contact form is broken (Q5, no working API), `NextIntlClientProvider` is bypassed in static mode (it calls `headers()`), locale switching is client-side (no middleware), all pages are SSG via `generateStaticParams`. The constraint shaped every architectural choice. `docs/deployment/static-export/STATIC_VS_SSR_ANALYSIS.md:226-230` documents the forbidden APIs.

### Q3. There's a `LocaleLayout` provider fork. What does it branch on, and why?

**A:** `src/app/[locale]/layout.tsx:55-62` (gated on `isStatic` at `:32`) — in SSR mode, wraps everything in `<NextIntlClientProvider>`; in static mode, **bypasses it**. Reason: `NextIntlClientProvider` calls `headers()` (to read request context), which is forbidden in static export → build breaks. So static mode skips the provider, forcing every client component to receive `locale`/`navDict` as **props** instead of via `useLocale()`/`useTranslations()` (`AGENTS.md:37-41`). This is the core static-compat adaptation: props-passing replaces i18n hooks. Documented in `docs/troubleshooting/ISSUES_AND_SOLUTIONS.md:1100-1131` (Issue 8.2).

### Q4. There's no blog — only `home.md` and `about.md`. Why does the markdown pipeline exist?

**A:** Despite the gray-matter + react-markdown + remark-gfm + rehype-highlight stack (suggesting a blog), `content/{locale}/` has exactly `home.md`, `about.md`, `projects.json` per locale — **no slugged articles, no `posts/`**. The markdown pipeline renders only the two content pages (Home/About). So the stack is over-provisioned for the current scope (a blog was planned/anticipated but not built). The pipeline is correct for what exists; it's just not used for a blog. A senior read: the deps suggest intent beyond the implementation.

### Q5. The contact form is broken. Identify the three defects.

**A:** (1) **Unreachable handler** — `src/api/contact/route.ts` lives under `src/api/`, but Next only treats `src/app/api/` as routes. There's no `src/app/api/`. So `POST /api/contact` → **404** in every mode. `useContactForm.ts:34` calls a URL nobody serves. (2) **Statically impossible** — even if relocated, `output: 'export'` can't ship API routes (`docs/deployment/static-export/STATIC_VS_SSR_ANALYSIS.md:226`), so it can't work on the Hostinger target. (3) **Officially unfinished** — `PROJECT_ARCHITECTURE.md:122` states "Contact form is non-functional" (the old `project-tracker.json` also flagged it as `m5_005` todo before the tracker was deleted in PR #14). The real fallback is mailto/social links (`contact/page.tsx:53-72`).

### Q6. The contact email HTML is built by string interpolation. Is it escaped?

**A:** Yes — `src/api/contact/route.ts:42-48` interpolates `${data.name}`, `${data.email}`, `${data.message}` into the email `html:`, but every field runs through `escapeHtml()` (`src/lib/escapeHtml.ts:11`, escaping `& < > " '`), and `.replace(/\n/g, "<br>")` is applied **after** escaping (`:48`). The risk this defends against: an unsanitized `message: "</p><script>...</script><p>"` would ship inside the delivered email HTML — script execution varies by client (most block it), but HTML injection (defacing the email, injecting links/forms) works in many. The escaping is the correct fix; plain-text email would eliminate the class entirely. Defense: never interpolate untrusted input into HTML without escaping.

### Q7. Why `trailingSlash: true` in static mode? What's the Hostinger 403 saga?

**A:** Hostinger's LiteSpeed server auto-redirects `/en` → `/en/`, then **403s** if `en/index.html` doesn't exist. With `trailingSlash: true`, Next emits directory-based files (`out/en/index.html`), so `/en/` resolves. Without it, Next emits `out/en.html`, and `/en/` (the redirect target) 404s. `docs/troubleshooting/ISSUES_AND_SOLUTIONS.md:1181-1227` (Issue 8.5) documents this. The fix also requires wiping `public_html/` before each upload (stale files interfere). The 40-check `scripts/test-routes.sh` validates the static deploy. Trade-off: uglier URLs (`/en/` vs `/en`) but necessary for LiteSpeed.

### Q8. The root `/` redirect is client-side (`'use client'`). Why not a server `redirect()`?

**A:** `src/app/(index)/page.tsx:1` is `'use client'`, doing `router.replace(isStatic ? '/en/' : '/en')` (`:11`), with `isStatic` read from `NEXT_PUBLIC_DEPLOY_TARGET` (`:8`). A server `redirect('/en')` in the root would crash static export (no server to emit the redirect) — same class of bug as salam-nextjs's root redirect (Q26 of that doc). The client redirect works in both modes. Trade-off: a brief blank page at `/` before redirect (no SSR content), and depends on JS. The trailing-slash awareness (`isStatic ? '/en/' : '/en'`) handles the static/SSR URL-shape difference. Documented necessity.

### Q9. Why props-passing instead of `useTranslations()` hooks?

**A:** Static mode bypasses `NextIntlClientProvider` (Q3), so client components can't call `useTranslations()`/`useLocale()` (no provider context) — they'd throw. The adaptation: the server layout reads messages + locale and passes them as props (`navDict`, `locale`) to client components, which access translations as plain-object lookups (`messages.home.title`). `docs/project/PROJECT_ARCHITECTURE.md:92` confirms `useTranslations` is never used. This is a deliberate static-export adaptation (Issue 8.3). Trade-off: verbose prop-drilling, no hook ergonomics, but works in both modes. `AGENTS.md:37-41` codifies it.

### Q10. Fonts use CDN `@font-face` (Google Fonts `@import`), not `next/font`. Why?

**A:** `next/font/google` is **broken under Turbopack in Next 16.0.x** (`docs/troubleshooting/ISSUES_AND_SOLUTIONS.md:95-129`, Issue 2.1). The workaround: hand-written `@font-face` for Geist/Geist Mono (`globals.css:9-23`) + Google Fonts `@import` for Arabic faces (Tajawal, Amiri, Noto, Cairo, `:4-7`). Trade-off: loses next/font's optimization (self-hosting, subsetting, preload, `font-display`), adds render-blocking external requests (the `@import`). `tailwind.config.js:26-29` maps the `--font-geist-sans/mono` vars. Once the Turbopack font bug is fixed, migrate to `next/font` for the optimization. The current choice is a documented workaround, not negligence.

### Q11. There's no `middleware.ts`. How does locale detection work?

**A:** There's no middleware at all — no `src/middleware.ts`, and not even the `src/middleware.ts.disabled` variant that `docs/deployment/static-export/STATIC_VS_SSR_ANALYSIS.md:58-65` describes (that file has since been removed from the tree entirely). Locale "detection" is purely **client-side via `LanguageSwitcher`** (`LanguageSwitcher.tsx:24-44` manual URL rewrite). The SSR `request.ts:10` just `notFound()`s on invalid locales. So there's no automatic `Accept-Language` detection/redirect — a user lands on `/` and the client redirects to `/en`. The canonical next-intl setup uses middleware for detection; this app omits it for static compat. Trade-off: no smart locale detection (a French browser still gets `/en` first), but static-deployable.

### Q12. `LanguageSwitcher` does manual URL rewriting. Decode it.

**A:** `LanguageSwitcher.tsx:24-28` — `handleLocaleChange` calls `router.push(buildLocalePath(pathname, locale, newLocale))` using the **`next/navigation` router** (`:5`), not next-intl's (which can't run in static mode — no provider). The manual locale-prefix string manipulation itself lives in `buildLocalePath` (`src/i18n/navigation.ts:19-28`, a `pathname.replace` on the current locale prefix). Trade-off: fragile (string manipulation of paths), loses next-intl's locale-aware nav, but works statically. The manual rewrite is a static-compat workaround (Issue 8.3).

### Q13. How does the projects content pipeline work (it's JSON, not markdown)?

**A:** `content/{locale}/projects.json` (14 projects in `en/projects.json`, all `featured: true`) — `getProjectData(locale)` (`src/lib/content.ts:35`) reads it with **English fallback** if the locale file is missing or empty (`:39-44`). `ProjectService` (`projectService.ts`) wraps it: `getAllProjects` (`:4`), `getFeaturedProjects(locale, limit)` filters `project.featured` + slices (`:8-12`), `getProjectById(id, locale)` (`:14`, delegating to `content.ts:47-50`). The project **detail** page (`projects/[id]/page.tsx:23`) calls `getProjectById` — an earlier version bypassed the service with inline `fs.readFileSync`+`JSON.parse`, but that layering violation has been fixed (Q14); `PROJECT_ARCHITECTURE.md:67` still documents the old issue (doc drift).

### Q14. The project detail page used to bypass `ProjectService`. What was the violation, and is it still there?

**A:** Historically yes: `projects/[id]/page.tsx` did `fs.readFileSync` + `JSON.parse` inline instead of going through the service. It's since been fixed — the page (now 47 lines total) calls `getProjectById(id, locale)` (`page.tsx:23`), a proper service function (`projectService.ts:14` → `content.ts:47-50`). `PROJECT_ARCHITECTURE.md:67` still flags the old bypass — stale doc. What the violation costs, and why the question still matters: (1) two code paths reading the same data (drift risk); (2) an inline read skips the service's logic — e.g. `getProjectData`'s missing/empty-file English fallback (`content.ts:39-44`) wouldn't have applied; (3) abstractions added after pages are written get bypassed unless refactored back.

### Q15. `generateStaticParams` for projects reads **every** locale's `projects.json`. Why?

**A:** `projects/[id]/page.tsx:12-16` — `generateStaticParams` flatMaps `locales` × `getAllProjects(locale)` (the **service**, so the missing/empty-file English fallback applies here too). To pre-render `/en/projects/x`, `/ar/projects/x`, ..., the build needs all valid `id`s per locale. Trade-off: build-time cost (5 locale files), but necessary for the cross-locale static generation. If a project exists in `en` but not `ar` (and `ar/projects.json` is present but incomplete), the AR detail page isn't generated → 404 — the file-level fallback doesn't fill per-project gaps. Edge case worth checking.

### Q16. The project detail page has **no** `generateMetadata`. What's the SEO impact?

**A:** `projects/[id]/page.tsx` has no metadata export → uses the layout's default title/description for every project. So all 14 project pages share one title — poor SEO (Google can't differentiate), poor social sharing (OG shows generic). Fix: add `generateMetadata({ params })` returning the project's title/description/OG image. The home/about/projects-list pages **do** have `generateMetadata` (`page.tsx:21`, `about/page.tsx:14`, `projects/page.tsx:15`) — the detail page is the gap. Inconsistent metadata coverage.

### Q17. `useTranslations` is never used. How are translations accessed?

**A:** Plain-object access: the layout loads `messages` (per locale) and passes slices (`messages.home`, `messages.nav`) as props (`navDict`, `layout.tsx:28`) to client components, which read `navDict.title` etc. (Q9). This is the static-compat pattern. A missing key degrades to hardcoded English via optional chains + `||` defaults (`page.tsx:48` `messages.home ?? {}`, `:65` `translations?.hero?.cta?.projects || "View Projects"`). So no hook, no provider (in static mode), just props + plain objects. Functional but unergonomic. `PROJECT_ARCHITECTURE.md:92` confirms.

### Q18. The sitemap loops locales × routes × project ids. How is it generated?

**A:** `src/app/sitemap.ts:22-47` (`force-static :5`) — loops `locales` × static routes (home, about, projects, contact, `:7`) × project ids (from `en/projects.json` only, `:13`). Emits all URLs with `priority`/`lastModified`. `force-static` generates it once at build. Coverage: 5 locales × 4 routes + 5 locales × 14 project pages = **90 URLs**. For SEO, this is comprehensive. A senior note: the sitemap reads only `en/projects.json` for ids — if a project exists in another locale but not EN, it's missed. Verify id-consistency across locales.

### Q19. `English-fallback` for project content. How does it degrade?

**A:** `content.ts:39-44` — if `content/ar/projects.json` is missing **or empty**, the whole list falls back to `en` (file-level fallback — there is no per-project merge). So an AR visitor sees English for untranslated project lists (graceful degradation — better than 404/broken). Trade-off: the AR experience is incomplete (mixed-language UI). For a portfolio, acceptable (the visitor still sees the project). A `localized: boolean` per project could let the UI flag "English content." The fallback is the pragmatic choice for a 5-locale portfolio with translation debt.

### Q20. `useMounted` defers the flag with `setTimeout(...,0)`. Why the setTimeout?

**A:** `src/hooks/useMounted.ts:6-12` — instead of `useEffect(() => setMounted(true), [])` (which fires after paint), it defers via `setTimeout(...,0)` **and cleans up** (`clearTimeout`, `:11`). Reason: avoid cascading re-renders during hydration — `setTimeout(0)` pushes the state update to the next macrotask, after the hydration batch settles. This is a refinement to reduce hydration-phase re-render churn (e.g., `ThemeToggle` showing a placeholder, then flipping). Trade-off: slightly later mount-detection (one tick). A subtle optimization; whether it measurably helps depends on the component tree. Paired with `<html suppressHydrationWarning>` (Q21) for the custom ThemeContext.

### Q21. The `<html>` has `suppressHydrationWarning`. Why?

**A:** `src/app/[locale]/layout.tsx:53` — but the reason is subtler than the usual next-themes story: theming here is a **hand-rolled ThemeContext** (`src/app/providers.tsx:12`), not next-themes (which is installed but never imported — `package.json:21`). The custom provider mutates `document.documentElement` classes inside a `useEffect` (`providers.tsx:26-35`, `:37-48`) — post-hydration — and its `useState` initializer reads `localStorage` on the client (`:19-24`), so server HTML ("system", no class) can diverge from the client's first render. `suppressHydrationWarning` tolerates attribute-level divergence on `<html>` specifically. The suppression is scoped to `<html>` (not blanket), so real mismatches elsewhere still warn. Senior observation: unlike next-themes, this provider has **no blocking inline script**, so dark-mode users get a light-theme flash (FOUC) until the effect runs — the warning-suppression is doing less work than the pattern it imitates.

### Q22. The `useContactForm` POSTs to `/api/contact` which doesn't exist. What does the user see?

**A:** The fetch (`useContactForm.ts:34`) → 404 (no route, Q5). The form's error handling: status machine `idle|loading|success|error` (`:4`) — on fetch failure (404 non-OK), sets `error`. So the user sees an error state ("message failed to send"). No email is sent. The honeypot check (`:24-28`) runs first (spam bots → an error "Spam detected" — see Q37). So the form appears to work (validation, loading, error states) but never actually sends. The user thinks their message failed, not that the feature is broken. A confusing UX. Fix: relocate the handler + accept SSR-only contact, or switch to a mailto/formspree.

### Q23. How would you make the contact form actually work on static hosting?

**A:** Static hosts can't run your server code, so use a **third-party form backend**: (1) **Formspree/Getform/Web3Forms** — form POSTs to their endpoint, they email you. No server code, works statically. (2) **Resend + a serverless function** (Vercel/Netlify functions) — if you keep any serverless deploy. (3) **mailto:** link — no backend, opens the user's email client (crude). For the Hostinger static target, option (1) is the cleanest (replace the broken `/api/contact` POST with a Formspree URL). Keep resend for the SSR/Vercel deploy (relocate the handler to `src/app/api/contact/route.ts`). The fix depends on the deploy target.

### Q24. `project-tracker.json` was invalid JSON (trailing comma). What was the impact, and where is it now?

**A:** It **was** invalid: trailing commas at lines 131 and 500 (`python3 -m json.tool` fails) — `JSON.parse` throws `SyntaxError`. Any tooling reading it (tracker script, IDE extension, CI) crashed. The eventual resolution was **deletion**: the file was removed in PR #14 (commit `442ddbc`, "chore: remove project-tracker.json and its workflow step"). The hygiene lesson stands: add a CI check that all committed `.json` parses (`for f in $(git ls-files '*.json'); do jq . "$f" > /dev/null || exit 1; done`). Bonus drift: the tracker's own "65 pages" claim (`:530` in its last committed copy) contradicted `build.log`'s 55.

### Q25. If you were rebuilding from scratch, top three changes?

**A:** (1) **Decide SSR or static** — the dual-build forces the i18n props-passing (Q9), no middleware (Q11), broken contact (Q5). If SSR-only (Vercel), simplify massively (next-intl hooks, middleware detection, real contact API). If static-only (Hostinger), embrace it fully (no API routes, Formspree for contact). The dual-build is the root complexity. (2) **Build or remove the blog** — the markdown stack is over-provisioned (Q4); either add a blog or trim the deps. (3) **Fix the contact form** (Q5, Q23) + relocate the handler + add the project-detail `generateMetadata` (Q16). Several older wounds are already healed: the email HTML is escaped (Q6), the detail page uses `getProjectById` (Q14), and `project-tracker.json` was deleted (Q24). Beyond: migrate to `next/font` when Turbopack fixes the bug (Q10), drop the unused `next-themes` dependency (Q44), label the empty `SkipToContent` anchor (Q43). The architecture is a portfolio-template done well; the gaps are static-export friction + unfinished features.

---

## Round 2: React & Next.js Deep Dive (25 questions)

### Q26. `LocaleLayout` is an async server component. Why async?

**A:** `src/app/[locale]/layout.tsx:22-23` — `async` to `await params` (Next 16 async params) for the locale, then `setRequestLocale(locale)` (`:25`), read messages, and conditionally wrap in providers (`:55-62`). Server layouts can be async to do server-side work (read files, await params). The async-params change (Next 16) requires it. Forgetting `await params` reads a Promise → undefined locale → breaks downstream.

### Q27. `setRequestLocale(locale)` is called in layout + pages. What does it do?

**A:** next-intl's `setRequestLocale` binds the current request's render context to a locale, enabling static rendering per locale (messages load correctly during SSG). Called in `[locale]/layout.tsx:25` and every page. Without it, the locale isn't bound during static generation → messages default/wrong. This is the next-intl static-rendering hook. Correctly called everywhere here.

### Q28. `generateStaticParams` for the locale segment returns the 5 locales. How does that compose with project detail?

**A:** `[locale]/layout.tsx:18-20` returns the 5 locales → pre-renders `/en`, `/ar`, etc. The project detail `generateStaticParams` (`projects/[id]/page.tsx:12-16`) returns `{locale, id}` tuples itself — it flatMaps `locales` × `getAllProjects(locale)` rather than relying on Next composing nested params. So all 5 locales × 14 projects get static pages (where the id exists per locale).

### Q29. `MarkdownContent` renders react-markdown + remark-gfm + rehype-highlight. Walk through.

**A:** `src/components/ui/MarkdownContent.tsx:38-43` — `<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>` inside `<article className="prose ...">` (`:18-36`). `remark-gfm` adds GFM (tables, strikethrough, autolinks, task lists). `rehype-highlight` runs highlight.js on fenced code blocks (syntax highlighting). `@tailwindcss/typography` provides the `prose dark:prose-invert` styling. The markdown body comes from `getContentBySlug` (gray-matter parsed). Safe: react-markdown ^10.1.0 drops raw HTML (no `rehype-raw`) → `<script>` escaped. This is a clean, safe markdown pipeline.

### Q30. `MarkdownContent` "should be 'use client'" per docs but has no directive. Is that a problem?

**A:** `PROJECT_ARCHITECTURE.md:55` notes it "should be 'use client'" — but react-markdown works in server components (it's RSC-compatible). So the lack of `'use client'` is fine (it can be server). The doc note may be outdated (from when react-markdown had client-only requirements) or conservative. A senior verification: does it render correctly server-side? If yes, the doc note is wrong (it can be server). Server-rendering markdown is preferred (no client JS for the content). Leave it server.

### Q31. `SiteHeader` is `'use client'` and closes the mobile menu on route change. How?

**A:** `src/components/sections/SiteHeader.tsx` — client (`'use client'` at `:1`, mobile menu state); a `useEffect` on `usePathname()` (`:25-28`) closes the menu when the route changes. So navigating (via `<Link>`) auto-closes the mobile nav — good UX (no stale open menu on the new page). This is the standard "close menu on navigation" pattern. Without it, the menu stays open after navigation (confusing). The `usePathname` dep triggers the close. Documented as Issue 2.3 fix.

### Q32. `DesktopNavigation` highlights the active link via `usePathname`. How?

**A:** `src/components/sections/DesktopNavigation.tsx:13` — client; compares `usePathname()` to each link's href, applies an "active" style when matched (`:21`). So the nav shows which section you're in. Trade-off: `usePathname` makes it client (can't be server). An alternative: the `Link`'s built-in active detection (next-intl's `Link` has active props) — but this app uses manual comparison. For a small nav, fine. Edge case: nested routes (e.g., `/projects/x` should highlight "Projects") — verify the matching handles prefixes.

### Q33. `LanguageSwitcher` has outside-click close. How is it implemented?

**A:** `LanguageSwitcher.tsx:14-22` — a `useEffect` adding a `mousedown` listener on `document`; if the click is outside the switcher ref, close. Cleanup removes the listener. This is the standard outside-click pattern. Concern: the listener fires for every document click (slight overhead); a `mousedown` vs `click` choice (mousedown fires earlier). For a dropdown, fine. The pattern is correct. StrictMode would double-add (cleanup handles it).

### Q34. `ProjectCard` is a **server** component supporting `span:2` wide cards. How?

**A:** `src/components/sections/ProjectCard.tsx` — server (no hooks). Wide cards come from a `span` **field on the `Project` type** (`src/types/content.ts:28`), read at `ProjectCard.tsx:22` (`project.span === 2`) and applied as `md:col-span-2 lg:col-span-2` (`:26`) — note `md`/`lg` breakpoints, not `sm`. The grid data (`span` on featured/important projects) drives layout. Being server means the card HTML is server-rendered (good for SEO/FCP). The card also caps tech tags to 3 (`:66`) with a `+N more` overflow indicator (`:73-79`) and prioritizes apk-vs-demo links (`:97-111`). A clean server presentational component.

### Q35. `ProjectsList` is `'use client'` (uses `useProjectFilter`). Why client?

**A:** `src/components/sections/ProjectsList.tsx` — `'use client'` at `:1` (component at `:21`); it renders filter buttons (`:26-35`) + uses `useProjectFilter` (`:23`, state for selected tech). The filter is client-side (no server round-trip). Trade-off: the project data ships to the client (for filtering). For 14 projects, fine. The filtering (`useProjectFilter`) uses `useMemo` for derived `allTech` + `filteredProjects` (`useProjectFilter.ts:9-24`) — efficient. An alternative: server-side filter via URL params — but client-filter is simpler for a portfolio.

### Q36. `useProjectFilter` uses `useMemo` for `allTech` and `filteredProjects`. Why memoize?

**A:** `useProjectFilter.ts:9-24` — `allTech` (unique tech set derived from projects, deps `[projects]` at `:19`) and `filteredProjects` (projects filtered by `selectedTech`, deps `[projects, selectedTech]` at `:24`) are pure functions of their inputs. `useMemo` recomputes only when deps change (not every render). Without memo, every parent re-render re-derives the tech set (wasteful for 14 projects × N tags). Bonus detail: some techs are excluded from the filter list entirely (`EXCLUDED_FILTER_TECH` at `:4` — Tone.js, next-intl, Express, Framer Motion, react-i18next). Memoization is the right reflex for derived data.

### Q37. `ContactForm` has a honeypot field named `website`. How does it work?

**A:** `ContactForm.tsx:20-28` — a hidden input named `website` (`className="hidden"`, `tabIndex={-1}`), bound to `formData.honeypot`. Bots auto-fill all fields (including hidden ones); humans don't see it. `useContactForm.ts:24-28` checks: if the field is non-empty → bot → **error state, "Spam detected"** — notably *not* the classic silent-success honeypot (telling the bot it failed reveals the trap exists; silent success is the usual recommendation). Trade-off: sophisticated bots detect honeypots (skip hidden fields); not a complete defense. Pair with rate-limiting for robustness. The honeypot is the lightweight anti-spam choice.

### Q38. `ContactForm` uses `focus:ring-amber-500` but the brand is sky. Inconsistency?

**A:** `ContactForm.tsx:42` — amber focus ring on the **name input** while the email/message inputs use `focus:ring-brand-500` (`:60`, `:77`) and the brand palette is the sky scale (`tailwind.config.js:18`). A leftover from a different design/template. Minor visual inconsistency. Fix: use the brand color (or a token) consistently. The mismatch suggests the form was styled independently (or copied) without aligning to the design system. Small but real polish debt.

### Q39. `ThemeToggle` uses `useMounted()` to render a placeholder until mounted. Why?

**A:** `ThemeToggle.tsx:11` — pre-mount it renders a moon-icon placeholder, post-mount the icon matching the theme (`:21-29`). Reason: the theme comes from the **custom ThemeContext** (`providers.tsx:19-24` initializes from `localStorage` guarded by `typeof window`), so SSR renders "system"/moon while the client may resolve dark → mismatch. Note the placeholder is not `disabled` — it's clickable pre-mount. Unlike next-themes there is no inline pre-hydration script, so the placeholder (and a possible light-flash, Q21) is the trade-off.

### Q40. `MobileNavigation` returns null when closed. Why?

**A:** `src/components/sections/MobileNavigation.tsx:16` — `if (!isOpen) return null` (the prop is `isOpen`, `:10`). So when closed, the entire mobile nav (and its children) isn't in the DOM — cheaper than `display:none` (no DOM nodes). Trade-off: opening remounts (slight delay) + lose internal state (if any). For a nav (no important internal state), returning null is fine and cleaner. The `SiteHeader` controls the `isOpen` state. The pattern is "unmount when closed" — good for perf when the closed state is the common case.

### Q41. `Icon` is an inline-SVG registry with hardcoded paths. Why not an icon library?

**A:** The registry is `src/components/ui/icons.ts:1-33` — `iconPaths`, a `name` → hardcoded SVG path map — and `Icon.tsx:12` simply looks up `iconPaths[name]`. Avoids an icon library (lucide/react-icons) dependency for ~10 icons. The nice touch: `IconName = keyof typeof iconPaths` (`icons.ts:35`) makes a missing icon a **compile-time** type error — stronger than a runtime `console.warn`. Trade-off: adding an icon means editing the registry; no tree-shaking of a lib's full set. A senior note: if icons grow beyond ~20, a lib (tree-shaken) becomes worth it.

### Q42. `ProjectLink` is a DRY external-link wrapper. What does it enforce?

**A:** `src/components/ui/ProjectLink.tsx:15-16` — wraps external links with `target="_blank" rel="noopener noreferrer"` consistently. DRY intent: every external link uses it → consistent reverse-tabnabbing protection (`noopener`) + no referrer (`noreferrer`). Without the wrapper, devs might forget `rel` on individual links. Gap: currently **only `ProjectCard` uses it** (`:84`, `:91`, `:98`, `:105`) — `SiteFooter` and the contact page hand-roll plain `<a target="_blank">` tags, so the enforcement is incomplete (worth closing).

### Q43. `SkipToContent` is a skip link. Why does it matter for a11y — and what's wrong with it here?

**A:** `src/components/ui/SkipToContent.tsx:4-6` — `href="#main-content"` with `sr-only focus:not-sr-only focus:absolute ...`, wired to `<main id="main-content">` (`layout.tsx:36`, `:39`). Keyboard/screen-reader users can bypass the header/nav on every page — a WCAG 2.4.1 (Bypass Blocks) requirement. **But there's a real defect: the anchor is empty** — no "Skip to content" text between `<a>` and `</a>` — so on focus it's an unlabelled link (screen readers announce nothing useful; sighted keyboard users see a nameless box). The mechanism exists; the labelling doesn't. Fix: add the label text as the anchor's children.

### Q44. `Providers` only contains the theme provider. Why not more?

**A:** `src/app/providers.tsx` — a **hand-rolled `ThemeContext`** (`createContext` + `useEffect` + `localStorage` + `matchMedia`, `:12-69`), not next-themes. In fact `next-themes@^0.4.6` sits in `package.json:21` **never imported** — dead weight. `NextIntlClientProvider` is added conditionally in the locale layout (`layout.tsx:59`, SSR only), not here, because it's locale-specific + static-incompatible. Separation: universal (theme) vs locale-specific + mode-specific (intl). Senior observation: either adopt next-themes properly (free FOUC-free inline script, `disablesTransitionOnChange`, etc.) or remove the unused dependency.

### Q45. `reactStrictMode` — enabled? What would it surface?

**A:** Not explicitly configured — no `reactStrictMode` key in `next.config.ts`. In the App Router it effectively defaults to **on** (Next has defaulted it to true for App Router since 13.5.1), so dev double-invokes effects. What that surfaces here: `SiteHeader`'s `usePathname` effect cleanup, `LanguageSwitcher`'s outside-click listener cleanup, `useMounted`'s setTimeout (correctly cleaned via `clearTimeout`, `useMounted.ts:11`), the theme provider's `matchMedia` listener (`providers.tsx:46-47`, cleaned). Missing cleanups → double-listeners in dev. The deliberate cleanups hold up; making `reactStrictMode: true` explicit would document intent.

### Q46. The home page calls `getContentBySlug("home")` + `getFeaturedProjects`. Both server-side fs reads?

**A:** `src/app/[locale]/page.tsx:43` `getContentBySlug("home", locale)` (reads `content/{locale}/home.md`) + `:38` `getFeaturedProjects(locale, 3)` (reads `projects.json`). Both are sync fs reads in a server component at build (SSG). So the home page's content is baked into static HTML — fast, SEO-friendly. No client fetch. The `generateMetadata` (`:21`) also reads content for the title. This is the content-site ideal (server reads at build, static HTML serves).

### Q47. The about page renders `getContentBySlug("about")` via `MarkdownContent`. Is the markdown safe?

**A:** Safe. `react-markdown` ^10.1.0 drops raw HTML (no `rehype-raw`) → `<script>` in the `.md` is escaped, not rendered. The content is first-party (authored by the portfolio owner), low XSS risk anyway. `remark-gfm` + `rehype-highlight` add features but don't introduce XSS. The `<article className="prose">` wrapper styles it. No `dangerouslySetInnerHTML`. This is the safe markdown pattern (far safer than HTML-string + sanitizer + `dangerouslySetInnerHTML` approaches).

### Q48. `ProjectDetailPage` has inline error + not-found UI. How does it handle a missing project?

**A:** `projects/[id]/page.tsx:25-34` — if the project isn't found (`getProjectById` returns `null`), it renders an inline "Project Not Found" UI (verified: it does **not** call `notFound()`). Better than throwing (500). The page has its own error UI rather than relying on `not-found.tsx` (of which there is none — Q92). This is defensive — a missing project shows a helpful message, not a generic 404. The inline UI is better UX for "this specific project is gone."

### Q49. The home page's `generateMetadata` returns title/description. What's missing for SEO?

**A:** `page.tsx:21` — returns title/description per locale. Missing: `openGraph` (title/description/image for social sharing), `twitter` card, `alternates.languages` (hreflang — critical for 5 locales to tell Google they're equivalent), canonical. For a multilingual portfolio, hreflang is the big gap (without it, Google may index one locale). Fix: add `alternates: { languages: { en, ar, fr, es, tr } }` to each page's metadata. The foundation exists; the i18n-SEO layer is incomplete.

### Q50. `RootPage` (`(index)/page.tsx`) is a client redirect. Does it hurt SEO (no content at `/`)?

**A:** `/` renders no content (just a client redirect to `/en`). For SEO, `/` should ideally be a real page or a server 301 redirect (which static export can't do). A client redirect means crawlers see an empty page at `/` → not indexed usefully. Fix: make `/` the default-locale home directly (no redirect), or accept that `/` isn't indexed (Google finds `/en` via the sitemap). For a portfolio, low impact (the canonical content is at `/en`). The client redirect is a static-export necessity (Q8).

---

## Round 3: TypeScript, Data, & Build Pipeline (25 questions)

### Q51. `tsconfig` strict. What's notable about the content types?

**A:** `src/types/content.ts:1-7` — `ContentFrontmatter { title: string; description?: string; date?: string; tags?: string[]; image?: string; [key: string]: unknown }`. The index signature `[key: string]: unknown` allows arbitrary front-matter (flexible but loose — custom keys in real files flow through as `unknown` without checks). `getContentBySlug` (`content.ts:11`) returns `ContentData { frontmatter, content }`. A Zod schema would validate + tighten (catch missing `title`, type `date` as Date) — note `zod` isn't even a dependency today. The loose typing is permissive (no build failures) but misses errors.

### Q52. `gray-matter` returns `any` for `data`. How is it typed here?

**A:** `content.ts:19` `matter(fileContents)` → `.data` is loosely typed; the boundary is the direct cast `data as ContentFrontmatter` at `:22`. Without Zod (not installed), a malformed front-matter (missing `title`) flows through as `undefined`. The `getContentBySlug` return type asserts the shape — and the function itself **throws** on a missing file (`:14-16`). Safe approach: `const parsed = frontmatterSchema.parse(matterResult.data)` (Zod) — validates + types. Currently the app trusts the `.md` authors (first-party, low risk) but the type safety is shallow.

### Q53. The project detail page re-implements `fs.readFileSync` + `JSON.parse`. Why bypass the service?

### Q53. The project detail page used to re-implement `fs.readFileSync` + `JSON.parse`. Why was bypassing the service a problem?

**A:** It used to. The current `projects/[id]/page.tsx` is 47 lines and calls `getProjectById(id, locale)` (`:23`) — a proper service function (`projectService.ts:14` → `content.ts:47-50`) that carries the English fallback. The historical inline `fs.readFileSync`+`JSON.parse` is exactly what `PROJECT_ARCHITECTURE.md:67` still documents (stale — the fix landed). Why bypassing matters: two data-access paths reading the same files drift; the service's fallback/validation silently stops applying to the bypassing page. The fix (adding `getProjectById` and using it) DRY'd the data access.

### Q54. `getContentBySlug` uses sync `readFileSync`. Concern?

**A:** `content.ts:18` — sync fs. At build (SSG), fine (runs once per page). In dev/dynamic, sync fs blocks the event loop per request. For a portfolio (low traffic, SSG production), acceptable. The concern is only if pages go dynamic. Since everything is SSG (`generateStaticParams` + `setRequestLocale`), sync-at-build is fine. A `react cache`/`unstable_cache` would memoize per-request in dev. Low priority.

### Q55. `loadMessages` returns `{}` on failure. How do components handle empty messages?

**A:** They don't, quite — `loadMessages` (`content.ts:6-9`) has no failure branch: it `await import`s the messages module and **throws** on an unknown locale. The graceful degradation lives at the component layer: pages slice messages with `?? {}` (`page.tsx:48`) and read keys through optional chains with hardcoded English `||` defaults (`:65`, `:69`, `:85`, `:88`, `:94-95`). So a missing translation never crashes (graceful), but the fallback strings are scattered in components (not centralized). A `t(key, fallback)` helper would centralize. For a portfolio, acceptable; for a larger app, a helper is better.

### Q56. The `Project` type — what fields, and what's the fallback strategy?

**A:** `src/types/content.ts:15-29` — `{ id, name, description, longDescription?, tech[], github?, gitlab?, demo?, apk?, image?, featured?, year?, span? }`. The English-fallback (`content.ts:39-44`) is **file-level**: if a locale's `projects.json` is missing *or empty*, the whole list falls back to `en` — no per-project merge. So the `Project` type is per-locale but with cross-locale fallback: an AR visitor with a missing AR file sees the EN list wholesale (mixed language), not 404s. The type doesn't distinguish "translated" vs "fallback" — a `localized: boolean` could help the UI flag it.

### Q57. `siteConfig` in `metadata.ts`. Single source of truth?

**A:** `src/app/metadata.ts:4` — `siteConfig` (name, url, etc.) is the single source; the shared builder is `buildPageMetadata` (`:33`) — there is **no `defaultMetadata` export**. Pages import + extend via `generateMetadata`. Good practice (DRY). (Historical footnote: the old `project-tracker.json:158` logged a past bug — `openGraph.url` set to `siteConfig.name`, m5_002 — fixed before the tracker was deleted.) The centralization prevents the kind of drift that hits scattered metadata. A senior note: keep `siteConfig` the one place URLs/names live.

### Q58. `vercel.json` (if present) vs Hostinger static. How do deploys differ?

**A:** Vercel: `next build` (SSR) → `.next/` → Vercel serves (with API routes, ISR, middleware possible). Hostinger: `build:static` → `out/` → FTP to `public_html/` → LiteSpeed serves static files + `.htaccess` for caching/headers. There's no `vercel.json` (just a `.vercel/` project dir) — the Vercel side runs on zero config. The same code deploys both, but the static target loses API routes (contact broken, Q5) and gains `.htaccess` config. `scripts/build-static.sh` + `scripts/test-routes.sh` (40 curl checks) support the static deploy. The dual-deploy is operationally complex (two targets, two behaviors).

### Q59. `build.log` is stale (Next 16.0.10, 55 pages). Why is it committed?

**A:** `build.log` is a stale artifact from the 16.0.10 era showing 55 generated pages; current deps are next 16.3.2 / react 19.2.8 (`package.json:19,22`). Committed accidentally (should be gitignored). Confuses contributors (looks like the latest build state). Fix: `git rm build.log`, add `*.log` to `.gitignore`. The committed log signals no `.gitignore` hygiene for artifacts. (The deleted tracker's "65 pages" note contradicted the log's 55 — neither reflected current output.)

### Q60. `docs/todo.md` is actually the 5-language Azkari project description (mismatched filename). What does that reveal?

**A:** `docs/todo.md` contains the Azkari (another project) description, not a todo list. The real todo is `docs/project/todo.md`. Reveals: a file was mis-placed/renamed (copy-paste error from another project's docs), and no one noticed (no review). Fix: rename/delete `docs/todo.md` (it's not a todo), keep `docs/project/todo.md`. The mismatch signals docs were copied between projects without full cleanup. Small but indicative.

### Q61. `tsconfig` path alias `@/* → ./src/*`. Standard. Anything notable?

**A:** Standard Next alias. `@/lib/...`, `@/components/...` resolve under `src/`. No unusual aliases. `moduleResolution: "bundler"` (`:11`) + `isolatedModules: true` (`:13`) + `strict: true` (`:7`). `noUncheckedIndexedAccess` is **absent** (TS default false) — enabling it would tighten the `[key: string]: unknown` index access. The content types (`[key: string]: unknown`) are the loose-typing exception in an otherwise standard setup.

### Q62. The build has no `prebuild`. Why (and is that correct)?

**A:** Content (`.md`, `.json`) is committed source-of-truth — not generated. So no `prebuild` data-generation needed (correct); contrast with repos that generate content from a source-of-truth file at build time. The portfolio's content is hand-authored, committed. So `next build` reads what's there. Correct design. The `build:static` script chains clean + build (no generation).

### Q63. `.npmrc` mandates pnpm + native-build approvals. What's configured?

**A:** `.npmrc:1` sets `onlyBuiltDependencies=@swc/core,sharp,unrs-resolver` — native build approvals (the native postinstall scripts pnpm v9+ blocks by default). Without approvals, these install without their native binaries → build breaks. `AGENTS.md` codifies pnpm-only (`RULES.md` covers PR hygiene only). The config is standard pnpm hardening. A senior note: `packageManager: "pnpm@<version>"` in package.json would make the manager + version explicit (currently absent — enforced conventionally via `.npmrc` + `AGENTS.md`).

### Q64. The portfolio has 5 locales × (4 routes + 14 project pages) = 90 static pages. Build-time concern?

**A:** Each static page is a file in `out/` (static) or `.next/server/` (SSR). 90 pages (+ the root redirect) is small — build is fast (seconds). The concern would be at 1000s of pages (build minutes). For a portfolio, no concern. The `generateStaticParams` cross-product (locale × project) is the multiplier — adding locales or projects scales linearly. `trailingSlash:true` (static) means directory-per-page (`out/en/projects/x/index.html`) — more files, but fine.

### Q65. `env.example` documents `CONTACT_EMAIL`, `RESEND_API_KEY` (commented), `NEXT_PUBLIC_SITE_URL`. Accurate?

**A:** Mostly. The code reads `CONTACT_EMAIL` (`route.ts:36`), `RESEND_API_KEY` (`route.ts:6`), `NEXT_PUBLIC_SITE_URL` (various). `env.example` (no leading dot) documents them; `RESEND_API_KEY` is commented at `:16` (optional — without it, the handler logs only). Accurate-ish, though the handler itself is broken (Q5). A senior fix: also document the Formspree URL if switching to a form backend (Q23).

### Q66. `@tailwindcss/typography` provides `prose` classes. Where is it used?

**A:** `tailwind.config.js:39-42` enables the plugin. Used in `MarkdownContent.tsx:18-36` (`<article className="prose dark:prose-invert">`) and `projects/[id]/page.tsx:42` (project description). The `prose` class auto-styles markdown (headings, paragraphs, lists, code) with sane typography. `prose-invert` for dark mode. Without the plugin, markdown would render unstyled. The plugin is essential for the markdown pipeline's appearance. Correctly used.

### Q67. The RTL CSS is ~135 lines of manual `[dir="rtl"]` overrides. Why not a plugin?

**A:** `globals.css:85-215` — 131 lines of manual RTL overrides (Amiri for headings, justified prose, RTL blockquote borders, LTR-forced `code`/`pre`). `tailwindcss-rtl` was **removed for Tailwind v4 incompatibility** (`docs/troubleshooting/ISSUES_AND_SOLUTIONS.md:559-598`, Issue 4.6). So the team hand-wrote the overrides (dependency-free but verbose). `PROJECT_ARCHITECTURE.md:97` calls it ~200 lines (overcount — actual 131). Trade-off: verbose but no dep + works with Tailwind v4's logical properties. As Tailwind v4's logical utilities mature, much of this could be replaced with `ms-*`/`me-*`. The manual approach is pragmatic given the incompatibility.

### Q68. `rehype-highlight` adds syntax highlighting. Bundle/perf concern?

**A:** `rehype-highlight` runs highlight.js on fenced code blocks at build (server) → emits `<span class="hljs-...">` HTML + a CSS theme. The highlight.js JS bundle is **not** shipped to the client (highlighting is build-time, static HTML). The CSS theme (~small) is. So perf is fine (no client JS for highlighting). For a portfolio with code snippets, this is the right setup (build-time highlighting, static output). Concern: the highlight.js languages bundled (all vs subset) — if rehype-highlight bundles all languages, build is slower; a subset (`registerLanguage`) optimizes.

### Q69. `remark-gfm` — what does it add over plain markdown?

**A:** GFM (GitHub-Flavored Markdown): tables, strikethrough (`~~text~~`), autolinks (bare URLs), task lists (`- [ ]`). Without `remark-gfm`, react-markdown renders CommonMark only (no tables/strikethrough). For a portfolio with project tables/feature lists, GFM matters. The plugin is correctly included. A senior note: GFM's autolink behavior can turn plain URLs into links (sometimes unwanted) — verify it's desired.

### Q70. `ProjectService` — class, static class, or plain functions?

**A:** Neither class nor static class — `src/services/projectService.ts` is 16 lines of **plain exported functions**: `getAllProjects` (`:4`), `getFeaturedProjects` (`:8-12`), `getProjectById` (`:14`), all delegating to `lib/content.ts`. State is module-level (it reads files; no per-instance state). Plain functions are the idiomatic choice for stateless wrappers — no `new`, no `this`, trivially tree-shakeable. Minor style point either way; the functional form is what's actually in the repo.

### Q71. The contact route validates email via regex + min message length 10. Sufficient?

**A:** `route.ts:19-25` (email regex), `:27-32` (length ≥ 10). The regex is a basic email check (not RFC-complete; rejects some valid emails, accepts some invalid). Length-10 message is a weak anti-spam. Missing: rate-limiting (Q5/Q79), CAPTCHA, Honeypot is client-side only (`useContactForm.ts:24`). Server-side validation is thin. And the whole handler is unreachable (Q5). Fix: relocate + use a proper email validator (`zod.email`) + add rate-limiting + keep honeypot. Defense in depth.

### Q72. `Resend` is chosen over Nodemailer/SMTP. Why?

**A:** Resend is a modern email API (HTTP) — no SMTP server to run, simple SDK, deliverability handled. Nodemailer/SMTP needs an SMTP server/config + deliverability management. For a portfolio contact form (low volume), Resend's free tier is ideal. Trade-off: external dependency + API key + their pricing. `route.ts:35` `new Resend(resendApiKey)` (captured at `:6`). The choice is correct for a static-deployable, low-volume contact form (when the handler is fixed).

### Q73. `RESEND_API_KEY` is server-only (no `NEXT_PUBLIC_`). Correct?

**A:** `route.ts:6` reads `RESEND_API_KEY` (no `NEXT_PUBLIC_` prefix) → server-only, not bundled to the client. Correct — the API key is a secret. If it were `NEXT_PUBLIC_RESEND_API_KEY`, it'd be exposed in the client bundle. The server-only placement is right. (The handler being broken Q5 is a separate issue.) `env.example:16` documents it (commented). The secret hygiene is correct.

### Q74. `getProjectHref` / `getLocalizedHref` build `/{locale}/...`. Why helpers?

**A:** `src/i18n/navigation.ts` — `getLocalizedHref(locale, route)` (`:10-13`) and `getProjectHref(locale, id)` (`:15-17`) build `/${locale}...` paths, plus `buildLocalePath` (`:19-28`, the prefix-swap `LanguageSwitcher` uses). Centralizes path-building (DRY) — every link uses the helpers, no manual `${locale}/projects/${id}` string-building, no locale-prefix typos. Correction to an older claim: there is **no trailing-slash/static-mode handling here** — the helpers emit identical paths in both modes (no `.html` suffixes, no forced trailing slash; only `home` yields `/en/` because its base route is `/`).

### Q75. How would you add Zod validation to the contact form end-to-end?

**A:** `const contactSchema = z.object({ name: z.string().min(2).max(50), email: z.string().email(), message: z.string().min(10).max(5000), website: z.string().optional() })`. (1) Client (`useContactForm`): `contactSchema.safeParse(formData)` before fetch (instant feedback). (2) Server (`route.ts`): `contactSchema.safeParse(body)` (never trust client); reject invalid. (3) Escape the validated `message` before interpolating into email HTML (Q6 — already the implemented pattern via `escapeHtml`). Shared schema (single source) → consistent client+server validation. This closes the Q6/Q71 gaps (when the handler is relocated, Q5).

---

## Round 4: Problem-Solving, Debugging & System Evolution (25 questions)

### Q76. The contact form's POST returns 404. Diagnose and fix.

**A:** `src/api/contact/route.ts` is under `src/api/`, but Next only treats `src/app/api/` as routes. There's no `src/app/api/`. So `POST /api/contact` → 404. Fix: move the file to `src/app/api/contact/route.ts`. Then in SSR mode it works (Vercel). In static mode (Hostinger), API routes don't deploy → use Formspree (client POST to their URL) instead. The relocation + a static-mode branch (or separate contact solution) makes it work on both targets. Currently `useContactForm.ts:34` calls a non-existent endpoint.

### Q77. A visitor on Hostinger can't send a contact message. Diagnose.

**A:** Static export has no server → no `/api/contact` route (even if relocated, Q76) → the fetch 404s → error state. The contact form is fundamentally non-functional on static hosting. Fix: switch to Formspree/Web3Forms (client POST to their backend, they email you) — works statically. Or direct users to mailto/social links (the current fallback, `contact/page.tsx:53-72`). `PROJECT_ARCHITECTURE.md:122` confirms it's known. The dual-build means contact works on Vercel (SSR) but not Hostinger (static) — a documented limitation.

### Q78. How would you add a blog (the markdown stack anticipates one)?

**A:** (1) `content/{locale}/posts/*.md` with front-matter (title, date, excerpt). (2) `src/app/[locale]/blog/page.tsx` (listing, `getContentBySlug`-style listing of all posts). (3) `src/app/[locale]/blog/[slug]/page.tsx` (detail, `generateStaticParams` from post slugs × locales, `generateMetadata` per post, render via `MarkdownContent`). (4) Sitemap entries for posts. (5) The markdown pipeline (gray-matter + react-markdown + remark-gfm + rehype-highlight) is already in place — just point it at posts. The infra is ready; only the routes/content are missing. A natural extension.

### Q79. How would you rate-limit the contact form (anti-spam)?

**A:** (1) **Upstash Redis + `@upstash/ratelimit`** — serverless-friendly, e.g., 3 submissions/IP/hour in the route handler or middleware. (2) **Vercel Edge config** (Vercel deploy). (3) **Turnstile/hCaptcha** — CAPTCHA the form, verify server-side. (4) **Honeypot** (already client-side, Q37) — keep. For a portfolio (low volume), honeypot + a simple IP rate-limit suffices. The current honeypot-only is weak (bots detect honeypots). Pair with rate-limiting + Turnstile for robustness. Note: static target can't run server-side rate-limiting → Formspree handles it there.

### Q80. A project appears in `/en` but 404s in `/ar`. Diagnose.

**A:** `generateStaticParams` (`projects/[id]/page.tsx:12-16`) gets ids per locale via `getAllProjects(locale)`. If a project is in `en/projects.json` but not `ar/projects.json` (and the AR file is present but incomplete), the AR detail page isn't generated → 404 — the file-level fallback in `content.ts:39-44` only triggers when a locale's file is **missing or empty**, so it doesn't fill per-project gaps. Fix: either (1) ensure all projects exist in all locales (translation discipline), (2) extend the fallback to per-project merge, or (3) generate the AR page from EN data with a "translation unavailable" note. The cross-locale id consistency is the root requirement.

### Q81. The HTML email could have an XSS (`data.message` unescaped). How is it actually handled?

**A:** Already fixed in-repo: `src/api/contact/route.ts:42-48` routes every interpolated field through `escapeHtml()` (`src/lib/escapeHtml.ts:11` — escapes `& < > " '` to entities), and `.replace(/\n/g, "<br>")` runs **after** escaping (`:48`), so it only introduces markup the code chose. The general pattern for interviews: escape all user input before HTML interpolation, or send plain text (`text: data.message`) and eliminate the class entirely. Pair with Zod validation (Q75). The remaining caveat: the whole handler is still unreachable (Q76).

### Q82. How would you add hreflang for the 5 locales?

**A:** In each page's `generateMetadata`, return `alternates: { languages: { en: '/en/...', ar: '/ar/...', fr: '/fr/...', es: '/es/...', tr: '/tr/...' } }` + `canonical`. This tells Google the 5 locales are equivalent alternates. Add `x-default` → `/en`. The `getLocalizedHref` helper (`navigation.ts:15`) builds the URLs. Without hreflang, Google may index one locale and ignore others (or treat as duplicates). This is the biggest multilingual-SEO gap currently (Q49).

### Q83. The Turbopack font bug forced CDN `@font-face`. When/how do you migrate to `next/font`?

**A:** When the Turbopack+`next/font` bug is fixed (track Next 16.x releases). Migrate: `import { Inter, Tajawal } from 'next/font/google'` → each defines a CSS var + self-hosts; replace the `@import`/`@font-face` in `globals.css` with the next/font className/variable. Benefit: subsetting, preload, `font-display: swap`, no render-blocking external requests. Test the build after migration (the bug may be partially fixed). The current CDN `@font-face` is a documented workaround (Q10); the migration is planned, not urgent.

### Q84. How would you add project case-study pages (richer than the current detail)?

**A:** (1) Extend the project detail to render a markdown case study (`content/{locale}/cases/{id}.md`) via `MarkdownContent` — longer-form, with images, code, results. (2) The current detail (`projects/[id]`) is JSON-driven (title, tech, links); add an optional `caseStudySlug` field → if present, render the markdown case study below the summary. (3) `generateStaticParams` includes case-study slugs. This turns the portfolio from "link list" to "case-study showcase" (better for job-seeking). The markdown infra is ready.

### Q85. `project-tracker.json` was invalid (trailing comma) and a tool reading it crashed. What happened, and how do you prevent it?

**A:** Resolved by deletion: the file (invalid JSON — trailing commas at `:131` and `:500`, confirmed by parsing its last committed copy) was removed entirely in PR #14 (commit `442ddbc`, "chore: remove project-tracker.json and its workflow step"). Prevention still worth implementing: (1) a CI check that parses all committed `.json` (`for f in $(git ls-files '*.json'); do jq . "$f" > /dev/null || exit 1; done`); (2) editor JSON language servers flag trailing commas live; (3) JSON5/JSONC if trailing commas are truly desired (but then tooling must expect it). The original invalid file signaled no JSON-validation gate on committed data — a `jq` parse check in CI catches that class.

### Q86. How would you add a dark-mode-aware OG image per page?

**A:** (1) `@vercel/og` (`ImageResponse`) in a route `src/app/og/[...slug]/route.tsx` rendering the page title + brand on a branded background. (2) `generateMetadata` sets `openGraph.images: ['/og/${slug}']`. (3) For dark-mode-awareness: the OG image is static (social scrapers don't send dark-mode), so pick one theme (usually light/branded). (4) For per-locale: include the locale in the image (title in the locale's language). (5) Arabic text in `ImageResponse` needs the Arabic font loaded at runtime. This is the standard Next OG-image pattern; the infra (`@vercel/og`) is SSR-only (Vercel), so static-target OG would be pre-generated static images.

### Q87. How would you add analytics (which projects get viewed most)?

**A:** Privacy-friendly (Plausible/Umami): track `/[locale]/projects/[id]` pageviews (automatic) → "most-viewed projects." Track contact-form submissions, language switches, outbound project-link clicks. Client-side events (the app is mostly SSG). Env-gate to production. Plausible is cookieless (no GDPR consent needed). The events fire via the analytics SDK in client components. Avoid logging PII. The `NEXT_PUBLIC_SITE_URL` config pattern extends to the analytics domain.

### Q88. The README mentions `pnpm typecheck` and `pnpm format` scripts that don't exist. Fix.

**A:** `README.md:119-120` advertises scripts absent from `package.json`. Fix: either (1) add the scripts (`"typecheck": "tsc --noEmit"`, `"format": "prettier --write ."`), or (2) remove the README lines. Adding them is more useful (enables the commands). This is docs-vs-package drift — a contributor following README runs a non-existent script. A CI check comparing README scripts to `package.json` catches it. The drift signals README wasn't updated when scripts changed (or was aspirational).

### Q89. How would you test the dual-build (SSR + static)?

**A:** `scripts/test-routes.sh` (40 curl checks — 20 loop-driven across locales + 20 literal project/root/asset/404 checks) is the static-deploy smoke test. Extend: (1) run it against both `pnpm build` (SSR, `pnpm start`) and `pnpm build:static` (`pnpm serve:static`) → assert all routes return 200 + expected content. (2) Vitest + RTL for components (`ProjectCard` renders, `useProjectFilter` filters). (3) Playwright e2e: visit each locale, switch language, filter projects, submit contact (assert error in static, success in SSR with mock). (4) A CI matrix: one job SSR, one job static. The dual-build needs dual testing — currently only static-routes is checked.

### Q90. How would you add a CV/resume download (PDF)?

**A:** (1) Commit the PDF to `public/cv.pdf` (or per-locale `cv-en.pdf`, `cv-ar.pdf`). (2) A download link in the contact/about section (`<a href="/cv.pdf" download>`). (3) For per-locale, the link uses `getLocalizedHref` logic (`/cv-${locale}.pdf`). (4) The PDF is static (served from `public/`). Simple. For auto-generation (from data), a build script could render HTML→PDF (puppeteer), but for a portfolio, a hand-authored PDF is standard. Low lift, high value for job-seeking.

### Q91. The `docs/` is extensive (`architecture`, `deployment`, `troubleshooting`, etc.). Much is stale. How do you maintain it?

**A:** (1) **Version-stamp** each doc ("accurate as of Next 16.3.2 / <date>"). (2) **Archive don't edit** — when a doc is stale (e.g., the 16.0.10 references), move to `docs/archive/` and write a current version. (3) **Generate structural facts** — route lists, script inventories, page counts from source. (4) **CI docs check** — verify cited files exist, cited scripts exist, version numbers match `package.json`. (5) **Single PR rule** — a behavior-changing PR updates docs same-PR. The docs are comprehensive but rotted (Next 16.0.10 → 16.3.2, "5 projects" → 14, etc.); process is the fix.

### Q92. How would you add i18n-aware 404 pages?

**A:** (1) `src/app/[locale]/not-found.tsx` — a server component reading the locale from `params` (or the URL) → renders a localized 404. (2) But `[locale]`'s `not-found.tsx` only triggers for misses **within** `[locale]`. (3) For misses outside `[locale]` (e.g., `/foo`), the root `not-found.tsx` triggers → default to English or detect locale from path. (4) Static-export: each locale's 404 must be a static file. The cleanest: one root `not-found.tsx` that reads the first path segment for locale + renders localized. Currently there is **no `not-found.tsx` anywhere in `src/app/`** — not even the root one a static export conventionally wants — so 404 handling is entirely missing.

### Q93. How would you add a "now" page (current focus, like nownownow.com)?

**A:** (1) `content/{locale}/now.md` (markdown, front-matter updated periodically). (2) `src/app/[locale]/now/page.tsx` (server component, `getContentBySlug("now")`, render via `MarkdownContent`). (3) `generateMetadata`. (4) Sitemap entry. (5) Nav link. The markdown infra is ready; it's just another content page. A "now" page is a portfolio convention (what you're currently doing). Low lift.

### Q94. The portfolio has 14 projects but docs say "5+." Fix the drift.

**A:** `docs/project/PROJECT_CONTEXT.md:56` says "5+ projects tracked:" then lists 7 names — actual `content/en/projects.json` has 14. And `docs/deployment/static-export/COMPREHENSIVE_STATIC_EXPORT_GUIDE.md:58-59` is doubly stale: "3 (Arabic, English, French)" and "4 main pages + 4 project detail pages" — actual is 5 locales and 14 projects. Fix: update the docs to current numbers (or remove hardcoded counts — derive from `en/projects.json` if a script generates the doc). A senior fix: don't hand-maintain counts in docs — generate them. The drift happened as locales/projects were added without doc updates. Process: a behavior PR (adding a project) updates the count, or the count is auto-generated.

### Q95. How would you add structured data (JSON-LD) for the portfolio?

**A:** (1) `Person` schema on the home page (name, jobTitle, url, sameAs → social profiles). (2) `ProfilePage` wrapping it. (3) For projects, `CreativeWork`/`SoftwareApplication` schema on the detail page (name, description, author, url). (4) Inject via `<script type="application/ld+json">` in the page (or via `generateMetadata`'s `other`/a dedicated component). (5) Test with Google's Rich Results Test. For a personal portfolio, `Person` schema helps knowledge-panel-ish results. Currently no JSON-LD — an SEO gap.

### Q96. A teammate wants to add Redux. Respond.

**A:** Current state: theme (custom ThemeContext, `providers.tsx`), locale (props-passed), ephemeral UI (menu open, filter, form). No complex shared mutable state. Redux adds boilerplate for state that's cleanly handled. Ask: "What state needs cross-component sharing with frequent updates?" If the answer is "nothing," keep the current (hooks + props). The filter (`useProjectFilter`) is local to `ProjectsList`. The form (`useContactForm`) is local. No global store needed. YAGNI.

### Q97. How would you add a contact-form success analytics event?

**A:** In `useContactForm.ts`, after a successful POST (status → 'success'), call `window.plausible('Contact Form Submit')` (or the analytics SDK's event). Also track form-start and validation-errors (funnel). For the static-target (Formspree), the event fires on the client after Formspree's success response. Env-gate the analytics. Avoid logging the message content (PII). The event tells you the contact form converts (or doesn't) — valuable for a job-seeking portfolio.

### Q98. How would you migrate from dual-build to SSR-only (drop Hostinger)?

**A:** (1) Remove `build:static`, `serve:static`, `test:static`, `build-static.sh`. (2) Remove the `DEPLOY_TARGET` branch in `next.config.ts` (always `output: undefined`). (3) Restore `NextIntlClientProvider` in the layout (no static-mode bypass) → switch components back to `useTranslations()` hooks (from props-passing). (4) Restore middleware for locale detection. (5) Relocate + activate the contact API (`src/app/api/contact/route.ts`) → working contact form. (6) `next/font` migration (Q83). The SSR-only path is much simpler (no static-compat workarounds). Decision: is Hostinger still needed? If Vercel suffices, simplify.

### Q99. How would you add a newsletter signup?

**A:** (1) A third-party (Buttondown/ConvertKit/Mailchimp) with an embed form or API. (2) A form component (email input + submit) POSTing to their endpoint (or your API route that forwards). (3) On static hosting, use their embed/endpoint directly (no server). (4) On SSR, a route handler can forward + validate. (5) Confirmation email (double opt-in, GDPR). For a portfolio (low volume), Buttondown's free tier + embed form is simplest. The contact-form infra (validation, honeypot) extends to newsletter.

### Q100. Onboarding a new dev: 5-step guide?

**A:** 1. Read `AGENTS.md` + `docs/project/PROJECT_ARCHITECTURE.md` (the architecture) + `docs/troubleshooting/ISSUES_AND_SOLUTIONS.md` (the dual-build saga) — **note stale parts** (Next 16.0.10 → 16.3.2, "5 projects" → 14, `pnpm typecheck`/`format` scripts don't exist). 2. `pnpm install && pnpm dev` — visit `/en`, switch locales, filter projects. Note the contact form is broken (Q5). 3. Understand the dual-build: `DEPLOY_TARGET` env, `next.config.ts:6`, the layout provider fork (Q3), props-passing (Q9). 4. Trace a project: `content/en/projects.json` → `ProjectService.getAllProjects` → `ProjectsList` (client filter) → `ProjectCard`. Trace the contact: `ContactForm` → `useContactForm` → `/api/contact` (404!). 5. Run `pnpm build:static && pnpm serve:static` + `scripts/test-routes.sh` to see the static deploy. Warn: docs drift significantly; the contact form is known-broken; the dual-build is the source of most complexity.

---

## Bonus Round: Stretch Questions (5 questions)

### Q101. The dual-build (SSR + static) is the root complexity. Argue for keeping vs dropping it.

**A:** **Keep**: (1) Hostinger is cheap/free + Yemen-accessible (Vercel may be geo-blocked/slow there); (2) static = full control of hosting; (3) no vendor lock-in. **Drop**: (1) the dual-build forces i18n props-passing (Q9), no middleware (Q11), broken contact (Q5), trailing-slash ugliness (Q7), `unoptimized` images in static; (2) double testing surface (Q89); (3) Vercel free tier is generous for a portfolio. The decision hinges on whether the Hostinger audience is real (do Yemen visitors need it?) or aspirational. If real, keep (accept the complexity); if not, drop SSR-only and simplify massively. A senior should make this a deliberate decision (document the ADR), not let it persist by inertia. Most likely: drop to SSR-only, keep a static-export option documented-but-not-primary.

### Q102. The contact form is broken three ways. Design the complete fix for both deploy targets.

**A:** **SSR (Vercel)**: (1) Relocate `src/api/contact/route.ts` → `src/app/api/contact/route.ts`. (2) Add Zod validation (Q75) + rate-limiting (Q79) — HTML escaping is already in place (`escapeHtml`, Q6/Q81). (3) Keep resend; verify `RESEND_API_KEY` + `CONTACT_EMAIL` env set. (4) The form POSTs to `/api/contact` → email sends. **Static (Hostinger)**: (1) API routes don't deploy → use **Formspree**: replace the fetch URL with the Formspree endpoint; their backend emails you. (2) Or a mailto fallback. **Unified**: detect `isStatic` client-side (`NEXT_PUBLIC_DEPLOY_TARGET`) → POST to `/api/contact` (SSR) or Formspree (static). One form, two backends, env-driven. This makes contact work on both targets. The dual-backend is the price of the dual-build.

### Q103. The i18n uses props-passing (no hooks) for static compat. Design the migration to next-intl hooks (SSR-only).

**A:** (1) Restore `NextIntlClientProvider` in the locale layout (remove the static-mode bypass). (2) In client components, replace prop-received `navDict`/`messages` with `useTranslations('Namespace')` / `useLocale()`. (3) Server components already use `getTranslations()` (server). (4) Restore middleware for locale detection. (5) Remove the manual `loadMessages`/props plumbing. (6) Test all locales. The migration is mechanical (props → hooks) once the provider is restored. Benefit: idiomatic next-intl (less prop-drilling, hook ergonomics, `useLocale()`). Cost: requires dropping static export (or keeping both, which defeats the simplification). This is the single biggest simplification if going SSR-only.

### Q104. The docs are extensive but stale (versions, counts, scripts). Design a docs-freshness process.

**A:** (1) **Version-stamp** every doc ("accurate as of Next 16.3.2, <date>"). (2) **Archive don't edit** — stale docs (16.0.10 refs) move to `docs/archive/` with a "historical" header; write current versions. (3) **Generate structural facts** — route lists, page counts, script inventories, project counts from source (`package.json`, `content/`) into a `docs/PROJECT_STATE.md` (auto-generated). (4) **CI docs check** — (a) parse all `docs/**/*.md` cited file paths (verify exist); (b) grep docs for `package.json`-derivable facts (versions, script names) and compare; (c) flag known-drift patterns ("Next 16.0", "5 projects", `pnpm typecheck` — a README-advertised script that doesn't exist, Q88). (5) **Single PR rule** — behavior PRs update docs same-PR. (6) **Quarterly audit**. The docs rotted because nothing enforced freshness; process + CI is the fix.

### Q105. Propose a comprehensive "production polish" sprint for the portfolio.

**A:** **Week 1 (correctness)**: Fix the contact form (Q76, Q102), add Zod validation (Q75), add project-detail `generateMetadata` (Q16), label the empty `SkipToContent` anchor (Q43), remove stale `build.log` (Q59) + resolve the `docs/todo.md` mismatch (Q60) + drop the unused `next-themes` dependency (Q44). (`project-tracker.json` was already deleted, Q85; the email-HTML escaping already landed, Q81.) **Week 2 (SEO/social)**: Add hreflang (Q82), per-page OG images (Q86), JSON-LD `Person` (Q95), sitemap verification. **Week 3 (i18n + UX)**: Decide SSR-vs-dual (Q101); if SSR-only, migrate to next-intl hooks (Q103); add i18n 404s (Q92); verify cross-locale project consistency (Q80). **Week 4 (infra)**: Migrate to `next/font` (Q83) when fixed, add tests (Q89), add analytics (Q87), docs-freshness process (Q104). The portfolio is well-architected (dual-build is deliberate); the sprint closes the unfinished-feature + docs-drift gaps. Outcome: a fast, correct, SEO-complete, maintainable multilingual portfolio.

---

## Evaluation Criteria

| Area | Mid | Senior | Staff |
|------|-----|--------|-------|
| **Architecture** | Explains the dual-build toggle | Debates SSR-vs-static trade-offs | Designs the keep-vs-drop dual-build ADR |
| **React/Next** | Identifies server/client components | Diagnoses the layout provider fork + props-passing | Designs the next-intl hooks migration |
| **TypeScript** | Knows strict benefits | Catches the loose front-matter typing | Designs Zod validation at the content boundary |
| **Data/Content** | Traces the markdown + JSON pipelines | Diagnoses the ProjectService bypass | Designs the blog extension + case studies |
| **i18n** | Knows `[locale]` routing | Diagnoses no-middleware + manual LanguageSwitcher | Designs hreflang + per-locale metadata + sitemap |
| **Security** | Knows XSS basics | Finds the email-HTML XSS + unreachable handler | Designs Zod + rate-limiting + Formspree dual-target |
| **SEO** | Knows metadata basics | Diagnoses missing hreflang + project-detail metadata | Designs JSON-LD + OG images + sitemap |
| **Maintainability** | Notices docs drift | Catalogs stale docs (versions, counts, scripts) | Designs the docs-freshness CI process |

---

*End of interview document. 105 questions across 5 rounds. All file/function references verified against the dev_portfolio codebase (next 16.3.2 / react 19.2.8), August 2026.*
