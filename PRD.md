# PRD — "ForUs": Website Kejutan Bergaya TikTok

| | |
|---|---|
| Versi | 1.0 (30 Okt 2026) |
| Owner | Rado |
| Stack | Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui |
| Referensi UI | `DESIGN.md` (token & komponen) |
| Target | Web mobile-first, 1 penerima (pacar), dibuka lewat tautan pribadi |

---

## 1. Ringkasan

Website pribadi yang tampil seperti aplikasi TikTok, tetapi isinya hanya foto dan video kalian berdua. Setiap fitur TikTok (like, repost, komentar, follow, share, inbox, profil) diubah menjadi momen romantis: like memicu efek khusus, repost "mengirim" kenangan ke profilnya, komentar dibalas otomatis dengan pesan dari kamu, dan feed berakhir dengan kejutan utama. Seluruh pengalaman dibingkai sebagai **hadiah ulang tahun**: setiap aksi yang dia lakukan juga memunculkan ucapan ulang tahun personal dari kamu (lihat §4.3a).

**Tujuan emosional:** dia merasa sedang scroll "TikTok kita", tertawa di awal, tersentuh di tengah, dan terkejut di akhir.

## 2. Tujuan & Non-tujuan

**Tujuan**
- G1. UI terasa seperti TikTok asli (snap-scroll vertikal, right rail, bottom nav, music disc).
- G2. Setiap interaksi (like/repost/komentar/follow/share) punya reaksi yang unik dan bermakna.
- G3. Berjalan mulus di HP (iOS Safari & Chrome Android), muat < 3 detik di 4G untuk klip pertama.
- G4. Konten privat: hanya dia yang bisa membuka.
- G5. Kamu bisa menambah/mengganti konten tanpa menyentuh kode komponen (cukup edit file konten).

**Non-tujuan**
- Tidak ada akun, registrasi, atau backend sosial sungguhan.
- Tidak ada upload dari pengguna publik, tidak ada SEO, tidak dipublikasikan sebagai produk.
- Tidak memakai logo/aset resmi TikTok.

## 3. Pengguna & Skenario

- **Penerima (dia):** membuka tautan di HP, memasukkan tanggal jadian, scroll, like, komentar, sampai finale.
- **Kamu (pembuat):** menyiapkan konten, mengatur efek per video, mengetes di HP-nya sebelum hari-H.

Skenario utama: kamu kirim tautan saat momen spesial (mis. anniversary). Dia buka, 5–10 menit menjelajah, lalu mencapai finale dan membalas lewat tombol WhatsApp ke kamu.

## 4. Konsep Kreatif

### 4.1 Nama & identitas
**ForUs** — wordmark putih dengan aberrasi cyan/magenta. Tab: "Mengikuti" | "Untuk Kita". Username dia: `@namanya`, username kamu: `@namakamu`. Bio profil berisi tanggal jadian dan kalimat singkat.

### 4.2 Alur cerita (urutan feed)
Feed disusun sebagai cerita dengan emosi naik:
1. **Klip pembuka (lucu):** momen konyol kalian. Caption: "POV: kamu baru nyadar aku nyimpen ini semua".
2. **Foto carousel pertama bertemu / kencan pertama** (mode foto, musik lagu kalian).
3. **Klip nostalgia** dengan `milestone`: counter hari bersama naik cepat.
4. **Klip kamu bicara ke kamera** (pesan pendek) — like memicu `voice-note` atau `letter-pop`.
5. **Klip "Bonus" tersembunyi** (terbuka setelah 3 repost).
6. **Klip terakhir:** layar hitam + teks "Kamu sudah sampai akhir…" → **Finale**.

### 4.3 Daftar interaksi romantis

