"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { siteConfig } from "@/content/site";

export function SecretMessageSheet() {
  const isOpen = useStore((s) => s.isSecretOpen);
  const closeSecret = useStore((s) => s.closeSecret);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pesan Rahasia"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeSecret}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[360px] rounded-2xl bg-[#161823] border border-[#3a3a3a] p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center"
      >
        <span className="text-[36px]">💖</span>
        <h3 className="text-[18px] font-bold text-white">
          Pesan Rahasia Terbuka!
        </h3>
        <p className="text-[14px] leading-[22px] text-white/90 italic">
          &ldquo;Kamu berhasil menemukan sudut rahasia ini! Sejujurnya, membuat website ForUs ini adalah cara kecilku untuk menunjukkan betapa berharganya kamu di hidupku. Selamat ulang tahun, bidadariku {siteConfig.couple.her} ❤️&rdquo;
        </p>
        <button
          type="button"
          onClick={closeSecret}
          className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-[14px] active:scale-95"
        >
          Peluk Virtual 🤗
        </button>
      </div>
    </div>
  );
}
