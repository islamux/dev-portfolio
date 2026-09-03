# QA Guide — dev_portfolio Technical Review

A question bank for the presenter. Every answer is speakable in 30–60 seconds, is grounded in a precise file/line reference, states the trade-off or known limit, and — where useful — offers a follow-up improvement.

**Path convention:** all paths are relative to the repo root and verified against the current source.

---

## 1. Architecture & System Design

**Q1. What is the product and what problem does it solve?**
> A personal developer portfolio in five languages (EN, FR, AR, ES, TR) that a single maintainer can host cheaply as static files. It proves front-end engineering while staying within a low-traffic, low-maintenance budget.
- **Ref:** `package.json:1-28`, `README.md:1-19`
- **Trade-off:** The static constraint rules out dynamic features by design (see Q2).
- **Follow-up:** "If traffic and maintenance effort grew, what would you change first?" → move contact to a serverless function.

**Q2. Why static export instead of SSR or a full backend?**
> Because a portfolio has no runtime data needs. Pre-rendering every route as HTML lets it live on Hostinger LiteSpeed shared hosting with no Node process, no database, and no per-request compute.
- **Ref:** `next.config.ts:6-13`, `README.md:206-218`
- **Trade-off:** You lose ISR, middleware, image optimization, and any route that needs request-time data.
- **Follow-up:** The reason the whole architecture is shaped the way it is.

**Q3. Draw the data flow from source to UI.**
> `content/{locale}/*.md` + `projects.json` → `src/lib/content.ts` (fs + gray-matter + JSON.parse) → `src/services/projectService.ts` (pure functions) → server page reads and types it → passes `locale` + data as props → client components render.
- **Ref:** `src/lib/content.ts:11-50`, `src/services/projectService.ts:4-15`, `src/app/[locale]/projects/page.tsx:52-60`
- **Follow-up:** "Where does this break in static export?" → nothing can be dynamic at runtime; all data is baked at build.

---

## 2. Rendering, SSR / SSG / CSR & Hydration

**Q4. What is the difference between SSR, SSG, and CSR in this project?**
> SSG renders once at build time to files in `out/` — that's this site. SSR renders on each request on a server (only used in dev/`pnpm dev`). CSR renders in the browser after load — only the interactive client components here, and they hydrate into pre-rendered HTML rather than starting empty.
- **Ref:** `next.config.ts:9-13`, `src/components/sections/ProjectsList.tsx:1-23`
- **Trade-off:** SSG trades real-time reactivity for speed and hosting simplicity.

**Q5. What is Hydration, precisely?**
> It is attaching React to the HTML the server already produced and wiring up event handlers — not rebuilding the page from an empty DOM. The client must produce the same initial tree the server produced, or React logs a mismatch.
- **Ref:** `src/components/ui/ThemeToggle.tsx:21-29`, `src/hooks/useMounted.ts:3-15`

**Q6. Why do hydration mismatches happen, and how do you prevent them?**
> When the server render and the first client render differ — typically because code reads a browser-only API (`window`, `localStorage`) during the initial render. Prevent by using a fixed server-safe default, reading the browser value only after mount, and gating anything that depends on it behind a `mounted` flag.
- **Ref:** `src/app/providers.tsx:19-24`, `src/hooks/useMounted.ts:3-15`
- **Follow-up:** "Could `localStorage` be read safely during render?" → only if the value happens to match the server default; it's fragile — don't.

**Q7. What happens before and after `useEffect`?**
> Before commit, React renders; `useEffect` runs after the DOM is committed and can safely touch browser APIs and trigger a *later*, valid state update. It's the correct place for reading `matchMedia`, `localStorage`, etc.
- **Ref:** `src/app/providers.tsx:37-48`

**Q8. Why can't you read browser APIs during render in an SSR/SSG app?**
> At build time there is no browser; `window`/`localStorage` are undefined. Reading them in a render body crashes the build or causes mismatches. The fix is the `typeof window !== "undefined"` guard and a post-mount read.
- **Ref:** `src/app/providers.tsx:19-24`

**Q9. What is the key distinction between a first-render mismatch and an effect-driven update?**
> A mismatch during the first render is a bug that React warns about and may reprocess. An update triggered inside `useEffect` is expected — as long as the first render matched. One is "wrong on arrival", the other is "correctly reactive".
- **Ref:** `src/hooks/useMounted.ts:6-12`, `src/app/providers.tsx:37-48`

---

## 3. Routing & State Management

