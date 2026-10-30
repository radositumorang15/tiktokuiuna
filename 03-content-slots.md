---
trigger: glob
globs: content/**, scripts/**, components/feed/**
description: Content slots for photo carousels and videos, media pipeline, and photo-mode styles. Apply when editing content, media scripts, or feed tiles.
---

# 03 — Content Slots (PRD §6.10, §8)

## Principle
The owner fills slots; code never changes to add media. Components read only from `content/slots.ts` + `content/manifest.json`. Do not import media files directly in components.

## Slot types
| Type | Input | Behavior |
|---|---|---|
| `video` | `video.mp4` (+ optional `poster.webp`) | autoplay, loop, progress bar, double-tap like |
| `photo-carousel` | 3–20 photos | TikTok photo mode: horizontal swipe, `N/M` pill top-right, dots above progress, music disc keeps spinning |
| `photo-slideshow` | 3–20 photos | auto-advance every `secondsPerPhoto` (default 3), press-and-hold pauses, manual swipe allowed, segmented progress |

`photoStyle`: `plain` (280ms slide, `--ease-snap`), `kenburns` (scale 1→1.08 over 6s linear), `polaroid` (white 12px frame, ±3° rotation, top photo flies off on swipe, no shadows), `stack` (cards offset 8px, scale .96 per layer).
Per-photo `caption` shows above the main caption, 14/20, fades 200ms.

## Folder convention
```
content/media/slot-01/ video.mp4 poster.webp
content/media/slot-02/ 01.jpg 02.jpg 03.jpg
content/media/bonus/   video.mp4
content/media/finale/  video.mp4
```
Photo order = filename order unless `slots.ts` provides an explicit array.

## Pipeline: `npm run media` (`scripts/build-media.mjs`)
- Video: ffmpeg → 720×1280 H.264 + AAC, `-crf 26 -preset veryfast`, `-movflags +faststart`, ≤ 8 MB (re-encode with higher CRF until it fits). Poster = WebP frame at 0.5s, ≤ 150 KB.
- Photo: sharp → WebP ≤ 300 KB, 9:16 `cover` crop focused on attention; also emit a 24px blurred LQIP and a blurred full-frame backdrop for landscape sources.
- Write `content/manifest.json` with per-slot `{ type, files[], width, height, duration, blurDataURL }`. Never edit the manifest by hand.
- Fail loudly with a readable message for unsupported formats; skip empty slots with a warning.

## Empty slots
- Dev: render a black placeholder "Slot 04 kosong: taruh foto di content/media/slot-04" with the slot's expected type.
- Production build: skip empty slots entirely; the build must not fail.

## Studio (dev only)
- `app/(dev)/studio` exists only when `NODE_ENV === "development"` (guard in the route and exclude from production build). Features: slot list, drag-and-drop upload, photo reorder, choose `photoStyle` and like effect, 9:16 live preview, write back to `slots.ts`.

## Defaults (12 slots, editable)
01 video · 02 photo-carousel · 03 video · 04 photo-slideshow · 05 video (creator speaks to camera) · 06 photo-carousel (polaroid) · 07 video · 08 photo-carousel · 09 video · 10 photo-slideshow (future) · bonus video (3 reposts) · finale video.

## Rules
- Portrait 3:4 or 9:16 preferred; landscape uses `cover` over its own blurred backdrop (24px blur, 40% darker).
- Only the active ±1 items mount `<video>`; the active one uses `preload="auto"`, the next `metadata`, others none. Every video has a poster.
- Audio: songs must be the owner's own files or title/cover display only; never bundle copyrighted tracks. Video slots use their original audio.
- Privacy: media paths must be unguessable when hosted (random folder names on Vercel Blob / Supabase Storage). Strip EXIF GPS from photos in the pipeline.
