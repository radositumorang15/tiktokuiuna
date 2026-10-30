"use client";

import React from "react";
import { siteConfig } from "@/content/site";
import { wish } from "@/lib/wishes";

const SHARED_STORIES = [
  {
    id: "story-1",
    title: "Masak Bareng Pertama Kali",
    desc: "Bikin pasta yang sausnya keasinan, tapi dihabisin sambil ketawa sampai perut sakit.",
    tag: "Tawa Kita",
    icon: "🍝",
  },
  {
    id: "story-2",
    title: "Kehujanan Pas Naik Motor",
    desc: "Berteduh di emperan toko sambil minum teh hangat. Rambutmu basah tapi senyummu manis banget.",
    tag: "Kenangan Hujan",
    icon: "🌧️",
  },
  {
    id: "story-3",
    title: "Nonton Konser Impianmu",
    desc: "Melihat matamu berbinar-binar waktu nyanyi lagu favoritmu bersama ribuan orang.",
    tag: "Momen Emas",
    icon: "🎸",
  },
  {
    id: "story-4",
    title: "Obrolan Larut Malam",
    desc: "Cerita tentang mimpi masa depan, keluarga, dan janji untuk saling menjaga selamanya.",
    tag: "Hati ke Hati",
    icon: "🌙",
  },
];

export default function TemanPage() {
  return (
    <div className="relative w-full h-[100dvh] bg-black text-white overflow-y-auto pb-24 px-4 pt-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#3a3a3a]">
        <div>
          <h1 className="text-[20px] font-bold text-white">Teman (&ldquo;Kita&rdquo;) 🤝</h1>
          <p className="text-[13px] text-[#a8a8a8]">
            Cerita & momen yang sudah kita jalani berdua
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-[20px]">
          ❤️
        </div>
      </div>

      {/* Story cards list */}
      <div className="space-y-4 mt-4">
        {SHARED_STORIES.map((story) => (
          <div
            key={story.id}
            onClick={() => wish("open")}
            className="p-4 rounded-xl bg-[#161823] border border-[#3a3a3a] active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[24px]">{story.icon}</span>
              <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30">
                {story.tag}
              </span>
            </div>
            <h2 className="text-[16px] font-bold text-white mb-1">
              {story.title}
            </h2>
            <p className="text-[14px] leading-[20px] text-[#a8a8a8]">
              {story.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className="mt-8 p-4 rounded-xl bg-[#1f1f1f] border border-[#3a3a3a] text-center space-y-1">
        <p className="text-[14px] font-semibold text-white">
          Lebih Dari Sekadar Teman Hidup
        </p>
        <p className="text-[12px] text-[#a8a8a8]">
          Kamu adalah rumah, tempat ternyaman untuk pulang bagi {siteConfig.couple.me}.
        </p>
      </div>
    </div>
  );
}
