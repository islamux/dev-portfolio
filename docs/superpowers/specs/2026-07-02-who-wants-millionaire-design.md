# Add "Who Wants to Be a Millionaire" to Portfolio

## Overview

Add the existing "Who Wants to Be a Millionaire" trivia game project to the developer portfolio. The portfolio is data-driven — no code changes needed.

## Project Data

| Field | Value |
|-------|-------|
| **id** | `who-wants-million` |
| **name (en)** | Who Wants to Be a Millionaire |
| **name (ar)** | من سيربح المليون |
| **name (tr)** | Kim Milyoner Olmak İster |
| **name (es)** | ¿Quién Quiere Ser Millonario? |
| **name (fr)** | Qui Veut Gagner des Millions |
| **tech** | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Tone.js, PWA |
| **github** | https://github.com/islamux/who-wants-million |
| **demo** | https://who-wants-million.vercel.app |
| **featured** | true |
| **year** | 2025 |
| **image** | /images/projects/millionaire-cover.png |

## Files to Modify

| File | Action |
|------|--------|
| `content/en/projects.json` | Add project entry |
| `content/ar/projects.json` | Add project entry (Arabic-translated) |
| `content/tr/projects.json` | Add project entry (Turkish-translated) |
| `content/es/projects.json` | Add project entry (Spanish-translated) |
| `content/fr/projects.json` | Add project entry (French-translated) |
| `public/images/projects/millionaire-cover.png` | Add screenshot (user provides) |
| `project-tracker.json` | Add subtask to backlog |

## Locale Descriptions

**English:**

> An interactive trivia game built with React, TypeScript, and Vite featuring 15 questions across general knowledge topics, 3 lifelines (50:50, Audience Poll, Walk Away), a 30-second timer with SVG circular countdown, Tone.js audio effects, and PWA support for full offline play. Responsive RTL layout optimized for mobile.

**Arabic:**

> نسخة متكاملة من لعبة من سيربح المليون تحتوي على 15 سؤالاً في مواضيع متنوعة، مع 3 مساعدات (50:50، رأي الجمهور، الانسحاب)، مؤقت 30 ثانية مع عداد دائري، تأثيرات صوتية باستخدام Tone.js، ودعم تطبيقات الويب التقدمية (PWA) للتشغيل الكامل دون اتصال بالإنترنت.

**Turkish/Spanish/French:** Full translations of the English description.

## No Code Changes

The portfolio's project system reads `content/{locale}/projects.json` to auto-discover projects. Adding entries to these files is sufficient. The project will appear on the listing page, detail page, and (if featured) the homepage.