| Aksi TikTok | Yang terjadi di ForUs |
|---|---|
| **Double-tap / Like** | Hati besar + efek khusus per video (hearts-rain, confetti, letter-pop, photo-reveal, glitch-heart, sticker-burst, voice-note, milestone). Jumlah like awal selalu `1` ("aku sudah like duluan"); setelah dia like jadi `2`. |
| **Repost** | Klip menyusut dan terbang ke ikon Profil dengan jejak glitch; masuk tab "Repost" di profilnya sebagai "Favorit kita". 3 repost membuka klip Bonus. |
| **Komentar** | Dia bisa mengetik komentar. Setelah "mengetik…" 1,2 detik, balasan terjadwal dari kamu muncul (teks per video). Komentar-komentar kamu sudah ada sebelumnya (berbentuk cerita/inside joke). |
| **Follow (avatar +)** | Animasi centang; toast "Aku sudah ikut kamu dari dulu". Setelah follow, Inbox mendapat notifikasi "mulai mengikutimu". |
| **Simpan (bookmark)** | Klip masuk tab Profil "Tersimpan"; toast kecil. |
| **Bagikan** | Share sheet; tombol WhatsApp membuka pesan ke nomor kamu dengan teks siap kirim ("Aku suka banget yang ini ❤️ [judul klip]"). |
| **Music disc (tap)** | Membuka kartu "Lagu kita" dengan judul, potongan lirik kamu sendiri (bukan lirik berhak cipta), dan tombol putar. |
| **Long-press video** | Menu cepat: "Kecepatan 0.5x/1x/2x", "Tidak tertarik" (lucu: "Mustahil, ini kita"). |
| **Inbox** | Notifikasi bergaya TikTok: "@kamu menyukai fotomu", "@kamu menyebutmu di komentar". Tab Pesan berisi chat terskrip yang muncul bertahap, ditutup dengan "Cek Create ＋". |
| **Create ＋** | Membuka "Ajak Kencan": kartu pertanyaan interaktif (§6.6). |
| **Profil** | Statistik lucu: Mengikuti `1`, Pengikut `1`, Suka `∞`. Tab: Video, Repost, Suka, Tersimpan. |
| **Search / Discover** | Mengetik "kangen" / "kita" menampilkan hasil klip tertentu; hashtag `#kitaberdua`, `#dateterbaik`. |
| **Easter egg** | Tekan wordmark 5x → hujan hati; ketuk foto profil tiga kali → pesan rahasia. |
| **Akhir feed** | Finale (§6.7). |

### 4.3a Lapisan Ucapan Ulang Tahun (Birthday Wish Layer)

**Aturan:** setiap aksi dia memicu efek (lihat §4.3) **dan** satu ucapan ulang tahun singkat dari kamu. Ucapan tampil sebagai `wish-toast`: pill `surface-overlay` di atas bottom nav, ikon kecil (kue / hati / lilin), teks putih `body-sm`, muncul 200ms, bertahan 2,6 detik, hilang 200ms. Ucapan dari ucapan sebelumnya tidak boleh menumpuk.

**Aturan tayang (agar tidak norak dan tidak mengganggu):**
- Maks 1 ucapan per 4 detik; aksi yang datang saat jeda hanya menjalankan efek. Antrian maksimum 1.
- Tiap aksi punya **pool minimal 5 variasi** yang diacak tanpa pengulangan sampai pool habis.
- Panjang ≤ 90 karakter. Placeholder: `{nama}`, `{umur}`, `{hari_bersama}`, `{judul_klip}`.
- Ucapan spesial per klip (`item.wish`) menggantikan pool bila ada.
- Bisa dimatikan lewat tombol kecil di Profil ("Ucapan on/off"), dan nonaktif otomatis bila `prefers-reduced-motion`.

