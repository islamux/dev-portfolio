# Live Demo Script — dev_portfolio Technical Review

**Target:** 10 minutes (compress to 5 via the critical-path notes).
**Mode:** Presenter shows a browser and the terminal, alternating.
**Before you start:** read the README's pre-presentation checklist once.

---

## 0. Preflight (1 min) — run BEFORE the audience arrives

All commands exist in the repo (see `package.json` scripts and `scripts/`).

```bash
pnpm lint                     # ESLint — expect clean, 0 warnings
pnpm build:static:full        # clean + static build → out/  (takes a minute)
scripts/test-routes.sh        # serve out/ on :3099 → expect 40/40 ALL PASS
```

- `scripts/test-routes.sh` needs the `out/` directory. If you skipped the rebuild and `out/` is already present, the script still runs — but rebuild at least once so the claim is fresh.
- If `python3`/`curl` are missing (Linux tools the script relies on), see **Fallback** below.

> If `test-routes.sh` reports anything other than 40/40, **stop the demo** and fix routing before proceeding. Do not demo a broken route set.

---

## 1. Open the app (1 min)

**Do:** `pnpm dev` → open `http://localhost:3000`.

**Say:**
> "Dev mode is SSR so I can show the live interactions. In production this ships as static HTML — I proved that on this slide with the 40/40 route check."

**Point at:** the root URL `http://localhost:3000/` immediately redirects to `/en/`.

**Inside:** `src/app/(index)/page.tsx:10-12` — client `router.replace(isStatic ? "/en/" : "/en")`.

---

## 2. Routing / URL state exercise (2 min)

**Do:**
- Manually type `/en/`, `/ar/`, `/tr/` into the address bar.
- Watch Arabic flip the page to **RTL** (`dir="rtl"`, `lang="ar"`).

**Say:**
> "Every locale is its own pre-rendered tree. The `<html>` tag gets `dir` and `lang` from a single check against the locale list."

**Inside:**
- `src/i18n/config.ts:22` — `rtlLocales = ["ar"]`.
- `src/app/[locale]/layout.tsx:31` — `isRTL(locale) ? "rtl" : "ltr"`.

**Do (the URL state punchline):** type `/en/projects/athkarix/` and hit Enter. It's a static file.
- **Inside:** `src/app/[locale]/projects/[id]/page.tsx:12-16` — `generateStaticParams` pre-builds every `(locale, id)` pair, so `out/en/projects/athkarix/index.html` physically exists on disk.

---

## 3. Theme + Hydration (2 min) — the section that proves understanding

**Do:**
- Click the moon/sun icon in the header.
- Reload the page — the saved theme persists.

**Say (tie to the 4 hydration slides):**
> "The theme is the perfect place to show what hydration is **not**. The server renders HTML with no `window` — it must render the same first tree the client starts with. My ThemeContext starts from the fixed default `'system'` on the server, reads `localStorage` only when `window` is defined, and the toggle icon doesn't pick a side until `useMounted()` is true. That's why a reload doesn't flash a wrong icon or warn about a mismatch."

**Show the wrong example (optional, 30s if time):**
> "Naive code doing `localStorage.getItem('theme')` in the initial render would produce `dark` on the server and `light` on the first client render — a mismatch before hydration, which is a bug, not a nicety."

**Inside:**
- `src/app/providers.tsx:19-24` — lazy initializer, `typeof window` guard, fixed server default.
- `src/components/ui/ThemeToggle.tsx:21-29` — `useMounted()` gates the icon.
- `src/hooks/useMounted.ts:3-15` — the guard.
- `src/app/[locale]/layout.tsx:53` — `suppressHydrationWarning`.

---

## 4. Client-state reload exercise (1 min)

**Do:**
- On `/en/projects/`, click a tech filter (e.g. "Flutter"), note the filtered grid, then **reload**.

**Say:**
> "The filter is pure client state in `useProjectFilter` — it does not survive a reload, by design. Static export has no server to remember it. If we wanted shareable filtered URLs, we'd move it to the query string — a deliberate scope decision."

**Inside OR (after reload) UI shows "All" again:**
- `src/hooks/useProjectFilter.ts:6-24`.

---

## 5. Content / rendering (1 min)

**Do:**
- Open **About** in a couple of locales. Show the same layout, different details.
- Open a project detail page.

**Say:**
> "Content is Markdown and JSON files in the repo, read at build time and rendered by react-markdown with GFM + syntax highlighting. Nothing here is fetched at runtime."

**Inside:**
- `src/lib/content.ts:11-25` — `getContentBySlug` reads `fs`, parses frontmatter with gray-matter.
- `src/components/ui/MarkdownContent.tsx:38-43` — remark-gfm + rehype-highlight.

---

## 6. Contact form (2 min) — env-dependent

**Precondition:** works fully only under `pnpm dev` (SSR) AND with a real `RESEND_API_KEY`.

**Do:**
1. Fill the form, submit → success message.
2. (Optional, if time) fill the invisible **honeypot** → "Spam detected" error, no email sent.

**Say:**
> "The form posts to the `/api/contact` route handler. Validation happens server-side — required fields, email regex, min message length — and the name/email/message are HTML-escaped before they are interpolated into the email. If `RESEND_API_KEY` is absent, it logs the submission instead of failing."

**Inside:**
- `src/components/sections/ContactForm.tsx:20-28` — honeypot field.
- `src/hooks/useContactForm.ts:22-51` — status machine + honeypot check.
- `src/api/contact/route.ts:12-58` — validation, `escapeHtml`, Resend or console fallback.

### ⚠️ Fallback plan (always have this ready)

- If `RESEND_API_KEY` is missing: don't claim the email was sent. Say "with no key the route logs instead of emailing (line 52)" — that is the correct behavior, not a mistake.
- If `pnpm dev` fails: switch to serving the static `out/` with `scripts/test-routes.sh`'s server on :3099 and walk the routes as files — the hydration and routing examples still work; only the contact POST (no server in static export) is unavailable.
- Keep 2–3 static screenshots (home AR, projects filter, dark mode) as a last-resort backup.

---

## 7. Close (1 min)

**Say:**
> "That's the whole arc: static export forced directory routing, prop-driven i18n, and hydration-safe theming. Now the questions — I'll open the source for whatever we discuss."

**Hand over:** to `presentation/qa-guide.md`.

---

## Statements to say vs to avoid

| ✅ Say | ❌ Avoid |
|---|---|
| "The route smoke test is 40/40 and lint is clean." | "The app is fully tested." (there are no unit tests) |
| "Theme is safe from hydration mismatch because of the fixed default + post-mount read." | "The theme is instant with zero flicker by magic." |
| "The contact form emails **when a server + RESEND_API_KEY exist**; in pure static export there's no server." | "The contact form sends email from the static site." |
| "Static export drops ISR and image optimization." | "It's the fastest possible in every way." |
| "There is no PWA/service worker." | "It works offline." |

---

## Compression to 4 minutes (if the demo eats into time)

Run **only**: Preflight → §2 routing → §3 theme/hydration → §5 content → §7 close.
Skip/shorten: §4 (reload) and §6 (contact). If §6 is dropped, still say one line: "the contact route is the one server dependency — see the fallback."
