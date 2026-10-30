---
trigger: always_on
description: Romantic interaction effects and the birthday wish layer. Apply when touching any user action, effect, toast, or finale.
---

# 02 — Interactions & Birthday Wishes (PRD §4.3, §4.3a, §6.3–6.8)

## Rule of two
Every user action produces **(1) its TikTok-accurate behavior + romantic effect** and **(2) one birthday wish** via the wish engine. Never add an action handler without wiring both.

## Wish engine (`lib/wishes.ts`)
- API: `wish(action: WishAction, ctx?: { clipId?: string; n?: number })`. Components never render wish text themselves; they only call `wish()`.
- Throttle: max 1 wish per `minGapMs` (default 4000). One queued wish max; drop older queued ones. Actions during the gap still run their effect.
- Selection: `item.wish` / `special[clipId]` first, else shuffled pool for the action without immediate repeats until the pool is exhausted (persist the pool cursor in the store).
- Placeholders: `{nama}`, `{umur}`, `{hari_bersama}`, `{judul_klip}`, `{n}`. Missing placeholder values must fall back gracefully (never render `{nama}` raw).
- Max 90 characters per wish. Min 5 variants per action in config. Lint/test enforces both.
- Display: `wish-toast` pill (`#1f1f1f`, white 14/20, small cake/heart/candle icon), 16px above bottom nav, in 200ms, hold 2600ms, out 200ms. Toggle in Profile ("Ucapan on/off"); off by default under `prefers-reduced-motion`.
- All `WishAction` values from PRD §8 must be wired: open, gate, like, doubleTap, repost, commentOpen, commentSend, follow, save, share, musicDisc, speedUp, speedDown, pause, mute, unmute, clipAdvance (every 3 clips), inbox, profile, search, create, easterEgg, idle (20s), finale.

## Like
- Icon tap and double-tap both like; only the icon tap can un-like. Count = `baseCounts.likes + (liked ? 1 : 0)`; first-run base is `1` where config says so.
- Special effect (`onLike.effect`) fires once per clip, on first like only: `hearts-rain | confetti | letter-pop | photo-reveal | glitch-heart | sticker-burst | voice-note | milestone`. Each lives in `components/effects/`, renders through a portal layer above the feed, and must clean up listeners/audio on unmount.
- Effects ≤ 3s, no layout shift, ≥ 55 fps on a mid-range phone. Confetti colors: `#fe2c55`, `#25f4ee`, `#ffffff`.

## Repost
- Flight animation: clone clip poster at 40% scale with white border, curve to the Profile nav icon in 600ms with a cyan/magenta glitch trail (two offset copies, 4px), then icon shake + dot badge. Toast "Direpost ke hati kamu". Clip returns to full size in 300ms and keeps playing.
- Persist in `reposts[]`. Unlock the bonus clip when `reposts.length >= unlock.bonusAfterReposts`; show a one-time toast when unlocked.

## Comments
- Pre-seeded comments from config; creator comments carry the "Pembuat" badge. User comment appears instantly; typing indicator 1.2s; then `autoReply` (if any) with a small filled magenta heart. Every auto reply ends with a short prayer/wish line.
- Comments are local-only (`localStorage`); never send them anywhere.

## Follow, Save, Share
- Follow: badge `+` → check → shrink (400ms); adds an Inbox activity "mulai mengikutimu" and a wish.
- Save: bookmark fills white; clip appears in Profile → Tersimpan.
- Share: sheet with WhatsApp deeplink `https://wa.me/<number>?text=<encoded template>`; number and templates come from `content/site.ts`. Never hardcode the number.

## Inbox, Profile, Create, Discover
- Inbox activities and chat are scheduled from config (by action or elapsed time). Chat messages arrive one by one with a typing indicator. Badge counts unread.
- Profile stats: Mengikuti `1`, Pengikut `1`, Suka `∞`; "Hari bersama" and age appear as in PRD §6.9. Tabs: Video, Repost, Suka, Tersimpan read from the store.
- Create (+) opens the "Ajak Kencan" drawer (PRD §6.6). The "Tidak" button dodges the tap up to 6 times, then becomes "Iya deh".
- Discover: typing "kangen", "kita", or "ulang tahun" returns configured clips (e.g. "Kue pertama kita").

## Easter eggs
- Tap wordmark 5× → balloon-heart rain + wish. Tap own avatar 3× → secret message sheet.

## Finale (PRD §4.4, §6.7)
- Triggered after the last clip or from Create after the feed is done. Types: `invite | reveal | letter`. Sequence: dim → candle ritual (age candles, max 5 visual + number) → blow via microphone (`getUserMedia`, ask permission only at this moment) or press-and-hold 2s fallback → candles out one by one with thin smoke → confetti → main wish card typed letter-by-letter → buttons "Balas ke aku" (WhatsApp) and "Putar ulang dari awal".
- If mic permission is denied or unavailable, silently switch to hold-to-blow; never show an error.

## Birthday context
- If device date equals `birthday.date` show "Hari ini hari kamu" banner on Home; otherwise the neutral "Hadiah ulang tahun untukmu". Splash/gate wordmark becomes "ForUs 🎂".
- Keep all birthday visuals inside the palette (magenta/cyan/white): heart balloons, not rainbow confetti.
