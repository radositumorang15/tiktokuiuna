export type LikeEffect =
  | "hearts-rain"
  | "confetti"
  | "letter-pop"
  | "photo-reveal"
  | "glitch-heart"
  | "sticker-burst"
  | "voice-note"
  | "milestone";

export type WishAction =
  | "open"
  | "gate"
  | "like"
  | "doubleTap"
  | "repost"
  | "commentOpen"
  | "commentSend"
  | "follow"
  | "save"
  | "share"
  | "musicDisc"
  | "speedUp"
  | "speedDown"
  | "pause"
  | "mute"
  | "unmute"
  | "clipAdvance"
  | "inbox"
  | "profile"
  | "search"
  | "create"
  | "easterEgg"
  | "idle"
  | "finale";

export type WishConfig = {
  enabled: boolean;
  minGapMs: number;
  pools: Record<WishAction, string[]>;
  special?: Record<string, string>;
};

export type Activity = {
  id: string;
  avatar: string;
  title: string;
  subtitle: string;
  time: string;
};

export type ChatMessage = {
  id: string;
  sender: "her" | "me";
  text: string;
  time: string;
};

export type SiteConfig = {
  couple: {
    her: string;
    me: string;
    herUsername: string;
    myUsername: string;
    anniversary: string; // ISO date format YYYY-MM-DD
  };
  birthday: {
    date: string; // ISO date format YYYY-MM-DD
    turning: number;
    wishes: WishConfig;
  };
  gateHash: string; // SHA-256 of DDMMYYYY (e.g. 12042023)
  whatsapp: {
    number: string;
    templates: Record<string, string>;
  };
  unlock: {
    bonusAfterReposts: number;
  };
  finale: {
    type: "invite" | "reveal" | "letter";
    title: string;
    body: string;
  };
  inbox: {
    activities: Activity[];
    chat: ChatMessage[];
  };
};

