# tiktokuiuna

Website kejutan ulang tahun romantis bergaya aplikasi TikTok untuk Una (**ForUs**), dibangun menggunakan Next.js 15 App Router, TypeScript, Tailwind CSS v4, Motion, dan Zustand.

## Fitur Utama

- **TikTok UI Fidelity**: Layout vertikal snap-scroll 9:16 full-bleed, pure black `#000000`, right rail (avatar, like, komentar, bookmark, bagikan, repost, music disc berputar).
- **Birthday Wish Layer**: Engine ucapan 24 aksi dengan throttle 4 detik dan pool rotasi tanpa repetisi berulang.
- **Efek Like Spesial**: Hearts rain, canvas confetti, letter pop, photo reveal, glitch heart, sticker burst, voice note, dan milestone counter hari bersama.
- **Finale**: Ritual tiup lilin interaktif via mikrofon atau tahan 2 detik, konfeti, kartu surat efek ketik, dan tombol balasan WhatsApp.
- **Content Slots & Studio**: 12 slot konten default (video & foto carousel/slideshow dengan 4 variasi gaya) dan halaman `/studio` untuk manajemen slot.
- **Privasi**: Gate tanggal jadian dengan validasi hash SHA-256 di sisi klien (tanpa tanggal plaintext di bundle) serta header `noindex, nofollow`.

## Panduan Perintah

```bash
# Menjalankan dev server
npm run dev

# Kompresi media & generate manifest
npm run media

# Pengujian unit
npm run test

# Linting & Type checking
npm run lint
npm run typecheck

# Production build
npm run build
```

