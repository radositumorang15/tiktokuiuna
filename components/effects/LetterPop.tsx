"use client";

import React, { useEffect } from "react";

interface LetterPopProps {
  payload?: {
    text?: string;
    from?: string;
  };
  onClose: () => void;
}

export function LetterPop({ payload, onClose }: LetterPopProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label="Surat kecil dari hati"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] rounded-xl bg-[#161823] border border-[#3a3a3a] p-5 shadow-2xl relative animate-in zoom-in-95 duration-200"
      >
        {/* Envelope icon header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[20px]">💌</span>
          <h3 className="text-[16px] leading-[22px] font-semibold text-white">
            Surat Kecil Dari Hatiku
          </h3>
        </div>

        {/* Content text */}
        <p className="text-[15px] leading-[22px] font-normal text-white/95 mb-4 italic">
          &ldquo;{payload?.text || "Setiap kali melihat senyummu, aku bersyukur kita saling menemukan. Selamat ulang tahun sayangku ❤️"}&rdquo;
        </p>

        {/* Action button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-primary text-white text-[14px] font-semibold active:opacity-85"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
