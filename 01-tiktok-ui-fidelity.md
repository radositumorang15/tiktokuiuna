---
trigger: always_on
description: Pixel-level TikTok mobile UI fidelity rules for ForUs. Apply to every UI change.
---

# 01 — TikTok UI Fidelity

Goal: someone who uses TikTok daily should think "this is TikTok" within one second. Values below come from DESIGN.md; follow them exactly.

## Screen anatomy (Home, 390×844 reference)
- Feed container `height: 100dvh`, `scroll-snap-type: y mandatory`, each item `scroll-snap-align: start; scroll-snap-stop: always`. No margins, no gaps, no rounded corners.
- **Top bar** (absolute over video, 52px + `env(safe-area-inset-top)`, horizontal padding 16): left = small red LIVE dot icon (decorative), center = tabs `Mengikuti` (inactive, `#a8a8a8`) and `Untuk Kita` (active, white, 2px white underline 24px wide, 6px below label), right = search icon 24px. Font 16/22/600. Gradient scrim `rgba(0,0,0,.45)→transparent` 120px high. Tab gap 24px.
- **Right rail** (absolute; right 12px; bottom `96px + safe-area`), items centered, stacked with 16px gap, in this order: creator avatar (48px, 1.5px white border, magenta `+` badge 20px overlapping bottom by 10px) → Like (heart) → Comment (bubble with three dots) → Save (bookmark) → Share (curved arrow) → Repost (two arrows) → Music disc (40px, spinning). Each action: 32px icon in 48px target, count below in 13/18/500 white.
- **Caption block** (left 12px; bottom `72px + safe-area`; max width `calc(100% - 12px - 72px)`): line 1 `@username` 15/22/600; line 2 description 15/22/400, clamp 2 lines then `selengkapnya` in `#a8a8a8`; hashtags are white 600; line 3 music row: ♪ icon + marquee song title (12s linear loop) 14/20. Bottom scrim `transparent→rgba(0,0,0,.6)` 240px.
- **Progress bar**: 2px high directly above bottom nav, track `rgba(255,255,255,.3)`, fill white. Grows to 6px while pressed (scrubbing). For photo posts: segmented per photo.
- **Bottom nav** (56px + safe-area, 1px `#3a3a3a` top border; on Home the background is transparent over video with scrim, on other pages solid `#000`): Home, Teman, Create (+), Inbox, Profil. Labels 12/16, active white + filled icon, inactive `#a8a8a8`. Inbox shows magenta badge (16px circle, white 11px number). Create button: white rounded-8 rect 44×30 with 3px cyan offset on the left edge and 3px magenta offset on the right edge, black `+`.

## Icons (critical for looking authentic)
- Rail icons are **custom filled SVGs** (TikTok style: solid, chunky), not lucide outlines. Create them in `components/icons/` with `viewBox="0 0 48 48"` and `fill="currentColor"`. Liked heart fills `#fe2c55`; unlike returns to white.
- Bottom-nav icons: filled when active, outlined when inactive. Search, close, chevrons may use lucide.
- Count formatting: `<1000` plain, `1.2K`, `12.4K`, `1.1M`; special values `∞` and `1` are allowed from content config.

## Behaviors that must match the real app
- Tap video: toggle play/pause; show a 72px white play icon at 80% opacity for 300ms when pausing.
- Double-tap anywhere on video: like at the tap position (big heart 96px, random ±15° rotation, rise 60px, fade 800ms). Multiple quick taps spawn multiple hearts. Never un-like on double-tap.
- Long-press (≥350ms): sheet with speed (0.5×/1×/2×) and "Tidak tertarik".
- Swipe up/down: snap exactly one item; next item fades in over 150ms from black. Horizontal swipe on photo posts must not move the vertical feed.
- Music disc spins 6s linear infinite and stops when paused.
- Comment sheet: slides up 320ms to 70dvh, video dims, drag handle 36×4, header `N komentar` centered, comment rows (avatar 36, username 13 `#a8a8a8`, text 15, `Balas` 12, tiny heart right), pinned input row at bottom with avatar, pill field, send icon in magenta.
- Share sheet: bottom drawer with "Kirim ke" avatar row (56px circles), then action row (Salin tautan, WhatsApp, Simpan ke galeri).
- Follow: tap avatar badge → badge morphs to check, shrinks away; avatar scales 1.1 briefly.
- Profile: centered 96px avatar, `@username`, three stats (Mengikuti · Pengikut · Suka), `Edit profil` secondary button, bio, icon tabs (grid, repost, liked, locked) with underline, 3-column grid at ratio 3:4 with 1px gaps and view counts bottom-left.
- Inbox: header "Kotak masuk", activity rows (avatar, bold title, gray sub, time right), separate Messages thread with bubbles (incoming `#1f1f1f`, outgoing `#fe2c55`).
- Discover: pill search, hashtag chips, 2-column staggered results only here (never on Home).

## Forbidden (instant fidelity failure)
- Card-style feeds, thumbnail grids on Home, rounded video corners, drop shadows on cards.
- Navbar/sidebars from a generic dashboard, Material/Ant look, default shadcn light styling, gradients on buttons, a third accent color.
- Bottom-nav label colors other than white or `#a8a8a8`. Cyan on any CTA or hover state.
- Layout shifts during scroll; video letterboxing on mobile (use `object-fit: cover` unless the slot says `fit: "contain"`, then blurred backdrop).

## Verification (use the Antigravity browser agent; do not skip)
For any UI change:
1. Open the dev server at 390×844 (iPhone 14), 430×932, and 1440×900. Take a screenshot of each; attach them to the walkthrough.
2. Check this list and report pass/fail for each item:
   - [ ] Pure black background, no near-black
   - [ ] Top bar tabs, search icon, scrim correct
   - [ ] Rail order, sizes, spacing (16px), counts under icons
   - [ ] Caption block position, 2-line clamp, marquee
   - [ ] Progress bar 2px above bottom nav
   - [ ] Bottom nav labels/badge/Create button offsets
   - [ ] Snap scroll advances exactly one clip
   - [ ] Double-tap heart, like toggle, spinning disc
   - [ ] Safe-area padding present (`viewport-fit=cover`)
   - [ ] Reduced-motion variant works
3. Compare against DESIGN.md numbers using DevTools (computed style) when something looks off by eye.