| Aksi | Contoh ucapan (kamu isi sendiri versi aslinya) |
|---|---|
| **Splash / buka tautan** | "Selamat ulang tahun, {nama} 🎂 Ada kejutan kecil di dalam." |
| **Gate benar** | "Ingat tanggalnya ya. Tanggal ini penting. Sama seperti hari ini." |
| **Like (ikon)** | "Like pertama dari kamu, hadiah terbaik buat aku. Happy birthday, {nama} ❤️" |
| **Double-tap** | "Satu tap = satu doa baik untuk umur {umur}-mu." |
| **Efek like khusus** | Ucapan menempel pada efek: surat/voice-note/polaroid memuat kalimat ulang tahun khusus |
| **Repost** | "Kenangan ini milik kita. Semoga tahun ini penuh yang baru." |
| **Komentar (buka sheet)** | "Tulis harapanmu di sini. Aku baca semua." |
| **Komentar (kirim)** | "Aamiin. Aku catat semua harapanmu, {nama}." |
| **Balasan otomatis** | Selalu menyertakan satu doa pendek di akhir balasan |
| **Follow** | "Aku follow kamu seumur hidup. Selamat bertambah umur, sayang." |
| **Simpan** | "Disimpan, seperti kamu di hati aku. Selamat ulang tahun." |
| **Bagikan** | "Bagikan ke aku saja ya. Aku yang pertama mengucapkan." |
| **Music disc** | "Lagu ini buat hari spesialmu." |
| **Long-press / kecepatan** | "Waktu boleh cepat, bahagiamu jangan." (2x) / "Pelan-pelan, nikmati harimu." (0.5x) |
| **Pause / play** | "Berhenti sebentar. Tarik napas. Hari ini harimu." |
| **Mute / unmute** | "Nyalakan suaranya. Ada yang ingin kusampaikan." |
| **Pindah klip (tiap 3 klip)** | "Sudah {n} kenangan. Masih banyak yang akan kita buat di umur {umur}." |
| **Tab Inbox** | "Ada surat ulang tahun menunggumu." |
| **Tab Profil** | "Profilmu: pengikut 1, tapi dia sayang kamu seumur hidup." |
| **Search / Discover** | Hasil pencarian "ulang tahun" membuka klip khusus "Kue pertama kita" |
| **Create ＋** | "Buat satu harapan untuk tahun ini." |
| **Easter egg (wordmark 5x)** | Hujan balon hati + "Kamu menemukannya! Hadiah tambahan: peluk dari aku." |
| **Idle (diam 20 detik)** | "Masih di sana? Aku di sini. Selamat ulang tahun." |
| **Selesai di klip terakhir** | Masuk ke Finale dengan ritual lilin (di bawah) |

**Lapisan visual ulang tahun (tetap dalam palet magenta/cyan/putih):**
- Wordmark di splash/gate berganti "ForUs 🎂" dan badge kecil di top bar: "Hari ini ulang tahun kamu".
- Konfeti & balon berbentuk hati warna `primary`; konfeti `canvas-confetti` dipakai saat milestone (like ke-5, klip ke-5, repost ke-3).
- Counter "hari bersama" dan "umur {umur}" muncul di Profil dan di efek `milestone`.
- Bila tanggal perangkat = tanggal ulang tahun, tampilkan banner "Hari ini hari kamu" di atas feed; jika bukan (dibuka lebih awal/lambat) tampilkan versi netral "Hadiah ulang tahun untukmu".

**Ritual tiup lilin (di Finale):** kue dengan lilin sejumlah `{umur}` (maks 5 lilin visual + angka). Dia diminta membuat permohonan lalu **tiup ke mikrofon** (izin mic diminta saat itu juga) atau **tahan layar 2 detik** sebagai alternatif. Lilin padam satu per satu, asap tipis, konfeti, lalu muncul kartu ucapan utama dan lagu/voice note dari kamu. Setelah itu tombol "Balas ke aku".

**Kartu ucapan utama (Finale):** teks panjang yang diketik huruf demi huruf, berisi doa, kenangan, dan janji tahun depan. Opsional: video ucapan dari kamu (klip terakhir) dan voice note.

### 4.4 Finale
Pilih satu (dikonfigurasi di `content`): (a) ajakan kencan / makan malam dengan tombol "Mau" dan tombol "Tidak" yang lari dari jari, (b) pengungkapan hadiah ("Cek tas di meja kamu" / kode voucher / tiket), (c) surat panjang yang diketik huruf demi huruf, ditutup konfeti. Setelah memilih, muncul tombol "Balas ke aku" (WhatsApp deeplink).

## 5. Ruang Lingkup

