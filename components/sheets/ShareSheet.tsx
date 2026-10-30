"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { siteConfig } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { defaultSlots } from "@/content/slots";

export function ShareSheet() {
  const isOpen = useStore((s) => s.isShareOpen);
  const clipId = useStore((s) => s.activeShareClipId);
  const closeShare = useStore((s) => s.closeShare);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !clipId) return null;

  const currentSlot = defaultSlots.find((s) => s.id === clipId);
  const shareText = siteConfig.whatsapp.templates.share.replace(
    "{judul_klip}",
    currentSlot?.caption || "Kenangan Kita"
  );
  const waUrl = getWhatsAppUrl(siteConfig.whatsapp.number, shareText);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bagikan"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={closeShare}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-[16px] bg-[#1f1f1f] border-t border-[#3a3a3a] p-4 pb-8 space-y-5 animate-in slide-in-from-bottom duration-200"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
      >
        {/* Handle */}
        <div className="w-full flex justify-center pb-1">
          <div className="w-[36px] h-[4px] rounded-full bg-[#737373]" />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-white">Bagikan ke</h3>
          <button
            type="button"
            onClick={closeShare}
            aria-label="Tutup"
            className="text-[#a8a8a8] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Avatar recipient row (56px circles: Aku, Kita) */}
        <div>
          <p className="text-[12px] font-medium text-[#a8a8a8] mb-2.5">Kirim pesan cepat</p>
          <div className="flex items-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-[56px] h-[56px] rounded-full border-2 border-primary overflow-hidden bg-primary/20 flex items-center justify-center p-1 group-active:scale-95 transition-transform">
                <img
                  src="/avatars/creator.jpg"
                  alt="Aku"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23fe2c55'/%3E%3C/svg%3E";
                  }}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-[12px] text-white">Aku ({siteConfig.couple.me})</span>
            </a>

            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="w-[56px] h-[56px] rounded-full border border-dashed border-[#737373] flex items-center justify-center text-[20px]">
                🔒
              </div>
              <span className="text-[12px] text-[#737373]">Kita Berdua</span>
            </div>
          </div>
        </div>

        {/* Action row (WhatsApp, Salin tautan, Simpan) */}
        <div className="pt-2 border-t border-[#3a3a3a]">
          <p className="text-[12px] font-medium text-[#a8a8a8] mb-2.5">Aksi lain</p>
          <div className="flex items-center gap-4">
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl bg-[#161823] border border-[#3a3a3a] text-center active:scale-95 transition-transform"
            >
              <span className="text-[24px]">💬</span>
              <span className="text-[12px] font-medium text-white">WhatsApp</span>
            </a>

            {/* Salin Tautan */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl bg-[#161823] border border-[#3a3a3a] text-center active:scale-95 transition-transform"
            >
              <span className="text-[24px]">🔗</span>
              <span className="text-[12px] font-medium text-white">
                {copied ? "Tersalin!" : "Salin Tautan"}
              </span>
            </button>

            {/* Simpan ke galeri info */}
            <button
              type="button"
              onClick={() => alert("Momen ini sudah tersimpan aman di ForUs ❤️")}
              className="flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl bg-[#161823] border border-[#3a3a3a] text-center active:scale-95 transition-transform"
            >
              <span className="text-[24px]">💾</span>
              <span className="text-[12px] font-medium text-white">Simpan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

