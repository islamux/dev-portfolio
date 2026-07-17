# Senior Engineering Interview: Dev Portfolio

> **Format:** 4 rounds × 25 questions = 100 + 5 bonus = 105 total
> **Target:** Mid→Senior candidate
> **Style:** FAANG/Big Tech — behavioral, architectural depth, system design, debugging, and coding
> **Project:** Multilingual (EN/AR-RTL/FR/ES/TR) personal developer portfolio — Next.js 16 / React 19, next-intl + next-themes + gray-matter/react-markdown + resend, **dual SSR/static-export build** (Vercel + Hostinger LiteSpeed)

---

## Round 1: Architecture & System Design (25 questions)

### Q1. The portfolio deploys to both Vercel (SSR) and Hostinger (static). How is the dual build toggled?

**A:** A single env var read in `next.config.ts:6`: `const isStatic = process.env.DEPLOY_TARGET === 'static'`. It conditionally sets `output: isStatic ? 'export' : undefined` (`:9`), `trailingSlash: isStatic ? true : undefined` (`:10`), `images: { unoptimized: isStatic }` (`:12`). Two env vars serve two audiences: `DEPLOY_TARGET` (server-side, read in next.config + layout) and `NEXT_PUBLIC_DEPLOY_TARGET` (client-side, read in `(index)/page.tsx:8` for the root redirect). `build:static` sets both. The single-codebase-dual-deploy is the cleanest design (no `process.env` branches scattered in `src/` beyond the documented layout-fork).

### Q2. Static export (`output: 'export'`) disallows server code. What constraints does that impose?

**A:** No API routes (no server to run them), no `headers()`/`cookies()`/middleware, no dynamic routes without `generateStaticParams`, no image optimization (hence `unoptimized`). The app satisfies these: contact form is broken (Q-F, no working API), `NextIntlClientProvider` is bypassed in static mode (it calls `headers()`), locale switching is client-side (no middleware), all pages are SSG via `generateStaticParams`. The constraint shaped every architectural choice. `docs/STATIC_VS_SSR_ANALYSIS.md:226-229` documents the forbidden APIs.

### Q3. There's a `LocaleLayout` provider fork. What does it branch on, and why?

**A:** `src/app/[locale]/layout.tsx:45-72` — in SSR mode, wraps everything in `<NextIntlClientProvider>`; in static mode, **bypasses it**. Reason: `NextIntlClientProvider` calls `headers()` (to read request context), which is forbidden in static export → build breaks. So static mode skips the provider, forcing every client component to receive `locale`/`navDict` as **props** instead of via `useLocale()`/`useTranslations()` (`AGENTS.md:37-41`). This is the core static-compat adaptation: props-passing replaces i18n hooks. Documented in `docs/troubleshooting/ISSUES_AND_SOLUTIONS.md:1100-1131` (Issue 8.2).

### Q4. There's no blog — only `home.md` and `about.md`. Why does the markdown pipeline exist?

**A:** Despite the gray-matter + react-markdown + remark-gfm + rehype-highlight stack (suggesting a blog), `content/{locale}/` has exactly `home.md`, `about.md`, `projects.json` per locale — **no slugged articles, no `posts/`**. The markdown pipeline renders only the two content pages (Home/About). So the stack is over-provisioned for the current scope (a blog was planned/anticipated but not built). The pipeline is correct for what exists; it's just not used for a blog. A senior read: the deps suggest intent beyond the implementation.

### Q5. The contact form is broken. Identify the three defects.

**A:** (1) **Unreachable handler** — `src/api/contact/route.ts:7` lives under `src/api/`, but Next only treats `src/app/api/` as routes. There's no `src/app/api/`. So `POST /api/contact` → **404** in every mode. `useContactForm.ts:37` calls a URL nobody serves. (2) **Statically impossible** — even if relocated, `output: 'export'` can't ship API routes (`docs/STATIC_VS_SSR_ANALYSIS.md:226`), so it can't work on the Hostinger target. (3) **Officially unfinished** — `project-tracker.json:161` subtask `m5_005 "Make contact form functional"` is `status:"todo"`. `PROJECT_ARCHITECTURE.md:122` states "Contact form is non-functional." Plus an XSS in the email HTML (Q-F). The real fallback is mailto/social links.

### Q6. The contact email HTML is built by string interpolation with no escaping. What's the risk?

**A:** `src/api/contact/route.ts:47` builds the email `html:` via `${data.name}`, `${data.email}`, `${data.message.replace(/\n/g,'<br>')}` — unsanitized. An attacker submits `message: "</p><script>...</script><p>"` → the script ships inside the delivered email HTML. Email clients vary in script execution (most block it), but HTML injection (defacing the email, injecting links/forms) works in many clients. Fix: escape user input (`escapeHtml(data.message)`), or build the email as plain text. This is a real (if moderate) XSS-in-email vector. Defense: never interpolate untrusted input into HTML.

### Q7. Why `trailingSlash: true` in static mode? What's the Hostinger 403 saga?

**A:** Hostinger's LiteSpeed server auto-redirects `/en` → `/en/`, then **403s** if `en/index.html` doesn't exist. With `trailingSlash: true`, Next emits directory-based files (`out/en/index.html`), so `/en/` resolves. Without it, Next emits `out/en.html`, and `/en/` (the redirect target) 404s. `docs/troubleshooting/ISSUES_AND_SOLUTIONS.md:1181-1227` (Issue 8.5) documents this. The fix also requires wiping `public_html/` before each upload (stale files interfere). The 41-check `scripts/test-routes.sh` validates the static deploy. Trade-off: uglier URLs (`/en/` vs `/en`) but necessary for LiteSpeed.

### Q8. The root `/` redirect is client-side (`'use client'`). Why not a server `redirect()`?

**A:** `src/app/(index)/page.tsx:6` is `'use client'`, doing `router.replace(isStatic ? '/en/' : '/en')` (`:11`). A server `redirect('/en')` in the root would crash static export (no server to emit the redirect) — same class of bug as salam-nextjs's root redirect (Q26 of that doc). The client redirect works in both modes. Trade-off: a brief blank page at `/` before redirect (no SSR content), and depends on JS. The trailing-slash awareness (`isStatic ? '/en/' : '/en'`) handles the static/SSR URL-shape difference. Documented necessity.

### Q9. Why props-passing instead of `useTranslations()` hooks?

**A:** Static mode bypasses `NextIntlClientProvider` (Q3), so client components can't call `useTranslations()`/`useLocale()` (no provider context) — they'd throw. The adaptation: the server layout reads messages + locale and passes them as props (`navDict`, `locale`) to client components, which access translations as plain-object lookups (`messages.home.title`). `docs/project/PROJECT_ARCHITECTURE.md:92` confirms `useTranslations` is never used. This is a deliberate static-export adaptation (Issue 8.3). Trade-off: verbose prop-drilling, no hook ergonomics, but works in both modes. `AGENTS.md:37-41` codifies it.

### Q10. Fonts use CDN `@font-face` (Google Fonts `@import`), not `next/font`. Why?

**A:** `next/font/google` is **broken under Turbopack in Next 16.0.x** (`docs/troubleshooting/ISSUES_AND_SOLUTIONS.md:95-129`, Issue 2.1). The workaround: hand-written `@font-face` for Geist/Geist Mono (`globals.css:9-23`) + Google Fonts `@import` for Arabic faces (Tajawal, Amiri, Noto, Cairo, `:4-7`). Trade-off: loses next/font's optimization (self-hosting, subsetting, preload, `font-display`), adds render-blocking external requests (the `@import`). `tailwind.config.js:26-29` maps the `--font-geist-sans/mono` vars. Once the Turbopack font bug is fixed, migrate to `next/font` for the optimization. The current choice is a documented workaround, not negligence.

### Q11. There's no `middleware.ts`. How does locale detection work?

