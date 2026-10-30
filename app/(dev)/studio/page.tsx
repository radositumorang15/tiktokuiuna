"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { defaultSlots, type ContentSlot } from "@/content/slots";
import { type LikeEffect } from "@/content/site";

export default function StudioPage() {
  // Guard: exists only in development
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [slots, setSlots] = useState<ContentSlot[]>(defaultSlots);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("slot-01");

  const selectedSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];

  const updateSelectedSlot = (fields: Partial<ContentSlot>) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === selectedSlotId ? { ...s, ...fields } : s))
    );
  };

  const handleCopyConfig = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(slots, null, 2));
      alert("Konfigurasi slots berhasil disalin ke clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#161823] text-white p-6 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Studio Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3a3a3a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[20px]">🛠️</span>
              <h1 className="text-[22px] font-bold text-white">
                ForUs Content Studio
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary text-white">
                DEV ONLY
              </span>
            </div>
            <p className="text-[13px] text-[#a8a8a8] mt-1">
              Atur urutan slot, caption, efek like, dan pratinjau live tanpa coding.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyConfig}
              className="px-4 py-2 rounded-lg bg-[#1f1f1f] border border-[#3a3a3a] text-white text-[13px] font-semibold hover:border-white transition-colors"
            >
              Salin JSON slots.ts
            </button>
            <a
              href="/feed"
              className="px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              Lihat di Feed 📱
            </a>
          </div>
        </div>

        {/* 2-Column layout: Slot list & editor + 9:16 Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Slot List & Configuration (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Slot selector row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {slots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSlotId(s.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold shrink-0 border transition-colors ${
                    selectedSlotId === s.id
                      ? "border-primary bg-primary text-white"
                      : "border-[#3a3a3a] bg-[#1f1f1f] text-[#a8a8a8] hover:text-white"
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>

            {/* Editor Card */}
            <div className="p-5 rounded-xl bg-[#1f1f1f] border border-[#3a3a3a] space-y-4">
              <h2 className="text-[16px] font-bold text-white border-b border-[#3a3a3a] pb-2">
                Edit {selectedSlot.id} — {selectedSlot.title || "Slot"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-[#a8a8a8] block mb-1">
                    Tipe Slot
                  </label>
                  <select
                    value={selectedSlot.type}
                    onChange={(e) =>
                      updateSelectedSlot({
                        type: e.target.value as ContentSlot["type"],
                      })
                    }
                    className="w-full p-2.5 rounded-lg bg-[#161823] border border-[#3a3a3a] text-white text-[13px]"
                  >
                    <option value="video">video (.mp4)</option>
                    <option value="photo-carousel">photo-carousel (swipe)</option>
                    <option value="photo-slideshow">photo-slideshow (auto-advance)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[#a8a8a8] block mb-1">
                    Gaya Foto (photoStyle)
                  </label>
                  <select
                    value={selectedSlot.photoStyle || "plain"}
                    onChange={(e) =>
                      updateSelectedSlot({
                        photoStyle: e.target.value as ContentSlot["photoStyle"],
                      })
                    }
                    className="w-full p-2.5 rounded-lg bg-[#161823] border border-[#3a3a3a] text-white text-[13px]"
                  >
                    <option value="plain">plain (geser snap)</option>
                    <option value="kenburns">kenburns (slow zoom 6s)</option>
                    <option value="polaroid">polaroid (bingkai putih)</option>
                    <option value="stack">stack (kartu bertumpuk)</option>
                  </select>
                </div>
              </div>

              {/* Title & Caption */}
              <div>
                <label className="text-[12px] font-medium text-[#a8a8a8] block mb-1">
                  Judul Kenangan
                </label>
                <input
                  type="text"
                  value={selectedSlot.title || ""}
                  onChange={(e) => updateSelectedSlot({ title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#161823] border border-[#3a3a3a] text-white text-[13px]"
                />
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#a8a8a8] block mb-1">
                  Caption Video / Foto
                </label>
                <textarea
                  rows={3}
                  value={selectedSlot.caption}
                  onChange={(e) => updateSelectedSlot({ caption: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#161823] border border-[#3a3a3a] text-white text-[13px]"
                />
              </div>

              {/* Like Effect & Sound */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-[#a8a8a8] block mb-1">
                    Efek Like Spesial (onLike)
                  </label>
                  <select
                    value={selectedSlot.onLike?.effect || "confetti"}
                    onChange={(e) =>
                      updateSelectedSlot({
                        onLike: { effect: e.target.value as LikeEffect },
                      })
                    }
                    className="w-full p-2.5 rounded-lg bg-[#161823] border border-[#3a3a3a] text-white text-[13px]"
                  >
                    <option value="hearts-rain">hearts-rain (hujan hati)</option>
                    <option value="confetti">confetti (magenta/cyan/putih)</option>
                    <option value="letter-pop">letter-pop (surat amplop)</option>
                    <option value="photo-reveal">photo-reveal (polaroid jatuh)</option>
                    <option value="glitch-heart">glitch-heart (hati berkedip)</option>
                    <option value="sticker-burst">sticker-burst (stiker cinta)</option>
                    <option value="voice-note">voice-note (pesan suara)</option>
                    <option value="milestone">milestone (hitung hari bersama)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[#a8a8a8] block mb-1">
                    Judul Lagu
                  </label>
                  <input
                    type="text"
                    value={selectedSlot.song.title}
                    onChange={(e) =>
                      updateSelectedSlot({
                        song: { ...selectedSlot.song, title: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-lg bg-[#161823] border border-[#3a3a3a] text-white text-[13px]"
                  />
                </div>
              </div>

              {/* Auto Reply on comment */}
              <div>
                <label className="text-[12px] font-medium text-[#a8a8a8] block mb-1">
                  Balasan Otomatis Komentar Dari Kamu (autoReply)
                </label>
                <input
                  type="text"
                  value={selectedSlot.autoReply?.text || ""}
                  onChange={(e) =>
                    updateSelectedSlot({
                      autoReply: { text: e.target.value, delayMs: 1200 },
                    })
                  }
                  className="w-full p-2.5 rounded-lg bg-[#161823] border border-[#3a3a3a] text-white text-[13px]"
                />
              </div>
            </div>
          </div>

          {/* Right: 9:16 Live Phone Preview (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <span className="text-[12px] font-semibold text-[#a8a8a8] mb-2">
              Pratinjau Live 9:16
            </span>
            <div className="w-[300px] h-[533px] rounded-2xl border-4 border-[#3a3a3a] bg-black overflow-hidden relative shadow-2xl flex flex-col justify-between p-3">
              {/* Fake top bar */}
              <div className="flex items-center justify-between text-[11px] text-[#a8a8a8] z-10">
                <span>Mengikuti</span>
                <span className="text-white font-semibold underline decoration-2 underline-offset-4">
                  Untuk Kita
                </span>
                <span>🔍</span>
              </div>

              {/* Center preview content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-[32px] mb-2">
                  {selectedSlot.type === "video" ? "🎬" : "📸"}
                </span>
                <p className="text-[14px] font-semibold text-white">
                  {selectedSlot.title || selectedSlot.id}
                </p>
                <p className="text-[11px] text-[#a8a8a8] mt-1 line-clamp-3">
                  {selectedSlot.caption}
                </p>
                <span className="mt-3 text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold">
                  Efek: {selectedSlot.onLike?.effect}
                </span>
              </div>

              {/* Fake bottom chrome */}
              <div className="text-[10px] text-white/80 z-10 flex items-center justify-between">
                <span>@{selectedSlot.song.artist}</span>
                <span>🎵 {selectedSlot.song.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