export const siteConfig: SiteConfig = {
  couple: {
    her: "Una",
    me: "Rado",
    herUsername: "unaa.cantik",
    myUsername: "rado.aja",
    anniversary: "2023-04-12",
  },
  birthday: {
    date: "2026-10-30",
    turning: 22,
    wishes: {
      enabled: true,
      minGapMs: 4000,
      pools: {
        open: [
          "Selamat ulang tahun, {nama}! Ada kejutan kecil di dalam.",
          "Hari ini harimu, {nama}. Senyum dulu sebelum mulai!",
          "Semesta tersenyum melihatmu bertambah umur hari ini.",
          "Untuk {nama} tercantik di umur {umur}: selamat datang!",
          "Buka perlahan ya, semua ini cuma buat kamu seorang ❤️",
        ],
        gate: [
          "Ingat tanggalnya ya. Hari itu sama pentingnya dengan hari ini.",
          "Kuncinya terbuka! Selamat ulang tahun sayangku {nama}.",
          "Tanggal jadian kita adalah awal dari semua tawa ini.",
          "Pintu ForUs terbuka. Selamat menjelajahi kenangan kita!",
          "Kamu hafal tanggalnya! Hadiah peluk hangat dari aku.",
        ],
        like: [
          "Like pertama dari kamu, kado terindah buat aku ❤️",
          "Satu like dari {nama} bikin hariku langsung cerah!",
          "Tanda hati darimu selalu jadi favoritku selamanya.",
          "Selamat umur {umur}, semoga selalu bahagia bersamaku.",
          "Hati ini sudah kamu like sejak hari pertama kita jumpa.",
        ],
        doubleTap: [
          "Satu tap = satu doa baik untuk umur {umur}-mu.",
          "Ketukan jarimu bikin hatiku berdebar lagi, {nama}!",
          "Doa terbaikku mengalir di setiap detak harimu.",
          "Dua ketukan manis untuk orang termanis di hidupku.",
          "Bertambah usia, bertambah pula rasa sayangku padamu.",
        ],
        repost: [
          "Kenangan ini milik kita. Semoga tahun ini penuh hal baru.",
          "Direpost ke hatiku. Takkan pernah hilang oleh waktu.",
          "Simpan momen ini, kita ukir lebih banyak lagi nanti!",
          "Selamat ulang tahun {nama}, terima kasih sudah ada.",
          "Momen favorit kita sekarang tersimpan abadi.",
        ],
        commentOpen: [
          "Tulis harapanmu di sini ya, {nama}. Aku baca semua.",
          "Kolom komentar ini saksi bisu doaku untukmu hari ini.",
          "Mau tulis apa sayang? Aku siap dengarkan isi hatimu.",
          "Tulis satu permintaan ulang tahunmu sekarang juga!",
          "Kotak ini siap menampung senyuman dan ceritamu.",
        ],
        commentSend: [
          "Aamiin. Aku catat semua harapanmu, {nama} tersayang.",
          "Doamu sampai ke hatiku. Semoga lekas terkabul semuanya!",
          "Komentarmu bikin aku tersenyum sendiri membacanya.",
          "Semoga di umur {umur} semua impianmu jadi kenyataan.",
          "Terima kasih sudah berbagi rasa, cinta sejatiku.",
        ],
        follow: [
          "Aku follow kamu seumur hidup. Selamat bertambah umur!",
          "Sudah kuikuti sejak pandangan pertama di hari itu.",
          "Kamu nggak akan sendirian lagi, aku selalu di belakangmu.",
          "Follower pertamamu dan penggemar setiamu selamanya.",
          "Langkah kita searah, tangan kita selalu bergandengan.",
        ],
        save: [
          "Disimpan, seperti kamu selalu tersimpan aman di hatiku.",
          "Klip ini abadi di folder rahasia kita berdua.",
          "Tersimpan rapi! Momen manis yang tak boleh terlupa.",
          "Setiap detik bersamamu terlalu berharga untuk lepas.",
          "Selamat ulang tahun {nama}, kenangan ini milikmu.",
        ],
        share: [
          "Bagikan ke aku saja ya, aku yang mau ucapin pertama!",
          "Kirim ke aku sekarang, ada pelukan hangat menunggumu.",
          "Bagikan cinta kita ke dunia, biar semua tahu kamu milikku.",
          "Setiap orang harus tahu betapa cantiknya kamu hari ini.",
          "Tautan cinta kita sudah tersambung tanpa batas.",
        ],
        musicDisc: [
          "Lagu ini khusus diputar untuk hari spesialmu, {nama}.",
          "Melodi cinta kita berputar mengiringi langkah manismu.",
          "Piringan hitam berputar, doaku untukmu mengalun merdu.",
          "Dengarkan lagunya, ada rindu yang kusisipkan di sana.",
          "Irama lagu kita selalu jadi musik terindah di dunia.",
        ],
        speedUp: [
          "Waktu boleh cepat, tapi bahagiamu jangan ya sayang.",
          "2x lebih cepat, tapi cintaku padamu tak berujung.",
          "Cepatnya waktu mengingatkanku betapa serunya denganmu.",
          "Jangan buru-buru, umur {umur} ini penuh kejutan indah!",
          "Detik berpacu cepat, hatiku tetap tenang di dekatmu.",
        ],
        speedDown: [
          "Pelan-pelan ya sayang, nikmati setiap detik harimu.",
          "Waktu melambat agar aku bisa memandang senyummu lebih lama.",
          "0.5x lebih lambat, biarkan cinta meresap dalam hangat.",
          "Santai sejenak di hari bahagiamu, {nama} tersayang.",
          "Dunia boleh sibuk, di sini kita nikmati berdua.",
        ],
        pause: [
          "Berhenti sebentar. Tarik napas. Hari ini sepenuhnya harimu.",
          "Jeda sejenak, tatap mataku dan rasakan hangatnya sayangku.",
          "Dunia berhenti berputar saat kamu tersenyum padaku.",
          "Tenang ya sayang, aku selalu ada di sisimu.",
          "Istirahat kecil untuk bidadari tercantik hari ini.",
        ],
        mute: [
          "Suara hening, tapi bisikan rinduku tetap terdengar.",
          "Tanpa suara pun, matamu sudah bicara sejuta cinta.",
          "Hening sejenak untuk memanjatkan doa terbaik buatmu.",
          "Biar sunyi, hatiku tetap bernyanyi untukmu {nama}.",
          "Ketenangan ini kurangkai jadi selimut hangatmu.",
        ],
        unmute: [
          "Nyalakan suaranya! Ada nada tawa kita yang kurindukan.",
          "Dengarkan musiknya mengalun manis untuk hari lahirmu.",
          "Suaramu selalu jadi obat paling ampuh untuk lelahku.",
          "Biarkan musik cinta kita mengisi setiap sudut ruangan.",
          "Suara bahagia ini milikmu, selamat bertambah usia!",
        ],
        clipAdvance: [
          "Sudah {n} kenangan. Masih ribuan lagi di umur {umur} nanti!",
          "Setiap klip adalah bukti betapa berartinya kamu bagiku.",
          "Terus scroll ya sayang, cerita kita masih sangat panjang.",
          "{n} momen terekam, jutaan rasa tersimpan di dada.",
          "Langkah berikutnya akan lebih indah bersama kamu.",
        ],
        inbox: [
          "Ada surat cinta rahasia menunggumu di kotak masuk!",
          "Kotak masuk penuh notifikasi cinta hanya untukmu.",
          "Cek pesan dariku, ada bisikan sayang yang tulus.",
          "Semua notifikasi ini tentang kamu dan senyummu.",
          "Pesan hangat siap menghiasi hari ulang tahunmu.",
        ],
        profile: [
          "Profilmu: Pengikut 1, tapi dia mencintaimu seumur hidup.",
          "Sudah {hari_bersama} hari kita berjalan beriringan.",
          "Halaman profil ini bukti perjalanan cinta kita berdua.",
          "Bidadariku yang genap {umur} tahun, kamu luar biasa!",
          "Tak ada profil seindah dirimu di seluruh jagat raya.",
        ],
        search: [
          "Cari apa sayang? Apapun itu, jawabannya selalu kamu.",
          "Mencari jejak cinta kita di setiap sudut ForUs.",
          "Kamu nggak perlu mencari lagi, hatiku sudah milikmu.",
          "Kata kunci terbaik hari ini: Selamat ulang tahun {nama}!",
          "Di mana pun kamu mencari, cintaku selalu menyambutmu.",
        ],
        create: [
          "Buat satu harapan terindah untuk tahun ini ya sayang.",
          "Ayo buat jadwal kencan impian kita berikutnya!",
          "Momen baru siap kita ciptakan bersama setelah ini.",
          "Tombol plus ini jalan menuju petualangan kita berdua.",
          "Selamat berkreasi dengan cinta kita yang tak ada habisnya.",
        ],
        easterEgg: [
          "Kamu menemukannya! Hadiah rahasia: peluk erat selamanya ❤️",
          "Hebat banget jarimu! Kejutan rahasia ForUs terbuka.",
          "Balon cinta berterbangan khusus buat yang lagi ultah!",
          "Mata jeli kesayanganku! Hadiah ciuman virtual buat kamu.",
          "Kamu adalah kejutan terindah yang pernah kumiliki.",
        ],
        idle: [
          "Masih di sana sayang? Aku selalu ada di sini buatmu.",
          "Melamun ya? Pasti lagi bayangin kado dari aku hehe.",
          "Jangan diam saja, senyummu terlalu manis untuk disembunyikan.",
          "Menunggumu tersenyum lagi di hari bahagiamu ini.",
          "Aku di sini, menemanimu di setiap detik umur barumu.",
        ],
        finale: [
          "Selamat ulang tahun ke-{umur}, cinta sejatiku {nama} 🎂",
          "Semoga langkahmu selalu diberkahi kebahagiaan abadi.",
          "Tiup lilinnya, buat doa terindah, dan peluk aku erat-erat.",
          "Hadiah terindah dalam hidupku adalah memilikimu.",
          "Hari ini, esok, dan selamanya: aku mencintaimu.",
        ],
      },
    },
  },
  // Gate PIN: 172312 -> SHA-256
  gateHash:
    process.env.NEXT_PUBLIC_GATE_HASH ||
    "443d69a9f49646bb392f73b3e4e055bd32ef2b77c6bbd75119e561cac7db7809",
  whatsapp: {
    number: "6281234567890",
    templates: {
      share: "Aku suka banget yang ini ❤️ {judul_klip} - ForUs",
      dateSummary:
        "Hai sayang! Ini jadwal kencan kita yang kupilih di ForUs ❤️ Ayo jalan!",
      finaleReply:
        "Makasih banyak ya sayang buat kejutannya di ForUs! Aku terharu banget ❤️🥺",
    },
  },
  unlock: {
    bonusAfterReposts: 3,
  },
  finale: {
    type: "letter",
    title: "Selamat Ulang Tahun, Cintaku",
    body: "Hari ini adalah hari di mana bidadari terbaik dilahirkan ke dunia. Terima kasih sudah menjadi rumah, tempat pulang, dan alasan di balik senyumku setiap hari. Di umur yang baru ini, aku berdoa agar kamu selalu dilimpahi kesehatan, kebahagiaan yang meluap, dan semua impianmu tercapai satu per satu. Aku berjanji akan terus ada di sampingmu, menggenggam tanganmu, melewati suka maupun duka. I love you more than words could ever say. Selamat bertambah umur, sayangku ❤️",
  },
  inbox: {
    activities: [
      {
        id: "act-1",
        avatar: "/avatars/me.jpg",
        title: "rado.aja menyukai fotomu",
        subtitle: "Momen kencan pertama kita",
        time: "1j yang lalu",
      },
      {
        id: "act-2",
        avatar: "/avatars/me.jpg",
        title: "rado.aja mulai mengikutimu",
        subtitle: "Sejak hari pertama ketemu",
        time: "3j yang lalu",
      },
      {
        id: "act-3",
        avatar: "/avatars/me.jpg",
        title: "rado.aja menyebutmu di komentar",
        subtitle: '"Orang tercantik sedunia."',
        time: "Kemarin",
      },
      {
        id: "act-4",
        avatar: "/avatars/me.jpg",
        title: "Pengingat ForUs 🎂",
        subtitle: "Hari ini adalah hari spesialmu!",
        time: "Hari ini",
      },
    ],
    chat: [
      {
        id: "msg-1",
        sender: "me",
        text: "Hai bidadariku, selamat ulang tahun ya ❤️",
        time: "00:00",
      },
      {
        id: "msg-2",
        sender: "me",
        text: "Sengaja aku buatin ForUs ini biar semua kenangan kita tersimpan rapi.",
        time: "00:01",
      },
      {
        id: "msg-3",
        sender: "me",
        text: "Jangan lupa coba like, double tap, sama repost ya! Ada kejutan tersembunyi.",
        time: "00:02",
      },
      {
        id: "msg-4",
        sender: "me",
        text: "Kalau sudah selesai nonton semua videonya, cek tombol Create ＋ di bawah ya!",
        time: "00:03",
      },
    ],
  },
};

