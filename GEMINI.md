# ForUs — Project Rules (Antigravity)

A private birthday-surprise website styled as the TikTok mobile app, for one person (the user's girlfriend). Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui. UI language: Indonesian. Code, comments, identifiers: English.

## Source of truth (read before any UI or feature work)
1. `DESIGN.md` — design tokens, components, motion. **Wins over any personal taste or generic best practice.**
2. `PRD.md` — features, content slots, wish layer, data model, acceptance criteria.
3. `.agent/rules/*.md` — detailed rules (fidelity, interactions, content, engineering).
If two sources conflict: DESIGN.md for visuals, PRD.md for behavior. If still unclear, ask the user; do not invent.

## Prime directive
The result must look and feel like the real TikTok mobile app, not "inspired by TikTok". When unsure how something looks or behaves, do what the real TikTok mobile app does, within the tokens in DESIGN.md. Never substitute a generic card/feed/Instagram-like layout.

## Non-negotiables (never violate)
- Page background is pure `#000000`. Video tiles: 0 padding, 0 radius, full-bleed, 9:16, one clip per viewport, `scroll-snap` vertical.
- Only two brand colors: magenta `#fe2c55` (actions, liked heart, badges, CTA) and cyan `#25f4ee` (wordmark/glitch aberration ONLY). No third accent color. No gradients on UI chrome.
- System font stack only. Max weight 600.
- No box-shadows on cards/sheets (tonal lift + hairlines only). The single exception: a soft `drop-shadow` on rail icons over video.
- Mobile-first at 390×844. Desktop shows a centered 9:16 phone-frame on black.
- Do not use TikTok's logo, name, or official assets. App name is "ForUs"; wordmark is our own text with cyan/magenta offset layers.
- Every action the user can take shows its effect AND a birthday wish (see `.agent/rules/02-interactions-and-wishes.md`).
- All media comes from content slots (`content/slots.ts` + `content/media/slot-XX/`). Never hardcode media in components.
- Respect `prefers-reduced-motion`. iOS autoplay requires `muted` + `playsInline`.

## Stack & commands
- `npm run dev` — dev server (enables `/studio` and empty-slot placeholders)
- `npm run media` — compress/convert media and write `content/manifest.json`
- `npm run lint`, `npm run typecheck`, `npm run build` — must pass before a task is called done
- Libraries: `motion` (animation), `canvas-confetti`, `zustand` + `persist` (state), `vaul` via shadcn Drawer, `sonner` toasts, `lucide-react` only for non-rail UI icons.

## Workflow for every task
1. Re-read the relevant DESIGN.md / PRD.md section; quote the section number in your plan.
2. Plan first (short): files to touch, components to create, how it will be verified.
3. Implement in small steps. Reuse existing components; do not duplicate tokens.
4. Verify in the browser (see `01-tiktok-ui-fidelity.md` §Verification) with screenshots at 390×844, 430×932, and 1440×900. Attach screenshots in the walkthrough artifact.
5. Report what changed, what was verified, and any deviation from DESIGN.md/PRD.md with a reason.

## Definition of done
- Matches the fidelity checklist; no console errors; lint/typecheck/build pass.
- Works on touch (tap, double-tap, long-press, swipe) and with keyboard (arrow up/down changes clip, space pauses, `m` mutes, `l` likes).
- Acceptance criteria in PRD §11 that relate to the task are satisfied.
