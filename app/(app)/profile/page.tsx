"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/content/site";
import { defaultSlots } from "@/content/slots";
import { useStore } from "@/lib/store";
import { calculateDaysTogether, wish } from "@/lib/wishes";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"video" | "repost" | "suka" | "tersimpan">("video");
  const [avatarTapCount, setAvatarTapCount] = useState(0);

  const liked = useStore((s) => s.liked);
  const reposts = useStore((s) => s.reposts);
  const saves = useStore((s) => s.saves);
  const wishesEnabled = useStore((s) => s.wishesEnabled);
  const toggleWishesEnabled = useStore((s) => s.toggleWishesEnabled);
  const openSecret = useStore((s) => s.openSecret);

  const daysTogether = calculateDaysTogether();

  const handleAvatarTap = () => {
    const nextCount = avatarTapCount + 1;
    setAvatarTapCount(nextCount);
    if (nextCount >= 3) {
      setAvatarTapCount(0);
      wish("easterEgg");
      openSecret();
    }
  };

  // Determine clips to show in active tab
  const tabClips = defaultSlots.filter((slot) => {
    if (activeTab === "video") return true;
    if (activeTab === "repost") return reposts.includes(slot.id);
    if (activeTab === "suka") return liked.includes(slot.id);
    if (activeTab === "tersimpan") return saves.includes(slot.id);
    return true;
  });

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white overflow-y-auto pb-24 px-4 pt-6 select-none">
      {/* 1. Header & Centered Avatar 96px */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div
          onClick={handleAvatarTap}
          className="relative w-[96px] h-[96px] rounded-full border-2 border-white/80 overflow-hidden bg-[#161823] cursor-pointer active:scale-95 transition-transform"
        >
          <img
            src="/avatars/user.jpg"
            alt={siteConfig.couple.her}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Ccircle cx='48' cy='48' r='48' fill='%23fe2c55'/%3E%3Ctext x='50%25' y='55%25' fill='white' font-size='24' font-weight='bold' text-anchor='middle'%3EUna%3C/text%3E%3C/svg%3E";
            }}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-[18px] leading-[24px] font-bold text-white">
            {siteConfig.couple.her}
          </h1>
          <p className="text-[13px] text-[#a8a8a8]">
            @{siteConfig.couple.herUsername}
          </p>
        </div>

        {/* 2. Three Stats: Mengikuti 1 · Pengikut 1 · Suka ∞ */}
        <div className="flex items-center justify-center gap-8 py-1">
          <div className="text-center">
            <span className="block text-[18px] leading-[24px] font-bold text-white">
              1
            </span>
            <span className="text-[12px] text-[#a8a8a8]">Mengikuti</span>
          </div>
          <div className="text-center">
            <span className="block text-[18px] leading-[24px] font-bold text-white">
              1
            </span>
            <span className="text-[12px] text-[#a8a8a8]">Pengikut</span>
          </div>
          <div className="text-center">
            <span className="block text-[18px] leading-[24px] font-bold text-white">
              ∞
            </span>
            <span className="text-[12px] text-[#a8a8a8]">Suka</span>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="flex items-center gap-2 w-full max-w-[280px]">
          <button
            type="button"
            onClick={() => alert(`Kamu adalah bidadari terindah bagi @${siteConfig.couple.myUsername} ❤️`)}
            className="flex-1 py-2 rounded border border-[#4a4a4a] text-white text-[14px] font-semibold active:scale-95 transition-transform"
          >
            Edit profil
          </button>

          <button
            type="button"
            onClick={toggleWishesEnabled}
            className={`px-3 py-2 rounded text-[13px] font-semibold border transition-colors ${
              wishesEnabled
                ? "border-primary bg-primary/20 text-white"
                : "border-[#4a4a4a] text-[#a8a8a8]"
            }`}
          >
            {wishesEnabled ? "Ucapan On 🎂" : "Ucapan Off"}
          </button>
        </div>

        {/* 4. Bio & Days Together */}
        <div className="text-[14px] leading-[20px] text-white/90 max-w-[300px] pt-1">
          <p>
            Bersama sejak {siteConfig.couple.anniversary} • {daysTogether} hari penuh cinta ❤️
          </p>
          <p className="text-[13px] text-[#a8a8a8] mt-1">
            &ldquo;Semoga setiap langkah kita selalu bergandengan selamanya.&rdquo;
          </p>
        </div>
      </div>

      {/* 5. Icon Tabs (Grid, Repost, Liked, Saved) with underline */}
      <div className="flex items-center justify-around border-b border-[#3a3a3a] mt-6">
        <button
          type="button"
          onClick={() => setActiveTab("video")}
          className={`py-3 px-4 relative transition-colors ${
            activeTab === "video" ? "text-white" : "text-[#737373]"
          }`}
        >
          <span className="text-[18px]">▦</span>
          {activeTab === "video" && (
            <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("repost")}
          className={`py-3 px-4 relative transition-colors ${
            activeTab === "repost" ? "text-white" : "text-[#737373]"
          }`}
        >
          <span className="text-[18px]">🔁</span>
          {activeTab === "repost" && (
            <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("suka")}
          className={`py-3 px-4 relative transition-colors ${
            activeTab === "suka" ? "text-white" : "text-[#737373]"
          }`}
        >
          <span className="text-[18px]">❤️</span>
          {activeTab === "suka" && (
            <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tersimpan")}
          className={`py-3 px-4 relative transition-colors ${
            activeTab === "tersimpan" ? "text-white" : "text-[#737373]"
          }`}
        >
          <span className="text-[18px]">🔖</span>
          {activeTab === "tersimpan" && (
            <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full" />
          )}
        </button>
      </div>

      {/* 6. 3-Column Grid (3:4 ratio, 1px gaps, view count bottom-left) */}
      <div className="grid grid-cols-3 gap-[1px] bg-black mt-2">
        {tabClips.map((clip) => (
          <Link
            key={clip.id}
            href="/feed"
            className="relative aspect-[3/4] bg-[#161823] overflow-hidden active:opacity-75 transition-opacity"
          >
            <img
              src={clip.song.cover}
              alt={clip.caption}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400' fill='%231f1f1f'%3E%3Crect width='300' height='400' fill='%23161823'/%3E%3Ctext x='50%25' y='50%25' fill='%23fe2c55' font-size='20' text-anchor='middle'%3EForUs%3C/text%3E%3C/svg%3E";
              }}
              className="w-full h-full object-cover"
            />
            {/* View count bottom-left */}
            <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-semibold text-white drop-shadow">
              ▶ {clip.baseCounts.likes}
            </span>
          </Link>
        ))}
      </div>

      {tabClips.length === 0 && (
        <div className="text-center py-12 text-[#a8a8a8] text-[13px]">
          Belum ada video di tab ini.
        </div>
      )}
    </div>
  );
}