### 5.1 Must-have (MVP — rilis kejutan)
- F1 Gate tanggal jadian + splash + unlock audio
- F2 Feed snap-scroll vertikal (video + foto carousel)
- F3 Right rail: avatar+follow, like, komentar, simpan, bagikan, repost, music disc
- F4 Efek like per video (min. 5 tipe)
- F5 Animasi repost ke Profil + tab Repost
- F6 Comment sheet dengan balasan terjadwal
- F7 Profil (statistik, grid, tab)
- F8 Inbox (aktivitas + chat terskrip)
- F9 Create → Ajak Kencan
- F10 Finale + tombol WhatsApp
- F11 Config konten tanpa mengubah komponen
- F12 Privasi: noindex, gate, deploy dengan URL tidak mudah ditebak
- F13 Birthday Wish Layer: ucapan ulang tahun pada semua aksi (pool + antrian + throttle), `wish-toast`, banner hari-H
- F14 Finale ulang tahun: ritual tiup lilin (mic + fallback tahan layar) dan kartu ucapan utama
- F15 Slot konten: slot foto-carousel dan video yang bisa kamu isi sendiri tanpa mengubah kode (§6.10)

### 5.2 Nice-to-have
- Discover/search dengan hasil lucu
- Mode foto dengan kolase animasi
- Statistik hari bersama real-time (hitung dari tanggal)
- Pesan "countdown" ke tanggal spesial
- Mode PWA (add to home screen, ikon sendiri) agar terasa seperti app
- Voice note otomatis saat like

### 5.3 Di luar lingkup (v1)
Login nyata, database sosial, upload dari pengguna, multi-bahasa, analytics.

## 6. Spesifikasi Fitur

### 6.1 Gate
- Input 8 digit `DDMMYYYY`. Validasi sisi klien terhadap hash (SHA-256) tanggal yang disimpan di env, bukan plaintext di bundle.
- Salah: shake 300ms + pesan acak dari daftar lucu ("Bukan, coba inget lagi 🥺"). 5 salah → petunjuk muncul.
- Benar: simpan `unlocked=true` di `localStorage`; lanjut ke Feed. Tap pertama membuat `AudioContext` agar audio boleh jalan.

### 6.2 Feed
- Container `scroll-snap-type: y mandatory`, tiap item `height: 100dvh`.
- Hook `useActiveItem` (IntersectionObserver threshold 0.7) menentukan item aktif; hanya item aktif yang `play()`.
- Preload: item aktif `auto`, item berikutnya `metadata`, sisanya `none`.
- Tap = pause/play. Double-tap = like. Long-press = menu kecepatan.
- Audio: video aktif tidak muted setelah gate; ada ikon speaker kecil untuk mute/unmute global.
- Foto: carousel horizontal, `touch-action: pan-y` pada kontainer, swipe horizontal ganti foto tanpa memindah snap vertikal.
- Progress bar sinkron dengan `currentTime`.
- Resume posisi terakhir (`lastIndex` di `localStorage`).

### 6.3 Right rail & aksi
- State aksi per item disimpan di store (Zustand + `persist` ke `localStorage`): `liked`, `reposted`, `saved`, `followed`, `comments[]`.
- Count tampil = `baseCount` (dari config) + aksi dia.
- Efek like dipilih dari `item.onLike` (lihat §8). Dipicu sekali per item; like ulang hanya animasi hati standar.

### 6.4 Repost
- Hitung posisi ikon Profil di bottom nav (`getBoundingClientRect`) lalu animasikan klon `<div>` berisi poster video dengan `motion` (path kurva) 600ms.
- Setelah animasi: tambah ke `reposts[]`, tampilkan toast, getarkan ikon Profil.
- Unlock klip bonus saat `reposts.length >= unlock.bonusAfterReposts`.

### 6.5 Komentar
- Data komentar awal dari config (dari kamu dan akun fiksi lucu seperti `@satpam_hati`, `@fansberat_kamu` jika kamu mau).
- Komentar dia disimpan lokal. `item.autoReply` (opsional) muncul 1,2 detik kemudian dengan badge "Pembuat".
- Tidak ada data komentar dia yang dikirim ke server.

### 6.6 Create ＋ "Ajak Kencan"
Alur kartu bertingkat (Drawer penuh):
1. "Kamu mau lihat sesuatu?" → [Mau] [Mau banget]
2. Pertanyaan pilihan (makanan favorit / tempat / jam), disimpan lokal.
3. Ringkasan "Jadwal kita" yang bisa dibagikan ke WhatsApp.
Tombol "Tidak" (jika ada) menghindar dari tap dengan `motion` (pindah posisi acak, maks 6 kali lalu berubah jadi "Iya deh").

