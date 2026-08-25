# Design: Add alshaebsweets (Shaab Sweets) to Portfolio Projects

Date: 2026-08-18
Branch: `feat/add-alshaebsweets-project`

## Goal

Add the **Shaab Sweets** storefront (https://github.com/islamux/alshaebsweets, live at https://alshaebsweets.vercel.app) as a project entry in the portfolio, across all 5 locales.

## Source Project Summary

Static storefront for a 50-year-old Yemeni sweets shop in Taiz — Vite + vanilla ES modules, zero runtime dependencies, installable offline-first PWA (Workbox precache), cart/checkout/order-tracking/staff-admin running fully client-side with localStorage persistence, Arabic-first RTL, hand-drawn SVG art, WhatsApp order flow.

## Decisions (approved by user)

- **Image**: user-provided `public/images/alshaebsweets.png`, moved to `public/images/projects/alshaebsweets.png` (convention: all covers live there).
- **Placement**: appended last in each locale's `projects.json`, `featured: true`. Homepage featured row shows the first 3 featured projects and is unaffected.
- **Year**: 2026.
- **Localization**: genuinely translated `description` / `longDescription` in AR, TR, ES, FR (matches existing per-locale style; AR name is Arabic-first).

## Entry (EN reference)

```json
{
  "id": "alshaebsweets",
  "name": "Shaab Sweets (حلويات الشعب)",
  "description": "Offline-first PWA storefront for a 50-year-old Yemeni sweets shop in Taiz — cart, checkout, order tracking, and staff admin, all in the browser.",
  "longDescription": "A static storefront for Shaab Sweets in Taiz, Yemen — 50 years of Yemeni & Adeni sweets. Built with Vite and vanilla ES modules with zero runtime dependencies, it ships as an installable offline-first PWA: a Workbox service worker precaches the whole store so it works with no internet. Cart, multi-step checkout, order tracking, and a staff admin panel (orders, prices, delivery fees, special requests) run entirely client-side and persist to localStorage. Arabic-first RTL design with hand-drawn SVG art and a WhatsApp order flow.",
  "tech": ["Vite", "JavaScript", "PWA", "Workbox"],
  "github": "https://github.com/islamux/alshaebsweets",
  "demo": "https://alshaebsweets.vercel.app",
  "image": "/images/projects/alshaebsweets.png",
  "featured": true,
  "year": "2026"
}
```

AR/TR/ES/FR keep identical `id`, `tech`, `github`, `demo`, `image`, `featured`, `year`; `name`, `description`, `longDescription` are translated (AR name: "حلويات الشعب").

## Files Changed

1. `public/images/alshaebsweets.png` → `public/images/projects/alshaebsweets.png` (git mv)
2. `content/{en,ar,tr,es,fr}/projects.json` — append entry

## Verification

1. `pnpm lint`
2. `pnpm build` — the `/[locale]/projects/[id]` route uses `generateStaticParams`, so a successful build proves the detail pages exist
3. Confirm `out`/`.next` output includes `en/projects/alshaebsweets/` (static mode not required for this check; SSR build is enough)

## Out of Scope

- Homepage featured trio reordering
- Any changes to the alshaebsweets repo itself
- Adding the project to `home.md` / `about.md` content
