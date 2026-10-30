"use client";

import React, { useState } from "react";
import Link from "next/link";
import { defaultSlots } from "@/content/slots";
import { wish } from "@/lib/wishes";

const POPULAR_HASHTAGS = [
  "#kitaberdua",
  "#dateterbaik",
  "#ulangtahun",
  "#kangen",
  "#senyummu",
];

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    wish("search");
  };

  const filteredClips = defaultSlots.filter((slot) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const captionMatch = slot.caption.toLowerCase().includes(q);
    const titleMatch = slot.title?.toLowerCase().includes(q);
    const hashtagMatch = slot.hashtags?.some((h) => h.toLowerCase().includes(q));
    return captionMatch || titleMatch || hashtagMatch;
  });

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white overflow-y-auto pb-24 px-4 pt-6 select-none">
      {/* Search Pill (surface-overlay, radius-full, height 44, placeholder ink-mute) */}
      <div className="relative w-full mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari kenangan kita (coba 'kangen', 'ulang tahun')..."
          className="w-full h-[44px] pl-11 pr-4 rounded-full bg-[#1f1f1f] text-white placeholder-[#a8a8a8] text-[14px] border border-[#3a3a3a] focus:outline-none focus:border-white/50"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a8a8] text-[18px]">
          🔍
        </span>
      </div>

      {/* Hashtag Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar mb-4">
        {POPULAR_HASHTAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleSearch(tag.replace("#", ""))}
            className="px-3.5 py-1.5 rounded-full bg-[#161823] border border-[#3a3a3a] text-[13px] font-medium text-white hover:border-primary active:scale-95 shrink-0 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 2-Column Grid Results (only here, never on Home) */}
      <div className="grid grid-cols-2 gap-3">
        {filteredClips.map((clip) => (
          <Link
            key={clip.id}
            href="/feed"
            className="flex flex-col rounded-xl overflow-hidden bg-[#161823] border border-[#3a3a3a] active:scale-[0.98] transition-transform"
          >
            {/* Thumbnail aspect 3:4 */}
            <div className="w-full aspect-[3/4] bg-[#1f1f1f] relative flex items-center justify-center overflow-hidden">
              <img
                src={clip.song.cover}
                alt={clip.caption}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400' fill='%231f1f1f'%3E%3Crect width='300' height='400' fill='%23161823'/%3E%3Ctext x='50%25' y='50%25' fill='%23fe2c55' font-size='16' text-anchor='middle'%3EForUs ❤️%3C/text%3E%3C/svg%3E";
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[11px] font-semibold text-white">
                ▶ {clip.baseCounts.likes} likes
              </span>
            </div>

            <div className="p-2.5">
              <h2 className="text-[13px] font-semibold text-white line-clamp-1">
                {clip.title || "Kenangan Kita"}
              </h2>
              <p className="text-[12px] text-[#a8a8a8] line-clamp-2 mt-0.5">
                {clip.caption}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredClips.length === 0 && (
        <div className="text-center py-12 text-[#a8a8a8] space-y-2">
          <p className="text-[28px]">🥺</p>
          <p className="text-[14px]">
            Nggak ada kenangan yang cocok sama &quot;{searchTerm}&quot;.
          </p>
          <p className="text-[12px] text-[#737373]">
            Tapi cinta kita selalu ada di setiap sudut kok!
          </p>
        </div>
      )}
    </div>
  );
}