### 6.7 Finale
Dialog layar penuh pada akhir feed atau ketika dia membuka Create setelah menyelesaikan feed. Menampilkan konten sesuai tipe (`invite | reveal | letter`), konfeti, lalu tombol WhatsApp "Balas ke aku". Ada tombol "Putar ulang dari awal".

### 6.8 Inbox
- Tab Aktivitas: notifikasi dijadwalkan (muncul bertahap berdasarkan aksi dia atau waktu sejak membuka).
- Tab Pesan: satu percakapan terskrip. Pesan masuk satu per satu dengan indikator mengetik.
- Badge angka di bottom nav menghitung notifikasi belum dibaca.

### 6.9 Profil
- Statistik "Suka" menampilkan `∞`; Mengikuti/Pengikut `1`.
- Grid: semua klip (3:4) dengan angka tayang lucu ("1x", "∞x"). Tab Repost/Suka/Tersimpan membaca state lokal.
- Tombol "Edit profil" membuka dialog dengan pesan manis (bukan form sungguhan).

### 6.10 Slot Konten (tempat kamu memasukkan foto & video)

**Ide:** feed disusun dari **slot bernomor**. Tiap slot punya tipe, urutan, dan efek bawaan. Kamu cukup menaruh file ke folder slot dan mengisi caption; tidak perlu menyentuh komponen.

**Tiga tipe slot**
| Tipe | Isi | Perilaku |
|---|---|---|
| `video` | 1 file `.mp4` (+ opsional `poster.webp`) | Autoplay, loop, progress bar, double-tap like |
| `photo-carousel` | 3–20 foto | Mode foto TikTok: swipe horizontal, indikator `1/N` kanan atas, titik indikator, musik latar tetap berputar di music disc |
| `photo-slideshow` | 3–20 foto | Auto-advance tiap 2–4 detik mengikuti lagu, tombol tahan untuk jeda, bisa swipe manual |

**Gaya carousel foto (tren TikTok)** lewat `photoStyle`:
- `plain` — foto penuh layar 9:16, transisi geser.
- `kenburns` — zoom/pan pelan di tiap foto (scale 1→1.08, 6 detik).
- `polaroid` — foto berbingkai putih dengan rotasi kecil, bertumpuk, tiap swipe foto teratas melayang pergi.
- `stack` — tumpukan kartu yang digeser ke samping seperti kartu.
Setiap foto bisa punya caption singkat sendiri (tampil di bawah, `body-sm`) dan teks tanggal/lokasi.

**Struktur folder**
```
content/
  slots.ts                  // daftar slot (urutan + tipe + efek)
  media/
    slot-01/ video.mp4  poster.webp
    slot-02/ 01.jpg 02.jpg 03.jpg ...
    slot-03/ 01.jpg 02.jpg ...
    bonus/   video.mp4
    finale/  video.mp4
scripts/
  build-media.mjs           // kompres + generate manifest
```

**Slot bawaan (default 12, bisa ditambah/dikurangi)**
| Slot | Tipe | Ide isi | Efek like |
|---|---|---|---|
| 01 | video | Momen lucu pembuka | `confetti` |
| 02 | photo-carousel | Kencan/pertemuan pertama | `photo-reveal` |
| 03 | video | Klip nostalgia | `milestone` |
| 04 | photo-slideshow | Kumpulan foto setahun terakhir (selaras lagu) | `hearts-rain` |
| 05 | video | Kamu bicara ke kamera | `voice-note` |
| 06 | photo-carousel | Foto polaroid hal kecil favorit | `sticker-burst` |
| 07 | video | Momen random yang disukai dia | `glitch-heart` |
| 08 | photo-carousel | Trip/jalan-jalan | `letter-pop` |
| 09 | video | Jujur & manis | `confetti` |
| 10 | photo-slideshow | Foto ke masa depan ("kita nanti") | `hearts-rain` |
| Bonus | video | Terbuka setelah 3 repost | `glitch-heart` |
| Finale | video | Ucapan ulang tahun dari kamu | `confetti` |

