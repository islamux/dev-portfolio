# Presentation Package — dev_portfolio Technical Review

A self-contained 60-minute presentation package that proves deep understanding of the `dev_portfolio` codebase. It assumes a **senior engineering audience** that will test whether you truly understand the architecture — not just the final UI.

**Language:** English. **Audience:** technical review team. **Duration:** 60 minutes.

---

## Files

| File | Responsibility |
|------|---------------|
| `slides.html` | Self-contained HTML slide deck (30 slides). Open it directly in a browser; no build, no dependencies. |
| `demo-script.md` | Numbered live-demo script (10 min, compressible to 4) with preflight commands and a fallback plan. |
| `qa-guide.md` | 35-question team Q&A bank with 30–60s answers, file/line references, trade-offs, and follow-ups. |

---

## How to run the deck

Just open the file — it is a single self-contained HTML document:

```
# from the repo root
xdg-open presentation/slides.html     # Linux
open presentation/slides.html         # macOS
start presentation/slides.html        # Windows
```

No server, no build, no network required.

### Slide shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / next slide |
| `Space` | Next slide |
| `Home` / `End` | First / last slide |
| `f` | Toggle fullscreen |
| `n` | Toggle speaker notes panel |
| `o` | Toggle overview (slide index) |
| `?` | Toggle keyboard help |

On-screen buttons (prev/next/fullscreen/notes/overview) also work, as does **touch swipe** on mobile. Slide count, progress bar, dots, and overview index are computed dynamically from the real slide DOM, so numbering always matches.

The deck honors `prefers-reduced-motion`, is responsive on mobile, and has print styles (each slide on its own page — useful for PDF/backup).

### Speaker notes

Each slide has notes under its `data-notes` attribute. Press `n` to show the notes panel, or open the file in a text editor to read/edit them.

---

## Order of use

1. **Before the talk:** read `README.md` (this file) and run the **Pre-Presentation Rehearsal Checklist** below.
2. **On stage:** run the deck in order. The progression is Opening → Thesis → Decisions → Mental model → Product → Deep dive (incl. mandatory Hydration) → **Live demo** → Trade-offs → Roadmap → Closing/Q&A.
3. **At the demo divider slide** (slide 28), switch from the deck to the browser and follow `demo-script.md`.
4. **During Q&A,** use `qa-guide.md` as your bank.

### 60-minute timing (target ~2 min/slide)

| Section | Slides | Minutes |
|---|---|---|
| Opening (product + problem) | 1–3 | 5 |
| Thesis (governing idea) | 4–5 | 4 |
| Decisions journey | 6–8 | 6 |
| Mental model (data flow) | 9–10 | 4 |
| Product experience | 11–13 | 5 |
| Technical deep dive | 14–27 | 13 |
| Live demo | 28 | 10 (compress to 5) |
| Trade-offs | 29 | 4 |
| Roadmap | 30 | 3 |
| Closing + Q&A | 31–32* | 6 |
| **Total** | | **60** |

> *Slide 32/33 from the authoring draft were folded into the 30-slide deck; the count on screen is the authoritative number.

---

## Mandatory Hydration coverage

The deck contains a dedicated **four-slide Hydration sequence** (deep-dive slides 18–21) anchored to the real code:
- `src/app/providers.tsx:19-24` — fixed server default + `typeof window` guard
- `src/hooks/useMounted.ts:3-15` — the hydration guard
- `src/components/ui/ThemeToggle.tsx:21-29` — post-mount icon gating
- `src/app/[locale]/layout.tsx:53` — `suppressHydrationWarning`

The story runs: server render → HTML response → first client render → hydration (attach, not rebuild) → effects after commit → mismatch example → correct pattern → key distinction.

---

## Honest limitations this package states (know them cold)

- **No unit/integration test suite.** Automated evidence is `pnpm lint` (clean) + `scripts/test-routes.sh` (40/40) + `pnpm build:static`.
- **No PWA / service worker / offline** support.
- **Contact email** needs a running server (`pnpm dev`/`pnpm start`) **and** a `RESEND_API_KEY`; the static export has no server to handle `/api/contact`.
- **No database, CMS, auth, comments, or admin** — by design.
- **`next-themes` is an unused dependency** in `package.json`; theming is a custom `ThemeContext`.

Do not claim otherwise on stage. Knowing the limits is the point.

---

## Pre-Presentation Rehearsal Checklist (60 min)

- [ ] **Run the full deck against a timer at least once.** Compare each section against the timing table above; if a section overruns, cut content, don't rush.
- [ ] **Verify slide count matches the index and numbering.** The deck computes this dynamically, but re-confirm the on-screen `X / N` counter after any edits.
- [ ] **Run the preflight demo commands and confirm they all pass:**
      `pnpm lint` · `pnpm build:static:full` · `scripts/test-routes.sh` (expect 40/40).
- [ ] **Test the fallback demo plan** (shortened script / static screenshots) in case `RESEND_API_KEY` or `pnpm dev` is unavailable.
- [ ] **Open `slides.html` in the browser and test:** keyboard nav (arrows, space), fullscreen, notes (`n`), overview (`o`), help (`?`), and touch swipe.
- [ ] **Check print/PDF export** and that slides render correctly on a projector (aspect ratio, no clipped text) — test on the actual projector if possible.
- [ ] **Prepare a demo backup** (screenshots of home AR, projects filter, dark mode) in case the live demo is fragile.

---

## Environmental requirements & build notes

- `scripts/test-routes.sh` starts a **Python 3** HTTP server and needs **curl** — Linux/macOS tools. On a machine without them, fall back to serving `out/` with `pnpm serve:static` or opening files directly.
- Run `pnpm build:static:full` rather than reusing a stale `out/` if you want the build claim to be current. The classic failure this package documents — LiteSpeed 403 on `/en` — is the reason `trailingSlash: true` matters; never claim route correctness without a passing `test-routes.sh`.
- Build and typecheck should be run **sequentially**, not in parallel (typecheck reads generated `.next` files).
