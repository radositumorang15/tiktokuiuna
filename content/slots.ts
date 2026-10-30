import { LikeEffect } from "./site";

export type ContentSlot = {
  id: string;
  type: "video" | "photo-carousel" | "photo-slideshow";
  title?: string;
  caption: string;
  hashtags?: string[];
  song: {
    title: string;
    artist: string;
    cover: string;
    audio?: string;
  };
  baseCounts: {
    likes: number;
    comments: number;
    saves: number;
    shares: number;
    reposts: number;
  };
  onLike?: {
    effect: LikeEffect;
    payload?: {
      text?: string;
      audio?: string;
      from?: string;
    };
  };
  comments: {
    user: string;
    text: string;
    creator?: boolean;
    time: string;
  }[];
  autoReply?: {
    text: string;
    delayMs?: number;
  };
  hidden?: boolean;
  wish?: string;
  photoMode?: "swipe" | "slideshow";
  photoStyle?: "plain" | "kenburns" | "polaroid" | "stack";
  secondsPerPhoto?: number;
};

export const defaultSlots: ContentSlot[] = [
  {
    id: "slot-01",
    type: "video",
    title: "Momen Lucu Pembuka",
    caption: "POV: kamu baru nyadar aku nyimpen semua rekaman konyol ini dari awal jadian 😂❤️",
    hashtags: ["kitaberdua", "forus", "birthdaygirl", "ngakak"],
    song: {
      title: "Lagu Lucu Kita — Akustik Santai",
      artist: "Rado & Una",
      cover: "/covers/song-1.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 14,
      saves: 5,
      shares: 3,
      reposts: 2,
    },
    onLike: {
      effect: "confetti",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Muka kamu pas kaget di sini lucu banget sumpah wkwk 🥺",
        creator: true,
        time: "2j lalu",
      },
      {
        user: "satpam_hati",
        text: "Waduh tolong jangan gemas-gemas ya!",
        creator: false,
        time: "1j lalu",
      },
    ],
    autoReply: {
      text: "Jangan cemberut gitu dong sayangku, kamu tetap yang paling cantik sedunia! Semoga harimu penuh tawa.",
      delayMs: 1200,
    },
  },
  {
    id: "slot-02",
    type: "photo-carousel",
    title: "Kencan Pertama",
    photoStyle: "plain",
    photoMode: "swipe",
    caption: "Kilas balik: hari pertama kita nongkrong berdua. Tanganku gemeteran megang cangkir kopi ☕✨",
    hashtags: ["firstdate", "nostalgia", "cintaku"],
    song: {
      title: "Melodi Hari Pertama",
      artist: "Kisah Kita",
      cover: "/covers/song-2.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 8,
      saves: 12,
      shares: 4,
      reposts: 1,
    },
    onLike: {
      effect: "photo-reveal",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Aku sampai deg-degan milih baju 3 jam sebelum jemput kamu tahu!",
        creator: true,
        time: "3j lalu",
      },
    ],
    autoReply: {
      text: "Dari hari pertama itu, aku sudah yakin kamulah orangnya. Semoga langkah kita selalu berdampingan.",
      delayMs: 1200,
    },
  },
  {
    id: "slot-03",
    type: "video",
    title: "Klip Nostalgia & Perjalanan",
    caption: "Nggak berasa waktu berjalan secepat ini bareng kamu. Setiap detik terlalu berharga.",
    hashtags: ["milestone", "hari_bersama", "sayangku"],
    song: {
      title: "Tentang Waktu & Cinta",
      artist: "Rado feat. Una",
      cover: "/covers/song-3.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 20,
      saves: 19,
      shares: 6,
      reposts: 4,
    },
    onLike: {
      effect: "milestone",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Hitungan hari ini bukti kita sudah lewati banyak hal hebat bareng-bareng.",
        creator: true,
        time: "4j lalu",
      },
    ],
    autoReply: {
      text: "Angka ratusan hari ini cuma awal, kita rayakan sampai ribuan hari nanti ya bidadariku!",
      delayMs: 1200,
    },
  },
  {
    id: "slot-04",
    type: "photo-slideshow",
    title: "Setahun Terakhir",
    photoStyle: "kenburns",
    photoMode: "slideshow",
    secondsPerPhoto: 3,
    caption: "Kumpulan senyum favoritku selama setahun belakangan. Tahan layar kalau mau jeda ya!",
    hashtags: ["senyummu", "memorabilia", "kebahagiaan"],
    song: {
      title: "Semua Senyumanmu",
      artist: "Gitar Senja",
      cover: "/covers/song-4.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 11,
      saves: 28,
      shares: 7,
      reposts: 2,
    },
    onLike: {
      effect: "hearts-rain",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Foto slide ke-3 pas kita kehujanan di kafe itu favoritku banget ❤️",
        creator: true,
        time: "5j lalu",
      },
    ],
    autoReply: {
      text: "Senyummu selalu jadi pemandangan favoritku di dunia. Selamat bertambah usia, sayang.",
      delayMs: 1200,
    },
  },
  {
    id: "slot-05",
    type: "video",
    title: "Pesan Spesial Dari Aku",
    caption: "Pesan singkat dari aku ke kamera buat kamu yang lagi ulang tahun hari ini 🎙️❤️",
    hashtags: ["pesanhati", "happybirthday", "terimakasih"],
    song: {
      title: "Bisikan Hati",
      artist: "Original Voice",
      cover: "/covers/song-5.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 35,
      saves: 42,
      shares: 10,
      reposts: 5,
    },
    onLike: {
      effect: "voice-note",
      payload: {
        text: "Selamat ulang tahun bidadariku. Terima kasih sudah selalu sabar dan jadi penyemangat terbesarku. Aku sayang kamu!",
      },
    },
    comments: [
      {
        user: "rado.aja",
        text: "Dengerin sampai habis ya, rekamannya tulus dari hati terdalam.",
        creator: true,
        time: "6j lalu",
      },
    ],
    autoReply: {
      text: "Makasih sudah mendengarkan suaraku yang pas-pasan ini hehe. Doa terbaikku selalu memelukmu.",
      delayMs: 1200,
    },
  },
  {
    id: "slot-06",
    type: "photo-carousel",
    title: "Polaroid Hal-Hal Kecil",
    photoStyle: "polaroid",
    photoMode: "swipe",
    caption: "Hal-hal kecil yang bikin aku jatuh cinta berkali-kali sama kamu 📸✨",
    hashtags: ["polaroid", "detailcinta", "kesayangan"],
    song: {
      title: "Hal Kecil Berarti Besar",
      artist: "Piano Romantis",
      cover: "/covers/song-6.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 16,
      saves: 31,
      shares: 8,
      reposts: 3,
    },
    onLike: {
      effect: "sticker-burst",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Cara kamu ketawa sambil nutup mulut itu selalu bikin hatiku meleleh.",
        creator: true,
        time: "7j lalu",
      },
    ],
    autoReply: {
      text: "Setiap detail kecil tentangmu selalu kucatat rapi di hati. Happy birthday kesayangan!",
      delayMs: 1200,
    },
  },
  {
    id: "slot-07",
    type: "video",
    title: "Momen Random Kesukaanmu",
    caption: "Ingat nggak waktu kita nyasar tapi malah nemu warung es krim paling enak? Wkwk 🍦",
    hashtags: ["icecreamdate", "randommoment", "happyus"],
    song: {
      title: "Petualangan Manis",
      artist: "Akustik Jalanan",
      cover: "/covers/song-7.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 24,
      saves: 18,
      shares: 5,
      reposts: 3,
    },
    onLike: {
      effect: "glitch-heart",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Hidungmu belepotan cokelat tapi kamu malah ketawa girang banget haha.",
        creator: true,
        time: "8j lalu",
      },
    ],
    autoReply: {
      text: "Nyasar sama kamu itu selalu jadi petualangan terbaik. Nanti kita cari es krim lagi ya!",
      delayMs: 1200,
    },
  },
  {
    id: "slot-08",
    type: "photo-carousel",
    title: "Trip & Liburan Kita",
    photoStyle: "stack",
    photoMode: "swipe",
    caption: "Setiap sudut kota yang kita kunjungi selalu jadi lebih indah karena ada kamu 🌊🗺️",
    hashtags: ["traveltogether", "pantai", "liburankita"],
    song: {
      title: "Deru Ombak & Tawamu",
      artist: "Melodi Pantai",
      cover: "/covers/song-8.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 29,
      saves: 37,
      shares: 12,
      reposts: 4,
    },
    onLike: {
      effect: "letter-pop",
      payload: {
        text: "Untuk bidadari yang menemaniku melihat senja: terima kasih sudah membuat duniaku berwarna. Selamat ulang tahun, cintaku.",
      },
    },
    comments: [
      {
        user: "rado.aja",
        text: "Next trip kita mau ke mana lagi nih? Udah siapin bucket list baru nih!",
        creator: true,
        time: "9j lalu",
      },
    ],
    autoReply: {
      text: "Surat kecil ini kubuat saat memandang laut bersamamu. Semoga kita bisa menjelajahi dunia bersama selamanya.",
      delayMs: 1200,
    },
  },
  {
    id: "slot-09",
    type: "video",
    title: "Jujur & Tulus",
    caption: "Mungkin aku bukan yang paling sempurna, tapi bersamamu aku selalu ingin jadi yang terbaik ❤️",
    hashtags: ["tulus", "sayangselamanya", "untukmu"],
    song: {
      title: "Janji Sederhana",
      artist: "Rado",
      cover: "/covers/song-9.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 40,
      saves: 55,
      shares: 15,
      reposts: 6,
    },
    onLike: {
      effect: "confetti",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Semua kata di caption ini 100% dari lubuk hati paling dalam.",
        creator: true,
        time: "10j lalu",
      },
    ],
    autoReply: {
      text: "Terima kasih sudah memilihku untuk menemani harimu. Doaku selalu menyertai setiap langkahmu.",
      delayMs: 1200,
    },
  },
  {
    id: "slot-10",
    type: "photo-slideshow",
    title: "Masa Depan Kita",
    photoStyle: "plain",
    photoMode: "slideshow",
    secondsPerPhoto: 3,
    caption: "Menatap ke depan: semoga mimpi-mimpi indah yang kita obrolin tiap malam segera terwujud 🏡✨",
    hashtags: ["masadepan", "doabersama", "bahagia"],
    song: {
      title: "Rumah Tempat Pulang",
      artist: "Harmoni Cinta",
      cover: "/covers/song-10.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 18,
      saves: 44,
      shares: 9,
      reposts: 5,
    },
    onLike: {
      effect: "hearts-rain",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Suatu saat nanti, rumah kecil dengan taman bunga impianmu bakal jadi nyata.",
        creator: true,
        time: "11j lalu",
      },
    ],
    autoReply: {
      text: "Aamiin ya rabbal alamin. Semoga kita terus saling menjaga sampai rambut kita memutih.",
      delayMs: 1200,
    },
  },
  {
    id: "bonus",
    type: "video",
    title: "Klip Rahasia Bonus 🎉",
    caption: "Yeeeey! Kamu berhasil membuka klip rahasia ini karena sudah repost 3 kali! Hadiah peluk hangat ❤️",
    hashtags: ["bonusclip", "secretvideo", "specialsurprise"],
    hidden: true,
    song: {
      title: "Lagu Kemenangan Cinta",
      artist: "ForUs Special",
      cover: "/covers/song-bonus.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 50,
      saves: 60,
      shares: 20,
      reposts: 10,
    },
    onLike: {
      effect: "glitch-heart",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Keren banget bisa nemuin klip rahasia ini! Kamu bener-bener teliti ya hehe.",
        creator: true,
        time: "12j lalu",
      },
    ],
    autoReply: {
      text: "Selamat bidadariku! Bonus cinta spesial buat kamu yang pantang menyerah.",
      delayMs: 1200,
    },
  },
  {
    id: "finale",
    type: "video",
    title: "Kejutan Puncak Ulang Tahun 🎂",
    caption: "Kamu sudah sampai di akhir perjalanan feed ini… tapi ada satu hal terpenting yang mau kukatakan ❤️",
    hashtags: ["thefinale", "happybirthdaymylove", "kejutan"],
    song: {
      title: "Happy Birthday My Everything",
      artist: "Orkestra Cinta",
      cover: "/covers/song-finale.jpg",
    },
    baseCounts: {
      likes: 1,
      comments: 100,
      saves: 99,
      shares: 50,
      reposts: 25,
    },
    onLike: {
      effect: "confetti",
    },
    comments: [
      {
        user: "rado.aja",
        text: "Ketuk layar atau tombol di bawah untuk ritual tiup lilin kita ya sayang! 🎂",
        creator: true,
        time: "Baru saja",
      },
    ],
    autoReply: {
      text: "Selamat ulang tahun sayangku, semoga semua doa di kartu ucapan ini diijabah Allah SWT. Aku sayang kamu!",
      delayMs: 1200,
    },
  },
];

