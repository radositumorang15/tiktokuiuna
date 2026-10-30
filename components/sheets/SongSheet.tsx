"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { defaultSlots } from "@/content/slots";

export function SongSheet() {
  const isOpen = useStore((s) => s.isSongSheetOpen);
  const clipId = useStore((s) => s.activeSongClipId);
  const closeSongSheet = useStore((s) => s.closeSongSheet);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !clipId) return null;

  const currentSlot = defaultSlots.find((s) => s.id === clipId);
  const song = currentSlot?.song || {
    title: "Lagu Kita",
    artist: "ForUs",
    cover: "/covers/song-1.jpg",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Detail Lagu"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeSongSheet}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-[16px] bg-[#161823] border-t border-[#3a3a3a] p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="w-full flex justify-center pb-1">
          <div className="w-[36px] h-[4px] rounded-full bg-[#737373]" />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-white">Lagu Kita 🎵</h3>
          <button
            type="button"
            onClick={closeSongSheet}
            aria-label="Tutup"
            className="text-[#a8a8a8] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1f1f1f] border border-[#3a3a3a]">
          <div className="w-[64px] h-[64px] rounded-lg overflow-hidden bg-black shrink-0 border border-white/20">
            <img
              src={song.cover}
              alt={song.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%231f1f1f'/%3E%3Ccircle cx='32' cy='32' r='16' fill='%23fe2c55'/%3E%3C/svg%3E";
              }}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h4 className="text-[15px] font-semibold text-white leading-tight">
              {song.title}
            </h4>
            <p className="text-[13px] text-[#a8a8a8] mt-0.5">{song.artist}</p>
            <p className="text-[11px] text-primary mt-1 font-medium">
              Audio Resmi ForUs • Kenangan Indah
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 active:scale-95"
            aria-label={isPlayingAudio ? "Jeda lagu" : "Putar lagu"}
          >
            {isPlayingAudio ? "⏸" : "▶"}
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-[#1f1f1f]/50 border border-[#3a3a3a] text-[13px] leading-[20px] text-white/90 italic">
          &ldquo;Setiap lagu yang mengalun di sini mengingatkanku pada setiap tawa, obrolan larut malam, dan hangatnya genggaman tanganmu.&rdquo;
        </div>
      </div>
    </div>
  );
}