**Q10. How do you handle routing for 5 locales without `.html` files?**
> Directory-based routes with `trailingSlash: true` produce `en/index.html`, `en/about/index.html`, etc. Path builders return plain strings like `/en/projects/athkarix/`. This is mandatory because LiteSpeed redirects `/en` → `/en/` then 403s without `index.html`.
- **Ref:** `next.config.ts:10`, `src/i18n/navigation.ts:10-17`, `out/.htaccess:6-11`

**Q11. Why does the root `/` redirect to `/en/`?**
> The root route group `(index)` declares `<html lang="en">` and its page is a client component that `router.replace`s to the default locale. There's no localized first page at `/` without a locale segment.
- **Ref:** `src/app/(index)/page.tsx:6-12`, `src/app/(index)/layout.tsx:10-14`

**Q12. How do dynamic project pages get pre-rendered?**
> `generateStaticParams` enumerates every `(locale, id)` pair at build time so each becomes a real `out/en/projects/<id>/index.html`. No params → no page: the route has a "Project Not Found" fallback.
- **Ref:** `src/app/[locale]/projects/[id]/page.tsx:12-16`, `:25-34`

**Q13. How is language switching implemented without next-intl navigation?**
> A client `LanguageSwitcher` computes the next path from the current pathname via `buildLocalePath` and pushes it with `next/navigation`'s `useRouter`. It does not use `next-intl/navigation`, to keep static export safe.
- **Ref:** `src/i18n/navigation.ts:19-28`, `src/components/sections/LanguageSwitcher.tsx:24-28`

**Q14. How is theme state managed and persisted?**
> A custom `ThemeContext` holds `theme: "light" | "dark" | "system"`. `setTheme` stores it in `localStorage` and applies a class on `<html>`. The initial value is `"system"` unless `localStorage` is readable.
- **Ref:** `src/app/providers.tsx:18-54`

**Q15. Why is there no third-party state library (Redux/Zustand)?**
> The only shared state is theme (one context) — everything else is local component state or props. A store would be YAGNI: more indirection with no benefit at this scale.
- **Ref:** `src/app/providers.tsx:56-69`, `src/hooks/useProjectFilter.ts:6-24`

---

## 4. Data Pipeline & Content

**Q16. Where does the content come from, and why files rather than a CMS?**
> Version-controlled Markdown and JSON in `content/{locale}/`. No CMS because the data is small, changes rarely, and benefits from git history and no external service.
- **Ref:** `src/lib/content.ts:11-25`

**Q17. Explain the `getProjectData` fallback.**
> If a locale's `projects.json` is empty or missing, it falls back to the English file, so an unfinished locale never renders an empty projects page.
- **Ref:** `src/lib/content.ts:35-45`
- **Trade-off:** The German-style fallback is fine for a portfolio but would hide data-authoring mistakes — a log would help.

**Q18. What is the project filter exclusion set for?**
> `useProjectFilter` deliberately hides framework-y tags (`Tone.js`, `next-intl`, etc.) from the filter buttons so users filter by domain-relevant tech, not library noise.
- **Ref:** `src/hooks/useProjectFilter.ts:4` (as a data-shaping decision)

**Q19. How is Markdown rendered and is it safe?**
> `react-markdown` (with remark-gfm and rehype-highlight) escapes raw HTML by default; there is no `dangerouslySetInnerHTML`.
- **Ref:** `src/components/ui/MarkdownContent.tsx:38-43`

---

## 5. API, Database & Identity

**Q20. What is the contact flow?**
> The client form posts JSON to `/api/contact`; the route validates fields, escapes them, and sends an email via Resend when `RESEND_API_KEY` is set, otherwise it logs the submission.
- **Ref:** `src/components/sections/ContactForm.tsx:16-106`, `src/api/contact/route.ts:8-63`

**Q21. What happens if there is no `RESEND_API_KEY`?**
> The route does not error; it logs the submission to the console and still returns success. Safe for dev, but silent in production — a monitoring gap.
- **Ref:** `src/api/contact/route.ts:51-58`

**Q22. Is there a database or authentication?**
> No. Content is files; there is no user model, session, or auth — there is nothing to authenticate on a static site. The contact route is the only server surface.
- **Ref:** `src/lib/content.ts:6-9`, `src/api/contact/route.ts`