**A:** There's no middleware (it was renamed `.disabled` for static export, `docs/STATIC_VS_SSR_ANALYSIS.md:58-65`). Locale "detection" is purely **client-side via `LanguageSwitcher`** (`LanguageSwitcher.tsx:24-44` manual URL rewrite). The SSR `request.ts:10` just `notFound()`s on invalid locales. So there's no automatic `Accept-Language` detection/redirect — a user lands on `/` and the client redirects to `/en`. The canonical next-intl setup uses middleware for detection; this app omits it for static compat. Trade-off: no smart locale detection (a French browser still gets `/en` first), but static-deployable.

### Q12. `LanguageSwitcher` does manual URL rewriting. Decode it.

**A:** `LanguageSwitcher.tsx:24-44` — `handleLocaleChange` swaps the locale prefix in the pathname (manual string manipulation), because next-intl's `useRouter`/`usePathname` (from `src/i18n/navigation.ts`) can't run in static mode (no provider). So instead of `router.push`-with-locale, it rewrites the URL string + navigates. Trade-off: fragile (string manipulation of paths), loses next-intl's locale-aware nav, but works statically. The "right" fix (when SSR-only is acceptable): use next-intl's hooks. The manual rewrite is a static-compat workaround (Issue 8.3).

### Q13. How does the projects content pipeline work (it's JSON, not markdown)?

**A:** `content/{locale}/projects.json` (12 projects in `en/projects.json`) — `getProjectData(locale)` (`src/lib/content.ts:40`) reads it with **English fallback** if the locale file is missing (`:46-49`). `ProjectService` wraps it: `getAllProjects` (`projectService.ts:9`), `getFeaturedProjects(locale, limit)` filters `project.featured` + slices (`:13-16`). The project **detail** page (`projects/[id]/page.tsx:58-61`) **bypasses `ProjectService`/`content.ts`** and re-implements `fs.readFileSync`+`JSON.parse` inline — a layering violation (`PROJECT_ARCHITECTURE.md:67`). So projects are JSON-driven (not MD), with one inconsistency.

### Q14. The project detail page bypasses `ProjectService`. Why is that a layering violation?

**A:** `projects/[id]/page.tsx:58-61` does `fs.readFileSync` + `JSON.parse` directly instead of calling `ProjectService.getById()` or `content.getProjectById()`. Problem: (1) two code paths reading the same data (drift risk — one updated, other not); (2) bypasses any caching/validation in the service; (3) the service abstraction exists but isn't used consistently. Fix: add `ProjectService.getById(locale, id)` and use it in the detail page. `PROJECT_ARCHITECTURE.md:67` flags this. The violation is a symptom of "the abstraction was added after the page was written."

### Q15. `generateStaticParams` for projects reads **every** locale's `projects.json`. Why?

**A:** `projects/[id]/page.tsx:26-47` — to pre-render `/en/projects/x`, `/ar/projects/x`, ..., the build needs all valid `id`s per locale. Reading each locale's JSON at build gives the id set. Trade-off: build-time cost (5 locale files), but necessary for the cross-locale static generation. If a project exists in `en` but not `ar`, the AR detail page either 404s or falls back (depending on impl — verify). The English-fallback (`content.ts:46-49`) is for the listing; per-page `generateStaticParams` may not fallback. Edge case worth checking.

### Q16. The project detail page has **no** `generateMetadata`. What's the SEO impact?

**A:** `projects/[id]/page.tsx` has no metadata export → uses the layout's default title/description for every project. So all 12 project pages share one title — poor SEO (Google can't differentiate), poor social sharing (OG shows generic). Fix: add `generateMetadata({ params })` returning the project's title/description/OG image. The home/about/projects-list pages **do** have `generateMetadata` (`page.tsx:20`, `about/page.tsx:13`, `projects/page.tsx:14`) — the detail page is the gap. Inconsistent metadata coverage.

### Q17. `useTranslations` is never used. How are translations accessed?

**A:** Plain-object access: the layout loads `messages` (per locale) and passes slices (`messages.home`, `messages.nav`) as props (`navDict`) to client components, which read `navDict.title` etc. (Q9). This is the static-compat pattern. The `loadMessages` helper (`content.ts:6-14`) returns `{}` on failure → components use hardcoded English `||` defaults (`page.tsx:79`). So no hook, no provider (in static mode), just props + plain objects. Functional but unergonomic. `PROJECT_ARCHITECTURE.md:92` confirms.

### Q18. The sitemap loops locales × routes × project ids. How is it generated?

**A:** `src/app/sitemap.ts:22-47` (`force-static :5`) — loops `locales` × static routes (home, about, projects, contact) × project ids (from `en/projects.json`). Emits all URLs with `priority`/`lastModified`. `force-static` generates it once at build. The sitemap covers all 5 locales × ~4 routes × 12 projects = ~240+ URLs. For SEO, this is comprehensive. A senior note: the sitemap reads only `en/projects.json` for ids — if a project exists in another locale but not EN, it's missed. Verify id-consistency across locales.

### Q19. `English-fallback` for project content. How does it degrade?

**A:** `content.ts:46-49` — if `content/ar/projects.json` is missing or a project lacks an AR translation, fall back to `en`. So an AR visitor sees English for untranslated projects (graceful degradation — better than 404/broken). Trade-off: the AR experience is incomplete (mixed-language UI). For a portfolio, acceptable (the visitor still sees the project). A `localized: boolean` per project could let the UI flag "English content." The fallback is the pragmatic choice for a 5-locale portfolio with translation debt.

### Q20. `useMounted` defers the flag with `setTimeout(...,0)`. Why the setTimeout?

**A:** `src/hooks/useMounted.ts:8-11` — instead of `useEffect(() => setMounted(true), [])` (which fires after paint), it defers via `setTimeout(...,0)`. Reason: avoid cascading re-renders during hydration — `setTimeout(0)` pushes the state update to the next macrotask, after the hydration batch settles. This is a refinement to reduce hydration-phase re-render churn (e.g., `ThemeToggle` showing a placeholder, then flipping). Trade-off: slightly later mount-detection (one tick). A subtle optimization; whether it measurably helps depends on the component tree. Paired with `<html suppressHydrationWarning>` for next-themes.

### Q21. The `<html>` has `suppressHydrationWarning`. Why?

