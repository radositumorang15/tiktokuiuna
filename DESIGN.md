# DESIGN.md — "ForUs" (TikTok-style Romantic Surprise Site)

Design system untuk website kejutan bergaya aplikasi TikTok, dibangun dengan Next.js + Tailwind + shadcn/ui.
Token warna, tipografi, radius, spacing, dan daftar komponen mengacu ke https://www.shadcn.io/design/tiktok (diperbarui 19 Mei 2026). Bagian mobile (right rail 48px, bottom nav, progress bar, comment sheet) ditambahkan dari pola UI aplikasi TikTok mobile, karena referensi hanya menangkap versi desktop web.

> Platform utama: **mobile portrait (pacar membuka dari HP)**. Desktop = frame HP 9:16 di tengah layar hitam.

---

## 1. Prinsip

1. **Video adalah kanvas.** Satu kolom 9:16 full-bleed, tanpa padding, tanpa radius pada tile video.
2. **Hitam murni `#000000`.** Jangan pakai near-black kebiruan sebagai lantai halaman.
3. **Chrome melayang di atas video.** Teks putih, tanpa band/surface sendiri, kecuali top bar dan bottom nav.
4. **Magenta = aksi.** Cyan hanya untuk efek aberrasi kromatik (wordmark, glitch). Jangan tambah warna aksen ketiga.
5. **Font sistem.** Tidak ada font custom untuk chrome.
6. **Tanpa shadow.** Hierarki lewat tonal lift (`surface-overlay`) dan hairline.

---

## 2. Design Tokens

### 2.1 Warna

| Token | Hex | Pemakaian |
|---|---|---|
| `canvas` | `#000000` | Lantai halaman, top bar, bottom nav, di belakang video |
| `surface-1` | `#161823` | Sheet modal, kartu grup di Inbox/Profile |
| `surface-overlay` | `#1f1f1f` | Search pill, tab background, comment sheet, input |
| `ink` | `#ffffff` | Teks utama, ikon, wordmark |
| `ink-mute` | `#a8a8a8` | Tab nonaktif, timestamp, hashtag metadata |
| `ink-soft` | `#737373` | Disabled, fine print |
| `hairline` | `#3a3a3a` | Divider, border atas bottom nav |
| `hairline-soft` | `#4a4a4a` | Outline tombol sekunder, border input |
| `primary` | `#fe2c55` | CTA, ikon hati aktif, badge, progress aktif |
| `primary-cyan` | `#25f4ee` | **Hanya** offset aberrasi wordmark & glitch |
| `on-primary` | `#ffffff` | Teks di atas `primary` |

Turunan yang diizinkan (bukan warna baru, hanya alpha):
- `scrim-top`: gradien `rgba(0,0,0,.45) → transparent`, tinggi 120px, di bawah top bar agar tab terbaca.
- `scrim-bottom`: gradien `transparent → rgba(0,0,0,.6)`, tinggi 240px, di bawah caption.
- Partikel hati: `#fe2c55` pada opacity 1 / .7 / .4. Konfeti: `#fe2c55`, `#25f4ee`, `#ffffff`.

### 2.2 Tipografi

Stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`. Fallback render non-sistem: Inter.

| Token | Size / Line | Weight | Pemakaian |
|---|---|---|---|
| `display-lg` | 24 / 32 | 600 | Wordmark, judul gate |
| `display-md` | 18 / 24 | 600 | Judul sheet |
| `heading-md` | 16 / 22 | 600 | Tab "Untuk Kita", username |
| `body-md` | 15 / 22 | 400 | Caption, komentar |
| `body-strong` | 15 / 22 | 600 | Mention, emphasis |
| `body-sm` | 14 / 20 | 400 | Sub-label |
| `caption` | 13 / 18 | 500 | Count di right rail |
| `caption-soft` | 12 / 16 | 400 | Label bottom nav, metadata |
| `button-md` | 16 / 24 | 600 | Label tombol |

Berat maksimum 600. Tidak ada ukuran di atas 24px kecuali kartu "finale" (boleh 32/40).

### 2.3 Radius

`none 0` (top bar, bottom nav, video) · `sm 4` (tombol CTA, input) · `md 8` (tap target rail) · `lg 12` (kartu di sheet) · `full 9999` (search pill, avatar, music disc, chip).
Video tidak pernah dibulatkan. Avatar selalu bulat penuh.

### 2.4 Spacing

`xs 4 · sm 8 · base 12 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64`. Base unit = 12.

### 2.5 CSS variables (siap tempel ke `globals.css`, Tailwind v4)

```css
@theme inline {
  --color-canvas: #000000;
  --color-surface-1: #161823;
  --color-surface-overlay: #1f1f1f;
  --color-ink: #ffffff;
  --color-ink-mute: #a8a8a8;
  --color-ink-soft: #737373;
  --color-hairline: #3a3a3a;
  --color-hairline-soft: #4a4a4a;
  --color-primary: #fe2c55;
  --color-primary-cyan: #25f4ee;
  --color-on-primary: #ffffff;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-snap: cubic-bezier(0.32, 0.72, 0, 1);
}