**Q23. What are the security controls?**
> HTML-escaping on user input before email interpolation, plus a honeypot field to catch bots. No secrets in client code — `RESEND_API_KEY` lives only in the server env.
- **Ref:** `src/api/contact/route.ts:44-48`, `src/hooks/useContactForm.ts:24-28`, `src/components/sections/ContactForm.tsx:20-28`

---

## 6. Performance, Caching & PWA

**Q24. How is the site fast?**
> Pre-rendered static HTML (no per-request compute), cached by `.htaccess` (1-year images, 1-month CSS/JS), gzip-compressed, images pre-optimized WebP at build.
- **Ref:** `next.config.ts:11-13`, `out/.htaccess:15-36`

**Q25. Why are images `unoptimized`?**
> Static export cannot run the Next.js image optimizer (no server), so images must be pre-optimized. Covers are committed as WebP.
- **Ref:** `next.config.ts:11-13`, git history for webp conversion

**Q26. Is there a PWA / service worker / offline support?**
> No. This site has no service worker, manifest, or offline cache. That is an explicit, documented limitation of the scope.
- **Ref:** `README.md:215` (lists what static drops) — there is no manifest/sw in the repo.
- **Follow-up:** "Add Workbox precaching purely as a static `public/` addition if offline is ever required."

---

## 7. Security & Threat Model

**Q27. Describe the threat model.**
> A static site exposes only what's in `public/`. The real surfaces are XSS (handled by react-markdown escaping + `escapeHtml` on contact input) and bot spam (honeypot). No auth secrets to steal client-side.
- **Ref:** `src/api/contact/route.ts:44-48`, `src/lib/escapeHtml.ts`, `src/components/ui/MarkdownContent.tsx:38-43`

**Q28. Where could secrets leak, and how is it prevented?**
> `RESEND_API_KEY` is read only via `process.env` in a server route, never bundled into the client, and never in messages. `CONTACT_EMAIL` has a default. `.env.local` is git-ignored.
- **Ref:** `src/api/contact/route.ts:6`, `src/lib/content.ts`, `env.example`

---

## 8. Testing & Observability

**Q29. What is actually tested?**
> Automated: ESLint (clean), a static-route smoke script (40/40), and a successful static build. Not tested: unit behavior of the hooks, the content fallback, and the contact validation.
- **Ref:** `package.json:15`, `scripts/test-routes.sh:1-114`

**Q30. What is deliberately NOT tested, and why is that acceptable?**
> The theme persistence, filter logic, and contact validation have no unit tests — a real gap for a codebase whose trickiest logic is hydration-safe theming. Acceptable only because scope is small and a 40-route net catches routing regressions.
- **Follow-up:** "Write Vitest tests for `useProjectFilter` and the `getProjectData` fallback first (highest user impact)."

**Q31. What claims should you NOT make about testing?**
> Do not say "fully tested," "unit-tested," or "CI-verified" — none are true. The evidence is lint + the 40-route script + a clean build.

---

## 9. Trade-offs & Roadmap

**Q32. What is the biggest current risk?**
> The zero unit-test net around hydration-safe theming and the content fallback — a regression there would be silent until a user sees a flash or wrong content.
- **Ref:** `src/app/providers.tsx:19-24`, `src/lib/content.ts:35-45`

**Q33. `next-themes` is in `package.json` — do you actually use it?**
> No. It is an unused dependency; theming is a custom `ThemeContext`. The README says the custom provider replaced `next-themes`. This is cruft to remove (or consciously keep for a future migration).
- **Ref:** `package.json:22`, `README.md:259`, `src/app/providers.tsx:18-69`

**Q34. What is the contact route's deployment reality?**
> `/api/contact` only works where a server runs (Vercel SSR, `pnpm start`). On the Hostinger static export there is no server, so the form cannot email from the static build. Decision: external form service, or keep SSR deploy alongside.
- **Ref:** `src/api/contact/route.ts:8-63`, `next.config.ts:9`

**Q35. What's the roadmap priority and why?**
> 1) Unit-test the hooks + fallback (highest blast radius), 2) decide the contact-email path, 3) remove/keep unused `next-themes`, 4) optional PWA. Ordered by risk, not novelty.
- **Ref:** `src/hooks/*.ts`, `src/api/contact/route.ts`

---

### Presenter guardrails
- **Answer order:** entry point → data flow → reason for the decision → trade-off → test (open the source when asked).
- **Do not overclaim:** no unit tests, no PWA, contact works in static only with a server, no dynamic/ISR content.
- **If you don't know:** say so and open the code — the code is the source of truth, not memory.
