---
trigger: always_on
description: Engineering, performance, privacy, and quality rules for the ForUs Next.js codebase.
---

# 04 — Engineering

## Structure (PRD §9)
```
app/ layout.tsx, page.tsx (gate), (app)/{feed,discover,inbox,profile}, (dev)/studio
components/ feed/, effects/, sheets/, icons/, ui/ (shadcn)
content/ feed.ts, slots.ts, site.ts, manifest.json, media/
lib/ store.ts, wishes.ts, useActiveItem.ts, whatsapp.ts, hash.ts
scripts/ build-media.mjs
```
Keep files under ~250 lines; split components by responsibility. Server Components by default; add `"use client"` only for interactive pieces (feed, rail, sheets, effects).

## TypeScript & style
- `strict: true`, no `any` (use `unknown` + narrowing), exported types for `FeedItem`, `WishAction`, `WishConfig`, `SiteConfig` exactly as PRD §8.
- Tailwind v4 with the tokens from DESIGN.md §2.5 in `globals.css`. No hardcoded hex in components; use token classes (`bg-canvas`, `text-ink-mute`, `bg-primary`).
- Dark only: set `<html class="dark">`, `color-scheme: dark`, `theme-color: #000`.
- Indonesian user-facing copy lives in `content/` or a single `lib/copy.ts`; components stay language-agnostic.
- Icons: custom SVG for rail/nav (see 01); lucide only for secondary UI.

## State
- One Zustand store with `persist` (key `forus:v1`, versioned with `migrate`): `unlocked, lastIndex, liked[], reposts[], saves[], followed, userComments{}, finaleSeen, muted, wishCursor{}, wishesEnabled`.
- Per-item slices and selectors; avoid re-rendering the whole feed on a like. Effects mount in a portal layer outside the feed column.
- Wrap `localStorage` access in try/catch and fall back to memory.

## Feed & media performance
- Active item via IntersectionObserver (threshold 0.7) in `useActiveItem`; only the active item plays. Pause everything on `visibilitychange`.
- `muted playsInline` for autoplay on iOS; unmute after the gate gesture. Provide a "ketuk untuk suara" fallback.
- Use `100dvh`, `env(safe-area-inset-*)`, `viewport-fit=cover`. Prevent body scroll bounce (`overscroll-behavior: none`).
- Preload poster of item 0 with `<link rel="preload">`. Use `next/image` for posters/photos where possible; `video` stays a native element.
- Budget: LCP < 2.5s, first clip playing < 3s on 4G, 60fps animations on mid-range phones. Check with Lighthouse mobile and a throttled run.
- Animations: `transform`/`opacity` only; use `will-change` sparingly; `prefers-reduced-motion` → 150ms fades, no particles.

## Privacy & security
- `X-Robots-Tag: noindex, nofollow` header (middleware or `next.config`), `robots.txt` disallow all, `<meta name="robots" content="noindex">`.
- Gate: compare SHA-256 of the entered `DDMMYYYY` with `NEXT_PUBLIC_GATE_HASH`; never ship the plaintext date. No analytics, no third-party trackers, no cookies beyond local storage.
- WhatsApp number and texts in `content/site.ts` (or env), never in components. No secrets in the client bundle other than the hash.
- Microphone only when the candle ritual starts; release the stream right after.

## Accessibility
- Targets ≥ 44px, all icon buttons have `aria-label` (Indonesian), focus-visible ring in white, keyboard: ↑/↓ clips, Space pause, `m` mute, `l` like, `Esc` closes sheets.
- Sheets/dialogs trap focus (shadcn defaults) and restore focus on close.

## Quality gates
- `npm run lint`, `npm run typecheck`, `npm run build` must pass. Add unit tests (Vitest) for: wish selection/throttle/placeholders, count formatting, gate hash, store migrations, `build-media` manifest output.
- Add Playwright smoke tests at 390×844: gate → feed renders → snap one clip → like → comment → repost → finale reachable.
- Never leave `console.log`, unused deps, or TODO placeholders in merged work.

## Git & delivery
- Small, focused commits with conventional messages (`feat(feed): ...`, `fix(wishes): ...`). Do not commit `content/media/` originals or `.env*`; commit the compressed outputs only if the owner asks.
- Deploy to a private/unlisted Vercel project. After deploy, test on a real iPhone and Android over mobile data before the surprise day.