html, body { background: #000; color: #fff; font-family: var(--font-sans); }
body { overscroll-behavior: none; -webkit-tap-highlight-color: transparent; }
```

shadcn/ui: set theme ke dark-only, `--background: #000`, `--foreground: #fff`, `--primary: #fe2c55`, `--primary-foreground: #fff`, `--card: #161823`, `--popover: #1f1f1f`, `--border: #3a3a3a`, `--input: #4a4a4a`, `--radius: 8px`. Pakai Sheet (comment & share), Dialog (finale), Drawer (vaul) untuk bottom sheet, Sonner untuk toast.

---

## 3. Layout

### 3.1 Mobile (≤ 480px) — default

```
┌───────────────────────────┐ 100dvh
│ top-bar (absolute, 52px + safe-area-top)
│   [LIVE-dot]  Mengikuti | Untuk Kita  [search]
│                           │
│                           │
│        VIDEO / FOTO       │
│        9:16 full-bleed    │
│                       ┌──┐│
│                       │av││ right-rail
│                       │♥ ││ x = right 12px
│                       │💬││ bottom = 96px + safe-area
│                       │🔖││
│                       │↗ ││
│                       │🔁││ (repost)
│ @username             │💿││
│ caption #hashtag      └──┘│
│ ♪ Judul lagu — Artis      │
│ ━━━━━━━ progress ━━━━━━━━ │ 2px, tepat di atas bottom nav
├───────────────────────────┤
│ Home Teman  [＋]  Inbox Profil │ bottom-nav 56px + safe-area-bottom
└───────────────────────────┘
```

- Tinggi feed: `100dvh`. Satu tile = satu viewport. `scroll-snap-type: y mandatory; scroll-snap-stop: always`.
- Top bar: transparan di atas video (`scrim-top`), bukan band hitam. Di halaman Inbox/Profile/Discover berubah jadi solid `canvas` + hairline bawah.
- Padding horizontal caption: 12px kiri; lebar maksimum caption `calc(100% - 12px - 72px)` agar tidak menabrak rail.

### 3.2 Desktop (> 480px)

Tile video dikunci 9:16: `height: min(100dvh, 960px); aspect-ratio: 9/16`, ditengah, background `#000`. Right rail pindah ke luar kanan tile (lebar 72px, sejajar bawah). Opsional di kiri tile: panel sempit berisi wordmark + teks "Buka di HP untuk pengalaman terbaik". Tidak ada layout grid pada feed.

### 3.3 Dimensi komponen

| Elemen | Ukuran |
|---|---|
| Top bar | 52px (+ safe area), padding horizontal 16 |
| Bottom nav | 56px (+ safe area), 5 sel rata, border-top 1px `hairline` |
| Right rail icon | 32px ikon dalam tap target 48px, jarak antar item 16px |
| Avatar rail | 48px, border 1.5px putih, badge "+" 20px `primary` di tengah bawah (overlap -10px) |
| Music disc | 40px, rotasi, ikon cover 24px di tengah |
| Progress bar | tinggi 2px (naik ke 6px saat ditekan/scrub), track `rgba(255,255,255,.3)`, fill `ink` |
| Comment sheet | tinggi 70dvh, radius atas 12px, handle 36×4 |
| Tombol Create `＋` | 44×30px, radius 8, putih; tepi kiri offset cyan 3px, tepi kanan offset magenta 3px |

---

## 4. Komponen

Nama mengikuti 14 komponen referensi, ditambah komponen mobile.

**`video-tile`** — `<video>` `object-fit: cover`, `muted playsInline loop`, `poster` wajib. Fill `canvas`. Tanpa padding/radius. Autoplay saat ≥ 70% terlihat (IntersectionObserver), pause di luar itu. Tap 1x = pause/play (ikon play besar 72px putih opacity .8 muncul 300ms). Tap 2x cepat (<250ms) = like (lihat §5.1).

**`photo-tile`** — Mode foto TikTok: carousel horizontal untuk beberapa foto, musik latar tetap berputar. Swipe horizontal tidak boleh memicu snap vertikal (`touch-action: pan-y` pada kontainer, `overscroll-behavior-x: contain`).
- Indikator: pill `1/N` di kanan atas (`surface-overlay` alpha .6, radius penuh, `caption-soft`), plus titik 6px di tengah bawah di atas progress (aktif `ink`, lain `ink` alpha .35).
- Gaya (`photoStyle`): `plain` (geser 280ms `--ease-snap`), `kenburns` (scale 1→1.08 selama 6s linear), `polaroid` (bingkai putih 12px, bayangan tidak dipakai, rotasi ±3°, foto teratas melayang keluar saat di-swipe), `stack` (kartu bertumpuk, offset 8px, scale .96 per lapis).
- Foto landscape: `object-fit: cover` dengan latar foto yang sama di-blur 24px dan digelapkan 40%.
- Mode `slideshow`: auto-advance tiap `secondsPerPhoto`, segmen progress per foto di atas bottom nav, tahan layar = jeda.
- Caption per foto tampil di atas `caption-overlay`, `body-sm`, fade 200ms saat ganti foto.

**`feed-column`** — Container snap-scroll vertikal.

**`top-bar`** — Tab tengah: `tab-inactive` "Mengikuti", `tab-active` "Untuk Kita" (underline 2px putih, lebar 24px, di bawah label, jarak 6px). Kiri: titik LIVE merah kecil (dekoratif). Kanan: ikon search 24px.

**`tab-active` / `tab-inactive`** — `heading-md`; aktif `ink` + underline, nonaktif `ink-mute`.

**`right-rail`** — Transparan, kolom vertikal rata tengah. Urutan atas→bawah: `avatar-circle` (+ badge), `action-button` Like, Komentar, Simpan (bookmark), Bagikan, Repost, lalu `music-disc`.

**`action-button`** — Ikon putih 32px, count di bawahnya `caption` (13/18/500), tanpa background. Ikon punya `drop-shadow(0 1px 2px rgba(0,0,0,.35))` agar terbaca di video terang (satu-satunya pengecualian aturan "tanpa shadow"). State aktif Like: hati terisi `primary`. State aktif Repost: ikon `primary`. State aktif Simpan: bintang/bookmark kuning **tidak dipakai** — pakai `ink` terisi (hindari warna ketiga).

**`avatar-circle`** — 48px, border putih 1.5px. Badge `+` hilang setelah "follow" (animasi §5.5).

**`music-disc`** — Lingkaran 40px, gradien radial `#161823→#000`, ring tipis `hairline`, cover foto di tengah. `animation: spin 6s linear infinite`; berhenti saat video pause.

**`caption-overlay`** — Kiri bawah. Baris 1: `@username` `body-strong`. Baris 2: deskripsi `body-md`, maks 2 baris lalu "selengkapnya" (`ink-mute`). Baris 3: ikon not ♪ + judul lagu berjalan (marquee 12s linear infinite) `body-sm`.

**`progress-bar`** — Garis tipis di atas bottom nav. Fill `ink`, bergerak sesuai `currentTime/duration`. Untuk foto: segmen per foto.

**`bottom-nav`** — 5 sel: Home, Teman (ikon dua orang → "Kita"), Create `＋`, Inbox (badge merah `primary` bulat 16px dengan angka), Profil. Label `caption-soft` (12/16). Aktif = `ink` + ikon terisi; nonaktif = `ink-mute`. Di Home bagian bawah transparan di atas video; di halaman lain solid `canvas`.

**`create-button`** — Tombol putih tengah dengan offset cyan (kiri) dan magenta (kanan) 3px, ikon `+` hitam. Di app ini membuka "Buat kenangan baru" (lihat PRD: Ajakan/Surat Cinta).

**`wordmark`** — Teks "ForUs" `display-lg` putih. Layer belakang: salinan cyan digeser `translate(-1.5px, -1px)`, salinan magenta `translate(1.5px, 1px)`. Animasi glitch sesekali (§5.7). Dipakai di splash, gate, halaman Discover. **Tidak** memakai logo TikTok asli; ini wordmark sendiri.

**`button-primary`** — Fill `primary`, teks `on-primary` `button-md`, radius 4, tinggi 44, padding 8×16. **`button-secondary`** — transparan, outline 1px `hairline-soft`, teks putih.

**`search-pill`** — `surface-overlay`, radius penuh, tinggi 44, placeholder `ink-mute`.

**`comment-sheet`** — `surface-overlay`, handle di atas, header "N komentar" `display-md` center, daftar komentar (avatar 36px, username `caption` `ink-mute`, isi `body-md`, aksi "Balas" `caption-soft`, hati kecil di kanan), input melayang di bawah dengan avatar + field pill + ikon kirim `primary`. Komentar dari "aku" diberi badge "Pembuat" (outline `primary`, `caption-soft`).

**`share-sheet`** — Drawer bawah: baris avatar "Kirim ke" (Aku, Kita), baris aksi (Salin tautan, WhatsApp, Simpan ke galeri). Item bulat 56px, label `caption-soft`.

**`inbox-row`** — Avatar 48, judul `body-strong`, sub `body-sm` `ink-mute`, waktu `caption-soft` kanan, divider `hairline`.

**`chat-bubble`** — Masuk: `surface-overlay`, radius 16 (sudut kiri bawah 4). Keluar: `primary`, teks putih, sudut kanan bawah 4.

**`profile-header`** — Avatar 96px tengah, `@username` `heading-md`, tiga statistik (Mengikuti · Pengikut · Suka) angka `display-md` + label `caption-soft`, tombol "Edit profil" secondary, bio `body-sm`, tab ikon (grid / repost / hati / kunci) dengan underline putih. Grid 3 kolom rasio 3:4, jarak 1px `canvas`, count tayang di kiri bawah tiap sel `caption`.

**`toast`** — Pill `surface-overlay`, teks putih `body-sm`, muncul di atas bottom nav 16px, 2,2 detik.

---

## 5. Motion — lapisan romantis

Semua animasi menghormati `prefers-reduced-motion` (ganti dengan fade 150ms). Library: `motion` (Framer Motion) + `canvas-confetti`.

### 5.1 Like (hati)
- **Tap ikon:** scale 1 → 1.35 → 1 (spring, stiffness 500, damping 14, ±320ms). Warna putih → `primary`. 8 partikel hati mini keluar radial 24px, fade 500ms. Count +1.
- **Double-tap di video:** hati besar 96px `primary` muncul di titik tap, rotasi acak ±15°, scale 0→1.2→1, lalu naik 60px & fade 800ms. Beberapa tap cepat = beberapa hati. Haptic `navigator.vibrate(10)` bila tersedia.
- **Un-like:** ikon kembali putih, tanpa partikel.

### 5.2 Efek khusus saat Like (per-video, `onLike` di config)
Setiap klip bisa punya reaksi sendiri, dipicu **sekali** saat like pertama:
| Reaksi | Visual |
|---|---|
| `hearts-rain` | Hujan hati 3 detik dari atas, ukuran acak, kecepatan acak |
| `confetti` | `canvas-confetti` dari dua sudut bawah, warna magenta/cyan/putih |
| `letter-pop` | Amplop muncul dari ikon hati, terbuka, kartu teks surat pendek (sheet kecil) |
| `photo-reveal` | Video blur 12px → fokus tajam 600ms + foto polaroid jatuh dengan rotasi kecil |
| `glitch-heart` | Hati besar dengan aberrasi cyan/magenta berkedip 3x lalu stabil |
| `sticker-burst` | Stiker teks ("Kangen", "Sayang") melompat dan menempel di video |
| `voice-note` | Pemutar pesan suara mini muncul di bawah caption dan otomatis play |
| `milestone` | Counter "hari bersama" berhitung naik cepat sampai angka sebenarnya |

### 5.3 Repost
- **Tap ikon repost:** ikon berputar 360° (400ms, `ease-snap`), jadi `primary`. Klip menyusut jadi kartu 40% dengan tepi putih, **terbang** ke ikon Profil di bottom nav sepanjang kurva (600ms), meninggalkan jejak glitch cyan/magenta (2 salinan offset 4px yang menyusul). Ikon Profil bergetar kecil + badge titik `primary`. Toast: "Direpost ke hati kamu".
- Klip kembali ke ukuran penuh (300ms) dan lanjut diputar.
- Tab "Repost" di Profil menyimpan klip itu. Setelah N repost (config), muncul klip tersembunyi "Bonus" di feed.

### 5.4 Komentar
- Buka sheet: slide-up 320ms `ease-snap`, latar video redup ke `rgba(0,0,0,.4)`.
- Kirim komentar: muncul di atas daftar dengan fade+slide 200ms. Lalu indikator "mengetik…" (3 titik) 1,2 detik, lalu balasan terjadwal dari "aku" masuk dengan hati kecil `primary` terisi.

### 5.5 Follow (avatar `+`)
Badge `+` berputar jadi centang putih di lingkaran `primary`, mengecil lalu hilang (400ms); avatar membesar 1.1x sebentar. Toast: "Sekarang kamu mengikuti aku. Aku sudah ikut kamu dari dulu."

### 5.6 Pergantian klip
Snap vertikal bawaan; klip baru fade-in 150ms dari hitam. Wordmark/UI tidak ikut bergerak. Saat melewati klip tertentu, shake 2 frame glitch (translate RGB split 3px) 120ms.

### 5.7 Wordmark glitch
Setiap 6–10 detik acak: layer cyan & magenta berayun `±3px` dalam 120ms, lalu kembali ke `±1.5px`.

### 5.8 Easing & durasi baku
Masuk: 200–320ms `--ease-snap`. Keluar: 150–200ms. Spring untuk ikon: `stiffness 500, damping 14`. Partikel: 500–1000ms `--ease-out-expo`.

---

## 6. Layar

1. **Splash** — hitam, wordmark glitch 1,2 detik. Menyalakan audio context pada tap pertama.
2. **Gate** — "Masukkan tanggal jadian kita" (input angka DDMMYYYY, 8 kotak). Salah: shake + pesan lucu. Benar: wordmark berubah jadi tombol "Mulai".
3. **Home / Feed** — §3.1.
4. **Teman ("Kita")** — Daftar "Hal yang kita lakukan bareng" berformat kartu story vertikal; opsional.
5. **Discover** — Search pill, chip hashtag (#kitaberdua, #dateterbaik), grid tren "Tempat kita".
6. **Create ＋** — Ajakan interaktif / Surat cinta (PRD §6.6).
7. **Inbox** — Aktivitas (Aku menyukai fotomu, Aku mulai mengikutimu) dan Pesan (chat terskrip).
8. **Profil** — §4 `profile-header`.
9. **Finale** — Layar akhir feed, kartu putih/hitam dengan kejutan utama.

---

## 7. Aksesibilitas & performa

- Kontras: putih di atas `canvas` lolos AAA. Teks di atas video wajib punya `scrim-bottom`.
- Tap target ≥ 44px. Semua ikon punya `aria-label`. Video punya caption teks alternatif.
- iOS: video harus `muted` + `playsInline`; audio hanya aktif setelah gestur pertama (gate).
- Poster wajib; preload video berikutnya `preload="metadata"`, video aktif `auto`.
- Gunakan `100dvh` dan `env(safe-area-inset-*)` (notch iPhone).
- Mematikan efek berat jika `prefers-reduced-motion` atau FPS rendah.

---

## 8. Do & Don't

**Do:** pertahankan canvas `#000`; cyan hanya di aberrasi; magenta hanya untuk aksi/hati; tile video 0 padding & 0 radius; satu kolom 9:16 snap.
**Don't:** tambah warna aksen ketiga (hijau, kuning, ungu); gunakan grid thumbnail di Home; beri shadow pada kartu; pakai logo/aset resmi TikTok; bulatkan sudut video.

> Catatan: ini tiruan gaya UI untuk hadiah pribadi, bukan produk TikTok. Pakai nama sendiri ("ForUs"), wordmark sendiri, dan jangan publikasikan sebagai layanan umum.