**Cara mengisi slot (alur kerja kamu)**
1. Taruh file ke `content/media/slot-XX/`.
2. Jalankan `npm run media`. Skrip:
   - mengompres video ke 720×1280 H.264 (CRF 26, `-preset veryfast`), ≤ 8 MB;
   - membuat poster WebP dari detik pertama;
   - mengubah foto ke WebP ≤ 300 KB, memotong/menyesuaikan ke rasio 9:16 (`cover`), menyimpan versi blur kecil (LQIP) untuk placeholder;
   - membaca durasi/ukuran dan menulis `content/manifest.json`.
3. Edit caption, hashtag, lagu, efek like, dan balasan komentar di `content/slots.ts`.
4. `npm run dev` untuk preview; slot yang file-nya belum ada tampil sebagai **placeholder** hitam bertuliskan "Slot 04 kosong: taruh foto di content/media/slot-04" (hanya di mode dev; di produksi slot kosong otomatis dilewati).

**Fitur editor ringan (nice-to-have, mode dev saja):** halaman `/studio` yang hanya aktif di `NODE_ENV=development`: daftar slot, drag-and-drop file ke slot, atur urutan foto, pilih `photoStyle` dan efek like, lihat preview 9:16 langsung, simpan ke `slots.ts`. Tidak dideploy.

**Aturan konten**
- Foto portrait diutamakan (rasio 3:4 atau 9:16). Foto landscape dipasang `cover` dengan latar blur dari foto itu sendiri agar tidak terpotong buruk.
- Video portrait 9:16; video landscape otomatis diberi latar blur (mode "fit") bila `fit: "contain"`.
- Urutan foto bisa diubah lewat nama file (`01`, `02`, …) atau array di `slots.ts`.
- Lagu per slot: file audio sendiri (bukan lagu berhak cipta tanpa izin) atau hanya judul+cover tampilan; slot video memakai audio aslinya.

## 7. Kebutuhan Non-Fungsional

| Area | Target |
|---|---|
| Performa | LCP < 2,5 s; klip pertama mulai < 3 s di 4G; 60 fps animasi di iPhone/Android menengah |
| Ukuran media | Video 720×1280, H.264 (+AAC), ≤ 8 MB/klip (~15–40 s); poster WebP ≤ 150 KB; foto WebP ≤ 300 KB |
| Kompatibilitas | iOS Safari 16+, Chrome Android 110+; desktop = frame HP |
| Aksesibilitas | `prefers-reduced-motion`, kontras AAA, aria-label, target ≥ 44px |
| Privasi | `noindex`, tanpa analytics pihak ketiga, tanpa cookie pelacak, media dengan URL tidak mudah ditebak, gate tanggal |
| Offline | PWA opsional: cache shell + poster; video tetap online |
| Keandalan | Semua efek punya fallback aman; jika video gagal muat tampilkan poster + tombol coba lagi |

## 8. Model Data & Konfigurasi Konten

Konten dalam satu file `content/feed.ts` (diketik `Feed`), supaya kamu cukup mengedit data.

```ts
type LikeEffect =
  | "hearts-rain" | "confetti" | "letter-pop" | "photo-reveal"
  | "glitch-heart" | "sticker-burst" | "voice-note" | "milestone";

type FeedItem = {
  id: string;
  type: "video" | "photo";
  src?: string;              // video mp4
  photos?: { src: string; caption?: string }[]; // untuk type "photo" (carousel)
  photoMode?: "swipe" | "slideshow";  // swipe manual (default) atau auto-advance
  photoStyle?: "plain" | "kenburns" | "polaroid" | "stack"; // gaya tampilan carousel
  secondsPerPhoto?: number;  // untuk slideshow, default 3
  slot?: string;             // id slot di content/slots.ts (lihat §6.10)
  poster: string;
  caption: string;
  hashtags?: string[];
  song: { title: string; artist: string; cover: string; audio?: string };
  baseCounts: { likes: number; comments: number; saves: number; shares: number; reposts: number };
  onLike?: { effect: LikeEffect; payload?: { text?: string; audio?: string; from?: string } };
  comments: { user: string; text: string; creator?: boolean; time: string }[];
  autoReply?: { text: string; delayMs?: number };
  hidden?: boolean;          // klip Bonus
  wish?: string;             // ucapan khusus klip ini (menggantikan pool)
};

type WishAction =
  | "open" | "gate" | "like" | "doubleTap" | "repost" | "commentOpen" | "commentSend"
  | "follow" | "save" | "share" | "musicDisc" | "speedUp" | "speedDown" | "pause"
  | "mute" | "unmute" | "clipAdvance" | "inbox" | "profile" | "search" | "create"
  | "easterEgg" | "idle" | "finale";

type WishConfig = {
  enabled: boolean;
  minGapMs: number;                          // default 4000
  pools: Record<WishAction, string[]>;       // min. 5 variasi per aksi
  special?: Record<string, string>;          // kunci: id klip -> ucapan
};

type SiteConfig = {
  couple: { her: string; me: string; anniversary: string /* ISO */ };
  birthday: { date: string /* ISO */; turning: number; wishes: WishConfig };
  gateHash: string;           // SHA-256 DDMMYYYY
  whatsapp: { number: string; templates: Record<string, string> };
  unlock: { bonusAfterReposts: number };
  finale: { type: "invite" | "reveal" | "letter"; title: string; body: string };
  inbox: { activities: Activity[]; chat: ChatMessage[] };
};
```