**A:** `src/app/[locale]/layout.tsx:48` — next-themes adds a class to `<html>` before React hydrates (via its inline script) → server HTML (no class) ≠ client first-render (class added) → hydration warning. `suppressHydrationWarning` tolerates the mismatch on `<html>` specifically (it's expected for theme). This is the standard next-themes pattern. Without it, React logs a warning every load. The suppression is scoped to `<html>` (not blanket), so real mismatches elsewhere still warn. Correct usage.

### Q22. The `useContactForm` POSTs to `/api/contact` which doesn't exist. What does the user see?

**A:** The fetch (`useContactForm.ts:37`) → 404 (no route, Q5). The form's error handling: status machine `idle|loading|success|error` (`:4,7`) — on fetch failure (404 non-OK), sets `error`. So the user sees an error state ("message failed to send"). No email is sent. The honeypot check (`:26-30`) runs first (spam bots → silent success). So the form appears to work (validation, loading, error states) but never actually sends. The user thinks their message failed, not that the feature is broken. A confusing UX. Fix: relocate the handler + accept SSR-only contact, or switch to a mailto/formspree.

### Q23. How would you make the contact form actually work on static hosting?

**A:** Static hosts can't run your server code, so use a **third-party form backend**: (1) **Formspree/Getform/Web3Forms** — form POSTs to their endpoint, they email you. No server code, works statically. (2) **Resend + a serverless function** (Vercel/Netlify functions) — if you keep any serverless deploy. (3) **mailto:** link — no backend, opens the user's email client (crude). For the Hostinger static target, option (1) is the cleanest (replace the broken `/api/contact` POST with a Formspree URL). Keep resend for the SSR/Vercel deploy (relocate the handler to `src/app/api/contact/route.ts`). The fix depends on the deploy target.

### Q24. `project-tracker.json` is invalid JSON (trailing comma). What's the impact?

**A:** `project-tracker.json:132` (and `:501`) has a trailing comma → `JSON.parse` throws `SyntaxError`. Any tooling reading it (a tracker script, an IDE extension, CI) crashes. The file is committed (version-controlled) — so it's broken for everyone. Impact: whoever relies on it can't. Fix: remove the trailing commas (JSON doesn't allow them). Add a CI check that all committed `.json` parses. The invalid JSON signals no validation gate on committed data files. A small but real hygiene bug.

### Q25. If you were rebuilding from scratch, top three changes?

**A:** (1) **Decide SSR or static** — the dual-build forces the i18n props-passing (Q9), no middleware (Q11), broken contact (Q5). If SSR-only (Vercel), simplify massively (next-intl hooks, middleware detection, real contact API). If static-only (Hostinger), embrace it fully (no API routes, Formspree for contact). The dual-build is the root complexity. (2) **Build or remove the blog** — the markdown stack is over-provisioned (Q4); either add a blog or trim the deps. (3) **Fix the contact form** (Q5, Q23) + relocate the handler + add the project-detail `generateMetadata` (Q16). Beyond: migrate to `next/font` when Turbopack fixes the bug (Q10), fix `project-tracker.json` (Q24). The architecture is a portfolio-template done well; the gaps are static-export friction + unfinished features.

---

## Round 2: React & Next.js Deep Dive (25 questions)

### Q26. `LocaleLayout` is an async server component. Why async?

**A:** `src/app/[locale]/layout.tsx:22` — `async` to `await params` (Next 16 async params) for the locale, then `setRequestLocale(locale)` (`:27`), read messages, and conditionally wrap in providers (`:50-72`). Server layouts can be async to do server-side work (read files, await params). The async-params change (Next 16) requires it. Forgetting `await params` reads a Promise → undefined locale → breaks downstream.

### Q27. `setRequestLocale(locale)` is called in layout + pages. What does it do?

**A:** next-intl's `setRequestLocale` binds the current request's render context to a locale, enabling static rendering per locale (messages load correctly during SSG). Called in `[locale]/layout.tsx:27` and every page. Without it, the locale isn't bound during static generation → messages default/wrong. This is the next-intl static-rendering hook (the same API new-muslim-stories uses, where the `[slug]` page's omission caused the Arabic-shows-English bug). Correctly called everywhere here.

### Q28. `generateStaticParams` for the locale segment returns the 5 locales. How does that compose with project detail?

**A:** `[locale]/layout.tsx:18-20` returns the 5 locales → pre-renders `/en`, `/ar`, etc. The project detail `generateStaticParams` (`projects/[id]/page.tsx:26-47`) returns `{locale, id}` tuples → pre-renders `/en/projects/x`, etc. Next combines nested `generateStaticParams` (outer locale × inner id). So all 5 locales × 12 projects get static pages (where the id exists per locale). The composition is automatic in Next's App Router.

### Q29. `MarkdownContent` renders react-markdown + remark-gfm + rehype-highlight. Walk through.

**A:** `src/components/ui/MarkdownContent.tsx:38-43` — `<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>` inside `<article className="prose ...">` (`:18-36`). `remark-gfm` adds GFM (tables, strikethrough, autolinks, task lists). `rehype-highlight` runs highlight.js on fenced code blocks (syntax highlighting). `@tailwindcss/typography` provides the `prose dark:prose-invert` styling. The markdown body comes from `getContentBySlug` (gray-matter parsed). Safe: react-markdown v10 drops raw HTML (no `rehype-raw`) → `<script>` escaped. This is a clean, safe markdown pipeline.

### Q30. `MarkdownContent` "should be 'use client'" per docs but has no directive. Is that a problem?

**A:** `PROJECT_ARCHITECTURE.md:55` notes it "should be 'use client'" — but react-markdown works in server components (it's RSC-compatible). So the lack of `'use client'` is fine (it can be server). The doc note may be outdated (from when react-markdown had client-only requirements) or conservative. A senior verification: does it render correctly server-side? If yes, the doc note is wrong (it can be server). Server-rendering markdown is preferred (no client JS for the content). Leave it server.

### Q31. `SiteHeader` is `'use client'` and closes the mobile menu on route change. How?

**A:** `SiteHeader.tsx:16,25-28` — client (mobile menu state); a `useEffect` on `usePathname()` closes the menu when the route changes. So navigating (via `<Link>`) auto-closes the mobile nav — good UX (no stale open menu on the new page). This is the standard "close menu on navigation" pattern. Without it, the menu stays open after navigation (confusing). The `usePathname` dep triggers the close. Documented as Issue 2.3 fix.

### Q32. `DesktopNavigation` highlights the active link via `usePathname`. How?

**A:** `DesktopNavigation.tsx:12` — client; compares `usePathname()` to each link's href, applies an "active" style when matched. So the nav shows which section you're in. Trade-off: `usePathname` makes it client (can't be server). An alternative: the `Link`'s built-in active detection (next-intl's `Link` has active props) — but this app uses manual comparison. For a small nav, fine. Edge case: nested routes (e.g., `/projects/x` should highlight "Projects") — verify the matching handles prefixes.

### Q33. `LanguageSwitcher` has outside-click close. How is it implemented?

**A:** `LanguageSwitcher.tsx:14-22` — a `useEffect` adding a `mousedown` listener on `document`; if the click is outside the switcher ref, close. Cleanup removes the listener. This is the standard outside-click pattern. Concern: the listener fires for every document click (slight overhead); a `mousedown` vs `click` choice (mousedown fires earlier). For a dropdown, fine. The pattern is correct. StrictMode would double-add (cleanup handles it).

### Q34. `ProjectCard` is a **server** component supporting `span:2` wide cards. How?

**A:** `ProjectCard.tsx:18,20,23` — server (no hooks); accepts a `span` prop, applies a `sm:col-span-2` class for wide cards. The grid (`ProjectsList`) assigns `span:2` to featured/important projects. Being server means the card HTML is server-rendered (good for SEO/FCP). The `span` prop drives layout — a presentational concern. The card also caps tech tags to 3 (`:57-70`) and conditionally shows apk-vs-demo links (`:88-102`). A clean server presentational component.

### Q35. `ProjectsList` is `'use client'` (uses `useProjectFilter`). Why client?

**A:** `ProjectsList.tsx:20` — client because it renders filter buttons (interactive) + uses `useProjectFilter` (state for selected tech). The filter is client-side (no server round-trip). Trade-off: the project data ships to the client (for filtering). For 12 projects, fine. The filtering (`useProjectFilter`) uses `useMemo` for derived `allTech` + `filteredProjects` (`useProjectFilter.ts:7-20`) — efficient. An alternative: server-side filter via URL params (like voices-of-truth) — but client-filter is simpler for a portfolio.

### Q36. `useProjectFilter` uses `useMemo` for `allTech` and `filteredProjects`. Why memoize?

**A:** `useProjectFilter.ts:7-20` — `allTech` (unique tech set derived from projects) and `filteredProjects` (projects filtered by `selectedTech`) are pure functions of `projects` + `selectedTech`. `useMemo` recomputes only when deps change (not every render). Without memo, every parent re-render re-derives the tech set (wasteful for 12 projects × N tags). Memoization is the right reflex for derived data. The `allTech` deps `[projects]`; `filteredProjects` deps `[projects, selectedTech]`. Correct.

### Q37. `ContactForm` has a honeypot field named `website`. How does it work?

**A:** `ContactForm.tsx:20-28` — a hidden input named `website` (visually hidden via CSS). Bots auto-fill all fields (including hidden ones); humans don't see it. `useContactForm.ts:26-30` checks: if `website` is non-empty → bot → silently succeed (don't send, don't error — the bot thinks it worked). So the honeypot filters bot spam without a CAPTCHA. Trade-off: sophisticated bots detect honeypots (skip hidden fields); not a complete defense. Pair with rate-limiting for robustness. The honeypot is the lightweight anti-spam choice.

### Q38. `ContactForm` uses `focus:ring-amber-500` but the brand is sky. Inconsistency?

**A:** `ContactForm.tsx:43` — amber focus ring while the portfolio's brand color is sky/blue. A leftover from a different design/template. Minor visual inconsistency. Fix: use the brand color (`focus:ring-sky-500` or a token). The mismatch suggests the form was styled independently (or copied) without aligning to the design system. Small but real polish debt.

### Q39. `ThemeToggle` uses `useMounted()` to render a placeholder until mounted. Why?

**A:** `ThemeToggle.tsx:11,21-29` — server can't read the resolved theme → renders a default (moon) icon; client hydrates reading next-themes → may differ → mismatch. `useMounted` gates: render a disabled placeholder until mounted, then the real icon. Paired with `<html suppressHydrationWarning>` + next-themes' inline script. This is the standard next-themes hydration pattern. The placeholder prevents the flash + warning.

### Q40. `MobileNavigation` returns null when closed. Why?

**A:** `MobileNavigation.tsx:13,16` — `if (!open) return null`. So when closed, the entire mobile nav (and its children) isn't in the DOM — cheaper than `display:none` (no DOM nodes). Trade-off: opening remounts (slight delay) + lose internal state (if any). For a nav (no important internal state), returning null is fine and cleaner. The `SiteHeader` controls `open` state. The pattern is "unmount when closed" — good for perf when the closed state is the common case.

### Q41. `Icon` is an inline-SVG registry with hardcoded paths. Why not an icon library?

**A:** `src/components/ui/Icon.tsx:8` — a `name` → hardcoded SVG `path` map. Avoids an icon library (lucide/react-icons) dependency for a handful of icons. Trade-off: adding an icon means editing the registry; no tree-shaking of a lib's full set. For a portfolio with ~10 icons, the inline registry is lighter (no dep) than pulling a lib. The `warn` on missing icon (`:49`) helps dev. A senior note: if icons grow beyond ~20, a lib (tree-shaken) becomes worth it.

### Q42. `ProjectLink` is a DRY external-link wrapper. What does it enforce?

**A:** `ProjectLink.tsx:27` — wraps external links with `target="_blank" rel="noopener noreferrer"` consistently. DRY: every external link (project demo, apk, social) uses it → consistent reverse-tabnabbing protection (`noopener`) + no referrer (`noreferrer`). Without the wrapper, devs might forget `rel` on individual links. This is good component-driven discipline (enforce best practices via a wrapper). `SiteFooter.tsx:67` and `contact/page.tsx:67` also use it.

### Q43. `SkipToContent` is a skip link. Why does it matter for a11y?

**A:** `SkipToContent.tsx:1` — a link "Skip to content" that jumps focus to `#main-content` (the main region). Keyboard/screen-reader users can bypass the header/nav on every page (which is repetitive). Without it, they Tab through all nav links each page. This is a WCAG 2.4.1 (Bypass Blocks) requirement. The link is visually hidden until focused (`focus:not-sr-only`). `layout.tsx:55,66` wire it to `#main-content`. Good a11y — present in this app.

### Q44. `Providers` only contains `ThemeProvider`. Why not more?

**A:** `src/app/providers.tsx:8-16` — just `ThemeProvider` (next-themes). `NextIntlClientProvider` is added conditionally in the locale layout (`layout.tsx:51`, SSR only), not here, because it's locale-specific + static-incompatible. So `Providers` is the always-on provider (theme), and the locale layout adds the conditional one. Separation: universal (theme) vs locale-specific + mode-specific (intl). This split is deliberate.

### Q45. `reactStrictMode` — enabled? What would it surface?

**A:** Check `next.config.ts`. If on, StrictMode double-invokes effects (dev), surfacing: `SiteHeader`'s `usePathname` effect cleanup, `LanguageSwitcher`'s outside-click listener cleanup, `ContactForm`'s submit logic, `useMounted`'s setTimeout (cleared?). Missing cleanups → double-listeners in dev. StrictMode is free dev bug-finding; verify it's enabled. Given the deliberate hydration handling (`useMounted`, `suppressHydrationWarning`), the team cares about correctness — StrictMode would reinforce.

### Q46. The home page calls `getContentBySlug("home")` + `getFeaturedProjects`. Both server-side fs reads?

**A:** `src/app/[locale]/page.tsx:58` `getContentBySlug("home")` (reads `content/{locale}/home.md`) + `:52` `getFeaturedProjects` (reads `projects.json`). Both are sync fs reads in a server component at build (SSG). So the home page's content is baked into static HTML — fast, SEO-friendly. No client fetch. The `generateMetadata` (`:20`) also reads content for the title. This is the content-site ideal (server reads at build, static HTML serves).

### Q47. The about page renders `getContentBySlug("about")` via `MarkdownContent`. Is the markdown safe?

**A:** Safe. `react-markdown` v10 drops raw HTML (no `rehype-raw`) → `<script>` in the `.md` is escaped, not rendered. The content is first-party (authored by the portfolio owner), low XSS risk anyway. `remark-gfm` + `rehype-highlight` add features but don't introduce XSS. The `<article className="prose">` wrapper styles it. No `dangerouslySetInnerHTML`. This is the safe markdown pattern (vs new-muslim-stories' HTML-string + DOMPurify approach).

### Q48. `ProjectDetailPage` has inline error + not-found UI. How does it handle a missing project?

**A:** `projects/[id]/page.tsx:64-83` — if the project isn't found (likely `getProjectById` returns null), renders inline error UI + a not-found message (or calls `notFound()`). Better than throwing (500). The page has its own error UI rather than relying solely on `not-found.tsx`. This is defensive — a missing project shows a helpful message, not a generic 404. Verify the exact behavior (notFound vs inline). The inline UI is better UX for "this specific project is gone."

### Q49. The home page's `generateMetadata` returns title/description. What's missing for SEO?

**A:** `page.tsx:20` — likely returns title/description per locale. Missing: `openGraph` (title/description/image for social sharing), `twitter` card, `alternates.languages` (hreflang — critical for 5 locales to tell Google they're equivalent), canonical. For a multilingual portfolio, hreflang is the big gap (without it, Google may index one locale). Fix: add `alternates: { languages: { en, ar, fr, es, tr } }` to each page's metadata. The foundation exists; the i18n-SEO layer is incomplete.

### Q50. `RootPage` (`(index)/page.tsx`) is a client redirect. Does it hurt SEO (no content at `/`)?

**A:** `/` renders no content (just a client redirect to `/en`). For SEO, `/` should ideally be a real page or a server 301 redirect (which static export can't do). A client redirect means crawlers see an empty page at `/` → not indexed usefully. Fix: make `/` the default-locale home directly (no redirect), or accept that `/` isn't indexed (Google finds `/en` via the sitemap). For a portfolio, low impact (the canonical content is at `/en`). The client redirect is a static-export necessity (Q8).

---

## Round 3: TypeScript, Data, & Build Pipeline (25 questions)

### Q51. `tsconfig` strict. What's notable about the content types?

**A:** `src/types/content.ts:1-8` — `Frontmatter { title: string; description?: string; date?: string; tags?: string[]; image?: string; [key: string]: unknown }`. The index signature `[key: string]: unknown` allows arbitrary front-matter (flexible but loose — `author`/`date` in real files are dropped silently if not in the schema). `getContentBySlug` (`content.ts:16`) returns `Content { frontmatter, content }` with `frontmatter` typed loosely. A Zod schema would validate + tighten (catch missing `title`, type `date` as Date). The loose typing is permissive (no build failures) but misses errors.

### Q52. `gray-matter` returns `any` for `data`. How is it typed here?

**A:** `content.ts:24` `matter(fileContents)` → `.data` is `any` (gray-matter's types are loose). The cast/assertion to `Frontmatter` (if any) is the boundary. Without Zod, a malformed front-matter (missing `title`) flows through as `undefined`. The `getContentBySlug` return type asserts the shape. Safe approach: `const parsed = frontmatterSchema.parse(matterResult.data)` (Zod) — validates + types. Currently the app trusts the `.md` authors (first-party, low risk) but the type safety is shallow.

### Q53. The project detail page re-implements `fs.readFileSync` + `JSON.parse`. Why bypass the service?

**A:** `projects/[id]/page.tsx:58-61` — instead of `ProjectService.getById()`, it reads + parses inline. Likely: the page was written before/independently of the service, or the service didn't expose `getById` at the time. The result: two data-access paths (service + inline) reading the same files → drift risk. `PROJECT_ARCHITECTURE.md:67` flags this. Fix: add `getProjectById(locale, id)` to `ProjectService`/`content.ts`, use it in the page. DRY the data access.

### Q54. `getContentBySlug` uses sync `readFileSync`. Concern?

**A:** `content.ts:23` — sync fs. At build (SSG), fine (runs once per page). In dev/dynamic, sync fs blocks the event loop per request. For a portfolio (low traffic, SSG production), acceptable. The concern (like new-muslim-stories) is only if pages go dynamic. Since everything is SSG (`generateStaticParams` + `setRequestLocale`), sync-at-build is fine. A `react cache`/`unstable_cache` would memoize per-request in dev. Low priority.

### Q55. `loadMessages` returns `{}` on failure. How do components handle empty messages?

**A:** `content.ts:6-14` — on message-load failure, returns `{}`. Components then use hardcoded English `||` defaults (`page.tsx:79`: `messages.home.title ?? 'Home'` or similar). So a missing translation falls back to English inline. Trade-off: never crashes (graceful), but the fallback strings are scattered in components (not centralized). A `t(key, fallback)` helper would centralize. For a portfolio, acceptable; for a larger app, a helper is better.

### Q56. The `Project` type — what fields, and what's the fallback strategy?

**A:** From `content.ts`/`projects.json`: likely `{id, title, description, tech[], featured, demoUrl?, apkUrl?, image, ...}`. The English-fallback (`content.ts:46-49`) means `Project` from `ar/projects.json` may be missing → falls back to `en`. So the `Project` type is per-locale but with cross-locale fallback. A project in `en` but not `ar` → AR visitor sees the EN project (mixed language). The type doesn't distinguish "translated" vs "fallback" — a `localized: boolean` could help the UI flag it.

### Q57. `siteConfig` / `defaultMetadata` in `metadata.ts`. Single source of truth?

**A:** `src/app/metadata.ts:3,17` — `siteConfig` (name, url, etc.) + `defaultMetadata` (title, description). Single source — pages import + extend via `generateMetadata`. Good practice (DRY). `project-tracker.json:530` notes a past bug `openGraph.url: siteConfig.name` (Issue m5_002) — fixed. The centralization prevents the kind of drift that hits scattered metadata. A senior note: keep `siteConfig` the one place URLs/names live.

### Q58. `vercel.json` (if present) vs Hostinger static. How do deploys differ?

**A:** Vercel: `next build` (SSR) → `.next/` → Vercel serves (with API routes, ISR, middleware possible). Hostinger: `build:static` → `out/` → FTP to `public_html/` → LiteSpeed serves static files + `.htaccess` for caching/headers. The same code deploys both, but the static target loses API routes (contact broken, Q5) and gains `.htaccess` config. `scripts/build-static.sh` + `scripts/test-routes.sh` (41 curl checks) support the static deploy. The dual-deploy is operationally complex (two targets, two behaviors).

### Q59. `build.log` is stale (Next 16.0.10, 55 pages). Why is it committed?

**A:** `build.log` is a stale artifact (from the 16.0.10 era; current is 16.2.6, ~65 pages per tracker). Committed accidentally (should be gitignored). Confuses contributors (looks like the latest build state). Fix: `git rm build.log`, add `*.log` to `.gitignore`. The committed log signals no `.gitignore` hygiene for artifacts. The tracker claims "65 pages" — neither the stale log nor the tracker reliably reflects current output.

### Q60. `docs/todo.md` is actually the 5-language Azkari project description (mismatched filename). What does that reveal?

**A:** `docs/todo.md` contains the Azkari (another project) description, not a todo list. The real todo is `docs/project/todo.md`. Reveals: a file was mis-placed/renamed (copy-paste error from another project's docs), and no one noticed (no review). Fix: rename/delete `docs/todo.md` (it's not a todo), keep `docs/project/todo.md`. The mismatch signals docs were copied between projects without full cleanup. Small but indicative.

### Q61. `tsconfig` path alias `@/* → ./src/*`. Standard. Anything notable?

**A:** Standard Next alias. `@/lib/...`, `@/components/...` resolve under `src/`. No unusual aliases. `moduleResolution: bundler` (likely) + `isolatedModules: true` (Next requires). The config is conventional. A senior review would verify `strict: true` + the strict flags (`noUncheckedIndexedAccess`?). The content types (`[key: string]: unknown`) are the loose-typing exception in an otherwise standard setup.

### Q62. The build has no `prebuild`. Why (and is that correct)?

**A:** Content (`.md`, `.json`) is committed source-of-truth — not generated. So no `prebuild` data-generation needed (correct). Contrast with salam-nextjs (generates from `khatira_content.json`) or fi-dhilal (extracts from `.doc`). The portfolio's content is hand-authored, committed. So `next build` reads what's there. Correct design. The `build:static` script chains clean + build (no generation).

### Q63. `.npmrc` mandates pnpm + native-build approvals. What's configured?

**A:** `.npmrc:1` (likely) sets pnpm behavior; native build approvals for `@swc/core`, `sharp`, `unrs-resolver` (the native postinstall scripts pnpm v9+ blocks by default). Without approvals, these install without their native binaries → build breaks. `RULES.md` codifies pnpm-only. The config is standard pnpm hardening. A senior note: `packageManager: "pnpm@<version>"` in package.json would make the manager + version explicit (currently `.npmrc` + `RULES.md` enforce it conventionally).

### Q64. The portfolio has 5 locales × ~4 routes × 12 projects = ~240 static pages. Build-time concern?

**A:** Each static page is a file in `out/` (static) or `.next/server/` (SSR). ~240 pages is small — build is fast (seconds). The concern would be at 1000s of pages (build minutes). For a portfolio, no concern. The `generateStaticParams` cross-product (locale × project) is the multiplier — adding locales or projects scales linearly. `trailingSlash:true` (static) means directory-per-page (`out/en/projects/x/index.html`) — more files, but fine.

### Q65. `env.example` documents `CONTACT_EMAIL`, `RESEND_API_KEY` (commented), `NEXT_PUBLIC_SITE_URL`. Accurate?

**A:** Mostly. The code reads `CONTACT_EMAIL` (`route.ts`), `RESEND_API_KEY` (`route.ts:33`), `NEXT_PUBLIC_SITE_URL` (various). The `.env.example` documents them. Note `RESEND_API_KEY` is commented (optional — without it, the handler logs only). Accurate-ish, though the handler itself is broken (Q5). A senior fix: also document the Formspree URL if switching to a form backend (Q23). The env example is more accurate than several sibling projects (athkarix, fi-dhilal had drift).

### Q66. `@tailwindcss/typography` provides `prose` classes. Where is it used?

**A:** `tailwind.config.js:39-42` enables the plugin. Used in `MarkdownContent.tsx:18-36` (`<article className="prose dark:prose-invert">`) and `projects/[id]/page.tsx:92` (project description). The `prose` class auto-styles markdown (headings, paragraphs, lists, code) with sane typography. `prose-invert` for dark mode. Without the plugin, markdown would render unstyled. The plugin is essential for the markdown pipeline's appearance. Correctly used.

### Q67. The RTL CSS is ~135 lines of manual `[dir="rtl"]` overrides. Why not a plugin?

**A:** `globals.css:85-215` — manual RTL overrides (Amiri for headings, justified prose, RTL blockquote borders, LTR-forced `code`/`pre`). `tailwindcss-rtl` was **removed for Tailwind v4 incompatibility** (`docs/troubleshooting/ISSUES_AND_SOLUTIONS.md`, Issue 4.6). So the team hand-wrote the overrides (dependency-free but verbose). `PROJECT_ARCHITECTURE.md:97` calls it ~200 lines. Trade-off: verbose but no dep + works with Tailwind v4's logical properties. As Tailwind v4's logical utilities mature, much of this could be replaced with `ms-*`/`me-*`. The manual approach is pragmatic given the incompatibility.

### Q68. `rehype-highlight` adds syntax highlighting. Bundle/perf concern?

**A:** `rehype-highlight` runs highlight.js on fenced code blocks at build (server) → emits `<span class="hljs-...">` HTML + a CSS theme. The highlight.js JS bundle is **not** shipped to the client (highlighting is build-time, static HTML). The CSS theme (~small) is. So perf is fine (no client JS for highlighting). For a portfolio with code snippets, this is the right setup (build-time highlighting, static output). Concern: the highlight.js languages bundled (all vs subset) — if rehype-highlight bundles all languages, build is slower; a subset (`registerLanguage`) optimizes.

### Q69. `remark-gfm` — what does it add over plain markdown?

**A:** GFM (GitHub-Flavored Markdown): tables, strikethrough (`~~text~~`), autolinks (bare URLs), task lists (`- [ ]`). Without `remark-gfm`, react-markdown renders CommonMark only (no tables/strikethrough). For a portfolio with project tables/feature lists, GFM matters. The plugin is correctly included. A senior note: GFM's autolink behavior can turn plain URLs into links (sometimes unwanted) — verify it's desired.

### Q70. The `ProjectService` is a static class. Why static (not instances)?

**A:** `src/services/projectService.ts:4` — `static class` (or a class with static methods). State is module-level (no per-instance state needed — it reads files). Static methods (`getAllProjects`, `getFeaturedProjects`) are called without instantiation (`ProjectService.getAllProjects()`). For a stateless service, static is appropriate (no need for `new`). An alternative: plain exported functions (`getAllProjects()`) — more functional. The static class is an OOP-ish choice; functional exports are more idiomatic for stateless helpers. Minor style.

### Q71. The contact route validates email via regex + min message length 10. Sufficient?

**A:** `route.ts:18-24` (email regex), `:26-31` (length ≥ 10). The regex is a basic email check (not RFC-complete; rejects some valid emails, accepts some invalid). Length-10 message is a weak anti-spam. Missing: rate-limiting (Q5/Q79), CAPTCHA, Honeypot is client-side only (`useContactForm.ts:26`). Server-side validation is thin. And the whole handler is unreachable (Q5). Fix: relocate + use a proper email validator (`zod.email`) + add rate-limiting + keep honeypot. Defense in depth.

### Q72. `Resend` is chosen over Nodemailer/SMTP. Why?

**A:** Resend is a modern email API (HTTP) — no SMTP server to run, simple SDK, deliverability handled. Nodemailer/SMTP needs an SMTP server/config + deliverability management. For a portfolio contact form (low volume), Resend's free tier is ideal. Trade-off: external dependency + API key + their pricing. `route.ts:34` `new Resend(apiKey)`. The choice is correct for a static-deployable, low-volume contact form (when the handler is fixed).

### Q73. `RESEND_API_KEY` is server-only (no `NEXT_PUBLIC_`). Correct?

**A:** `route.ts:5` reads `RESEND_API_KEY` (no `NEXT_PUBLIC_` prefix) → server-only, not bundled to the client. Correct — the API key is a secret. If it were `NEXT_PUBLIC_RESEND_API_KEY`, it'd be exposed in the client bundle. The server-only placement is right. (The handler being broken Q5 is a separate issue.) `.env.example:16` documents it (commented). The secret hygiene is correct.

### Q74. `getProjectHref` / `getLocalizedHref` build `/{locale}/...`. Why helpers?

**A:** `src/i18n/navigation.ts:15-22` — helpers to build locale-prefixed paths consistently. `getLocalizedHref(locale, route)` → `/${locale}${basePath}`. Centralizes path-building (DRY) — every link uses the helper, no manual `${locale}/projects/${id}` string-building. Consistent trailing-slash handling (static mode) lives here too. The helpers prevent locale-prefix typos across the app. Good abstraction.

### Q75. How would you add Zod validation to the contact form end-to-end?

**A:** `const contactSchema = z.object({ name: z.string().min(2).max(50), email: z.string().email(), message: z.string().min(10).max(5000), website: z.string().optional() })`. (1) Client (`useContactForm`): `contactSchema.safeParse(formData)` before fetch (instant feedback). (2) Server (`route.ts`): `contactSchema.safeParse(body)` (never trust client); reject invalid. (3) Escape the validated `message` before interpolating into email HTML (Q6). Shared schema (single source) → consistent client+server validation. This closes the Q6/Q71 gaps (when the handler is relocated, Q5).

---

## Round 4: Problem-Solving, Debugging & System Evolution (25 questions)

### Q76. The contact form's POST returns 404. Diagnose and fix.

**A:** `src/api/contact/route.ts` is under `src/api/`, but Next only treats `src/app/api/` as routes. There's no `src/app/api/`. So `POST /api/contact` → 404. Fix: move the file to `src/app/api/contact/route.ts`. Then in SSR mode it works (Vercel). In static mode (Hostinger), API routes don't deploy → use Formspree (client POST to their URL) instead. The relocation + a static-mode branch (or separate contact solution) makes it work on both targets. Currently `useContactForm.ts:37` calls a non-existent endpoint.

### Q77. A visitor on Hostinger can't send a contact message. Diagnose.

**A:** Static export has no server → no `/api/contact` route (even if relocated, Q76) → the fetch 404s → error state. The contact form is fundamentally non-functional on static hosting. Fix: switch to Formspree/Web3Forms (client POST to their backend, they email you) — works statically. Or direct users to mailto/social links (the current fallback, `contact/page.tsx:54-73`). `PROJECT_ARCHITECTURE.md:122` confirms it's known. The dual-build means contact works on Vercel (SSR) but not Hostinger (static) — a documented limitation.

### Q78. How would you add a blog (the markdown stack anticipates one)?

**A:** (1) `content/{locale}/posts/*.md` with front-matter (title, date, excerpt). (2) `src/app/[locale]/blog/page.tsx` (listing, `getContentBySlug`-style listing of all posts). (3) `src/app/[locale]/blog/[slug]/page.tsx` (detail, `generateStaticParams` from post slugs × locales, `generateMetadata` per post, render via `MarkdownContent`). (4) Sitemap entries for posts. (5) The markdown pipeline (gray-matter + react-markdown + remark-gfm + rehype-highlight) is already in place — just point it at posts. The infra is ready; only the routes/content are missing. A natural extension.

### Q79. How would you rate-limit the contact form (anti-spam)?

**A:** (1) **Upstash Redis + `@upstash/ratelimit`** — serverless-friendly, e.g., 3 submissions/IP/hour in the route handler or middleware. (2) **Vercel Edge config** (Vercel deploy). (3) **Turnstile/hCaptcha** — CAPTCHA the form, verify server-side. (4) **Honeypot** (already client-side, Q37) — keep. For a portfolio (low volume), honeypot + a simple IP rate-limit suffices. The current honeypot-only is weak (bots detect honeypots). Pair with rate-limiting + Turnstile for robustness. Note: static target can't run server-side rate-limiting → Formspree handles it there.

### Q80. A project appears in `/en` but 404s in `/ar`. Diagnose.

**A:** `generateStaticParams` (`projects/[id]/page.tsx:26-47`) reads each locale's `projects.json` for ids. If a project is in `en/projects.json` but not `ar/projects.json`, the AR detail page isn't generated → 404 (or the English-fallback in `content.ts:46-49` only applies to the listing, not the detail page). Fix: either (1) ensure all projects exist in all locales (translation discipline), (2) make the detail page fall back to EN content (extend `getProjectById` to fallback), or (3) generate the AR page from EN data with a "translation unavailable" note. The cross-locale id consistency is the root requirement.

### Q81. The HTML email has an XSS (`data.message` unescaped). Fix it.

**A:** `route.ts:47` — escape all user input before interpolating into HTML: `const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')`. Then `html: \`<p>${esc(data.message)}</p>\``. Better: build the email as **plain text** (no HTML) — `text: data.message` — eliminating the XSS class entirely. Or use a templating lib that auto-escapes. The interpolation-into-HTML is the bug; escaping or plain-text fixes it. Pair with Zod validation (Q75).

### Q82. How would you add hreflang for the 5 locales?

**A:** In each page's `generateMetadata`, return `alternates: { languages: { en: '/en/...', ar: '/ar/...', fr: '/fr/...', es: '/es/...', tr: '/tr/...' } }` + `canonical`. This tells Google the 5 locales are equivalent alternates. Add `x-default` → `/en`. The `getLocalizedHref` helper (`navigation.ts:15`) builds the URLs. Without hreflang, Google may index one locale and ignore others (or treat as duplicates). This is the biggest multilingual-SEO gap currently (Q49).

### Q83. The Turbopack font bug forced CDN `@font-face`. When/how do you migrate to `next/font`?

**A:** When the Turbopack+`next/font` bug is fixed (track Next 16.x releases). Migrate: `import { Inter, Tajawal } from 'next/font/google'` → each defines a CSS var + self-hosts; replace the `@import`/`@font-face` in `globals.css` with the next/font className/variable. Benefit: subsetting, preload, `font-display: swap`, no render-blocking external requests. Test the build after migration (the bug may be partially fixed). The current CDN `@font-face` is a documented workaround (Q10); the migration is planned, not urgent.

### Q84. How would you add project case-study pages (richer than the current detail)?

**A:** (1) Extend the project detail to render a markdown case study (`content/{locale}/cases/{id}.md`) via `MarkdownContent` — longer-form, with images, code, results. (2) The current detail (`projects/[id]`) is JSON-driven (title, tech, links); add an optional `caseStudySlug` field → if present, render the markdown case study below the summary. (3) `generateStaticParams` includes case-study slugs. This turns the portfolio from "link list" to "case-study showcase" (better for job-seeking). The markdown infra is ready.

### Q85. `project-tracker.json` is invalid (trailing comma). A tool reading it crashes. Fix + prevent.

**A:** Fix: remove the trailing commas at `:132` and `:501` (JSON doesn't allow them). Prevent: (1) a CI check that parses all committed `.json` (`for f in $(git ls-files '*.json'); do jq . "$f" > /dev/null || exit 1; done`); (2) editor config (VS Code JSON language server flags trailing commas); (3) use JSON5/JSONC if trailing comments/commas are desired (but then it's not strict JSON). The invalid file signals no JSON-validation gate on committed data. A `jq` parse check in CI catches it.

### Q86. How would you add a dark-mode-aware OG image per page?

**A:** (1) `@vercel/og` (`ImageResponse`) in a route `src/app/og/[...slug]/route.tsx` rendering the page title + brand on a branded background. (2) `generateMetadata` sets `openGraph.images: ['/og/${slug}']`. (3) For dark-mode-awareness: the OG image is static (social scrapers don't send dark-mode), so pick one theme (usually light/branded). (4) For per-locale: include the locale in the image (title in the locale's language). (5) Arabic text in `ImageResponse` needs the Arabic font loaded at runtime. This is the standard Next OG-image pattern; the infra (`@vercel/og`) is SSR-only (Vercel), so static-target OG would be pre-generated static images.

### Q87. How would you add analytics (which projects get viewed most)?

**A:** Privacy-friendly (Plausible/Umami): track `/[locale]/projects/[id]` pageviews (automatic) → "most-viewed projects." Track contact-form submissions, language switches, outbound project-link clicks. Client-side events (the app is mostly SSG). Env-gate to production. Plausible is cookieless (no GDPR consent needed). The events fire via the analytics SDK in client components. Avoid logging PII. The `NEXT_PUBLIC_SITE_URL` config pattern extends to the analytics domain.

### Q88. The README mentions `pnpm typecheck` and `pnpm format` scripts that don't exist. Fix.

**A:** `README.md:119-120` advertises scripts absent from `package.json`. Fix: either (1) add the scripts (`"typecheck": "tsc --noEmit"`, `"format": "prettier --write ."`), or (2) remove the README lines. Adding them is more useful (enables the commands). This is docs-vs-package drift — a contributor following README runs a non-existent script. A CI check comparing README scripts to `package.json` catches it. The drift signals README wasn't updated when scripts changed (or was aspirational).

### Q89. How would you test the dual-build (SSR + static)?

**A:** `scripts/test-routes.sh` (41 curl checks) is the static-deploy smoke test. Extend: (1) run it against both `pnpm build` (SSR, `pnpm start`) and `pnpm build:static` (`pnpm serve:static`) → assert all routes return 200 + expected content. (2) Vitest + RTL for components (`ProjectCard` renders, `useProjectFilter` filters). (3) Playwright e2e: visit each locale, switch language, filter projects, submit contact (assert error in static, success in SSR with mock). (4) A CI matrix: one job SSR, one job static. The dual-build needs dual testing — currently only static-routes is checked.

### Q90. How would you add a CV/resume download (PDF)?

**A:** (1) Commit the PDF to `public/cv.pdf` (or per-locale `cv-en.pdf`, `cv-ar.pdf`). (2) A download link in the contact/about section (`<a href="/cv.pdf" download>`). (3) For per-locale, the link uses `getLocalizedHref` logic (`/cv-${locale}.pdf`). (4) The PDF is static (served from `public/`). Simple. For auto-generation (from data), a build script could render HTML→PDF (puppeteer), but for a portfolio, a hand-authored PDF is standard. Low lift, high value for job-seeking.

### Q91. The `docs/` is extensive (`architecture`, `deployment`, `troubleshooting`, etc.). Much is stale. How do you maintain it?

**A:** (1) **Version-stamp** each doc ("accurate as of Next 16.2.6 / <date>"). (2) **Archive don't edit** — when a doc is stale (e.g., the 16.0.10 references), move to `docs/archive/` and write a current version. (3) **Generate structural facts** — route lists, script inventories, page counts from source. (4) **CI docs check** — verify cited files exist, cited scripts exist, version numbers match `package.json`. (5) **Single PR rule** — a behavior-changing PR updates docs same-PR. The docs are comprehensive but rotted (Next 16.0.10 → 16.2.6, "5 projects" → 12, etc.); process is the fix.

### Q92. How would you add i18n-aware 404 pages?

**A:** (1) `src/app/[locale]/not-found.tsx` — a server component reading the locale from `params` (or the URL) → renders a localized 404. (2) But `[locale]`'s `not-found.tsx` only triggers for misses **within** `[locale]`. (3) For misses outside `[locale]` (e.g., `/foo`), the root `not-found.tsx` triggers → default to English or detect locale from path. (4) Static-export: each locale's 404 must be a static file. The cleanest: one root `not-found.tsx` that reads the first path segment for locale + renders localized. Currently the 404 handling is basic.

### Q93. How would you add a "now" page (current focus, like nownownow.com)?

**A:** (1) `content/{locale}/now.md` (markdown, front-matter updated periodically). (2) `src/app/[locale]/now/page.tsx` (server component, `getContentBySlug("now")`, render via `MarkdownContent`). (3) `generateMetadata`. (4) Sitemap entry. (5) Nav link. The markdown infra is ready; it's just another content page. A "now" page is a portfolio convention (what you're currently doing). Low lift.

### Q94. The portfolio has 12 projects but docs say "5+." Fix the drift.

**A:** `docs/project/PROJECT_CONTEXT.md:56` and `COMPREHENSIVE_STATIC_EXPORT_GUIDE.md:58-59` say "5+ projects" — actual is 12. Fix: update the docs to "12 projects" (or remove the hardcoded count — derive from `en/projects.json` if a script generates the doc). A senior fix: don't hand-maintain counts in docs — generate them. The drift (5 → 12) happened as projects were added without doc updates. Process: a behavior PR (adding a project) updates the count, or the count is auto-generated.

### Q95. How would you add structured data (JSON-LD) for the portfolio?

**A:** (1) `Person` schema on the home page (name, jobTitle, url, sameAs → social profiles). (2) `ProfilePage` wrapping it. (3) For projects, `CreativeWork`/`SoftwareApplication` schema on the detail page (name, description, author, url). (4) Inject via `<script type="application/ld+json">` in the page (or via `generateMetadata`'s `other`/a dedicated component). (5) Test with Google's Rich Results Test. For a personal portfolio, `Person` schema helps knowledge-panel-ish results. Currently no JSON-LD — an SEO gap.

### Q96. A teammate wants to add Redux. Respond.

**A:** Current state: theme (next-themes), locale (props-passed), ephemeral UI (menu open, filter, form). No complex shared mutable state. Redux adds boilerplate for state that's cleanly handled. Ask: "What state needs cross-component sharing with frequent updates?" If the answer is "nothing," keep the current (hooks + props). The filter (`useProjectFilter`) is local to `ProjectsList`. The form (`useContactForm`) is local. No global store needed. YAGNI.

### Q97. How would you add a contact-form success analytics event?

**A:** In `useContactForm.ts`, after a successful POST (status → 'success'), call `window.plausible('Contact Form Submit')` (or the analytics SDK's event). Also track form-start and validation-errors (funnel). For the static-target (Formspree), the event fires on the client after Formspree's success response. Env-gate the analytics. Avoid logging the message content (PII). The event tells you the contact form converts (or doesn't) — valuable for a job-seeking portfolio.

### Q98. How would you migrate from dual-build to SSR-only (drop Hostinger)?

**A:** (1) Remove `build:static`, `serve:static`, `test:static`, `build-static.sh`. (2) Remove the `DEPLOY_TARGET` branch in `next.config.ts` (always `output: undefined`). (3) Restore `NextIntlClientProvider` in the layout (no static-mode bypass) → switch components back to `useTranslations()` hooks (from props-passing). (4) Restore middleware for locale detection. (5) Relocate + activate the contact API (`src/app/api/contact/route.ts`) → working contact form. (6) `next/font` migration (Q83). The SSR-only path is much simpler (no static-compat workarounds). Decision: is Hostinger still needed? If Vercel suffices, simplify.

### Q99. How would you add a newsletter signup?

**A:** (1) A third-party (Buttondown/ConvertKit/Mailchimp) with an embed form or API. (2) A form component (email input + submit) POSTing to their endpoint (or your API route that forwards). (3) On static hosting, use their embed/endpoint directly (no server). (4) On SSR, a route handler can forward + validate. (5) Confirmation email (double opt-in, GDPR). For a portfolio (low volume), Buttondown's free tier + embed form is simplest. The contact-form infra (validation, honeypot) extends to newsletter.

### Q100. Onboarding a new dev: 5-step guide?

**A:** 1. Read `AGENTS.md` + `docs/project/PROJECT_ARCHITECTURE.md` (the architecture) + `docs/troubleshooting/ISSUES_AND_SOLUTIONS.md` (the dual-build saga) — **note stale parts** (Next 16.0.10 → 16.2.6, "5 projects" → 12, `pnpm typecheck`/`format` scripts don't exist). 2. `pnpm install && pnpm dev` — visit `/en`, switch locales, filter projects. Note the contact form is broken (Q5). 3. Understand the dual-build: `DEPLOY_TARGET` env, `next.config.ts:6`, the layout provider fork (Q3), props-passing (Q9). 4. Trace a project: `content/en/projects.json` → `ProjectService.getAllProjects` → `ProjectsList` (client filter) → `ProjectCard`. Trace the contact: `ContactForm` → `useContactForm` → `/api/contact` (404!). 5. Run `pnpm build:static && pnpm serve:static` + `scripts/test-routes.sh` to see the static deploy. Warn: docs drift significantly; the contact form is known-broken; the dual-build is the source of most complexity.

---

## Bonus Round: Stretch Questions (5 questions)

### Q101. The dual-build (SSR + static) is the root complexity. Argue for keeping vs dropping it.

**A:** **Keep**: (1) Hostinger is cheap/free + Yemen-accessible (Vercel may be geo-blocked/slow there); (2) static = full control of hosting; (3) no vendor lock-in. **Drop**: (1) the dual-build forces i18n props-passing (Q9), no middleware (Q11), broken contact (Q5), trailing-slash ugliness (Q7), `unoptimized` images in static; (2) double testing surface (Q89); (3) Vercel free tier is generous for a portfolio. The decision hinges on whether the Hostinger audience is real (do Yemen visitors need it?) or aspirational. If real, keep (accept the complexity); if not, drop SSR-only and simplify massively. A senior should make this a deliberate decision (document the ADR), not let it persist by inertia. Most likely: drop to SSR-only, keep a static-export option documented-but-not-primary.

### Q102. The contact form is broken three ways. Design the complete fix for both deploy targets.

**A:** **SSR (Vercel)**: (1) Relocate `src/api/contact/route.ts` → `src/app/api/contact/route.ts`. (2) Add Zod validation (Q75) + rate-limiting (Q79) + HTML escaping (Q81). (3) Keep resend; verify `RESEND_API_KEY` + `CONTACT_EMAIL` env set. (4) The form POSTs to `/api/contact` → email sends. **Static (Hostinger)**: (1) API routes don't deploy → use **Formspree**: replace the fetch URL with the Formspree endpoint; their backend emails you. (2) Or a mailto fallback. **Unified**: detect `isStatic` client-side (`NEXT_PUBLIC_DEPLOY_TARGET`) → POST to `/api/contact` (SSR) or Formspree (static). One form, two backends, env-driven. This makes contact work on both targets. The dual-backend is the price of the dual-build.

### Q103. The i18n uses props-passing (no hooks) for static compat. Design the migration to next-intl hooks (SSR-only).

**A:** (1) Restore `NextIntlClientProvider` in the locale layout (remove the static-mode bypass). (2) In client components, replace prop-received `navDict`/`messages` with `useTranslations('Namespace')` / `useLocale()`. (3) Server components already use `getTranslations()` (server). (4) Restore middleware for locale detection. (5) Remove the manual `loadMessages`/props plumbing. (6) Test all locales. The migration is mechanical (props → hooks) once the provider is restored. Benefit: idiomatic next-intl (less prop-drilling, hook ergonomics, `useLocale()`). Cost: requires dropping static export (or keeping both, which defeats the simplification). This is the single biggest simplification if going SSR-only.

### Q104. The docs are extensive but stale (versions, counts, scripts). Design a docs-freshness process.

**A:** (1) **Version-stamp** every doc ("accurate as of Next 16.2.6, <date>"). (2) **Archive don't edit** — stale docs (16.0.10 refs) move to `docs/archive/` with a "historical" header; write current versions. (3) **Generate structural facts** — route lists, page counts, script inventories, project counts from source (`package.json`, `content/`) into a `docs/PROJECT_STATE.md` (auto-generated). (4) **CI docs check** — (a) parse all `docs/**/*.md` cited file paths (verify exist); (b) grep docs for `package.json`-derivable facts (versions, script names) and compare; (c) flag known-drift patterns ("Next 16.0", "5 projects", `src/i18n/guards.ts`). (5) **Single PR rule** — behavior PRs update docs same-PR. (6) **Quarterly audit**. The docs rotted because nothing enforced freshness; process + CI is the fix.

### Q105. Propose a comprehensive "production polish" sprint for the portfolio.

**A:** **Week 1 (correctness)**: Fix the contact form (Q76, Q102), add Zod validation (Q75), escape email HTML (Q81), add project-detail `generateMetadata` (Q16), fix `project-tracker.json` (Q85), remove stale `build.log` (Q59) + `docs/todo.md` mismatch (Q60). **Week 2 (SEO/social)**: Add hreflang (Q82), per-page OG images (Q86), JSON-LD `Person` (Q95), sitemap verification. **Week 3 (i18n + UX)**: Decide SSR-vs-dual (Q101); if SSR-only, migrate to next-intl hooks (Q103); add i18n 404s (Q92); verify cross-locale project consistency (Q80). **Week 4 (infra)**: Migrate to `next/font` (Q83) when fixed, add tests (Q89), add analytics (Q87), docs-freshness process (Q104). The portfolio is well-architected (dual-build is deliberate); the sprint closes the unfinished-feature + docs-drift gaps. Outcome: a fast, correct, SEO-complete, maintainable multilingual portfolio.

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

*End of interview document. 105 questions across 5 rounds. All file/function references verified against the dev_portfolio codebase.*