State pengguna (`localStorage`, key `forus:v1`): `unlocked`, `lastIndex`, `liked[]`, `reposts[]`, `saves[]`, `followed`, `userComments{}`, `finaleSeen`, `muted`.

## 9. Arsitektur Teknis

**Stack**
- Next.js (App Router), React, TypeScript, Tailwind v4, shadcn/ui (Sheet, Drawer/vaul, Dialog, Sonner)
- `motion` untuk animasi, `canvas-confetti` untuk konfeti, `zustand` (+ persist) untuk state, `lucide-react` untuk ikon (ikon TikTok-like digambar sebagai SVG sendiri)
- Hosting: Vercel. Media: Vercel Blob / Supabase Storage (bucket publik dengan path acak) atau `/public` jika total ukuran kecil.

**Struktur proyek**
```
app/
  layout.tsx            // font sistem, dark only, noindex
  page.tsx              // gate + redirect
  (app)/
    layout.tsx          // top-bar, bottom-nav, mobile frame
    feed/page.tsx
    discover/page.tsx
    inbox/page.tsx
    profile/page.tsx
components/
  feed/ VideoTile, PhotoTile, FeedColumn, RightRail, ActionButton, MusicDisc, CaptionOverlay, ProgressBar
  effects/ HeartBurst, HeartsRain, Confetti, LetterPop, PhotoReveal, GlitchHeart, StickerBurst, VoiceNote, Milestone, RepostFlight
  sheets/ CommentSheet, ShareSheet, InviteDrawer, FinaleDialog
  ui/ (shadcn)
content/ feed.ts, slots.ts, site.ts, manifest.json, media/slot-XX/
scripts/ build-media.mjs   // ffmpeg + sharp, generate manifest
app/(dev)/studio/          // editor slot, hanya development
lib/ store.ts, useActiveItem.ts, whatsapp.ts, hash.ts
public/ icons, manifest.webmanifest
```

**Catatan teknis penting**
- iOS: `muted playsInline` untuk autoplay; suara baru bisa setelah gestur (gate).
- `100dvh` + `env(safe-area-inset-*)`; tambahkan `viewport-fit=cover` dan `theme-color: #000`.
- Gunakan `<link rel="preload">` untuk poster item pertama; lazy mount video di luar ±1 item.
- Hindari re-render feed: efek di layer portal terpisah, state aksi per item di slice store.
- Header respons: `X-Robots-Tag: noindex`; `robots.txt` Disallow semua.
- Hash gate memakai `crypto.subtle.digest` di klien; jangan simpan tanggal plaintext.

## 10. Rencana Pengerjaan

| Fase | Isi | Estimasi |
|---|---|---|
| 0. Persiapan konten | Pilih foto/klip untuk 10–12 slot, taruh di `content/media/`, tulis caption, komentar, balasan, surat | 2–3 hari (paralel) |
| 1. Fondasi | Proyek Next.js, tema/token dari DESIGN.md, top bar, bottom nav, frame desktop | 1 hari |
| 2. Feed | Snap-scroll, VideoTile/PhotoTile, autoplay, progress, right rail statis | 2 hari |
| 3. Interaksi | Like + 5 efek, repost flight, komentar + autoReply, follow, share, engine ucapan (pool, throttle, `wish-toast`) | 4 hari |
| 4. Layar lain | Gate, Inbox, Profil, Discover, Create, Finale | 3 hari |
| 5. Polish | Reduced motion, performa, PWA, tes di iPhone & Android, ubah teks | 2 hari |
| 6. Uji akhir | Latihan penuh dengan kamu sendiri, cek semua efek terpicu, deploy privat | 1 hari |

Total ± 2 minggu santai atau 6–8 hari kerja fokus. Mulai dari fase 0 karena kualitas kejutan ditentukan kontennya.

## 11. Kriteria Penerimaan

- Feed snap satu klip per swipe, autoplay hanya klip aktif, tanpa lag di iPhone & Android menengah.
- Double-tap/like memicu efek yang benar sesuai config, hanya sekali per klip.
- Repost menganimasikan ke ikon Profil dan muncul di tab Repost; klip Bonus terbuka setelah jumlah repost tercapai.
- Komentar dia tersimpan dan balasan terjadwal muncul.
- Gate hanya terbuka dengan tanggal yang benar; tidak ada tanggal plaintext di bundle.
- Finale tampil di akhir feed dan tombol WhatsApp membuka chat ke nomor kamu dengan teks siap kirim.
- Menaruh foto/video ke folder slot lalu menjalankan `npm run media` cukup untuk menampilkannya di feed; slot kosong tampil placeholder di dev dan dilewati di produksi.
- Carousel foto mendukung swipe horizontal, indikator `N/M`, 4 gaya (`plain`, `kenburns`, `polaroid`, `stack`), dan slideshow auto-advance, tanpa memicu snap vertikal.
- Setiap aksi pada tabel §4.3a menampilkan ucapan ulang tahun dari pool-nya, tanpa pengulangan berturut-turut, tidak menumpuk, dan dibatasi 1 ucapan per 4 detik.
- Placeholder `{nama}`, `{umur}`, `{hari_bersama}` terisi benar; ucapan khusus klip menggantikan pool.
- Tiup lilin berfungsi dengan mikrofon dan dengan fallback tahan layar saat izin ditolak.
- `prefers-reduced-motion` menonaktifkan efek berat.
- Halaman tidak terindeks mesin pencari.

## 12. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Autoplay/suara diblokir iOS | Gate memicu gestur; fallback tombol "ketuk untuk suara" |
| Video terlalu berat, lambat di data seluler | Kompres ≤ 8 MB, poster, preload bertahap, tampilkan skeleton hitam |
| Terlalu mirip TikTok (merek) | Nama & wordmark sendiri, tanpa logo/aset resmi, tidak dipublikasikan umum |
| Efek terlalu ramai/menggangu | Satu efek per klip, durasi ≤ 3 detik, bisa dimatikan lewat reduced motion |
| Tautan bocor | Gate tanggal, noindex, path media acak, hapus/matikan deployment setelah momen berlalu |
| Dia tidak sampai finale | Pintasan: Create ＋ dan Inbox memuat petunjuk menuju finale |
| Lupa mengetes di HP-nya | Fase 6 wajib: uji pakai perangkat nyata dan koneksi seluler |

## 13. Pertanyaan Terbuka (isi sebelum build)

1. Jenis finale: ajakan, hadiah, atau surat? Atau kombinasi?
2. Tanggal jadian & nomor WhatsApp kamu untuk gate dan deeplink.
3. Lagu kita (audio tidak boleh diputar lewat file tanpa izin: pakai rekaman suara sendiri/cover, atau tampilkan hanya judul).
4. Jumlah klip & foto final, dan mana yang jadi klip emosional utama.
5. Tampilan nama: pakai nama panggilan atau nama asli di username?
6. Tanggal ulang tahun, umur yang dituju, dan nama panggilan yang dipakai di ucapan.
7. Kamu tulis sendiri semua ucapan (±24 aksi × 5 variasi ≈ 120 kalimat)? Atau saya buatkan draf awal yang kamu edit, dengan gaya bicaramu sehari-hari?
8. Mau ritual tiup lilin pakai mikrofon, atau cukup tahan layar?
